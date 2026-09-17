import React from 'react';
import { CharacterId } from '../../types';
import { INITIAL_CHARACTERS_DATA } from '../../data/charactersData';
import { getCharacterPortrait } from '../../data/characterImages';
import { Sparkles, Heart, Zap, Flame } from 'lucide-react';

interface AnimePortraitProps {
  characterId: CharacterId | 'aira';
  size?: 'sm' | 'md' | 'lg' | 'full' | 'bust';
  showAura?: boolean;
  expression?: 'normal' | 'happy' | 'blush' | 'serious' | 'jealous' | 'battle';
  className?: string;
  glowIntensity?: 'none' | 'subtle' | 'high';
}

export const AnimePortrait: React.FC<AnimePortraitProps> = ({
  characterId,
  size = 'md',
  showAura = true,
  expression = 'normal',
  className = '',
  glowIntensity = 'subtle'
}) => {
  const char = characterId !== 'aira' ? INITIAL_CHARACTERS_DATA[characterId as CharacterId] : null;
  const portraitUrl = getCharacterPortrait(characterId);
  const themeColor = char ? char.themeColor : '#a855f7';
  const name = char ? char.name : 'Aira Mizuki';

  // Sizing styles
  if (size === 'sm') {
    return (
      <div className={`relative inline-block ${className}`}>
        <div
          className="w-9 h-9 rounded-xl overflow-hidden border-2 shadow-md relative"
          style={{ borderColor: themeColor }}
        >
          <img
            src={portraitUrl}
            alt={name}
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    );
  }

  if (size === 'md') {
    return (
      <div className={`relative inline-block ${className}`}>
        <div
          className="w-14 h-14 rounded-2xl overflow-hidden border-2 shadow-lg relative group transition-transform duration-300 hover:scale-105"
          style={{ borderColor: themeColor }}
        >
          <img
            src={portraitUrl}
            alt={name}
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"
            style={{ backgroundColor: themeColor }}
          />
        </div>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`relative inline-block ${className}`}>
        {showAura && (
          <div
            className="absolute -inset-1 rounded-2xl blur-md opacity-40 transition-opacity"
            style={{ backgroundColor: themeColor }}
          />
        )}
        <div
          className="w-24 h-24 rounded-2xl overflow-hidden border-2 shadow-xl relative"
          style={{ borderColor: themeColor }}
        >
          <img
            src={portraitUrl}
            alt={name}
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    );
  }

  // Bust / Full Visual Novel Sprite
  return (
    <div className={`relative flex flex-col items-center justify-end select-none pointer-events-none ${className}`}>
      {/* Dynamic Anime Aura Behind Sprite */}
      {showAura && glowIntensity !== 'none' && (
        <div
          className={`absolute bottom-0 w-72 h-80 rounded-full blur-3xl opacity-35 -z-10 animate-pulse ${
            glowIntensity === 'high' ? 'opacity-55' : 'opacity-30'
          }`}
          style={{ backgroundColor: themeColor }}
        />
      )}

      {/* Floating Emotional Particle Tag */}
      {expression === 'blush' && (
        <div className="absolute top-12 right-6 px-3 py-1 rounded-full bg-pink-950/80 border border-pink-500/60 text-pink-300 text-xs font-bold flex items-center gap-1 shadow-lg animate-bounce">
          <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
          <span>ドキドキ...</span>
        </div>
      )}
      {expression === 'battle' && (
        <div className="absolute top-12 right-6 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/60 text-amber-300 text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Awakened!</span>
        </div>
      )}
      {expression === 'jealous' && (
        <div className="absolute top-12 right-6 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/60 text-violet-300 text-xs font-bold flex items-center gap-1 shadow-lg">
          <Zap className="w-3.5 h-3.5 text-violet-400" />
          <span>Tension...</span>
        </div>
      )}
      {expression === 'happy' && (
        <div className="absolute top-12 right-6 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center gap-1 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Glad</span>
        </div>
      )}

      {/* Visual Novel Character Sprite Frame with fade-out bottom */}
      <div className="relative w-64 md:w-80 h-96 md:h-[420px] overflow-hidden rounded-t-3xl filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)]">
        <img
          src={portraitUrl}
          alt={name}
          className="w-full h-full object-cover object-top transform transition-transform duration-500 hover:scale-102"
          referrerPolicy="no-referrer"
        />
        {/* Soft bottom vignette gradient so sprite melts seamlessly into dialogue box */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
