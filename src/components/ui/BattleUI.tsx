import React, { useState } from 'react';
import { CharacterId, CombatStats } from '../../types';
import { INITIAL_CHARACTERS_DATA } from '../../data/charactersData';
import { Swords, Shield, Zap, Sparkles, UserCheck, Flame, X, Trophy } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface BattleUIProps {
  combatStats: CombatStats;
  activeCompanion: CharacterId | null;
  onExitBattle: () => void;
  onUseCompanionAssist: () => void;
  onUsePlayerSkill: () => void;
  isVictory: boolean;
}

export const BattleUI: React.FC<BattleUIProps> = ({
  combatStats,
  activeCompanion,
  onExitBattle,
  onUseCompanionAssist,
  onUsePlayerSkill,
  isVictory
}) => {
  const [partnerCooldown, setPartnerCooldown] = useState(false);
  const [skillCooldown, setSkillCooldown] = useState(false);

  const companion = activeCompanion ? INITIAL_CHARACTERS_DATA[activeCompanion] : null;

  const handleTriggerPartner = () => {
    if (partnerCooldown || !companion) return;
    setPartnerCooldown(true);
    soundManager.playMagicImpact();
    onUseCompanionAssist();
    setTimeout(() => setPartnerCooldown(false), 6000);
  };

  const handleTriggerSkill = () => {
    if (skillCooldown) return;
    setSkillCooldown(true);
    soundManager.playAttackSlash();
    onUsePlayerSkill();
    setTimeout(() => setSkillCooldown(false), 3500);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex flex-col justify-between p-4 md:p-6 select-none">
      {/* Top Banner: Battle Alert & Enemy Health */}
      <div className="w-full flex items-center justify-between pointer-events-auto">
        <div className="bg-rose-950/90 backdrop-blur-md border border-rose-600/70 px-5 py-2 rounded-2xl shadow-xl flex items-center gap-3">
          <Flame className="w-5 h-5 text-rose-500 animate-bounce" />
          <div>
            <div className="text-[10px] font-black tracking-widest text-rose-300 font-cinzel">SUPERNATURAL EXORCISM</div>
            <div className="text-xs font-bold text-white font-anime">3x Cursed Phantoms Detected</div>
          </div>
        </div>

        {/* Exit Battle / Retreat Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onExitBattle();
          }}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <X className="w-4 h-4" />
          <span>Exit Arena</span>
        </button>
      </div>

      {/* Center Screen: Victory Fanfare */}
      {isVictory && (
        <div className="m-auto text-center space-y-4 bg-slate-950/95 border-2 border-amber-500/80 p-8 rounded-3xl shadow-2xl shadow-amber-500/30 max-w-md pointer-events-auto animate-fade-in">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-pulse" />
          <h2 className="text-2xl font-black text-amber-300 font-cinzel tracking-wider">
            EXORCISM COMPLETE!
          </h2>
          <p className="text-xs text-slate-300 font-anime">
            The cursed phantoms have been banished back into the abyss. Your spiritual sync strengthened!
          </p>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-bold space-y-1">
            <div className="text-emerald-400">+350 EXP Gained</div>
            {companion && <div className="text-pink-400">Companion Bond with {companion.name} +10</div>}
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onExitBattle();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            Claim Rewards & Return
          </button>
        </div>
      )}

      {/* Bottom Right: Action Skills & Partner Summon */}
      <div className="flex items-end justify-between w-full pointer-events-auto">
        {/* Left: Combat Tips */}
        <div className="bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-4 py-2.5 rounded-2xl text-xs space-y-1 text-slate-300 hidden sm:block">
          <div><strong className="text-indigo-400">Left Click:</strong> 3-Hit Spirit Slash</div>
          <div><strong className="text-amber-400">Spacebar:</strong> Invincible Dodge Roll</div>
          <div><strong className="text-rose-400">Q Key:</strong> Awakened Curse Burst</div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Skill Button */}
          <button
            onClick={handleTriggerSkill}
            disabled={skillCooldown}
            className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg ${
              skillCooldown
                ? 'bg-slate-800 border-slate-700 opacity-60'
                : 'bg-indigo-900/80 hover:bg-indigo-800 border-indigo-500 text-indigo-200 hover:scale-105 shadow-indigo-500/30'
            }`}
          >
            <Zap className="w-5 h-5 text-indigo-300" />
            <span className="text-[10px] font-black mt-0.5">Q • SKILL</span>
          </button>

          {/* Partner Assist Button */}
          {companion && (
            <button
              onClick={handleTriggerPartner}
              disabled={partnerCooldown}
              className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 transition-all cursor-pointer shadow-xl ${
                partnerCooldown
                  ? 'bg-slate-800 border-slate-700 opacity-60'
                  : 'bg-gradient-to-r from-pink-900/80 to-purple-900/80 hover:from-pink-800 hover:to-purple-800 border-pink-500 text-white hover:scale-105 shadow-pink-500/30'
              }`}
            >
              <div
                className="w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs"
                style={{ borderColor: companion.themeColor, color: companion.themeColor, backgroundColor: `${companion.themeColor}30` }}
              >
                {companion.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-pink-300 uppercase tracking-wider font-cinzel">PARTNER COMBO</div>
                <div className="text-xs font-black text-white">{companion.ability.split(' ')[0]}</div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
