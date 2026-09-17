import React from 'react';
import { TimeOfDay, LocationId, CombatStats, PlayerStats } from '../../types';
import { CHARACTER_ANIME_PORTRAITS } from '../../data/characterImages';
import {
  Users, HeartHandshake, Calendar, Swords, ScrollText,
  Briefcase, Image, Save, Sun, Moon, Sunset, Sunrise,
  Volume2, VolumeX, MapPin, Compass, ShieldAlert
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface HUDProps {
  playerStats: PlayerStats;
  combatStats: CombatStats;
  timeOfDay: TimeOfDay;
  location: LocationId;
  chapter: number;
  chapterTitle: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onChangeTimeOfDay: (time: TimeOfDay) => void;
  onChangeLocation: (loc: LocationId) => void;
  onOpenModal: (modal: 'characters' | 'relationships' | 'dating' | 'battle' | 'quests' | 'inventory' | 'gallery' | 'saveload' | 'menu') => void;
  isBattleMode: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  playerStats,
  combatStats,
  timeOfDay,
  location,
  chapter,
  chapterTitle,
  isMuted,
  onToggleMute,
  onChangeTimeOfDay,
  onChangeLocation,
  onOpenModal,
  isBattleMode
}) => {
  const timeIcons = {
    morning: <Sunrise className="w-4 h-4 text-amber-300" />,
    afternoon: <Sun className="w-4 h-4 text-yellow-400" />,
    evening: <Sunset className="w-4 h-4 text-orange-400" />,
    night: <Moon className="w-4 h-4 text-indigo-300" />
  };

  const nextTime: Record<TimeOfDay, TimeOfDay> = {
    morning: 'afternoon',
    afternoon: 'evening',
    evening: 'night',
    night: 'morning'
  };

  const locationNames: Record<LocationId, string> = {
    courtyard: 'Academy Courtyard',
    classroom: 'Supernatural Classroom',
    hallway: 'Mystic Hallway',
    library: 'Arcane Library',
    rooftop: 'Starlit Rooftop',
    training_ground: 'Combat Training Arena',
    cafe: 'Botanical Cafe'
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 md:p-5">
      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full pointer-events-auto">
        {/* Left: Player Profile & Health Status */}
        <div className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-4 py-2.5 rounded-2xl shadow-xl">
          <div className="relative">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-indigo-400/80 shadow-md bg-indigo-950">
              <img
                src={CHARACTER_ANIME_PORTRAITS.aira}
                alt="Aira Tachibana"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full border border-slate-900 shadow">
              Lv.{combatStats.level}
            </span>
          </div>

          <div className="space-y-1 min-w-[140px] md:min-w-[170px]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-100 font-cinzel">{playerStats.name}</span>
              <span className="text-[10px] text-slate-400">EXP {combatStats.exp}/{combatStats.maxExp}</span>
            </div>

            {/* HP Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${(combatStats.hp / combatStats.maxHp) * 100}%` }}
              />
            </div>

            {/* Stamina Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                style={{ width: `${(combatStats.stamina / combatStats.maxStamina) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Chapter & Story Info */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-5 py-2 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="text-[10px] font-bold text-indigo-400 tracking-wider font-cinzel">
              CHAPTER {chapter}
            </div>
            <div className="text-xs font-semibold text-slate-200">
              {chapterTitle}
            </div>
          </div>
        </div>

        {/* Right: Environment Info & Fast Teleport / Time Controls */}
        <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-3 py-2 rounded-2xl shadow-xl">
          {/* Location Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium px-2 py-1 bg-slate-900 rounded-lg border border-slate-800">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <select
              value={location}
              onChange={(e) => {
                soundManager.playClick();
                onChangeLocation(e.target.value as LocationId);
              }}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="courtyard" className="bg-slate-900">Courtyard</option>
              <option value="rooftop" className="bg-slate-900">Rooftop</option>
              <option value="training_ground" className="bg-slate-900">Training Arena</option>
              <option value="library" className="bg-slate-900">Arcane Library</option>
              <option value="cafe" className="bg-slate-900">Botanical Cafe</option>
            </select>
          </div>

          {/* Time of Day Cycle Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onChangeTimeOfDay(nextTime[timeOfDay]);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            title="Advance Time of Day"
          >
            {timeIcons[timeOfDay]}
            <span className="capitalize text-[11px]">{timeOfDay}</span>
          </button>

          {/* Sound Mute Button */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* BOTTOM BAR: Navigation Menu Hub & Controls Tip */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full">
        {/* Left: Desktop Controls Guide */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-950/70 backdrop-blur-sm border border-slate-800/60 px-3.5 py-2 rounded-xl text-slate-400 text-[11px] pointer-events-auto">
          <span className="bg-slate-800 text-slate-200 font-mono px-1.5 py-0.5 rounded text-[10px] font-bold">WASD</span> Move
          <span className="bg-slate-800 text-slate-200 font-mono px-1.5 py-0.5 rounded text-[10px] font-bold ml-1">SHIFT</span> Sprint
          <span className="bg-slate-800 text-slate-200 font-mono px-1.5 py-0.5 rounded text-[10px] font-bold ml-1">SPACE</span> Dodge
          <span className="bg-slate-800 text-slate-200 font-mono px-1.5 py-0.5 rounded text-[10px] font-bold ml-1">CLICK</span> Slash
          <span className="bg-slate-800 text-slate-200 font-mono px-1.5 py-0.5 rounded text-[10px] font-bold ml-1">E</span> Talk
        </div>

        {/* Center/Right: Feature Modals Hub Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 p-2 rounded-2xl shadow-2xl pointer-events-auto">
          <button
            onClick={() => { soundManager.playClick(); onOpenModal('characters'); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-indigo-900/40 border border-slate-800 hover:border-indigo-500/50 text-slate-200 hover:text-indigo-300 text-xs font-medium transition-all cursor-pointer hover:scale-105"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Characters</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); onOpenModal('relationships'); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-pink-900/40 border border-slate-800 hover:border-pink-500/50 text-slate-200 hover:text-pink-300 text-xs font-medium transition-all cursor-pointer hover:scale-105"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />
            <span>Bonds</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); onOpenModal('dating'); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-900/40 border border-slate-800 hover:border-rose-500/50 text-slate-200 hover:text-rose-300 text-xs font-medium transition-all cursor-pointer hover:scale-105"
          >
            <Calendar className="w-3.5 h-3.5 text-rose-400" />
            <span>Date</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); onOpenModal('battle'); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-600/50 text-amber-300 text-xs font-bold transition-all cursor-pointer hover:scale-105 animate-pulse"
          >
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            <span>{isBattleMode ? 'In Battle!' : '3D Battle'}</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); onOpenModal('quests'); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-emerald-900/40 border border-slate-800 hover:border-emerald-500/50 text-slate-200 hover:text-emerald-300 text-xs font-medium transition-all cursor-pointer hover:scale-105"
          >
            <ScrollText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Quests</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); onOpenModal('inventory'); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-amber-900/40 border border-slate-800 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 text-xs font-medium transition-all cursor-pointer hover:scale-105"
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Inventory</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); onOpenModal('gallery'); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-purple-900/40 border border-slate-800 hover:border-purple-500/50 text-slate-200 hover:text-purple-300 text-xs font-medium transition-all cursor-pointer hover:scale-105"
          >
            <Image className="w-3.5 h-3.5 text-purple-400" />
            <span>Gallery</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); onOpenModal('saveload'); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-cyan-900/40 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-300 text-xs font-medium transition-all cursor-pointer hover:scale-105"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save/Load</span>
          </button>
        </div>
      </div>
    </div>
  );
};
