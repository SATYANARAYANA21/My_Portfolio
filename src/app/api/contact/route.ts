import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUEST_BYTES = 12 * 1024;
const ALLOWED_SUBJECTS = new Set([
  'Internship or software role',
  'Project collaboration',
  'Hackathon',
  'Technology conversation',
  'Something else',
]);

type RateEntry = { count: number; resetAt: number };
const rateByClient = new Map<string, RateEntry>();

function jsonError(error: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ ok: false, error }, { status, headers });
}

function clientKey(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const address = request.headers.get('x-real-ip') || forwardedFor?.split(',')[0]?.trim();
  return address || 'unknown-client';
}

function consumeRateLimit(key: string, now: number) {
  if (rateByClient.size > 5000) {
    rateByClient.forEach((entry, client) => {
      if (entry.resetAt <= now) rateByClient.delete(client);
    });
  }

  const current = rateByClient.get(key);
  if (!current || current.resetAt <= now) {
    rateByClient.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= RATE_LIMIT) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }

  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function isEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isSender(value: string) {
  if (value.length > 320 || /[\r\n]/.test(value)) return false;
  const match = value.match(/^(?:[^<>]*<([^<>]+)>|([^<>]+))$/);
  return !!match && isEmail((match[1] || match[2] || '').trim());
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_REQUEST_BYTES) return jsonError('request_too_large', 413);

  const limit = consumeRateLimit(clientKey(request), Date.now());
  if (!limit.allowed) {
    return jsonError('rate_limited', 429, { 'Retry-After': String(limit.retryAfter) });
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_REQUEST_BYTES) return jsonError('request_too_large', 413);
    body = JSON.parse(rawBody);
  } catch {
    return jsonError('invalid_request', 400);
  }

  if (!body || typeof body !== 'object') return jsonError('invalid_request', 400);
  const fields = body as Record<string, unknown>;
  const name = typeof fields.name === 'string' ? fields.name.trim() : '';
  const email = typeof fields.email === 'string' ? fields.email.trim().toLowerCase() : '';
  const subject = typeof fields.subject === 'string' ? fields.subject.trim() : '';
  const message = typeof fields.message === 'string' ? fields.message.replace(/\0/g, '').trim() : '';

  if (!name || name.length > 120 || /[\r\n\0]/.test(name)) return jsonError('invalid_name', 400);
  if (!isEmail(email)) return jsonError('invalid_email', 400);
  if (!ALLOWED_SUBJECTS.has(subject)) return jsonError('invalid_subject', 400);
  if (!message || message.length > 5000) return jsonError('invalid_message', 400);

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!apiKey || !from || !to || !isSender(from) || !isEmail(to)) {
    return jsonError('delivery_unavailable', 503);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio contact: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      }),
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!response.ok) return jsonError('delivery_failed', 502);
    const result: unknown = await response.json().catch(() => null);
    if (!result || typeof result !== 'object' || typeof (result as { id?: unknown }).id !== 'string') {
      return jsonError('delivery_failed', 502);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return jsonError(controller.signal.aborted ? 'delivery_timeout' : 'delivery_failed', controller.signal.aborted ? 504 : 502);
  } finally {
    clearTimeout(timeout);
  }
}
