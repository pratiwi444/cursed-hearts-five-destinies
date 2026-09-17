import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharacterId, DialogueNode, DialogueChoice, PlayerStats } from '../../types';
import { INITIAL_CHARACTERS_DATA } from '../../data/charactersData';
import { AnimePortrait } from './AnimePortrait';
import { Heart, Sparkles, MessageCircle, ArrowRight, Gift, Calendar, Swords } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface DialogueBoxProps {
  currentNode: DialogueNode;
  onSelectChoice: (choice: DialogueChoice) => void;
  onClose: () => void;
  onOpenGift: (charId: CharacterId) => void;
  onOpenDate: (charId: CharacterId) => void;
  onStartCompanionBattle: (charId: CharacterId) => void;
  playerStats: PlayerStats;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  currentNode,
  onSelectChoice,
  onClose,
  onOpenGift,
  onOpenDate,
  onStartCompanionBattle,
  playerStats
}) => {
  const charId = currentNode.characterId && currentNode.characterId !== 'aira' && currentNode.characterId !== 'narrator'
    ? (currentNode.characterId as CharacterId)
    : null;

  const isAira = currentNode.characterId === 'aira';
  const character = charId ? INITIAL_CHARACTERS_DATA[charId] : null;

  // Derive dialogue emotional mood
  const textLower = currentNode.text.toLowerCase();
  const expression: 'normal' | 'happy' | 'blush' | 'serious' | 'jealous' | 'battle' = 
    textLower.includes('heart') || textLower.includes('warm') || textLower.includes('blush') || textLower.includes('love')
      ? 'blush'
      : textLower.includes('fight') || textLower.includes('strike') || textLower.includes('barrier') || textLower.includes('curse')
      ? 'battle'
      : textLower.includes('saw you') || textLower.includes('earlier') || textLower.includes('whispering')
      ? 'jealous'
      : textLower.includes('haha') || textLower.includes('good') || textLower.includes('amazing')
      ? 'happy'
      : 'normal';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end items-center pb-6">
        {/* Visual Novel Full Character Anime Tachie Sprite */}
        <AnimatePresence mode="wait">
          {charId ? (
            <motion.div
              key={charId}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute bottom-40 md:bottom-36 right-6 md:right-28 pointer-events-none z-40"
            >
              <AnimePortrait
                characterId={charId}
                size="bust"
                expression={expression}
                glowIntensity="high"
              />
            </motion.div>
          ) : isAira ? (
            <motion.div
              key="aira"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute bottom-40 md:bottom-36 left-6 md:left-28 pointer-events-none z-40"
            >
              <AnimePortrait
                characterId="aira"
                size="bust"
                expression={expression}
                glowIntensity="subtle"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Main Dialogue Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="w-[94%] max-w-4xl z-50 pointer-events-auto"
        >
          <div className="relative rounded-2xl bg-slate-950/94 backdrop-blur-xl border border-slate-700/60 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden">
            {/* Top glowing accent line */}
            <div
              className="h-1.5 w-full transition-colors duration-500"
              style={{
                background: character
                  ? `linear-gradient(90deg, transparent, ${character.themeColor}, ${character.accentColor}, transparent)`
                  : isAira
                  ? 'linear-gradient(90deg, transparent, #818cf8, #e11d48, transparent)'
                  : 'linear-gradient(90deg, transparent, #818cf8, #c084fc, transparent)'
              }}
            />

            <div className="p-5 md:p-7">
              {/* Header: Anime Avatar + Name plate & Action shortcuts */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  {/* Speaker Anime Avatar Thumbnail */}
                  {(charId || isAira) && (
                    <AnimePortrait
                      characterId={charId || 'aira'}
                      size="sm"
                    />
                  )}

                  <div
                    className="px-3.5 py-1 rounded-lg border text-sm font-bold tracking-wider font-cinzel shadow"
                    style={{
                      backgroundColor: character ? `${character.themeColor}25` : '#4f46e525',
                      borderColor: character ? character.themeColor : '#818cf8',
                      color: character ? character.themeColor : '#c7d2fe'
                    }}
                  >
                    {currentNode.speaker}
                  </div>
                  {character && (
                    <span className="text-xs text-slate-400 font-anime font-medium">
                      {character.japaneseName} • <span className="text-indigo-300">{character.archetype}</span>
                    </span>
                  )}
                </div>

                {/* Action Buttons with character (Date, Gift, Battle Sparring) */}
                {charId && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { soundManager.playClick(); onOpenDate(charId); }}
                      className="px-3 py-1.5 rounded-lg bg-pink-950/60 hover:bg-pink-900/80 border border-pink-500/40 text-pink-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                      title="Invite to a Date"
                    >
                      <Calendar className="w-3.5 h-3.5 text-pink-400" />
                      <span>Kencan (Date)</span>
                    </button>

                    <button
                      onClick={() => { soundManager.playClick(); onOpenGift(charId); }}
                      className="px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                      title="Give a Gift"
                    >
                      <Gift className="w-3.5 h-3.5 text-purple-400" />
                      <span>Beri Hadiah</span>
                    </button>

                    <button
                      onClick={() => { soundManager.playClick(); onStartCompanionBattle(charId); }}
                      className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                      title="Spar together in 3D Battle"
                    >
                      <Swords className="w-3.5 h-3.5 text-amber-400" />
                      <span>Tarung Sparring</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Main Dialogue Text */}
              <div className="min-h-[64px] mb-5">
                <p className="text-slate-100 text-base md:text-lg leading-relaxed font-anime font-normal">
                  "{currentNode.text}"
                </p>
              </div>

              {/* Choices Section */}
              {currentNode.choices && currentNode.choices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-3">
                  {currentNode.choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        soundManager.playClick();
                        if (choice.relationshipBonus?.affection) {
                          soundManager.playHeartChime();
                        }
                        onSelectChoice(choice);
                      }}
                      className="group relative text-left p-3 rounded-xl bg-slate-900/90 hover:bg-indigo-950/80 border border-slate-700/70 hover:border-indigo-500/80 transition-all duration-200 flex items-start gap-3 cursor-pointer shadow-md hover:shadow-indigo-500/20"
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-800 group-hover:bg-indigo-600 flex items-center justify-center text-xs font-bold text-slate-300 group-hover:text-white shrink-0 mt-0.5 transition-colors">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                          {choice.text}
                        </div>

                        {/* Stat or Relationship Bonus Hints */}
                        <div className="flex items-center gap-2 mt-1.5">
                          {choice.relationshipBonus?.affection && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-pink-400">
                              <Heart className="w-3 h-3 fill-pink-400" />
                              +{choice.relationshipBonus.affection} Affection
                            </span>
                          )}
                          {choice.relationshipBonus?.trust && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400">
                              <Sparkles className="w-3 h-3" />
                              +{choice.relationshipBonus.trust} Trust
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 shrink-0 self-center transition-transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              ) : (
                /* No choices: Continue button */
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onClose();
                    }}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-105"
                  >
                    <span>Lanjutkan (Continue)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
