import React, { useState } from 'react';
import { CGMemory } from '../../types';
import { Image, X, Lock, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface GalleryModalProps {
  onClose: () => void;
}

const GALLERY_MEMORIES: CGMemory[] = [
  {
    id: 'cg_rei_rooftop',
    title: 'Infinity Beneath the Starlight',
    characterId: 'rei',
    chapter: 1,
    description: 'Rei Kurosawa lowers his blindfold beneath the sapphire evening sky, his electric blue gaze reflecting only Aira.',
    unlocked: true,
    colorScheme: ['#0284c7', '#38bdf8']
  },
  {
    id: 'cg_kairo_shadows',
    title: 'Shadow and Sunlight',
    characterId: 'kairo',
    chapter: 2,
    description: 'Kairo Fushin extends a trembling, gloved hand out from the dark library stacks to shield Aira from falling leylines.',
    unlocked: true,
    colorScheme: ['#4338ca', '#6366f1']
  },
  {
    id: 'cg_yuuma_sunset',
    title: 'Sweat, Sparks, and a Golden Smile',
    characterId: 'yuuma',
    chapter: 3,
    description: 'Yuuma Arata catches Aira mid-air after an intense aerial martial combo, his laugh reverberating with pure warmth.',
    unlocked: true,
    colorScheme: ['#ea580c', '#f97316']
  },
  {
    id: 'cg_kira_thunder',
    title: 'The Calculated Exception',
    characterId: 'kira',
    chapter: 4,
    description: 'Kira Shinomiya drops his tactical parchment as lightning crackles around them, unable to calculate the speed of his racing heartbeat.',
    unlocked: false,
    colorScheme: ['#0891b2', '#06b6d4']
  },
  {
    id: 'cg_ren_threads',
    title: 'Knots of Crimson Destiny',
    characterId: 'ren',
    chapter: 5,
    description: 'Ren Kazami ties a crimson soul thread gently around Aira’s ring finger with an enigmatic, breathless smile.',
    unlocked: false,
    colorScheme: ['#be123c', '#e11d48']
  },
  {
    id: 'cg_true_awakening',
    title: 'The Five Destinies United',
    characterId: 'rei',
    chapter: 50,
    description: 'All five sorcerers stand in unison around Aira Mizuki as the celestial curse blooms into pure miraculous light.',
    unlocked: false,
    colorScheme: ['#7c3aed', '#ec4899']
  }
];

export const GalleryModal: React.FC<GalleryModalProps> = ({ onClose }) => {
  const [selectedCG, setSelectedCG] = useState<CGMemory | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <Image className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-base font-bold text-white font-cinzel">MEMORIES & CG GALLERY</h2>
              <p className="text-xs text-slate-400 font-anime">Unlocked romantic event scenes, climax illustrations, and story memories</p>
            </div>
          </div>
          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY_MEMORIES.map((cg) => (
            <div
              key={cg.id}
              onClick={() => {
                if (cg.unlocked) {
                  soundManager.playClick();
                  setSelectedCG(cg);
                }
              }}
              className={`relative aspect-[16/10] rounded-2xl border overflow-hidden p-4 flex flex-col justify-end transition-all cursor-pointer ${
                cg.unlocked
                  ? 'border-slate-700 hover:border-purple-500 hover:scale-[1.02] shadow-lg'
                  : 'border-slate-850 bg-slate-900/40 opacity-60 cursor-not-allowed'
              }`}
              style={{
                background: cg.unlocked
                  ? `linear-gradient(135deg, ${cg.colorScheme[0]}40, ${cg.colorScheme[1]}20, #090d16)`
                  : '#090d16'
              }}
            >
              {cg.unlocked ? (
                <div>
                  <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider font-cinzel">
                    CHAPTER {cg.chapter} EVENT
                  </div>
                  <h4 className="text-sm font-bold text-white font-cinzel mt-0.5">{cg.title}</h4>
                </div>
              ) : (
                <div className="m-auto text-center space-y-1">
                  <Lock className="w-6 h-6 text-slate-500 mx-auto" />
                  <span className="text-xs text-slate-400 font-bold block">Locked Scene</span>
                  <span className="text-[10px] text-slate-500">Progress Chapter {cg.chapter}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Fullscreen CG Inspection View */}
        {selectedCG && (
          <div className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl animate-fade-in">
            <div className="relative max-w-2xl w-full text-center space-y-4">
              <div
                className="w-full aspect-[16/9] rounded-3xl border-2 flex items-center justify-center p-8 shadow-2xl relative overflow-hidden"
                style={{
                  borderColor: selectedCG.colorScheme[1],
                  background: `radial-gradient(circle, ${selectedCG.colorScheme[0]}80 0%, #030712 90%)`
                }}
              >
                <div className="space-y-3 z-10">
                  <Heart className="w-12 h-12 text-pink-400 fill-pink-400 mx-auto animate-pulse" />
                  <h3 className="text-2xl font-bold text-white font-cinzel tracking-wider">
                    {selectedCG.title}
                  </h3>
                  <p className="text-sm text-slate-200 italic max-w-md mx-auto font-anime leading-relaxed">
                    "{selectedCG.description}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCG(null)}
                className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
