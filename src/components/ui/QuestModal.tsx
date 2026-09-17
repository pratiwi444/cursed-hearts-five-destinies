import React from 'react';
import { Quest } from '../../types';
import { ScrollText, CheckCircle2, Circle, MapPin, X, Award } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface QuestModalProps {
  quests: Quest[];
  onClose: () => void;
}

export const QuestModal: React.FC<QuestModalProps> = ({ quests, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <ScrollText className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white font-cinzel">ACADEMY QUEST REGISTRY</h2>
              <p className="text-xs text-slate-400 font-anime">Active supernatural assignments, romance endeavors, and leylines investigation</p>
            </div>
          </div>
          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quests List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`p-4 rounded-2xl border transition-all ${
                quest.completed
                  ? 'bg-slate-900/40 border-slate-800/80 opacity-70'
                  : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {quest.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white font-cinzel">{quest.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize font-medium">
                        {quest.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-anime mt-1 leading-relaxed">
                      {quest.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="capitalize">{quest.location.replace('_', ' ')}</span>
                      </span>
                      <span>Issuer: <strong className="text-slate-300">{quest.giver}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-300">
                    {quest.progress} / {quest.maxProgress}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-400 mt-2 flex items-center gap-1 justify-end">
                    <Award className="w-3.5 h-3.5" />
                    <span>{quest.rewardText}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
