import React from 'react';
import { Swords, Shield, MessageCircle } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface TouchControlsProps {
  onActionAttack: () => void;
  onActionDodge: () => void;
  onActionInteract: () => void;
  hasNearbyNPC: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onActionAttack,
  onActionDodge,
  onActionInteract,
  hasNearbyNPC
}) => {
  // Dispatches synthetic keydown / keyup for virtual D-pad
  const handleDirectionPress = (key: string, isDown: boolean) => {
    const eventType = isDown ? 'keydown' : 'keyup';
    window.dispatchEvent(new KeyboardEvent(eventType, { key, code: key, bubbles: true }));
  };

  return (
    <div className="fixed inset-x-0 bottom-16 pointer-events-none z-20 flex justify-between px-6 select-none lg:hidden">
      {/* Virtual D-Pad (Left) */}
      <div className="relative w-36 h-36 bg-slate-950/60 backdrop-blur-md rounded-full border border-slate-800/80 p-2 pointer-events-auto flex items-center justify-center">
        {/* Forward (W) */}
        <button
          onTouchStart={() => handleDirectionPress('w', true)}
          onTouchEnd={() => handleDirectionPress('w', false)}
          onMouseDown={() => handleDirectionPress('w', true)}
          onMouseUp={() => handleDirectionPress('w', false)}
          className="absolute top-2 w-10 h-10 rounded-xl bg-slate-800/90 active:bg-indigo-600 border border-slate-700 flex items-center justify-center text-xs font-bold text-white shadow"
        >
          ▲
        </button>

        {/* Left (A) */}
        <button
          onTouchStart={() => handleDirectionPress('a', true)}
          onTouchEnd={() => handleDirectionPress('a', false)}
          onMouseDown={() => handleDirectionPress('a', true)}
          onMouseUp={() => handleDirectionPress('a', false)}
          className="absolute left-2 w-10 h-10 rounded-xl bg-slate-800/90 active:bg-indigo-600 border border-slate-700 flex items-center justify-center text-xs font-bold text-white shadow"
        >
          ◀
        </button>

        {/* Center dot */}
        <div className="w-6 h-6 rounded-full bg-slate-700/50" />

        {/* Right (D) */}
        <button
          onTouchStart={() => handleDirectionPress('d', true)}
          onTouchEnd={() => handleDirectionPress('d', false)}
          onMouseDown={() => handleDirectionPress('d', true)}
          onMouseUp={() => handleDirectionPress('d', false)}
          className="absolute right-2 w-10 h-10 rounded-xl bg-slate-800/90 active:bg-indigo-600 border border-slate-700 flex items-center justify-center text-xs font-bold text-white shadow"
        >
          ▶
        </button>

        {/* Backward (S) */}
        <button
          onTouchStart={() => handleDirectionPress('s', true)}
          onTouchEnd={() => handleDirectionPress('s', false)}
          onMouseDown={() => handleDirectionPress('s', true)}
          onMouseUp={() => handleDirectionPress('s', false)}
          className="absolute bottom-2 w-10 h-10 rounded-xl bg-slate-800/90 active:bg-indigo-600 border border-slate-700 flex items-center justify-center text-xs font-bold text-white shadow"
        >
          ▼
        </button>
      </div>

      {/* Action Buttons (Right) */}
      <div className="flex flex-col gap-3 pointer-events-auto items-end justify-end">
        {/* Interact Button (appears prominent if near NPC) */}
        {hasNearbyNPC && (
          <button
            onClick={() => {
              soundManager.playClick();
              onActionInteract();
            }}
            className="w-14 h-14 rounded-full bg-indigo-600 active:bg-indigo-500 border-2 border-indigo-300 text-white flex flex-col items-center justify-center shadow-xl shadow-indigo-600/40 animate-pulse cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[9px] font-black">TALK</span>
          </button>
        )}

        <div className="flex gap-2.5">
          {/* Dodge Button */}
          <button
            onClick={onActionDodge}
            className="w-13 h-13 rounded-full bg-amber-600/90 active:bg-amber-500 border-2 border-amber-300 text-white flex flex-col items-center justify-center shadow-lg cursor-pointer"
          >
            <Shield className="w-5 h-5" />
            <span className="text-[9px] font-black">DODGE</span>
          </button>

          {/* Attack Button */}
          <button
            onClick={onActionAttack}
            className="w-15 h-15 rounded-full bg-rose-600 active:bg-rose-500 border-2 border-rose-300 text-white flex flex-col items-center justify-center shadow-xl shadow-rose-600/50 cursor-pointer"
          >
            <Swords className="w-6 h-6" />
            <span className="text-[9px] font-black">SLASH</span>
          </button>
        </div>
      </div>
    </div>
  );
};
