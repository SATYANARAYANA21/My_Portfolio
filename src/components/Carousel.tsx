
'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

// ─── Media sources ────────────────────────────────────────────────────────────
const IMAGES = [
  "/models/exp-05/iimage-1.jpeg",
  "/models/exp-05/iimage-2.jpeg",
  "/models/exp-05/iimage-3.jpeg",
  "/models/exp-05/iimage-4.jpeg",
  "/models/exp-05/iimage-5.jpeg",
  "/models/exp-05/iimage-6.jpeg",
  "/models/exp-05/iimage-7.jpeg",
  "/models/exp-05/iimage-8.jpeg",
  "/models/exp-05/iimage-9.png",
  "/models/exp-05/iimage-10.jpeg",
  "/models/exp-05/iimage-11.jpeg",
  "/models/exp-05/iimage-12.jpeg",
  "/models/exp-05/iimage-13.png",
  "/models/exp-05/iimage-14.png",
  "/models/exp-05/iimage-15.png",
];
const VIDEO_SRC = "/models/exp-05/video-16-web.mp4";

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 16;         // 15 images + 1 video
const LAST_FRAME   = TOTAL_FRAMES - 1; // 15
const CONTAINER_VH = 280;        // matches style={{ height: '280vh' }}

// ─── Video Modal ─────────────────────────────────────────────────────────────
// Rendered at the React tree root (outside the 3D carousel hierarchy).
// Uses NO Framer Motion, NO CSS transform, NO filter — ensures hardware overlay
// decoding is not blocked by a compositor stacking context on the parent.
function VideoModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    // Lock body scroll — prevents Framer Motion's useScroll from ticking.
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    // Fixed overlay — no transform, no filter, no backdrop-filter.
    // background set inline (not via Tailwind) so no extra paint layers.
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.93)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-9 right-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-ultrawide text-paper/60 transition-colors hover:text-paper"
        >
          <span className="text-base leading-none">✕</span> Close
        </button>

        {/* Video element — NO shadow, NO transform, NO filter on this or any parent.
            Hardware overlay decoding requires a clean compositor stacking context. */}
        <video
          src={VIDEO_SRC}
          controls
          playsInline
          preload="metadata"
          className="w-full rounded-[2px]"
          style={{ maxHeight: '82vh', objectFit: 'contain', display: 'block' }}
        />
      </div>
    </div>
  );
}

// ─── Frame 16 static cover + play button ─────────────────────────────────────
function Frame16Cover({ onPlay, isActive }: { onPlay: () => void; isActive: boolean }) {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onPlay();
  };

  return (
    <div className="relative h-full w-full">
      {/* Static styled cover */}
      <div className="flex h-full w-full flex-col items-center justify-center bg-ink gap-2">
        <span className="font-mono text-[10px] uppercase tracking-ultrawide text-paper/40">Design Reel</span>
      </div>

      {/* Play button overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer bg-ink/20 transition-colors hover:bg-ink/35"
        onClick={handleClick}
        onTouchEnd={handleClick}
      >
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full border-2 border-paper bg-accent text-paper shadow-[4px_6px_0_rgb(var(--ink)/0.5)] transition-transform hover:scale-105 ${isActive ? 'scale-100' : 'scale-90'}`}
        >
          <span className="text-2xl ml-1 leading-none">&#9658;</span>
        </div>
      </div>
    </div>
  );
}

// ─── Individual carousel frame ────────────────────────────────────────────────
function CarouselFrame({
  src,
  i,
  progress,
  isActive,
  isLast,
  onPlayVideo,
}: {
  src: string;
  i: number;
  progress: MotionValue<number>;
  isActive: boolean;
  isLast: boolean;
  onPlayVideo: () => void;
}) {
  const relativeOffset = useTransform(progress, (p) => i - p);

  const transform = useTransform(relativeOffset, (offset) => {
    const angleDeg = offset * 41.25;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = Math.sin(angleRad) * 730;
    const z = Math.cos(angleRad) * 730 - 730;
    const y = offset * 72;
    const rotateZ = offset * 1.4;
    return `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${angleDeg.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg)`;
  });

  const opacity = useTransform(relativeOffset, (offset) => {
    const abs = Math.abs(offset);
    if (abs <= 2.5) return 1;
    if (abs >= 4) return 0;
    return 1 - (abs - 2.5) / 1.5;
  });

  const zIndex = useTransform(relativeOffset, (offset) =>
    Math.round(1000 - Math.abs(offset) * 100)
  );

  const visibility = useTransform(opacity, (o) => (o > 0 ? 'visible' : 'hidden'));

  return (
    <motion.figure
      className="absolute will-change-transform"
      style={{ width: '480px', transform, opacity, zIndex, visibility: visibility as any }}
    >
      <div
        className={`relative aspect-[3/2] overflow-hidden border-2 bg-ink/10 transition-[border-color,box-shadow] duration-500 ${
          isActive
            ? 'border-accent shadow-[10px_14px_0_rgb(var(--accent)/0.35)]'
            : 'border-ink shadow-[10px_14px_0_rgb(var(--ink)/0.25)]'
        }`}
      >
        {isLast ? (
          <Frame16Cover onPlay={onPlayVideo} isActive={isActive} />
        ) : (
          <img src={src} alt="" draggable="false" className="h-full w-full object-cover" />
        )}
        <figcaption className="pointer-events-none absolute bottom-0 left-0 flex items-center gap-2 bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-ultrawide text-paper">
          <span className="text-accent">&#9672;</span>{' '}
          {String(i + 1).padStart(2, '0')} / {TOTAL_FRAMES}
        </figcaption>
      </div>
    </motion.figure>
  );
}

// ─── Main Carousel export ─────────────────────────────────────────────────────
export default function Carousel() {
  const containerRef      = useRef<HTMLDivElement>(null);
  const [activeFrame, setActiveFrame] = useState(0);
  const [modalOpen, setModalOpen]     = useState(false);

  // Refs for event handlers (stale-closure-safe) and modal gate.
  const activeFrameRef    = useRef(0);
  const carouselInViewRef = useRef(false);
  const modalOpenRef      = useRef(false);

  // ── Scroll-driven progress ────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progress = useTransform(smoothProgress, [0, 1], [0, LAST_FRAME]);

  // Only call setActiveFrame when the modal is CLOSED — eliminates all React
  // state updates (and the re-renders they cause) during video playback.
  useEffect(() => {
    return progress.on('change', (v) => {
      if (modalOpenRef.current) return; // modal open → skip re-render
      const next = Math.max(0, Math.min(LAST_FRAME, Math.round(v)));
      setActiveFrame(next);
      activeFrameRef.current = next;
    });
  }, [progress]);

  // ── Scroll-to-frame (CORRECTED math) ─────────────────────────────────────
  // Old code used offsetTop (relative to offsetParent, ~48 px) + wrong multiplier 0.12.
  // Fix: getBoundingClientRect().top + scrollY gives the true document top.
  // Formula: scrollY = docTop + (frameIndex / LAST_FRAME) * (CONTAINER_VH - 1) * vh
  const scrollToFrame = useCallback((index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const docTop  = el.getBoundingClientRect().top + window.scrollY;
    const vh      = window.innerHeight;
    const target  = docTop + (index / LAST_FRAME) * (CONTAINER_VH - 1) * vh;
    window.scrollTo({ top: target, behavior: 'smooth' });
  }, []);

  // ── Carousel visibility via IntersectionObserver ──────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { carouselInViewRef.current = entry.isIntersecting; },
      { threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── Keyboard handler — registered once, reads refs only ───────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Never intercept when typing in a form field
      const tag = (e.target as HTMLElement)?.tagName ?? '';
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if ((e.target as HTMLElement)?.isContentEditable) return;

      // Escape → close modal
      if (e.key === 'Escape' && modalOpenRef.current) {
        setModalOpen(false);
        modalOpenRef.current = false;
        return;
      }

      // Arrow keys → carousel navigation (only when visible, modal closed)
      if (!carouselInViewRef.current || modalOpenRef.current) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollToFrame(Math.max(0, activeFrameRef.current - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollToFrame(Math.min(LAST_FRAME, activeFrameRef.current + 1));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [scrollToFrame]); // scrollToFrame is stable (useCallback, no deps) → effect runs once

  // ── Modal open/close ──────────────────────────────────────────────────────
  const openModal = useCallback(() => {
    setModalOpen(true);
    modalOpenRef.current = true;
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    modalOpenRef.current = false;
  }, []);

  // ── All 16 sources (15 images + video placeholder) ────────────────────────
  const ALL_SRCS = [...IMAGES, VIDEO_SRC];

  return (
    <>
      {/* Video modal — rendered outside the carousel section */}
      {modalOpen && <VideoModal onClose={closeModal} />}

      <section id="carousel" className="relative">
        <header className="wrap relative z-10 pt-[var(--section-pad)]">
          <div className="flex items-center justify-between gap-4 border-b border-ink/15 pb-3">
            <span className="eyebrow flex items-baseline gap-2.5">
              <span className="text-accent">&#9658;</span>
              <span className="tabular-nums">EXP 05</span>
              <span className="font-jp text-step--1 text-accent">螺</span>
            </span>
            <span className="eyebrow tabular-nums opacity-55">SATYA 400</span>
          </div>
          <div className="mt-7 grid gap-x-[var(--grid-gutter)] gap-y-6 md:grid-cols-12">
            <h2
              aria-label="The Moment Vault"
              className="font-display text-step-5 uppercase leading-[0.85] tracking-tighter2 md:col-span-7"
            >
              The Moment Vault
            </h2>
            <div className="md:col-span-5 md:pt-1.5">
              <p className="max-w-[38ch] text-pretty text-step-0 leading-relaxed text-ink/60">
                A collection of moments I chose not to let disappear.
                <br /><br />
                Some were found beneath open skies, some between ordinary days,
                and some were born from ideas brought to life through design.
                <br /><br />
                Every frame holds a little piece of how I see the world.
              </p>
            </div>
          </div>
        </header>

        {/* 280vh scrollable container — drives the 3D carousel via scroll progress */}
        <div ref={containerRef} className="relative mt-12" style={{ height: '280vh' }}>
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <span
              aria-hidden="true"
              className="halftone-fade pointer-events-none absolute inset-0 opacity-[0.06]"
            />

            {/* 3D perspective stage */}
            <div
              role="group"
              aria-label="The landscape archive on a turning reel — drag or use arrow keys"
              className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing transition-opacity duration-300 delay-100"
              style={{ 
                perspective: '1600px', 
                display: modalOpen ? 'none' : 'block' 
              }}
            >
              <div
                className="absolute left-1/2 top-1/2 h-0 w-0"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {ALL_SRCS.map((src, i) => (
                  <CarouselFrame
                    key={i}
                    src={src}
                    i={i}
                    progress={progress}
                    isActive={activeFrame === i}
                    isLast={i === LAST_FRAME}
                    onPlayVideo={openModal}
                  />
                ))}
              </div>
            </div>

            {/* Bottom navigation bar */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-5 pb-[clamp(1.5rem,3vh,2.5rem)]">
              <p className="font-mono text-step--2 uppercase tracking-ultrawide text-ink/45">
                <span className="text-accent">&#9672;</span>{' '}
                {String(activeFrame + 1).padStart(2, '0')} / {TOTAL_FRAMES} — EXPLORE THE MOMENTS — MOVE THROUGH THE ARCHIVE
              </p>
              <div className="pointer-events-auto flex items-center gap-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none grid h-12 w-12 place-items-center border-2 border-ink bg-paper font-comic text-step-1 text-ink shadow-[3px_3px_0_rgb(var(--ink))]"
                >
                  &#9672;
                </div>
                <div className="flex gap-1.5">
                  {ALL_SRCS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToFrame(i)}
                      aria-label={`Go to frame ${i + 1}`}
                      className="h-2 rounded-full transition-all"
                      style={{
                        width:      activeFrame === i ? '26px' : '8px',
                        background: activeFrame === i
                          ? 'rgb(var(--accent))'
                          : 'rgb(var(--ink) / 0.25)',
                      }}
                    />
                  ))}
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none grid h-12 w-12 place-items-center border-2 border-ink bg-paper font-comic text-step-1 text-ink shadow-[3px_3px_0_rgb(var(--ink))]"
                >
                  &#9672;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
