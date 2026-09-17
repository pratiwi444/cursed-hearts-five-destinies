import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CharacterId, LocationId, TimeOfDay } from '../../types';
import { createAiraModel, createMaleCharacterModel, createPhantomEnemyModel, AnimeModelInstance } from './AnimeCharacterMesh';
import { buildAcademyEnvironment, EnvironmentScene } from './EnvironmentBuilder';
import { soundManager } from '../../audio/soundManager';

interface GameCanvasProps {
  location: LocationId;
  timeOfDay: TimeOfDay;
  isBattleMode: boolean;
  activeCompanion: CharacterId | null;
  onInteractCharacter: (charId: CharacterId) => void;
  onTriggerBattleVictory?: () => void;
  onPlayerTakeDamage?: (dmg: number) => void;
  isDialogueOpen: boolean;
  targetDialogueCharacter: CharacterId | null;
  playerHp: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  location,
  timeOfDay,
  isBattleMode,
  activeCompanion,
  onInteractCharacter,
  onTriggerBattleVictory,
  onPlayerTakeDamage,
  isDialogueOpen,
  targetDialogueCharacter,
  playerHp
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // References to keep in sync with frame loop
  const stateRef = useRef({
    keys: {
      KeyW: false, KeyA: false, KeyS: false, KeyD: false,
      ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false,
      ShiftLeft: false, Space: false, KeyE: false
    },
    isPointerDown: false,
    prevPointer: { x: 0, y: 0 },
    cameraAngle: { yaw: 0, pitch: 0.35 },
    playerPos: new THREE.Vector3(0, 0, 8),
    playerVelocity: new THREE.Vector3(),
    playerRotation: 0,
    isMoving: false,
    isAttacking: false,
    isDodging: false,
    dodgeTimer: 0,
    attackTimer: 0,
    nearbyCharacter: null as CharacterId | null,
    enemies: [] as {
      mesh: THREE.Group;
      pos: THREE.Vector3;
      hp: number;
      maxHp: number;
      update: (t: number) => void;
      attackCd: number;
    }[]
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(timeOfDay === 'night' ? 0x050816 : 0xbfdbfe);
    scene.fog = new THREE.FogExp2(timeOfDay === 'night' ? 0x0a0f29 : 0xdbeafe, 0.015);

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Build Environment
    const env: EnvironmentScene = buildAcademyEnvironment(location, timeOfDay);
    scene.add(env.group);

    // 3. Spawn MC (Aira Mizuki)
    const mc: AnimeModelInstance = createAiraModel();
    scene.add(mc.root);
    mc.root.position.copy(stateRef.current.playerPos);

    // 4. Spawn 5 Male Characters in the World
    const characterInstances: Record<CharacterId, { instance: AnimeModelInstance; defaultPos: THREE.Vector3 }> = {
      rei: { instance: createMaleCharacterModel('rei'), defaultPos: new THREE.Vector3(0, 0, -10) },
      kairo: { instance: createMaleCharacterModel('kairo'), defaultPos: new THREE.Vector3(-8, 0, -4) },
      yuuma: { instance: createMaleCharacterModel('yuuma'), defaultPos: new THREE.Vector3(8, 0, -3) },
      kira: { instance: createMaleCharacterModel('kira'), defaultPos: new THREE.Vector3(-4, 0, 4) },
      ren: { instance: createMaleCharacterModel('ren'), defaultPos: new THREE.Vector3(5, 0, 6) }
    };

    // Position characters depending on location
    if (location === 'rooftop') {
      characterInstances.rei.defaultPos.set(0, 0, -6);
      characterInstances.kira.defaultPos.set(6, 0, 2);
    } else if (location === 'library') {
      characterInstances.kairo.defaultPos.set(0, 0, 5);
      characterInstances.kira.defaultPos.set(-6, 0, 3);
    } else if (location === 'training_ground') {
      characterInstances.yuuma.defaultPos.set(0, 0, -4);
      characterInstances.rei.defaultPos.set(-7, 0, 0);
    }

    Object.entries(characterInstances).forEach(([id, data]) => {
      data.instance.root.position.copy(data.defaultPos);
      // Face towards center/path
      data.instance.root.lookAt(0, 0, 0);
      scene.add(data.instance.root);
    });

    // 5. Spawn Enemies if Battle Mode is active
    stateRef.current.enemies = [];
    if (isBattleMode) {
      for (let i = 0; i < 3; i++) {
        const enemy = createPhantomEnemyModel();
        const angle = (i / 3) * Math.PI * 2;
        const enemyPos = new THREE.Vector3(Math.cos(angle) * 9, 0, Math.sin(angle) * 9);
        enemy.root.position.copy(enemyPos);
        scene.add(enemy.root);

        stateRef.current.enemies.push({
          mesh: enemy.root,
          pos: enemyPos,
          hp: 150,
          maxHp: 150,
          update: enemy.update,
          attackCd: Math.random() * 2
        });
      }
    }

    // Input Event Listeners
    const onKeyDown = (e: KeyboardEvent) => {
      const code = e.code as keyof typeof stateRef.current.keys;
      if (code in stateRef.current.keys) {
        stateRef.current.keys[code] = true;
      }
      if (e.code === 'KeyE' && stateRef.current.nearbyCharacter) {
        onInteractCharacter(stateRef.current.nearbyCharacter);
      }
      if (e.code === 'Space' && !stateRef.current.isDodging) {
        // Trigger dodge roll
        stateRef.current.isDodging = true;
        stateRef.current.dodgeTimer = 0.35;
        soundManager.playDodge();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const code = e.code as keyof typeof stateRef.current.keys;
      if (code in stateRef.current.keys) {
        stateRef.current.keys[code] = false;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && !isDialogueOpen) {
        // Left click: Attack
        stateRef.current.isAttacking = true;
        stateRef.current.attackTimer = 0.28;
        soundManager.playAttackSlash();

        // Check melee hit on enemies in battle mode
        if (isBattleMode) {
          stateRef.current.enemies.forEach(enemy => {
            if (enemy.hp > 0 && enemy.pos.distanceTo(stateRef.current.playerPos) < 2.8) {
              enemy.hp -= 45;
              soundManager.playMagicImpact();
              if (enemy.hp <= 0) {
                scene.remove(enemy.mesh);
              }
            }
          });

          // Check if all defeated
          const allDead = stateRef.current.enemies.every(e => e.hp <= 0);
          if (allDead && onTriggerBattleVictory) {
            onTriggerBattleVictory();
          }
        }
      }
      stateRef.current.isPointerDown = true;
      stateRef.current.prevPointer = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (stateRef.current.isPointerDown) {
        const deltaX = e.clientX - stateRef.current.prevPointer.x;
        const deltaY = e.clientY - stateRef.current.prevPointer.y;
        stateRef.current.cameraAngle.yaw -= deltaX * 0.005;
        stateRef.current.cameraAngle.pitch = Math.max(0.1, Math.min(1.2, stateRef.current.cameraAngle.pitch + deltaY * 0.005));
        stateRef.current.prevPointer = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      stateRef.current.isPointerDown = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch handlers for mobile / tablet
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        stateRef.current.isPointerDown = true;
        stateRef.current.prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (stateRef.current.isPointerDown && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - stateRef.current.prevPointer.x;
        const deltaY = e.touches[0].clientY - stateRef.current.prevPointer.y;
        stateRef.current.cameraAngle.yaw -= deltaX * 0.008;
        stateRef.current.cameraAngle.pitch = Math.max(0.1, Math.min(1.2, stateRef.current.cameraAngle.pitch + deltaY * 0.008));
        stateRef.current.prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      stateRef.current.isPointerDown = false;
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Main Game Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Update Environment (Sakura petals, lights)
      env.update(time);

      // Player Movement Logic
      const keys = stateRef.current.keys;
      const moveForward = keys.KeyW || keys.ArrowUp;
      const moveBackward = keys.KeyS || keys.ArrowDown;
      const moveLeft = keys.KeyA || keys.ArrowLeft;
      const moveRight = keys.KeyD || keys.ArrowRight;
      const isSprint = keys.ShiftLeft;

      let moveX = 0;
      let moveZ = 0;
      if (moveForward) moveZ -= 1;
      if (moveBackward) moveZ += 1;
      if (moveLeft) moveX -= 1;
      if (moveRight) moveX += 1;

      const isMoving = (moveX !== 0 || moveZ !== 0) && !isDialogueOpen;
      stateRef.current.isMoving = isMoving;

      // Update Dodge & Attack Timers
      if (stateRef.current.dodgeTimer > 0) {
        stateRef.current.dodgeTimer -= delta;
        if (stateRef.current.dodgeTimer <= 0) stateRef.current.isDodging = false;
      }
      if (stateRef.current.attackTimer > 0) {
        stateRef.current.attackTimer -= delta;
        if (stateRef.current.attackTimer <= 0) stateRef.current.isAttacking = false;
      }

      if (isMoving) {
        // Calculate camera-relative movement direction
        const inputAngle = Math.atan2(moveX, moveZ);
        const targetAngle = stateRef.current.cameraAngle.yaw + inputAngle + Math.PI;
        stateRef.current.playerRotation = targetAngle;

        const speed = (isSprint ? 9.5 : 5.2) * delta;
        const forward = new THREE.Vector3(Math.sin(targetAngle), 0, Math.cos(targetAngle)).normalize();
        stateRef.current.playerPos.addScaledVector(forward, speed);

        // Clamp boundary
        stateRef.current.playerPos.x = Math.max(-25, Math.min(25, stateRef.current.playerPos.x));
        stateRef.current.playerPos.z = Math.max(-25, Math.min(25, stateRef.current.playerPos.z));

        // Step sound trigger (every ~0.35s)
        if (Math.floor(time * 3.5) % 2 === 0 && Math.random() < 0.05) {
          soundManager.playClick();
        }
      }

      // Update MC 3D Mesh
      mc.root.position.copy(stateRef.current.playerPos);
      mc.root.rotation.y = stateRef.current.playerRotation;
      mc.updateAnimation(time, isMoving, stateRef.current.isAttacking, stateRef.current.isDodging, isSprint ? 1.5 : 1.0);

      // Update Male Character Models & Check Proximity
      let closestChar: CharacterId | null = null;
      let minDistance = 3.5;

      Object.entries(characterInstances).forEach(([id, charData]) => {
        charData.instance.updateAnimation(time, false, false, false);
        const dist = stateRef.current.playerPos.distanceTo(charData.instance.root.position);
        if (dist < minDistance) {
          minDistance = dist;
          closestChar = id as CharacterId;
          // Turn character to look towards player
          charData.instance.root.lookAt(stateRef.current.playerPos.x, charData.instance.root.position.y, stateRef.current.playerPos.z);
        }
      });
      stateRef.current.nearbyCharacter = closestChar;

      // Update Enemies & Enemy AI in Battle Mode
      if (isBattleMode) {
        stateRef.current.enemies.forEach(enemy => {
          if (enemy.hp <= 0) return;
          enemy.update(time);

          // Chase Player
          const toPlayer = new THREE.Vector3().subVectors(stateRef.current.playerPos, enemy.pos);
          const dist = toPlayer.length();

          if (dist > 1.8) {
            toPlayer.normalize();
            enemy.pos.addScaledVector(toPlayer, 2.2 * delta);
            enemy.mesh.position.copy(enemy.pos);
            enemy.mesh.lookAt(stateRef.current.playerPos.x, enemy.pos.y, stateRef.current.playerPos.z);
          } else {
            // Attack player
            enemy.attackCd -= delta;
            if (enemy.attackCd <= 0) {
              enemy.attackCd = 1.8;
              if (onPlayerTakeDamage && !stateRef.current.isDodging) {
                onPlayerTakeDamage(18);
                soundManager.playMagicImpact();
              }
            }
          }
        });
      }

      // Camera Follow System
      if (isDialogueOpen && targetDialogueCharacter) {
        // Dramatic Cinematic Camera for Dialogue / Romance
        const charData = characterInstances[targetDialogueCharacter];
        if (charData) {
          const charPos = charData.instance.root.position;
          // Position camera over MC's shoulder facing the boy
          const camTarget = new THREE.Vector3().lerpVectors(stateRef.current.playerPos, charPos, 0.5);
          camTarget.y = 1.4;

          const targetCamPos = new THREE.Vector3(
            charPos.x + Math.sin(time * 0.2) * 0.5 + 1.2,
            1.6,
            charPos.z + 1.8
          );
          camera.position.lerp(targetCamPos, 0.08);
          camera.lookAt(charPos.x, 1.45, charPos.z);
        }
      } else {
        // Standard Third-Person Orbit Follow Camera
        const camDistance = 5.2;
        const camYOffset = 1.6;
        const targetX = stateRef.current.playerPos.x + Math.sin(stateRef.current.cameraAngle.yaw) * camDistance * Math.cos(stateRef.current.cameraAngle.pitch);
        const targetZ = stateRef.current.playerPos.z + Math.cos(stateRef.current.cameraAngle.yaw) * camDistance * Math.cos(stateRef.current.cameraAngle.pitch);
        const targetY = stateRef.current.playerPos.y + camYOffset + Math.sin(stateRef.current.cameraAngle.pitch) * camDistance;

        camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.12);
        camera.lookAt(stateRef.current.playerPos.x, stateRef.current.playerPos.y + 1.2, stateRef.current.playerPos.z);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [location, timeOfDay, isBattleMode, isDialogueOpen, targetDialogueCharacter]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden" ref={containerRef}>
      {/* Proximity Interaction Prompt */}
      {stateRef.current.nearbyCharacter && !isDialogueOpen && !isBattleMode && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <div className="bg-slate-900/90 backdrop-blur-md border border-indigo-500/50 shadow-2xl shadow-indigo-500/30 px-5 py-2.5 rounded-full flex items-center gap-3 animate-bounce">
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs px-2.5 py-1 rounded-md shadow">
              PRESS E
            </span>
            <span className="text-white text-sm font-anime font-medium">
              Talk with {stateRef.current.nearbyCharacter.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
