"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { playlist } from "@/data/music";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

const visualizerBars = [0.48, 0.82, 0.58, 1, 0.68, 0.4, 0.76];
const imageHeavySections = new Set(["reel", "exp04", "carousel", "say-hello"]);
const darkSections = new Set(["exp04", "carousel", "say-hello"]);

export default function AudioPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.72);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnDarkBackground, setIsOnDarkBackground] = useState(false);
  const [isOverComplexBackground, setIsOverComplexBackground] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const minimizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manuallyPausedRef = useRef(false);
  const playAfterTrackChangeRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const track = playlist[trackIndex];

  const clearMinimizeTimer = () => {
    if (minimizeTimerRef.current) clearTimeout(minimizeTimerRef.current);
    minimizeTimerRef.current = null;
  };

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    manuallyPausedRef.current = false;
    setHasError(false);
    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
      setHasError(true);
    }
  }, [track]);

  const pause = useCallback(() => {
    clearMinimizeTimer();
    manuallyPausedRef.current = true;
    playAfterTrackChangeRef.current = false;
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const handlePlayButton = () => {
    if (isPlaying) {
      pause();
      return;
    }

    void play();
    clearMinimizeTimer();
    minimizeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      minimizeTimerRef.current = null;
    }, 3000);
  };

  const togglePlayer = () => {
    if (!isOpen) clearMinimizeTimer();
    setIsOpen((open) => !open);
  };

  const selectTrack = useCallback((index: number) => {
    if (index < 0 || index >= playlist.length) return;
    manuallyPausedRef.current = false;
    setHasError(false);
    const audio = audioRef.current;

    if (index === trackIndex) {
      if (audio) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }
      playAfterTrackChangeRef.current = false;
      void play();
      return;
    }

    playAfterTrackChangeRef.current = true;
    setTrackIndex(index);
  }, [play, trackIndex]);

  const moveTrack = useCallback((direction: -1 | 1) => {
    const nextIndex = (trackIndex + direction + playlist.length) % playlist.length;
    selectTrack(nextIndex);
  }, [selectTrack, trackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!track) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    audio.pause();
    audio.src = track.src;
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (playAfterTrackChangeRef.current) {
      playAfterTrackChangeRef.current = false;
      void audio.play().then(() => {
        manuallyPausedRef.current = false;
        setHasError(false);
      }).catch(() => {
        setIsPlaying(false);
        setHasError(true);
      });
    }
  }, [track]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [isMuted, volume]);

  useEffect(() => {
    return () => clearMinimizeTimer();
  }, []);

  useEffect(() => {
    const updateBackgroundTone = () => {
      const x = Math.max(0, window.innerWidth - 18);
      const y = Math.max(0, window.innerHeight - 18);
      const backgroundElement = document
        .elementsFromPoint(x, y)
        .find((element) => !playerRef.current?.contains(element));
      const section = backgroundElement?.closest("section");
      if (!section) return;

      const backgroundColor = window.getComputedStyle(section).backgroundColor;
      const channels = backgroundColor.match(/[\d.]+/g)?.map(Number);
      const hasVisibleBackground = !channels || channels.length < 4 || channels[3] > 0;
      const luminance = channels && channels.length >= 3 && hasVisibleBackground
        ? 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
        : 255;
      const dark = section.classList.contains("ground-dark")
        || luminance < 128
        || darkSections.has(section.id);
      const complex = dark || imageHeavySections.has(section.id);

      setIsOnDarkBackground((current) => current === dark ? current : dark);
      setIsOverComplexBackground((current) => current === complex ? current : complex);
    };

    updateBackgroundTone();
    const sections = document.querySelectorAll("main section");
    let observer: IntersectionObserver | null = null;

    const observePlayerCorner = () => {
      observer?.disconnect();
      if (!("IntersectionObserver" in window)) {
        updateBackgroundTone();
        return;
      }

      const xInset = Math.max(0, window.innerWidth - 20);
      const yInset = Math.max(0, window.innerHeight - 20);
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) updateBackgroundTone();
        },
        { rootMargin: `-${yInset}px 0px 0px -${xInset}px`, threshold: 0 },
      );
      sections.forEach((section) => observer?.observe(section));
      updateBackgroundTone();
    };

    observePlayerCorner();
    window.addEventListener("resize", observePlayerCorner);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", observePlayerCorner);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!playerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleEnded = useCallback(() => {
    if (manuallyPausedRef.current || !playlist.length) return;
    const nextIndex = (trackIndex + 1) % playlist.length;
    playAfterTrackChangeRef.current = true;
    setTrackIndex(nextIndex);
  }, [trackIndex]);

  return (
    <div
      ref={playerRef}
        className="fixed bottom-3 right-3 z-[60] sm:bottom-6 sm:right-6"
      data-background-tone={isOnDarkBackground ? "dark" : "light"}
      style={{
        "--ink": isOnDarkBackground ? "244 241 234" : "20 20 20",
        "--paper": isOnDarkBackground ? "20 20 20" : "244 241 234",
      } as CSSProperties}
    >
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onEnded={handleEnded}
        onError={() => {
          if (track) {
            setHasError(true);
            setIsPlaying(false);
          }
        }}
        className="hidden"
        aria-hidden="true"
      />

      <AnimatePresence>
        {isOpen && (
          <motion.section
            key="music-panel"
            role="dialog"
            aria-modal="false"
            aria-label="Portfolio music player"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 5, scale: 0.985 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.21, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute bottom-[calc(100%+8px)] right-0 max-h-[min(300px,calc(100dvh-64px))] w-[min(210px,calc(100vw-24px))] overflow-y-auto overscroll-contain rounded-md border border-ink/25 text-ink shadow-[0_2px_8px_rgb(var(--ink)/0.2),0_0_4px_rgb(var(--accent)/0.08)] transition-[background-color,color,border-color,box-shadow] duration-[350ms] ease-out sm:max-h-[min(315px,calc(100dvh-72px))] sm:w-[min(235px,calc(100vw-32px))] lg:max-h-[min(330px,calc(100dvh-80px))] lg:w-[min(265px,calc(100vw-40px))] ${isOverComplexBackground ? "bg-paper/96" : "bg-paper/92"}`}
            style={{ scrollbarWidth: "thin", scrollbarColor: isOnDarkBackground ? "rgba(244,241,234,0.24) transparent" : "rgba(20,20,20,0.2) transparent" }}
          >
            <div className="flex items-center justify-between border-b border-ink/12 px-2.5 py-1.5">
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${isPlaying ? "bg-accent" : "bg-ink/30"}`} />
                <span className="font-mono text-[8px] uppercase tracking-[0.13em]">Sound Archive</span>
                <span className="border-l border-ink/15 pl-1.5 font-jp text-[9px] leading-none text-accent">音</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close music player"
                className="flex h-6 w-6 items-center justify-center rounded-sm text-ink/55 transition-colors hover:bg-ink/5 hover:text-ink active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent motion-reduce:transition-none"
              >
                ×
              </button>
            </div>

            <div className="px-2.5 pb-1.5 pt-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink/48">
                  {String(trackIndex + 1).padStart(2, "0")} / {String(playlist.length).padStart(2, "0")}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ink/45">{track.mood}</span>
              </div>

              <div className="mt-0.5 flex min-w-0 items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-display text-[14px] uppercase leading-none tracking-[0.015em]">{track.title}</p>
                  <p className="mt-0.5 truncate font-mono text-[7px] uppercase tracking-[0.1em] text-ink/55">{track.artist}</p>
                </div>
                <div className="flex h-6 shrink-0 items-end gap-[2px] border-l border-ink/10 pl-2" aria-label={isPlaying ? "Audio playing" : "Audio paused"}>
                  {visualizerBars.map((height, index) => (
                    <motion.span
                      key={index}
                      className="w-[2px] origin-bottom rounded-full bg-accent/75"
                      style={{ height: `${height * 100}%` }}
                      animate={isPlaying && !reducedMotion ? { scaleY: [0.38, 1, 0.55, height] } : { scaleY: 0.45 }}
                      transition={isPlaying && !reducedMotion ? { duration: 0.72 + index * 0.045, repeat: Infinity, ease: "easeInOut", delay: index * 0.045 } : { duration: 0.12 }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-1.5 flex items-center gap-1 font-mono text-[7px] tabular-nums text-ink/60">
                <span className="w-6">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={Math.min(currentTime, duration || 0)}
                  disabled={!duration}
                  aria-label="Seek through current track"
                  onChange={(event) => {
                    const nextTime = Number(event.currentTarget.value);
                    if (audioRef.current) audioRef.current.currentTime = nextTime;
                    setCurrentTime(nextTime);
                  }}
                  className="h-1 min-w-0 flex-1 cursor-pointer accent-[rgb(var(--accent))] disabled:cursor-not-allowed disabled:opacity-35"
                />
                <span className="w-6 text-right">{formatTime(duration)}</span>
              </div>

              <div className="mt-1 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => moveTrack(-1)}
                  aria-label="Previous track"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[14px] text-ink/70 transition-colors hover:text-accent active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent motion-reduce:transition-none"
                >
                  |‹
                </button>
                <button
                  type="button"
                  onClick={handlePlayButton}
                  aria-label={isPlaying ? "Pause music" : "Play music"}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-accent/55 bg-accent text-paper shadow-[0_1px_4px_rgb(var(--ink)/0.14)] transition-[transform,background-color,box-shadow] duration-150 hover:scale-[1.04] hover:bg-ink hover:shadow-[0_0_5px_rgb(var(--accent)/0.16)] active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper motion-reduce:transition-colors"
                >
                  <span aria-hidden="true" className="font-mono text-[10px]">{isPlaying ? "Ⅱ" : "▶"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => moveTrack(1)}
                  aria-label="Next track"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[14px] text-ink/70 transition-colors hover:text-accent active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent motion-reduce:transition-none"
                >
                  ›|
                </button>
              </div>

              <div className="mt-1 flex items-center gap-1.5 border-t border-ink/10 pt-1">
                <button
                  type="button"
                  onClick={() => setIsMuted((muted) => !muted)}
                  aria-label={isMuted ? "Unmute music" : "Mute music"}
                  aria-pressed={isMuted}
                  className="flex min-h-7 min-w-8 items-center justify-center rounded-sm font-mono text-[7px] uppercase tracking-[0.08em] text-ink/65 transition-colors hover:text-accent active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent motion-reduce:transition-none"
                >
                  {isMuted ? "MUTE" : "VOL"}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  aria-label="Music volume"
                  onChange={(event) => setVolume(Number(event.currentTarget.value))}
                  className="h-1 min-w-0 flex-1 cursor-pointer accent-[rgb(var(--accent))]"
                />
                <span className="w-6 text-right font-mono text-[7px] tabular-nums text-ink/50">{Math.round(volume * 100)}</span>
              </div>
            </div>

            <div className="border-t border-ink/12 px-2.5 pb-1.5 pt-1">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[7px] uppercase tracking-[0.14em]">Track Index</span>
                <span className="font-mono text-[7px] tabular-nums text-ink/45">TRACKS {String(playlist.length).padStart(2, "0")}</span>
              </div>
              <ol aria-label="Music playlist" className="max-h-[48px] space-y-px overflow-y-auto overscroll-contain pr-1 sm:max-h-[60px] lg:max-h-[72px]">
                {playlist.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => selectTrack(index)}
                      aria-current={index === trackIndex ? "true" : undefined}
                      className={`group/track flex min-h-[23px] w-full items-center gap-1 rounded-sm px-1 py-0 text-left transition-[background-color,transform,color] duration-150 hover:translate-x-[2px] hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent active:scale-[0.99] motion-reduce:transition-none ${index === trackIndex ? "bg-ink/[0.035] text-ink" : "text-ink/65"}`}
                    >
                      <span className={`h-1 w-1 shrink-0 rounded-full ${index === trackIndex ? "bg-accent" : "bg-transparent"}`} />
                      <span className={`w-4 font-mono text-[8px] tabular-nums ${index === trackIndex ? "text-accent" : "text-ink/40"}`}>{String(index + 1).padStart(2, "0")}</span>
                      <span className="min-w-0 flex-1 truncate font-light text-[9px]">{item.title}</span>
                      <span className="max-w-[58px] truncate font-mono text-[6px] uppercase tracking-[0.06em] text-ink/45">{item.mood}</span>
                    </button>
                  </li>
                ))}
              </ol>
              {hasError && <p role="status" className="mt-2 font-light text-[10px] text-accent">This track could not be loaded. Choose another to continue.</p>}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={togglePlayer}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={isOpen ? "Close music player" : "Open music player"}
        className="group relative inline-flex h-9 w-[96px] items-center justify-center gap-1.5 rounded-sm border border-ink/25 bg-paper/96 px-2 text-ink shadow-[0_1px_5px_rgb(var(--ink)/0.18)] transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-px hover:border-accent/70 hover:bg-paper hover:shadow-[0_2px_7px_rgb(var(--ink)/0.2)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper motion-reduce:transition-colors"
      >
        <span aria-hidden="true" className="font-jp text-[12px] leading-none text-accent">音</span>
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.12em]">Music</span>
        <span aria-hidden="true" className={`absolute right-[7px] top-[7px] h-1 w-1 rounded-full ${isPlaying ? "bg-accent animate-pulse" : "bg-ink/30"}`} />
        <span className="sr-only">{isPlaying ? "Playing" : "Paused"}</span>
      </button>
    </div>
  );
}
