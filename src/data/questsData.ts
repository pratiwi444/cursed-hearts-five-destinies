import { Quest } from '../types';

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest_first_day',
    title: 'Arrival at Aetheria Academy',
    giver: 'Academy Dean',
    description: 'Explore the academy grounds and introduce yourself to the five notable sorcerers stationed across the campus.',
    category: 'main',
    location: 'courtyard',
    progress: 1,
    maxProgress: 5,
    completed: false,
    rewardText: '500 EXP, 300 Yen, Warm Custard Taiyaki'
  },
  {
    id: 'quest_rei_training',
    title: 'Void Sight Fundamentals',
    giver: 'Rei Kurosawa',
    description: 'Meet Rei on the academy Rooftop to conduct your initial supernatural aura alignment sparring.',
    category: 'romance',
    location: 'rooftop',
    targetCharacter: 'rei',
    progress: 0,
    maxProgress: 1,
    completed: false,
    rewardText: 'Rei Affection +15, Silver Hourglass'
  },
  {
    id: 'quest_shadow_curse',
    title: 'Whispers in the Library Stacks',
    giver: 'Kairo Fushin',
    description: 'Investigate the nocturnal disturbance in the restricted section of the Arcane Library alongside Kairo.',
    category: 'supernatural',
    location: 'library',
    targetCharacter: 'kairo',
    progress: 0,
    maxProgress: 1,
    completed: false,
    rewardText: 'Kairo Trust +20, Shadow Talisman'
  },
  {
    id: 'quest_yuuma_sparring',
    title: 'Fiery Impact Drills',
    giver: 'Yuuma Arata',
    description: 'Join Yuuma in the Training Ground for a friendly 3-round physical stamina sparring match.',
    category: 'romance',
    location: 'training_ground',
    targetCharacter: 'yuuma',
    progress: 0,
    maxProgress: 3,
    completed: false,
    rewardText: 'Yuuma Affection +15, Reinforced Fist Wraps'
  }
];
