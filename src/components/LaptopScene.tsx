'use client';

/**
 * LaptopScene — premium interactive 3D laptop for the Hero section.
 *
 * FIX NOTES:
 * - Screen texture now uses declarative R3F <meshStandardMaterial map={screenTex} />
 *   instead of the broken imperative screenMatRef.current.map approach.
 *   When setScreenTex fires, React re-renders and the material picks up the
 *   new texture automatically — no needsUpdate juggling required.
 * - Material base color is WHITE so the texture is not darkened by color multiplication.
 * - Auto 360° Y-axis rotation: ~21-second cycle, completely separate from mouse tilt.
 * - Mouse: adds only a subtle X-tilt (up/down) and a small Y nudge on top of the
 *   continuous rotation — never overrides or fights the cinematic spin.
 */

import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

// ── Types ───────────────────────────────────────────────────────────────────
interface MouseTarget { x: number; y: number; }

// ── Screen overlay composite ─────────────────────────────────────────────────
// Takes a successfully-loaded THREE.Texture, draws the photo onto a canvas,
// adds subtle screen-glass effects, returns a fresh CanvasTexture.
function buildScreenTexture(loadedTex: THREE.Texture): THREE.CanvasTexture {
  const W = 1024, H = 640; // 16:10 — matches laptop screen ratio
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const img = loadedTex.image as HTMLImageElement;

  // 1. Cover-crop — centers the portrait photo in the screen area
  const iw = img.naturalWidth  || img.width  || 1;
  const ih = img.naturalHeight || img.height || 1;
  const scale = Math.max(W / iw, H / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);

  // 2. Very subtle warm brightness lift (lit display feel)
  ctx.fillStyle = 'rgba(255,250,240,0.07)';
  ctx.fillRect(0, 0, W, H);

  // 3. Diagonal glass glare — top-left corner
  const glare = ctx.createLinearGradient(0, 0, W * 0.5, H * 0.4);
  glare.addColorStop(0,   'rgba(255,255,255,0.11)');
  glare.addColorStop(0.25,'rgba(255,255,255,0.035)');
  glare.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = glare;
  ctx.fillRect(0, 0, W, H);

  // 4. Edge vignette — gives screen depth
  const vg = ctx.createRadialGradient(W/2, H/2, H*0.22, W/2, H/2, H*0.80);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.32)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  const result = new THREE.CanvasTexture(canvas);
  result.colorSpace = THREE.SRGBColorSpace;
  // GLTF models expect flipY = false. Without this, the CanvasTexture defaults to true, 
  // causing the texture to map upside down or mirrored.
  result.flipY = false; 
  return result;
}

import { useGLTF, useAnimations } from '@react-three/drei';

const GLB_PATH = '/models/laptop/asus-rog-zephyrus-duo-16/source/Duo 16 SKTFB.glb';

// Preload the GLB
useGLTF.preload(GLB_PATH);

// ── Auto-rotation speed ──────────────────────────────────────────────────────
// ~24-second full 360° at 60 fps
const AUTO_ROT_SPEED = (Math.PI * 2) / (60 * 24);

// ── Laptop mesh ──────────────────────────────────────────────────────────────
function Laptop({ mouse }: { mouse: MouseTarget }) {
  const groupRef = useRef<THREE.Group>(null!);
  
  // Cinematic sequence refs
  const timeElapsed = useRef(0);
  const autoRotY = useRef(0);
  const floatT = useRef(0);
  const mouseSmooth = useRef({ x: 0, y: 0 });

  const [screenTex, setScreenTex] = useState<THREE.CanvasTexture | null>(null);

  // Load the GLB & animations
  const { scene, materials, animations } = useGLTF(GLB_PATH) as any;
  const { actions } = useAnimations(animations, groupRef);

  // Apply the photo texture to the 'displauy' material when loaded
  useEffect(() => {
    if (screenTex && materials['displauy']) {
      materials['displauy'].map = screenTex;
      materials['displauy'].emissiveMap = screenTex;
      materials['displauy'].color = new THREE.Color('#ffffff');
      materials['displauy'].emissive = new THREE.Color('#ffffff');
      materials['displauy'].emissiveIntensity = 0.6;
      materials['displauy'].needsUpdate = true;
    }
  }, [screenTex, materials]);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      '/images/profile.jpg',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setScreenTex(buildScreenTexture(tex));
      },
      undefined,
      () => console.warn('LaptopScene: /images/profile.jpg not found.')
    );
  }, []);

  // Cinematic sequence: Play opening animation
  useEffect(() => {
    if (actions) {
      // The baked opening animation is ~1.2s. 
      // We slow it down by 0.4 to make it take ~3 seconds.
      Object.values(actions).forEach((action) => {
        if (action) {
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.timeScale = 0.4;
          action.play();
        }
      });
    }
  }, [actions]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    timeElapsed.current += delta;
    
    // Breathing float starts immediately
    floatT.current += 0.008;
    const breathY = Math.sin(floatT.current) * 0.055;

    // Phase logic:
    // 0 -> 3.5s : Opening (handled by mixer/actions automatically)
    // 3.5s -> 4.5s : Cinematic hold
    // 4.5s+ : Continuous 360 presentation spin
    if (timeElapsed.current > 4.5) {
      autoRotY.current += AUTO_ROT_SPEED;
    }

    // Smooth mouse influence — subtle tilt only
    mouseSmooth.current.x += (mouse.y * 0.18 - mouseSmooth.current.x) * 0.04;
    mouseSmooth.current.y += (mouse.x * 0.10 - mouseSmooth.current.y) * 0.04;

    groupRef.current.rotation.x = mouseSmooth.current.x;
    groupRef.current.rotation.y = autoRotY.current + mouseSmooth.current.y;
    groupRef.current.position.y = breathY; // Let CSS handle macro positioning
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 
        The GLB's native base is already near Y=0.
        Target scale: 6.2 (large Hero visual).
        We translate Y by -0.5 to keep the physical base aligned comfortably in the camera frustum.
      */}
      <primitive object={scene} scale={6.2} position={[0, -0.5, 0]} />
    </group>
  );
}

// ── Scene inner ──────────────────────────────────────────────────────────────
function LaptopSceneInner({ mouse }: { mouse: MouseTarget }) {
  return (
    <>
      <ambientLight intensity={0.45} />
      {/* Key light — warm from upper-right */}
      <directionalLight position={[4, 5, 3]}  intensity={2.2} color="#fff4e0" />
      {/* Rim light — cool from upper-left */}
      <directionalLight position={[-5, 4, -2]} intensity={1.1} color="#c0d8ff" />
      {/* Gentle under-fill */}
      <pointLight position={[0, -3, 3]} intensity={0.4} color="#ffe8cc" />
      {/* HDR reflections for metallic surfaces */}
      <Environment preset="city" />

      <Suspense fallback={null}>
        <Laptop mouse={mouse} />
      </Suspense>
    </>
  );
}

// ── Exported canvas ──────────────────────────────────────────────────────────
export default function LaptopCanvas() {
  const [mouse, setMouse] = useState<MouseTarget>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x:  (e.clientX / window.innerWidth  - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0.5, 6.1], fov: 32 }}
      dpr={[1, 1.5]}
      gl={{
        alpha: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ background: 'transparent' }}
    >
      <LaptopSceneInner mouse={mouse} />
    </Canvas>
  );
}
