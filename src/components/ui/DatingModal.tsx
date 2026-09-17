import React, { useState } from 'react';
import { CharacterId, LocationId } from '../../types';
import { INITIAL_CHARACTERS_DATA } from '../../data/charactersData';
import { AnimePortrait } from './AnimePortrait';
import { Calendar, Heart, MapPin, Sparkles, X, CheckCircle, ArrowRight, Coffee } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import confetti from 'canvas-confetti';

interface DatingModalProps {
  initialCharacterId?: CharacterId | null;
  onClose: () => void;
  onDateCompleted: (charId: CharacterId, affectionGain: number, trustGain: number) => void;
}

const DATE_LOCATIONS: { id: LocationId; name: string; description: string; bestFor: CharacterId }[] = [
  {
    id: 'rooftop',
    name: 'Starlit Academy Rooftop',
    description: 'A secluded sanctuary above the clouds overlooking the luminous skyline.',
    bestFor: 'rei'
  },
  {
    id: 'library',
    name: 'Arcane Grimoire Library',
    description: 'Quiet bookshelves filled with mystic manuscripts and warm green study lamps.',
    bestFor: 'kairo'
  },
  {
    id: 'training_ground',
    name: 'Sunset Sparring Arena',
    description: 'Energetic martial rings under the golden sunset with friendly sparring.',
    bestFor: 'yuuma'
  },
  {
    id: 'hallway',
    name: 'Grand Academy Observation Corridor',
    description: 'Elegant arched windows overlooking the academy leylines with tranquil air.',
    bestFor: 'kira'
  },
  {
    id: 'courtyard',
    name: 'Sakura Petal Courtyard',
    description: 'Ancient cherry blossom trees dancing in the breeze beside the stone fountain.',
    bestFor: 'ren'
  },
  {
    id: 'cafe',
    name: 'Botanical Glasshouse Cafe',
    description: 'Fragrant artisan herbal tea, sweet custard pastries, and lush hanging ivy.',
    bestFor: 'rei'
  }
];

export const DatingModal: React.FC<DatingModalProps> = ({
  initialCharacterId,
  onClose,
  onDateCompleted
}) => {
  const [selectedChar, setSelectedChar] = useState<CharacterId>(initialCharacterId || 'rei');
  const [selectedLocation, setSelectedLocation] = useState<LocationId>('rooftop');
  const [datePhase, setDatePhase] = useState<'plan' | 'event' | 'mini_activity' | 'summary'>('plan');
  const [dialogueChoiceIndex, setDialogueChoiceIndex] = useState<number | null>(null);
  const [resonanceScore, setResonanceScore] = useState<number>(0);

  const character = INITIAL_CHARACTERS_DATA[selectedChar];

  const handleStartEvent = () => {
    soundManager.playClick();
    soundManager.playBGM('romance');
    setDatePhase('event');
  };

  const handleChooseDialogue = (index: number) => {
    setDialogueChoiceIndex(index);
    soundManager.playHeartChime();
    setTimeout(() => {
      setDatePhase('mini_activity');
    }, 1200);
  };

  const handleHeartResonanceClick = () => {
    setResonanceScore(prev => Math.min(100, prev + 25));
    soundManager.playHeartChime();
    if (resonanceScore + 25 >= 100) {
      setTimeout(() => {
        // Trigger celebratory confetti!
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore if canvas not supported
        }
        setDatePhase('summary');
      }, 500);
    }
  };

  const handleFinishDate = () => {
    soundManager.playClick();
    soundManager.playBGM('school');
    onDateCompleted(selectedChar, 18, 12);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-rose-500" />
            <div>
              <h2 className="text-base font-bold text-white font-cinzel">ROMANTIC DATE RENDEZVOUS</h2>
              <p className="text-xs text-slate-400 font-anime">Deepen your intimate bond and create unforgettable memories</p>
            </div>
          </div>
          <button
            onClick={() => { soundManager.playClick(); soundManager.playBGM('school'); onClose(); }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {datePhase === 'plan' && (
            <div className="space-y-6">
              {/* Step 1: Select Partner */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-cinzel">
                  1. Choose Your Date Companion
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {Object.entries(INITIAL_CHARACTERS_DATA).map(([id, char]) => {
                    const charId = id as CharacterId;
                    const isSelected = selectedChar === charId;
                    return (
                      <button
                        key={id}
                        onClick={() => { soundManager.playClick(); setSelectedChar(charId); }}
                        className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-rose-950/60 border-rose-500 text-white shadow-lg shadow-rose-500/20 ring-1 ring-rose-500/50'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850'
                        }`}
                      >
                        <AnimePortrait characterId={charId} size="sm" className="mb-1.5" />
                        <div className="text-xs font-bold font-anime truncate w-full">{char.name.split(' ')[0]}</div>
                        <div className="text-[10px] text-slate-400 truncate w-full">{char.japaneseName}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select Date Spot */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-cinzel">
                  2. Select Romantic Destination
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DATE_LOCATIONS.map((loc) => {
                    const isSelected = selectedLocation === loc.id;
                    const isFavorite = loc.bestFor === selectedChar;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => { soundManager.playClick(); setSelectedLocation(loc.id); }}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-indigo-950/70 border-indigo-500 shadow-md shadow-indigo-500/20'
                            : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850'
                        }`}
                      >
                        <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white font-anime">{loc.name}</span>
                            {isFavorite && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold">
                                Favorite!
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-snug">{loc.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Start Date Button */}
              <div className="pt-2">
                <button
                  onClick={handleStartEvent}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-pink-600/30 transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Begin Date with {character.name}</span>
                </button>
              </div>
            </div>
          )}

          {/* Phase 2: Interactive Date Scene */}
          {datePhase === 'event' && (
            <div className="space-y-6 text-center py-2">
              <div className="flex justify-center">
                <AnimePortrait
                  characterId={selectedChar}
                  size="lg"
                  expression="blush"
                  glowIntensity="high"
                  showAura={true}
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest font-cinzel">
                  {selectedLocation.toUpperCase()} DATE • {character.japaneseName}
                </span>
                <h3 className="text-xl font-bold text-white font-cinzel">{character.name}</h3>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 text-sm leading-relaxed italic max-w-lg mx-auto font-anime shadow-inner">
                  "{character.voiceLines.romantic}"
                </div>
              </div>

              {/* Dialogue Choices during Date */}
              <div className="space-y-2.5 max-w-md mx-auto pt-2">
                <button
                  onClick={() => handleChooseDialogue(0)}
                  className="w-full p-3 rounded-xl bg-slate-900 hover:bg-rose-950/70 border border-slate-700 hover:border-rose-500 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>"I'm really happy I get to spend this time alone with you."</span>
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 shrink-0 ml-2" />
                </button>
                <button
                  onClick={() => handleChooseDialogue(1)}
                  className="w-full p-3 rounded-xl bg-slate-900 hover:bg-indigo-950/70 border border-slate-700 hover:border-indigo-500 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>"Tell me something you've never told anyone else."</span>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Phase 3: Heart Resonance Mini-Activity */}
          {datePhase === 'mini_activity' && (
            <div className="space-y-6 text-center py-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-widest font-cinzel">
                  MINI-ACTIVITY: SUPERNATURAL HEART HARMONY
                </span>
                <h3 className="text-lg font-bold text-white font-cinzel">Align Your Soul Frequencies</h3>
                <p className="text-xs text-slate-400">Tap the pulsing heart to achieve perfect romantic resonance!</p>
              </div>

              {/* Resonance Progress Bar */}
              <div className="w-full max-w-xs mx-auto h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-300"
                  style={{ width: `${resonanceScore}%` }}
                />
              </div>

              {/* Interactive Pulsing Heart Button */}
              <button
                onClick={handleHeartResonanceClick}
                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 hover:scale-110 active:scale-95 flex items-center justify-center shadow-2xl shadow-pink-500/50 cursor-pointer transition-transform group"
              >
                <Heart className="w-12 h-12 text-white fill-white group-hover:scale-110 transition-transform" />
              </button>

              <div className="text-xs font-bold text-slate-300">
                Resonance: <span className="text-pink-400 text-sm">{resonanceScore}%</span>
              </div>
            </div>
          )}

          {/* Phase 4: Date Conclusion Summary */}
          {datePhase === 'summary' && (
            <div className="space-y-6 text-center py-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white font-cinzel">Date Rendezvous Complete!</h3>
                <p className="text-xs text-slate-300">
                  You and {character.name} shared a heartfelt, intimate moment under the gentle winds.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                <div className="p-3 rounded-xl bg-pink-950/50 border border-pink-500/40 text-center">
                  <div className="text-[11px] text-slate-400">Affection Boost</div>
                  <div className="text-base font-bold text-pink-400">+18 pts</div>
                </div>
                <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-center">
                  <div className="text-[11px] text-slate-400">Trust Boost</div>
                  <div className="text-base font-bold text-cyan-400">+12 pts</div>
                </div>
              </div>

              <button
                onClick={handleFinishDate}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                Return to Campus
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
