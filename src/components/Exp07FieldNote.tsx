'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FIELD_NOTE_PAGES,
  type FieldNotePage,
} from './exp07Content';
import Exp07PaperTransition from './Exp07PaperTransition';
import styles from './exp07/Exp07FieldNote.module.css';

const CLOSED_BOOK_ASSET = '/models/exp-07/closed-book.png';
const OPEN_BOOK_ASSET = '/models/exp-07/open-book.png';
type BookPhase = 'closed' | 'opening' | 'open' | 'closing';

function pageText(page: FieldNotePage) {
  return [
    page.title,
    ...(page.paragraphs ?? []),
    ...(page.quote ? [page.quote] : []),
    ...(page.sections ?? []).flatMap((section) => [section.title, section.description]),
    ...(page.flow ?? []),
  ].join('. ');
}

export default function Exp07FieldNote() {
  const rootRef = useRef<HTMLDivElement>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const controlsTimerRef = useRef<number | null>(null);
  const paperTimerRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [phase, setPhase] = useState<BookPhase>('closed');
  const [controlsVisible, setControlsVisible] = useState(false);
  const [paperTransitionVisible, setPaperTransitionVisible] = useState(false);

  const accessibleContent = useMemo(
    () => FIELD_NOTE_PAGES.map((page) => pageText(page)).join(' '),
    []
  );

  const clearTimers = useCallback(() => {
    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
    if (controlsTimerRef.current !== null) window.clearTimeout(controlsTimerRef.current);
    if (paperTimerRef.current !== null) window.clearTimeout(paperTimerRef.current);
    transitionTimerRef.current = null;
    controlsTimerRef.current = null;
    paperTimerRef.current = null;
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener('change', syncMotion);
    return () => motionQuery.removeEventListener('change', syncMotion);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const openBook = useCallback(() => {
    if (phase !== 'closed') return;
    clearTimers();
    setControlsVisible(false);
    if (reducedMotion) {
      setPaperTransitionVisible(false);
      setPhase('open');
      setControlsVisible(true);
      return;
    }
    setPaperTransitionVisible(true);
    paperTimerRef.current = window.setTimeout(() => setPaperTransitionVisible(false), 1600);
    setPhase('opening');
    transitionTimerRef.current = window.setTimeout(() => {
      setPhase('open');
      controlsTimerRef.current = window.setTimeout(() => setControlsVisible(true), 190);
    }, 760);
  }, [clearTimers, phase, reducedMotion]);

  const closeBook = useCallback(() => {
    if (phase !== 'open') return;
    clearTimers();
    setControlsVisible(false);
    setPaperTransitionVisible(false);
    if (reducedMotion) {
      setPhase('closed');
      return;
    }
    setPhase('closing');
    transitionTimerRef.current = window.setTimeout(() => setPhase('closed'), 760);
  }, [clearTimers, phase, reducedMotion]);

  useEffect(() => {
    if (phase !== 'open' || !isVisible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.matches('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeBook();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeBook, isVisible, phase]);

  return (
    <div ref={rootRef} className={styles.root} data-phase={phase} aria-busy={phase === 'opening' || phase === 'closing'}>
      <div className={styles.artworkStage}>
        <div className={styles.closedArtworkFrame}>
          <img
            src={CLOSED_BOOK_ASSET}
            alt=""
            className={`${styles.artwork} ${styles.closedArtwork}`}
            draggable={false}
            decoding="async"
          />
          <button
            type="button"
            className={styles.bookHitArea}
            aria-label="Open Satya’s About Me field note"
            aria-expanded={phase !== 'closed'}
            onClick={openBook}
            tabIndex={phase === 'closed' ? 0 : -1}
          />
        </div>

        <img
          src={OPEN_BOOK_ASSET}
          alt=""
          className={`${styles.artwork} ${styles.openArtwork}`}
          draggable={false}
          decoding="async"
        />
      </div>

      <span
        aria-hidden="true"
        className="halftone-fade pointer-events-none absolute inset-0 z-[3] opacity-[0.06]"
      />

      <div className={styles.transitionWash} aria-hidden="true" />

      {paperTransitionVisible && <Exp07PaperTransition />}

      <div
        className={styles.controls}
        data-visible={phase === 'closed' || (phase === 'open' && controlsVisible)}
        aria-hidden={phase !== 'closed' && !(phase === 'open' && controlsVisible)}
        aria-label="Field note controls"
      >
        {phase === 'closed' ? (
          <button type="button" className={`${styles.button} ${styles.openButton}`} onClick={openBook}>
            Open field note <span aria-hidden="true">↗</span>
          </button>
        ) : phase === 'open' ? (
          <button type="button" className={styles.button} onClick={closeBook} tabIndex={controlsVisible ? 0 : -1}>
            Close <span aria-hidden="true">×</span>
          </button>
        ) : null}
      </div>

      <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {phase === 'open'
          ? `Open field note. ${accessibleContent}`
          : 'Closed book. Activate the book or Open field note to read about Satya.'}
      </p>
    </div>
  );
}
