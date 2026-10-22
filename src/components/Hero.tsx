"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamic import — Three.js must not run during SSR
const LaptopCanvas = dynamic(() => import("./LaptopScene"), { ssr: false });

// ─── Cursor photo trail images ────────────────────────────────────────────────
const TRAIL_IMAGES = [
  "/frames/image-1.jpeg",
  "/frames/image-2.jpeg",
  "/frames/image-3.jpeg",
  "/frames/image-4.jpeg",
  "/frames/image-5.jpeg",
  "/frames/image-6.jpeg",
  "/frames/image-7.jpeg",
  "/frames/image-8.jpeg",
  "/frames/image-9.png",
  "/frames/image-10.jpeg",
  "/frames/image-11.jpeg",
  "/frames/image-12.jpeg",
  "/frames/image-13.png",
  "/frames/image-14.png",
];

const COUNT = 14;

/**
 * FloatingPhotoTrail — UNCHANGED from original.
 * Exact replica of the reference site's cursor interaction.
 */
function FloatingPhotoTrail({ images }: { images: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const section = container?.parentElement;
    if (!container || !section) return;

    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(container.children) as HTMLElement[];
    let nextIndex = 0;
    let lastX = 0;
    let lastY = 0;
    let hasFirst = false;

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (!hasFirst) {
        lastX = x;
        lastY = y;
        hasFirst = true;
        return;
      }
      if (Math.hypot(x - lastX, y - lastY) < 55) return;

      lastX = x;
      lastY = y;

      const el = items[nextIndex];
      nextIndex = (nextIndex + 1) % items.length;

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      const angle = Math.random() * 32 - 16;
      el.animate(
        [
          { transform: `translate(-50%, -50%) scale(0.5) rotate(${angle}deg) translateY(0px)`, opacity: 0, offset: 0 },
          { transform: `translate(-50%, -50%) scale(0.75) rotate(${angle}deg) translateY(5px)`, opacity: 1, offset: 0.2 },
          { transform: `translate(-50%, -50%) scale(0.95) rotate(${angle}deg) translateY(15px)`, opacity: 1, offset: 0.6 },
          { transform: `translate(-50%, -50%) scale(1) rotate(${angle}deg) translateY(22px)`, opacity: 0, offset: 1 },
        ],
        {
          duration: 900,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        }
      );
    };

    section.addEventListener("pointermove", onMove);
    return () => section.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      {Array.from({ length: COUNT }).map((_, i) => (
        <img
          key={i}
          src={images[i % images.length]}
          alt=""
          className="absolute h-40 w-32 -translate-x-1/2 -translate-y-1/2 object-cover opacity-0 shadow-2xl ring-1 ring-ink/10 will-change-transform"
          style={{ left: 0, top: 0 }}
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const syncCompactLayout = () => setIsCompact(query.matches);
    syncCompactLayout();
    query.addEventListener("change", syncCompactLayout);
    return () => query.removeEventListener("change", syncCompactLayout);
  }, []);

  return (
    // ── SECTION: unchanged class, unchanged spacing ──────────────────────────
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-10 pt-24 lg:pb-16 lg:pt-28">
      <span aria-hidden="true" className="halftone-fade pointer-events-none absolute inset-0 z-10 opacity-[0.06]" />

      {/* Floating photo trail — exact reference cursor interaction, UNCHANGED */}
      <FloatingPhotoTrail images={TRAIL_IMAGES} />

      {/* Vertical Japanese type — UNCHANGED position/style */}
      <span aria-hidden="true" className="tategaki absolute right-8 top-28 z-30 hidden font-jp text-step-4 text-accent/80 lg:block">光影</span>

      {/* Animated pop-in labels — UNCHANGED */}
      {(["EXPLORE", "CREATE", "光", "BUILD"] as const).map((word, i) => {
        const positions = [
          { top: "20%", right: "12%" },
          { bottom: "26%", right: "20%" },
          { top: "34%", right: "30%" },
          { bottom: "18%", left: "46%" },
        ];
        const rotations = [-8, 6, -10, 4];
        return (
          <motion.span
            key={word}
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.4, rotate: -12 }}
            animate={mounted ? { opacity: 1, scale: 1, rotate: rotations[i] } : { opacity: 0, scale: 0.4, rotate: -12 }}
            transition={{ delay: 1.1 + 0.22 * i, type: "spring", stiffness: 200, damping: 10 }}
            className="pointer-events-none absolute z-30 hidden font-comic text-step-3 text-accent drop-shadow-[2px_2px_0_rgb(var(--ink))] lg:block"
            style={positions[i]}
          >
            {word}
          </motion.span>
        );
      })}

      {/* ── MAIN CONTENT ROW: left text + right laptop ── */}
      <div className="wrap relative z-30 flex flex-col lg:flex-row lg:items-center lg:gap-0">

        {/* ── LEFT: Text content — same layout/spacing/classes as original ── */}
        <div className="pointer-events-none flex-1">

          {/* Eyebrow — same class as original, updated text */}
          <motion.p
            className="eyebrow flex items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 16 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Vizianagaram, IN
          </motion.p>

          {/* Giant display headline — same class as original, name forced to one line */}
          <div className="relative mt-4 w-fit overflow-hidden lg:mt-6">
            <h1
              className="select-none font-display text-[clamp(1.7rem,8.8vw,3rem)] uppercase leading-[0.82] tracking-tightest whitespace-nowrap lg:text-[clamp(2.8rem,8.5vw,9rem)]"
            >
              {mounted ? (
                <span className="chromatic-strong block animate-word-rise">S. SATYANARAYANA</span>
              ) : (
                <span className="opacity-0 block">S. SATYANARAYANA</span>
              )}
            </h1>
            {mounted && (
              <>
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 bg-ink animate-curtain-l" style={{ animationDelay: '0.15s' }} />
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/2 bg-ink animate-curtain-r" style={{ animationDelay: '0.15s' }} />
              </>
            )}
          </div>

          {/* Mobile-only laptop placement: keep the existing 3D scene in the flow. */}
          {isCompact && (
            <div className="pointer-events-auto relative mx-auto mt-3 h-[clamp(170px,52vw,225px)] w-full max-w-[34rem]">
              {mounted && <LaptopCanvas />}
            </div>
          )}

          {/* Keep the established red words visible on mobile without their desktop floats. */}
          <div aria-hidden="true" className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-comic text-[clamp(0.72rem,3.2vw,0.9rem)] uppercase tracking-[0.08em] text-accent lg:hidden">
            <span className="-rotate-3">BUILD</span>
            <span className="rotate-2">CREATE</span>
            <span className="-rotate-2">EXPLORE</span>
            <span className="font-jp text-[0.9em]">光影</span>
          </div>

          {/* Body copy — same class/layout as original, updated content */}
          <motion.div
            className="mt-5 flex max-w-xl flex-col gap-3 lg:mt-8 lg:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Identity tag */}
            <p className="font-mono text-[11px] uppercase tracking-ultrawide text-ink/50">
              Computer Science · Builder · AI Explorer
            </p>

            {/* Main statement */}
            <p className="text-step-1 text-ink/70">
              <span className="font-medium text-ink">I turn curious ideas</span> into things you can actually use.
            </p>

            {/* Supporting line */}
            <p className="font-mono text-[11px] uppercase tracking-ultrawide text-ink/40">
              Software · AI · Data · Experiments
            </p>

            {/* Buttons — identical classes as original, updated labels */}
            <div className="pointer-events-auto flex flex-wrap items-center gap-3 lg:gap-4">
              <div>
                <a href="#series" className="inline-flex h-12 items-center gap-2 bg-ink px-6 font-mono text-[10px] uppercase tracking-[0.16em] text-paper transition-colors hover:bg-accent lg:h-14 lg:px-8 lg:text-[11px] lg:tracking-ultrawide">
                  See the archive →
                </a>
              </div>
              <a href="#say-hello" className="inline-flex min-h-11 items-center px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/60 transition-colors hover:text-accent lg:text-[11px] lg:tracking-ultrawide">
                Say hello
              </a>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: 3D Laptop — absolutely positioned within the row ── */}
        <motion.div
          className={`pointer-events-auto relative hidden lg:flex lg:flex-shrink-0 ${isCompact ? "!hidden" : ""}`}
          style={{ width: '50vw', height: '65vh', maxWidth: '800px', minHeight: '450px', transform: 'translate(-8vw, -15vh)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {mounted && <LaptopCanvas />}
        </motion.div>
      </div>

      {/* Scroll indicator — UNCHANGED */}
      <motion.div
        className="wrap relative z-30 mt-8 flex items-center gap-4 lg:mt-16 lg:gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <span className="eyebrow flex items-center gap-3">
          Scroll<motion.span animate={{ scaleX: [1, 1.8, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="inline-block h-px w-10 origin-left bg-accent" />
        </span>
        <span className="eyebrow hidden items-center gap-2 lg:flex">
          <span className="font-jp text-accent">✳</span> Move your cursor
        </span>
      </motion.div>
    </section>
  );
}
