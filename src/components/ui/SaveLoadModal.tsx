import React, { useState, useEffect } from 'react';
import { SaveSlotData } from '../../types';
import { Save, Download, Trash2, X, Clock, MapPin, Heart, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface SaveLoadModalProps {
  currentGameState: Omit<SaveSlotData, 'id' | 'date'>;
  onLoadGame: (data: SaveSlotData) => void;
  onClose: () => void;
}

const STORAGE_KEY_PREFIX = 'CURSED_HEARTS_SAVE_SLOT_';

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  currentGameState,
  onLoadGame,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save');
  const [slots, setSlots] = useState<(SaveSlotData | null)[]>([null, null, null, null]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load existing saves from localStorage
  useEffect(() => {
    const loadedSlots: (SaveSlotData | null)[] = [];
    for (let i = 1; i <= 4; i++) {
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${i}`);
        if (saved) {
          loadedSlots.push(JSON.parse(saved));
        } else {
          loadedSlots.push(null);
        }
      } catch {
        loadedSlots.push(null);
      }
    }
    setSlots(loadedSlots);
  }, []);

  const handleSaveToSlot = (slotIndex: number) => {
    soundManager.playClick();
    const newSave: SaveSlotData = {
      ...currentGameState,
      id: slotIndex + 1,
      date: new Date().toLocaleString()
    };

    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${slotIndex + 1}`, JSON.stringify(newSave));
      const updated = [...slots];
      updated[slotIndex] = newSave;
      setSlots(updated);
      setToastMessage(`Game successfully saved to Slot ${slotIndex + 1}!`);
      setTimeout(() => setToastMessage(null), 2500);
    } catch {
      setToastMessage('Failed to save to browser storage.');
    }
  };

  const handleLoadFromSlot = (slotData: SaveSlotData) => {
    soundManager.playClick();
    onLoadGame(slotData);
    setToastMessage(`Loaded Slot ${slotData.id}: Chapter ${slotData.chapter}!`);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleDeleteSlot = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${slotIndex + 1}`);
    const updated = [...slots];
    updated[slotIndex] = null;
    setSlots(updated);
    setToastMessage(`Slot ${slotIndex + 1} deleted.`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <Save className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white font-cinzel">CHRONICLE RECORDS & SAVES</h2>
              <p className="text-xs text-slate-400 font-anime">Store your destiny timelines and restore previous memories</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Save vs Load Tab Toggle */}
            <div className="flex p-1 rounded-xl bg-slate-800 border border-slate-700">
              <button
                onClick={() => { soundManager.playClick(); setActiveTab('save'); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'save' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Save
              </button>
              <button
                onClick={() => { soundManager.playClick(); setActiveTab('load'); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'load' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Load
              </button>
            </div>

            <button
              onClick={() => { soundManager.playClick(); onClose(); }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slots Content */}
        <div className="p-6 space-y-3">
          {toastMessage && (
            <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {slots.map((slot, index) => {
            const isEmpty = slot === null;

            return (
              <div
                key={index}
                onClick={() => {
                  if (activeTab === 'save') {
                    handleSaveToSlot(index);
                  } else if (slot) {
                    handleLoadFromSlot(slot);
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isEmpty
                    ? 'bg-slate-900/40 border-slate-850 hover:border-slate-700 hover:bg-slate-900/70'
                    : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/60 shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-sm font-cinzel">
                    {index + 1}
                  </div>

                  {slot ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-cinzel">
                          Chapter {slot.chapter}: {slot.chapterTitle}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-medium capitalize">
                          {slot.timeOfDay}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {slot.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-indigo-400" />
                          <span className="capitalize">{slot.location}</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-anime italic">
                      [ Empty Save File Slot {index + 1} ]
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {activeTab === 'save' ? (
                    <button className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors">
                      <Save className="w-3.5 h-3.5" />
                      <span>{slot ? 'Overwrite' : 'Save'}</span>
                    </button>
                  ) : (
                    slot && (
                      <>
                        <button className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors">
                          <Download className="w-3.5 h-3.5" />
                          <span>Load</span>
                        </button>
                        <button
                          onClick={(e) => handleDeleteSlot(index, e)}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
