'use client';

import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Html, useGLTF } from '@react-three/drei';
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Active preloads — only models currently in use
useGLTF.preload('/models/exp-04/yunetra.glb');
useGLTF.preload('/models/exp-04/future-03.glb');
useGLTF.preload('/models/exp-04/netguardai.glb');
useGLTF.preload('/models/exp-04/future-04.glb');

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT DATA — edit only this block to update projects
───────────────────────────────────────────────────────────────────────────── */
type ProjectConfig = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  microcopy?: string;
  status?: string;
  description?: string;
  tech?: string;
  accent: string;
  phase: number;
  github: string | null;
  model: string;
};

const PROJECTS: ProjectConfig[] = [
  {
    id: 'yunetra',
    number: '01',
    title: 'YUNETRA',
    subtitle: 'AI VISION PLATFORM',
    microcopy: 'VISION · INTELLIGENCE · AUTOMATION',
    status: '01 / PROJECT',
    description: 'AI Vision Platform for a Safer Tomorrow.',
    tech: 'Python · OpenCV · Flask · AI',
    accent: '#9dd9ff',
    phase: 0.1,
    github: null,
    model: '/models/exp-04/yunetra.glb',
  },
  {
    id: 'netguard',
    number: '02',
    title: 'NETGUARD AI',
    subtitle: 'AI NETWORK ATTACK FORECASTING',
    microcopy: 'FORECAST · DETECT · DEFEND',
    status: '02 / PROJECT',
    description: 'AI Network Attack Forecasting.',
    tech: 'Python · AI · Security',
    accent: '#79b8ff',
    phase: 1.7,
    github: null,
    model: '/models/exp-04/netguardai.glb',
  },
  {
    id: 'future-03',
    number: '03',
    title: '03',
    subtitle: 'IN DEVELOPMENT',
    microcopy: 'NEXT SYSTEM LOADING',
    status: 'IN DEVELOPMENT',
    accent: '#b4c5df',
    phase: 3.1,
    github: null,
    model: '/models/exp-04/future-03.glb',
  },
  {
    id: 'future-04',
    number: '04',
    title: '04',
    subtitle: 'IN DEVELOPMENT',
    microcopy: 'NEXT SYSTEM LOADING',
    status: 'IN DEVELOPMENT',
    accent: '#9eafd0',
    phase: 4.4,
    github: null,
    model: '/models/exp-04/future-04.glb',
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   GLB model — normalised to a consistent visual size and centred at origin.
   The target longest axis = 1.6 world units so all four models look balanced.
───────────────────────────────────────────────────────────────────────────── */
const TARGET_SIZE = 1.6; // world units — tweak this one value to resize all models

function ProjectModel({
  project,
  hovered,
  active,
}: {
  project: ProjectConfig;
  hovered: boolean;
  active: boolean;
}) {
  const { scene } = useGLTF(project.model);
  const ref = useRef<THREE.Group>(null);

  // Clone & normalise once per model path
  const { clone, normScale } = useMemo(() => {
    const cloned = scene.clone(true);

    // ── DIAGNOSTIC START ──────────────────────────────────────────────────────
    console.group(`[YUNETRA DIAG] scene loaded — children: ${scene.children.length}`);

    let meshCount = 0;
    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      meshCount++;
      const mesh = child as THREE.Mesh;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m, i) => {
        const mat = m as THREE.MeshStandardMaterial;
        console.log(`  mesh[${meshCount}] mat[${i}]:`, {
          type: mat.type,
          color: mat.color?.getHexString(),
          metalness: mat.metalness,
          roughness: mat.roughness,
          opacity: mat.opacity,
          transparent: mat.transparent,
          visible: mat.visible,
          emissive: mat.emissive?.getHexString(),
          emissiveIntensity: mat.emissiveIntensity,
        });
      });
    });
    console.log(`  total meshes: ${meshCount}`);
    // ── DIAGNOSTIC END ────────────────────────────────────────────────────────

    // Measure native size
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const ns = TARGET_SIZE / maxDim;

    // ── DIAGNOSTIC: log bounding box & scale ─────────────────────────────────
    const boxCenter = new THREE.Vector3();
    box.getCenter(boxCenter);
    console.log('  [BB before centering] size:', size, 'center:', boxCenter.toArray());
    console.log('  maxDim:', maxDim, '  ns (normScale):', ns);
    // ── DIAGNOSTIC END ────────────────────────────────────────────────────────

    // Centre at origin
    const center = new THREE.Vector3();
    box.getCenter(center);
    cloned.position.sub(center);

    // ── DIAGNOSTIC: re-measure after centering ────────────────────────────────
    const boxAfter = new THREE.Box3().setFromObject(cloned);
    const centerAfter = new THREE.Vector3();
    boxAfter.getCenter(centerAfter);
    console.log('  [BB after centering] center should be ~0:', centerAfter.toArray());
    console.groupEnd();
    // ── DIAGNOSTIC END ────────────────────────────────────────────────────────

    // Subtle holographic tint on every mesh material
    cloned.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const mats = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      // ── DIAGNOSTIC: replace with bright flat colour to confirm geometry presence
      // mesh.material = new THREE.MeshBasicMaterial({
      //   color: 0xff00ff,  // DIAGNOSTIC — magenta, impossible to miss
      //   wireframe: false,
      // });
      // void mats; // suppress unused-var lint
      // ── DIAGNOSTIC END (original material code below, currently disabled) ───
      // mesh.material = mats.map((m) => {
      //   const n = (m as THREE.MeshStandardMaterial).clone() as THREE.MeshStandardMaterial;
      //   n.roughness  = Math.max(n.roughness,  0.35);
      //   n.metalness  = Math.min(n.metalness,  0.25);
      //   n.emissive = new THREE.Color(project.accent);
      //   n.emissiveIntensity = 0.08;
      //   return n;
      // }) as THREE.Material | THREE.Material[];
    });

    return { clone: cloned, normScale: ns };
  }, [scene, project.accent]); // eslint-disable-line react-hooks/exhaustive-deps

  const isFocused = hovered || active;

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;

    // Gentle idle rotation + faster on hover
    ref.current.rotation.y +=
      delta * (isFocused ? 0.35 : 0.08);

    // Subtle float
    ref.current.position.y =
      Math.sin(clock.getElapsedTime() * 0.5 + project.phase) * 0.06;

    // Scale: slightly larger on hover/active
    const targetScale = normScale * (active ? 1.12 : isFocused ? 1.06 : 1.0);
    ref.current.scale.setScalar(
      THREE.MathUtils.damp(ref.current.scale.x, targetScale, 5, delta),
    );

    // Emissive glow on hover/active
    ref.current.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const mats = Array.isArray(mesh.material)
        ? (mesh.material as THREE.MeshStandardMaterial[])
        : [mesh.material as THREE.MeshStandardMaterial];
      mats.forEach((m) => {
        m.emissiveIntensity = THREE.MathUtils.damp(
          m.emissiveIntensity,
          active ? 0.55 : isFocused ? 0.42 : 0.3,
          5,
          delta,
        );
      });
    });
  });

  return (
    <group ref={ref} scale={normScale}>
      <primitive object={clone} />
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Per-project interactive slot:
   — point light that tracks the cursor
   — GLB model (no sphere wrapper)
   — HTML label beneath
───────────────────────────────────────────────────────────────────────────── */
function ProjectSlot({
  project,
  position,
  slotScale,
  hoveredId,
  activeId,
  onHover,
  onClick,
}: {
  project: ProjectConfig;
  position: [number, number, number];
  slotScale: number;
  hoveredId: string | null;
  activeId: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const hitRef = useRef<THREE.Mesh>(null);
  const pointerRef = useRef(new THREE.Vector3(0, 0, 1));

  const isHovered = hoveredId === project.id;
  const isActive = activeId === project.id;
  const isFocused = isHovered || isActive;
  const dimmed = (hoveredId !== null || activeId !== null) && !isFocused;

  useFrame(({ clock }, delta) => {
    if (!groupRef.current || !lightRef.current) return;
    const time = clock.getElapsedTime() + project.phase;

    // Whole slot scale (dimmed vs normal vs active)
    const tScale = slotScale * (isActive ? 1.0 : dimmed ? 0.92 : 1.0);
    groupRef.current.scale.setScalar(
      THREE.MathUtils.damp(groupRef.current.scale.x, tScale, 5, delta),
    );

    // Keep X fixed; let float be handled inside ProjectModel
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      position[0] + (isFocused ? pointerRef.current.x * 0.06 : 0),
      4,
      delta,
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      position[1] + Math.sin(time * 0.4) * 0.04,
      4,
      delta,
    );

    // Cursor-tracking light
    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.damp(
        lightRef.current.intensity,
        isFocused ? 2.2 : 0.4,
        6,
        delta,
      );
    }
  });

  const handleDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onClick(project.id);
  };
  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (groupRef.current)
      pointerRef.current
        .copy(groupRef.current.worldToLocal(e.point.clone()))
        .normalize();
    document.body.style.cursor = 'pointer';
    onHover(project.id);
  };
  const handleMove = (e: ThreeEvent<PointerEvent>) => {
    if (!groupRef.current) return;
    pointerRef.current
      .copy(groupRef.current.worldToLocal(e.point.clone()))
      .normalize();
  };
  const handleOut = () => {
    document.body.style.cursor = 'auto';
    onHover(null);
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Subtle coloured light — tracks cursor */}
      <pointLight
        ref={lightRef}
        position={[0, 0.5, 1.2]}
        color={project.accent}
        intensity={0.4}
        distance={3.5}
        decay={2}
      />

      {/* Invisible hit sphere — makes the whole slot area clickable */}
      <mesh
        ref={hitRef}
        onPointerDown={handleDown}
        onPointerOver={handleOver}
        onPointerMove={handleMove}
        onPointerOut={handleOut}
      >
        <sphereGeometry args={[1.1, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* The actual 3D project artifact */}
      {(project.id === 'future-04' || project.id === 'netguard' || project.id === 'future-03' || project.id === 'yunetra') && (
        <Suspense fallback={null}>
          <ProjectModel
            project={project}
            hovered={isHovered}
            active={isActive}
          />
        </Suspense>
      )}

      {/* Label below the model */}
      <Html
        position={[0, -1.25, 0]}
        center
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          className="flex flex-col items-center text-center whitespace-nowrap"
          style={{
            opacity: dimmed ? 0.3 : 1,
            transition: 'opacity 350ms ease, transform 300ms ease',
            transform: isActive
              ? 'scale(1.08) translateY(6px)'
              : isFocused
                ? 'scale(1.04)'
                : 'scale(1)',
          }}
        >
          {/* Number */}
          <div
            className="font-mono text-[9px] tracking-[0.22em] mb-[2px]"
            style={{ color: project.accent }}
          >
            {project.number}
          </div>

          {/* Title */}
          <div
            className="font-display uppercase tracking-[0.07em] leading-tight"
            style={{
              color: isFocused ? '#ffffff' : '#f5f0e8',
              fontSize: isFocused ? '16px' : '13px',
              fontWeight: 800,
              textShadow: isFocused
                ? `0 0 16px ${project.accent}, 0 2px 8px rgba(0,0,0,1)`
                : '0 2px 8px rgba(0,0,0,0.9)',
              transition: 'font-size 280ms ease, color 280ms ease',
            }}
          >
            {project.title}
          </div>

          {/* Subtitle */}
          <div
            className="font-mono text-[8px] tracking-[0.13em] mt-[2px]"
            style={{ color: '#d9efff', opacity: 1 }}
          >
            {project.subtitle}
          </div>

          {/* Microcopy tagline */}
          {project.microcopy && (
            <div
              className="font-mono text-[7px] tracking-[0.16em] mt-[3px]"
              style={{ color: project.accent, opacity: isFocused ? 0.95 : 0.85, transition: 'opacity 280ms ease' }}
            >
              {project.microcopy}
            </div>
          )}

          {/* VIEW DETAILS — appears on hover for active projects only */}
          <div
            className="font-mono text-[8px] tracking-[0.12em] text-white mt-1"
            style={{
              opacity: isHovered && !isActive && project.status !== 'IN DEVELOPMENT' ? 0.8 : 0,
              maxHeight: isHovered && !isActive && project.status !== 'IN DEVELOPMENT' ? '12px' : '0px',
              overflow: 'hidden',
              transition: 'opacity 220ms ease, max-height 220ms ease',
            }}
          >
            VIEW DETAILS →
          </div>
        </div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Scene root — minimal lights + four project slots.
   NO Environment preset — keeps the transparent canvas clean over the PNG.
───────────────────────────────────────────────────────────────────────────── */
function ArcadeScene({
  hoveredId,
  activeId,
  setHoveredId,
  setActiveId,
}: {
  hoveredId: string | null;
  activeId: string | null;
  setHoveredId: (id: string | null) => void;
  setActiveId: (id: string | null) => void;
}) {
  const { viewport } = useThree();
  const compact = viewport.width < 10;

  // Identical corner positions to the original approved layout
  const x = compact ? Math.max(1.45, viewport.width * 0.23) : 3.45;
  const y = compact ? 1.35 : 1.55;
  const slotScale = compact ? 0.72 : 0.94;

  const positions: [number, number, number][] = [
    [-x,  y, 0], // upper-left  — YUNETRA
    [ x,  y, 0], // upper-right — NETGUARD AI
    [-x, -y, 0], // lower-left  — 03
    [ x, -y, 0], // lower-right — 04
  ];

  return (
    <>
      {/* Scene-wide neutral lights — no Environment HDR preset */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 5, 5]}  intensity={1.1} color="#cce8ff" />
      <directionalLight position={[-4, -2, 2]} intensity={0.35} color="#3a5f95" />

      {PROJECTS.map((project, i) => (
        <ProjectSlot
          key={project.id}
          project={project}
          position={positions[i]}
          slotScale={slotScale}
          hoveredId={hoveredId}
          activeId={activeId}
          onHover={setHoveredId}
          onClick={setActiveId}
        />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Detail panel — slides up from the bottom on click
───────────────────────────────────────────────────────────────────────────── */
function DetailPanel({
  project,
  onClose,
}: {
  project: ProjectConfig;
  onClose: () => void;
}) {
  const isDev = project.status === 'IN DEVELOPMENT';

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center pointer-events-auto"
      style={{ paddingBottom: 'clamp(3.5rem, 9vh, 7rem)' }}
      onClick={onClose}
    >
      <div
        style={{ maxWidth: '330px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="rounded-lg border p-5 flex flex-col gap-3 shadow-2xl"
          style={{
            background: 'rgba(5, 8, 14, 0.9)',
            backdropFilter: 'blur(20px)',
            borderColor: `${project.accent}44`,
            boxShadow: `0 0 48px ${project.accent}18, 0 14px 36px rgba(0,0,0,0.75)`,
            animation: 'panelIn 0.32s cubic-bezier(0.16,1,0.3,1) both',
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <span
              className="font-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: project.accent }}
            >
              {project.status ?? project.number}
            </span>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white/80 text-lg leading-none transition-colors"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div>
            <h2
              className="font-display text-xl uppercase tracking-[0.06em] text-[#f5f0e8] leading-tight mb-1"
            >
              {project.title}
            </h2>
            {project.description && (
              <p className="text-[12px] text-white/65 leading-relaxed">
                {project.description}
              </p>
            )}
            {project.tech && (
              <div className="font-mono text-[8px] tracking-[0.15em] text-[#d9efff]/65 uppercase mt-2">
                TECH: {project.tech}
              </div>
            )}
          </div>

          {/* Actions */}
          <div
            className="pt-3 border-t flex items-center gap-3"
            style={{ borderColor: `${project.accent}22` }}
          >
            {isDev ? (
              <span
                className="px-4 py-2 text-[8px] font-mono tracking-[0.12em] uppercase border rounded"
                style={{
                  color: 'rgba(255,255,255,0.38)',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                PROJECT IN DEVELOPMENT
              </span>
            ) : project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-[9px] font-mono tracking-[0.12em] uppercase rounded transition-opacity hover:opacity-80"
                style={{
                  background: `${project.accent}28`,
                  color: '#fff',
                  border: `1px solid ${project.accent}55`,
                }}
              >
                GITHUB →
              </a>
            ) : (
              <span className="text-[9px] font-mono tracking-[0.12em] text-white/35 uppercase">
                CODE PRIVATE
              </span>
            )}
            <button
              onClick={onClose}
              className="ml-auto text-[8px] font-mono tracking-[0.12em] text-white/35 hover:text-white/60 uppercase transition-colors"
            >
              ← CLOSE
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes panelIn {
          from { opacity:0; transform:translateY(12px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
      ` }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Root export — transparent Canvas overlay + UI layer
───────────────────────────────────────────────────────────────────────────── */
export default function Exp04GlobeLayer() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);

  const handleHover = (id: string | null) => {
    setHoveredId(id);
    if (id !== null) setHasInteracted(true);
  };
  const handleClick = (id: string | null) => {
    setActiveId(id);
    if (id !== null) setHasInteracted(true);
  };

  const activeProject = useMemo(
    () => PROJECTS.find((p) => p.id === activeId) ?? null,
    [activeId],
  );

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const upd = () => setReducedMotion(q.matches);
    upd();
    q.addEventListener('change', upd);
    return () => q.removeEventListener('change', upd);
  }, []);

  useEffect(() => {
    const node = sceneRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.01 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sceneRef}
      className="absolute inset-0 z-10 overflow-hidden"
      aria-label="EXP 04 — Project Arcade"
    >

      {/* ── PAGE IDENTITY — upper-left ───────────────────────────────────── */}
      <div
        className="absolute top-[7%] left-[5%] z-20 pointer-events-none flex flex-col gap-[3px]"
      >
        <div className="font-mono text-[7px] tracking-[0.28em] text-white/75 uppercase mb-[4px]">
          PROJECT ARCHIVE / 2026
        </div>
        {/* Primary title */}
        <div
          className="font-display uppercase leading-[0.88] tracking-[0.04em]"
          style={{ color: 'rgba(245,240,232,0.82)', fontSize: 'clamp(28px,4.5vw,52px)', fontWeight: 800 }}
        >
          PROJECT
        </div>
        <div
          className="font-display uppercase leading-[0.88] tracking-[0.04em]"
          style={{ color: 'rgba(245,240,232,0.82)', fontSize: 'clamp(28px,4.5vw,52px)', fontWeight: 800 }}
        >
          ARCADE
        </div>
        {/* Supporting line */}
        <div className="font-mono text-[8px] tracking-[0.22em] text-white/80 uppercase mt-[6px]">
          SELECTED WORKS / DIGITAL EXPERIMENTS
        </div>
      </div>

      {/* ── SYSTEM STATUS — upper-right corner ───────────────────────────── */}
      <div
        className="absolute top-[7%] right-[5%] z-20 pointer-events-none flex flex-col items-end gap-[4px]"
      >
        <div className="font-mono text-[7px] tracking-[0.22em] text-white/85 uppercase">SYSTEM ACTIVE</div>
        <div className="font-mono text-[7px] tracking-[0.22em] text-white/75 uppercase">04 EXPERIMENTS</div>
      </div>

      {/* ── BOTTOM-LEFT archive label ─────────────────────────────────────── */}
      <div
        className="absolute bottom-[6%] left-[5%] z-20 pointer-events-none"
      >
        <div className="font-mono text-[7px] tracking-[0.22em] text-white/80 uppercase">
          A COLLECTION OF IDEAS, SYSTEMS &amp; EXPERIMENTS.
        </div>
      </div>

      {/* ── BOTTOM-RIGHT archive label ────────────────────────────────────── */}
      <div
        className="absolute bottom-[6%] right-[5%] z-20 pointer-events-none flex flex-col items-end gap-[3px]"
      >
        <div className="font-mono text-[7px] tracking-[0.22em] text-white/75 uppercase">DIGITAL SYSTEMS</div>
        <div className="font-mono text-[7px] tracking-[0.22em] text-white/70 uppercase">NEXT TRANSMISSION</div>
      </div>

      {/* "TOUCH TO EXPLORE" — fades after first interaction */}
      <div
        className="absolute bottom-[17%] left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2 transition-opacity duration-700"
        style={{ opacity: hasInteracted ? 0 : 0.5 }}
      >
        <div
          className="w-5 h-5 rounded-full border border-white/45 animate-ping"
          style={{ animationDuration: '2.6s' }}
        />
        <span className="font-mono text-[8px] tracking-[0.24em] text-white/50">
          TOUCH TO EXPLORE
        </span>
      </div>

      {/* R3F Canvas — alpha:true keeps background visible */}
      <Canvas
        camera={{ position: [0, 0, 10.5], fov: 43 }}
        dpr={[1, 1.35]}
        frameloop={reducedMotion || !isInView ? 'demand' : 'always'}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent', touchAction: 'pan-y' }}
      >
        <ArcadeScene
          hoveredId={hoveredId}
          activeId={activeId}
          setHoveredId={handleHover}
          setActiveId={handleClick}
        />
      </Canvas>

      {/* Project detail panel */}
      {activeProject && (
        <DetailPanel
          project={activeProject}
          onClose={() => setActiveId(null)}
        />
      )}
    </div>
  );
}
