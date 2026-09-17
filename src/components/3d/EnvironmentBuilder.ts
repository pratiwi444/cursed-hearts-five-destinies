import * as THREE from 'three';
import { LocationId, TimeOfDay } from '../../types';
import { createAnimeMaterial } from './AnimeCharacterMesh';

export interface EnvironmentScene {
  group: THREE.Group;
  update: (time: number) => void;
  interactableSpots: { id: string; name: string; position: THREE.Vector3 }[];
}

export function buildAcademyEnvironment(location: LocationId, timeOfDay: TimeOfDay): EnvironmentScene {
  const group = new THREE.Group();
  group.name = `Environment_${location}`;

  const interactableSpots: { id: string; name: string; position: THREE.Vector3 }[] = [];

  // Lighting adjustments based on TimeOfDay
  let skyColor = 0xbfdbfe;
  let groundColor = 0x334155;
  let lightColor = 0xfffbeb;
  let lightIntensity = 1.3;
  let ambientColor = 0xe2e8f0;
  let ambientIntensity = 0.8;

  if (timeOfDay === 'morning') {
    skyColor = 0xbae6fd;
    lightColor = 0xfef08a;
    lightIntensity = 1.5;
    ambientColor = 0xf1f5f9;
  } else if (timeOfDay === 'afternoon') {
    skyColor = 0xfde047;
    lightColor = 0xfb923c;
    lightIntensity = 1.4;
    ambientColor = 0xfed7aa;
  } else if (timeOfDay === 'evening') {
    skyColor = 0x7c3aed;
    lightColor = 0xf43f5e;
    lightIntensity = 1.0;
    ambientColor = 0xc084fc;
  } else if (timeOfDay === 'night') {
    skyColor = 0x020617;
    lightColor = 0x60a5fa;
    lightIntensity = 0.55;
    ambientColor = 0x1e1b4b;
    ambientIntensity = 0.45;
  }

  // Directional Sun / Moon Light
  const dirLight = new THREE.DirectionalLight(lightColor, lightIntensity);
  dirLight.position.set(15, 25, 15);
  dirLight.castShadow = true;
  group.add(dirLight);

  // Ambient Light
  const ambLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
  group.add(ambLight);

  // Ground Plane
  const groundGeo = new THREE.PlaneGeometry(80, 80);
  const groundMat = createAnimeMaterial(location === 'rooftop' ? 0x1e293b : 0x334155);
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  // SAKURA / SPIRIT PARTICLES SYSTEM
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities: { x: number; y: number; z: number }[] = [];

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 40;
    particlePositions[i * 3 + 1] = Math.random() * 12 + 0.5;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    particleVelocities.push({
      x: (Math.random() - 0.5) * 0.03 + (location === 'rooftop' ? 0.05 : 0.01),
      y: -Math.random() * 0.025 - 0.015,
      z: (Math.random() - 0.5) * 0.03
    });
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: timeOfDay === 'night' ? 0x38bdf8 : 0xfbcfe8, // Celestial blue wisps at night, pink sakura in day
    size: 0.18,
    transparent: true,
    opacity: 0.85
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  group.add(particleSystem);

  // BUILDINGS & LANDMARKS BASED ON LOCATION
  if (location === 'courtyard') {
    // Grand Academy Main Gate & Clock Tower facade
    const buildingMat = createAnimeMaterial(0x1e1b4b);
    const trimMat = createAnimeMaterial(0xf1f5f9);
    const roofMat = createAnimeMaterial(0x0369a1);

    const mainBuilding = new THREE.Mesh(new THREE.BoxGeometry(32, 14, 8), buildingMat);
    mainBuilding.position.set(0, 7, -20);
    group.add(mainBuilding);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(18, 5, 4), roofMat);
    roof.rotation.y = Math.PI * 0.25;
    roof.position.set(0, 16.5, -20);
    group.add(roof);

    // Stone Cobblestone Paths
    const pathMat = createAnimeMaterial(0x64748b);
    const path = new THREE.Mesh(new THREE.PlaneGeometry(6, 40), pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.02, 0);
    group.add(path);

    // Central Mystic Fountain
    const fountainMat = createAnimeMaterial(0x0284c7, 0x38bdf8, 0.4);
    const fountainBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.8, 0.8, 16), createAnimeMaterial(0x475569));
    fountainBase.position.set(0, 0.4, 0);
    group.add(fountainBase);

    const fountainWater = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.7, 16), fountainMat);
    fountainWater.position.set(0, 0.45, 0);
    group.add(fountainWater);

    const fountainCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 2.8, 8), createAnimeMaterial(0x64748b));
    fountainCenter.position.set(0, 1.4, 0);
    group.add(fountainCenter);

    interactableSpots.push({ id: 'fountain', name: 'Mystic Academy Fountain', position: new THREE.Vector3(0, 0, 4) });

    // Sakura Trees in Courtyard
    const trunkMat = createAnimeMaterial(0x451a03);
    const foliageMat = createAnimeMaterial(0xf472b6, 0xfb7185, 0.15);

    const treePositions = [
      [-10, -5], [10, -5], [-12, 8], [12, 8], [-8, -14], [8, -14]
    ];

    treePositions.forEach(([tx, tz]) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 3.5, 8), trunkMat);
      trunk.position.set(tx, 1.75, tz);
      group.add(trunk);

      const foliage = new THREE.Mesh(new THREE.SphereGeometry(2.2, 10, 10), foliageMat);
      foliage.position.set(tx, 4.2, tz);
      foliage.scale.set(1.2, 0.9, 1.2);
      group.add(foliage);
    });

    // Japanese Stone Lanterns (Tōrō) with warm glowing lights
    const lanternPositions = [[-4, -3], [4, -3], [-4, 5], [4, 5]];
    lanternPositions.forEach(([lx, lz]) => {
      const lanternBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.6, 0.5), createAnimeMaterial(0x334155));
      lanternBase.position.set(lx, 0.8, lz);
      group.add(lanternBase);

      const lanternLight = new THREE.PointLight(0xf59e0b, timeOfDay === 'night' ? 1.5 : 0.6, 6);
      lanternLight.position.set(lx, 1.8, lz);
      group.add(lanternLight);
    });
  } else if (location === 'rooftop') {
    // Metal perimeter fence
    const fenceMat = createAnimeMaterial(0x94a3b8);
    for (let i = -15; i <= 15; i += 3) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6), fenceMat);
      bar.position.set(i, 1.1, -16);
      group.add(bar);

      const bar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6), fenceMat);
      bar2.position.set(i, 1.1, 16);
      group.add(bar2);
    }
    // Rooftop AC vent blocks & wooden bench
    const vent = new THREE.Mesh(new THREE.BoxGeometry(4, 2.5, 3), createAnimeMaterial(0x475569));
    vent.position.set(-8, 1.25, -5);
    group.add(vent);

    const bench = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.6, 0.8), createAnimeMaterial(0x78350f));
    bench.position.set(6, 0.3, 2);
    group.add(bench);

    interactableSpots.push({ id: 'stargaze', name: 'Starlit Horizon Viewpoint', position: new THREE.Vector3(0, 0, -14) });
  } else if (location === 'training_ground') {
    // Mystic combat arena circle with glowing runes
    const arenaMat = createAnimeMaterial(0x1e293b);
    const arenaRing = new THREE.Mesh(new THREE.RingGeometry(2, 14, 32), arenaMat);
    arenaRing.rotation.x = -Math.PI / 2;
    arenaRing.position.set(0, 0.03, 0);
    group.add(arenaRing);

    // Glowing boundary runes
    const runeRing = new THREE.Mesh(
      new THREE.TorusGeometry(12, 0.1, 8, 32),
      createAnimeMaterial(0xf97316, 0xea580c, 1.0)
    );
    runeRing.rotation.x = Math.PI / 2;
    runeRing.position.set(0, 0.1, 0);
    group.add(runeRing);

    // Training weapon rack and dummies
    const dummyMat = createAnimeMaterial(0x92400e);
    const dummy = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.8, 8), dummyMat);
    dummy.position.set(-6, 0.9, -6);
    group.add(dummy);

    interactableSpots.push({ id: 'sparring_post', name: 'Supernatural Sparring Dummy', position: new THREE.Vector3(-6, 0, -5) });
  } else if (location === 'library') {
    // Tall bookshelf towers
    const woodMat = createAnimeMaterial(0x3f1d10);
    for (let x = -12; x <= 12; x += 8) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(2, 7, 14), woodMat);
      shelf.position.set(x, 3.5, 0);
      group.add(shelf);
    }
    // Reading study table
    const table = new THREE.Mesh(new THREE.BoxGeometry(4, 0.8, 2.5), woodMat);
    table.position.set(0, 0.4, 6);
    group.add(table);

    const lampLight = new THREE.PointLight(0x22c55e, 1.2, 8);
    lampLight.position.set(0, 1.6, 6);
    group.add(lampLight);

    interactableSpots.push({ id: 'arcane_tomes', name: 'Restricted Grimoire Collection', position: new THREE.Vector3(0, 0, 4) });
  } else {
    // Default / Cafe / Hallway
    const cafeMat = createAnimeMaterial(0x451a03);
    const table = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.8, 12), cafeMat);
    table.position.set(0, 0.4, 0);
    group.add(table);

    interactableSpots.push({ id: 'cafe_seat', name: 'Reserved Cafe Table', position: new THREE.Vector3(0, 0, 2) });
  }

  const update = (time: number) => {
    // Animate falling sakura petals / spirit particles
    const positions = particleGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += particleVelocities[i].x;
      positions[i * 3 + 1] += particleVelocities[i].y;
      positions[i * 3 + 2] += particleVelocities[i].z;

      // Wrap around bounds
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 12;
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      }
    }
    particleGeo.attributes.position.needsUpdate = true;
  };

  return { group, update, interactableSpots };
}
