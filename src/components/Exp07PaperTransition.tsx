'use client';

import type { CSSProperties } from 'react';
import styles from './exp07/Exp07PaperTransition.module.css';

type PetalKind = 'maple' | 'sakura' | 'single';
type PetalDepth = 'background' | 'midground' | 'foreground';

const palette = ['#b84a42', '#ce6457', '#dc796c', '#a9433d', '#d98573', '#e6aa91'];
const petalCount = 72;

function random(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function createPetal(index: number) {
  const depth: PetalDepth = index % 9 === 0 ? 'background' : index % 5 === 0 ? 'foreground' : 'midground';
  const kind: PetalKind = index % 4 === 0 ? 'maple' : index % 3 === 0 ? 'sakura' : 'single';
  const depthScale = depth === 'background' ? 0.68 : depth === 'foreground' ? 1.18 : 1;
  const size = (13 + random(index + 3) * 20) * depthScale;
  const drift = (random(index + 11) - 0.5) * 22;
  const sway = (random(index + 17) - 0.5) * 12;
  const delay = Math.min(400, Math.round((index / (petalCount - 1)) * 390 + random(index + 23) * 45));
  const duration = depth === 'background'
    ? 1040 + Math.round(random(index + 29) * 110)
    : depth === 'foreground'
      ? 790 + Math.round(random(index + 29) * 150)
      : 900 + Math.round(random(index + 29) * 150);
  const scale = 0.78 + random(index + 41) * 0.3;
  const rotation = Math.round(random(index + 43) * 70 - 35);
  const turn = Math.round(random(index + 47) * 62 - 31);
  const opacity = depth === 'background' ? 0.28 + random(index + 53) * 0.13 : 0.48 + random(index + 53) * 0.24;
  const style = {
    '--petal-left': `${random(index + 31) * 99}%`,
    '--petal-size': `${size}px`,
    '--petal-start-y': `${-12 - random(index + 37) * 38}vh`,
    '--petal-x-a': `${drift * 0.25}vw`,
    '--petal-x-b': `${drift * 0.68 + sway}vw`,
    '--petal-x-c': `${drift * 0.42 - sway * 0.55}vw`,
    '--petal-x-end': `${drift}vw`,
    '--petal-depth': depth === 'background' ? '-120px' : depth === 'foreground' ? '95px' : '0px',
    '--petal-scale': `${scale}`,
    '--petal-scale-start': `${scale * 0.72}`,
    '--petal-scale-end': `${scale * 0.94}`,
    '--petal-rotation-a': `${rotation + turn * 0.28}deg`,
    '--petal-rotation-b': `${rotation - turn * 0.32}deg`,
    '--petal-rotation-c': `${rotation + turn * 0.45}deg`,
    '--petal-rotation-end': `${rotation + turn}deg`,
    '--petal-opacity': `${opacity}`,
    '--petal-opacity-soft': `${opacity * 0.82}`,
    '--petal-duration': `${duration}ms`,
    '--petal-delay': `${delay}ms`,
    '--petal-color': palette[Math.floor(random(index + 59) * palette.length)],
  } as CSSProperties;

  return { depth, kind, style };
}

const petals = Array.from({ length: petalCount }, (_, index) => createPetal(index));

function PetalShape({ kind }: { kind: PetalKind }) {
  if (kind === 'maple') {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 6 59 23 75 13 73 31 94 29 80 46 97 54 76 61 82 80 63 73 55 96 48 77 32 91 34 70 14 76 25 58 5 50 25 42 13 25 34 30 34 10 47 24Z" fill="currentColor" />
        <path d="M50 18 51 77M50 47 31 35M51 54 72 38M51 65 34 72M51 65 69 73" fill="none" stroke="rgba(91,35,31,.3)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === 'sakura') {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <g fill="currentColor" stroke="rgba(116,48,44,.18)" strokeWidth="1.5">
          <path d="M50 48C35 35 36 17 48 8c2-2 5-2 7 0 12 9 13 27-5 40Z" />
          <path d="M50 48C35 35 36 17 48 8c2-2 5-2 7 0 12 9 13 27-5 40Z" transform="rotate(72 50 50)" />
          <path d="M50 48C35 35 36 17 48 8c2-2 5-2 7 0 12 9 13 27-5 40Z" transform="rotate(144 50 50)" />
          <path d="M50 48C35 35 36 17 48 8c2-2 5-2 7 0 12 9 13 27-5 40Z" transform="rotate(216 50 50)" />
          <path d="M50 48C35 35 36 17 48 8c2-2 5-2 7 0 12 9 13 27-5 40Z" transform="rotate(288 50 50)" />
        </g>
        <circle cx="50" cy="50" r="5" fill="#e6b18f" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 7C58 20 78 35 74 55c-3 16-15 29-24 39-9-10-21-23-24-39C22 35 42 20 50 7Z" fill="currentColor" />
      <path d="M50 22c1 23 2 47 0 67" fill="none" stroke="rgba(105,42,35,.25)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Exp07PaperTransition() {
  return (
    <div className={styles.layer} aria-hidden="true">
      {petals.map(({ depth, kind, style }, index) => (
        <span
          key={index}
          className={`${styles.petal} ${styles[depth]}`}
          style={style}
          aria-hidden="true"
        >
          <PetalShape kind={kind} />
        </span>
      ))}
    </div>
  );
}
