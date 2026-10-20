"use client";

import { useEffect, useState } from "react";

const exposures = [
  { id: "top", number: "○", name: "Satya", jp: "始" },
  { id: "drop", number: "01", name: "The Engine", jp: "落" },
  { id: "manifesto", number: "02", name: "Ma", jp: "間" },
  { id: "series", number: "03", name: "First Light", jp: "光" },
  { id: "carousel", number: "04", name: "The Archive", jp: "螺" },
  { id: "warp", number: "05", name: "Contact Sheet", jp: "歪" },
  { id: "say-hello", number: "06", name: "Say Hello", jp: "話" },
  { id: "reel", number: "07", name: "Final Frame", jp: "巻" },
  { id: "end", number: "○", name: "End of Roll", jp: "終" },
];

export default function DesktopNav() {
  const [activeId, setActiveId] = useState("top");

  useEffect(() => {
    // Simple intersection observer logic for scrollspy would go here
  }, []);

  return (
    <aside
      className="fixed left-[max(1rem,calc(var(--grid-margin)-1.75rem))] top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      aria-label="Frame counter"
    >
      <ol className="flex flex-col gap-2.5">
        {exposures.map((exp, i) => {
          const isActive = activeId === exp.id;
          return (
            <li key={exp.id}>
              <button
                className="group flex items-center gap-3"
                aria-current={isActive ? "true" : undefined}
                aria-label={`Exposure ${exp.number} — ${exp.name}`}
              >
                <span
                  className={`h-[13px] w-[9px] shrink-0 rounded-[2.5px] border transition-all duration-500 ${
                    isActive
                      ? "border-accent bg-accent"
                      : "border-ink/30 bg-transparent group-hover:border-ink/70"
                  }`}
                ></span>
                <span
                  className={`flex items-baseline gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-ultrawide transition-all duration-500 text-ink ${
                    isActive
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"
                  }`}
                >
                  <span className="tabular-nums">{exp.number}</span>
                  <span>{exp.name}</span>
                  <span className="font-jp text-accent">{exp.jp}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
