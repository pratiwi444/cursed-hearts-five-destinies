import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameCanvas } from './components/3d/GameCanvas';
import { HUD } from './components/ui/HUD';
import { DialogueBox } from './components/ui/DialogueBox';
import { RelationshipModal } from './components/ui/RelationshipModal';
import { DatingModal } from './components/ui/DatingModal';
import { CharacterDatabaseModal } from './components/ui/CharacterDatabaseModal';
import { InventoryModal } from './components/ui/InventoryModal';
import { QuestModal } from './components/ui/QuestModal';
import { GalleryModal } from './components/ui/GalleryModal';
import { SaveLoadModal } from './components/ui/SaveLoadModal';
import { BattleUI } from './components/ui/BattleUI';
import { MainMenu } from './components/ui/MainMenu';
import { TouchControls } from './components/ui/TouchControls';

import {
  CharacterId,
  TimeOfDay,
  LocationId,
  PlayerStats,
  CombatStats,
  CharacterStats,
  InventorySlot,
  Quest,
  DialogueNode,
  DialogueChoice,
  SaveSlotData
} from './types';

import { INITIAL_CHARACTERS_DATA } from './data/charactersData';
import { INITIAL_INVENTORY, ALL_GIFTS_DATA } from './data/itemsData';
import { INITIAL_QUESTS } from './data/questsData';
import { STORY_DIALOGUES } from './data/storyData';
import { soundManager } from './audio/soundManager';

export default function App() {
  // Game Lifecycle States
  const [inGame, setInGame] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Player & World States
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    name: 'Aira Mizuki',
    level: 1,
    courage: 12,
    charm: 15,
    intelligence: 14,
    spiritualPower: 25
  });

  const [combatStats, setCombatStats] = useState<CombatStats>({
    hp: 250,
    maxHp: 250,
    stamina: 100,
    maxStamina: 100,
    attack: 42,
    defense: 28,
    speed: 15,
    level: 1,
    exp: 40,
    maxExp: 100
  });

  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [location, setLocation] = useState<LocationId>('courtyard');
  const [chapter, setChapter] = useState(1);
  const [chapterTitle, setChapterTitle] = useState('Awakening of the Cursed Seal');

  // Relationships (5 Boys)
  const [relationships, setRelationships] = useState<Record<CharacterId, CharacterStats>>({
    rei: { affection: 35, trust: 30, friendship: 40, jealousy: 10, stage: 'Acquaintance', secretUnlockedCount: 1 },
    kairo: { affection: 25, trust: 20, friendship: 25, jealousy: 5, stage: 'Stranger', secretUnlockedCount: 0 },
    yuuma: { affection: 40, trust: 35, friendship: 45, jealousy: 5, stage: 'Friend', secretUnlockedCount: 1 },
    kira: { affection: 20, trust: 30, friendship: 20, jealousy: 0, stage: 'Acquaintance', secretUnlockedCount: 0 },
    ren: { affection: 30, trust: 15, friendship: 25, jealousy: 15, stage: 'Stranger', secretUnlockedCount: 1 }
  });

  const [activeCompanion, setActiveCompanion] = useState<CharacterId | null>('rei');

  // Inventory & Quests
  const [inventory, setInventory] = useState<InventorySlot[]>(INITIAL_INVENTORY);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);

  // Dialogues & Interaction
  const [activeDialogueNode, setActiveDialogueNode] = useState<DialogueNode | null>(null);
  const [nearbyNpcId, setNearbyNpcId] = useState<string | null>(null);

  // Modals & Activities
  const [activeModal, setActiveModal] = useState<'characters' | 'relationships' | 'dating' | 'battle' | 'quests' | 'inventory' | 'gallery' | 'saveload' | 'menu' | null>(null);
  const [initialDateCharacter, setInitialDateCharacter] = useState<CharacterId | null>(null);
  const [initialGiftTarget, setInitialGiftTarget] = useState<CharacterId | null>(null);

  // 3D Battle Mode
  const [isBattleMode, setIsBattleMode] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  // Check if save file exists in localStorage
  useEffect(() => {
    try {
      const save1 = localStorage.getItem('CURSED_HEARTS_SAVE_SLOT_1');
      if (save1) setHasSavedGame(true);
    } catch {
      // ignore
    }
  }, []);

  // Update relationship stage based on affection
  const updateRelationshipStage = (affection: number): CharacterStats['stage'] => {
    if (affection >= 85) return 'Partner';
    if (affection >= 70) return 'Romantic Interest';
    if (affection >= 55) return 'Special Person';
    if (affection >= 40) return 'Close Friend';
    if (affection >= 25) return 'Friend';
    if (affection >= 15) return 'Acquaintance';
    return 'Stranger';
  };

  // Modify affection & trust for a character
  const adjustAffection = useCallback((charId: CharacterId, affectionDelta: number, trustDelta: number = 0) => {
    setRelationships(prev => {
      const curr = prev[charId];
      const newAffection = Math.min(100, Math.max(0, curr.affection + affectionDelta));
      const newTrust = Math.min(100, Math.max(0, curr.trust + trustDelta));
      const newStage = updateRelationshipStage(newAffection);

      return {
        ...prev,
        [charId]: {
          ...curr,
          affection: newAffection,
          trust: newTrust,
          stage: newStage
        }
      };
    });
  }, []);

  // Handle NPC Proximity Interaction Trigger (from 3D scene)
  const handleNpcInteract = useCallback((npcId: string) => {
    const charId = npcId as CharacterId;
    if (INITIAL_CHARACTERS_DATA[charId]) {
      const dialogueKey = `${charId}_intro`;
      const startNode = STORY_DIALOGUES[dialogueKey] || {
        id: `${charId}_default`,
        speaker: INITIAL_CHARACTERS_DATA[charId].name,
        characterId: charId,
        text: INITIAL_CHARACTERS_DATA[charId].voiceLines.greeting,
        choices: [
          {
            text: "Let's spend time together!",
            relationshipBonus: { affection: 3, trust: 2 }
          },
          {
            text: "How are your supernatural studies going?",
            relationshipBonus: { trust: 4 }
          }
        ]
      };
      soundManager.playVoiceChirp(440);
      setActiveDialogueNode(startNode);
    }
  }, []);

  // Handle selecting a choice in dialogue
  const handleSelectChoice = useCallback((choice: DialogueChoice) => {
    if (choice.relationshipBonus && activeDialogueNode?.characterId && activeDialogueNode.characterId !== 'aira' && activeDialogueNode.characterId !== 'narrator') {
      const charId = activeDialogueNode.characterId as CharacterId;
      adjustAffection(
        charId,
        choice.relationshipBonus.affection || 0,
        choice.relationshipBonus.trust || 0
      );
    }

    if (choice.nextId && STORY_DIALOGUES[choice.nextId]) {
      setActiveDialogueNode(STORY_DIALOGUES[choice.nextId]);
    } else {
      setActiveDialogueNode(null);
    }
  }, [activeDialogueNode, adjustAffection]);

  // Handle Gifting Item
  const handleGiftItem = useCallback((itemId: string, targetChar: CharacterId) => {
    const character = INITIAL_CHARACTERS_DATA[targetChar];
    const isFavorite = character.favoriteGifts.some(g => itemId.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(itemId.toLowerCase()));
    const isDisliked = character.dislikedGifts.some(g => itemId.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(itemId.toLowerCase()));

    let affectionBonus = 8;
    let reaction = `Thank you, ${playerStats.name}. I appreciate this gift.`;

    if (isFavorite) {
      affectionBonus = 20;
      reaction = `Wait... you remembered this is my absolute favorite?! I'm genuinely touched, ${playerStats.name}!`;
    } else if (isDisliked) {
      affectionBonus = 2;
      reaction = `Ah... well, thank you for the thought, ${playerStats.name}.`;
    }

    adjustAffection(targetChar, affectionBonus, 5);

    // Decrement item quantity
    setInventory(prev => prev.map(slot => {
      if (slot.item.id === itemId) {
        return { ...slot, quantity: Math.max(0, slot.quantity - 1) };
      }
      return slot;
    }).filter(slot => slot.quantity > 0));

    return {
      affectionGain: affectionBonus,
      reaction
    };
  }, [playerStats.name, adjustAffection]);

  // Handle Consumable Usage
  const handleUseItem = useCallback((itemId: string) => {
    if (itemId === 'spirit_tea') {
      setCombatStats(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 50) }));
    } else if (itemId === 'celestial_elixir') {
      setCombatStats(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 120), stamina: prev.maxStamina }));
    }

    setInventory(prev => prev.map(slot => {
      if (slot.item.id === itemId) {
        return { ...slot, quantity: Math.max(0, slot.quantity - 1) };
      }
      return slot;
    }).filter(slot => slot.quantity > 0));
  }, []);

  // Handle Date Complete
  const handleDateCompleted = useCallback((charId: CharacterId, affectionGain: number, trustGain: number) => {
    adjustAffection(charId, affectionGain, trustGain);
    // Advance time of day
    setTimeOfDay(prev => prev === 'morning' ? 'afternoon' : (prev === 'afternoon' ? 'evening' : 'night'));
  }, [adjustAffection]);

  // Audio Toggle
  const handleToggleMute = useCallback(() => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  }, []);

  // Save/Load Handlers
  const currentGameStateSnapshot: Omit<SaveSlotData, 'id' | 'date'> = {
    playerName: playerStats.name,
    chapter,
    chapterTitle,
    timeOfDay,
    location,
    relationships,
    activeCompanion,
    playerStats,
    combatStats,
    inventory,
    quests
  };

  const handleLoadGame = useCallback((data: SaveSlotData) => {
    setPlayerStats(data.playerStats);
    setCombatStats(data.combatStats);
    setChapter(data.chapter);
    setChapterTitle(data.chapterTitle);
    setTimeOfDay(data.timeOfDay);
    setLocation(data.location);
    setRelationships(data.relationships);
    setActiveCompanion(data.activeCompanion);
    setInventory(data.inventory);
    setQuests(data.quests);
    setInGame(true);
    soundManager.playBGM('school');
  }, []);

  // Start Battle Exorcism Mode
  const handleStartBattle = useCallback(() => {
    setIsBattleMode(true);
    setIsVictory(false);
    setLocation('training_ground');
    soundManager.playBGM('battle');
  }, []);

  // Exit Battle
  const handleExitBattle = useCallback(() => {
    setIsBattleMode(false);
    setIsVictory(false);
    soundManager.playBGM('school');
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none font-anime">
      {/* 3D GAME ENGINE CANVAS */}
      <GameCanvas
        location={location}
        timeOfDay={timeOfDay}
        isBattleMode={isBattleMode}
        onNpcInteract={handleNpcInteract}
        onProximityChange={setNearbyNpcId}
        activeCompanion={activeCompanion}
      />

      {/* TITLE SCREEN / MAIN MENU */}
      {!inGame && (
        <MainMenu
          onStartGame={(customName) => {
            setPlayerStats(prev => ({ ...prev, name: customName }));
            setInGame(true);
          }}
          onResumeGame={() => {
            try {
              const save1 = localStorage.getItem('CURSED_HEARTS_SAVE_SLOT_1');
              if (save1) {
                handleLoadGame(JSON.parse(save1));
              } else {
                setInGame(true);
              }
            } catch {
              setInGame(true);
            }
          }}
          hasSavedGame={hasSavedGame}
          onOpenCharacters={() => setActiveModal('characters')}
          onOpenBonds={() => setActiveModal('relationships')}
          onOpenGallery={() => setActiveModal('gallery')}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* IN-GAME HUD & OVERLAYS */}
      {inGame && (
        <>
          <HUD
            playerStats={playerStats}
            combatStats={combatStats}
            timeOfDay={timeOfDay}
            location={location}
            chapter={chapter}
            chapterTitle={chapterTitle}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onChangeTimeOfDay={setTimeOfDay}
            onChangeLocation={setLocation}
            onOpenModal={(modal) => {
              if (modal === 'battle') {
                handleStartBattle();
              } else {
                setActiveModal(modal);
              }
            }}
            isBattleMode={isBattleMode}
          />

          {/* Touch Controls for Mobile/Iframe devices */}
          <TouchControls
            onActionAttack={() => soundManager.playAttackSlash()}
            onActionDodge={() => soundManager.playDodgeRoll()}
            onActionInteract={() => {
              if (nearbyNpcId) handleNpcInteract(nearbyNpcId);
            }}
            hasNearbyNPC={Boolean(nearbyNpcId)}
          />

          {/* 3D BATTLE COMBAT HUD */}
          {isBattleMode && (
            <BattleUI
              combatStats={combatStats}
              activeCompanion={activeCompanion}
              onExitBattle={handleExitBattle}
              onUseCompanionAssist={() => {
                soundManager.playMagicImpact();
                // Check if combat victory achieved
                setTimeout(() => {
                  soundManager.playVictoryFanfare();
                  setIsVictory(true);
                }, 1500);
              }}
              onUsePlayerSkill={() => {
                soundManager.playAttackSlash();
              }}
              isVictory={isVictory}
            />
          )}

          {/* CINEMATIC INTERACTIVE DIALOGUE BOX */}
          {activeDialogueNode && (
            <DialogueBox
              currentNode={activeDialogueNode}
              onSelectChoice={handleSelectChoice}
              onClose={() => setActiveDialogueNode(null)}
              onOpenGift={(charId) => {
                setInitialGiftTarget(charId);
                setActiveModal('inventory');
              }}
              onOpenDate={(charId) => {
                setInitialDateCharacter(charId);
                setActiveModal('dating');
              }}
              onStartCompanionBattle={(charId) => {
                setActiveCompanion(charId);
                setActiveDialogueNode(null);
                handleStartBattle();
              }}
              playerStats={playerStats}
            />
          )}

          {/* FEATURE MODALS */}
          {activeModal === 'relationships' && (
            <RelationshipModal
              relationships={relationships}
              activeCompanion={activeCompanion}
              onSetActiveCompanion={(id) => setActiveCompanion(id)}
              onClose={() => setActiveModal(null)}
              onSelectCharacterForDate={(id) => {
                setInitialDateCharacter(id);
                setActiveModal('dating');
              }}
            />
          )}

          {activeModal === 'dating' && (
            <DatingModal
              initialCharacterId={initialDateCharacter}
              onClose={() => {
                setActiveModal(null);
                setInitialDateCharacter(null);
              }}
              onDateCompleted={handleDateCompleted}
            />
          )}

          {activeModal === 'characters' && (
            <CharacterDatabaseModal
              relationships={relationships}
              onClose={() => setActiveModal(null)}
            />
          )}

          {activeModal === 'inventory' && (
            <InventoryModal
              inventory={inventory}
              onUseItem={handleUseItem}
              onGiftItem={handleGiftItem}
              initialTargetCharacter={initialGiftTarget}
              onClose={() => {
                setActiveModal(null);
                setInitialGiftTarget(null);
              }}
            />
          )}

          {activeModal === 'quests' && (
            <QuestModal
              quests={quests}
              onClose={() => setActiveModal(null)}
            />
          )}

          {activeModal === 'gallery' && (
            <GalleryModal
              onClose={() => setActiveModal(null)}
            />
          )}

          {activeModal === 'saveload' && (
            <SaveLoadModal
              currentGameState={currentGameStateSnapshot}
              onLoadGame={handleLoadGame}
              onClose={() => setActiveModal(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
