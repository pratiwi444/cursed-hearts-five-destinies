import * as THREE from 'three';
import { CharacterId } from '../../types';

// Helper to create toon / cel-shaded anime materials
export function createAnimeMaterial(color: number | string, emissive = 0x000000, emissiveIntensity = 0.2): THREE.MeshToonMaterial {
  // 3-tone gradient map for sharp anime cel-shading
  const format = THREE.RGBAFormat;
  const colors = new Uint8Array([
    60, 60, 75, 255,   // Dark shadow tone
    160, 160, 180, 255, // Mid-tone
    255, 255, 255, 255  // Bright highlight
  ]);
  const gradientMap = new THREE.DataTexture(colors, 3, 1, format);
  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;
  gradientMap.needsUpdate = true;

  return new THREE.MeshToonMaterial({
    color: new THREE.Color(color),
    gradientMap,
    emissive: new THREE.Color(emissive),
    emissiveIntensity
  });
}

// Procedural anime eye texture on canvas
function createAnimeEyeTexture(eyeColorHex: string, isBlinking = false, expression: 'normal' | 'happy' | 'serious' | 'blush' = 'normal'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background skin tone
  ctx.fillStyle = '#ffeedd';
  ctx.fillRect(0, 0, 256, 256);

  if (isBlinking) {
    // Closed curved anime eyes
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(80, 140, 45, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(176, 140, 45, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();

    if (expression === 'blush') {
      ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.beginPath();
      ctx.ellipse(75, 175, 25, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(180, 175, 25, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Draw Left and Right Large Expressive Anime Eyes
    const drawEye = (x: number, y: number) => {
      // Sclera (White)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(x, y, 38, 52, 0, 0, Math.PI * 2);
      ctx.fill();

      // Iris gradient
      const irisGrad = ctx.createLinearGradient(x, y - 40, x, y + 40);
      irisGrad.addColorStop(0, '#0f172a');
      irisGrad.addColorStop(0.5, eyeColorHex);
      irisGrad.addColorStop(1, '#ffffff');

      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.ellipse(x, y + 2, 28, 42, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.ellipse(x, y + 5, 14, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Anime Specular Highlights (Sparkles)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x - 10, y - 16, 11, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x + 10, y + 14, 6, 0, Math.PI * 2);
      ctx.fill();

      // Upper Eyelash line
      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(x, y - 10, 42, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Eyebrow
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      if (expression === 'serious') {
        ctx.moveTo(x - 30, y - 55);
        ctx.lineTo(x + 25, y - 48);
      } else {
        ctx.arc(x, y - 50, 32, Math.PI * 1.2, Math.PI * 1.8);
      }
      ctx.stroke();
    };

    drawEye(75, 115);
    drawEye(181, 115);

    // Subtle anime nose
    ctx.fillStyle = '#e2b397';
    ctx.beginPath();
    ctx.ellipse(128, 175, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute anime mouth
    ctx.strokeStyle = '#be123c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (expression === 'happy') {
      ctx.arc(128, 195, 14, 0, Math.PI);
    } else {
      ctx.arc(128, 198, 8, 0.2 * Math.PI, 0.8 * Math.PI);
    }
    ctx.stroke();

    // Blush marks
    if (expression === 'blush' || expression === 'happy') {
      ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
      ctx.beginPath();
      ctx.ellipse(65, 160, 20, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(190, 160, 20, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export interface AnimeModelInstance {
  root: THREE.Group;
  head: THREE.Group;
  body: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  hairGroup?: THREE.Group;
  auraLight?: THREE.PointLight;
  weaponMesh?: THREE.Mesh;
  twinTailL?: THREE.Mesh;
  twinTailR?: THREE.Mesh;
  faceMesh?: THREE.Mesh;
  updateAnimation: (time: number, isMoving: boolean, isAttacking: boolean, isDodging: boolean, speedMultiplier?: number) => void;
  setExpression: (expr: 'normal' | 'happy' | 'serious' | 'blush') => void;
}

// BUILD MC (AIRA MIZUKI)
export function createAiraModel(): AnimeModelInstance {
  const root = new THREE.Group();
  root.name = 'MC_Aira';

  const skinMat = createAnimeMaterial(0xffeedd, 0xffd1b3, 0.15);
  const uniformDark = createAnimeMaterial(0x1e1b4b);
  const uniformWhite = createAnimeMaterial(0xf8fafc);
  const ribbonMat = createAnimeMaterial(0xe11d48);
  const hairMat = createAnimeMaterial(0x312e81); // Midnight indigo
  const socksMat = createAnimeMaterial(0x0f172a);
  const shoeMat = createAnimeMaterial(0x334155);

  // Hips & Body
  const body = new THREE.Group();
  body.position.y = 1.0;
  root.add(body);

  // Torso (Academy Sailor Blazer)
  const torsoGeo = new THREE.CylinderGeometry(0.24, 0.2, 0.55, 12);
  const torso = new THREE.Mesh(torsoGeo, uniformWhite);
  torso.position.y = 0.35;
  body.add(torso);

  // Sailor Collar
  const collarGeo = new THREE.BoxGeometry(0.38, 0.12, 0.36);
  const collar = new THREE.Mesh(collarGeo, uniformDark);
  collar.position.set(0, 0.58, 0);
  body.add(collar);

  // Crimson Chest Ribbon
  const ribbonGeo = new THREE.ConeGeometry(0.12, 0.22, 6);
  const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
  ribbon.rotation.x = Math.PI * 0.9;
  ribbon.position.set(0, 0.48, 0.18);
  body.add(ribbon);

  // Pleated Skirt
  const skirtGeo = new THREE.ConeGeometry(0.38, 0.38, 14, 1, true);
  const skirt = new THREE.Mesh(skirtGeo, uniformDark);
  skirt.position.y = 0.05;
  body.add(skirt);

  // Head Group
  const head = new THREE.Group();
  head.position.y = 0.85;
  body.add(head);

  // Face Geometry with Eye Texture
  const faceGeo = new THREE.SphereGeometry(0.28, 20, 20);
  faceGeo.scale(1, 1.12, 1);
  const eyeTex = createAnimeEyeTexture('#818cf8', false, 'normal');
  const faceMat = new THREE.MeshToonMaterial({
    map: eyeTex,
    color: 0xffeedd
  });
  const faceMesh = new THREE.Mesh(faceGeo, faceMat);
  faceMesh.rotation.y = Math.PI; // Face front
  head.add(faceMesh);

  // Hair Base (Bangs & Back Hair)
  const hairGroup = new THREE.Group();
  head.add(hairGroup);

  const hairCapGeo = new THREE.SphereGeometry(0.31, 16, 16);
  const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
  hairCap.position.set(0, 0.06, -0.05);
  hairGroup.add(hairCap);

  // Front anime bangs
  for (let i = -3; i <= 3; i++) {
    const bangGeo = new THREE.ConeGeometry(0.06, 0.26, 6);
    const bang = new THREE.Mesh(bangGeo, hairMat);
    bang.rotation.z = i * 0.12;
    bang.rotation.x = 0.2;
    bang.position.set(i * 0.08, 0.1, 0.28);
    hairGroup.add(bang);
  }

  // Twin Tails (flowy anime hair)
  const tailGeo = new THREE.CylinderGeometry(0.05, 0.14, 0.9, 8);
  const twinTailL = new THREE.Mesh(tailGeo, hairMat);
  twinTailL.position.set(-0.35, -0.2, -0.15);
  twinTailL.rotation.z = 0.25;
  head.add(twinTailL);

  const twinTailR = new THREE.Mesh(tailGeo, hairMat);
  twinTailR.position.set(0.35, -0.2, -0.15);
  twinTailR.rotation.z = -0.25;
  head.add(twinTailR);

  // Left Arm
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.3, 0.55, 0);
  body.add(leftArm);
  const armGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.55, 8);
  const lArmMesh = new THREE.Mesh(armGeo, uniformWhite);
  lArmMesh.position.y = -0.25;
  leftArm.add(lArmMesh);

  // Right Arm (Weapon Hand)
  const rightArm = new THREE.Group();
  rightArm.position.set(0.3, 0.55, 0);
  body.add(rightArm);
  const rArmMesh = new THREE.Mesh(armGeo, uniformWhite);
  rArmMesh.position.y = -0.25;
  rightArm.add(rArmMesh);

  // Spirit Blade (Aira's Awakened Weapon)
  const bladeGeo = new THREE.BoxGeometry(0.04, 0.9, 0.08);
  const bladeMat = createAnimeMaterial(0xa5b4fc, 0x818cf8, 0.7);
  const weaponMesh = new THREE.Mesh(bladeGeo, bladeMat);
  weaponMesh.position.set(0, -0.4, 0.25);
  weaponMesh.rotation.x = Math.PI * 0.35;
  rightArm.add(weaponMesh);

  // Left Leg
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.13, 0, 0);
  body.add(leftLeg);
  const legGeo = new THREE.CylinderGeometry(0.07, 0.055, 0.85, 8);
  const lLegMesh = new THREE.Mesh(legGeo, socksMat);
  lLegMesh.position.y = -0.42;
  leftLeg.add(lLegMesh);
  const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.2), shoeMat);
  lShoe.position.set(0, -0.85, 0.05);
  leftLeg.add(lShoe);

  // Right Leg
  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.13, 0, 0);
  body.add(rightLeg);
  const rLegMesh = new THREE.Mesh(legGeo, socksMat);
  rLegMesh.position.y = -0.42;
  rightLeg.add(rLegMesh);
  const rShoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.2), shoeMat);
  rShoe.position.set(0, -0.85, 0.05);
  rightLeg.add(rShoe);

  // Anime Light Glow Aura
  const auraLight = new THREE.PointLight(0x818cf8, 0.8, 4);
  auraLight.position.set(0, 1.2, 0);
  root.add(auraLight);

  let currentExpression: 'normal' | 'happy' | 'serious' | 'blush' = 'normal';

  const setExpression = (expr: 'normal' | 'happy' | 'serious' | 'blush') => {
    currentExpression = expr;
    faceMesh.material = new THREE.MeshToonMaterial({
      map: createAnimeEyeTexture('#818cf8', false, expr),
      color: 0xffeedd
    });
  };

  const updateAnimation = (time: number, isMoving: boolean, isAttacking: boolean, isDodging: boolean, speedMultiplier = 1) => {
    // Blinking effect
    const blinkCycle = Math.sin(time * 0.7);
    if (blinkCycle > 0.985) {
      faceMesh.material = new THREE.MeshToonMaterial({
        map: createAnimeEyeTexture('#818cf8', true, currentExpression),
        color: 0xffeedd
      });
    }

    // Hair physics wave
    const hairWave = Math.sin(time * 3) * 0.08;
    twinTailL.rotation.z = 0.25 + hairWave + (isMoving ? 0.2 : 0);
    twinTailR.rotation.z = -0.25 - hairWave - (isMoving ? 0.2 : 0);
    twinTailL.rotation.x = isMoving ? 0.4 : Math.sin(time * 2) * 0.05;
    twinTailR.rotation.x = isMoving ? 0.4 : Math.sin(time * 2) * 0.05;

    if (isDodging) {
      // Fast spin roll
      body.rotation.x = time * 12;
      body.position.y = 0.6;
      return;
    } else {
      body.rotation.x = 0;
    }

    if (isAttacking) {
      // Rapid slash combo motion
      const slashCycle = (time * 14) % (Math.PI * 2);
      rightArm.rotation.x = -Math.sin(slashCycle) * 1.5;
      rightArm.rotation.z = Math.cos(slashCycle) * 0.8;
      body.rotation.y = Math.sin(slashCycle) * 0.4;
      leftArm.rotation.x = 0.4;
      auraLight.intensity = 2.5;
    } else if (isMoving) {
      // Run / walk cycle
      const cycle = time * 8 * speedMultiplier;
      body.position.y = 1.0 + Math.abs(Math.sin(cycle)) * 0.08;
      leftLeg.rotation.x = Math.sin(cycle) * 0.65;
      rightLeg.rotation.x = -Math.sin(cycle) * 0.65;
      leftArm.rotation.x = -Math.sin(cycle) * 0.55;
      rightArm.rotation.x = Math.sin(cycle) * 0.55;
      body.rotation.y = 0;
      auraLight.intensity = 1.0;
    } else {
      // Idle breathing
      const breath = Math.sin(time * 2.5);
      body.position.y = 1.0 + breath * 0.03;
      head.position.y = 0.85 + breath * 0.01;
      leftArm.rotation.x = breath * 0.06;
      rightArm.rotation.x = -breath * 0.06;
      leftLeg.rotation.x = 0;
      rightLeg.rotation.x = 0;
      body.rotation.y = 0;
      auraLight.intensity = 0.6 + breath * 0.2;
    }
  };

  return {
    root,
    head,
    body,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    hairGroup,
    auraLight,
    weaponMesh,
    twinTailL,
    twinTailR,
    faceMesh,
    updateAnimation,
    setExpression
  };
}

// BUILD LOVE INTEREST 3D ANIME MODELS
export function createMaleCharacterModel(id: CharacterId): AnimeModelInstance {
  const root = new THREE.Group();
  root.name = `Character_${id}`;

  const skinMat = createAnimeMaterial(0xffeedd, 0xffd1b3, 0.15);

  let hairColor = 0xe2e8f0; // Silver for Rei
  let eyeColorHex = '#38bdf8';
  let coatColor = 0x0f172a;
  let accentColor = 0x38bdf8;
  let scale = 1.05; // Slightly taller than MC

  if (id === 'rei') {
    hairColor = 0xf1f5f9; // Silver white
    eyeColorHex = '#38bdf8'; // Glowing azure
    coatColor = 0x1e293b;
    accentColor = 0x0284c7;
    scale = 1.12;
  } else if (id === 'kairo') {
    hairColor = 0x0f172a; // Jet black
    eyeColorHex = '#64748b'; // Slate dark
    coatColor = 0x18181b;
    accentColor = 0x6366f1;
    scale = 1.06;
  } else if (id === 'yuuma') {
    hairColor = 0x78350f; // Chestnut red tips
    eyeColorHex = '#f97316'; // Amber gold
    coatColor = 0x431407;
    accentColor = 0xea580c;
    scale = 1.08;
  } else if (id === 'kira') {
    hairColor = 0xdbeafe; // Platinum cyan
    eyeColorHex = '#06b6d4'; // Ice cyan
    coatColor = 0x1e1b4b;
    accentColor = 0x0891b2;
    scale = 1.07;
  } else if (id === 'ren') {
    hairColor = 0x881337; // Crimson black
    eyeColorHex = '#e11d48'; // Ruby red
    coatColor = 0x27272a;
    accentColor = 0xbe123c;
    scale = 1.09;
  }

  root.scale.set(scale, scale, scale);

  const hairMat = createAnimeMaterial(hairColor);
  const coatMat = createAnimeMaterial(coatColor);
  const accentMat = createAnimeMaterial(accentColor, accentColor, 0.4);
  const pantsMat = createAnimeMaterial(0x1e293b);

  const body = new THREE.Group();
  body.position.y = 1.0;
  root.add(body);

  // Torso
  const torsoGeo = new THREE.CylinderGeometry(0.28, 0.24, 0.65, 12);
  const torso = new THREE.Mesh(torsoGeo, coatMat);
  torso.position.y = 0.4;
  body.add(torso);

  // High Collar
  const collarGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.16, 10);
  const collar = new THREE.Mesh(collarGeo, accentMat);
  collar.position.set(0, 0.72, 0);
  body.add(collar);

  // Head Group
  const head = new THREE.Group();
  head.position.y = 0.95;
  body.add(head);

  // Face Geometry
  const faceGeo = new THREE.SphereGeometry(0.28, 20, 20);
  faceGeo.scale(1, 1.15, 1);
  const eyeTex = createAnimeEyeTexture(eyeColorHex, false, 'normal');
  const faceMat = new THREE.MeshToonMaterial({
    map: eyeTex,
    color: 0xffeedd
  });
  const faceMesh = new THREE.Mesh(faceGeo, faceMat);
  faceMesh.rotation.y = Math.PI;
  head.add(faceMesh);

  // Spiky Anime Hair
  const hairGroup = new THREE.Group();
  head.add(hairGroup);

  const hairCapGeo = new THREE.SphereGeometry(0.32, 16, 16);
  const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
  hairCap.position.set(0, 0.08, -0.04);
  hairGroup.add(hairCap);

  // Custom hair spikes based on character archetype
  const numSpikes = id === 'yuuma' ? 14 : (id === 'rei' ? 12 : 9);
  for (let i = 0; i < numSpikes; i++) {
    const spikeGeo = new THREE.ConeGeometry(0.08, 0.35, 6);
    const spike = new THREE.Mesh(spikeGeo, hairMat);
    const angle = (i / numSpikes) * Math.PI * 1.8 - 0.9;
    spike.position.set(Math.sin(angle) * 0.26, 0.22 + Math.cos(angle) * 0.1, Math.cos(angle) * 0.15);
    spike.rotation.z = -angle * 0.6;
    spike.rotation.x = -0.3;
    hairGroup.add(spike);
  }

  // Left & Right Arms
  const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.65, 8);
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.35, 0.65, 0);
  body.add(leftArm);
  const lArmMesh = new THREE.Mesh(armGeo, coatMat);
  lArmMesh.position.y = -0.3;
  leftArm.add(lArmMesh);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.35, 0.65, 0);
  body.add(rightArm);
  const rArmMesh = new THREE.Mesh(armGeo, coatMat);
  rArmMesh.position.y = -0.3;
  rightArm.add(rArmMesh);

  // Left & Right Legs
  const legGeo = new THREE.CylinderGeometry(0.09, 0.075, 0.9, 8);
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.15, 0, 0);
  body.add(leftLeg);
  const lLegMesh = new THREE.Mesh(legGeo, pantsMat);
  lLegMesh.position.y = -0.45;
  leftLeg.add(lLegMesh);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.15, 0, 0);
  body.add(rightLeg);
  const rLegMesh = new THREE.Mesh(legGeo, pantsMat);
  rLegMesh.position.y = -0.45;
  rightLeg.add(rLegMesh);

  // Supernatural Aura Light
  const auraLight = new THREE.PointLight(accentColor, 1.2, 5);
  auraLight.position.set(0, 1.2, 0);
  root.add(auraLight);

  // Archetype Unique Visual Prop / VFX
  if (id === 'rei') {
    // Void ring floating behind him
    const ringGeo = new THREE.TorusGeometry(0.7, 0.025, 8, 32);
    const ringMat = createAnimeMaterial(0x38bdf8, 0x0284c7, 0.8);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 1.3, -0.25);
    root.add(ring);
  } else if (id === 'ren') {
    // Crimson threads hovering around hands
    const threadGeo = new THREE.TorusGeometry(0.4, 0.015, 6, 24);
    const threadMat = createAnimeMaterial(0xe11d48, 0xbe123c, 0.9);
    const thread = new THREE.Mesh(threadGeo, threadMat);
    thread.rotation.x = Math.PI * 0.4;
    thread.position.set(0.35, 0.8, 0.2);
    root.add(thread);
  }

  let currentExpression: 'normal' | 'happy' | 'serious' | 'blush' = 'normal';

  const setExpression = (expr: 'normal' | 'happy' | 'serious' | 'blush') => {
    currentExpression = expr;
    faceMesh.material = new THREE.MeshToonMaterial({
      map: createAnimeEyeTexture(eyeColorHex, false, expr),
      color: 0xffeedd
    });
  };

  const updateAnimation = (time: number, isMoving: boolean, isAttacking: boolean, isDodging: boolean, speedMultiplier = 1) => {
    // Idle breathing & character personality stance
    const breath = Math.sin(time * 2.2);
    body.position.y = 1.0 + breath * 0.025;

    if (id === 'kairo') {
      // Stoic folded arms
      leftArm.rotation.x = 0.9;
      leftArm.rotation.z = 0.4;
      rightArm.rotation.x = 0.9;
      rightArm.rotation.z = -0.4;
    } else if (id === 'rei') {
      // Relaxed one hand in pocket
      leftArm.rotation.x = 0.2;
      rightArm.rotation.x = breath * 0.05;
    } else if (id === 'yuuma') {
      // Energetic ready stance
      leftArm.rotation.x = 0.5 + breath * 0.08;
      rightArm.rotation.x = 0.5 - breath * 0.08;
    } else {
      leftArm.rotation.x = breath * 0.05;
      rightArm.rotation.x = -breath * 0.05;
    }

    auraLight.intensity = 0.8 + Math.sin(time * 3) * 0.3;
  };

  return {
    root,
    head,
    body,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    hairGroup,
    auraLight,
    faceMesh,
    updateAnimation,
    setExpression
  };
}

// BUILD ENEMY CURSED PHANTOM
export function createPhantomEnemyModel(): { root: THREE.Group; update: (time: number) => void } {
  const root = new THREE.Group();
  root.name = 'Enemy_Phantom';

  const darkMat = createAnimeMaterial(0x18181b, 0x4c0519, 0.4);
  const redGlow = createAnimeMaterial(0xe11d48, 0xff0033, 1.0);

  // Ethereal floating body
  const bodyGeo = new THREE.ConeGeometry(0.45, 1.2, 8, 1, true);
  const body = new THREE.Mesh(bodyGeo, darkMat);
  body.rotation.x = Math.PI;
  body.position.y = 1.1;
  root.add(body);

  // Glowing red eye slits
  const eye1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.08), redGlow);
  eye1.position.set(-0.12, 1.4, 0.35);
  root.add(eye1);

  const eye2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.08), redGlow);
  eye2.position.set(0.12, 1.4, 0.35);
  root.add(eye2);

  // Horns
  const hornGeo = new THREE.ConeGeometry(0.08, 0.4, 6);
  const hornL = new THREE.Mesh(hornGeo, darkMat);
  hornL.position.set(-0.25, 1.7, 0.1);
  hornL.rotation.z = 0.4;
  root.add(hornL);

  const hornR = new THREE.Mesh(hornGeo, darkMat);
  hornR.position.set(0.25, 1.7, 0.1);
  hornR.rotation.z = -0.4;
  root.add(hornR);

  const update = (time: number) => {
    body.position.y = 1.1 + Math.sin(time * 3) * 0.12;
    body.rotation.y = time * 1.5;
  };

  return { root, update };
}
