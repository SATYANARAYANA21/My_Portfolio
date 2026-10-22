'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const Exp04GlobeLayer = dynamic(() => import('./Exp04GlobeLayer'), { ssr: false });

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT DATA — edit only this block to update all four projects
───────────────────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: '01',
    name: 'YUNETRA',
    kanji: '見る',
    tagline: 'AI Vision Platform for a Safer Tomorrow',
    description:
      'An end-to-end AI-powered computer-vision platform that detects, tracks, and classifies objects in real time using deep-learning models. Built for safety-critical environments where milliseconds matter.',
    category: 'AI · COMPUTER VISION',
    tags: ['Python', 'AI', 'OpenCV', 'Flask'],
    accentColor: '#c5a05a',
    github: null,
    live: null,
    // SVG island concept — floating village with a surveillance eye
    IslandSVG: IslandEye,
  },
  {
    id: '02',
    name: 'TerraTrace',
    kanji: '守る',
    tagline: 'Track. Analyse. Protect Our Planet.',
    description:
      'A geo-intelligence dashboard that aggregates satellite imagery, sensor feeds, and open environmental datasets to surface anomalies — deforestation, urban heat islands, and water-level shifts — in a single interactive map.',
    category: 'GEO · DATA SCIENCE',
    tags: ['React', 'Maps', 'GCP', 'Data'],
    accentColor: '#4caf7d',
    github: null,
    live: null,
    IslandSVG: IslandGlobe,
  },
  {
    id: '03',
    name: 'Drift',
    kanji: '整える',
    tagline: 'Autonomous AI Scheduling Agent',
    description:
      'A conversational AI scheduling agent that learns from your calendar patterns, negotiates meeting slots across participants via LLM-powered dialogue, and automatically blocks focus time to maximise deep-work sessions.',
    category: 'AI · AUTOMATION',
    tags: ['Python', 'LLM', 'Automation', 'API'],
    accentColor: '#7b8cde',
    github: null,
    live: null,
    IslandSVG: IslandBot,
  },
  {
    id: '04',
    name: 'Prompt Wars',
    kanji: '繋ぐ',
    tagline: 'Smart Stadiums & Tournament Operations',
    description:
      'A real-time tournament-management platform for AI prompt-engineering competitions. Handles bracket generation, live scoring, audience voting, and GenAI-powered commentary inside a stadium-themed control room.',
    category: 'PLATFORM · GENAI',
    tags: ['React', 'AI', 'Firebase', 'GenAI'],
    accentColor: '#eb3223',
    github: null,
    live: null,
    IslandSVG: IslandStadium,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   ISLAND SVG ILLUSTRATIONS
───────────────────────────────────────────────────────────────────────────── */

function IslandEye({ hovered }: { hovered: boolean }) {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }}>
      {/* Deep foundation / rocks */}
      <path d="M40 125 Q80 145 120 125 Q115 135 80 138 Q45 135 40 125Z" fill="#1f1508"/>
      {/* Stone island base */}
      <ellipse cx="80" cy="110" rx="64" ry="20" fill="#2a1f0e" opacity="0.9"/>
      <path d="M26 105 Q50 90 80 87 Q110 90 134 105 Q125 118 80 120 Q35 118 26 105Z" fill="#3d2f18"/>
      <path d="M36 100 Q60 85 80 82 Q100 85 124 100" fill="#4a3820" stroke="#5a4830" strokeWidth="1.5"/>
      {/* Cherry tree */}
      <path d="M54 90 Q52 70 56 60 Q58 70 60 90 Z" fill="#4a321a"/>
      <circle cx="58" cy="55" r="16" fill="#c97b8a" opacity="0.85"/>
      <circle cx="50" cy="62" r="10" fill="#d4899a" opacity="0.7"/>
      <circle cx="68" cy="60" r="12" fill="#c97b8a" opacity="0.7"/>
      <circle cx="58" cy="46" r="9" fill="#e8a0b0" opacity="0.6"/>
      {/* Floating petals */}
      {[0, 1, 2].map(i => (
        <motion.ellipse key={i} cx={45 + i * 20} cy={55 + i * 5} rx="3" ry="2" fill="#e8a0b0" opacity="0.6"
          animate={hovered ? { y: [0, 8+i*2, 16], x: [0, -3+i, -6], opacity: [0.6, 0.4, 0] } : {}}
          transition={{ repeat: Infinity, duration: 2.5 + i*0.2, ease: 'easeOut', delay: i * 0.4 }}/>
      ))}
      {/* Watchtower with eye */}
      <path d="M96 90 L100 60 L114 60 L118 90 Z" fill="#2c3e50" opacity="0.8"/>
      <rect x="94" y="58" width="26" height="6" fill="#34495e" rx="1"/>
      <rect x="98" y="54" width="18" height="4" fill="#2c3e50" rx="1"/>
      {/* Eye sensor */}
      <motion.circle cx="107" cy="68" r="7" fill="#0a0a0a"
        animate={hovered ? { r: [7, 8, 7] } : {}}
        transition={{ repeat: Infinity, duration: 1.2 }}/>
      <motion.circle cx="107" cy="68" r="4" fill="#c5a05a"
        animate={hovered ? { r: [4, 5, 4], fill: ['#c5a05a', '#ffcc44', '#c5a05a'] } : {}}
        transition={{ repeat: Infinity, duration: 1.2 }}/>
      <circle cx="107" cy="68" r="1.5" fill="#fff" opacity="0.9"/>
      {/* Scanning lines */}
      <motion.path d="M107 68 L145 45 L155 70 Z" fill="url(#scanGrad)" opacity="0"
        animate={hovered ? { opacity: [0, 0.3, 0] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}/>
      <motion.line x1="107" y1="68" x2="140" y2="55" stroke="#c5a05a" strokeWidth="1" opacity="0.6"
        animate={hovered ? { x2: [140, 130, 150, 135], y2: [55, 50, 65, 58], opacity: [0.6, 1, 0.4, 0.8] } : { opacity: 0 }}
        transition={{ repeat: Infinity, duration: 1.5 }}/>
      {/* Data rings */}
      <motion.ellipse cx="107" cy="68" rx="14" ry="14" stroke="#c5a05a" strokeWidth="0.5" fill="none" opacity="0.3"
        animate={hovered ? { rx: [14, 20], ry: [14, 20], opacity: [0.3, 0], rotate: [0, 90] } : { opacity: 0 }}
        transition={{ repeat: Infinity, duration: 1.5 }} style={{ transformOrigin: '107px 68px' }}/>
      
      {/* Drones */}
      {[
        { cx: 80, cy: 32, delay: 0 },
        { cx: 120, cy: 40, delay: 1.5 }
      ].map((drone, i) => (
        <motion.g key={i} animate={hovered ? { y: [-4, 0, -4], x: [-2, 2, -2] } : { y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: drone.delay }}>
          <ellipse cx={drone.cx} cy={drone.cy} rx="9" ry="3.5" fill="#34495e"/>
          <line x1={drone.cx - 7} y1={drone.cy} x2={drone.cx - 12} y2={drone.cy - 3} stroke="#5a6a7a" strokeWidth="1.5"/>
          <line x1={drone.cx + 7} y1={drone.cy} x2={drone.cx + 12} y2={drone.cy - 3} stroke="#5a6a7a" strokeWidth="1.5"/>
          <circle cx={drone.cx - 12} cy={drone.cy - 3} r="3" fill="#2c3e50"/>
          <circle cx={drone.cx + 12} cy={drone.cy - 3} r="3" fill="#2c3e50"/>
          <circle cx={drone.cx} cy={drone.cy + 1.5} r="2" fill="#c5a05a" opacity="0.9"/>
          {hovered && (
            <motion.line x1={drone.cx} y1={drone.cy + 2} x2={drone.cx} y2={drone.cy + 20} stroke="#c5a05a" strokeWidth="0.5"
              animate={{ opacity: [0, 0.6, 0] }} transition={{ repeat: Infinity, duration: 1, delay: drone.delay }}/>
          )}
        </motion.g>
      ))}
      
      {/* Defs */}
      <defs>
        <linearGradient id="scanGrad" x1="107" y1="68" x2="145" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c5a05a" stopOpacity="0.8"/>
          <stop offset="1" stopColor="#c5a05a" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function IslandGlobe({ hovered }: { hovered: boolean }) {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }}>
      {/* Deep foundation */}
      <path d="M38 126 Q80 148 122 126 Q118 135 80 140 Q42 135 38 126Z" fill="#0f1f14"/>
      {/* Island base */}
      <ellipse cx="80" cy="112" rx="62" ry="18" fill="#1a2a1a" opacity="0.9"/>
      <path d="M26 108 Q50 94 80 91 Q110 94 134 108 Q128 122 80 124 Q32 122 26 108Z" fill="#1e3220"/>
      {/* Terrain features */}
      <path d="M40 98 Q60 88 80 86 Q100 88 120 98" fill="none" stroke="#2a452a" strokeWidth="1.5"/>
      {/* Trees - Left group */}
      <rect x="44" y="82" width="3" height="18" fill="#2d4a1e"/>
      <ellipse cx="45.5" cy="78" rx="8" ry="10" fill="#2d6a20"/>
      <ellipse cx="45.5" cy="73" rx="6" ry="8" fill="#388a25"/>
      <rect x="36" y="88" width="2.5" height="12" fill="#2d4a1e"/>
      <ellipse cx="37" cy="85" rx="6" ry="7" fill="#2d6a20"/>
      <ellipse cx="37" cy="81" rx="4" ry="5" fill="#388a25"/>
      {/* Trees - Right group */}
      <rect x="112" y="84" width="3" height="16" fill="#2d4a1e"/>
      <ellipse cx="113.5" cy="80" rx="7" ry="9" fill="#2d6a20"/>
      <ellipse cx="113.5" cy="75" rx="5" ry="7" fill="#388a25"/>
      {/* Solar panels */}
      <rect x="54" y="90" width="14" height="9" fill="#1a3a5c" rx="1" transform="skewX(-10)"/>
      <rect x="70" y="90" width="14" height="9" fill="#1a3a5c" rx="1" transform="skewX(-10)"/>
      <line x1="61" y1="90" x2="61" y2="99" stroke="#2a5a8c" strokeWidth="0.5"/>
      <line x1="68" y1="90" x2="68" y2="99" stroke="#2a5a8c" strokeWidth="0.5"/>
      <line x1="77" y1="90" x2="77" y2="99" stroke="#2a5a8c" strokeWidth="0.5"/>
      {/* Satellite Dish */}
      <path d="M125 90 Q120 85 115 90 Q118 95 125 90Z" fill="#c0c8d0"/>
      <line x1="120" y1="90" x2="116" y2="84" stroke="#c0c8d0" strokeWidth="1"/>
      <circle cx="116" cy="84" r="1.5" fill="#4caf7d"/>
      <line x1="120" y1="93" x2="120" y2="102" stroke="#5a6a7a" strokeWidth="2"/>
      <motion.path d="M112 80 Q110 75 116 72" stroke="#4caf7d" strokeWidth="1" fill="none" opacity="0"
        animate={hovered ? { opacity: [0, 0.8, 0] } : {}} transition={{ repeat: Infinity, duration: 2 }}/>
      
      {/* Globe hologram */}
      <motion.g animate={{ rotate: hovered ? 360 : 0 }} transition={{ duration: hovered ? 8 : 0, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '80px 60px' }}>
        <circle cx="80" cy="60" r="26" fill="#0a1520" stroke="#4caf7d" strokeWidth="1.5" opacity="0.9"/>
        {/* continents */}
        <ellipse cx="74" cy="56" rx="9" ry="6" fill="#2d6a20" opacity="0.8"/>
        <ellipse cx="88" cy="60" rx="7" ry="9" fill="#2d6a20" opacity="0.7"/>
        <ellipse cx="79" cy="68" rx="6" ry="4" fill="#2d6a20" opacity="0.6"/>
        <ellipse cx="64" cy="64" rx="4" ry="5" fill="#2d6a20" opacity="0.5"/>
        {/* lat/lon lines */}
        <ellipse cx="80" cy="60" rx="26" ry="9" stroke="#4caf7d" strokeWidth="0.5" opacity="0.4"/>
        <ellipse cx="80" cy="60" rx="9" ry="26" stroke="#4caf7d" strokeWidth="0.5" opacity="0.4"/>
        <line x1="80" y1="34" x2="80" y2="86" stroke="#4caf7d" strokeWidth="0.5" opacity="0.4"/>
        <line x1="54" y1="60" x2="106" y2="60" stroke="#4caf7d" strokeWidth="0.5" opacity="0.4"/>
      </motion.g>
      {/* Orbiting satellite */}
      <motion.g animate={{ rotate: hovered ? -360 : 0 }} transition={{ duration: hovered ? 6 : 0, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '80px 60px' }}>
        <rect x="110" y="58" width="8" height="4" fill="#4caf7d" opacity="0.8" rx="1"/>
        <rect x="112" y="59" width="4" height="2" fill="#fff"/>
      </motion.g>
      
      {/* Holographic Data Graphs */}
      {hovered && (
        <motion.g opacity="0" animate={{ opacity: [0, 0.8, 0.8, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
          {/* Top-left graph */}
          <rect x="40" y="30" width="18" height="12" fill="#0a1520" stroke="#4caf7d" strokeWidth="0.5" opacity="0.8"/>
          <polyline points="42,38 46,36 50,39 54,32 56,34" fill="none" stroke="#ffcc44" strokeWidth="1"/>
          {/* Top-right stats */}
          <rect x="102" y="30" width="20" height="14" fill="#0a1520" stroke="#4caf7d" strokeWidth="0.5" opacity="0.8"/>
          <rect x="105" y="34" width="4" height="8" fill="#4caf7d"/>
          <rect x="111" y="37" width="4" height="5" fill="#4caf7d" opacity="0.7"/>
          <rect x="117" y="32" width="4" height="10" fill="#4caf7d" opacity="0.9"/>
        </motion.g>
      )}

      {/* Hologram base */}
      <motion.ellipse cx="80" cy="90" rx="16" ry="4.5" fill="#4caf7d" opacity="0.15"
        animate={hovered ? { opacity: [0.15, 0.4, 0.15], ry: [4.5, 5.5, 4.5] } : {}}
        transition={{ repeat: Infinity, duration: 1.8 }}/>
      <path d="M64 90 L80 86 L96 90 Z" fill="#4caf7d" opacity="0.1"/>
      
      {/* Data streams */}
      {hovered && ['20', '30', '40'].map((dash, i) => (
        <motion.circle key={i} cx="80" cy="60" r={28 + i * 7}
          stroke="#4caf7d" strokeWidth="0.5" strokeDasharray={dash} fill="none" opacity="0.3"
          animate={{ r: [28 + i * 7, 33 + i * 7], opacity: [0.4, 0], rotate: [0, 30] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.5 }} style={{ transformOrigin: '80px 60px' }}/>
      ))}
    </svg>
  );
}

function IslandBot({ hovered }: { hovered: boolean }) {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }}>
      {/* Deep foundation */}
      <path d="M40 128 Q80 148 120 128 Q115 135 80 138 Q45 135 40 128Z" fill="#0d0d1a"/>
      {/* Island */}
      <ellipse cx="80" cy="112" rx="60" ry="18" fill="#1a1a2a" opacity="0.9"/>
      <path d="M24 108 Q52 93 80 90 Q108 93 136 108 Q130 120 80 123 Q30 120 24 108Z" fill="#22223a"/>
      
      {/* Data Cables */}
      <path d="M30 115 Q40 125 50 115" stroke="#7b8cde" strokeWidth="1" fill="none" opacity="0.5"/>
      <path d="M110 115 Q120 125 130 115" stroke="#4caf7d" strokeWidth="1" fill="none" opacity="0.4"/>
      
      {/* Desk surface */}
      <rect x="42" y="90" width="76" height="6" fill="#2a2040" rx="2"/>
      <rect x="48" y="93" width="64" height="3" fill="#33305a" rx="1"/>
      
      {/* Background Server Rack */}
      <rect x="52" y="65" width="16" height="25" fill="#151525" rx="1" stroke="#33305a" strokeWidth="1"/>
      {[0, 1, 2, 3].map(i => (
        <motion.rect key={i} x="54" y={68 + i * 5} width="12" height="2" fill={i % 2 === 0 ? "#7b8cde" : "#4caf7d"} rx="0.5"
          animate={hovered ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.5 }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}/>
      ))}
      
      {/* Monitor */}
      <rect x="62" y="62" width="40" height="26" fill="#0d0d1a" rx="3" stroke="#7b8cde" strokeWidth="1"/>
      <rect x="65" y="65" width="34" height="20" fill="#0a0a2a" rx="2"/>
      {/* Screen content - code lines */}
      <motion.rect x="68" y="68" width={22} height="2" fill="#7b8cde" rx="1"
        animate={hovered ? { width: [22, 30, 24, 32, 22] } : {}} transition={{ repeat: Infinity, duration: 2 }}/>
      <rect x="68" y="72" width="16" height="1.5" fill="#7b8cde" opacity="0.5" rx="1"/>
      <rect x="68" y="75" width="20" height="1.5" fill="#4caf7d" opacity="0.7" rx="1"/>
      <motion.rect x="68" y="78" width="10" height="1.5" fill="#7b8cde" opacity="0.4" rx="1"
        animate={hovered ? { opacity: [0.4, 1, 0.4] } : {}} transition={{ repeat: Infinity, duration: 0.8 }}/>
      {/* Cursor blink */}
      <motion.rect x="79" y="78" width="1.5" height="2" fill="#fff"
        animate={hovered ? { opacity: [1, 0, 1] } : { opacity: 0 }} transition={{ repeat: Infinity, duration: 0.6 }}/>
      {/* Monitor stand */}
      <rect x="78" y="88" width="6" height="5" fill="#33305a"/>
      <path d="M72 93 L90 93" stroke="#33305a" strokeWidth="2"/>
      
      {/* Holographic Calendar / Tasks */}
      {hovered && (
        <motion.g opacity="0" animate={{ opacity: [0, 0.9, 0.9, 0], y: [5, -5, -5, -10] }} transition={{ repeat: Infinity, duration: 4 }}>
          {/* Calendar floating block */}
          <rect x="30" y="45" width="24" height="16" fill="#0a0a2a" stroke="#7b8cde" strokeWidth="0.5" opacity="0.8"/>
          <rect x="30" y="45" width="24" height="4" fill="#7b8cde" opacity="0.8"/>
          <circle cx="34" cy="47" r="1" fill="#fff"/>
          <rect x="34" y="52" width="6" height="6" fill="#4caf7d" opacity="0.8"/>
          <rect x="42" y="52" width="8" height="2" fill="#7b8cde" opacity="0.5"/>
          <rect x="42" y="56" width="5" height="2" fill="#7b8cde" opacity="0.5"/>
        </motion.g>
      )}

      {/* Floating Code Cubes */}
      {[
        { x: 120, y: 65, size: 6, delay: 0 },
        { x: 130, y: 55, size: 4, delay: 0.5 },
        { x: 35, y: 75, size: 5, delay: 1 }
      ].map((cube, i) => (
        <motion.rect key={i} x={cube.x} y={cube.y} width={cube.size} height={cube.size} fill="none" stroke="#7b8cde" strokeWidth="0.5"
          animate={hovered ? { y: [0, -10, 0], rotate: [0, 180], opacity: [0.3, 0.8, 0.3] } : { opacity: 0 }}
          transition={{ repeat: Infinity, duration: 3 + i, delay: cube.delay }}/>
      ))}
      
      {/* Robot */}
      <motion.g animate={hovered ? { y: [-3, 1, -3] } : { y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}>
        <rect x="104" y="72" width="22" height="20" fill="#2c2c4a" rx="4" stroke="#7b8cde" strokeWidth="0.8"/>
        {/* Eyes */}
        <circle cx="110" cy="79" r="3.5" fill="#7b8cde" opacity="0.9"/>
        <motion.circle cx="110" cy="79" r="1.5" fill="#fff"
          animate={hovered ? { opacity: [1, 0.3, 1] } : {}} transition={{ repeat: Infinity, duration: 1.2 }}/>
        <circle cx="119" cy="79" r="3.5" fill="#7b8cde" opacity="0.9"/>
        <motion.circle cx="119" cy="79" r="1.5" fill="#fff"
          animate={hovered ? { opacity: [0.3, 1, 0.3] } : {}} transition={{ repeat: Infinity, duration: 1.2 }}/>
        {/* Mouth/Speaker */}
        <rect x="109" y="86" width="11" height="2.5" fill="#7b8cde" opacity="0.6" rx="1"/>
        <motion.rect x="109" y="86" width="11" height="2.5" fill="#fff" opacity="0"
          animate={hovered ? { opacity: [0, 0.8, 0, 0.8, 0] } : {}} transition={{ repeat: Infinity, duration: 2, times: [0, 0.1, 0.2, 0.3, 1] }} rx="1"/>
        
        {/* Antenna */}
        <line x1="115" y1="72" x2="115" y2="65" stroke="#7b8cde" strokeWidth="1"/>
        <motion.circle cx="115" cy="64" r="2.5" fill="#7b8cde"
          animate={hovered ? { fill: ['#7b8cde', '#c0c8ff', '#7b8cde'], r: [2.5, 3.5, 2.5] } : {}} transition={{ repeat: Infinity, duration: 0.9 }}/>
      </motion.g>
      {/* Small books/gear */}
      <rect x="44" y="84" width="12" height="6" fill="#33305a" rx="1"/>
      <rect x="46" y="82" width="8" height="4" fill="#4a4070" rx="0.5"/>
      <circle cx="50" cy="88" r="1.5" fill="#7b8cde" opacity="0.6"/>
    </svg>
  );
}

function IslandStadium({ hovered }: { hovered: boolean }) {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }}>
      {/* Deep foundation */}
      <path d="M38 128 Q80 148 122 128 Q118 135 80 138 Q42 135 38 128Z" fill="#150a0a"/>
      {/* Island */}
      <ellipse cx="80" cy="113" rx="64" ry="19" fill="#1a0a0a" opacity="0.9"/>
      <path d="M22 108 Q50 93 80 90 Q110 93 138 108 Q132 122 80 125 Q28 122 22 108Z" fill="#2a1010"/>
      
      {/* Stadium bowl */}
      <ellipse cx="80" cy="88" rx="42" ry="18" fill="#1a0808" stroke="#eb3223" strokeWidth="1.5"/>
      <ellipse cx="80" cy="88" rx="34" ry="14" fill="#0d0505" stroke="#eb3223" strokeWidth="0.8" opacity="0.7"/>
      {/* Field */}
      <ellipse cx="80" cy="90" rx="22" ry="9" fill="#1e4a1e"/>
      <ellipse cx="80" cy="90" rx="12" ry="5" fill="#1e4a1e" stroke="#2d6a2d" strokeWidth="0.8"/>
      <line x1="80" y1="81" x2="80" y2="99" stroke="#2d6a2d" strokeWidth="0.8"/>
      <circle cx="80" cy="90" r="2" fill="none" stroke="#2d6a2d" strokeWidth="0.5"/>
      
      {/* Seats (rings) */}
      {[38, 32, 26].map((rx, i) => (
        <motion.ellipse key={i} cx="80" cy="88" rx={rx} ry={rx * 0.42}
          stroke={['#eb3223','#c5a05a','#eb3223'][i]} strokeWidth="2.5" fill="none" opacity={0.4 + i * 0.15}
          animate={hovered ? { opacity: [0.4 + i * 0.15, 0.9, 0.4 + i * 0.15] } : {}}
          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}/>
      ))}
      
      {/* Floating Holographic Bracket */}
      {hovered && (
        <motion.g opacity="0" animate={{ opacity: [0, 0.8, 0.8, 0], y: [0, -5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
          {/* Left bracket */}
          <polyline points="45,65 52,65 52,60 60,60" fill="none" stroke="#eb3223" strokeWidth="0.5"/>
          <polyline points="45,55 52,55 52,60" fill="none" stroke="#eb3223" strokeWidth="0.5"/>
          {/* Right bracket */}
          <polyline points="115,65 108,65 108,60 100,60" fill="none" stroke="#eb3223" strokeWidth="0.5"/>
          <polyline points="115,55 108,55 108,60" fill="none" stroke="#eb3223" strokeWidth="0.5"/>
          {/* Finals */}
          <line x1="60" y1="60" x2="100" y2="60" stroke="#c5a05a" strokeWidth="1" opacity="0.6" strokeDasharray="2"/>
          <circle cx="80" cy="60" r="3" fill="#eb3223" opacity="0.8"/>
        </motion.g>
      )}

      {/* Light towers */}
      {[45, 115].map((x, i) => (
        <g key={i}>
          <rect x={x - 1.5} y="62" width="3" height="30" fill="#3a1010"/>
          <motion.rect x={x - 6} y="58" width="12" height="5" fill="#ffee44" rx="1"
            animate={hovered ? { opacity: [0.8, 1, 0.8], fill: ['#ffee44', '#ffffff', '#ffee44'] } : { opacity: 0.5 }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}/>
          {/* Extra lights */}
          <motion.rect x={x - 4} y="54" width="8" height="3" fill="#ffee44" rx="0.5"
            animate={hovered ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.3 }}
            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}/>
          {/* Light cone */}
          {hovered && (
            <motion.path d={`M ${x} 64 L ${80 - (i === 0 ? 20 : -20)} 90`}
              stroke="#ffee44" strokeWidth="4" opacity="0.15"
              animate={{ opacity: [0.1, 0.25, 0.1] }} transition={{ repeat: Infinity, duration: 1.5 }}/>
          )}
        </g>
      ))}
      
      {/* Scoreboard */}
      <motion.rect x="64" y="48" width="32" height="14" fill="#0a0a0a" rx="2" stroke="#eb3223" strokeWidth="1"
        animate={hovered ? { stroke: ['#eb3223', '#ff6644', '#eb3223'], y: [-2, 0, -2] } : {}} transition={{ repeat: Infinity, duration: 2 }}/>
      <motion.text x="80" y="57.5" textAnchor="middle" fill="#eb3223" fontSize="7" fontFamily="monospace" fontWeight="bold"
        animate={hovered ? { fill: ['#eb3223', '#ff8844', '#eb3223'] } : {}} transition={{ repeat: Infinity, duration: 0.8 }}>
        LIVE
      </motion.text>
      
      {/* Confetti Particles */}
      {hovered && [0, 1, 2, 3, 4, 5].map(i => (
        <motion.rect key={i} x={60 + i * 8} y={70} width="1.5" height="1.5"
          fill={i % 3 === 0 ? '#eb3223' : i % 3 === 1 ? '#c5a05a' : '#fff'}
          animate={{ y: [0, 20], x: [0, (i % 2 === 0 ? 5 : -5)], opacity: [1, 0], rotate: [0, 180] }}
          transition={{ repeat: Infinity, duration: 1.5 + i * 0.2, ease: 'linear' }}/>
      ))}

      {/* Flags */}
      {[55, 105].map((x, i) => (
        <motion.g key={i} animate={hovered ? { rotate: [0, 8, -4, 0] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }} style={{ transformOrigin: `${x}px 70px` }}>
          <line x1={x} y1="70" x2={x} y2="52" stroke="#3a1010" strokeWidth="1.5"/>
          <path d={`M ${x} 52 L ${x + (i === 0 ? 12 : -12)} 56 L ${x} 60Z`} fill="#eb3223"/>
        </motion.g>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FLOATING PARTICLES
───────────────────────────────────────────────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: 5 + (i * 17) % 93,
    y: 10 + (i * 23) % 85,
    size: 1 + (i % 3) * 0.5,
    delay: (i * 0.4) % 3,
    duration: 3 + (i % 4),
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map(p => (
        <motion.div key={p.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: 0.15 }}
          animate={{ y: [-8, 8, -8], opacity: [0.08, 0.25, 0.08] }}
          transition={{ repeat: Infinity, duration: p.duration, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
      {/* Sketch lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" opacity="0.4">
        <path d="M 100 200 Q 200 180 300 210 Q 400 240 500 190" stroke="white" strokeWidth="1" fill="none"/>
        <path d="M 800 100 Q 900 130 1000 110 Q 1100 90 1150 120" stroke="white" strokeWidth="1" fill="none"/>
        <path d="M 50 600 Q 150 580 250 610" stroke="white" strokeWidth="0.8" fill="none"/>
        <text x="950" y="120" fill="white" fontSize="12" fontFamily="monospace" opacity="0.6">作る</text>
        <text x="960" y="140" fill="white" fontSize="12" fontFamily="monospace" opacity="0.5">学ぶ</text>
        <text x="940" y="160" fill="white" fontSize="12" fontFamily="monospace" opacity="0.4">成長する</text>
        <text x="950" y="180" fill="white" fontSize="12" fontFamily="monospace" opacity="0.3">繰り返す</text>
        <text x="180" y="680" fill="white" fontSize="11" fontFamily="monospace" opacity="0.5" letterSpacing="3">SMALL</text>
        <text x="170" y="695" fill="white" fontSize="11" fontFamily="monospace" opacity="0.5" letterSpacing="3">PROJECTS</text>
        <text x="185" y="710" fill="white" fontSize="11" fontFamily="monospace" opacity="0.5" letterSpacing="3">BIG</text>
        <text x="155" y="725" fill="white" fontSize="11" fontFamily="monospace" opacity="0.5" letterSpacing="3">POSSIBILITIES</text>
        <text x="1000" y="670" fill="white" fontSize="11" fontFamily="monospace" opacity="0.5" letterSpacing="3">EXPLORE ←</text>
        <text x="1010" y="685" fill="white" fontSize="11" fontFamily="monospace" opacity="0.5" letterSpacing="3">BUILD ←</text>
        <text x="1005" y="700" fill="white" fontSize="11" fontFamily="monospace" opacity="0.5" letterSpacing="3">GROW ←</text>
        <text x="998" y="715" fill="white" fontSize="11" fontFamily="monospace" opacity="0.5" letterSpacing="3">REPEAT ←</text>
        {/* Handwritten accent text */}
        <text x="820" y="80" fill="white" fontSize="16" fontFamily="var(--font-comic, cursive)" opacity="0.7" transform="rotate(-8, 820, 80)">Ideas'</text>
        <text x="840" y="100" fill="white" fontSize="16" fontFamily="var(--font-comic, cursive)" opacity="0.7" transform="rotate(-8, 840, 100)">Build</text>
        <text x="820" y="120" fill="white" fontSize="16" fontFamily="var(--font-comic, cursive)" opacity="0.7" transform="rotate(-8, 820, 120)">A Better</text>
        <text x="825" y="140" fill="white" fontSize="16" fontFamily="var(--font-comic, cursive)" opacity="0.7" transform="rotate(-8, 825, 140)">Tomorrow</text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT CARD
───────────────────────────────────────────────────────────────────────────── */
function ProjectCard({
  project,
  index,
  isAnySelected,
  onSelect,
}: {
  project: typeof PROJECTS[number];
  index: number;
  isAnySelected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { IslandSVG } = project;

  return (
    <motion.div
      className="relative flex flex-col cursor-pointer select-none"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      animate={{ opacity: isAnySelected ? 0.3 : 1, scale: isAnySelected ? 0.96 : 1 }}
      whileHover={{ opacity: 1, scale: 1.03, zIndex: 20 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onSelect}
    >
      {/* Floating island illustration — height scales with viewport */}
      <motion.div
        className="relative w-full"
        style={{ height: 'clamp(200px, 32vh, 340px)', marginBottom: 'clamp(12px, 2vh, 24px)' }}
        animate={{ y: hovered ? -10 : 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      >
        {/* Drop shadow */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
          style={{ background: 'rgba(0,0,0,0.5)', filter: 'blur(12px)' }}
          animate={{ width: hovered ? 120 : 85, height: hovered ? 16 : 11 }}
          transition={{ duration: 0.4 }}
        />
        <IslandSVG hovered={hovered} />
        {/* Kanji banner — parchment style */}
        <div
          className="absolute flex items-center justify-center"
          style={{ bottom: 24, right: '8%', width: 24, height: 54 }}
        >
          <div style={{
            background: 'rgba(235,225,215,0.92)',
            border: `1px solid ${project.accentColor}bb`,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '2px 3px 8px rgba(0,0,0,0.4)',
            transform: 'rotate(1.5deg)',
            transformOrigin: 'top center',
            position: 'relative'
          }}>
            <div className="absolute top-0.5 w-1 h-1 rounded-full" style={{ background: '#555' }} />
            <span style={{
              writingMode: 'vertical-rl',
              color: '#1a1a1a',
              fontSize: 11,
              fontFamily: 'serif',
              fontWeight: 'bold',
              letterSpacing: 1.5,
            }}>
              {project.kanji}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Info block — compact */}
      <div style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)', position: 'relative' }}>
        {/* Subtle dark backing only behind text */}
        <div className="absolute inset-0 -z-10" style={{
          background: 'radial-gradient(ellipse at bottom left, rgba(0,0,0,0.45) 0%, transparent 80%)',
          filter: 'blur(8px)'
        }} />

        {/* Project number + accent line */}
        <div className="flex items-center gap-2 mb-1.5">
          <span style={{ color: 'rgba(245,240,232,0.85)', fontFamily: 'monospace', fontSize: 11 }}>
            {project.id}
          </span>
          <div style={{ height: 1, flex: 1, maxWidth: 20, background: project.accentColor, opacity: 0.9 }} />
        </div>

        {/* Project name */}
        <motion.h3
          style={{
            color: '#f5f0e8',
            fontFamily: 'var(--font-display, "Arial Narrow", Arial, sans-serif)',
            fontSize: 'clamp(16px, 2vw, 22px)',
            fontWeight: 800,
            letterSpacing: '0.02em',
            lineHeight: 1.1,
            marginBottom: 4,
            textShadow: hovered ? `0 0 20px ${project.accentColor}99, 0 2px 8px rgba(0,0,0,0.9)` : '0 2px 8px rgba(0,0,0,0.9)',
          }}
          animate={{ color: hovered ? project.accentColor : '#f5f0e8' }}
          transition={{ duration: 0.25 }}
        >
          {project.name}
        </motion.h3>

        {/* Tagline */}
        <p style={{
          color: 'rgba(245,240,232,0.55)',
          fontSize: 'clamp(9px, 1vw, 12px)',
          lineHeight: 1.4,
          marginBottom: 8,
          maxWidth: 200
        }}>
          {project.tagline}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.tags.map(tag => (
            <span key={tag} style={{
              background: 'rgba(10,8,6,0.55)',
              border: '1px solid rgba(245,240,232,0.14)',
              color: 'rgba(245,240,232,0.65)',
              fontSize: 9,
              padding: '2px 7px',
              borderRadius: 12,
              letterSpacing: '0.04em',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* View Project button */}
        <motion.button
          onClick={e => { e.stopPropagation(); onSelect(); }}
          whileHover={{ scale: 1.05 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: 'rgba(10,8,6,0.35)',
            border: `1px solid ${hovered ? project.accentColor : 'rgba(245,240,232,0.28)'}`,
            cursor: 'pointer',
            color: hovered ? project.accentColor : 'rgba(245,240,232,0.85)',
            fontSize: 11,
            padding: '6px 16px',
            borderRadius: 20,
            transition: 'all 0.25s ease',
          }}
        >
          View Project →
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DETAIL PANEL
───────────────────────────────────────────────────────────────────────────── */
function DetailPanel({ project, onClose }: { project: typeof PROJECTS[number]; onClose: () => void }) {
  const { IslandSVG } = project;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        className="relative max-w-2xl w-full"
        initial={{ y: 40, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(10, 8, 6, 0.95)',
          border: `1px solid ${project.accentColor}55`,
          borderRadius: 8,
          boxShadow: `0 0 80px ${project.accentColor}22, 0 40px 80px rgba(0,0,0,0.8)`,
          overflow: 'hidden',
        }}
      >
        {/* Header accent bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${project.accentColor}, transparent)` }} />

        <div className="p-8 md:p-10">
          <div className="flex items-start gap-8">
            {/* Island visual */}
            <div className="hidden md:block flex-shrink-0" style={{ width: 160, height: 140 }}>
              <IslandSVG hovered={true} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span style={{ color: 'rgba(245,240,232,0.4)', fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em' }}>
                  {project.id} — {project.category}
                </span>
                <button onClick={onClose}
                  style={{ color: 'rgba(245,240,232,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>
                  ×
                </button>
              </div>

              <h2 style={{
                color: '#f5f0e8',
                fontFamily: 'var(--font-display, Arial Narrow, sans-serif)',
                fontSize: 32,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}>
                {project.name}
                <span style={{ color: project.accentColor, fontFamily: 'serif', fontSize: 18, marginLeft: 10, fontWeight: 400 }}>
                  {project.kanji}
                </span>
              </h2>

              <p style={{ color: project.accentColor, fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                {project.tagline}
              </p>

              <p style={{ color: 'rgba(245,240,232,0.75)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map(tag => (
                  <span key={tag} style={{
                    background: `${project.accentColor}18`,
                    border: `1px solid ${project.accentColor}44`,
                    color: project.accentColor,
                    fontFamily: 'monospace',
                    fontSize: 10,
                    padding: '3px 10px',
                    borderRadius: 2,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: project.accentColor, color: '#0a0806',
                      fontFamily: 'monospace', fontSize: 11, fontWeight: 600,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      padding: '10px 20px', borderRadius: 3, textDecoration: 'none',
                      transition: 'opacity 0.2s',
                    }}>
                    Live Demo ↗
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'none',
                      border: `1px solid ${project.accentColor}66`,
                      color: '#f5f0e8',
                      fontFamily: 'monospace', fontSize: 11,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      padding: '10px 20px', borderRadius: 3, textDecoration: 'none',
                      transition: 'border-color 0.2s, color 0.2s',
                    }}>
                    GitHub ↗
                  </a>
                )}
                <button onClick={onClose}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'none',
                    border: '1px solid rgba(245,240,232,0.15)',
                    color: 'rgba(245,240,232,0.5)',
                    fontFamily: 'monospace', fontSize: 11,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    padding: '10px 20px', borderRadius: 3, cursor: 'pointer',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}>
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   Renders the EXP04 section with:
   - The approved Batman-like background (visible when no book is open)
   - The ThreeUI Field Manuals iframe (always full-size, books repositioned to the
     four GLB corner slots at a reduced scale matching the old project-object footprint)
   - Two-state background: Batman bg fades out when a ThreeUI book is opened,
     the original ThreeUI earth-toned bg appears in its place.
───────────────────────────────────────────────────────────────────────────── */
export default function Exp04Placeholder() {
  const [bookOpen, setBookOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const closeOverlayRef = useRef<HTMLDivElement>(null);

  // ── Listen for postMessage from the iframe ──────────────────────────────
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'threeui:book:open')  setBookOpen(true);
      if (e.data?.type === 'threeui:book:close') setBookOpen(false);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // ── Inject CSS + bridge script once the iframe has loaded ───────────────
  const handleLoad = () => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc) return;

    const yunetraBook = doc.querySelector('.book-card[data-book="codex"]');
    if (yunetraBook) {
      const coverTitle = yunetraBook.querySelector<HTMLElement>('.cover-title');
      const coverSubtitle = yunetraBook.querySelector('.cover-subtitle');
      if (coverTitle) {
        coverTitle.textContent = 'YUNETRA';
        coverTitle.style.fontSize = 'clamp(18px, 2.2vw, 28px)';
      }
      if (coverSubtitle) coverSubtitle.textContent = 'VISION THAT UNITES POTENTIAL';
      yunetraBook.setAttribute('aria-label', 'Open Yunetra details');
    }
    
    // Ensure idempotency so we don't inject multiple times
    if (doc.getElementById('satya-overrides')) return;

    // ── 1. CSS OVERRIDES ─────────────────────────────────────────────────
    // Positions the three books in the four GLB corner slots and scales them
    // down to approximately the same visual footprint as the old GLB models.
    //
    // Slot mapping (matching the old ArcadeScene positions):
    //   OLD YUNETRA   (upper-left)  → CODEX
    //   OLD NETGUARD  (upper-right) → CLAUDE CODE
    //   OLD FUTURE-03 (lower-left)  → CURSOR
    //   OLD FUTURE-04 (lower-right) → EMPTY
    //
    // Scale: old GLB TARGET_SIZE was 1.6 world units in a canvas whose visible
    // height ≈ 8.3 world units, so each model was ≈19 % of viewport height.
    // Book aspect ratio 0.672 → width ≈ 13 % of viewport width.
    // min(13vw, 180px) is a close match.
    //
    // Background strategy:
    //   Normal (gallery) mode → stage/html are transparent (EXP04 bg shows).
    //   Detail mode          → stage/html restore their authored earth-toned bg.
    const style = doc.createElement('style');
    style.id = 'satya-overrides';
    style.textContent = `
      /* ── Transparency in gallery mode ─────────────────────────────────── */
      html { background: transparent !important; }
      body:not([data-mode="detail"]) { background: transparent !important; }
      body:not([data-mode="detail"]) .stage {
        background: transparent !important;
        pointer-events: none !important;
      }
      body:not([data-mode="detail"]) .stage::after {
        display: none !important;
      }

      /* ── Detail mode: restore full ThreeUI earth-toned bg ─────────────── */
      body[data-mode="detail"] { background: #29251d !important; }
      body[data-mode="detail"] .stage {
        background:
          radial-gradient(circle at 49% 84%, rgba(117, 102, 71, .2), transparent 34%),
          radial-gradient(circle at 14% 4%, rgba(100, 112, 77, .12), transparent 28%),
          linear-gradient(180deg, #343025 0%, #29251d 48%, #211e18 100%) !important;
      }
      body[data-mode="detail"] .stage::after {
        display: block !important;
      }

      /* ── Hide ALL ThreeUI top navbar, menu, and outer chrome ──── */
      .topbar, .menu-layer, .hero-word { display: none !important; }

      /* ── CINEMATIC COMPOSITION — NORMAL STATE
             Gallery perspective governs the shared camera space.
             Using 1100px provides strong but natural depth scaling. ── */
      .gallery {
        perspective: 1100px !important;
        transform-style: preserve-3d !important;
        pointer-events: none !important;
      }

      /* ── 3D TRANSFORM INJECTION
             Inject Z-depth and Pitch into the ThreeUI transform.
             Only applies in NORMAL state so detail view stays untouched. ── */
      body:not([data-mode="detail"]) .book-card {
        pointer-events: auto !important;
        transform:
          translate3d(
            calc(-50% + var(--local-x, 0px)),
            calc(var(--hover-y, 0px) + var(--local-y, 0px)),
            var(--z, 0px)
          )
          rotateX(var(--pitch, 0deg))
          rotate(var(--r, 0deg))
          rotateY(var(--yaw, 0deg)) !important;
      }

      /* ── ART-DIRECTED BOOK COMPOSITION
             ORB anchor: ~48% X, ~38% Y in the background photograph.
             Desk surface: ~55–80% Y.
             All books at the same visual scale class (~12vw).
             Cursor slightly lower → foreground depth by position, not size. ── */

      /* CODEX — Left desk zone, natural rightward lean toward ORB.
         Moved UP (y: 43%) and LEFT (x: 24%) to sit on the wooden/leafy
         area ABOVE the laptop with clear visible separation. */
      .book-card[data-book="codex"] {
        --x: 30% !important;
        --y: 43% !important;
        --z: 0px !important;
        --w: clamp(112px, 12vw, 168px) !important;
        --pitch: 4deg !important;
        --r: -6deg !important;
        --yaw: 7deg !important;
      }

      /* CLAUDE CODE — Right desk zone, natural leftward lean toward ORB.
         Own territory between ORB center (~48%) and mug (right edge ~88%).
         Center at 70% X → clear gap to mug, clear gap from ORB. */
      .book-card[data-book="claude"] {
        --x: 70% !important;
        --y: 49% !important;
        --z: 0px !important;
        --w: clamp(112px, 12vw, 168px) !important;
        --pitch: 4deg !important;
        --r: 7deg !important;
        --yaw: -7deg !important;
      }

      /* CURSOR — Center desk zone, directly below ORB. Foreground.
         Subtle forward lean (pitch 18deg) gives the physical desk-angle.
         At y:57% with 168px book (250px tall): bottom at ~71% → safely inside. */
      .book-card[data-book="cursor"] {
        --x: 50% !important;
        --y: 57% !important;
        --z: 5px !important;
        --w: clamp(116px, 12.5vw, 175px) !important;
        --pitch: 18deg !important;
        --r: 4deg !important;
        --yaw: 2deg !important;
      }

      /* ── PROPORTIONAL DEPTH LAYERS (NORMAL STATE ONLY)
             All Z-depth values derive from each card's own var(--w)
             so the physical book thickness scales correctly regardless
             of which of the three sizes is being rendered.
             Authored ratios: back -26/435, page -12/435, front +12/435 ── */
      body:not([data-mode="detail"]) .book-back {
        transform: translate3d(calc(var(--w) * 0.016), calc(var(--w) * 0.002), calc(var(--w) * -0.0597)) !important;
        box-shadow: 0 calc(var(--w) * 0.011) calc(var(--w) * 0.027) rgba(20, 14, 6, .5) !important;
      }
      body:not([data-mode="detail"]) .page-block {
        transform: translate3d(calc(var(--w) * 0.016), calc(var(--w) * 0.002), calc(var(--w) * -0.0275)) !important;
        box-shadow: calc(var(--w) * 0.006) calc(var(--w) * 0.004) calc(var(--w) * 0.011) rgba(31, 23, 13, .26) !important;
      }
      body:not([data-mode="detail"]) .front-cover {
        transform: translate3d(0, 0, calc(var(--w) * 0.0275)) !important;
        box-shadow:
          0 calc(var(--w) * 0.016) calc(var(--w) * 0.032) rgba(20, 14, 6, .45),
          inset calc(var(--w) * -0.009) 0 calc(var(--w) * 0.016) rgba(0, 0, 0, .18),
          inset calc(var(--w) * 0.004) 0 calc(var(--w) * 0.009) rgba(255, 245, 210, .15) !important;
      }

      /* ── DESK-CONTACT SHADOW
             Skeuomorphic principle: light from above, shadow cast
             BELOW the object onto the horizontal surface.
             High Y-offset, very low Z, wide soft blur =
             the book is casting a diffuse shadow down onto the desk.
             Avoid tinted-black; use warm dark to match desk lighting. ── */
      body:not([data-mode="detail"]) .book-shadow {
        transform: translate3d(
          calc(var(--w) * 0.03),
          calc(var(--w) * 0.30),
          calc(var(--w) * -0.02)
        ) !important;
        filter: blur(calc(var(--w) * 0.09)) !important;
        opacity: .45 !important;
      }

      /* ── Cover art quality — no artificial sharpening ── */
      body:not([data-mode="detail"]) .front-cover {
        image-rendering: -webkit-optimize-contrast;
      }

      /* ── Fourth slot is empty (FUTURE-04) ── */

      /* ── EXP04 opened-book editorial spread ───────────────────────────── */
      .detail-panel > .detail-title,
      .detail-panel > .detail-scroll,
      .detail-panel > .bottom-dock { display: none !important; }
      body[data-mode="detail"] .detail-panel {
        top: 6.5% !important;
        right: 3.8% !important;
        bottom: 6.5% !important;
        left: 3.8% !important;
        width: auto !important;
        height: auto !important;
      }
      body[data-mode="detail"] .book-card.selected {
        visibility: hidden !important;
      }
      .satya-editorial-page {
        position: absolute;
        inset: 0;
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        overflow: hidden;
        color: #28251f;
        font-family: var(--serif);
        background: #e9e2d4;
        border: 1px solid rgba(255, 248, 229, .75);
        box-shadow: 0 28px 72px rgba(0, 0, 0, .4), 0 4px 12px rgba(0, 0, 0, .2);
        isolation: isolate;
      }
      .satya-editorial-page::before {
        content: "";
        position: absolute;
        z-index: 2;
        inset: 0;
        pointer-events: none;
        background:
          linear-gradient(90deg, rgba(58, 44, 28, .12), transparent 2.2%, transparent 48.8%, rgba(45, 34, 23, .2) 50%, transparent 51.2%, transparent 97.8%, rgba(48, 38, 28, .14)),
          repeating-linear-gradient(0deg, rgba(103, 84, 56, .018) 0 1px, transparent 1px 4px);
        mix-blend-mode: multiply;
      }
      .satya-editorial-page::after {
        content: "";
        position: absolute;
        z-index: 1;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 26px;
        transform: translateX(-50%);
        pointer-events: none;
        background: linear-gradient(90deg, transparent, rgba(64, 48, 29, .11) 42%, rgba(255, 250, 236, .42) 52%, transparent);
      }
      .satya-editorial-page > * { min-width: 0; }
      .satya-editorial-left,
      .satya-editorial-right {
        position: relative;
        min-height: 0;
        padding: clamp(26px, 4.2vh, 48px) clamp(26px, 4vw, 68px);
        background:
          radial-gradient(ellipse at 48% 50%, rgba(255, 253, 246, .58), transparent 74%),
          linear-gradient(105deg, #eee8db 0%, #e7dfd0 100%);
      }
      .satya-editorial-left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-right: clamp(32px, 4vw, 72px);
        box-shadow: inset -12px 0 16px -18px rgba(45, 35, 24, .9);
      }
      .satya-editorial-right {
        padding-left: clamp(34px, 4.4vw, 76px);
        background:
          radial-gradient(ellipse at 56% 44%, rgba(255, 253, 246, .65), transparent 76%),
          linear-gradient(255deg, #eee8db 0%, #e8e0d2 100%);
      }
      .satya-editorial-kicker,
      .satya-editorial-label,
      .satya-editorial-meta-label {
        color: #8a382f;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 9px;
        font-style: normal;
        font-weight: 600;
        letter-spacing: .16em;
        line-height: 1.5;
        text-transform: uppercase;
      }
      .satya-editorial-header,
      .satya-editorial-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
      }
      .satya-editorial-header {
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(67, 54, 39, .24);
      }
      .satya-editorial-index { color: #746852; font-size: 11px; letter-spacing: .14em; }
      .satya-editorial-title {
        margin: clamp(10px, 1.4vh, 16px) 0 5px;
        color: #25231f;
        font-family: var(--serif);
        font-size: clamp(30px, 3.6vw, 52px);
        font-style: italic;
        font-weight: 500;
        letter-spacing: -.055em;
        line-height: .98;
      }
      .satya-editorial-subtitle {
        margin: 0;
        color: #74634d;
        font-size: clamp(13px, 1.35vw, 19px);
        font-style: italic;
        line-height: 1.3;
      }
      .satya-editorial-section { margin-top: clamp(16px, 2.4vh, 26px); }
      .satya-editorial-left > .satya-editorial-section { margin-top: auto; padding-top: 12px; }
      .satya-editorial-label { margin: 0 0 8px; color: #75664f; }
      .satya-editorial-copy,
      .satya-editorial-note {
        margin: 0;
        color: #3e3a32;
        font-size: clamp(12px, 1.02vw, 15px);
        line-height: 1.58;
      }
      .satya-editorial-project-note {
        max-width: 93%;
        margin: 0;
        color: #514a3e;
        font-size: clamp(12px, .98vw, 14px);
        line-height: 1.55;
      }
      .satya-editorial-left-bottom {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: end;
        gap: 14px;
        padding-top: 13px;
        border-top: 1px solid rgba(67, 54, 39, .24);
      }
      .satya-editorial-colophon { color: #746852; font-size: 10px; letter-spacing: .13em; text-transform: uppercase; }
      .satya-editorial-seal {
        display: grid;
        width: 35px;
        height: 35px;
        place-items: center;
        border: 1px solid rgba(138, 56, 47, .55);
        color: #8a382f;
        font-family: Arial, sans-serif;
        font-size: 18px;
        line-height: 1;
      }
      .satya-editorial-right-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(67, 54, 39, .24);
      }
      .satya-editorial-right .satya-editorial-section { margin-top: clamp(18px, 2.6vh, 30px); }
      .satya-editorial-concept {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
        max-width: 520px;
        margin-top: 24px;
        padding-top: 18px;
        border-top: 1px solid rgba(67, 54, 39, .24);
      }
      .satya-editorial-diagram {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        align-items: start;
        gap: 0;
        margin: 8px 0 0;
      }
      .satya-editorial-step {
        position: relative;
        min-height: 72px;
        padding: 14px 11px 0 0;
        border-top: 1px solid rgba(83, 69, 49, .44);
      }
      .satya-editorial-step:not(:last-child)::after {
        content: "";
        position: absolute;
        top: -3px;
        right: 8px;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #8a382f;
      }
      .satya-editorial-step-number {
        display: block;
        margin-bottom: 7px;
        color: #9b6c37;
        font-family: var(--mono);
        font-size: 9px;
        letter-spacing: .1em;
      }
      .satya-editorial-step-name { color: #332f28; font-size: clamp(10px, .84vw, 12px); line-height: 1.35; }
      .satya-editorial-footer {
        position: absolute;
        right: clamp(26px, 4vw, 68px);
        bottom: clamp(26px, 4.2vh, 48px);
        left: clamp(34px, 4.4vw, 76px);
        padding-top: 11px;
        border-top: 1px solid rgba(67, 54, 39, .24);
      }
      .satya-editorial-year { color: #332f28; font-size: 13px; }
      .satya-editorial-jp {
        position: absolute;
        right: clamp(26px, 4vw, 68px);
        bottom: 13%;
        color: rgba(113, 94, 69, .48);
        font-family: var(--sans);
        font-size: clamp(24px, 3vw, 42px);
        writing-mode: vertical-rl;
      }
      .satya-yunetra-page .satya-editorial-left,
      .satya-yunetra-page .satya-editorial-right {
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .satya-yunetra-page .satya-editorial-left { justify-content: flex-start; }
      .satya-yunetra-page .satya-editorial-left-top,
      .satya-yunetra-page .satya-editorial-right-top { flex: 0 0 auto; }
      .satya-yunetra-content {
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        padding-right: 8px;
        scrollbar-color: rgba(138, 56, 47, .38) transparent;
        scrollbar-width: thin;
      }
      .satya-yunetra-left-content { flex: 1; margin-top: 14px; }
      .satya-yunetra-right-content { flex: 1; margin-top: 14px; padding-bottom: 56px; }
      .satya-yunetra-section { margin: 0 0 20px; }
      .satya-yunetra-section:last-child { margin-bottom: 0; }
      .satya-yunetra-section .satya-editorial-label { margin-bottom: 5px; }
      .satya-yunetra-section .satya-editorial-copy,
      .satya-yunetra-section .satya-editorial-note {
        font-size: clamp(11px, .9vw, 13px);
        line-height: 1.48;
      }
      .satya-yunetra-focus { color: #71634e; font-size: 11px; line-height: 1.5; }
      .satya-yunetra-flow { display: flex; flex-wrap: wrap; gap: 5px 8px; margin-top: 7px; }
      .satya-yunetra-flow span { color: #332f28; font-size: 10px; line-height: 1.35; }
      .satya-yunetra-flow span:not(:last-child)::after { content: '  →'; color: #9b4034; }
      .satya-yunetra-scores { display: grid; gap: 4px; margin-top: 7px; }
      .satya-yunetra-score-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding-bottom: 4px;
        border-bottom: 1px solid rgba(67, 54, 39, .16);
        color: #3e3a32;
        font-size: 11px;
        line-height: 1.35;
      }
      .satya-yunetra-score-row strong { color: #8a382f; font-family: var(--mono); font-size: 10px; white-space: nowrap; }
      .satya-yunetra-links {
        position: relative;
        right: auto;
        bottom: auto;
        left: auto;
        flex: 0 0 auto;
        justify-content: flex-start;
        gap: 16px;
        padding-top: 10px;
      }
      .satya-yunetra-link {
        color: #8a382f;
        font-family: var(--mono);
        font-size: 10px;
        font-weight: 600;
        letter-spacing: .12em;
        text-decoration: none;
      }
      .satya-yunetra-link:hover,
      .satya-yunetra-link:focus-visible { color: #29251d; text-decoration: underline; text-underline-offset: 3px; }
      @media (max-width: 900px) {
        body[data-mode="detail"] .detail-panel {
          top: 16px !important;
          right: 16px !important;
          bottom: 16px !important;
          left: 16px !important;
          width: auto !important;
          height: auto !important;
          min-height: 0 !important;
          max-height: calc(100dvh - 32px) !important;
          overflow-y: auto !important;
          overscroll-behavior: contain;
          padding-bottom: 0;
        }
        .satya-editorial-page {
          position: relative;
          inset: auto;
          display: flex;
          flex-direction: column;
          overflow: visible;
          min-height: 0;
        }
        .satya-editorial-page::after { top: 50%; right: 0; bottom: auto; left: 0; width: auto; height: 20px; transform: translateY(-50%); background: linear-gradient(180deg, transparent, rgba(64, 48, 29, .12), transparent); }
        .satya-editorial-left,
        .satya-editorial-right { min-height: 430px; padding: 28px clamp(22px, 5vw, 42px); }
        .satya-editorial-left { padding-bottom: 30px; }
        .satya-editorial-right { padding-top: 34px; padding-bottom: 78px; }
        .satya-editorial-title { font-size: clamp(40px, 8vw, 62px); }
        .satya-editorial-footer { right: clamp(22px, 5vw, 42px); bottom: 24px; left: clamp(22px, 5vw, 42px); }
        .satya-yunetra-page .satya-editorial-left,
        .satya-yunetra-page .satya-editorial-right { overflow: visible; }
        .satya-yunetra-page .satya-editorial-left { justify-content: flex-start; }
        .satya-yunetra-content { flex: 0 0 auto; overflow: visible; padding-right: 0; }
        .satya-yunetra-right-content { padding-bottom: 0; }
        .satya-yunetra-page .satya-editorial-footer { position: relative; right: auto; bottom: auto; left: auto; margin-top: 18px; }
      }
      @media (max-width: 560px) {
        body[data-mode="detail"] .detail-panel { top: 12px !important; right: 12px !important; bottom: 12px !important; left: 12px !important; max-height: calc(100dvh - 24px) !important; }
        .satya-editorial-left,
        .satya-editorial-right { min-height: 390px; padding-right: 22px; padding-left: 22px; }
        .satya-editorial-page::after { display: none; }
        .satya-editorial-diagram { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 10px; }
        .satya-editorial-jp { right: 20px; }
      }
    `;
    doc.head.appendChild(style);

    // Move the authored close button into the EXP04 host overlay. Keeping the
    // same element preserves its native handler while placing hit testing in
    // the parent document that owns the scrolling section and iframe.
    const hostOverlay = closeOverlayRef.current;
    const closeButton = doc.querySelector<HTMLButtonElement>('#closeButton');
    if (hostOverlay && closeButton) {
      closeButton.className = 'exp04-close-button';
      hostOverlay.appendChild(closeButton);

      const hostDocument = hostOverlay.ownerDocument;
      if (!hostDocument.getElementById('exp04-close-overlay-style')) {
        const hostStyle = hostDocument.createElement('style');
        hostStyle.id = 'exp04-close-overlay-style';
        hostStyle.textContent = `
          #exp04 .exp04-close-button {
            position: absolute;
            z-index: 1;
            top: 30px;
            left: 50%;
            display: grid;
            width: 54px;
            height: 54px;
            padding: 0;
            place-items: center;
            box-sizing: border-box;
            border: 1px solid rgba(255, 255, 255, .26);
            border-radius: 50%;
            background: rgba(42, 37, 28, .28);
            color: #eadfc7;
            font-family: "Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Baskerville, Georgia, serif;
            font-size: 27px;
            font-weight: 200;
            line-height: 1;
            opacity: 0;
            transform: translate3d(-50%, -18px, 0) rotate(-45deg);
            transition: opacity 400ms ease, transform 620ms cubic-bezier(.2, .78, .2, 1), background 220ms ease;
            pointer-events: none;
            touch-action: manipulation;
            backdrop-filter: blur(8px);
            cursor: pointer;
          }
          #exp04[data-book-open="true"] .exp04-close-button {
            opacity: 1;
            transform: translate3d(-50%, 0, 0) rotate(0);
            pointer-events: auto;
          }
          #exp04 .exp04-close-button:hover { background: rgba(255, 255, 255, .08); }
          #exp04 .exp04-close-button:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }
        `;
        hostDocument.head.appendChild(hostStyle);
      }
    }

    // ── 2. BRIDGE SCRIPT ────────────────────────────────────────────────
    // Watches body[data-mode] via MutationObserver and posts messages to the
    // parent window so EXP04 can fade its Batman background in/out.
    const script = doc.createElement('script');
    script.textContent = `
      (function () {
        var body = document.body;
        var detailPanel = document.querySelector('#detailPanel');
        var detailTitle = document.querySelector('#detailTitle');
        var detailDescription = document.querySelector('#detailDescription');
        var detailYear = document.querySelector('#detailYear');

        function element(tag, className, text) {
          var node = document.createElement(tag);
          if (className) node.className = className;
          if (text !== undefined) node.textContent = text;
          return node;
        }

        function editorialSection(parent, label, copy) {
          var section = element('section', 'satya-yunetra-section');
          section.append(
            element('h2', 'satya-editorial-label', label),
            element('p', 'satya-editorial-copy', copy)
          );
          parent.append(section);
          return section;
        }

        function renderEditorialPage() {
          if (!detailPanel || !detailTitle || !detailDescription) return;
          var page = detailPanel.querySelector('#satya-editorial-page');
          if (!page) {
            page = element('div', 'satya-editorial-page');
            page.id = 'satya-editorial-page';
            page.setAttribute('role', 'group');
            page.setAttribute('aria-label', 'Open project field manual');
            detailPanel.append(page);
          }

          var title = detailTitle.textContent.trim();
          var description = detailDescription.textContent.trim();
          var year = detailYear ? detailYear.textContent.trim() : '';
          var selectedBook = document.querySelector('.book-card.selected');
          var bookId = selectedBook ? selectedBook.getAttribute('data-book') : '';
          var isYunetra = bookId === 'codex';
          if (isYunetra) {
            title = 'YUNETRA';
            description = 'A peer-to-peer skill exchange platform where students connect, learn, teach, and grow through skill-based collaboration.';
            detailTitle.textContent = title;
            detailDescription.textContent = description;
          }
          var projects = {
            codex: { subtitle: 'VISION THAT UNITES POTENTIAL', number: '01', steps: ['Build a profile', 'Discover peers', 'Match by skills', 'Learn together'] },
            cursor: { subtitle: 'The Augmented Editor', number: '02', steps: ['Editor', 'Selection', 'Predict next change', 'Prompt to production'] },
            claude: { subtitle: 'The Quiet Terminal', number: '03', steps: ['Terminal', 'Codebase context', 'Files & tools', 'Inspectable conversation'] }
          };
          var project = projects[bookId] || { subtitle: '', number: '—', steps: [] };

          page.replaceChildren();
          page.classList.toggle('satya-yunetra-page', isYunetra);
          page.setAttribute('aria-label', isYunetra ? 'Yunetra project case study' : 'Open project field manual');
          if (isYunetra) {
            var left = element('section', 'satya-editorial-left');
            left.setAttribute('aria-label', 'Yunetra overview');
            var leftTop = element('div', 'satya-editorial-left-top');
            var header = element('header', 'satya-editorial-header');
            header.append(
              element('span', 'satya-editorial-kicker', 'FIELD NOTE · 01'),
              element('span', 'satya-editorial-index', 'YUNETRA / ' + year)
            );
            leftTop.append(header, element('h1', 'satya-editorial-title', title));
            leftTop.append(element('p', 'satya-editorial-subtitle', 'VISION THAT UNITES POTENTIAL'));
            var leftContent = element('div', 'satya-yunetra-content satya-yunetra-left-content');
            editorialSection(leftContent, 'PROJECT TYPE', 'Peer-to-peer learning platform');
            var focus = editorialSection(leftContent, 'FOCUS', '');
            focus.querySelector('.satya-editorial-copy').className = 'satya-yunetra-focus';
            focus.querySelector('.satya-yunetra-focus').textContent = 'Skill exchange · Matching · Sessions · Credits · Verification · Community';
            editorialSection(leftContent, '01 / ORIGIN', 'Students already hold valuable knowledge they can teach one another. Yunetra gives that peer knowledge a structured home: students build profiles, discover useful matches, schedule learning sessions, verify skills, and learn in a shared community.');
            editorialSection(leftContent, '02 / PROBLEM → RESPONSE', 'Learning can be costly, one-directional, or hard to access. Yunetra makes peer learning reciprocal: students offer what they know, find what they want to learn, and build a record of shared progress.');
            var exchange = editorialSection(leftContent, '03 / SESSION + CREDIT LOOP', 'A learner’s session request places the credit transaction in pending status. Both participants confirm completion before the teacher receives the credit; a dispute can trigger a refund.');
            var flow = element('div', 'satya-yunetra-flow');
            ['Profile', 'Discover', 'Match', 'Request', 'Learn', 'Confirm', 'Release'].forEach(function (step) {
              flow.append(element('span', '', step));
            });
            exchange.append(flow);
            var leftFooter = element('footer', 'satya-editorial-left-bottom');
            leftFooter.append(
              element('span', 'satya-editorial-colophon', 'Every student is a teacher and a learner.'),
              element('span', 'satya-editorial-seal', '結')
            );
            left.append(leftTop, leftContent, leftFooter);

            var right = element('section', 'satya-editorial-right');
            right.setAttribute('aria-label', 'Yunetra systems and project links');
            var rightHeader = element('header', 'satya-editorial-right-top');
            rightHeader.append(
              element('span', 'satya-editorial-kicker', 'SYSTEMS / FIELD NOTES'),
              element('span', 'satya-editorial-index', '01 — 09')
            );
            var rightContent = element('div', 'satya-yunetra-content satya-yunetra-right-content');
            var matching = editorialSection(rightContent, '04 / SMART MATCHING · 100 POINTS', 'The score combines bidirectional skill overlap, teacher rating, completed-session experience, and a same-college bonus. Match reasons are generated for the strongest peer results.');
            var scores = element('div', 'satya-yunetra-scores');
            [
              ['Bidirectional skill overlap', '50'],
              ['Teacher rating', '25'],
              ['Session experience', '15'],
              ['Same college', '10']
            ].forEach(function (item) {
              var row = element('div', 'satya-yunetra-score-row');
              row.append(element('span', '', item[0]), element('strong', '', item[1] + ' PTS'));
              scores.append(row);
            });
            matching.append(scores);
            editorialSection(rightContent, '05 / VERIFICATION + REPUTATION', 'Skill checks use five MCQ answers; three correct answers pass. Teaching activity can earn First Step, Rising Teacher, Community Pillar, and per-skill Mentor Level badges.');
            editorialSection(rightContent, '06 / COMMUNITY + ARENA', 'The source includes following, connections, an activity feed, shared resources with save and upvote actions, and Arena challenges across Tech Development, UI/UX, Graphic Design, Video Editing, VFX & Motion, Content Writing, Digital Marketing, Music Production, Photography, Business Strategy, Data Analytics, and Social Impact.');
            editorialSection(rightContent, '07 / TECHNICAL ARCHITECTURE', 'Next.js 14 · React 18 · TypeScript · Route Handlers · NextAuth credentials / JWT · Mongoose · MongoDB. UI: Tailwind CSS · Framer Motion · Lucide React · Radix UI Slot. Browser → App Router → route handlers → authentication / validation → Mongoose → MongoDB.');
            editorialSection(rightContent, '08 / ENGINEERING DETAILS', 'Server-side authentication checks · protected dashboard routes · route-specific validation · MongoDB persistence · JWT-backed sessions · credit transaction lifecycle · session-state management · matching score calculation · skill verification.');
            editorialSection(rightContent, '09 / PROJECT STATUS', 'Yunetra is actively developed. The current source includes authentication, profiles, peer discovery, sessions, credits, verification, badges, network features, shared resources, and Arena challenges. Public production deployment is not claimed here.');
            var rightFooter = element('footer', 'satya-editorial-footer satya-yunetra-links');
            var githubLink = element('a', 'satya-yunetra-link', 'GITHUB ↗');
            githubLink.href = 'https://github.com/SATYANARAYANA21/yunetra';
            githubLink.target = '_blank';
            githubLink.rel = 'noopener noreferrer';
            githubLink.setAttribute('aria-label', 'Open Yunetra GitHub repository in a new tab');
            var liveLink = element('a', 'satya-yunetra-link', 'LIVE ↗');
            liveLink.href = 'https://yunetra.vercel.app/';
            liveLink.target = '_blank';
            liveLink.rel = 'noopener noreferrer';
            liveLink.setAttribute('aria-label', 'Open Yunetra live project in a new tab');
            rightFooter.append(githubLink, liveLink);
            right.append(rightHeader, rightContent, rightFooter);
            page.append(left, right);
            return;
          }

          var left = element('section', 'satya-editorial-left');
          left.setAttribute('aria-label', 'Project identity and overview');
          var leftTop = element('div', 'satya-editorial-left-top');
          var header = element('header', 'satya-editorial-header');
          header.append(
            element('span', 'satya-editorial-kicker', 'FIELD MANUAL · ' + project.number),
            element('span', 'satya-editorial-index', 'SATYA / ' + year)
          );
          leftTop.append(header);
          leftTop.append(element('h1', 'satya-editorial-title', title));
          if (project.subtitle) leftTop.append(element('p', 'satya-editorial-subtitle', project.subtitle));
          left.append(leftTop);
          var story = element('section', 'satya-editorial-section');
          story.append(
            element('h2', 'satya-editorial-label', 'Project'),
            element('p', 'satya-editorial-project-note', description)
          );
          left.append(story);
          var leftFooter = element('footer', 'satya-editorial-left-bottom');
          leftFooter.append(
            element('span', 'satya-editorial-colophon', 'Project / ' + year),
            element('span', 'satya-editorial-seal', '手')
          );
          left.append(leftFooter);

          var right = element('section', 'satya-editorial-right');
          right.setAttribute('aria-label', 'Project archive and workflow');
          var rightHeader = element('header', 'satya-editorial-right-top');
          rightHeader.append(
            element('span', 'satya-editorial-kicker', 'PROJECT ARCHIVE'),
            element('span', 'satya-editorial-index', project.number)
          );
          right.append(rightHeader);
          var archive = element('section', 'satya-editorial-section');
          archive.append(
            element('h2', 'satya-editorial-label', 'System / workflow'),
            element('p', 'satya-editorial-note', 'A sequence distilled from the project description.')
          );
          right.append(archive);
          var conceptDiagram = element('section', 'satya-editorial-concept');
          conceptDiagram.append(
            element('h2', 'satya-editorial-label', 'Working sequence')
          );
          var diagram = element('div', 'satya-editorial-diagram');
          diagram.setAttribute('aria-label', 'Project workflow sequence');
          project.steps.forEach(function (step, index) {
            var item = element('div', 'satya-editorial-step');
            item.append(
              element('span', 'satya-editorial-step-number', String(index + 1).padStart(2, '0')),
              element('span', 'satya-editorial-step-name', step)
            );
            diagram.append(item);
          });
          conceptDiagram.append(diagram);
          right.append(conceptDiagram);
          right.append(element('span', 'satya-editorial-jp', '記録'));
          var footer = element('footer', 'satya-editorial-footer');
          footer.append(
            element('span', 'satya-editorial-meta-label', 'PROJECT / ' + title),
            element('span', 'satya-editorial-year', year)
          );
          right.append(footer);
          page.append(left, right);
        }

        function notify() {
          var isDetail = body.getAttribute('data-mode') === 'detail';
          if (isDetail) renderEditorialPage();
          window.parent.postMessage(
            { type: isDetail ? 'threeui:book:open' : 'threeui:book:close' },
            '*'
          );
        }

        var obs = new MutationObserver(notify);
        obs.observe(body, { attributes: true, attributeFilter: ['data-mode'] });

        // Notify once on load in case the page already initialised in detail mode
        notify();
      })();
    `;
    doc.head.appendChild(script);
  };

  // ── Mount Recovery / Polling ──────────────────────────────────────────
  // If the iframe loads before React hydrates (e.g. on hard refresh), the native
  // onLoad event will fire too early. This ensures we still inject our CSS.
  useEffect(() => {
    const checkLoad = () => {
      const doc = iframeRef.current?.contentDocument;
      if (doc && doc.readyState === 'complete' && doc.body) {
        handleLoad();
      }
    };

    // Check immediately
    checkLoad();
    // Poll briefly to catch early loading race conditions
    const interval = setInterval(checkLoad, 100);
    const timeout = setTimeout(() => clearInterval(interval), 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section
      id="exp04"
      className="relative w-full overflow-hidden bg-black"
      data-book-open={bookOpen ? 'true' : 'false'}
      style={{ height: '100svh' }}
    >
      {/* ── EXP04 Batman background — fades out when a book is opened ─────── */}
      <img
        src="/models/exp-04/background.png"
        alt=""
        className="absolute inset-0 h-full w-full object-fill object-center"
        draggable={false}
        style={{
          opacity: bookOpen ? 0 : 1,
          transition: 'opacity 600ms ease',
          pointerEvents: 'none',
        }}
      />

      <span
        aria-hidden="true"
        className="halftone-fade pointer-events-none absolute inset-0 z-[5] opacity-[0.06]"
      />

      {/* ── ThreeUI Field Manuals iframe ─────────────────────────────────── */}
      <iframe
        ref={iframeRef}
        src="/landing-pages/bestsellers-book-showcase.html"
        title="Field Manuals — Tools for Thought"
        className="absolute inset-0 w-full h-full border-none z-10"
        style={{ background: 'transparent' }}
        allowTransparency={true}
        onLoad={handleLoad}
      />

      {!bookOpen && (
        <div
          aria-labelledby="exp04-editorial-title"
          className="pointer-events-none absolute left-[5%] top-[5%] z-20 isolate w-[min(90vw,22rem)] text-ink sm:top-[7%] lg:left-[4%] lg:top-[7%] lg:w-[min(17.5vw,22rem)]"
        >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-y-5 -left-5 right-0"
          style={{
            zIndex: -1,
            background: 'radial-gradient(ellipse at 38% 44%, rgba(255,252,245,.58) 0%, rgba(255,252,245,.34) 48%, rgba(255,252,245,.08) 74%, transparent 100%)',
          }}
        />
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-ink">
          Project Field Manuals
        </p>
        <h1
          id="exp04-editorial-title"
          className="mt-3 font-serif font-semibold text-[clamp(1.55rem,2.15vw,2.7rem)] uppercase leading-[0.98] tracking-[-0.04em] text-ink"
        >
          Projects,<br />
          Preserved As<br />
          Field Notes.
        </h1>
        <p className="mt-3 max-w-[31ch] font-normal text-[clamp(0.92rem,1vw,1rem)] leading-[1.55] text-ink">
          Open a field manual to explore the project, the process, and the work behind it.
        </p>
        <div className="mt-5 flex items-center gap-2.5 border-t border-ink/35 pt-3 text-ink">
          <svg
            aria-hidden="true"
            className="h-6 w-7 shrink-0"
            viewBox="0 0 28 24"
            fill="none"
          >
            <path d="M13.5 5.5C10.5 3 6.5 2.5 2.5 3.5V20c4-1 8-.5 11 2V5.5Z" stroke="currentColor" strokeWidth="1.2" />
            <path d="M14.5 5.5c3-2.5 7-3 11-2V20c-4-1-8-.5-11 2V5.5Z" stroke="currentColor" strokeWidth="1.2" />
            <path d="M14 5v17" stroke="currentColor" strokeWidth="1" />
          </svg>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">
            Click a book to open
          </span>
          <span aria-hidden="true" className="text-accent text-lg font-semibold leading-none">→</span>
        </div>
        </div>
      )}

      <div
        ref={closeOverlayRef}
        className="pointer-events-none absolute inset-0 z-50"
        aria-live="off"
      />

    </section>
  );
}
