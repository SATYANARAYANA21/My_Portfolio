"use client";

import { useState } from "react";

export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false);

  return (
    <>
      <audio src="" preload="metadata" aria-hidden="true" className="hidden" />
      <button
        type="button"
        aria-label="Play the score"
        onClick={() => setPlaying(!playing)}
        className="group fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 border-2 border-ink bg-paper px-3 py-2.5 font-comic text-step--1 uppercase tracking-wide text-ink shadow-[4px_4px_0_rgb(var(--ink))] transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-paper active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_rgb(var(--ink))]"
        style={{ opacity: 0.65 }}
      >
        <span className="flex h-4 items-end gap-[3px]">
          <span
            className="w-[3px] rounded-full bg-accent group-hover:bg-paper"
            style={{ height: playing ? "100%" : "22%", transition: "height 0.2s" }}
          ></span>
          <span
            className="w-[3px] rounded-full bg-accent group-hover:bg-paper"
            style={{ height: playing ? "80%" : "22%", transition: "height 0.2s 0.1s" }}
          ></span>
          <span
            className="w-[3px] rounded-full bg-accent group-hover:bg-paper"
            style={{ height: playing ? "100%" : "22%", transition: "height 0.2s 0.2s" }}
          ></span>
          <span
            className="w-[3px] rounded-full bg-accent group-hover:bg-paper"
            style={{ height: playing ? "60%" : "22%", transition: "height 0.2s 0.3s" }}
          ></span>
        </span>
        <span className="leading-none">{playing ? "sound on" : "sound off"}</span>
      </button>
    </>
  );
}
