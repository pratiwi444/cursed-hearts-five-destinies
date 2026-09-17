import React, { useState } from 'react';
import { InventorySlot, CharacterId } from '../../types';
import { INITIAL_CHARACTERS_DATA } from '../../data/charactersData';
import { Briefcase, Gift, Heart, Sparkles, X, Check, ArrowRight } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface InventoryModalProps {
  inventory: InventorySlot[];
  onUseItem: (itemId: string) => void;
  onGiftItem: (itemId: string, targetChar: CharacterId) => { affectionGain: number; reaction: string };
  initialTargetCharacter?: CharacterId | null;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  inventory,
  onUseItem,
  onGiftItem,
  initialTargetCharacter,
  onClose
}) => {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'gift' | 'consumable' | 'talisman'>('all');
  const [giftTarget, setGiftTarget] = useState<CharacterId>(initialTargetCharacter || 'rei');
  const [giftResult, setGiftResult] = useState<{ character: string; gain: number; reaction: string } | null>(null);

  const filteredSlots = inventory.filter(slot => {
    if (selectedCategory === 'all') return true;
    return slot.item.category === selectedCategory;
  });

  const selectedSlot = filteredSlots[selectedSlotIndex] || filteredSlots[0];

  const handleGift = () => {
    if (!selectedSlot || selectedSlot.quantity <= 0) return;
    const res = onGiftItem(selectedSlot.item.id, giftTarget);
    soundManager.playHeartChime();
    setGiftResult({
      character: INITIAL_CHARACTERS_DATA[giftTarget].name,
      gain: res.affectionGain,
      reaction: res.reaction
    });
  };

  const handleUse = () => {
    if (!selectedSlot || selectedSlot.quantity <= 0) return;
    onUseItem(selectedSlot.item.id);
    soundManager.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white font-cinzel">INVENTORY & GIFTS</h2>
              <p className="text-xs text-slate-400 font-anime">Manage restorative elixirs, mystic talismans, and character presents</p>
            </div>
          </div>
          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Filter & Item Grid */}
          <div className="md:col-span-7 space-y-4">
            {/* Category Tabs */}
            <div className="flex gap-2">
              {(['all', 'gift', 'consumable', 'talisman'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => { soundManager.playClick(); setSelectedCategory(cat); setSelectedSlotIndex(0); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filteredSlots.map((slot, index) => {
                const isSelected = selectedSlot?.item.id === slot.item.id;
                return (
                  <button
                    key={slot.item.id}
                    onClick={() => { soundManager.playClick(); setSelectedSlotIndex(index); setGiftResult(null); }}
                    className={`relative p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/50 border-amber-500 shadow-md shadow-amber-500/20 scale-105'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <div className="text-3xl mb-1">{slot.item.icon}</div>
                    <div className="text-xs font-bold text-slate-200 truncate">{slot.item.name}</div>
                    <div className="text-[10px] text-slate-400">Qty: {slot.quantity}</div>
                    <div className="text-[9px] text-amber-400 capitalize">{slot.item.rarity}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Item Inspection & Actions */}
          <div className="md:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            {selectedSlot ? (
              <div className="space-y-4">
                <div className="text-center py-2">
                  <div className="text-5xl mb-2">{selectedSlot.item.icon}</div>
                  <h3 className="text-lg font-bold text-white font-cinzel">{selectedSlot.item.name}</h3>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                    {selectedSlot.item.rarity} {selectedSlot.item.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-anime">
                  {selectedSlot.item.description}
                </p>

                {selectedSlot.item.effect && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Effect: {selectedSlot.item.effect}</span>
                  </div>
                )}

                {/* Gifting Section */}
                {selectedSlot.item.category === 'gift' ? (
                  <div className="pt-2 border-t border-slate-800 space-y-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-cinzel">
                      Select Recipient:
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {Object.entries(INITIAL_CHARACTERS_DATA).map(([id, char]) => {
                        const charId = id as CharacterId;
                        const isChosen = giftTarget === charId;
                        return (
                          <button
                            key={id}
                            onClick={() => { soundManager.playClick(); setGiftTarget(charId); }}
                            className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                              isChosen
                                ? 'bg-pink-950 border-pink-500 text-white shadow'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {char.name.split(' ')[0]}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleGift}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer hover:scale-105"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Gift to {INITIAL_CHARACTERS_DATA[giftTarget].name}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleUse}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-105"
                  >
                    <span>Use Item</span>
                  </button>
                )}

                {/* Gift result alert */}
                {giftResult && (
                  <div className="p-3 rounded-xl bg-pink-950/70 border border-pink-500/50 text-xs space-y-1 animate-fade-in">
                    <div className="font-bold text-pink-300 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 fill-pink-400" />
                      <span>{giftResult.character} Affection +{giftResult.gain}!</span>
                    </div>
                    <p className="text-slate-200 italic font-anime leading-snug">
                      "{giftResult.reaction}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-500 text-xs my-auto">
                No item selected
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
