"use client";

import { useState } from "react";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Open menu"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[4.5rem] right-5 z-[60] flex items-center gap-2 border-2 border-ink bg-paper px-3 py-2 shadow-[4px_4px_0_rgb(var(--ink))] lg:hidden"
      >
        <span className="font-jp text-step-0 leading-none text-accent">始</span>
        <span className="font-mono text-[10px] uppercase tracking-ultrawide text-ink/70">
          LEADER · Satya
        </span>
      </button>

      <div
        className={`fixed inset-0 z-[70] bg-ink/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 z-[80] flex w-[min(82vw,22rem)] flex-col bg-paper shadow-[10px_0_40px_rgb(var(--ink)/0.35)] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <span aria-hidden="true" className="halftone-fade pointer-events-none absolute inset-0 opacity-[0.07]"></span>
        <div className="relative flex items-center justify-between border-b-2 border-ink px-6 py-5">
          <span className="font-display text-step-1 uppercase tracking-tighter2">
            SATYA <span className="font-jp text-accent">框</span>
          </span>
          <button
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            className="grid h-9 w-9 place-items-center border-2 border-ink font-comic text-step-1 leading-none text-ink transition-colors hover:bg-accent hover:text-paper"
          >
            ✕
          </button>
        </div>
        <nav className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-6">
          <div className="my-auto flex flex-col gap-1 py-5">
            {/* Nav items */}
            {["Satya", "The Engine", "Ma", "First Light", "The Archive"].map((item, i) => (
              <button key={item} className="group flex items-baseline gap-4 border-b border-ink/10 py-3 text-left transition-colors text-ink hover:text-accent">
                <span className="font-mono text-[10px] tabular-nums tracking-ultrawide text-ink/40">0{i}</span>
                <span className="font-display text-step-3 uppercase leading-none tracking-tightest">{item}</span>
                <span className="ml-auto font-jp text-step-1 text-accent/70">始</span>
              </button>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
