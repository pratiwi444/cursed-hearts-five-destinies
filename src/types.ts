export type CharacterId = 'rei' | 'kairo' | 'yuuma' | 'kira' | 'ren';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type LocationId = 
  | 'courtyard'
  | 'classroom'
  | 'hallway'
  | 'library'
  | 'rooftop'
  | 'training_ground'
  | 'cafe';

export type RelationshipStage = 
  | 'Stranger'
  | 'Acquaintance'
  | 'Friend'
  | 'Close Friend'
  | 'Special Person'
  | 'Romantic Interest'
  | 'Partner';

export interface CharacterStats {
  affection: number; // 0 - 100
  trust: number;     // 0 - 100
  friendship: number;// 0 - 100
  jealousy: number;  // 0 - 100
  stage: RelationshipStage;
}

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  japaneseName: string;
  archetype: string;
  role: string;
  age: number;
  ability: string;
  abilityDescription: string;
  personality: string[];
  bio: string;
  hairColor: string;
  eyeColor: string;
  themeColor: string;
  accentColor: string;
  favoriteLocation: LocationId;
  favoriteGifts: string[];
  dislikedGifts: string[];
  portraitUrl?: string;
  voiceLines: {
    greeting: string;
    happy: string;
    flustered: string;
    jealous: string;
    battle: string;
    romantic: string;
  };
  secrets: {
    title: string;
    description: string;
    unlockAffection: number;
  }[];
}

export interface PlayerStats {
  name: string;
  courage: number;
  intelligence: number;
  empathy: number;
  charisma: number;
  confidence: number;
  supernaturalPower: number;
}

export interface CombatStats {
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  energy: number;
  maxEnergy: number;
  attack: number;
  defense: number;
  level: number;
  exp: number;
  maxExp: number;
}

export interface Item {
  id: string;
  name: string;
  category: 'gift' | 'consumable' | 'quest' | 'book' | 'talisman';
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  value: number;
  effect?: string;
  targetCharacterBonus?: Record<CharacterId, number>;
}

export interface InventorySlot {
  item: Item;
  quantity: number;
}

export interface Quest {
  id: string;
  title: string;
  giver: string;
  description: string;
  category: 'main' | 'romance' | 'supernatural';
  location: LocationId;
  targetCharacter?: CharacterId;
  progress: number;
  maxProgress: number;
  completed: boolean;
  rewardText: string;
}

export interface DialogueChoice {
  text: string;
  nextId?: string;
  statBonus?: Partial<PlayerStats>;
  relationshipBonus?: {
    characterId: CharacterId;
    affection?: number;
    trust?: number;
    friendship?: number;
    jealousy?: number;
  };
  requiredStat?: {
    stat: keyof PlayerStats;
    value: number;
  };
  flagSet?: string;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  characterId?: CharacterId | 'aira' | 'narrator';
  text: string;
  emotion?: 'neutral' | 'smile' | 'smirk' | 'serious' | 'blush' | 'surprised' | 'worried';
  voiceTone?: string;
  choices?: DialogueChoice[];
  nextId?: string;
  onEnterTrigger?: () => void;
}

export interface DateActivity {
  id: string;
  name: string;
  location: LocationId;
  description: string;
  characterId: CharacterId;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface CGMemory {
  id: string;
  title: string;
  characterId: CharacterId;
  chapter: number;
  description: string;
  unlocked: boolean;
  colorScheme: [string, string];
}

export interface SaveSlotData {
  id: number;
  date: string;
  chapter: number;
  chapterTitle: string;
  timeOfDay: TimeOfDay;
  location: LocationId;
  playerName: string;
  playerStats: PlayerStats;
  combatStats: CombatStats;
  relationships: Record<CharacterId, CharacterStats>;
  inventory: InventorySlot[];
  quests?: Quest[];
  activeQuests?: Quest[];
  storyFlags?: string[];
  activeCompanion?: CharacterId | null;
  currentPartner?: CharacterId | null;
}

export interface EnemyEntity {
  id: string;
  name: string;
  type: 'phantom' | 'curse_hound' | 'shadow_wraith' | 'abyssal_lord';
  hp: number;
  maxHp: number;
  attack: number;
  position: [number, number, number];
  targetPosition: [number, number, number];
  isAttacking: boolean;
  attackCooldown: number;
  hitStun: number;
  element: 'dark' | 'void' | 'crimson';
}
