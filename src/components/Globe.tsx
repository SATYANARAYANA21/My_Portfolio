'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import — Three.js must NEVER run during SSR.
// This mirrors how the reference site defers the R3F canvas.
const GlobeCanvas = dynamic(
  () => import('./GlobeScene').then((m) => ({ default: m.GlobeCanvas })),
  { ssr: false }
);

export default function Globe() {
  const [mounted, setMounted] = useState(false);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReduced(mq.matches);

    // Defer canvas mount until the browser is idle.
    let cleanup: () => void;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setMounted(true), { timeout: 2500 });
      cleanup = () => { if ('cancelIdleCallback' in window) window.cancelIdleCallback(id); };
    } else {
      const id = globalThis.setTimeout(() => setMounted(true), 1200);
      cleanup = () => clearTimeout(id);
    }
    return cleanup;
  }, []);

  return (
    <section id="globe" className="relative overflow-hidden bg-[#050505] text-[#f4f1ea]">
      <span aria-hidden="true" className="halftone-fade pointer-events-none absolute inset-0 z-10 opacity-[0.05]" />

      {/* ── Header ── */}
      <header className="wrap relative z-20 pt-[var(--section-pad)]">
        <div className="flex items-center justify-between gap-4 border-b border-[#f4f1ea]/15 pb-3">
          <span className="eyebrow flex items-baseline gap-2.5">
            <span className="text-accent">▶</span>
            <span className="tabular-nums">EXP 06</span>
            <span className="font-jp text-step--1 text-accent">球</span>
          </span>
          <span className="eyebrow tabular-nums text-[#f4f1ea]/55">SATYA 400</span>
        </div>

        <div className="mt-7 grid gap-x-[var(--grid-gutter)] gap-y-6 md:grid-cols-12">
          <h2
            aria-label="The Whole Roll"
            className="font-display text-step-5 uppercase leading-[0.85] tracking-tighter2 md:col-span-7"
          >
            The Whole Roll
          </h2>
          <div className="md:col-span-5 md:pt-1.5">
            <p className="max-w-[38ch] text-pretty text-step-0 leading-relaxed text-[#f4f1ea]/60">
              Every project at once, and no order to argue with. This is the whole archive, seen from far enough away to take it in.
            </p>
          </div>
        </div>
      </header>

      {/* ── 3D Canvas Stage ── */}
      <div
        className="relative h-[78vh] min-h-[440px] w-full cursor-grab active:cursor-grabbing"
      >
        {/* Subtle radial illumination behind the globe */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <div className="w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[#f4f1ea]/[0.03] blur-[100px]" />
        </div>

        {/* Halftone grain overlay — z-index above canvas but below interaction */}
        <span aria-hidden="true" className="halftone pointer-events-none absolute inset-0 z-20 opacity-20" />

        {/* Cinematic dark vignette over the edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_40%,#050505_100%)]"
        />

        {/* R3F Canvas — deferred until idle (z-10) */}
        <div className="absolute inset-0 z-10">
          {mounted ? (
            <GlobeCanvas isReduced={isReduced} />
          ) : (
            <span aria-hidden="true" className="halftone pointer-events-none absolute inset-0 opacity-20" />
          )}
        </div>

        {/* "drag to turn the roll ✦" — subtle and elegant */}
        <p className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap font-mono text-step--2 uppercase tracking-ultrawide text-[#f4f1ea]/40">
          {isReduced ? '球 · the whole roll, at once' : 'drag to turn the roll ✦'}
        </p>
      </div>
    </section>
  );
}