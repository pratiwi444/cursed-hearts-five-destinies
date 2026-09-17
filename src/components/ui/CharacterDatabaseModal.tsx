import React, { useState } from 'react';
import { CharacterId, CharacterStats } from '../../types';
import { INITIAL_CHARACTERS_DATA } from '../../data/charactersData';
import { AnimePortrait } from './AnimePortrait';
import { Users, X, Lock, Unlock, Volume2, Sparkles, Shield, Gift, Heart, Sparkle } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface CharacterDatabaseModalProps {
  relationships: Record<CharacterId, CharacterStats>;
  onClose: () => void;
}

export const CharacterDatabaseModal: React.FC<CharacterDatabaseModalProps> = ({
  relationships,
  onClose
}) => {
  const [selectedChar, setSelectedChar] = useState<CharacterId>('rei');
  const [activeVoiceLine, setActiveVoiceLine] = useState<string | null>(null);

  const character = INITIAL_CHARACTERS_DATA[selectedChar];
  const stats = relationships[selectedChar];

  const handlePlayVoice = (key: keyof typeof character.voiceLines) => {
    soundManager.playVoiceChirp(selectedChar === 'rei' ? 520 : (selectedChar === 'kairo' ? 380 : (selectedChar === 'yuuma' ? 440 : 480)));
    setActiveVoiceLine(character.voiceLines[key]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-white font-cinzel">CHARACTER ARCHIVES & CODEX</h2>
              <p className="text-xs text-slate-400 font-anime">Sorcerer dossiers, anime portraits, voice lines, and classified secrets</p>
            </div>
          </div>
          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Character Selector Sidebar */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-cinzel">
              Select Character Profile
            </div>
            {Object.entries(INITIAL_CHARACTERS_DATA).map(([id, char]) => {
              const charId = id as CharacterId;
              const isSelected = selectedChar === charId;
              return (
                <button
                  key={id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedChar(charId);
                    setActiveVoiceLine(null);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <AnimePortrait
                    characterId={charId}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white font-anime truncate">{char.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{char.japaneseName} • {char.archetype}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Character Detailed Dossier */}
          <div className="md:col-span-8 space-y-5">
            {/* Top Identity Banner with Full Anime Portrait Feature */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Anime Portrait */}
              <div className="shrink-0">
                <AnimePortrait
                  characterId={selectedChar}
                  size="lg"
                  showAura={true}
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl font-bold text-white font-cinzel">{character.name}</h3>
                  <span className="text-xs text-indigo-400 font-bold px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-500/30">
                    Age: {character.age}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-bold ml-auto">
                    <Heart className="w-3.5 h-3.5 fill-pink-400" />
                    <span>Affection: {stats.affection}%</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-anime mt-1">
                  {character.japaneseName} • <span className="text-indigo-300 font-semibold">{character.archetype}</span>
                </div>
                <div className="text-xs text-slate-300 font-medium mt-1">
                  {character.role}
                </div>
                {/* Personality Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3 justify-center sm:justify-start">
                  {character.personality.map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Supernatural Ability Card */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 font-cinzel">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>INHERITED ABILITY: {character.ability}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-anime">
                {character.abilityDescription}
              </p>
            </div>

            {/* Bio */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-cinzel">
                BACKGROUND LORE
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-anime">
                {character.bio}
              </p>
            </div>

            {/* Voice Line Audition Buttons */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-cinzel flex items-center justify-between">
                <span>VOICE CLIPS & DIALOGUE</span>
                <span className="text-[10px] text-slate-500 lowercase">click to listen</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {(['greeting', 'happy', 'flustered', 'jealous', 'battle', 'romantic'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => handlePlayVoice(key)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold capitalize flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3 text-indigo-400" />
                    <span>{key}</span>
                  </button>
                ))}
              </div>

              {activeVoiceLine && (
                <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/40 text-xs italic text-indigo-200 font-anime animate-fade-in">
                  "{activeVoiceLine}"
                </div>
              )}
            </div>

            {/* Classified Secrets (Unlocked by Affection) */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-cinzel">
                CLASSIFIED DOSSIER SECRETS
              </div>

              <div className="space-y-2">
                {character.secrets.map((secret, idx) => {
                  const isUnlocked = stats.affection >= secret.unlockAffection;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-colors ${
                        isUnlocked
                          ? 'bg-slate-850 border-slate-700'
                          : 'bg-slate-950/70 border-slate-800/80 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="flex items-center gap-1.5 text-slate-200">
                          {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-rose-400" />}
                          {secret.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isUnlocked ? 'Unlocked' : `Requires ${secret.unlockAffection}% Affection`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-anime">
                        {isUnlocked ? secret.description : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gift Preferences */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" /> Loved Gifts
                </span>
                <p className="text-xs text-slate-300 font-anime">{character.favoriteGifts.join(', ')}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
                <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" /> Disliked Items
                </span>
                <p className="text-xs text-slate-300 font-anime">{character.dislikedGifts.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
