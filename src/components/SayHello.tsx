'use client';

import { FormEvent, useRef, useState } from 'react';

// EXP06 contact details stay together here. Only the email shown in the
// supplied reference is configured; profile URLs remain unset until verified.
const CONTACT = {
  email: 'satyanarayana.sanka21@gmail.com',
  github: 'https://github.com/SATYANARAYANA21',
  linkedin: 'https://www.linkedin.com/in/satyanarayana-sanka-ba197a322/',
  instagram: 'https://www.instagram.com/_mr.s.a.t.y.a_/',
  resume: '/models/exp-06/Sanka_Satyanarayana_Resume_21.pdf',
};

const socialLinks = [
  { key: 'github', name: 'GITHUB', detail: 'Explore my work', icon: 'github' },
  { key: 'linkedin', name: 'LINKEDIN', detail: 'Connect professionally', icon: 'linkedin' },
  { key: 'instagram', name: 'INSTAGRAM', detail: 'Photography & more', icon: 'instagram' },
  { key: 'resume', name: 'RESUME', detail: 'View / Download', icon: 'resume' },
] as const;

function ContactIcon({ name, size = 'h-5 w-5' }: { name: string; size?: string }) {
  const common = {
    'aria-hidden': true as const,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: `${size} shrink-0`,
  };

  if (name === 'github') return <svg {...common} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 .7A11.3 11.3 0 0 0 8.4 22.7c.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.3 1.8 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.3-3.1-.1-.3-.6-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.3 2.8.1 3.1.8.8 1.3 1.8 1.3 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.3 11.3 0 0 0 12 .7Z" /></svg>;
  if (name === 'linkedin') return <svg {...common} viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="5.2" r="2.1" /><path d="M3.2 9h3.7v11.8H3.2zM9 9h3.5v1.6c.6-1 1.8-1.9 3.7-1.9 3.9 0 4.6 2.5 4.6 5.8v6.3H17v-5.6c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1v5.7H9z" /></svg>;
  if (name === 'instagram') return <svg {...common} strokeWidth="2.1"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.1" /><path d="M17.5 6.5h.01" strokeWidth="2.8" /></svg>;
  if (name === 'email') return <svg {...common} strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m4 7 8 6 8-6" /></svg>;
  if (name === 'location') return <svg {...common}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
  return <svg {...common} strokeWidth="2"><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>;
}

const contactIconFrameClass = 'relative isolate flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/85 bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(250,242,231,0.72))] text-[#29231f] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(127,94,69,0.06),0_2px_8px_rgba(57,37,24,0.09)] backdrop-blur-sm transition-[transform,box-shadow,color] duration-[250ms] ease-out before:pointer-events-none before:absolute before:inset-[-20%] before:rounded-full before:bg-[radial-gradient(circle,rgba(180,61,48,0.14)_0%,transparent_68%)] before:opacity-0 before:transition-opacity before:duration-[250ms] after:pointer-events-none after:absolute after:inset-0 after:-translate-x-[140%] after:skew-x-[-20deg] after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent after:transition-transform after:duration-[400ms] group-hover:-translate-y-0.5 group-hover:scale-[1.04] group-hover:text-[#ae392e] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_0_10px_rgba(180,61,48,0.12),0_4px_10px_rgba(57,37,24,0.1)] group-hover:before:opacity-100 group-hover:after:translate-x-[140%] group-active:scale-[0.98] group-active:text-[#ae392e] group-active:shadow-[0_0_12px_rgba(180,61,48,0.18)] group-active:before:opacity-100 group-active:after:translate-x-[140%] motion-reduce:transform-none motion-reduce:transition-none';

function Arrow() {
  return <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">↗</span>;
}

export default function SayHello() {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [formNotice, setFormNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionLock = useRef(false);

  async function copyEmail() {
    if (!CONTACT.email) return;
    setCopyFailed(false);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(CONTACT.email);
      } else {
        throw new Error('Clipboard API unavailable');
      }
      setCopied(true);
      setCopyFailed(false);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      try {
        const fallback = document.createElement('textarea');
        fallback.value = CONTACT.email;
        fallback.setAttribute('readonly', '');
        fallback.style.position = 'fixed';
        fallback.style.opacity = '0';
        document.body.appendChild(fallback);
        fallback.select();
        const didCopy = document.execCommand('copy');
        fallback.remove();
        if (!didCopy) throw new Error('Copy command failed');
        setCopied(true);
        setCopyFailed(false);
        window.setTimeout(() => setCopied(false), 1800);
      } catch {
        setCopied(false);
        setCopyFailed(true);
        window.setTimeout(() => setCopyFailed(false), 5000);
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || submissionLock.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const submission = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      subject: String(data.get('subject') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    };

    if (!submission.name || !submission.email || !submission.subject || !submission.message) {
      setFormNotice('Please complete each field before sending.');
      return;
    }

    submissionLock.current = true;
    setIsSubmitting(true);
    setFormNotice('Sending your message…');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok || !result || typeof result !== 'object' || (result as { ok?: unknown }).ok !== true) {
        setFormNotice(response.status === 429
          ? 'Too many messages were sent. Please wait a little and try again.'
          : 'Your message could not be sent right now. Please try again, or email me directly.');
        return;
      }

      form.reset();
      setFormNotice('Message sent. Thank you for reaching out.');
    } catch {
      setFormNotice('Your message could not be sent right now. Please try again, or email me directly.');
    } finally {
      submissionLock.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="say-hello"
      className="relative isolate min-h-screen min-h-[100svh] w-full overflow-hidden bg-[#eee2d4] text-[#241d19]"
    >
      <img
        src="/models/exp-06/exp-06-background.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        draggable={false}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#f5eee5]/35 via-transparent to-[#261b17]/10" />

      <div className="mx-auto flex min-h-[100svh] w-full max-w-none flex-col px-5 pb-5 pt-24 sm:px-8 sm:pt-28 lg:px-[11vw] lg:pb-4 lg:pt-20">
        <div className="grid flex-1 content-center gap-8 xl:grid-cols-[minmax(0,clamp(480px,36vw,690px))_minmax(480px,clamp(480px,31vw,520px))] xl:items-center xl:gap-[3vw]">
          <div className="max-w-[480px] xl:justify-self-start xl:ml-[clamp(20px,2vw,30px)] [@media(min-width:1280px)_and_(max-width:1365px)]:ml-0">
            <div className="mb-3 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#8d3027] sm:text-sm">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#b43d30]" />
              <span>LET&apos;S CONNECT</span>
              <span className="ml-1 border border-[#a74437]/40 px-1.5 py-1 text-[10px] tracking-widest">話</span>
            </div>

            <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#4e4038]/80">EXP 06 / CONTACT</p>
            <h1 className="font-serif text-[clamp(3.15rem,6vw,6.25rem)] font-medium uppercase leading-[0.91] tracking-[-0.045em] text-[#241d19] max-[480px]:text-[clamp(2.45rem,10.8vw,3.15rem)] xl:text-[clamp(2.35rem,4vw,4.2rem)] xl:leading-[0.85]">
              LET&apos;S BUILD<br />SOMETHING<br /><span className="text-[#9c392f]">MEANINGFUL.</span>
            </h1>
            <p className="mt-3 max-w-[27rem] text-base font-medium leading-[1.45] text-[#1f1916] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] sm:text-lg xl:text-[15px] xl:font-semibold">
              Have an idea, opportunity, collaboration, or just want to talk technology? I&apos;d love to hear from you.
            </p>

            <div className="mt-4 grid max-w-[480px] grid-cols-1 gap-2 sm:grid-cols-2">
              {socialLinks.map((item) => {
                const href = CONTACT[item.key];
                const cardClass = 'group relative isolate flex min-h-[48px] items-center gap-2 overflow-hidden rounded-lg border border-white/70 bg-[#fffaf4]/85 px-2.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_24px_rgba(57,37,24,0.08)] backdrop-blur-sm transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out before:pointer-events-none before:absolute before:inset-y-0 before:left-[-40%] before:w-1/3 before:-skew-x-12 before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent before:opacity-0 before:transition-all before:duration-500 hover:scale-[1.01] hover:-translate-y-0.5 hover:border-[#a74437]/70 hover:bg-[#fffaf4]/95 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_28px_rgba(57,37,24,0.12)] hover:before:left-[120%] hover:before:opacity-100 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a74437] motion-reduce:transform-none motion-reduce:transition-none';
                const content = <><span className={contactIconFrameClass}><ContactIcon name={item.icon} size="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block font-mono text-[10px] font-bold tracking-[0.14em] text-[#302721]">{item.name}</span><span className="mt-0.5 block text-[11px] text-[#51433a]">{item.detail}</span></span><span className="font-mono text-xs text-[#8f3a30]">{href ? <Arrow /> : ''}</span></>;

                return href ? (
                  <a key={item.key} href={href} target="_blank" rel="noopener noreferrer" aria-label={item.key === 'resume' ? 'Open resume PDF in a new tab' : `Visit ${item.name.toLowerCase()} profile in a new tab`} className={cardClass}>{content}</a>
                ) : (
                  <div key={item.key} aria-disabled="true" title="Profile link not configured" className={`${cardClass} cursor-default hover:translate-y-0 hover:border-white/65 hover:bg-[#fffaf4]/80`}>
                    {content}
                  </div>
                );
              })}
            </div>

            <button type="button" onClick={copyEmail} disabled={!CONTACT.email} aria-label={copied ? 'Email copied to clipboard' : copyFailed ? 'Copy failed; select the visible email address to copy it' : 'Copy email address'} className="group mt-2 flex max-w-[480px] w-full items-center gap-2.5 rounded-lg border border-white/70 bg-[#fffaf4]/85 px-2.5 py-1.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_24px_rgba(57,37,24,0.08)] backdrop-blur-sm transition-[transform,box-shadow,border-color,background-color] duration-[250ms] hover:-translate-y-0.5 hover:border-[#a74437]/50 hover:bg-[#fffaf4]/95 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_24px_rgba(57,37,24,0.12)] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a74437] disabled:cursor-not-allowed disabled:opacity-60">
              <span className={contactIconFrameClass}><ContactIcon name="email" size="h-5 w-5" /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[10px] font-bold tracking-[0.17em] text-[#8f3a30]">DIRECT CONTACT</span>
                <span className="mt-1 block truncate text-xs font-medium text-[#302721]">{CONTACT.email || 'Email address not configured'}</span>
              </span>
              <span aria-hidden="true" className="border-l border-[#5c4536]/20 pl-4 font-mono text-[11px] font-bold tracking-[0.12em] text-[#8f3a30]">{copied ? 'COPIED' : copyFailed ? 'SELECT EMAIL' : 'COPY'}</span>
              <span role="status" aria-live="polite" className="sr-only">{copied ? 'Email copied to clipboard.' : copyFailed ? 'Copy failed. The email address remains visible for manual copying.' : ''}</span>
            </button>

            <div className="group mt-3 flex max-w-[480px] flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg border border-white/70 bg-[#fffaf4]/70 px-2.5 py-1.5 text-[#302721] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_24px_rgba(57,37,24,0.08)] backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#a74437]" />
                <div>
                  <p className="font-mono text-[10px] font-bold tracking-[0.17em] text-[#8f3a30] sm:text-[11px]">CURRENTLY OPEN TO</p>
                  <p className="mt-1 max-w-[590px] text-xs font-semibold leading-relaxed tracking-[0.07em] sm:text-sm xl:text-xs">INTERNSHIPS · SOFTWARE ROLES · COLLABORATIONS · HACKATHONS</p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-l border-[#5c4536]/30 pl-4 text-sm text-[#302721] xl:text-xs">
                <span className={contactIconFrameClass}><ContactIcon name="location" size="h-5 w-5" /></span>
                <span>Based in India<br /><span className="text-xs text-[#51433a]">IST (UTC+5:30)</span></span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[520px] justify-self-start">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-white/40 bg-[#342821]/80 p-5 text-[#fffaf4] shadow-[0_24px_70px_rgba(25,16,12,0.28)] backdrop-blur-md sm:p-7 lg:p-6">
              <div className="mb-4 flex items-center justify-between border-b border-white/20 pb-3">
                <h2 className="flex items-center gap-2 font-mono text-xs font-bold tracking-[0.16em] sm:text-sm"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#d45a49]" />SEND A MESSAGE</h2>
                <span className="font-mono text-[10px] tracking-[0.16em] text-[#ead9c8]/75">/ 06</span>
              </div>

              <div className="grid gap-3">
                <label className="grid gap-1.5">
                  <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#f3d7c6]">YOUR NAME</span>
                  <input name="name" autoComplete="name" required maxLength={120} placeholder="Enter your name" className="min-h-11 w-full border border-white/25 bg-white/[0.09] px-3.5 py-2.5 text-sm text-white placeholder:text-[#f7f0e7]/65 outline-none transition focus:border-[#e27868] focus:bg-white/[0.13] focus:ring-2 focus:ring-[#e27868]/35" />
                </label>
                <label className="grid gap-1.5">
                  <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#f3d7c6]">YOUR EMAIL</span>
                  <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@email.com" className="min-h-11 w-full border border-white/25 bg-white/[0.09] px-3.5 py-2.5 text-sm text-white placeholder:text-[#f7f0e7]/65 outline-none transition focus:border-[#e27868] focus:bg-white/[0.13] focus:ring-2 focus:ring-[#e27868]/35" />
                </label>
                <label className="grid gap-1.5">
                  <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#f3d7c6]">SUBJECT</span>
                  <select name="subject" required defaultValue="" className="min-h-11 w-full border border-white/30 bg-[#30251f] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-[#e27868] focus:ring-2 focus:ring-[#e27868]/35">
                    <option value="" disabled>What would you like to discuss?</option>
                    <option>Internship or software role</option>
                    <option>Project collaboration</option>
                    <option>Hackathon</option>
                    <option>Technology conversation</option>
                    <option>Something else</option>
                  </select>
                </label>
                <label className="grid gap-1.5">
                  <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#f3d7c6]">MESSAGE</span>
                  <textarea name="message" required maxLength={5000} rows={3} placeholder="Write your message..." className="min-h-24 w-full resize-y border border-white/25 bg-white/[0.09] px-3.5 py-2.5 text-sm leading-relaxed text-white placeholder:text-[#f7f0e7]/65 outline-none transition focus:border-[#e27868] focus:bg-white/[0.13] focus:ring-2 focus:ring-[#e27868]/35" />
                </label>
              </div>

              <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="group mt-4 flex min-h-12 w-full items-center justify-between bg-[#a33d32] px-4 font-mono text-xs font-bold tracking-[0.14em] text-white transition hover:bg-[#b94a3d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0b4a9] disabled:cursor-wait disabled:opacity-85 motion-reduce:transition-none">
                <span>{isSubmitting ? '→ SENDING…' : '→ SEND MESSAGE'}</span><span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">↗</span>
              </button>
              <p role="status" aria-live="polite" aria-atomic="true" className="mt-2 min-h-5 text-xs leading-relaxed text-[#f7e4d8]">{formNotice}</p>
            </form>
          </div>
        </div>

        <footer className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[#493a30]/25 pt-3 font-mono text-[10px] font-bold tracking-[0.13em] text-[#40342d]/80 sm:text-[11px]">
          <span>THANK YOU FOR EXPLORING. <span className="text-[#8f3a30]">— SATYA</span></span>
          <span>PORTFOLIO / 2026</span>
        </footer>
      </div>
    </section>
  );
}
