import React, { useState } from 'react';
import { CharacterId, CharacterStats } from '../../types';
import { INITIAL_CHARACTERS_DATA } from '../../data/charactersData';
import { AnimePortrait } from './AnimePortrait';
import { Heart, ShieldCheck, Smile, Flame, X, UserCheck, AlertTriangle, Sparkles } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface RelationshipModalProps {
  relationships: Record<CharacterId, CharacterStats>;
  activeCompanion: CharacterId | null;
  onSetActiveCompanion: (id: CharacterId) => void;
  onClose: () => void;
  onSelectCharacterForDate: (id: CharacterId) => void;
}

export const RelationshipModal: React.FC<RelationshipModalProps> = ({
  relationships,
  activeCompanion,
  onSetActiveCompanion,
  onClose,
  onSelectCharacterForDate
}) => {
  const [selectedChar, setSelectedChar] = useState<CharacterId>('rei');
  const [jealousyAlert, setJealousyAlert] = useState<string | null>(null);

  const character = INITIAL_CHARACTERS_DATA[selectedChar];
  const stats = relationships[selectedChar];

  // Check jealousy drama trigger
  const checkJealousyTrigger = () => {
    // If Kairo & Yuuma or Rei & Kira have high affection
    if (relationships.kairo.affection >= 50 && relationships.yuuma.affection >= 50) {
      setJealousyAlert("Kairo noticed you spending time training with Yuuma. His shadows stirred quietly as he averted his gaze: '...Are you done with him yet, Aira?'");
    } else if (relationships.rei.affection >= 50 && relationships.kira.affection >= 50) {
      setJealousyAlert("Kira adjusted his glasses as Rei leaned close to you: 'Sensei, your personal boundary infringements with Aira are officially documented in student council reports.'");
    } else {
      setJealousyAlert("Currently, no romantic jealousy tensions have boiled over. Keep deepening your bonds!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            <div>
              <h2 className="text-base font-bold text-white font-cinzel">BONDS & DESTINIES</h2>
              <p className="text-xs text-slate-400 font-anime">Manage romantic affection, trust, friendship, and jealousy levels</p>
            </div>
          </div>
          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Character List */}
          <div className="md:col-span-5 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-cinzel">
              Five Love Interests
            </div>
            {Object.entries(INITIAL_CHARACTERS_DATA).map(([id, char]) => {
              const charId = id as CharacterId;
              const charStats = relationships[charId];
              const isSelected = selectedChar === charId;
              const isCompanion = activeCompanion === charId;

              return (
                <button
                  key={id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedChar(charId);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500/80 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AnimePortrait characterId={charId} size="sm" />
                    <div>
                      <div className="text-sm font-bold text-white font-anime">{char.name}</div>
                      <div className="text-xs text-slate-400">{charStats.stage} • {char.japaneseName}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-bold text-pink-400">
                      <Heart className="w-3.5 h-3.5 fill-pink-400" />
                      <span>{charStats.affection}%</span>
                    </div>
                    {isCompanion && (
                      <span className="text-[10px] font-bold text-indigo-400 uppercase">Partner</span>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Jealousy drama checker button */}
            <button
              onClick={() => {
                soundManager.playClick();
                checkJealousyTrigger();
              }}
              className="w-full mt-4 p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Check Jealousy Drama Encounter</span>
            </button>
          </div>

          {/* Right Column: Selected Character Bond Details */}
          <div className="md:col-span-7 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-4">
              <AnimePortrait characterId={selectedChar} size="md" showAura={true} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-bold text-white font-cinzel">{character.name}</h3>
                  <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-indigo-300 shrink-0">
                    {stats.stage}
                  </div>
                </div>
                <p className="text-xs text-indigo-400 font-medium font-anime">
                  {character.japaneseName} • {character.archetype}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{character.role}</p>
              </div>
            </div>

            {/* Bond Progress Bars */}
            <div className="space-y-3 pt-2">
              {/* Affection */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1.5 text-pink-400">
                    <Heart className="w-3.5 h-3.5 fill-pink-400" /> Affection
                  </span>
                  <span className="text-white font-bold">{stats.affection} / 100</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-500"
                    style={{ width: `${stats.affection}%` }}
                  />
                </div>
              </div>

              {/* Trust */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <ShieldCheck className="w-3.5 h-3.5" /> Trust
                  </span>
                  <span className="text-white font-bold">{stats.trust} / 100</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-500"
                    style={{ width: `${stats.trust}%` }}
                  />
                </div>
              </div>

              {/* Friendship */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Smile className="w-3.5 h-3.5" /> Friendship
                  </span>
                  <span className="text-white font-bold">{stats.friendship} / 100</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                    style={{ width: `${stats.friendship}%` }}
                  />
                </div>
              </div>

              {/* Jealousy */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1.5 text-purple-400">
                    <Flame className="w-3.5 h-3.5" /> Jealousy Tension
                  </span>
                  <span className="text-white font-bold">{stats.jealousy} / 100</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500"
                    style={{ width: `${stats.jealousy}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Romantic Quote */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 italic text-xs text-slate-300 leading-relaxed font-anime">
              "{stats.affection >= 50 ? character.voiceLines.romantic : character.voiceLines.greeting}"
            </div>

            {/* Action Buttons: Set Companion & Invite Date */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onSetActiveCompanion(selectedChar);
                }}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeCompanion === selectedChar
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{activeCompanion === selectedChar ? 'Active Battle Companion' : 'Assign as Battle Companion'}</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onSelectCharacterForDate(selectedChar);
                }}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Plan Date</span>
              </button>
            </div>

            {/* Jealousy Drama popup banner if triggered */}
            {jealousyAlert && (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-600/60 text-rose-200 text-xs leading-relaxed flex items-start gap-2.5 animate-fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-300 mb-0.5">Jealousy Dialogue Event:</div>
                  <div>{jealousyAlert}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
