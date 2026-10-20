'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion';

// Generate placeholder project items (Contact Sheet style)
const CONTACT_FRAMES = Array.from({ length: 60 }).map((_, i) => ({
  id: `frame-${i}`,
  title: `Build 0${i + 1}`,
  // Some pseudo-random aspect ratios or spans to make the contact sheet feel organic
  span: i % 7 === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1',
}));

export default function Warp() {
  const containerRef = useRef<HTMLElement>(null);
  
  // ─── Scroll Progress ─────────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ['start start', 'end end'] 
  });
  
  // Smooth scroll progress for Y translation
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 80, 
    damping: 25, 
    restDelta: 0.001 
  });

  // ─── Velocity & Bending ("Rush it and it bends") ───────────────────────────
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 250,
    damping: 30,
    restDelta: 0.001
  });
  
  // Map velocity to a skew angle. When scrolling fast, it skews/bends.
  // The faster you scroll, the more it distorts. When you stop, velocity goes to 0 -> skew goes to 0.
  const skew = useTransform(smoothVelocity, [-1, 1], [15, -15]);

  // ─── Transform mapping ───────────────────────────────────────────────────────
  // Move the entire grid up substantially over the 320vh scroll distance
  const gridY = useTransform(smoothProgress, [0, 1], ['5vh', '-250vh']);
  
  // Optional subtle zoom in as you scroll down
  const gridScale = useTransform(smoothProgress, [0, 1], [0.95, 1.05]);

  return (
    <section id="warp" ref={containerRef} className="relative h-[320vh]">
      
      {/* ─── Sticky Viewport ────────────────────────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-paper">
        <span aria-hidden="true" className="halftone-fade pointer-events-none absolute inset-0 z-10 opacity-[0.05]" />
        
        {/* ─── Contact Sheet Grid ───────────────────────────────────────────── */}
        <div className="absolute inset-0 z-0 flex items-start justify-center pt-[15vh] px-[2vw] md:px-0">
          <motion.div 
            className="w-[140vw] md:w-[110vw] max-w-[1800px] origin-top"
            style={{ 
              y: gridY, 
              scale: gridScale,
              skewY: skew,
              rotate: '-3deg'
            }}
          >
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 w-full">
              {CONTACT_FRAMES.map((frame, i) => (
                <div 
                  key={frame.id} 
                  className={`group relative aspect-[3/2] overflow-hidden bg-ink/5 border-[4px] border-paper ${frame.span}`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Local placeholder representing a project screenshot/iteration */}
                  <div className="absolute inset-0 bg-ink/5 grayscale opacity-70 mix-blend-multiply transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0 group-hover:opacity-100 group-hover:bg-transparent group-hover:scale-105">
                    {/* Inner styling mimicking a developed photo or raw build output */}
                    <div className="absolute inset-0 bg-gradient-to-br from-ink/10 to-transparent" />
                    <span aria-hidden="true" className="halftone absolute inset-0 opacity-20" />
                  </div>
                  
                  {/* Border wrapper for tactile "photo frame" feel */}
                  <div className="absolute inset-0 border border-ink/10 transition-colors duration-500 group-hover:border-accent/40" />
                  
                  {/* Hover metadata appearing softly */}
                  <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-t from-paper/90 to-transparent">
                    <span className="block font-mono text-[9px] uppercase tracking-ultrawide text-accent">
                      {frame.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── UI Overlay ───────────────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-paper via-paper/85 to-transparent pb-24 pt-[clamp(4rem,9vw,7rem)]">
          <header className="wrap relative z-10 mb-10">
            <div className="flex items-center justify-between gap-4 border-b border-ink/15 pb-3">
              <span className="eyebrow flex items-baseline gap-2.5">
                <span className="text-accent">▶</span>
                <span className="tabular-nums">EXP 05</span>
                <span className="font-jp text-step--1 text-accent">歪</span>
              </span>
              <span className="eyebrow tabular-nums opacity-55">BUILD 400</span>
            </div>
            
            <div className="mt-7 grid gap-x-[var(--grid-gutter)] gap-y-6 md:grid-cols-12">
              <h2 aria-label="Contact Sheet" className="font-display text-step-5 uppercase leading-[0.85] tracking-tighter2 md:col-span-7">
                Contact Sheet
              </h2>
              <div className="md:col-span-5 md:pt-1.5 pointer-events-auto">
                <p className="max-w-[38ch] text-pretty text-step-0 leading-relaxed text-ink/60">
                  Everything that survived the edit, hung small and in a grid. The projects, iterations, and experiments. Rush it and it bends; stop, and it forgets you were ever in a hurry.
                </p>
                <p className="mt-5 font-mono text-step--2 uppercase tracking-ultrawide text-ink/45">
                  hover a frame to bring its colour back
                </p>
              </div>
            </div>
          </header>
        </div>

        {/* Scroll Instruction */}
        <p className="pointer-events-none absolute inset-x-0 bottom-8 z-20 text-center font-mono text-step--2 uppercase tracking-ultrawide text-ink/40">
          the sheet has no bottom ↓
        </p>
      </div>
      
    </section>
  );
}