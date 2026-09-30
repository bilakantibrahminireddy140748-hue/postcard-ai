import React, { useState } from 'react';
import { AppState, SocialPlatform } from '../types';
import { StickerBadge, WavyDivider } from './DesignElements';
import { PLATFORM_CONFIGS } from '../utils/platforms';
import { ArrowRight, ArrowLeft, Check, Sparkles, Layers } from 'lucide-react';

interface Step3PlatformSelectionProps {
  appState: AppState;
  onUpdateState: (updates: Partial<AppState>) => void;
}

const ALL_PLATFORMS: SocialPlatform[] = [
  'Instagram Post (feed)',
  'Instagram Story',
  'Instagram Reel',
  'Facebook Post',
  'WhatsApp Status',
  'LinkedIn Post',
  'YouTube Shorts',
  'Pinterest Pin',
  'X (Twitter) Post',
  'Snapchat Story',
];

export const Step3PlatformSelection: React.FC<Step3PlatformSelectionProps> = ({
  appState,
  onUpdateState,
}) => {
  const [selectedList, setSelectedList] = useState<SocialPlatform[]>(
    appState.selectedPlatforms && appState.selectedPlatforms.length > 0
      ? appState.selectedPlatforms
      : ['Instagram Post (feed)']
  );

  const togglePlatform = (platform: SocialPlatform) => {
    let updated: SocialPlatform[] = [];
    if (selectedList.includes(platform)) {
      if (selectedList.length === 1) return; // keep at least 1 platform
      updated = selectedList.filter((p) => p !== platform);
    } else {
      updated = [...selectedList, platform];
    }
    setSelectedList(updated);
  };

  const handleContinue = () => {
    onUpdateState({
      selectedPlatforms: selectedList,
      activePreviewPlatform: selectedList[0],
      step: 4, // Proceed to Upload Photos (Step 4)
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Title Header */}
      <div className="text-center mb-6">
        <StickerBadge text="Step 3 of 9 — Platforms" color="yellow" rotate={-2} className="mb-2" />
        <h2 className="font-display text-2xl sm:text-3xl text-slate-900 leading-tight">
          Where are you posting this, <span className="text-[#F0509B]">{appState.userName}</span>? 🌐
        </h2>
        <p className="font-handwriting text-base text-slate-600 font-bold mt-1">
          Select one or multiple social platforms (we'll format specs & safe zones for each!)
        </p>
      </div>

      {/* Grid of 10 Sticker-Style Platform Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-6">
        {ALL_PLATFORMS.map((platformKey, index) => {
          const cfg = PLATFORM_CONFIGS[platformKey];
          const isSelected = selectedList.includes(platformKey);
          const rotateDeg = index % 2 === 0 ? -1.5 : 1.5;

          return (
            <button
              key={platformKey}
              onClick={() => togglePlatform(platformKey)}
              style={{ transform: `rotate(${isSelected ? 0 : rotateDeg}deg)` }}
              className={`p-3.5 rounded-2xl border-3 border-slate-900 text-left flex flex-col justify-between transition-all relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-white ring-4 ring-[#F0509B] scale-102 z-10 shadow-hard-lg'
                  : 'bg-[#FFF8EC] shadow-hard hover:scale-101 hover:z-10'
              }`}
            >
              {/* Checkmark badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#F7C948] border-2 border-slate-900 flex items-center justify-center text-slate-900 font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,0.9)] animate-bounce">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              {/* Platform Header Icon & Name */}
              <div className="mb-3">
                <span
                  className={`inline-block text-xs font-black uppercase px-2.5 py-1 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.9)] mb-2 ${cfg.bgColor}`}
                >
                  {cfg.name}
                </span>

                <h3 className="font-display text-sm text-slate-900 leading-tight">
                  {cfg.badge}
                </h3>
              </div>

              {/* Aspect Ratio & Specs info */}
              <div className="border-t border-slate-300 pt-2 text-[11px] text-slate-600 font-medium">
                <p className="truncate">Ratio: {cfg.aspectRatioLabel}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {cfg.hasSafeZone ? '🛡️ Safe zone rules' : '⚡ Direct feed'}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Platforms Summary Banner */}
      <div className="bg-amber-100 rounded-2xl border-2 border-slate-900 p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#F0509B] text-white border-2 border-slate-900 flex items-center justify-center font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display text-sm text-slate-900">
              Selected ({selectedList.length} platform{selectedList.length > 1 ? 's' : ''})
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              We'll generate tailored layouts, hashtags & live previews for each.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 max-w-xs justify-end">
          {selectedList.map((p) => (
            <span
              key={p}
              className="bg-white text-slate-900 border border-slate-900 px-2 py-0.5 rounded text-[10px] font-bold shadow-xs"
            >
              {PLATFORM_CONFIGS[p].name}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onUpdateState({ step: 2 })}
          className="bg-white text-slate-900 font-bold py-3 px-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          onClick={handleContinue}
          className="flex-1 bg-[#F0509B] text-white font-display text-lg py-3.5 px-6 rounded-xl border-2 border-slate-900 shadow-hard-yellow hover:bg-[#e03d88] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Next: Upload Photos</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
