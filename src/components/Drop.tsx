'use client';

import { useRef } from 'react';
import Exp01DarkSoulsSword from '@/components/Exp01DarkSoulsSword';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function Drop() {
  const containerRef = useRef<HTMLElement>(null);

  // Track the scroll of this section relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'], // 0: top of section hits bottom of viewport, 1: bottom of section hits top of viewport
  });

  // Smooth the scroll for cinematic weight
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  // ─── Animation Choreography ──────────────────────────────────────────────────
  
  // 1. Drop from above
  // At 0 (entering from bottom), the object is suspended high above.
  // By 0.4 (section centered), it has dropped into place.
  // By 1 (leaving top), it slowly drifts up.
  const y = useTransform(smoothProgress, [0, 0.4, 1], ['-60vh', '0vh', '-10vh']);
  
  // 2. 3D Tumbling
  // The object spins through 3D space as it drops and scrolls past.
  const rotateX = useTransform(smoothProgress, [0, 1], [45, -15]);
  const rotateY = useTransform(smoothProgress, [0, 1], [-60, 30]);
  const rotateZ = useTransform(smoothProgress, [0, 1], [-45, 10]);
  
  // 3. Depth / Scale
  // It starts smaller (far away), scales up as it impacts the center, and scales down slightly as it leaves.
  const scale = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0.6, 1.1, 1, 0.9]);
  
  // 4. Fade in
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // 5. Header fade-in (delayed slightly relative to the section entering)
  const headerOpacity = useTransform(smoothProgress, [0.1, 0.3], [0, 1]);
  const headerY = useTransform(smoothProgress, [0.1, 0.3], [30, 0]);

  return (
    <section id="drop" ref={containerRef} className="ground-dark relative overflow-hidden flex flex-col justify-center min-h-[100svh]">
      <span aria-hidden="true" className="halftone-fade pointer-events-none absolute inset-0 z-10 opacity-[0.06]" />

      {/* ─── Cinematic Golden Bird Flight ──────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 16 }}
        aria-hidden="true"
      >
        <style>{`
          @media (prefers-reduced-motion: no-preference) {

            /* ── Primary flight path (unchanged) ── */
            @keyframes satya-bird-fly {
              0%   { transform: translate(0, 0);           opacity: 0; }
              7%   { opacity: var(--bird-o, 0.82); }
              84%  { opacity: var(--bird-o, 0.82); }
              100% { transform: translate(108vw, -70vh);   opacity: 0; }
            }

            /* ── Left-wing flap: rotates gently around wing root ── */
            @keyframes satya-lwing {
              0%   { transform: rotate(0deg)   scaleY(1);    }
              30%  { transform: rotate(-12deg) scaleY(0.85); }
              60%  { transform: rotate(4deg)   scaleY(0.95); }
              100% { transform: rotate(0deg)   scaleY(1);    }
            }
            /* ── Right-wing: slight phase offset ── */
            @keyframes satya-rwing {
              0%   { transform: rotate(0deg)   scaleY(1);    }
              30%  { transform: rotate(12deg)  scaleY(0.85); }
              60%  { transform: rotate(-4deg)  scaleY(0.95); }
              100% { transform: rotate(0deg)   scaleY(1);    }
            }

            /* ── Particle: drift slightly up-right and fade ── */
            @keyframes satya-ptcl {
              0%   { transform: translate(0,0);                          opacity: var(--pt-o,0.7); }
              100% { transform: translate(var(--pt-dx,8px), var(--pt-dy,-10px)); opacity: 0; }
            }

            /* ── Bird container ── */
            .satya-bird {
              position: absolute;
              animation: satya-bird-fly var(--bird-dur, 19s) cubic-bezier(0.3,0.5,0.6,0.95) var(--bird-delay, 0s) infinite;
            }

            /* ── Wing elements ── */
            .satya-lw {
              transform-origin: 100% 50%;
              animation: satya-lwing var(--bird-wb, 1.4s) ease-in-out var(--bird-wbd, 0s) infinite;
            }
            .satya-rw {
              transform-origin: 0% 50%;
              animation: satya-rwing var(--bird-wb, 1.4s) ease-in-out calc(var(--bird-wbd, 0s) + 0.07s) infinite;
            }

            /* ── Particle dots ── */
            .satya-ptcl {
              position: absolute;
              border-radius: 50%;
              animation: satya-ptcl var(--pt-dur, 1.8s) ease-out var(--pt-delay, 0s) infinite;
            }
          }
        `}</style>

        {/*
          6 birds — varied size, opacity, speed, delay.
          Silhouette: two organic curved wings (separate SVG paths with individual rotation)
          plus a tiny ellipse body, rendered at small sizes to feel like distant birds.
          Particles: 3 tiny dots per bird, staggered, drifting behind the wing area.
        */}
        {([
          // [top%,  left%,  W,  H,   a,    gr,  dur,   delay,   wb,      wbd,    rot  ]
          ['74%', '-1%',  32, 14, 0.92,  6,  '18s', '0s',    '1.30s', '0.00s',  -4 ],
          ['70%',  '0%',  23, 10, 0.64,  3,  '20s', '2.60s', '1.60s', '0.40s',  -2 ],
          ['78%',  '1%',  28, 12, 0.78,  5,  '17s', '1.30s', '1.40s', '0.20s',  -5 ],
          ['66%', '-1%',  18,  8, 0.50,  2,  '22s', '5.20s', '1.80s', '0.70s',  -3 ],
          ['76%',  '0%',  25, 11, 0.68,  4,  '19s', '3.90s', '1.50s', '0.30s',  -4 ],
          ['72%',  '2%',  20,  9, 0.56,  2,  '21s', '6.80s', '1.70s', '0.55s',  -2 ],
        ] as const).map(([top, left, W, H, a, gr, dur, delay, wb, wbd, rot], i) => {
          const cx = W / 2;            // horizontal centre (body x)
          const cy = H * 0.52;         // vertical centre (body y, slightly below mid)
          const gold = `rgba(224,193,118,${a})`;
          const goldDim = `rgba(224,193,118,${(a * 0.55).toFixed(2)})`;
          // Wing paths — left wing sweeps from body-centre to left tip, right mirrors it
          // Left wing: starts at body centre, curves up then swoops to left tip
          const lwPath = `M${cx},${cy} C${cx-2},${cy-H*0.45} ${cx-W*0.28},${cy-H*0.55} ${cx-W*0.5+1},${cy+H*0.1}`;
          // Right wing: mirror
          const rwPath = `M${cx},${cy} C${cx+2},${cy-H*0.45} ${cx+W*0.28},${cy-H*0.55} ${cx+W*0.5-1},${cy+H*0.1}`;

          return (
            <div
              key={i}
              className="satya-bird"
              style={{
                top, left,
                '--bird-dur': dur,
                '--bird-delay': delay,
                '--bird-o': a,
                '--bird-wb': wb,
                '--bird-wbd': wbd,
              } as React.CSSProperties}
            >
              {/* ── Bird silhouette SVG ── */}
              <svg
                viewBox={`0 0 ${W} ${H}`}
                width={W}
                height={H}
                fill="none"
                style={{
                  filter: `drop-shadow(0 0 ${gr}px rgba(210,175,90,0.75))`,
                  transform: `rotate(${rot}deg)`,
                  overflow: 'visible',
                }}
              >
                {/* Left wing — animated separately */}
                <path
                  className="satya-lw"
                  d={lwPath}
                  stroke={gold}
                  strokeWidth={a > 0.75 ? 1.4 : 1.1}
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Right wing — animated separately with tiny phase offset */}
                <path
                  className="satya-rw"
                  d={rwPath}
                  stroke={gold}
                  strokeWidth={a > 0.75 ? 1.4 : 1.1}
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Tiny body ellipse */}
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={W * 0.055}
                  ry={H * 0.13}
                  fill={gold}
                />
                {/* Subtle head suggestion */}
                <circle
                  cx={cx + W * 0.075}
                  cy={cy - H * 0.18}
                  r={W * 0.04}
                  fill={goldDim}
                />
              </svg>

              {/* ── Particle trail: 3 tiny dots offset behind the bird ── */}
              {([
                { dx: '-6px', dy:  '2px', size: a > 0.7 ? 2 : 1.5, o: a * 0.55, ptDur: '2.0s', ptDelay: '0.3s'  },
                { dx: '-11px', dy: '4px', size: a > 0.7 ? 1.5 : 1, o: a * 0.40, ptDur: '1.7s', ptDelay: '0.65s' },
                { dx: '-8px',  dy: '5px', size: 1,                  o: a * 0.30, ptDur: '2.3s', ptDelay: '0.9s'  },
              ]).map((p, j) => (
                <div
                  key={j}
                  className="satya-ptcl"
                  style={{
                    width:  p.size,
                    height: p.size,
                    top:  `calc(50% + ${p.dy})`,
                    left: `calc(50% + ${p.dx})`,
                    background: `rgba(220,185,105,${p.o})`,
                    boxShadow: `0 0 ${Math.ceil(p.size + 1)}px rgba(210,175,90,${p.o * 0.8})`,
                    '--pt-o': p.o,
                    '--pt-dx': '-8px',
                    '--pt-dy': '-6px',
                    '--pt-dur': p.ptDur,
                    '--pt-delay': `calc(var(--bird-delay) + ${p.ptDelay})`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* ─── Header ───────────────────────────────────────────────────────────── */}
      <motion.header 
        style={{ opacity: headerOpacity, y: headerY }}
        className="wrap relative z-20 pt-[var(--section-pad)]"
      >
        {/* ─── Thin rule — EXP number lives in the FilmLine below this section ─── */}
        <div className="border-b border-ink/15 pb-3" />
        
        <div className="mt-7 grid gap-x-[var(--grid-gutter)] gap-y-6 md:grid-cols-12">
          {/* Portfolio adaptation: "The Engine" -> "ABOUT / SATYA" */}
          <h2 aria-label="ABOUT / SATYA" className="font-display text-step-5 uppercase leading-[0.85] tracking-tighter2 md:col-span-7">
            ABOUT / SATYA
          </h2>
          <div className="md:col-span-5 md:pt-1.5">
            <p className="max-w-[38ch] text-pretty text-step-0 leading-relaxed text-ink/60">
              Curiosity is where I begin — asking how things work, then building until I find an answer worth keeping.
            </p>
          </div>
        </div>
      </motion.header>

      {/* ─── 3D Object Canvas Area ────────────────────────────────────────────── */}
      <div 
        className="relative flex-1 min-h-[520px] w-full"
        style={{ perspective: '1200px' }}
      >
        <Exp01DarkSoulsSword />
        
        {/* LEFT INFORMATION (Desktop) */}
        <div className="absolute left-6 md:left-[8%] xl:left-[12%] top-1/2 -translate-y-1/2 z-0 hidden md:flex flex-col gap-6 text-left max-w-[280px]">
          <div>
            <p className="font-display text-step-2 uppercase leading-none tracking-tightest text-ink">
              Computer Science<br />Builder<br />AI Explorer
            </p>
          </div>
          
          <div className="font-sans text-step--1 text-ink/70 leading-relaxed">
            <p>B.Tech CSE</p>
            <p>Raghu Engineering College</p>
            <p>2023 — 2027</p>
          </div>
          
          <p className="font-sans text-step-0 text-ink/90 leading-relaxed text-pretty">
            I build software, explore AI,<br />
            and turn ideas into useful things.
          </p>
        </div>

        {/*
          Frame centering layer:
          Fills the canvas top → bottom minus 140px reserved for the bottom text block.
          This ensures the frame is centered in the UPPER portion, fully visible top & bottom,
          without touching the absolute bottom text.
          The motion.div's y/rotate/scale transforms operate normally within this layer.
        */}
        <div className="absolute inset-x-0 top-0 bottom-[140px] flex items-center justify-center">
          <motion.div
            className="relative z-10 h-[260px] w-[195px] pointer-events-none md:h-[420px] md:w-[320px]"
            style={{
              y,
              rotateX,
              rotateY,
              rotateZ,
              scale,
              opacity,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Central Rectangular Photo Frame */}
            <div 
              className="absolute inset-0 bg-ink overflow-hidden"
              style={{ 
                backfaceVisibility: 'hidden',
                border: '1px solid rgba(230, 205, 145, 0.85)',
                boxShadow: '0 0 12px 1px rgba(197, 160, 90, 0.4), inset 0 0 6px rgba(197, 160, 90, 0.15), 0 30px 80px rgba(0,0,0,0.8)'
              }}
            >
              <img 
                src="/images/about-satya.jpeg" 
                alt="Sanka Satyanarayana" 
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-90"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Fallback gradient if image fails */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#1a1a1a] to-[#0a0a0a] -z-10" />
              <span aria-hidden="true" className="halftone absolute inset-0 opacity-40 mix-blend-overlay" />
            </div>

            {/* 3D Backface for realism during tumbling */}
            <div 
              className="absolute inset-0 bg-[#080808] border border-paper/5"
              style={{ 
                transform: 'rotateY(180deg) translateZ(1px)',
                backfaceVisibility: 'hidden' 
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-jp text-[4rem] text-paper/5">落</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM TEXT AND LOCATION */}
        <div className="absolute bottom-8 inset-x-0 z-20 flex flex-col items-center gap-2 pb-20 text-center pointer-events-none px-6 md:pb-0">
          <p className="font-mono text-step--2 uppercase tracking-ultrawide text-ink/45">
            落 · SANKA SATYANARAYANA
          </p>
          <p className="font-mono text-[9px] uppercase tracking-ultrawide text-ink/40 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent/70 animate-pulse" />
            Based in Vizianagaram, Andhra Pradesh, India
          </p>
          
          {/* MOBILE ONLY: Left Information mirrored for small screens where it's hidden */}
          <div className="md:hidden flex flex-col items-center gap-1 mt-3 text-ink/60 font-sans text-step--1">
             <p className="text-ink">Computer Science · Builder · AI Explorer</p>
             <p className="text-[11px]">B.Tech CSE · Raghu Engineering College · 2023—2027</p>
             <p className="max-w-[34ch] text-[11px] leading-relaxed">I build software, explore AI, and turn ideas into useful things.</p>
          </div>
        </div>
        
      </div>
    </section>
  );
}
