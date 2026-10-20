'use client';

import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  FIELD_NOTE_COVER,
  FIELD_NOTE_PAGES,
  FIELD_NOTE_SPREADS,
  type FieldNotePage,
} from './exp07Content';

const HALF_PAGE = 2.75;
const PAGE_HEIGHT = 3.85;
const COVER_DEPTH = 0.11;
const PAGE_THICKNESS = 0.012;
const PAGE_TOP = 0.17;
const PAGE_SEGMENTS = 28;

type BookSceneProps = {
  isOpen: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  pageIndex: number;
  turnRequest: 0 | -1 | 1;
  onOpen: () => void;
  onRequestPageTurn: (direction: -1 | 1) => void;
  onPageTurnComplete: (direction: -1 | 1) => void;
};

function wrapCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(/\s+/);
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > maxWidth && line) {
      context.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = next;
    }
  }
  if (line) {
    context.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

function drawTempleSketch(context: CanvasRenderingContext2D, top: number) {
  const x = 112;
  const y = Math.min(top + 70, 1120);
  context.save();
  context.translate(x, y);
  context.scale(0.82, 0.82);
  context.strokeStyle = 'rgba(57, 49, 38, .5)';
  context.lineWidth = 3;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.beginPath();
  context.moveTo(0, 160); context.lineTo(660, 160);
  context.moveTo(80, 154); context.lineTo(80, 64); context.lineTo(580, 64); context.lineTo(580, 154);
  context.moveTo(48, 64); context.lineTo(330, -8); context.lineTo(610, 64);
  context.moveTo(20, 58); context.lineTo(330, -24); context.lineTo(640, 58);
  context.moveTo(104, 50); context.lineTo(104, 20); context.lineTo(556, 20); context.lineTo(556, 50);
  context.moveTo(180, 154); context.lineTo(180, 83); context.lineTo(252, 83); context.lineTo(252, 154);
  context.moveTo(293, 154); context.lineTo(293, 83); context.lineTo(366, 83); context.lineTo(366, 154);
  context.moveTo(406, 154); context.lineTo(406, 83); context.lineTo(478, 83); context.lineTo(478, 154);
  context.moveTo(265, 160); context.lineTo(265, 113); context.lineTo(395, 113); context.lineTo(395, 160);
  context.moveTo(0, 173); context.lineTo(660, 173);
  context.stroke();
  context.globalAlpha = 0.42;
  context.beginPath();
  context.moveTo(0, 216); context.lineTo(115, 184); context.lineTo(188, 196); context.lineTo(270, 179);
  context.moveTo(370, 202); context.lineTo(475, 184); context.lineTo(560, 195); context.lineTo(660, 170);
  context.stroke();
  context.restore();
}

function drawPageTexture(page: FieldNotePage, pageNumber: number, side: 'left' | 'right') {
  const canvas = document.createElement('canvas');
  canvas.width = 1100;
  canvas.height = 1540;
  const context = canvas.getContext('2d');
  if (!context) return new THREE.CanvasTexture(canvas);

  const wash = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  wash.addColorStop(0, '#f1e7d2');
  wash.addColorStop(0.48, '#eadfc9');
  wash.addColorStop(1, '#e1d2b7');
  context.fillStyle = wash;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // A restrained deterministic paper grain, generated from the page data layer.
  for (let i = 0; i < 2100; i += 1) {
    const px = (i * 197 + 31) % canvas.width;
    const py = (i * 313 + 79) % canvas.height;
    context.fillStyle = i % 3 === 0 ? 'rgba(72, 57, 39, .026)' : 'rgba(255, 250, 235, .055)';
    context.fillRect(px, py, i % 9 === 0 ? 4 : 1, i % 13 === 0 ? 2 : 1);
  }

  const edgeWash = context.createLinearGradient(0, 0, canvas.width, 0);
  edgeWash.addColorStop(0, 'rgba(93, 70, 45, .075)');
  edgeWash.addColorStop(0.08, 'transparent');
  edgeWash.addColorStop(0.92, 'transparent');
  edgeWash.addColorStop(1, 'rgba(93, 70, 45, .075)');
  context.fillStyle = edgeWash;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const gutter = context.createLinearGradient(side === 'left' ? canvas.width : 0, 0, side === 'left' ? canvas.width - 100 : 100, 0);
  gutter.addColorStop(0, 'rgba(50, 38, 24, .15)');
  gutter.addColorStop(1, 'rgba(50, 38, 24, 0)');
  context.fillStyle = gutter;
  context.fillRect(side === 'left' ? canvas.width - 100 : 0, 0, 100, canvas.height);

  const margin = 78;
  context.strokeStyle = 'rgba(67, 55, 39, .34)';
  context.lineWidth = 1.3;
  context.strokeRect(40, 38, canvas.width - 80, canvas.height - 76);
  context.strokeStyle = 'rgba(67, 55, 39, .18)';
  context.beginPath();
  context.moveTo(margin, 126);
  context.lineTo(canvas.width - margin, 126);
  context.stroke();

  context.fillStyle = '#79694f';
  context.font = '500 21px ui-monospace, monospace';
  context.letterSpacing = '4px';
  context.fillText(`FIELD NOTE 07     /     ${page.eyebrow}`, margin, 91);
  context.textAlign = 'right';
  context.fillText(String(pageNumber).padStart(2, '0'), canvas.width - margin, 91);
  context.textAlign = 'left';

  const isOriginPage = page.eyebrow === '01 / ORIGIN';
  const titleSize = page.title.length > 18 ? 58 : 70;
  context.fillStyle = '#28251f';
  context.font = `500 ${titleSize}px Georgia, 'Times New Roman', serif`;
  context.letterSpacing = '0.5px';
  let cursorY: number;
  if (isOriginPage && page.paragraphs?.[0]) {
    context.font = '500 61px Georgia, "Times New Roman", serif';
    context.fillStyle = '#28251f';
    context.fillText('Technology started as', margin, 224);
    context.fillStyle = '#8f3f2e';
    context.font = 'italic 68px Georgia, "Times New Roman", serif';
    context.fillText('curiosity', margin, 302);
    context.fillStyle = '#28251f';
    context.font = '500 61px Georgia, "Times New Roman", serif';
    context.fillText('for me.', margin, 380);
    cursorY = 432;
  } else {
    cursorY = wrapCanvasText(context, page.title, margin, 218, canvas.width - margin * 2, titleSize * 1.14) + 24;
  }

  context.fillStyle = '#463d30';
  context.font = '39px Georgia, "Times New Roman", serif';
  context.letterSpacing = '0px';
  for (const paragraph of isOriginPage ? (page.paragraphs ?? []).slice(1) : (page.paragraphs ?? [])) {
    cursorY = wrapCanvasText(context, paragraph, margin + 4, cursorY, canvas.width - margin * 2 - 8, 51) + 22;
  }

  if (page.quote) {
    context.fillStyle = '#8f3f2e';
    context.fillRect(margin + 2, cursorY - 27, 4, 104);
    context.fillStyle = '#88422f';
    context.font = 'italic 47px Georgia, "Times New Roman", serif';
    cursorY = wrapCanvasText(context, page.quote, margin + 28, cursorY, canvas.width - margin * 2 - 30, 58) + 26;
  }

  if (page.flow?.length) {
    const startY = Math.max(cursorY + 12, 350);
    const x = margin + 24;
    const rowHeight = Math.min(133, 790 / page.flow.length);
    context.strokeStyle = 'rgba(136, 66, 47, .55)';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x + 10, startY - 19);
    context.lineTo(x + 10, startY + rowHeight * (page.flow.length - 1) + 5);
    context.stroke();
    page.flow.forEach((step, index) => {
      const y = startY + index * rowHeight;
      context.fillStyle = '#8f3f2e';
      context.beginPath(); context.arc(x + 10, y - 7, 7, 0, Math.PI * 2); context.fill();
      context.fillStyle = '#343027';
      context.font = '600 33px ui-monospace, monospace';
      context.letterSpacing = '2px';
      context.fillText(step, x + 42, y);
      context.letterSpacing = '0px';
      if (index < page.flow!.length - 1) {
        context.strokeStyle = 'rgba(136, 66, 47, .52)';
        context.beginPath();
        context.moveTo(x + 4, y + rowHeight - 31);
        context.lineTo(x + 10, y + rowHeight - 18);
        context.lineTo(x + 16, y + rowHeight - 31);
        context.stroke();
      }
    });
    cursorY = startY + page.flow.length * rowHeight + 12;
  }

  if (page.sections?.length) {
    cursorY += 12;
    for (const section of page.sections) {
      context.strokeStyle = 'rgba(67, 55, 39, .26)';
      context.beginPath(); context.moveTo(margin, cursorY - 26); context.lineTo(canvas.width - margin, cursorY - 26); context.stroke();
      context.fillStyle = '#9b4b36';
      context.font = 'italic 34px Georgia, serif';
      context.fillText(section.number, margin + 2, cursorY + 8);
      context.fillStyle = '#302b23';
      context.font = '600 30px ui-monospace, monospace';
      context.letterSpacing = '2px';
      context.fillText(section.title, margin + 72, cursorY + 8);
      context.letterSpacing = '0px';
      context.fillStyle = '#554a3a';
      context.font = '32px Georgia, "Times New Roman", serif';
      cursorY = wrapCanvasText(context, section.description, margin + 72, cursorY + 52, canvas.width - margin * 2 - 76, 42) + 22;
    }
  }

  if (page.paragraphs?.length && page.sections?.length) {
    context.fillStyle = '#554a3a';
    context.font = 'italic 31px Georgia, serif';
    for (const paragraph of page.paragraphs) {
      cursorY = wrapCanvasText(context, paragraph, margin + 4, cursorY + 12, canvas.width - margin * 2 - 8, 42) + 12;
    }
  }

  const sketchTop = page.flow?.length ? 1040 : Math.max(cursorY + 8, 770);
  if (!page.sections?.length || sketchTop < 1180) drawTempleSketch(context, sketchTop);

  if (page.annotation) {
    context.save();
    context.fillStyle = '#8f3f2e';
    context.font = '500 29px Georgia, serif';
    context.letterSpacing = '7px';
    context.translate(canvas.width - 45, 260);
    context.rotate(Math.PI / 2);
    context.fillText(page.annotation, 0, 0);
    context.restore();
    context.strokeStyle = 'rgba(143, 63, 46, .7)';
    context.lineWidth = 2;
    context.strokeRect(canvas.width - margin - 36, 1312, 32, 32);
    context.fillStyle = '#8f3f2e';
    context.font = '21px Georgia, serif';
    context.letterSpacing = '0px';
    context.fillText('記', canvas.width - margin - 29, 1336);
  }

  if (page.signature) {
    context.strokeStyle = 'rgba(143, 63, 46, .6)';
    context.beginPath(); context.moveTo(margin, 1335); context.lineTo(margin + 190, 1335); context.stroke();
    context.fillStyle = '#8f3f2e';
    context.font = '500 31px ui-monospace, monospace';
    context.letterSpacing = '8px';
    context.fillText(page.signature, margin, 1380);
  }

  context.fillStyle = 'rgba(73, 61, 44, .62)';
  context.font = '16px ui-monospace, monospace';
  context.letterSpacing = '2px';
  context.textAlign = side === 'left' ? 'left' : 'right';
  context.fillText('SATYA  /  PERSONAL ARCHIVE', side === 'left' ? margin : canvas.width - margin, 1482);
  context.textAlign = 'left';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function drawCoverTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1100;
  canvas.height = 1540;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#d7c09b';
  context.fillRect(0, 0, canvas.width, canvas.height);
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, 'rgba(250, 239, 215, .5)');
  gradient.addColorStop(1, 'rgba(105, 79, 50, .15)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 1600; i += 1) {
    const x = (i * 197 + 47) % canvas.width;
    const y = (i * 313 + 83) % canvas.height;
    context.fillStyle = i % 4 === 0 ? 'rgba(66, 49, 31, .025)' : 'rgba(255, 249, 232, .07)';
    context.fillRect(x, y, i % 11 === 0 ? 3 : 1, 1);
  }
  context.strokeStyle = 'rgba(66, 54, 39, .54)';
  context.lineWidth = 3;
  context.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);
  context.strokeStyle = 'rgba(143, 63, 46, .7)';
  context.lineWidth = 2;
  context.strokeRect(58, 58, canvas.width - 116, canvas.height - 116);
  context.fillStyle = '#41382b';
  context.textAlign = 'center';
  context.font = '500 31px ui-monospace, monospace';
  context.letterSpacing = '9px';
  context.fillText(FIELD_NOTE_COVER.eyebrow, canvas.width / 2, 160);
  context.fillStyle = '#2b2822';
  context.font = '500 91px Georgia, "Times New Roman", serif';
  context.letterSpacing = '2px';
  context.fillText(FIELD_NOTE_COVER.title, canvas.width / 2, 300);
  context.fillStyle = '#6f5b3e';
  context.font = '500 24px ui-monospace, monospace';
  context.letterSpacing = '8px';
  context.fillText(FIELD_NOTE_COVER.subtitle, canvas.width / 2, 362);
  context.fillStyle = '#8e4130';
  context.strokeStyle = 'rgba(142, 65, 48, .75)';
  context.lineWidth = 4;
  context.strokeRect(canvas.width / 2 - 31, 405, 62, 62);
  context.font = '42px Georgia, serif';
  context.letterSpacing = '0px';
  context.fillText('記', canvas.width / 2, 451);
  context.fillStyle = '#3e372b';
  context.font = '500 31px ui-monospace, monospace';
  context.letterSpacing = '12px';
  context.fillText(FIELD_NOTE_COVER.signature, canvas.width / 2, 1450);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function bendPage(mesh: THREE.Mesh | null, progress: number) {
  if (!mesh) return;
  const geometry = mesh.geometry as THREE.PlaneGeometry;
  const positions = geometry.attributes.position as THREE.BufferAttribute;
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const normalized = THREE.MathUtils.clamp((x + HALF_PAGE / 2) / HALF_PAGE, 0, 1);
    const curve = Math.sin(normalized * Math.PI) * Math.sin(progress * Math.PI) * 0.09;
    positions.setZ(index, curve);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}

function BookAndDesk({
  isOpen,
  isMobile,
  reducedMotion,
  pageIndex,
  turnRequest,
  onOpen,
  onRequestPageTurn,
  onPageTurnComplete,
}: BookSceneProps) {
  const { camera, gl, size } = useThree();
  const cameraPosition = useRef(new THREE.Vector3());
  const cameraTarget = useRef(new THREE.Vector3());
  const rootRef = useRef<THREE.Group>(null);
  const coverPivotRef = useRef<THREE.Group>(null);
  const pageTurnRef = useRef<THREE.Group>(null);
  const frontTurnRef = useRef<THREE.Mesh>(null);
  const backTurnRef = useRef<THREE.Mesh>(null);
  const pageTurn = useRef({ direction: 0 as -1 | 0 | 1, elapsed: 0 });
  const coverMotion = useRef({ from: 0, to: 0, elapsed: 0, active: true });
  const pagesVisibleRef = useRef(isOpen);
  const [pagesVisible, setPagesVisible] = useState(isOpen);
  const [turning, setTurning] = useState<0 | -1 | 1>(0);

  const pageTextures = useMemo(
    () => FIELD_NOTE_SPREADS.map((spread, index) => ({
      left: drawPageTexture(spread.left, index * 2 + 1, 'left'),
      right: drawPageTexture(spread.right, index * 2 + 2, 'right'),
    })),
    []
  );
  const mobilePageTextures = useMemo(
    () => FIELD_NOTE_PAGES.map((page, index) => drawPageTexture(page, index + 1, index % 2 === 0 ? 'left' : 'right')),
    []
  );
  const coverTexture = useMemo(drawCoverTexture, []);

  useEffect(() => {
    const canvas = coverTexture.image as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    if (!context) return;
    const illustration = new Image();
    illustration.onload = () => {
      context.drawImage(illustration, 185, 505, 730, 770);
      coverTexture.needsUpdate = true;
    };
    illustration.src = '/models/exp-07/cover-illustration.svg';
    return () => { illustration.onload = null; };
  }, [coverTexture]);

  useEffect(() => () => {
    pageTextures.forEach(({ left, right }) => { left.dispose(); right.dispose(); });
    mobilePageTextures.forEach((texture) => texture.dispose());
    coverTexture.dispose();
  }, [coverTexture, mobilePageTextures, pageTextures]);

  useEffect(() => {
    if (isOpen) {
      pagesVisibleRef.current = true;
      setPagesVisible(true);
    }
    coverMotion.current = {
      from: coverPivotRef.current?.rotation.y ?? (isOpen ? 0 : -Math.PI),
      to: isOpen ? -Math.PI : 0,
      elapsed: 0,
      active: true,
    };
  }, [isOpen]);

  const maxIndex = isMobile ? FIELD_NOTE_PAGES.length - 1 : FIELD_NOTE_SPREADS.length - 1;
  const spreadIndex = Math.min(FIELD_NOTE_SPREADS.length - 1, Math.floor(pageIndex / (isMobile ? 2 : 1)));
  const currentSpread = pageTextures[spreadIndex];
  const nextSpread = pageTextures[Math.min(spreadIndex + 1, pageTextures.length - 1)];
  const previousSpread = pageTextures[Math.max(spreadIndex - 1, 0)];
  const currentMobile = mobilePageTextures[Math.min(pageIndex, mobilePageTextures.length - 1)];
  const nextMobile = mobilePageTextures[Math.min(pageIndex + 1, mobilePageTextures.length - 1)];
  const previousMobile = mobilePageTextures[Math.max(pageIndex - 1, 0)];

  useEffect(() => {
    if (!isOpen || turnRequest === 0 || pageTurn.current.direction !== 0) return;
    pageTurn.current = { direction: turnRequest, elapsed: 0 };
    setTurning(turnRequest);
  }, [isOpen, turnRequest]);

  useEffect(() => {
    if (isOpen) return;
    pageTurn.current = { direction: 0, elapsed: 0 };
    setTurning(0);
  }, [isOpen]);

  useFrame((_, delta) => {
    const root = rootRef.current;
    const cover = coverPivotRef.current;
    const targetY = isOpen ? 0.08 : PAGE_HEIGHT / 2 + 0.1;
    const targetZ = isOpen ? -PAGE_HEIGHT / 2 : 0;
    const aimLift = isOpen ? 0.38 : 0.3;
    cameraPosition.current.set(
      0,
      targetY + aimLift + (isOpen ? (isMobile ? 2.8 : 4.8) : (isMobile ? 2.6 : 3.0)),
      targetZ + (isOpen ? (isMobile ? 5.8 : 7.5) : (isMobile ? 7.8 : 8.0))
    );
    cameraTarget.current.set(0, targetY + aimLift, targetZ);
    camera.position.lerp(cameraPosition.current, 1 - Math.exp(-2.7 * delta));
    camera.lookAt(cameraTarget.current);
    if (camera instanceof THREE.PerspectiveCamera) {
      const aspect = size.height > 0 ? size.width / size.height : 1.5;
      const targetZoom = isMobile
        ? isOpen
          ? THREE.MathUtils.clamp(aspect / 0.73, 0.56, 0.95)
          : THREE.MathUtils.clamp(aspect / 0.76, 0.72, 1.08)
        : isOpen
          ? THREE.MathUtils.clamp(0.86 + (aspect - 1.33) * 0.5, 0.82, 1.18)
          : THREE.MathUtils.clamp(0.9 + (aspect - 1.33) * 0.67, 0.85, 1.28);
      camera.zoom = THREE.MathUtils.damp(camera.zoom, targetZoom, 3.8, delta);
      camera.updateProjectionMatrix();
    }

    if (root) {
      const targetX = isOpen ? (isMobile ? -HALF_PAGE / 2 : 0) : -HALF_PAGE / 2;
      root.position.x = THREE.MathUtils.damp(root.position.x, targetX, 5.5, delta);
      root.position.y = THREE.MathUtils.damp(root.position.y, isOpen ? 0.105 : PAGE_HEIGHT / 2 + 0.1, 3.5, delta);
      root.rotation.x = THREE.MathUtils.damp(root.rotation.x, isOpen ? -Math.PI / 2 : 0, 3.5, delta);
      const targetScale = isOpen ? 1.04 : 0.62;
      const nextScale = THREE.MathUtils.damp(root.scale.x, targetScale, 3.2, delta);
      root.scale.setScalar(nextScale);
      root.rotation.y = THREE.MathUtils.damp(root.rotation.y, isOpen ? 0 : -0.06, 3.2, delta);
    }

    if (cover && coverMotion.current.active) {
      const motion = coverMotion.current;
      motion.elapsed += delta;
      const duration = reducedMotion ? 0.01 : 0.92;
      const raw = Math.min(motion.elapsed / duration, 1);
      const eased = raw * raw * (3 - 2 * raw);
      cover.rotation.y = THREE.MathUtils.lerp(motion.from, motion.to, eased);
      if (raw >= 1) motion.active = false;
    }
    if (cover) {
      cover.position.z = THREE.MathUtils.damp(cover.position.z, isOpen ? -0.04 : 0.13, 3.5, delta);
    }

    if (!isOpen && cover && Math.abs(cover.rotation.y) < 0.08 && pagesVisibleRef.current) {
      pagesVisibleRef.current = false;
      setPagesVisible(false);
    }

    const activeTurn = pageTurn.current;
    if (activeTurn.direction !== 0 && pageTurnRef.current) {
      activeTurn.elapsed += delta;
      const duration = reducedMotion ? 0.01 : 0.88;
      const raw = Math.min(activeTurn.elapsed / duration, 1);
      const eased = raw * raw * (3 - 2 * raw);
      const direction = activeTurn.direction;
      pageTurnRef.current.rotation.y = direction === 1 ? -Math.PI * eased : Math.PI * eased;
      bendPage(frontTurnRef.current, eased);
      bendPage(backTurnRef.current, eased);
      if (raw >= 1) {
        pageTurnRef.current.rotation.y = 0;
        bendPage(frontTurnRef.current, 0);
        bendPage(backTurnRef.current, 0);
        activeTurn.direction = 0;
        activeTurn.elapsed = 0;
        setTurning(0);
        onPageTurnComplete(direction);
      }
    }
  });

  const setPointerCursor = (cursor: string) => {
    gl.domElement.style.cursor = cursor;
  };
  const handleCoverClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (!isOpen) onOpen();
  };
  const currentTurnFront = isMobile
    ? currentMobile
    : turning === -1 ? currentSpread.left : currentSpread.right;
  const currentTurnBack = isMobile
    ? (turning === -1 ? previousMobile : nextMobile)
    : turning === -1 ? previousSpread.right : nextSpread.left;
  const underLeft = isMobile
    ? null
    : turning === -1 ? previousSpread.left : currentSpread.left;
  const underRight = isMobile
    ? (turning === 1 ? nextMobile : turning === -1 ? previousMobile : currentMobile)
    : turning === 1 ? nextSpread.right : currentSpread.right;

  return (
    <>
      <mesh position={[0, -0.06, 0.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 6]} />
        <shadowMaterial transparent opacity={0.24} />
      </mesh>

      <group ref={rootRef} position={[-HALF_PAGE / 2, PAGE_HEIGHT / 2 + 0.1, 0]} scale={1.04} rotation={[0, 0, 0]}>
        <mesh position={[HALF_PAGE / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[HALF_PAGE, PAGE_HEIGHT, 0.2]} />
          <meshStandardMaterial color="#dfcba8" roughness={0.94} />
        </mesh>

        <mesh position={[0, 0, 0.015]} castShadow receiveShadow>
          <cylinderGeometry args={[0.1, 0.1, PAGE_HEIGHT, 20]} />
          <meshStandardMaterial color="#5b3926" roughness={0.56} metalness={0.12} />
        </mesh>

        <group visible={pagesVisible}>
          {!isMobile && underLeft && (
            <mesh position={[-HALF_PAGE / 2, 0, PAGE_TOP]} receiveShadow>
              <planeGeometry args={[HALF_PAGE, PAGE_HEIGHT]} />
              <meshStandardMaterial map={underLeft} side={THREE.DoubleSide} roughness={0.95} />
            </mesh>
          )}
          {underRight && (
            <mesh position={[HALF_PAGE / 2, 0, PAGE_TOP]} receiveShadow>
              <planeGeometry args={[HALF_PAGE, PAGE_HEIGHT]} />
              <meshStandardMaterial map={underRight} side={THREE.DoubleSide} roughness={0.95} />
            </mesh>
          )}

          {turning !== 0 && currentTurnFront && currentTurnBack && (
            <group ref={pageTurnRef} position={[0, 0, PAGE_TOP + 0.012]}>
              <mesh
                ref={frontTurnRef}
                position={[turning === 1 || isMobile ? HALF_PAGE / 2 : -HALF_PAGE / 2, 0, PAGE_THICKNESS / 2 + 0.001]}
                castShadow
                receiveShadow
              >
                <planeGeometry args={[HALF_PAGE, PAGE_HEIGHT, PAGE_SEGMENTS, 18]} />
                <meshStandardMaterial map={currentTurnFront} roughness={0.96} />
              </mesh>
              <mesh
                position={[turning === 1 || isMobile ? HALF_PAGE / 2 : -HALF_PAGE / 2, 0, 0]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[HALF_PAGE, PAGE_HEIGHT, PAGE_THICKNESS]} />
                <meshStandardMaterial color="#d8c6a7" roughness={0.94} />
              </mesh>
              <mesh
                ref={backTurnRef}
                position={[turning === 1 || isMobile ? HALF_PAGE / 2 : -HALF_PAGE / 2, 0, -PAGE_THICKNESS / 2 - 0.001]}
                rotation={[0, Math.PI, 0]}
                castShadow
                receiveShadow
              >
                <planeGeometry args={[HALF_PAGE, PAGE_HEIGHT, PAGE_SEGMENTS, 18]} />
                <meshStandardMaterial map={currentTurnBack} roughness={0.96} />
              </mesh>
            </group>
          )}

          {isOpen && (
            <>
              <mesh
                position={[isMobile ? 0 : -HALF_PAGE + 0.07, 0, PAGE_TOP + 0.025]}
                onClick={(event) => { event.stopPropagation(); onRequestPageTurn(-1); }}
              >
                <planeGeometry args={[0.18, PAGE_HEIGHT * 0.76]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
              </mesh>
              {pageIndex < maxIndex && (
                <mesh
                  position={[HALF_PAGE - 0.07, 0, PAGE_TOP + 0.025]}
                  onClick={(event) => { event.stopPropagation(); onRequestPageTurn(1); }}
                >
                  <planeGeometry args={[0.18, PAGE_HEIGHT * 0.76]} />
                  <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
                </mesh>
              )}
            </>
          )}
        </group>

        <group ref={coverPivotRef} position={[0, 0, 0.13]}>
          <mesh
            position={[HALF_PAGE / 2, 0, 0]}
            castShadow
            receiveShadow
            onClick={handleCoverClick}
            onPointerOver={() => setPointerCursor(isOpen ? 'grab' : 'pointer')}
            onPointerOut={() => setPointerCursor('auto')}
          >
            <boxGeometry args={[HALF_PAGE, PAGE_HEIGHT, COVER_DEPTH]} />
            <meshStandardMaterial color="#4b3427" roughness={0.72} metalness={0.08} />
            <meshStandardMaterial color="#4b3427" roughness={0.72} metalness={0.08} />
            <meshStandardMaterial color="#5a4030" roughness={0.72} metalness={0.08} />
            <meshStandardMaterial color="#5a4030" roughness={0.72} metalness={0.08} />
            <meshStandardMaterial map={coverTexture} roughness={0.78} metalness={0.07} />
            <meshStandardMaterial color="#c5ae88" roughness={0.88} metalness={0.02} />
          </mesh>
          <mesh position={[HALF_PAGE / 2, 0, COVER_DEPTH / 2 + 0.004]}>
            <planeGeometry args={[HALF_PAGE - 0.08, PAGE_HEIGHT - 0.08]} />
            <meshStandardMaterial map={coverTexture} roughness={0.88} metalness={0.02} />
          </mesh>
          <mesh position={[HALF_PAGE / 2, 0, -COVER_DEPTH / 2 - 0.012]} castShadow receiveShadow>
            <boxGeometry args={[HALF_PAGE, PAGE_HEIGHT, 0.025]} />
            <meshStandardMaterial color="#603e2b" roughness={0.72} metalness={0.1} />
          </mesh>
        </group>
      </group>

    </>
  );
}

export default function Exp07BookScene({
  className,
  ...props
}: BookSceneProps & { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        shadows
        dpr={props.isMobile ? [1, 1.25] : [1, 1.65]}
        camera={{ position: props.isMobile ? [0, 4.7, 7.5] : [0, 4.9, 6.8], fov: props.isMobile ? 37 : 34 }}
        gl={{ alpha: true, antialias: !props.isMobile, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor('#000000', 0)}
      >
        <ambientLight intensity={0.9} color="#f7e7c8" />
        <directionalLight
          position={[-3.5, 7, 3.8]}
          intensity={2.15}
          color="#ffe3b2"
          castShadow
          shadow-mapSize-width={1536}
          shadow-mapSize-height={1536}
          shadow-camera-left={-7}
          shadow-camera-right={7}
          shadow-camera-top={7}
          shadow-camera-bottom={-7}
          shadow-bias={-0.00025}
        />
        <pointLight position={[3.5, 2.7, -2]} intensity={11} distance={17} color="#bc7040" />
        <Suspense fallback={null}>
          <BookAndDesk {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
