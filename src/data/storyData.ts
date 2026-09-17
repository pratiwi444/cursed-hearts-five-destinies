import { DialogueNode, CharacterId } from '../types';

export const STORY_CHAPTERS = [
  { chapter: 1, title: 'Awakening of the Cursed Seal', synopsis: 'Aira arrives at Aetheria Supernatural Academy, carrying an unawakened dormant curse within her chest.' },
  { chapter: 2, title: 'The Five Destinies', synopsis: 'Aira encounters the five distinct masters of supernatural sorcery across the academy grounds.' },
  { chapter: 3, title: 'Lessons in Resonance', synopsis: 'Classroom theories give way to practical aura synchronization drills.' },
  { chapter: 5, title: 'Shadows in the Courtyard', synopsis: 'A stray grade-2 phantom slips past the barrier during twilight.' },
  { chapter: 10, title: 'The Starlit Promise', synopsis: 'Deepening bonds reveal hidden vulnerabilities behind confident smiles.' },
  { chapter: 15, title: 'The Abyssal Eclipse', synopsis: 'Ancient seals weaken beneath the academy underground facilities.' },
  { chapter: 25, title: 'Threads of Loyalty', synopsis: 'Choices must be made when rival sorcery factions demand allegiance.' },
  { chapter: 40, title: 'Heart of the Singularity', synopsis: 'The truth behind Aira’s cursed heart is laid bare.' },
  { chapter: 50, title: 'Eternal Destiny', synopsis: 'The final confrontation where love and supernatural power reshape reality.' }
];

export const CHARACTER_DIALOGUES: Record<CharacterId, Record<string, DialogueNode>> = {
  rei: {
    start: {
      id: 'rei_start',
      speaker: 'Rei Kurosawa',
      characterId: 'rei',
      text: "Well now... Look who decided to visit the highest spot on campus. Enjoying the breeze, Aira, or did you come here hoping to catch me off duty?",
      emotion: 'smirk',
      choices: [
        {
          text: "I wanted to ask you about the strange aura I've been seeing.",
          nextId: 'rei_curious',
          statBonus: { intelligence: 2, supernaturalPower: 3 },
          relationshipBonus: { characterId: 'rei', trust: 4, affection: 3 }
        },
        {
          text: "Maybe I just wanted to see your confident smile, Sensei.",
          nextId: 'rei_flirt',
          statBonus: { charisma: 3, confidence: 2 },
          relationshipBonus: { characterId: 'rei', affection: 6 }
        },
        {
          text: "Are teachers even allowed to slack off up here?",
          nextId: 'rei_sarcastic',
          statBonus: { courage: 3 },
          relationshipBonus: { characterId: 'rei', friendship: 4, affection: 2 }
        }
      ]
    },
    rei_curious: {
      id: 'rei_curious',
      speaker: 'Rei Kurosawa',
      characterId: 'rei',
      text: "Sharp eyes. Most freshmen take months just to distinguish residual static from real cursed energy. With my Void Sight, I can guide you into seeing the exact leylines without frying your nerves. How about an extra private lesson tonight?",
      emotion: 'smile',
      choices: [
        {
          text: "I would appreciate that more than anything, Rei.",
          nextId: 'rei_close',
          relationshipBonus: { characterId: 'rei', affection: 5, trust: 5 }
        },
        {
          text: "Only if you promise not to pull any pranks during practice.",
          nextId: 'rei_playful',
          relationshipBonus: { characterId: 'rei', friendship: 5 }
        }
      ]
    },
    rei_flirt: {
      id: 'rei_flirt',
      speaker: 'Rei Kurosawa',
      characterId: 'rei',
      text: "Hahaha! Direct hit. You know, you're the first person in five years who dared look straight into my eyes and tease me. You're going to make this academic term very interesting, Aira.",
      emotion: 'blush',
      choices: [
        {
          text: "Then prepare yourself, because I'm not backing down.",
          nextId: 'rei_close',
          relationshipBonus: { characterId: 'rei', affection: 8, trust: 3 }
        }
      ]
    },
    rei_sarcastic: {
      id: 'rei_sarcastic',
      speaker: 'Rei Kurosawa',
      characterId: 'rei',
      text: "When you're the strongest in the prefecture, 'slacking off' is officially reclassified as 'advanced perimeter surveillance.' But since you caught me... I suppose I owe you a treat.",
      emotion: 'smile',
      choices: [
        {
          text: "Taiyaki from the corner shop sounds like fair compensation.",
          nextId: 'rei_close',
          relationshipBonus: { characterId: 'rei', affection: 5, friendship: 4 }
        }
      ]
    },
    rei_close: {
      id: 'rei_close',
      speaker: 'Rei Kurosawa',
      characterId: 'rei',
      text: "It's a deal. Stay close to me during tomorrow's barrier expedition. When the void stirs, I want you right at my side.",
      emotion: 'serious'
    }
  },

  kairo: {
    start: {
      id: 'kairo_start',
      speaker: 'Kairo Fushin',
      characterId: 'kairo',
      text: "...Why are you standing there? The library's western wing is usually deserted at this hour.",
      emotion: 'neutral',
      choices: [
        {
          text: "Why are you always by yourself, Kairo?",
          nextId: 'kairo_alone_choice',
          statBonus: { empathy: 3 }
        },
        {
          text: "I came to read the ancient sorcery chronicles.",
          nextId: 'kairo_books',
          statBonus: { intelligence: 3 },
          relationshipBonus: { characterId: 'kairo', trust: 4 }
        },
        {
          text: "Your twin shadow hounds seemed happy to see me.",
          nextId: 'kairo_dogs',
          relationshipBonus: { characterId: 'kairo', affection: 5, trust: 3 }
        }
      ]
    },
    kairo_alone_choice: {
      id: 'kairo_alone_choice',
      speaker: 'Kairo Fushin',
      characterId: 'kairo',
      text: "Kenapa aku selalu sendirian? Shadows don't make noise. People talk too much, and half of what they say is deceit.",
      emotion: 'serious',
      choices: [
        {
          text: "Aku ingin mengenalmu lebih jauh, Kairo.",
          nextId: 'kairo_honest',
          statBonus: { courage: 3, charisma: 2 },
          relationshipBonus: { characterId: 'kairo', affection: 8, trust: 6 }
        },
        {
          text: "Kalau kamu tidak mau bicara sekarang, tidak masalah.",
          nextId: 'kairo_patient',
          statBonus: { empathy: 4 },
          relationshipBonus: { characterId: 'kairo', trust: 5, friendship: 4 }
        },
        {
          text: "Kamu memang selalu seserius itu sepanjang waktu?",
          nextId: 'kairo_serious',
          statBonus: { confidence: 2 },
          relationshipBonus: { characterId: 'kairo', friendship: 3, affection: 2 }
        }
      ]
    },
    kairo_honest: {
      id: 'kairo_honest',
      speaker: 'Kairo Fushin',
      characterId: 'kairo',
      text: "...You speak without hesitation. In my family, every word is a hidden dagger. Hearing someone say that so cleanly... it's strange. But I don't dislike it.",
      emotion: 'blush',
      choices: [
        {
          text: "Then let's study together today.",
          nextId: 'kairo_study',
          relationshipBonus: { characterId: 'kairo', affection: 5, trust: 4 }
        }
      ]
    },
    kairo_patient: {
      id: 'kairo_patient',
      speaker: 'Kairo Fushin',
      characterId: 'kairo',
      text: "You don't push like the others do. Thank you. If you sit over there, the reading lamp has better illumination.",
      emotion: 'smile',
      choices: [
        {
          text: "Thank you, Kairo.",
          nextId: 'kairo_study',
          relationshipBonus: { characterId: 'kairo', trust: 5 }
        }
      ]
    },
    kairo_serious: {
      id: 'kairo_serious',
      speaker: 'Kairo Fushin',
      characterId: 'kairo',
      text: "In my line of work, dropping your guard for half a second means losing your life. But... perhaps with you around, I can afford to exhale once in a while.",
      emotion: 'smile'
    },
    kairo_books: {
      id: 'kairo_books',
      speaker: 'Kairo Fushin',
      characterId: 'kairo',
      text: "Section 4-B contains the untranslated talisman manuscripts. I've already indexed the safer defensive seals if you'd like to look.",
      emotion: 'neutral',
      choices: [
        {
          text: "You're surprisingly helpful, Kairo.",
          nextId: 'kairo_honest',
          relationshipBonus: { characterId: 'kairo', affection: 4, trust: 4 }
        }
      ]
    },
    kairo_dogs: {
      id: 'kairo_dogs',
      speaker: 'Kairo Fushin',
      characterId: 'kairo',
      text: "...Kuro and Shiro usually growl at anyone outside our clan bloodline. The fact they curled around your shoes means they recognize the pure warmth in your soul.",
      emotion: 'blush',
      choices: [
        {
          text: "I think they take after their master's gentle side.",
          nextId: 'kairo_honest',
          relationshipBonus: { characterId: 'kairo', affection: 7 }
        }
      ]
    },
    kairo_study: {
      id: 'kairo_study',
      speaker: 'Kairo Fushin',
      characterId: 'kairo',
      text: "Sit here. If any shadow tremors occur, hold my hand. I'll make sure nothing touches you.",
      emotion: 'serious'
    }
  },

  yuuma: {
    start: {
      id: 'yuuma_start',
      speaker: 'Yuuma Arata',
      characterId: 'yuuma',
      text: "Aira! Woah, perfect timing! I just finished two hundred reps with the enchanted weight stones! Feel my pulse—it's like a sports car engine!",
      emotion: 'smile',
      choices: [
        {
          text: "Haha! You never run out of energy, do you Yuuma?",
          nextId: 'yuuma_energy',
          statBonus: { charisma: 3 },
          relationshipBonus: { characterId: 'yuuma', affection: 5, friendship: 5 }
        },
        {
          text: "Here, let me hand you a towel before you catch a cold.",
          nextId: 'yuuma_care',
          statBonus: { empathy: 4 },
          relationshipBonus: { characterId: 'yuuma', affection: 7, trust: 4 }
        },
        {
          text: "Think you can handle a quick sparring round with me?",
          nextId: 'yuuma_spar',
          statBonus: { courage: 4, supernaturalPower: 2 },
          relationshipBonus: { characterId: 'yuuma', affection: 6, friendship: 6 }
        }
      ]
    },
    yuuma_energy: {
      id: 'yuuma_energy',
      speaker: 'Yuuma Arata',
      characterId: 'yuuma',
      text: "Never! Life is too short to sit still, especially when curses are crawling around threatening people! And honestly, seeing you walk over here pumped up my stamina even more!",
      emotion: 'smile',
      choices: [
        {
          text: "You really say the sweetest things with a straight face.",
          nextId: 'yuuma_fluster',
          relationshipBonus: { characterId: 'yuuma', affection: 6 }
        }
      ]
    },
    yuuma_care: {
      id: 'yuuma_care',
      speaker: 'Yuuma Arata',
      characterId: 'yuuma',
      text: "Whoa... Thanks, Aira! Your hands are so gentle... Wait, why is my face suddenly burning? Is my Impact Energy flaring up or something?!",
      emotion: 'blush',
      choices: [
        {
          text: "I don't think it's your cursed energy making you blush, Yuuma.",
          nextId: 'yuuma_fluster',
          relationshipBonus: { characterId: 'yuuma', affection: 8, trust: 4 }
        }
      ]
    },
    yuuma_fluster: {
      id: 'yuuma_fluster',
      speaker: 'Yuuma Arata',
      characterId: 'yuuma',
      text: "Aaargh, don't tease me! Okay, fine! Next time we eat lunch, I'm buying you the deluxe meat bun, deal? Promise me we'll go together!",
      emotion: 'blush',
      choices: [
        {
          text: "Deal. It's a promise.",
          nextId: 'yuuma_end',
          relationshipBonus: { characterId: 'yuuma', affection: 5, trust: 5 }
        }
      ]
    },
    yuuma_spar: {
      id: 'yuuma_spar',
      speaker: 'Yuuma Arata',
      characterId: 'yuuma',
      text: "That's what I'm talking about! Let's see your combat stance! Don't hold back, Aira—I want to see everything you've got!",
      emotion: 'serious',
      choices: [
        {
          text: "Let's do this!",
          nextId: 'yuuma_end',
          relationshipBonus: { characterId: 'yuuma', friendship: 6, trust: 4 }
        }
      ]
    },
    yuuma_end: {
      id: 'yuuma_end',
      speaker: 'Yuuma Arata',
      characterId: 'yuuma',
      text: "Alright! Whenever you need backup against any curse, just shout my name. I'll sprint across the entire city to reach you!",
      emotion: 'smile'
    }
  },

  kira: {
    start: {
      id: 'kira_start',
      speaker: 'Kira Shinomiya',
      characterId: 'kira',
      text: "Good afternoon, Aira. I was reviewing the academy's barrier power grids. Your spiritual frequency registered an unusual fluctuation earlier today.",
      emotion: 'neutral',
      choices: [
        {
          text: "Were you checking the telemetry, or were you specifically looking for me?",
          nextId: 'kira_tease',
          statBonus: { charisma: 3, confidence: 2 },
          relationshipBonus: { characterId: 'kira', affection: 6 }
        },
        {
          text: "I was practicing lightning speed drills like you instructed.",
          nextId: 'kira_dutiful',
          statBonus: { intelligence: 3 },
          relationshipBonus: { characterId: 'kira', trust: 5, affection: 4 }
        },
        {
          text: "You really should take a break from those monitors, President.",
          nextId: 'kira_concern',
          statBonus: { empathy: 3 },
          relationshipBonus: { characterId: 'kira', affection: 5, trust: 4 }
        }
      ]
    },
    kira_tease: {
      id: 'kira_tease',
      speaker: 'Kira Shinomiya',
      characterId: 'kira',
      text: "Preposterous. As Student Council President, tracking high-priority anomalies is an administrative duty. That you happen to be that anomaly is merely a statistical reality.",
      emotion: 'blush',
      choices: [
        {
          text: "Your ears are turning slightly red, Kira.",
          nextId: 'kira_admit',
          relationshipBonus: { characterId: 'kira', affection: 7 }
        }
      ]
    },
    kira_admit: {
      id: 'kira_admit',
      speaker: 'Kira Shinomiya',
      characterId: 'kira',
      text: "...You possess an exasperating talent for dismantling my composure. Very well. Let us step out into the courtyard gardens. Ten minutes of fresh air will not compromise our schedule.",
      emotion: 'smile',
      choices: [
        {
          text: "I'd love to accompany you.",
          nextId: 'kira_end',
          relationshipBonus: { characterId: 'kira', affection: 6, trust: 5 }
        }
      ]
    },
    kira_dutiful: {
      id: 'kira_dutiful',
      speaker: 'Kira Shinomiya',
      characterId: 'kira',
      text: "Commendable. Your acceleration curve improved by 14.8% compared to last week. Continue at this pace, and you will outrun Class-A spectral hounds effortlessly.",
      emotion: 'smile',
      choices: [
        {
          text: "It's all thanks to your precise mentorship.",
          nextId: 'kira_end',
          relationshipBonus: { characterId: 'kira', trust: 6, affection: 4 }
        }
      ]
    },
    kira_concern: {
      id: 'kira_concern',
      speaker: 'Kira Shinomiya',
      characterId: 'kira',
      text: "Rest is a variable I rarely prioritize when lives hang in the balance. But... hearing your genuine concern makes the strain feel far lighter.",
      emotion: 'smile',
      choices: [
        {
          text: "Then let me share some of that burden.",
          nextId: 'kira_end',
          relationshipBonus: { characterId: 'kira', affection: 7, trust: 6 }
        }
      ]
    },
    kira_end: {
      id: 'kira_end',
      speaker: 'Kira Shinomiya',
      characterId: 'kira',
      text: "Keep your communicator active, Aira. When lightning strikes, ensure you are standing right behind my shield.",
      emotion: 'serious'
    }
  },

  ren: {
    start: {
      id: 'ren_start',
      speaker: 'Ren Kazami',
      characterId: 'ren',
      text: "Fufu... How exquisite. You walked straight into my crimson perimeter without a hint of fear. Were you drawn by curiosity, or did your heart whisper that I was waiting for you?",
      emotion: 'smirk',
      choices: [
        {
          text: "Your crimson threads are beautiful, but they look dangerous.",
          nextId: 'ren_threads',
          statBonus: { intelligence: 2, charisma: 3 },
          relationshipBonus: { characterId: 'ren', affection: 6, trust: 3 }
        },
        {
          text: "I wanted to find out what you're really hiding behind that smile.",
          nextId: 'ren_secret',
          statBonus: { courage: 4 },
          relationshipBonus: { characterId: 'ren', affection: 7, trust: 5 }
        },
        {
          text: "Don't get cocky. I can cut those strings if I need to.",
          nextId: 'ren_feisty',
          statBonus: { confidence: 3 },
          relationshipBonus: { characterId: 'ren', affection: 5, friendship: 4 }
        }
      ]
    },
    ren_threads: {
      id: 'ren_threads',
      speaker: 'Ren Kazami',
      characterId: 'ren',
      text: "Danger and beauty always intertwine, my dear. These threads can slice through a titan's iron sinews, yet right now, they're trembling just because your fingers are nearby.",
      emotion: 'smile',
      choices: [
        {
          text: "Then show me how you weave them.",
          nextId: 'ren_close',
          relationshipBonus: { characterId: 'ren', affection: 6, trust: 4 }
        }
      ]
    },
    ren_secret: {
      id: 'ren_secret',
      speaker: 'Ren Kazami',
      characterId: 'ren',
      text: "Oh? Peeking beneath the mask is a risky gamble, Aira. People usually turn pale when they discover what monsters lurk in my past.",
      emotion: 'serious',
      choices: [
        {
          text: "I'm not people. And I'm not afraid of your truth.",
          nextId: 'ren_vulnerable',
          statBonus: { courage: 3, empathy: 3 },
          relationshipBonus: { characterId: 'ren', affection: 9, trust: 8 }
        }
      ]
    },
    ren_vulnerable: {
      id: 'ren_vulnerable',
      speaker: 'Ren Kazami',
      characterId: 'ren',
      text: "...You really are something else. For someone with such gentle eyes, your soul is made of unbreakable diamond. Perhaps... I wouldn't mind letting you hold the other end of my red string.",
      emotion: 'blush',
      choices: [
        {
          text: "I won't let go, Ren.",
          nextId: 'ren_close',
          relationshipBonus: { characterId: 'ren', affection: 8, trust: 5 }
        }
      ]
    },
    ren_feisty: {
      id: 'ren_feisty',
      speaker: 'Ren Kazami',
      characterId: 'ren',
      text: "Hahaha! Sharp claws! That fierce glare of yours sends shivers down my spine in the most thrilling way imaginable.",
      emotion: 'smirk',
      choices: [
        {
          text: "Just keep that in mind next time you try teasing me.",
          nextId: 'ren_close',
          relationshipBonus: { characterId: 'ren', friendship: 5, affection: 4 }
        }
      ]
    },
    ren_close: {
      id: 'ren_close',
      speaker: 'Ren Kazami',
      characterId: 'ren',
      text: "Remember, little bird: when the moon turns crimson and the academy alarms wail, don't look for the others. Look for my red thread. It will lead you safely to my arms.",
      emotion: 'smile'
    }
  }
};

// Flatten all dialogues into STORY_DIALOGUES with convenient intro aliases
export const STORY_DIALOGUES: Record<string, DialogueNode> = {
  rei_intro: CHARACTER_DIALOGUES.rei.start,
  kairo_intro: CHARACTER_DIALOGUES.kairo.start,
  yuuma_intro: CHARACTER_DIALOGUES.yuuma.start,
  kira_intro: CHARACTER_DIALOGUES.kira.start,
  ren_intro: CHARACTER_DIALOGUES.ren.start,
};

// Populate all child dialogue nodes
Object.values(CHARACTER_DIALOGUES).forEach(charDialogues => {
  Object.entries(charDialogues).forEach(([key, node]) => {
    STORY_DIALOGUES[key] = node;
    STORY_DIALOGUES[node.id] = node;
  });
});

