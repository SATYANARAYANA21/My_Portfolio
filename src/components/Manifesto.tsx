"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import Exp02AshenOneCard from "@/components/Exp02AshenOneCard";

const EXP02_CONTENT = {
  section: "07",
  title: <>THE FIRE<br />REMAINS.</>,
  subtitle: "The journey continues.",
  copy: <>Curiosity became a path.<br />The path became a practice.<br />The practice became a way of building.</>,
  capabilities: [
    { number: "01", title: "CURIOSITY", copy: "The question that started it all." },
    { number: "02", title: "BUILDING", copy: "Ideas made real through iteration." },
    { number: "03", title: "BECOMING", copy: "Still learning. Still creating." },
  ],
  quote: "And this is only the beginning.",
  attribution: "— SATYA",
} as const;

const EXP02_BACKGROUND = "/models/exp-02/back.png";

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reveal = {
    hidden: { opacity: 0, y: 16 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section id="manifesto" ref={ref} className="relative overflow-hidden bg-ink pb-[clamp(3.5rem,4vw,4.5rem)] pt-[clamp(6rem,7vw,7rem)] text-paper xl:h-[calc(56.25vw+clamp(6rem,7vw,7rem))] xl:pb-0">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          alt=""
          className="object-cover object-center"
          fill
          priority
          unoptimized
          sizes="100vw"
          src={EXP02_BACKGROUND}
        />
      </div>
      <span
        aria-hidden="true"
        className="halftone-fade pointer-events-none absolute inset-0 z-[5] opacity-[0.06]"
        style={{ "--ink": "244 241 234" } as React.CSSProperties}
      />

      <div className="wrap relative">
        <div className="relative z-10 flex items-center gap-5 border-y border-paper/15 py-2.5 font-mono text-step--2 uppercase tracking-ultrawide text-paper/65">
          <div className="flex items-center gap-3">
            <span className="font-display text-paper/90">SATYA</span>
            <span className="text-accent/80">{EXP02_CONTENT.section}</span>
            <span className="text-accent/80">—</span>
            <span>Conclusion</span>
          </div>
        </div>

        <div className="relative grid items-start gap-y-8 pt-6 lg:grid-cols-[minmax(0,43fr)_minmax(0,57fr)] lg:gap-x-[clamp(2.25rem,3.5vw,4.5rem)] xl:pt-3">
          <motion.div
            variants={reveal}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0}
            className="relative z-10 max-w-[34rem] lg:pt-1 xl:pt-0"
          >
            <h2 className="max-w-[10.5ch] font-serif text-[clamp(3.2rem,4.8vw,4.6rem)] font-normal uppercase leading-[0.96] tracking-[-0.025em] text-paper">
              {EXP02_CONTENT.title}
            </h2>
            <p className="mt-4 flex items-center gap-3 font-serif text-step-1 italic leading-relaxed text-paper/90 xl:mt-2">
              <span aria-hidden="true" className="h-5 w-px shrink-0 bg-accent/80" />
              <span>{EXP02_CONTENT.subtitle}</span>
            </p>
            <p className="mt-5 max-w-[39ch] font-light text-step-0 leading-relaxed text-paper/85 xl:mt-3">
              {EXP02_CONTENT.copy}
            </p>

            <ol className="mt-6 border-t border-paper/20 lg:grid lg:grid-cols-3 lg:border-y xl:mt-3">
              {EXP02_CONTENT.capabilities.map((capability, index) => (
                <li key={capability.number} className={`grid grid-cols-[2.4rem_1fr] gap-x-3 border-b border-paper/15 py-3 sm:grid-cols-[3rem_1fr] lg:block lg:border-b-0 lg:py-3.5 xl:py-2 lg:pl-4 ${index > 0 ? "lg:border-l lg:border-paper/15" : "lg:pl-0"}`}>
                  <span className="font-mono text-step--2 tracking-ultrawide text-accent/80">{capability.number}</span>
                  <div>
                    <h3 className="font-serif text-step-1 font-normal uppercase leading-tight tracking-wide lg:mt-3">{capability.title}</h3>
                    <p className="mt-1.5 max-w-[27ch] text-step--1 leading-relaxed text-paper/75">{capability.copy}</p>
                  </div>
                </li>
              ))}
            </ol>

            <blockquote className="mt-6 hidden border-l border-accent/60 pl-5 lg:block xl:mt-2">
              <p className="max-w-[26ch] font-serif text-step-1 italic leading-relaxed text-paper/90">{EXP02_CONTENT.quote}</p>
              <footer className="mt-2.5 font-mono text-step--2 tracking-ultrawide text-paper/65">{EXP02_CONTENT.attribution}</footer>
            </blockquote>
          </motion.div>

          <blockquote className="relative z-10 border-l border-accent/60 pl-5 lg:hidden">
            <p className="max-w-[26ch] font-serif text-step-1 italic leading-relaxed text-paper/90">{EXP02_CONTENT.quote}</p>
            <footer className="mt-2.5 font-mono text-step--2 tracking-ultrawide text-paper/65">{EXP02_CONTENT.attribution}</footer>
          </blockquote>
          <Exp02AshenOneCard />
        </div>

        <footer className="relative z-10 mt-10 border-t border-paper/15 pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/65 lg:grid lg:grid-cols-[minmax(0,43fr)_minmax(0,57fr)] lg:gap-x-[clamp(2.25rem,3.5vw,4.5rem)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a
              href="#top"
              className="inline-flex min-h-8 w-fit items-center border border-paper/35 bg-ink/60 px-3 py-1.5 text-paper/95 shadow-[0_1px_5px_rgb(0_0_0/0.35)] transition-colors hover:border-accent/70 hover:text-paper focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent"
            >
              ↑ Back to start
            </a>
            <p className="text-paper/90 [text-shadow:0_1px_3px_rgb(0_0_0/0.85)]">© 2026 SATYA. ALL RIGHTS RESERVED.</p>
          </div>
        </footer>
      </div>
    </section>
  );
}
