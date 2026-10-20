'use client';

/**
 * GlobeScene — Three.js / R3F scene for EXP6 "The Whole Roll"
 *
 * Reference parameters (preserved exactly):
 *  Camera: position [0, 0, 12], fov 40
 *  OrbitControls: autoRotate true/0.7, rotateSpeed 0.5, dampingFactor 0.08
 *                 enableZoom false, enablePan false
 *  Fog: #1a1714, near 9, far 22
 *
 * Visual refinement over previous version:
 *  - Frames now use MeshBasicMaterial so they are luminance-independent
 *    (no more "dark blob" problem from PBR needing light)
 *  - Placeholder palette switched to mid-tone moody colours — dark enough
 *    to feel cinematic, bright enough to clearly read as photo surfaces
 *  - Border opacity raised from 0.08 → 0.55 so every card has a crisp edge
 *  - Border thickness increased slightly for physical photograph feel
 *  - Fog range widened slightly so rear frames fade rather than vanish
 *  - Sphere radius slightly tightened so frames are closer to camera
 *  - Ambient light intensity kept for three-dimensional feel on any
 *    MeshStandardMaterial objects (future use)
 */

import { useRef, Suspense, useMemo, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ════════════════════════════════════════════════════════════════════════════
// PROJECT FRAME DATA
// ────────────────────────────────────────────────────────────────────────────
// To add your own photos:
//   1. Drop images into public/images/projects/
//   2. Set src: '/images/projects/project-01.jpg'  (etc.) for each entry
//   3. Don't touch anything else — the 3D math is fully independent.
//
// To change the number of frames, change FRAME_COUNT and update this array.
// ════════════════════════════════════════════════════════════════════════════
const FRAME_COUNT = 24;

export const PROJECT_FRAMES: { id: string; src: string; label: string }[] =
  Array.from({ length: FRAME_COUNT }).map((_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return {
      id: `globe-frame-${i}`,
      src: `/images/projects/project-${num}.jpg`,
      label: `Build ${num}`,
    };
  });

// ── Geometry constants ───────────────────────────────────────────────────────
const SPHERE_RADIUS = 5.0;   // Slightly tighter so frames are closer
const FRAME_W       = 2.1;   // Width of each photo plane (increased 1.4x)
const FRAME_H       = 1.4;   // Height → 3:2 aspect (increased 1.4x)
const BORDER_DELTA  = 0.12;  // Border overhang around each frame (scaled slightly)

// ── Placeholder palette — moody mid-tones ───────────────────────────────────
// These are clearly readable against the dark fog while staying cinematic.
// Each value is a distinct hue at roughly 25-40% lightness.
const PLACEHOLDER_COLORS = [
  '#2e2235', // deep mauve
  '#1a2e3d', // dark teal-navy
  '#2d1f0e', // warm dark brown
  '#1e2e1a', // forest dark
  '#2e1a1a', // dark burgundy
  '#1a1e2e', // slate navy
  '#2a2010', // dark ochre
  '#10252e', // deep cyan-dark
  '#2e2510', // warm umber
  '#1a2520', // muted sage dark
  '#25101e', // deep plum
  '#10201e', // deep teal
  '#2e1e10', // dark terracotta
  '#151e2e', // night blue
  '#2a1a28', // deep purple
  '#1e2a15', // dark moss
  '#2e2218', // dark coffee
  '#181e2a', // midnight
  '#251510', // dark rust
  '#1a2820', // deep emerald
  '#2e1828', // dark rose
  '#102830', // deep ocean
  '#281e10', // dark amber
  '#1e1028', // deep violet
];

// ── Shared border material (one instance, shared across all frames) ─────────
// Changed to MeshStandardMaterial so the edges catch the cinematic lighting
const borderMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#d4cfc0'),  // warm off-white border
  roughness: 0.4,
  metalness: 0.1,
  opacity: 0.8,
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
});

// ════════════════════════════════════════════════════════════════════════════
// GlobeFrame — a single photo card placed on the sphere surface
// ════════════════════════════════════════════════════════════════════════════
function GlobeFrame({ index, frame }: { index: number; frame: { src: string; label: string } }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Safely load texture without suspending/crashing if the file doesn't exist yet
  useEffect(() => {
    if (!frame.src) return;
    const loader = new THREE.TextureLoader();
    loader.load(
      frame.src,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      (err) => {
        // Silently fail and use placeholder color if user hasn't added the image yet
        console.warn(`Globe: waiting for image ${frame.src} to be added.`);
      }
    );
  }, [frame.src]);

  // Fibonacci sphere: perfectly even distribution over the entire sphere
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const lat = Math.acos(1 - (2 * (index + 0.5)) / FRAME_COUNT);
  const lon = goldenAngle * index;

  const x = SPHERE_RADIUS * Math.sin(lat) * Math.cos(lon);
  const y = SPHERE_RADIUS * Math.cos(lat);
  const z = SPHERE_RADIUS * Math.sin(lat) * Math.sin(lon);

  // Orient the plane so its +Z normal points away from sphere centre
  const quaternion = useMemo(() => {
    const pos    = new THREE.Vector3(x, y, z);
    const normal = pos.clone().normalize();
    const q      = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return q;
  }, [x, y, z]);

  // Photo surface material:
  // MeshBasicMaterial → colour is constant regardless of lighting.
  // This means frames are always readable even when far from lights.
  // When a real texture is present, we switch to texture-mapped basic.
  const photoMat = useMemo(() => {
    if (texture) {
      return new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.FrontSide,
        toneMapped: false,
      });
    }
    const baseColor = new THREE.Color(
      PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length]
    );
    // Add subtle lightness variation so frames look subtly different
    const brighten = 1 + (Math.sin(index * 1.3) * 0.18);
    baseColor.multiplyScalar(brighten);
    return new THREE.MeshBasicMaterial({
      color: baseColor,
      side: THREE.FrontSide,
    });
  }, [index, texture]);

  return (
    <group position={[x, y, z]} quaternion={quaternion}>
      {/* 1. Paper-white physical border/mat — now reacts to light */}
      <mesh material={borderMat} renderOrder={0}>
        <planeGeometry args={[FRAME_W + BORDER_DELTA, FRAME_H + BORDER_DELTA]} />
      </mesh>

      {/* 2. Photo surface — sits 0.002 units in front of border to avoid z-fight */}
      <mesh material={photoMat} position={[0, 0, 0.002]} renderOrder={1}>
        <planeGeometry args={[FRAME_W, FRAME_H]} />
      </mesh>
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// GlobeSphere — the full sphere group containing all frames
// ════════════════════════════════════════════════════════════════════════════
function GlobeSphere() {
  return (
    <group>
      {PROJECT_FRAMES.map((frame, i) => (
        <GlobeFrame key={frame.id} index={i} frame={frame} />
      ))}
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// GlobeSceneContent — lights, fog, scene graph, controls
// ════════════════════════════════════════════════════════════════════════════
export function GlobeSceneContent({ isReduced }: { isReduced: boolean }) {
  return (
    <>
      {/*
        Fog: matched to the #050505 cinematic gallery background.
        Near pushed to 12, far to 28 so frames fade smoothly into the void.
      */}
      <fog attach="fog" args={['#050505', 12, 28]} />

      {/*
        Cinematic Lighting:
        Subtle ambient fill + strong directionals to catch the standard-material
        edges of the photograph frames, creating a gallery-spotlight feel.
      */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 8, 5]}   intensity={1.8} />
      <directionalLight position={[-6, 2, -6]} intensity={0.8} color="#aaccff" />
      <pointLight position={[0, 0, 0]} intensity={1.5} distance={12} color="#e5322d" />

      <Suspense fallback={null}>
        <GlobeSphere />
      </Suspense>

      {/* OrbitControls — ALL reference parameters preserved exactly */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!isReduced}
        autoRotateSpeed={0.7}
        rotateSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.08}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
      />
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// GlobeCanvas — the R3F canvas wrapper, exported for dynamic import
// ════════════════════════════════════════════════════════════════════════════
export function GlobeCanvas({ isReduced }: { isReduced: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 40 }}
      dpr={[1, isReduced ? 1 : 1.5]}
      frameloop={!isReduced ? 'always' : 'demand'}
      gl={{ alpha: true, antialias: true }}
      style={{ position: 'absolute', inset: 0, background: 'transparent' }}
      resize={{ debounce: 0 }}
    >
      <GlobeSceneContent isReduced={isReduced} />
    </Canvas>
  );
}
