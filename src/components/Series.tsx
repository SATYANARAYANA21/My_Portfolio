"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────────────────────
   ANIMATION CSS
───────────────────────────────────────────────────────────────────────────── */
const ANIM_CSS = `
  /* Hover samurai strike */
  @keyframes k-slash {
    0%   { stroke-dashoffset: 430; opacity: 0; }
    6%   { opacity: 1; }
    42%  { stroke-dashoffset: 0; opacity: 0.95; }
    62%  { stroke-dashoffset: 0; opacity: 0.42; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  }
  @keyframes k-glow {
    0%   { opacity: 0; }
    8%   { opacity: 0.65; }
    42%  { opacity: 0.35; }
    100% { opacity: 0; }
  }
  .sk-frame.struck .sk-slash { animation: k-slash 0.62s cubic-bezier(0.16,1,0.3,1) forwards; }
  .sk-frame.struck .sk-glow  { animation: k-glow  0.62s cubic-bezier(0.16,1,0.3,1) forwards; }

  /* ── LIGHTNING: jagged edge paths ── */
  @keyframes k-ltng-top {
    0%,100% { stroke-dashoffset: 0;    opacity: 1;    }
    25%     { stroke-dashoffset: 40;   opacity: 0.6;  }
    50%     { stroke-dashoffset: -20;  opacity: 1;    }
    75%     { stroke-dashoffset: 15;   opacity: 0.75; }
  }
  @keyframes k-ltng-bot {
    0%,100% { stroke-dashoffset: -10;  opacity: 0.9;  }
    33%     { stroke-dashoffset: 30;   opacity: 1;    }
    66%     { stroke-dashoffset: -25;  opacity: 0.65; }
  }
  @keyframes k-ltng-left {
    0%,100% { stroke-dashoffset: 5;    opacity: 0.85; }
    40%     { stroke-dashoffset: -15;  opacity: 1;    }
    70%     { stroke-dashoffset: 20;   opacity: 0.7;  }
  }
  @keyframes k-ltng-right {
    0%,100% { stroke-dashoffset: -8;   opacity: 1;    }
    30%     { stroke-dashoffset: 18;   opacity: 0.75; }
    60%     { stroke-dashoffset: -30;  opacity: 1;    }
  }

  /* Glow / bloom behind lightning: pulsing */
  @keyframes k-bloom {
    0%, 100% { opacity: 0.28; }
    45%      { opacity: 0.62; }
    70%      { opacity: 0.38; }
  }
  /* Brighter inner halo */
  @keyframes k-inner-halo {
    0%, 100% { opacity: 0.18; filter: blur(6px); }
    50%      { opacity: 0.45; filter: blur(10px); }
  }
  /* Corner hotspot flash */
  @keyframes k-corner-hot {
    0%, 100% { opacity: 0.7;  r: 6;  }
    35%      { opacity: 1;    r: 9;  }
    65%      { opacity: 0.55; r: 5;  }
  }
  /* Spark fly-off */
  @keyframes k-fly {
    0%   { opacity: 1; transform: translate(0,0) scale(1); }
    100% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(0); }
  }

  .aw-ltng-top   { stroke-dasharray: 18 5 8 3 14 4 10 6 20 4; animation: k-ltng-top   0.11s linear infinite; }
  .aw-ltng-bot   { stroke-dasharray: 14 4 10 5 16 3 12 5 18 4; animation: k-ltng-bot  0.13s linear infinite; }
  .aw-ltng-left  { stroke-dasharray: 12 4 8 3 16 5 10 4 14 3;  animation: k-ltng-left  0.09s linear infinite; }
  .aw-ltng-right { stroke-dasharray: 16 3 10 4 14 5 8 4 18 3;  animation: k-ltng-right 0.12s linear infinite; }

  .aw-bloom      { animation: k-bloom      1.6s ease-in-out infinite; }
  .aw-inner-halo { animation: k-inner-halo 2.0s ease-in-out infinite; }

  .aw-corner-hot { animation: k-corner-hot 0.8s ease-in-out infinite; }
  .aw-corner-hot:nth-of-type(2) { animation-delay: 0.2s; }
  .aw-corner-hot:nth-of-type(3) { animation-delay: 0.4s; }
  .aw-corner-hot:nth-of-type(4) { animation-delay: 0.6s; }

  .aw-fly { animation: k-fly 0.6s ease-out forwards; }

  /* Icon activation glow */
  @keyframes k-icon-pulse {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(255,72,32,0.6)); }
    50%       { filter: drop-shadow(0 0 22px rgba(255,72,32,0.95)); }
  }
  .sk-icon-active { animation: k-icon-pulse 2.4s ease-in-out infinite; }

  /* Branching fractures — irregular visible/invisible flicker */
  @keyframes k-branch {
    0%,100% { opacity: 0;    }
    8%      { opacity: 0.95; }
    18%     { opacity: 0.3;  }
    22%     { opacity: 1;    }
    35%     { opacity: 0;    }
    55%     { opacity: 0.7;  }
    70%     { opacity: 0;    }
    85%     { opacity: 0.85; }
  }
  .aw-branch { animation: k-branch 0.45s ease-in-out infinite; }
  .aw-branch:nth-child(2) { animation-delay: 0.11s; }
  .aw-branch:nth-child(3) { animation-delay: 0.23s; }
  .aw-branch:nth-child(4) { animation-delay: 0.07s; }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   SKILL DATA
───────────────────────────────────────────────────────────────────────────── */
const SKILLS = [
  { id: "sk-01", num: "01", title: "PYTHON",                    kanji: "蛇", sub: "PROGRAMMING · AUTOMATE · ANALYSE · BUILD"  },
  { id: "sk-02", num: "02", title: "C · FUNDAMENTALS",          kanji: "基", sub: "SYSTEMS · LOGIC · PERFORMANCE"             },
  { id: "sk-03", num: "03", title: "HTML · CSS",                kanji: "構", sub: "WEB TECHNOLOGIES · STRUCTURE · STYLE"      },
  { id: "sk-04", num: "04", title: "TYPESCRIPT",                kanji: "型", sub: "TYPE · SCALE · DEVELOP"                   },
  { id: "sk-05", num: "05", title: "REACT · NEXT.JS",           kanji: "動", sub: "BUILD MODERN WEB · SSR · COMPONENTS"      },
  { id: "sk-06", num: "06", title: "SQL · MONGODB",             kanji: "集", sub: "DATABASES · STORE · QUERY · PERSIST"      },
  { id: "sk-07", num: "07", title: "GIT · GITHUB",              kanji: "管", sub: "VERSION CONTROL · TRACK · BRANCH"         },
  { id: "sk-08", num: "08", title: "VS CODE · DOCKER",          kanji: "環", sub: "DEVELOP · CONTAINERIZE · SHIP"            },
  { id: "sk-09", num: "09", title: "VERCEL",                    kanji: "展", sub: "DEPLOY · SCALE · SHIP"                    },
  { id: "sk-10", num: "10", title: "FIGMA · CANVA · PHOTOSHOP", kanji: "創", sub: "DESIGN · CREATE · VISUALIZE"              },
  { id: "sk-11", num: "11", title: "AI · BUILDING",             kanji: "智", sub: "EXPLORE IDEAS · BUILD · GROW"             },
] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   CHAPTER DATA
───────────────────────────────────────────────────────────────────────────── */
const CHAPTERS = [
  { num: "01", kanji: "落", title: "Enter the archive",  desc: "your craft, documented"        },
  { num: "02", kanji: "光", title: "Browse the index",   desc: "each frame holds a skill"      },
  { num: "03", kanji: "技", title: "Skills",             desc: "the tools behind the vision"   },
  { num: "04", kanji: "間", title: "Step inside",        desc: "scroll to explore the archive" },
] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */
const FRAME_COUNT = SKILLS.length;
const RADIUS      = 720;
const FRAME_W     = 320;
const FRAME_H     = 240;

/* ─────────────────────────────────────────────────────────────────────────────
   SKILL ICONS — authentic brand colors, recognizable shapes
───────────────────────────────────────────────────────────────────────────── */
function SkillIcon({ idx, active }: { idx: number; active: boolean }) {
  /* 0  PYTHON */
  const Python = (
    <g key="py">
      {/* Top body — blue */}
      <path d="M32 6c-8.3 0-7.8 3.6-7.8 3.6l.01 3.74h7.94v1.12H20.9S16 14.02 16 22.4c0 8.38 4.63 8.08 4.63 8.08h2.77v-3.89s-.15-4.63 4.55-4.63h7.85s4.4.07 4.4-4.26V11.3S40.86 6 32 6zm-4.37 2.53a1.42 1.42 0 1 1 0 2.84 1.42 1.42 0 0 1 0-2.84z" fill="#4B8BBE"/>
      {/* Bottom body — yellow */}
      <path d="M32.08 58c8.3 0 7.8-3.6 7.8-3.6l-.01-3.74H31.93v-1.12h11.18s4.89.4 4.89-7.98-4.63-8.08-4.63-8.08h-2.77v3.89s.15 4.63-4.55 4.63h-7.85s-4.4-.07-4.4 4.26v7.4S23.14 58 32 58zm4.37-2.53a1.42 1.42 0 1 1 0-2.84 1.42 1.42 0 0 1 0 2.84z" fill="#FFD43B"/>
    </g>
  );

  /* 1  C */
  const CLang = (
    <g key="c">
      <circle cx="32" cy="32" r="26" fill="#005A9C" opacity={0.9}/>
      <path d="M 50 18 A 22 22 0 1 0 50 46" stroke="white" strokeWidth="7" fill="none" strokeLinecap="round"/>
      <circle cx="50" cy="18" r="3" fill="#60AFFF"/>
      <circle cx="50" cy="46" r="3" fill="#60AFFF"/>
    </g>
  );

  /* 2  HTML + CSS */
  const HtmlCss = (
    <g key="html">
      {/* HTML5 shield */}
      <polygon points="10,6 14,44 32,50 50,44 54,6" fill="#E44D26"/>
      <polygon points="14,10 17.5,40 32,46 46.5,40 50,10" fill="#F16529"/>
      <polygon points="18,20 20,35 32,39 44,35 46,20" fill="white" opacity={0.2}/>
      <text x="32" y="33" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="14" fill="white">5</text>
      {/* CSS3 smaller shape */}
      <polygon points="38,33 40,50 50,53 60,50 62,33" fill="#264de4" transform="scale(0.58) translate(34, 42)"/>
      <polygon points="39,36 40.5,48 50,51 59.5,48 61,36" fill="#2965f1" transform="scale(0.58) translate(34, 42)"/>
      <text x="52" y="57" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="6" fill="white">3</text>
    </g>
  );

  /* 3  TYPESCRIPT */
  const TypeScript = (
    <g key="ts">
      <rect x="6" y="6" width="52" height="52" rx="6" fill="#007ACC"/>
      <path d="M33 27h9v4h-5v16h-4V31h-5v-4h5z" fill="white"/>
      <path d="M14 39.5c0 3.6 2.5 5.5 6.5 5.5 4 0 6.5-2 6.5-5.4 0-2.8-1.6-4.2-4.5-5.1L21 34c-1.7-.5-2.5-1-2.5-2 0-.9.8-1.5 2-1.5 1.3 0 2.2.7 2.3 2h4c-.1-3.3-2.3-5.5-6.3-5.5-3.7 0-6.2 2-6.2 5.2 0 2.7 1.5 4.2 4.8 5.2l1.5.4c1.8.5 2.7 1.1 2.7 2.2 0 1-.9 1.7-2.3 1.7-1.7 0-2.8-.9-2.9-2.5h-4z" fill="white"/>
    </g>
  );

  /* 4  REACT + NEXT.JS */
  const ReactNext = (
    <g key="react">
      {/* React orbits */}
      <ellipse cx="30" cy="30" rx="22" ry="8" stroke="#61DAFB" strokeWidth="2" fill="none"/>
      <ellipse cx="30" cy="30" rx="22" ry="8" stroke="#61DAFB" strokeWidth="2" fill="none" transform="rotate(60 30 30)"/>
      <ellipse cx="30" cy="30" rx="22" ry="8" stroke="#61DAFB" strokeWidth="2" fill="none" transform="rotate(120 30 30)"/>
      <circle cx="30" cy="30" r="4" fill="#61DAFB"/>
      {/* Next.js N badge */}
      <rect x="42" y="42" width="18" height="18" rx="4" fill="#000"/>
      <path d="M45.5 56.5V45.5l9 11V45.5" stroke="white" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
    </g>
  );

  /* 5  SQL + MONGODB */
  const SqlMongo = (
    <g key="sql">
      {/* Database cylinder */}
      <ellipse cx="22" cy="14" rx="13" ry="5" fill="#336791" stroke="#5098D2" strokeWidth="1"/>
      <rect x="9" y="14" width="26" height="22" fill="#336791"/>
      <ellipse cx="22" cy="36" rx="13" ry="5" fill="#5098D2"/>
      <ellipse cx="22" cy="25" rx="13" ry="5" fill="#5098D2" opacity={0.6}/>
      <text x="22" y="29" textAnchor="middle" fontFamily="monospace" fontWeight="bold" fontSize="7" fill="white">SQL</text>
      {/* MongoDB leaf */}
      <path d="M50 8 Q57 20 57 32 Q57 44 50 56 Q49 44 49 32 Q49 20 50 8Z" fill="#4DB33D"/>
      <path d="M50 8 Q43 20 43 32 Q43 44 50 56 Q49 44 49 32 Q49 20 50 8Z" fill="#3FA62B" opacity={0.7}/>
    </g>
  );

  /* 6  GIT + GITHUB */
  const GitGithub = (
    <g key="git">
      {/* Git diamond logo */}
      <rect x="8" y="8" width="24" height="24" rx="3" fill="#F05033" transform="rotate(45 20 20)"/>
      <path d="M15 20 h10 M20 15 v10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      {/* GitHub octocat simplified */}
      <circle cx="46" cy="34" r="14" fill="#24292E"/>
      <circle cx="46" cy="30" r="8" fill="#f5f0e8"/>
      <circle cx="43" cy="28" r="2" fill="#24292E"/>
      <circle cx="49" cy="28" r="2" fill="#24292E"/>
      <path d="M38 40 Q38 48 46 48 Q54 48 54 40" fill="#f5f0e8"/>
      <circle cx="46" cy="40" r="3" fill="#24292E"/>
    </g>
  );

  /* 7  VS CODE + DOCKER */
  const VsDocker = (
    <g key="vscode">
      {/* VSCode chevron */}
      <path d="M8 15 L26 30 L8 45 L15 52 L48 30 L15 8 Z" fill="#007ACC"/>
      <path d="M48 8 L48 52 L34 30 Z" fill="#005F9E"/>
      {/* Docker whale badge */}
      <rect x="38" y="38" width="24" height="20" rx="4" fill="#0DB7ED" opacity={0.9}/>
      {/* containers on whale */}
      <rect x="40" y="40" width="5" height="4" rx="1" fill="white"/>
      <rect x="47" y="40" width="5" height="4" rx="1" fill="white"/>
      <rect x="54" y="40" width="5" height="4" rx="1" fill="white"/>
      <path d="M40 48 Q49 54 62 48" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </g>
  );

  /* 8  VERCEL */
  const Vercel = (
    <g key="vercel">
      <polygon points="32,8 60,56 4,56" fill="white"/>
    </g>
  );

  /* 9  FIGMA + CANVA + PHOTOSHOP */
  const DesignTools = (
    <g key="figma">
      {/* Figma logo blocks */}
      <rect x="6" y="5" width="14" height="14" rx="7" fill="#F24E1E"/>
      <rect x="6" y="19" width="14" height="14" rx="7" fill="#FF7262"/>
      <rect x="6" y="33" width="14" height="14" rx="7" fill="#1ABCFE"/>
      <rect x="20" y="5" width="14" height="14" rx="7" fill="#A259FF"/>
      <circle cx="27" cy="26" r="7" fill="#0ACF83"/>
      {/* Canva C */}
      <circle cx="45" cy="18" r="9" fill="#00C4CC" opacity={0.9}/>
      <path d="M50 14 A7 7 0 1 0 50 22" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Ps badge */}
      <rect x="38" y="32" width="18" height="18" rx="3" fill="#001e36"/>
      <text x="47" y="45" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="10" fill="#31A8FF">Ps</text>
    </g>
  );

  /* 10  AI BUILDING */
  const AiBuilding = (
    <g key="ai">
      {/* Neural net nodes */}
      {[14, 32, 50].map((x, ci) =>
        [12, 28, 44, 60].map((y, ri) => (
          <circle key={`n${ci}${ri}`} cx={x} cy={y} r={ci === 1 ? 5 : 3.5}
            fill={ci === 0 ? "#a78bfa" : ci === 1 ? "#818cf8" : "#6366f1"}
            opacity={0.9}/>
        ))
      )}
      {/* connections left→mid */}
      {[12, 28, 44, 60].flatMap(y1 =>
        [12, 28, 44, 60].map(y2 => (
          <line key={`lm${y1}${y2}`} x1="17.5" y1={y1} x2="27" y2={y2}
            stroke="#a78bfa" strokeWidth="0.8" opacity={0.25}/>
        ))
      )}
      {/* connections mid→right */}
      {[12, 28, 44, 60].flatMap(y1 =>
        [12, 28, 44, 60].map(y2 => (
          <line key={`mr${y1}${y2}`} x1="37" y1={y1} x2="46.5" y2={y2}
            stroke="#6366f1" strokeWidth="0.8" opacity={0.35}/>
        ))
      )}
      {/* Central glow */}
      <circle cx="32" cy="36" r="6" fill="#818cf8" opacity={0.3}/>
    </g>
  );

  const icons = [Python, CLang, HtmlCss, TypeScript, ReactNext, SqlMongo, GitGithub, VsDocker, Vercel, DesignTools, AiBuilding];

  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"
      className={active ? "sk-icon-active" : ""}
      style={{ width: "100%", height: "100%", overflow: "visible" }}>
      {icons[idx] ?? null}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   AWAKENING BORDER — organic jagged lightning energy effect on selected card
   
   Architecture (back to front):
   1. Thick blurred crimson bloom  (atmosphere)
   2. Semi-transparent orange haze (depth)
   3. Jagged polylines per edge, 2 layers each (core lightning)
   4. Bright line on top of each jagged path (white-red hot core)
   5. Corner radial explosions with multi-ray bursts
   6. Tiny fly-off sparks at corners
───────────────────────────────────────────────────────────────────────────── */
function AwakeningBorder({ w, h }: { w: number; h: number }) {
  // Straight perimeter for bloom layers only
  const perim = `M 2 2 L ${w - 2} 2 L ${w - 2} ${h - 2} L 2 ${h - 2} Z`;

  // ── Jagged lightning paths along each edge ──
  // Each edge is a polyline with irregular zig-zag jitter offset from the true edge.
  // Values are tuned to look like genuine electrical fractures.

  // TOP EDGE  (y=2, x from 2 to w-2)
  const topJag1 = `2,2 28,0 45,4 62,1 80,4 100,0 118,3 135,0 155,4 172,1 190,5 208,0 225,3 242,1 260,4 ${w-2},2`;
  const topJag2 = `2,2 22,5 38,0 58,3 74,6 92,1 112,4 130,0 150,5 168,2 186,0 205,4 220,1 238,5 255,0 ${w-2},2`;

  // BOTTOM EDGE  (y=h-2)
  const botJag1 = `2,${h-2} 26,${h+1} 44,${h-4} 63,${h} 82,${h-4} 101,${h+1} 120,${h-3} 140,${h} 160,${h-4} 178,${h+2} 198,${h-3} 217,${h} 236,${h-4} 255,${h+1} ${w-2},${h-2}`;
  const botJag2 = `2,${h-2} 30,${h-5} 50,${h+1} 70,${h-3} 90,${h+2} 110,${h-4} 130,${h} 152,${h-5} 170,${h+1} 190,${h-3} 210,${h} 228,${h-5} 248,${h+1} ${w-2},${h-2}`;

  // LEFT EDGE  (x=2, y from 2 to h-2)
  const leftJag1 = `2,2 0,22 4,40 1,58 4,75 0,92 3,110 0,128 4,146 1,163 5,180 0,198 3,215 ${2},${h-2}`;
  const leftJag2 = `2,2 5,18 0,36 3,52 6,70 1,88 4,105 0,122 5,140 2,158 0,175 4,192 1,210 ${2},${h-2}`;

  // RIGHT EDGE  (x=w-2, y from 2 to h-2)
  const rightJag1 = `${w-2},2 ${w+1},20 ${w-4},38 ${w},55 ${w-4},72 ${w+2},90 ${w-3},108 ${w},125 ${w-4},143 ${w+1},160 ${w-3},178 ${w},195 ${w-4},212 ${w-2},${h-2}`;
  const rightJag2 = `${w-2},2 ${w-5},18 ${w},36 ${w-3},53 ${w+1},70 ${w-4},88 ${w},105 ${w-5},122 ${w+1},140 ${w-3},158 ${w},175 ${w-4},192 ${w+1},210 ${w-2},${h-2}`;

  // ── Branching Fractures ──
  // These shoot off from the main line to create a chaotic thunder look.
  const topBranch = `M 45 4 L 50 -8 L 56 -14 M 135 0 L 142 -12 L 150 -5 M 208 0 L 215 -10 L 218 -18`;
  const botBranch = `M 63 ${h} L 68 ${h+12} L 75 ${h+6} M 178 ${h+2} L 182 ${h+14} L 190 ${h+10}`;
  const leftBranch = `M 4 40 L -6 45 L -12 38 M 0 128 L -8 135 L -14 142`;
  const rightBranch = `M ${w-4} 72 L ${w+8} 78 L ${w+14} 70 M ${w-4} 143 L ${w+10} 150 L ${w+16} 142`;

  // Corner decorations removed.

  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}
    >
      {/* ══ TOP EDGE — 2 jagged lightning layers ══ */}
      {/* Glow pass */}
      <polyline
        points={topJag1}
        stroke="#ff2200"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="aw-ltng-top"
        style={{ filter: "blur(3px)", opacity: 0.9 }}
      />
      {/* Bright core */}
      <polyline
        points={topJag1}
        stroke="#ffffff"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="aw-ltng-top"
        style={{ filter: "drop-shadow(0 0 5px #ff2200)", opacity: 1 }}
      />
      {/* Second offset jagged layer */}
      <polyline
        points={topJag2}
        stroke="#ff5500"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="aw-ltng-top"
        style={{ filter: "blur(1.5px)", opacity: 0.75, animationDelay: "0.04s" }}
      />

      {/* ══ BOTTOM EDGE ══ */}
      <polyline points={botJag1} stroke="#ff2200" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-ltng-bot" style={{ filter: "blur(3px)", opacity: 0.9 }}/>
      <polyline points={botJag1} stroke="#ffffff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-ltng-bot" style={{ filter: "drop-shadow(0 0 5px #ff2200)", opacity: 1 }}/>
      <polyline points={botJag2} stroke="#ff5500" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-ltng-bot" style={{ filter: "blur(1.5px)", opacity: 0.75, animationDelay: "0.06s" }}/>

      {/* ══ LEFT EDGE ══ */}
      <polyline points={leftJag1} stroke="#ff2200" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-ltng-left" style={{ filter: "blur(3px)", opacity: 0.9 }}/>
      <polyline points={leftJag1} stroke="#ffffff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-ltng-left" style={{ filter: "drop-shadow(0 0 5px #ff2200)", opacity: 1 }}/>
      <polyline points={leftJag2} stroke="#ff5500" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-ltng-left" style={{ filter: "blur(1.5px)", opacity: 0.75, animationDelay: "0.03s" }}/>

      {/* ══ RIGHT EDGE ══ */}
      <polyline points={rightJag1} stroke="#ff2200" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-ltng-right" style={{ filter: "blur(3px)", opacity: 0.9 }}/>
      <polyline points={rightJag1} stroke="#ffffff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-ltng-right" style={{ filter: "drop-shadow(0 0 5px #ff2200)", opacity: 1 }}/>
      <polyline points={rightJag2} stroke="#ff5500" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-ltng-right" style={{ filter: "blur(1.5px)", opacity: 0.75, animationDelay: "0.05s" }}/>

      {/* ══ BRANCHING FRACTURES — lightning spurs off the main edge paths ══ */}
      {/* Each path has M+L segments separated by implied moves so it draws 2–3 separate spurs */}

      {/* Top edge spurs (shooting upward out of the card) */}
      <path d={topBranch}  stroke="#ff3300" strokeWidth="1"   fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-branch"
            style={{ filter: "drop-shadow(0 0 4px #ff1100)" }}/>
      <path d={topBranch}  stroke="#ffffff" strokeWidth="0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-branch"
            style={{ filter: "drop-shadow(0 0 2px #ff4400)", animationDelay: "0.11s" }}/>

      {/* Bottom edge spurs (shooting downward) */}
      <path d={botBranch}  stroke="#ff3300" strokeWidth="1"   fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-branch"
            style={{ filter: "drop-shadow(0 0 4px #ff1100)", animationDelay: "0.23s" }}/>
      <path d={botBranch}  stroke="#ffffff" strokeWidth="0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-branch"
            style={{ filter: "drop-shadow(0 0 2px #ff4400)", animationDelay: "0.07s" }}/>

      {/* Left edge spurs (shooting leftward) */}
      <path d={leftBranch} stroke="#ff3300" strokeWidth="1"   fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-branch"
            style={{ filter: "drop-shadow(0 0 4px #ff1100)", animationDelay: "0.18s" }}/>
      <path d={leftBranch} stroke="#ffffff" strokeWidth="0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-branch"
            style={{ filter: "drop-shadow(0 0 2px #ff4400)", animationDelay: "0.31s" }}/>

      {/* Right edge spurs (shooting rightward) */}
      <path d={rightBranch} stroke="#ff3300" strokeWidth="1"   fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-branch"
            style={{ filter: "drop-shadow(0 0 4px #ff1100)", animationDelay: "0.09s" }}/>
      <path d={rightBranch} stroke="#ffffff" strokeWidth="0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="aw-branch"
            style={{ filter: "drop-shadow(0 0 2px #ff4400)", animationDelay: "0.28s" }}/>

      {/* ── "SKILL ACTIVE" label above the card ── */}
      <text
        x={w / 2} y="-12"
        textAnchor="middle"
        fill="#ff7700"
        fontSize="8"
        fontFamily="monospace"
        fontWeight="bold"
        letterSpacing="3"
        className="aw-bloom"
        style={{ filter: "drop-shadow(0 0 6px #ff1100)", opacity: 1 }}
      >
        ◆  SKILL ACTIVE  ◆
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MECHANICAL CORE
───────────────────────────────────────────────────────────────────────────── */
function MechanicalCore({ energized }: { energized: boolean }) {
  const group      = useRef<THREE.Group>(null);
  const orbitA     = useRef<THREE.Mesh>(null);
  const orbitB     = useRef<THREE.Mesh>(null);
  const innerShard = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const speed = energized ? 0.28 : 0.12;
    group.current.rotation.y += delta * speed;
    group.current.rotation.x  = Math.sin(state.clock.elapsedTime * 0.18) * 0.14;
    if (orbitA.current) orbitA.current.rotation.z += delta * (energized ? 0.55 : 0.28);
    if (orbitB.current) orbitB.current.rotation.x += delta * (energized ? 0.38 : 0.18);
    if (innerShard.current) {
      innerShard.current.rotation.x += delta * (energized ? 0.45 : 0.22);
      innerShard.current.rotation.z += delta * (energized ? 0.28 : 0.14);
    }
  });

  const emissiveColor = energized ? "#ff4820" : "#c5a05a";

  return (
    <group ref={group}>
      <mesh scale={[1.1, 1.8, 1.1]}>
        <octahedronGeometry args={[1.2, 0]}/>
        <meshStandardMaterial color="#050505" roughness={0.12} metalness={0.95}/>
      </mesh>
      <mesh scale={[1.15, 1.88, 1.15]}>
        <octahedronGeometry args={[1.2, 0]}/>
        <meshBasicMaterial color={emissiveColor} wireframe transparent opacity={energized ? 0.32 : 0.18}/>
      </mesh>
      <mesh ref={innerShard} scale={[0.4, 0.7, 0.4]}>
        <octahedronGeometry args={[1, 0]}/>
        <meshStandardMaterial
          color={emissiveColor} roughness={0.1} metalness={1}
          emissive={emissiveColor} emissiveIntensity={energized ? 1.2 : 0.5}/>
      </mesh>
      <mesh ref={orbitA} rotation={[Math.PI / 5, 0, 0]}>
        <torusGeometry args={[2.8, 0.015, 16, 120]}/>
        <meshBasicMaterial color={emissiveColor} transparent opacity={energized ? 0.85 : 0.55}/>
      </mesh>
      <mesh ref={orbitB} rotation={[0, Math.PI / 2, Math.PI / 3]}>
        <torusGeometry args={[2.1, 0.01, 16, 120]}/>
        <meshBasicMaterial color={emissiveColor} transparent opacity={energized ? 0.7 : 0.4}/>
      </mesh>
      {[0, 1, 2, 3].map(i => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.8, 0, Math.sin(a) * 2.8]}>
            <sphereGeometry args={[0.07, 8, 8]}/>
            <meshBasicMaterial color={energized ? "#ff6b00" : "#f5f0e8"}/>
          </mesh>
        );
      })}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CARD CONTENT
───────────────────────────────────────────────────────────────────────────── */
function CardContent({ skill, index, isSelected }: {
  skill: (typeof SKILLS)[number];
  index: number;
  isSelected: boolean;
}) {
  const titleFontSize = index === 9 ? "0.72rem" : (index === 1 || index === 4 ? "0.85rem" : "1.05rem");

  return (
    <div style={{
      width:          "100%",
      height:         "100%",
      position:       "relative",
      overflow:       "hidden",
      background:     isSelected
        ? "rgba(8, 6, 6, 0.82)"
        : "rgba(15, 13, 13, 0.52)",
      backdropFilter: "blur(18px) saturate(130%)",
      WebkitBackdropFilter: "blur(18px) saturate(130%)",
      border:         isSelected
        ? "1px solid rgba(255, 72, 32, 0.6)"
        : "1px solid rgba(197, 160, 90, 0.22)",
      boxShadow:      isSelected
        ? "0 40px 100px rgba(0,0,0,0.9), 0 0 20px rgba(255,50,0,0.5)"
        : "inset 0 0 40px rgba(197, 160, 90, 0.05), 0 20px 50px rgba(0,0,0,0.5)",
      borderRadius:   "6px",
      transition:     "background 0.5s, border 0.5s, box-shadow 0.5s",
    }}>

      {/* ── Inner glow removed to preserve crisp dark glass ── */}

      {/* Corner accent marks */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 12, height: 12,
        borderTop: `1.5px solid ${isSelected ? "#ff4820" : "rgba(197,160,90,0.3)"}`,
        borderLeft: `1.5px solid ${isSelected ? "#ff4820" : "rgba(197,160,90,0.3)"}` }}/>
      <div style={{ position: "absolute", top: 0, right: 0, width: 12, height: 12,
        borderTop: `1.5px solid ${isSelected ? "#ff4820" : "rgba(197,160,90,0.3)"}`,
        borderRight: `1.5px solid ${isSelected ? "#ff4820" : "rgba(197,160,90,0.3)"}` }}/>
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 12, height: 12,
        borderBottom: `1.5px solid ${isSelected ? "#ff4820" : "rgba(197,160,90,0.3)"}`,
        borderLeft: `1.5px solid ${isSelected ? "#ff4820" : "rgba(197,160,90,0.3)"}` }}/>
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12,
        borderBottom: `1.5px solid ${isSelected ? "#ff4820" : "rgba(197,160,90,0.3)"}`,
        borderRight: `1.5px solid ${isSelected ? "#ff4820" : "rgba(197,160,90,0.3)"}` }}/>

      {/* Top strip */}
      <div style={{
        position:      "absolute",
        top: 0, left: 0, right: 0,
        padding:       "11px 16px 8px",
        display:       "flex",
        justifyContent:"space-between",
        alignItems:    "flex-start",
        borderBottom:  "1px solid rgba(245, 240, 232, 0.07)",
      }}>
        <span style={{
          fontFamily:    "monospace",
          fontSize:      "9px",
          color:         isSelected ? "#ff8060" : "#f5f0e8",
          opacity:       isSelected ? 1 : 0.5,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          transition:    "color 0.4s",
        }}>
          スキル {skill.num}
        </span>
        <div style={{
          width:      "16px",
          height:     "16px",
          background: isSelected ? "#ff4820" : "rgba(196, 30, 58, 0.85)",
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "1px",
          boxShadow:  isSelected ? "0 0 14px rgba(255,72,32,0.7)" : "none",
          transition: "box-shadow 0.4s",
        }}>
          <span style={{ fontFamily: "serif", fontSize: "8px", color: "#f5f0e8", lineHeight: 1 }}>技</span>
        </div>
      </div>

      {/* Centre: icon + rule + name + kanji */}
      <div style={{
        position:       "absolute",
        top:            "36px",
        bottom:         "40px",
        left:           0, right: 0,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        gap:            "9px",
        padding:        "8px 16px 0",
      }}>
        {/* Icon — larger when active */}
        <div style={{
          width:      isSelected ? "72px" : "60px",
          height:     isSelected ? "72px" : "60px",
          flexShrink: 0,
          transition: "width 0.5s, height 0.5s",
        }}>
          <SkillIcon idx={index} active={isSelected}/>
        </div>

        {/* Divider rule */}
        <div style={{
          width:      isSelected ? "54px" : "38px",
          height:     "1px",
          background: isSelected ? "linear-gradient(90deg, transparent, #ff4820, transparent)" : "rgba(197, 160, 90, 0.35)",
          flexShrink: 0,
          transition: "width 0.5s, background 0.5s",
        }}/>

        {/* Skill title */}
        <span style={{
          fontFamily:    "var(--font-display, 'Arial Narrow', sans-serif)",
          fontSize:      isSelected ? "1.15rem" : titleFontSize,
          fontWeight:    "800",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color:         "#f5f0e8",
          lineHeight:    1.2,
          textAlign:     "center",
          textShadow:    isSelected
            ? "0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,100,50,0.3)"
            : "0 0 12px rgba(245,240,232,0.2)",
          transition:    "font-size 0.5s, text-shadow 0.5s",
        }}>
          {skill.title}
        </span>

        {/* Kanji accent */}
        <span style={{
          fontFamily: "var(--font-jp, serif)",
          fontSize:   isSelected ? "1.1rem" : "0.9rem",
          color:      isSelected ? "#ff8060" : "#c5a05a",
          opacity:    isSelected ? 0.9 : 0.4,
          lineHeight: 1,
          transition: "color 0.4s, opacity 0.4s",
        }}>
          {skill.kanji}
        </span>
      </div>

      {/* Bottom strip */}
      <div style={{
        position:      "absolute",
        bottom: 0, left: 0, right: 0,
        padding:       "8px 16px",
        borderTop:     "1px solid rgba(245, 240, 232, 0.07)",
        display:       "flex",
        justifyContent:"space-between",
        alignItems:    "center",
        gap:           "8px",
      }}>
        <span style={{
          fontFamily:    "monospace",
          fontSize:      isSelected ? "8px" : "6.5px",
          color:         "#f5f0e8",
          opacity:       isSelected ? 0.75 : 0.4,
          letterSpacing: "0.11em",
          textTransform: "uppercase",
          overflow:      "hidden",
          whiteSpace:    "nowrap",
          flex:          1,
          transition:    "font-size 0.4s, opacity 0.4s",
        }}>
          {skill.sub}
        </span>
        <div style={{
          width:      "22px",
          height:     "1px",
          background: isSelected ? "#ff4820" : "#c5a05a",
          opacity:    0.8,
          flexShrink: 0,
          boxShadow:  isSelected ? "0 0 6px #ff4820" : "none",
          transition: "background 0.4s, box-shadow 0.4s",
        }}/>
      </div>

      {/* ── Hover lightning (only on non-selected) ── */}
      {!isSelected && (
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
          <path className="sk-glow"
            d="M 5 88 L 60 40 L 110 70 L 170 20 L 235 60 L 315 24"
            stroke="#c5a05a" strokeWidth="12" fill="none" strokeLinecap="round"
            style={{ opacity: 0, filter: "blur(7px)", strokeDasharray: "430", strokeDashoffset: "430" }}/>
          <path className="sk-slash"
            d="M 5 88 L 60 40 L 110 70 L 170 20 L 235 60 L 315 24"
            stroke="#f5f0e8" strokeWidth="1.5" fill="none" strokeLinecap="round"
            style={{ opacity: 0, filter: "drop-shadow(0 0 4px #c5a05a)", strokeDasharray: "430", strokeDashoffset: "430" }}/>
        </svg>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SKILL FRAME
───────────────────────────────────────────────────────────────────────────── */
function SkillFrame({
  skill, index, selectedIndex, onSelect, onHoverChange, frameWidth, frameHeight, radius, compact,
}: {
  skill:         (typeof SKILLS)[number];
  index:         number;
  selectedIndex: number | null;
  onSelect:      (i: number | null) => void;
  onHoverChange: (i: number | null) => void;
  frameWidth:    number;
  frameHeight:   number;
  radius:        number;
  compact:       boolean;
}) {
  const isSelected    = selectedIndex === index;
  const isAnySelected = selectedIndex !== null;
  const isDimmed      = isAnySelected && !isSelected;

  const angle    = (index / FRAME_COUNT) * Math.PI * 2;
  const frameRef = useRef<HTMLDivElement>(null);

  const triggerLightning = () => {
    if (isSelected) return;
    const el = frameRef.current;
    if (!el) return;
    el.classList.remove("struck");
    void el.offsetWidth;
    el.classList.add("struck");
    setTimeout(() => el.classList.remove("struck"), 720);
  };

  const transform = isSelected
    ? `rotateY(${angle}rad) translateZ(${compact ? 80 : 300}px) scale(${compact ? 1.08 : 1.7})`
    : `rotateY(${angle}rad) translateZ(${radius}px) scale(1)`;

  return (
    <div
      style={{
        position:       "absolute",
        top:            0, left: 0,
        width:          `${frameWidth}px`,
        height:         `${frameHeight}px`,
        marginLeft:     `${-frameWidth / 2}px`,
        marginTop:      `${-frameHeight / 2}px`,
        transform,
        transformStyle: "preserve-3d",
        transition:     "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s, filter 0.6s",
        opacity:        isDimmed ? 0.22 : 1,
        filter:         isDimmed ? "blur(2.5px) grayscale(50%) brightness(0.7)" : "none",
        zIndex:         isSelected ? 10 : 1,
      }}
    >
      <div
        ref={frameRef}
        className="sk-frame group relative"
        onPointerEnter={() => { onHoverChange(index); triggerLightning(); }}
        onPointerLeave={() => onHoverChange(null)}
        onClick={() => onSelect(isSelected ? null : index)}
        style={{
          width:          "100%",
          height:         "100%",
          pointerEvents:  "auto",
          transformStyle: "preserve-3d",
          cursor:         "pointer",
        }}
      >
        {/* Front face */}
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
          <CardContent skill={skill} index={index} isSelected={isSelected}/>
        </div>
        {/* Back face — correctly oriented (rotated 180°) */}
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <CardContent skill={skill} index={index} isSelected={isSelected}/>
        </div>

        {/* ── Awakening energy border (only on selected) ── */}
        {isSelected && <AwakeningBorder w={frameWidth} h={frameHeight}/>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SERIES — Main export
───────────────────────────────────────────────────────────────────────────── */
export default function Series() {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef    = useRef<HTMLDivElement>(null);
  const worldRef     = useRef<HTMLDivElement>(null);

  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseSmooth = useRef({ x: 0, y: 0 });
  const rafId       = useRef<number>(0);

  const [hoveredIndex,  setHoveredIndex]  = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [stageWidth, setStageWidth] = useState(1280);
  const [isArchiveInView, setIsArchiveInView] = useState(false);

  useEffect(() => {
    const node = stickyRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = entry.contentRect.width;
      if (nextWidth > 0) setStageWidth(nextWidth);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const compactLayout = stageWidth < 768;
  const frameWidth = compactLayout ? Math.max(250, Math.min(320, stageWidth * 0.76)) : FRAME_W;
  const frameHeight = compactLayout ? frameWidth * 0.75 : FRAME_H;
  const radius = compactLayout ? Math.max(460, stageWidth * 1.24) : RADIUS;
  const coreSize = compactLayout ? Math.min(500, stageWidth * 0.78) : 500;

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 25, restDelta: 0.001 });

  const scrollCam = useTransform(smoothProgress, (c) => {
    const eased = c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
    const m     = compactLayout
      ? 1500 * (1 - eased) + 1100 * eased
      : 1200 * (1 - eased) + 310 * eased;
    const d     = eased * Math.PI * 1.5 - 0.28;
    const camY  = compactLayout
      ? 90 * (1 - eased) + 18 * eased + 90 * Math.sin(eased * Math.PI)
      : 140 * (1 - eased) + 25 * eased + 170 * Math.sin(eased * Math.PI);
    const pitch = Math.atan2(camY, m);
    const dist  = Math.hypot(m, camY);
    return { dist, pitch, d };
  });

  const camObjY = useTransform(smoothProgress, (c) => -110 + 35 * Math.sin(c * Math.PI));

  useEffect(() => {
    const sticky = stickyRef.current;
    const world  = worldRef.current;
    if (!sticky || !world) return;

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;

    const onMove = (e: PointerEvent) => {
      const r = sticky.getBoundingClientRect();
      mouseTarget.current.x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      mouseTarget.current.y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      startPointerLoop();
    };
    const onLeave = () => {
      mouseTarget.current.x = 0;
      mouseTarget.current.y = 0;
      startPointerLoop();
    };

    const DEG         = Math.PI / 180;
    const MOUSE_ROT_Y = 160 * DEG;
    const MOUSE_ROT_X = 30  * DEG;
    const LERP        = 0.08;

    let isVisible = false;

    const syncWorldTransform = () => {
      const { dist, pitch, d } = scrollCam.get();
      const mRotY = mouseSmooth.current.x * MOUSE_ROT_Y;
      const mRotX = mouseSmooth.current.y * MOUSE_ROT_X;
      world.style.transform = [
        `translateZ(${-dist}px)`,
        `rotateX(${pitch + mRotX}rad)`,
        `rotateY(${-d + mRotY}rad)`,
      ].join(" ");
    };

    const loop = () => {
      rafId.current = 0;
      if (!isVisible || isCoarse) return;
      mouseSmooth.current.x += (mouseTarget.current.x - mouseSmooth.current.x) * LERP;
      mouseSmooth.current.y += (mouseTarget.current.y - mouseSmooth.current.y) * LERP;
      syncWorldTransform();

      const unsettled = Math.abs(mouseTarget.current.x - mouseSmooth.current.x) > 0.001
        || Math.abs(mouseTarget.current.y - mouseSmooth.current.y) > 0.001;
      if (unsettled) rafId.current = requestAnimationFrame(loop);
    };

    if (!isCoarse) {
      sticky.addEventListener("pointermove",  onMove,  { passive: true });
      sticky.addEventListener("pointerleave", onLeave, { passive: true });
    }
    function startPointerLoop() {
      if (!isVisible || isCoarse || rafId.current) return;
      rafId.current = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      if (!rafId.current) return;
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    };
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      setIsArchiveInView(isVisible);
      if (isVisible) syncWorldTransform();
      else stopLoop();
    }, { threshold: 0.01 });
    visibilityObserver.observe(containerRef.current ?? sticky);
    const stopScrollSubscription = scrollCam.on("change", () => {
      if (isVisible) syncWorldTransform();
    });

    return () => {
      stopScrollSubscription();
      visibilityObserver.disconnect();
      stopLoop();
      if (!isCoarse) {
        sticky.removeEventListener("pointermove",  onMove);
        sticky.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [scrollCam]);

  const activeDisplaySkill = selectedIndex !== null
    ? SKILLS[selectedIndex]
    : (hoveredIndex !== null ? SKILLS[hoveredIndex] : null);

  const chLen     = CHAPTERS.length;
  const chOpacity = CHAPTERS.map((_, i) => {
    const s = i / chLen, e = (i + 1) / chLen;
    return useTransform(smoothProgress,
      [i === 0 ? 0 : s - 0.05, i === 0 ? 0 : s + 0.05, i === chLen-1 ? 1 : e - 0.05, i === chLen-1 ? 1 : e + 0.05],
      [0, 1, 1, 0]);
  });
  const chY = CHAPTERS.map((_, i) => {
    const s = i / chLen, e = (i + 1) / chLen;
    return useTransform(smoothProgress,
      [i === 0 ? 0 : s - 0.1, i === 0 ? 0 : s + 0.05, i === chLen-1 ? 1 : e - 0.05, i === chLen-1 ? 1 : e + 0.1],
      [24, 0, 0, -24]);
  });
  const chBlur = CHAPTERS.map((_, i) => {
    const s = i / chLen, e = (i + 1) / chLen;
    return useTransform(smoothProgress,
      [i === 0 ? 0 : s - 0.1, i === 0 ? 0 : s + 0.05, i === chLen-1 ? 1 : e - 0.05, i === chLen-1 ? 1 : e + 0.1],
      ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]);
  });

  const progressBarH = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="series" ref={containerRef} className="ground-dark relative h-[400vh]">
      <style>{ANIM_CSS}</style>

      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{
          height: "100dvh",
          perspective:         "1300px",
          backgroundImage:     "url('/models/exp-03/skills-background.png.png')",
          backgroundSize:      "cover",
          backgroundPosition:  "center",
          backgroundRepeat:    "no-repeat",
        }}
      >
        {/* Cinematic vignette + overlay darkens when skill is selected */}
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-colors duration-700"
          style={{ backgroundColor: selectedIndex !== null ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.28)" }}
        />

        {/* 3-D world */}
        <div
          aria-label="3D skill archive"
          style={{ position: "absolute", inset: 0, zIndex: 0, transformStyle: "preserve-3d", pointerEvents: "none" }}
        >
          <div
            ref={worldRef}
            style={{ position: "absolute", left: "50%", top: "50%", transformStyle: "preserve-3d" }}
          >
            {SKILLS.map((skill, i) => (
              <SkillFrame
                key={skill.id}
                skill={skill}
                index={i}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                onHoverChange={setHoveredIndex}
                frameWidth={frameWidth}
                frameHeight={frameHeight}
                radius={radius}
                compact={compactLayout}
              />
            ))}

            {/* Central mechanical artifact */}
            <motion.div
              className="pointer-events-none"
              style={{
                position:       "absolute",
                width:          `${coreSize}px`,
                height:         `${coreSize}px`,
                left:           `${-coreSize / 2}px`,
                top:            `${-coreSize / 2}px`,
                y:              camObjY,
                transformStyle: "preserve-3d",
              }}
            >
              <Canvas camera={{ position: [0, 0, 9], fov: 45 }} gl={{ antialias: true, alpha: true }} frameloop={isArchiveInView ? "always" : "demand"}>
                <ambientLight intensity={1.8}/>
                <directionalLight position={[10, 15, 10]} intensity={3.5}/>
                <directionalLight
                  position={[-10, -5, -10]}
                  intensity={selectedIndex !== null ? 3.5 : 1.5}
                  color={selectedIndex !== null ? "#ff4820" : "#c5a05a"}
                />
                <MechanicalCore energized={selectedIndex !== null}/>
              </Canvas>
            </motion.div>
          </div>
        </div>

        {/* ── UI Overlay ── */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {/* Top bar */}
          <div className="wrap absolute inset-x-0 top-24 flex items-center justify-between">
            <div>
              <span className="eyebrow flex items-baseline gap-2.5">
                <span className="text-accent">▶</span>
                <span className="tabular-nums text-ink">EXP 03</span>
                <span className="font-jp text-step--1 text-accent">光</span>
              </span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-ultrawide text-ink/50">
                SKILL ARCHIVE
              </span>
            </div>
            <div className="text-right">
              <span className="hidden font-mono text-step--1 uppercase tracking-ultrawide text-ink/70 sm:block">
                {SKILLS.length} frames · technical index
              </span>
              <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-ultrawide text-ink/40">
                SATYA / 03 · BUILD 2026
              </span>
            </div>
          </div>

          {/* Right Japanese text */}
          <div className="absolute right-[4.5%] top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
            <span className="font-jp select-none" style={{ writingMode: "vertical-rl", fontSize: "0.6rem", letterSpacing: "0.35em", color: "rgba(245, 240, 232, 0.4)" }}>
              技術の旅
            </span>
            <div style={{ width: "1px", height: "36px", background: "rgba(245, 240, 232, 0.2)" }}/>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#ff3b22", opacity: 0.8 }}/>
          </div>

          {/* Giant kanji watermarks */}
          {CHAPTERS.map((ch, i) => (
            <motion.span key={`giant-${i}`} aria-hidden="true"
              style={{ opacity: chOpacity[i] }}
              className="tategaki absolute right-[6%] top-1/2 -translate-y-1/2 select-none font-jp text-[26vh] leading-none text-ink/[0.03]">
              {ch.kanji}
            </motion.span>
          ))}

          {/* Chapter progression footer */}
          <div className="wrap absolute inset-x-0 bottom-24">
            <div className="relative h-28">
              {CHAPTERS.map((ch, i) => (
                <motion.div key={ch.num}
                  className="absolute bottom-0 left-0 flex items-end gap-5"
                  style={{ y: chY[i], opacity: chOpacity[i], filter: chBlur[i], pointerEvents: "none" }}>
                  <span className="font-jp text-[clamp(3rem,9vw,6rem)] leading-[0.8] text-accent drop-shadow-[3px_3px_0_rgba(0,0,0,0.5)]">
                    {ch.kanji}
                  </span>
                  <div className="pb-2">
                    <span className="font-mono text-step--2 uppercase tracking-ultrawide text-ink/60">
                      Chapter {ch.num} / 0{chLen}
                    </span>
                    <p className="font-display text-step-3 uppercase leading-none tracking-tightest text-ink">
                      {ch.title}
                    </p>
                    <p className="mt-1 font-mono text-step--1 lowercase tracking-wide text-ink/50">
                      {ch.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll progress bar */}
          <div className="absolute right-[var(--grid-margin)] top-1/2 h-40 w-px -translate-y-1/2 overflow-hidden bg-ink/20">
            <motion.div className="w-full origin-top bg-accent" style={{ height: progressBarH }}/>
          </div>

          <p className="wrap absolute inset-x-0 bottom-8 font-mono text-step--2 uppercase tracking-ultrawide text-ink/40">
            scroll — explore the archive ↓
          </p>
        </div>

        {/* ── HUD panel: hovered / selected skill info ── */}
        <div
          className="pointer-events-none absolute left-[var(--grid-margin)] top-1/2 z-30"
          style={{
            opacity:    activeDisplaySkill ? 1 : 0,
            transform:  `translateY(${activeDisplaySkill ? "-50%" : "calc(-50% + 12px)"})`,
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <span className="block font-mono text-[9px] uppercase tracking-ultrawide drop-shadow-md"
            style={{ color: selectedIndex !== null ? "#ff8060" : "rgba(197,160,90,0.85)" }}>
            {activeDisplaySkill ? `Specimen ${activeDisplaySkill.num}` : ""}
          </span>
          <span className="block font-display text-step-2 uppercase leading-none tracking-tightest text-ink drop-shadow-lg"
            style={{ textShadow: selectedIndex !== null ? "0 0 18px rgba(255,255,255,0.45)" : "none" }}>
            {activeDisplaySkill?.title ?? ""}
          </span>
          <span className="mt-1 block font-jp text-step-1 leading-none drop-shadow-md transition-colors"
            style={{ color: selectedIndex !== null ? "#ff4820" : "rgba(197,160,90,0.85)" }}>
            {activeDisplaySkill?.kanji ?? ""}
          </span>
          <span className="mt-2 block max-w-[20ch] font-mono text-step--2 lowercase text-ink/60">
            {activeDisplaySkill?.sub.toLowerCase() ?? ""}
          </span>
          <div className="mt-3 h-px w-16 transition-colors duration-500"
            style={{ background: selectedIndex !== null ? "#ff4820" : "rgba(197,160,90,0.6)",
              boxShadow: selectedIndex !== null ? "0 0 8px #ff4820" : "none" }}/>
          <span className="mt-2 block font-mono text-[9px] uppercase tracking-ultrawide text-ink/40">
            DIGITAL ARCHIVE · SATYA
          </span>
        </div>

      </div>
    </section>
  );
}
