import React, { useState } from 'react';
import { Play, RotateCcw, Users, HeartHandshake, Image, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface MainMenuProps {
  onStartGame: (customName: string) => void;
  onResumeGame: () => void;
  hasSavedGame: boolean;
  onOpenCharacters: () => void;
  onOpenBonds: () => void;
  onOpenGallery: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onResumeGame,
  hasSavedGame,
  onOpenCharacters,
  onOpenBonds,
  onOpenGallery,
  isMuted,
  onToggleMute
}) => {
  const [playerNameInput, setPlayerNameInput] = useState('Aira Mizuki');
  const [showNameDialog, setShowNameDialog] = useState(false);

  const handleConfirmStart = () => {
    soundManager.playClick();
    soundManager.playBGM('school');
    onStartGame(playerNameInput.trim() || 'Aira Mizuki');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-radial from-slate-900 via-slate-950 to-black select-none overflow-hidden">
      {/* Background Animated Glowing Runes & Sakura Dust */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative z-10 max-w-xl w-full text-center space-y-8">
        {/* Title Logo */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-widest uppercase font-cinzel">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AETHERIA ACADEMY CHRONICLES</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-pink-200 to-cyan-200 font-cinzel tracking-tight drop-shadow-[0_10px_25px_rgba(99,102,241,0.5)]">
            CURSED HEARTS
          </h1>
          <p className="text-sm md:text-base font-bold text-indigo-400 tracking-[0.3em] font-cinzel uppercase">
            FIVE DESTINIES
          </p>
          <p className="text-xs text-slate-400 font-anime max-w-md mx-auto mt-2">
            3D Anime Romance • Supernatural School Life • Action Battle RPG
          </p>
        </div>

        {/* Navigation Menu Buttons */}
        {!showNameDialog ? (
          <div className="space-y-3 max-w-sm mx-auto">
            <button
              onClick={() => {
                soundManager.playClick();
                setShowNameDialog(true);
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm tracking-wider font-cinzel flex items-center justify-center gap-2.5 shadow-2xl shadow-indigo-600/40 transition-all cursor-pointer hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START NEW GAME</span>
            </button>

            {hasSavedGame && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  soundManager.playBGM('school');
                  onResumeGame();
                }}
                className="w-full py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs tracking-wider font-cinzel flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-105"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>CONTINUE CHRONICLE</span>
              </button>
            )}

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => { soundManager.playClick(); onOpenCharacters(); }}
                className="py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 text-slate-300 text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Codex</span>
              </button>

              <button
                onClick={() => { soundManager.playClick(); onOpenBonds(); }}
                className="py-2.5 rounded-xl bg-slate-900 hover:bg-pink-950/60 border border-slate-800 hover:border-pink-500/50 text-slate-300 text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4 text-pink-400" />
                <span>Bonds</span>
              </button>

              <button
                onClick={() => { soundManager.playClick(); onOpenGallery(); }}
                className="py-2.5 rounded-xl bg-slate-900 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/50 text-slate-300 text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <Image className="w-4 h-4 text-purple-400" />
                <span>Gallery</span>
              </button>
            </div>

            {/* Sound Toggle */}
            <div className="pt-2">
              <button
                onClick={() => {
                  onToggleMute();
                }}
                className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span>{isMuted ? 'Sound Off (Click to Enable)' : 'Audio Synthesizer Active'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Name Customization Modal */
          <div className="max-w-md mx-auto bg-slate-950/90 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-4 animate-fade-in">
            <h3 className="text-lg font-bold text-white font-cinzel">Protagonist Registration</h3>
            <p className="text-xs text-slate-400 font-anime">
              Enter your female main character name. (Default: Aira Mizuki)
            </p>

            <input
              type="text"
              value={playerNameInput}
              onChange={(e) => setPlayerNameInput(e.target.value)}
              placeholder="Aira Mizuki"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-center font-bold text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowNameDialog(false)}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStart}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-transform hover:scale-105 cursor-pointer"
              >
                Enter Academy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
