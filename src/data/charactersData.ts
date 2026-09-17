import { CharacterProfile, CharacterId, CharacterStats } from '../types';
import { CHARACTER_ANIME_PORTRAITS } from './characterImages';

export const INITIAL_CHARACTERS_DATA: Record<CharacterId, CharacterProfile> = {
  rei: {
    id: 'rei',
    name: 'Rei Kurosawa',
    japaneseName: '黒沢 零',
    archetype: 'The Overpowered Mentor',
    role: 'Senior Instructor & Special Grade Sorcerer',
    age: 24,
    ability: 'Void Sight (虚空視)',
    abilityDescription: 'Manipulates space and boundless supernatural infinity. Sees cursed energy currents and unravels reality barriers with effortless calm.',
    personality: ['Confidently Playful', 'Teasing Humor', 'Fiercely Protective', 'Enigmatic Past', 'Absolute Powerhouse'],
    bio: 'The undisputed powerhouse of the Aetheria Supernatural Academy. While he treats serious threats like casual strolls and loves teasing younger students, his eyes carry the quiet burden of an era-defining curse he alone sealed five years ago.',
    hairColor: '#e2e8f0', // Silver White
    eyeColor: '#38bdf8',  // Glowing Electric Azure
    themeColor: '#38bdf8',
    accentColor: '#0284c7',
    favoriteLocation: 'rooftop',
    favoriteGifts: ['Silver Hourglass', 'Sweet Taiyaki', 'Rare Arcane Grimoire'],
    dislikedGifts: ['Plain Bitter Herb', 'Standard Chalk'],
    portraitUrl: CHARACTER_ANIME_PORTRAITS.rei,
    voiceLines: {
      greeting: "Well, well... if it isn't my favorite new student. Looking for extra guidance, Aira?",
      happy: "Heh, you've got guts. I like that spark in your eyes.",
      flustered: "Careful now... Even I can get distracted when you look at me like that.",
      jealous: "I saw you chatting with Yuuma earlier. Don't forget who actually teaches you the real tricks.",
      battle: "Step back, Aira. Let teacher show you how boundless space feels.",
      romantic: "The world can collapse for all I care. As long as you are standing beside me, my infinity belongs to you."
    },
    secrets: [
      {
        title: 'The Blindfold Mystery',
        description: 'Rei occasionally obscures his azure eyes because his Void Sight senses every psychic particle across a 10-mile radius, inducing cognitive strain without mental dampeners.',
        unlockAffection: 25
      },
      {
        title: 'The Lost Expedition',
        description: 'During his youth, Rei sacrificed his left shoulder mark to prevent a dimensional rift from swallowing the central academy dormitories.',
        unlockAffection: 60
      },
      {
        title: 'Promise Under the Starry Night',
        description: 'Rei swore never to form personal attachments after his first partner disappeared. Meeting Aira completely dismantled that solemn oath.',
        unlockAffection: 85
      }
    ]
  },
  kairo: {
    id: 'kairo',
    name: 'Kairo Fushin',
    japaneseName: '伏神 魁狼',
    archetype: 'The Shadow User',
    role: 'Second-Year Prodigy & Shadow Shaman',
    age: 18,
    ability: 'Shadow Summoning (影獣喚起)',
    abilityDescription: 'Channels dark matter through shadows to summon twin obsidian spirit beasts and merge seamlessly with shadow plains.',
    personality: ['Quiet & Stoic', 'Analytical Genius', 'Secretly Gentle', 'Deeply Protective', 'Stubbornly Loyal'],
    bio: 'A solitary student renowned for his sharp instincts and guarded demeanor. Raised under strict clan doctrines, Kairo avoids meaningless small talk, yet he is always the first to step into danger when shadows threaten those he values.',
    hairColor: '#0f172a', // Jet Black with Midnight Sheen
    eyeColor: '#64748b',  // Piercing Slate Grey
    themeColor: '#6366f1',
    accentColor: '#4338ca',
    favoriteLocation: 'library',
    favoriteGifts: ['Shadow Talisman', 'Artisan Green Tea', 'Antique Leather Journal'],
    dislikedGifts: ['Loud Firecrackers', 'Neon Clothes'],
    portraitUrl: CHARACTER_ANIME_PORTRAITS.kairo,
    voiceLines: {
      greeting: "...It's you. What is it? Need help deciphering old runes?",
      happy: "Good work today. You handled that barrier with precision.",
      flustered: "D-don't stand so close without warning. My shadows get restless...",
      jealous: "...You spent the entire afternoon with Kira. Was his tactical theory that fascinating?",
      battle: "Shadows, awake. Aira, guard my blind spot—we end this together.",
      romantic: "I used to believe the darkness was only for hiding sorrow. But with your light, even my darkest shadows feel warm."
    },
    secrets: [
      {
        title: 'The Twin Shadow Hounds',
        description: 'His summoned familiars, Kuro and Shiro, only nuzzle individuals whose souls are devoid of malicious deceit. They took an instant liking to Aira.',
        unlockAffection: 25
      },
      {
        title: 'Clan Disownment',
        description: 'Kairo severed ties with the Fushin clan after refusing to participate in a ritual that sacrificed human emotion for supreme cursed dominance.',
        unlockAffection: 60
      },
      {
        title: 'His Silent Vow',
        description: 'He keeps an origami crane folded from your very first class syllabus inside his coat pocket at all times.',
        unlockAffection: 85
      }
    ]
  },
  yuuma: {
    id: 'yuuma',
    name: 'Yuuma Arata',
    japaneseName: '荒田 勇真',
    archetype: 'The Cheerful Fighter',
    role: 'First-Year Vanguard & Martial Sorcerer',
    age: 18,
    ability: 'Impact Energy (震撃破)',
    abilityDescription: 'Converts supernatural soul aura into kinetic shockwaves, delivering explosive martial strikes that can shatter enchanted bedrock.',
    personality: ['Sun-Bright Optimist', 'Fearless & Bold', 'Fiercely Loyal', 'Spontaneous Goofball', 'Golden Heart'],
    bio: 'Energetic, warm, and constantly hungry after intensive sparring sessions. Yuuma treats every obstacle as a friendly challenge. Behind his radiant smile lies an iron willpower forged from protecting his younger siblings from rogue spirits.',
    hairColor: '#451a03', // Dark Chestnut with Crimson Flare
    eyeColor: '#f97316',  // Warm Amber Gold
    themeColor: '#f97316',
    accentColor: '#ea580c',
    favoriteLocation: 'training_ground',
    favoriteGifts: ['Spicy Curry Bento', 'Hand-Crafted Sparring Wraps', 'Energy Elixir'],
    dislikedGifts: ['Boring Old Novels', 'Bitter Black Coffee'],
    portraitUrl: CHARACTER_ANIME_PORTRAITS.yuuma,
    voiceLines: {
      greeting: "Yo, Aira! Just the person I wanted to see! Ready to train or grab some food?",
      happy: "Haha! You're amazing, Aira! That punch had some serious soul behind it!",
      flustered: "Wait, hold on! You can't just wipe sweat off my forehead like it's nothing! My heart is pounding!",
      jealous: "Hey, why was Ren whispering in your ear earlier? Don't let that sneaky guy fool you!",
      battle: "Get behind me, Aira! My fists will blow these cursed creeps straight to kingdom come!",
      romantic: "I'm not great with poetic speeches, Aira. All I know is... whenever you smile, I feel like I could conquer the whole universe."
    },
    secrets: [
      {
        title: 'The Family Bakery',
        description: 'Yuuma wakes up at 4:30 AM every Sunday to help bake melon pan at his family shop before academy training.',
        unlockAffection: 25
      },
      {
        title: 'Broken Knuckles',
        description: 'He sustained permanent nerve scarring protecting an orphanage from an A-Rank curse before entering the academy.',
        unlockAffection: 60
      },
      {
        title: 'His True Fear',
        description: 'Yuuma laughs loudly not because he lacks fear, but because he believes laughter is the only shield that keeps those he loves from despairing.',
        unlockAffection: 85
      }
    ]
  },
  kira: {
    id: 'kira',
    name: 'Kira Shinomiya',
    japaneseName: '四宮 煌',
    archetype: 'The Lightning Genius',
    role: 'Third-Year Student Council President & Tactician',
    age: 19,
    ability: 'Lightning Velocity (瞬雷絶速)',
    abilityDescription: 'Supercharges neural pathways and muscle fibers with supernatural lightning, achieving supersonic combat speeds and electromagnetic barrier control.',
    personality: ['Calculating Genius', 'Dry Sarcasm', 'Perfectionist', 'Hidden Tenderness', 'Unshakable Pride'],
    bio: 'The brilliant tactician of the Shinomiya household and head of student affairs. He analyzes combat situations in milliseconds and rarely tolerates inefficiency. However, Aira’s intuitive and heartfelt decisions continuously baffle his logical calculations.',
    hairColor: '#cbd5e1', // Platinum Ash Silver
    eyeColor: '#06b6d4',  // Electric Cyan
    themeColor: '#06b6d4',
    accentColor: '#0891b2',
    favoriteLocation: 'hallway',
    favoriteGifts: ['Precision Pocket Watch', 'Celestial Astrolabe', 'Earl Grey Tea Set'],
    dislikedGifts: ['Greasy Street Snacks', 'Untidy Notes'],
    portraitUrl: CHARACTER_ANIME_PORTRAITS.kira,
    voiceLines: {
      greeting: "You're three minutes later than scheduled, Aira. Fortunately for you, I reserved this interval.",
      happy: "Immaculate execution. It appears my tactical revisions did not go to waste on you.",
      flustered: "Tch... Stop looking at me with those earnest eyes. You are disrupting my cognitive focus.",
      jealous: "Rei was giving you private lessons again? His reckless methods are an insult to proper doctrine.",
      battle: "Electromagnetic perimeter locked. Observe closely, Aira—victory takes only one strike.",
      romantic: "In every statistical model I calculated, love was classified as an irrational liability. Until you became my singular, irreplaceable exception."
    },
    secrets: [
      {
        title: 'The Sleepless Strategist',
        description: 'Kira sleeps less than four hours a night, constantly simulating defensive algorithms against catastrophic cursed incursions.',
        unlockAffection: 25
      },
      {
        title: 'The Secret Sweet Tooth',
        description: 'Despite his regal persona, he hides a private stash of strawberry milk cartons in the student council safe.',
        unlockAffection: 60
      },
      {
        title: 'Calculated Defeat',
        description: 'The only time Kira intentionally surrendered a match was during Aira’s entrance exam duel, because he saw her heart was trembling.',
        unlockAffection: 85
      }
    ]
  },
  ren: {
    id: 'ren',
    name: 'Ren Kazami',
    japaneseName: '風見 蓮',
    archetype: 'The Mysterious Chaotic One',
    role: 'Special Infiltration Operative & Anomaly Specialist',
    age: 19,
    ability: 'Crimson Thread (紅蓮天糸)',
    abilityDescription: 'Weaves supernatural crimson soul filaments that can slice cursed flesh, ensnare rogue entities, or manipulate puppets across dimensions.',
    personality: ['Enigmatic Trickster', 'Playfully Dangerous', 'Sharp Wit', 'Masked Vulnerability', 'Irresistible Charm'],
    bio: 'A student whose true intentions are shrouded in mystery. Ren moves between the shadows of the academy and the underworld with effortless elegance. He enjoys teasing people and making them question reality, but his crimson threads always weave a protective perimeter around Aira.',
    hairColor: '#881337', // Crimson Black Burgundy
    eyeColor: '#e11d48',  // Crimson Ruby
    themeColor: '#e11d48',
    accentColor: '#be123c',
    favoriteLocation: 'courtyard',
    favoriteGifts: ['Crimson Silk Scarf', 'Antique Tarot Deck', 'Spiced Wine Chocolate'],
    dislikedGifts: ['Standard Academy Manual', 'Boring Water'],
    portraitUrl: CHARACTER_ANIME_PORTRAITS.ren,
    voiceLines: {
      greeting: "Fufu... caught you looking my way, little bird. Were you following my crimson threads?",
      happy: "How delightfully unpredictable you are, Aira. You never cease to amuse me.",
      flustered: "...Ah. Pulling on my ribbons with such confidence? You really are a dangerous girl.",
      jealous: "Kairo looks quite comfortable standing by your side. Should I weave a little web to separate you two?",
      battle: "Shall we dance, monsters? Aira, watch the crimson threads paint the stage.",
      romantic: "They say destiny is tied by a red string of fate. I never believed it... until I knotted mine around your fingers."
    },
    secrets: [
      {
        title: 'The Masked Past',
        description: 'Ren was once trained as an underworld bounty hunter before the academy dean offered him asylum.',
        unlockAffection: 25
      },
      {
        title: 'The Cursed Scar',
        description: 'His right wrist is wrapped in dark bandages hiding a parasitic blood pact that drains his life force unless fed cursed remnants.',
        unlockAffection: 60
      },
      {
        title: 'His Singular Truth',
        description: 'In a life composed entirely of lies and performance, his feelings for Aira are the only thing he refuses to disguise.',
        unlockAffection: 85
      }
    ]
  }
};

export const INITIAL_RELATIONSHIPS: Record<CharacterId, CharacterStats> = {
  rei: { affection: 20, trust: 25, friendship: 30, jealousy: 0, stage: 'Acquaintance' },
  kairo: { affection: 15, trust: 15, friendship: 20, jealousy: 0, stage: 'Stranger' },
  yuuma: { affection: 25, trust: 30, friendship: 40, jealousy: 0, stage: 'Friend' },
  kira: { affection: 10, trust: 20, friendship: 15, jealousy: 0, stage: 'Stranger' },
  ren: { affection: 18, trust: 15, friendship: 20, jealousy: 0, stage: 'Acquaintance' }
};

export function getRelationshipStage(affection: number, trust: number): CharacterStats['stage'] {
  if (affection >= 85 && trust >= 80) return 'Partner';
  if (affection >= 70 && trust >= 60) return 'Romantic Interest';
  if (affection >= 55 && trust >= 45) return 'Special Person';
  if (affection >= 40 && trust >= 35) return 'Close Friend';
  if (affection >= 25) return 'Friend';
  if (affection >= 10) return 'Acquaintance';
  return 'Stranger';
}
