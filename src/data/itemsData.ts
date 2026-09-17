import { Item } from '../types';

export const ALL_ITEMS: Record<string, Item> = {
  silver_hourglass: {
    id: 'silver_hourglass',
    name: 'Silver Hourglass',
    category: 'gift',
    rarity: 'rare',
    icon: '⏳',
    description: 'An enchanted chronometer that flows with lunar silver sand. Rei Kurosawa is fascinated by temporal anomalies.',
    value: 250,
    targetCharacterBonus: { rei: 15, kairo: 5, yuuma: 2, kira: 8, ren: 4 }
  },
  sweet_taiyaki: {
    id: 'sweet_taiyaki',
    name: 'Warm Custard Taiyaki',
    category: 'gift',
    rarity: 'common',
    icon: '🐟',
    description: 'Freshly baked fish-shaped pastry with molten sweet cream. A favorite comfort treat for Rei and Yuuma.',
    value: 50,
    targetCharacterBonus: { rei: 10, kairo: 4, yuuma: 12, kira: 2, ren: 6 }
  },
  shadow_talisman: {
    id: 'shadow_talisman',
    name: 'Shadow Talisman',
    category: 'gift',
    rarity: 'rare',
    icon: '🔮',
    description: 'Carved obsidian infused with twilight warding runes. Kairo resonates deeply with this dark harmonic energy.',
    value: 300,
    targetCharacterBonus: { rei: 5, kairo: 18, yuuma: 2, kira: 5, ren: 8 }
  },
  artisan_green_tea: {
    id: 'artisan_green_tea',
    name: 'Kyoto Ceremonial Matcha',
    category: 'gift',
    rarity: 'common',
    icon: '🍵',
    description: 'Finely ground stone-milled green tea with a calm, meditative aroma. Kairo and Kira appreciate its subtlety.',
    value: 80,
    targetCharacterBonus: { rei: 6, kairo: 12, yuuma: 4, kira: 10, ren: 5 }
  },
  spicy_curry_bento: {
    id: 'spicy_curry_bento',
    name: 'Triple-Pepper Curry Bento',
    category: 'gift',
    rarity: 'common',
    icon: '🍱',
    description: 'A hearty lunchbox overflowing with spicy katsu curry. Yuuma’s eyes instantly light up whenever he smells it.',
    value: 90,
    targetCharacterBonus: { rei: 4, kairo: 3, yuuma: 18, kira: 1, ren: 5 }
  },
  sparring_wraps: {
    id: 'sparring_wraps',
    name: 'Reinforced Fist Wraps',
    category: 'gift',
    rarity: 'rare',
    icon: '🥊',
    description: 'Enchanted cloth wraps embroidered with impact seals. Perfect for Yuuma’s intense daily physical regimens.',
    value: 200,
    targetCharacterBonus: { rei: 4, kairo: 5, yuuma: 15, kira: 4, ren: 4 }
  },
  precision_watch: {
    id: 'precision_watch',
    name: 'Precision Chronograph',
    category: 'gift',
    rarity: 'rare',
    icon: '⌚',
    description: 'A sleek astronomical mechanical watch that calculates spiritual leyline shifts. Kira admires its clockwork perfection.',
    value: 320,
    targetCharacterBonus: { rei: 5, kairo: 4, yuuma: 2, kira: 18, ren: 6 }
  },
  celestial_astrolabe: {
    id: 'celestial_astrolabe',
    name: 'Celestial Astrolabe',
    category: 'gift',
    rarity: 'epic',
    icon: '🌌',
    description: 'An ancient brass instrument used by mystic astronomers to chart astral alignments. Kira finds it priceless.',
    value: 450,
    targetCharacterBonus: { rei: 8, kairo: 6, yuuma: 2, kira: 20, ren: 7 }
  },
  crimson_scarf: {
    id: 'crimson_scarf',
    name: 'Crimson Silk Scarf',
    category: 'gift',
    rarity: 'rare',
    icon: '🧣',
    description: 'Hand-woven scarlet silk soft as a phantom’s touch. Ren instantly drapes it across his shoulders with a cunning smile.',
    value: 280,
    targetCharacterBonus: { rei: 5, kairo: 3, yuuma: 4, kira: 3, ren: 18 }
  },
  antique_tarot: {
    id: 'antique_tarot',
    name: 'Gilded Arcana Deck',
    category: 'gift',
    rarity: 'epic',
    icon: '🃏',
    description: 'Illuminated tarot cards inscribed with eerie prophecies of fate. Ren loves drawing readings during dusk.',
    value: 400,
    targetCharacterBonus: { rei: 7, kairo: 6, yuuma: 3, kira: 5, ren: 20 }
  },
  spirit_elixir: {
    id: 'spirit_elixir',
    name: 'Spirit Nectar',
    category: 'consumable',
    rarity: 'common',
    icon: '🧪',
    description: 'Restores 120 HP instantly and clears negative status ailments in battle.',
    value: 75,
    effect: 'Heal 120 HP'
  },
  stamina_mochi: {
    id: 'stamina_mochi',
    name: 'Golden Stamina Mochi',
    category: 'consumable',
    rarity: 'common',
    icon: '🍡',
    description: 'Restores 100 Stamina and temporarily speeds up dodge cooldown by 20%.',
    value: 60,
    effect: 'Restore 100 Stamina'
  },
  curse_nullifier: {
    id: 'curse_nullifier',
    name: 'Exorcism Ward Rune',
    category: 'talisman',
    rarity: 'epic',
    icon: '📜',
    description: 'Increases supernatural combat defense by 35% and prevents curse stagger.',
    value: 350,
    effect: '+35% Defense'
  }
};

export const ALL_GIFTS_DATA = Object.values(ALL_ITEMS).filter(item => item.category === 'gift');

export const INITIAL_INVENTORY = [
  { item: ALL_ITEMS.sweet_taiyaki, quantity: 3 },
  { item: ALL_ITEMS.silver_hourglass, quantity: 1 },
  { item: ALL_ITEMS.shadow_talisman, quantity: 1 },
  { item: ALL_ITEMS.spicy_curry_bento, quantity: 2 },
  { item: ALL_ITEMS.artisan_green_tea, quantity: 3 },
  { item: ALL_ITEMS.precision_watch, quantity: 1 },
  { item: ALL_ITEMS.crimson_scarf, quantity: 1 },
  { item: ALL_ITEMS.spirit_elixir, quantity: 4 },
  { item: ALL_ITEMS.stamina_mochi, quantity: 5 },
  { item: ALL_ITEMS.curse_nullifier, quantity: 1 }
];

