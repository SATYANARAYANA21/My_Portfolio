"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fake loading progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500); // delay before revealing
          return 100;
        }
        return p + 5;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" aria-hidden="true">
      {/* 14x9 Grid */}
      <div
        className="absolute inset-0 grid"
        style={{ gridTemplateColumns: "repeat(14, 1fr)", gridTemplateRows: "repeat(9, 1fr)" }}
      >
        {Array.from({ length: 14 * 9 }).map((_, i) => (
          <motion.span
            key={i}
            className="bg-paper will-change-transform"
            style={{ boxShadow: "inset 0 0 0 0.5px rgb(var(--ink) / 0.05)" }}
            initial={{ scale: 1 }}
            animate={{ scale: progress === 100 ? 0 : 1 }}
            transition={{
              duration: 0.52,
              ease: [0.76, 0, 0.24, 1],
              delay: Math.random() * 0.3, // scatter effect
            }}
          />
        ))}
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center will-change-transform"
        animate={{
          translateY: progress === 100 ? "-100%" : "0%",
        }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
      >
        <span className="halftone-fade pointer-events-none absolute inset-0 opacity-40"></span>
        <span className="relative font-jp text-[18vw] leading-none text-ink/90 sm:text-[14vw]">開</span>
        <span className="chromatic-strong relative mt-1 font-display text-step-2 uppercase tracking-tightest text-ink">
          SATYA
        </span>
        <div className="relative mt-4 flex items-baseline gap-3 font-mono text-step--1 uppercase tracking-ultrawide">
          <span className="text-ink/50">Loading the light</span>
          <span className="text-step-1 tabular-nums text-ink">
            {progress.toString().padStart(3, "0")}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
