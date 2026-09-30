import React, { useRef, useState } from 'react';
import { AppState, UploadedMedia } from '../types';
import { StickerBadge, PolaroidFrame } from './DesignElements';
import {
  Upload,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  Video,
  Play,
  Sparkles,
  Plus,
  Scissors,
  Clock,
} from 'lucide-react';

interface Step3Props {
  appState: AppState;
  onUpdateState: (updates: Partial<AppState>) => void;
}

const SAMPLE_PRESETS: { name: string; category: string; url: string; type: 'image' | 'video' }[] = [
  {
    name: 'Goa Sunset Beach',
    category: 'Travel',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Streetwear OOTD Fit',
    category: 'Fashion',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Artisan Cafe Brunch',
    category: 'Food',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Aesthetic Desk & Notes',
    category: 'Professional',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Concert Neon Lights',
    category: 'Celebration',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
  },
];

export const Step3UploadPhotos: React.FC<Step3Props> = ({ appState, onUpdateState }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTrimMediaId, setActiveTrimMediaId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          const mediaObj: UploadedMedia = {
            id: `upload_${Date.now()}_${index}`,
            url: event.target.result as string,
            name: file.name,
            type: isVideo ? 'video' : 'image',
            duration: isVideo ? 10 : undefined,
            trimStart: 0,
            trimEnd: isVideo ? 5 : undefined,
          };

          onUpdateState({ photos: [...appState.photos, mediaObj] });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addPresetPhoto = (preset: { name: string; url: string; type: 'image' | 'video' }) => {
    const mediaObj: UploadedMedia = {
      id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      url: preset.url,
      name: preset.name,
      type: preset.type,
    };
    onUpdateState({ photos: [...appState.photos, mediaObj] });
  };

  const removePhoto = (id: string) => {
    onUpdateState({
      photos: appState.photos.filter((p) => p.id !== id),
    });
  };

  const movePhoto = (index: number, direction: 'up' | 'down') => {
    const updated = [...appState.photos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onUpdateState({ photos: updated });
  };

  const handleUpdateTrim = (id: string, start: number, end: number) => {
    onUpdateState({
      photos: appState.photos.map((item) =>
        item.id === id ? { ...item, trimStart: start, trimEnd: end } : item
      ),
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Step Header */}
      <div className="text-center mb-6">
        <StickerBadge text="Step 4 of 9" color="yellow" rotate={2} className="mb-2" />
        <h2 className="font-display text-2xl sm:text-3xl text-slate-900 leading-tight">
          Upload Photos & Video Clips, <span className="text-[#F0509B]">{appState.userName}</span> 📸🎬
        </h2>
        <p className="font-handwriting text-base text-slate-600 font-bold mt-1">
          Upload photos or short video clips (.mp4, .mov, max 60s) with 2-5s trim control!
        </p>
      </div>

      {/* Dashed Polaroid Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-full bg-white/90 rounded-2xl border-3 border-dashed border-slate-900 p-8 text-center shadow-hard cursor-pointer hover:bg-amber-50/80 transition-all mb-6 relative group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,video/mp4,video/quicktime,video/webm"
          multiple
          className="hidden"
        />

        <div className="w-16 h-16 mx-auto rounded-full bg-[#F7C948] border-2 border-slate-900 flex items-center justify-center text-slate-900 mb-3 group-hover:scale-110 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]">
          <Upload className="w-8 h-8" />
        </div>

        <h3 className="font-display text-lg text-slate-900 mb-1">
          Drop photos or videos here or <span className="text-[#F0509B] underline">browse device</span>
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Supports PNG, JPG, WEBP, MP4, MOV • Max ~60s per video clip
        </p>
      </div>

      {/* Preset Sample Photos Bar */}
      <div className="bg-amber-100/90 rounded-2xl border-2 border-slate-900 p-4 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-display text-xs text-slate-900 flex items-center gap-1 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#F0509B]" /> Quick Test Presets
          </span>
          <span className="text-[10px] text-slate-600 font-medium">Click to add sample media</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => addPresetPhoto(preset)}
              className="flex-shrink-0 bg-white rounded-lg border-2 border-slate-900 p-1.5 flex items-center gap-2 text-left hover:scale-105 transition-transform cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]"
            >
              <img src={preset.url} alt={preset.name} className="w-10 h-10 object-cover rounded border border-slate-300" />
              <div>
                <p className="font-display text-[11px] text-slate-900 leading-tight">{preset.name}</p>
                <span className="text-[9px] text-[#F0509B] font-bold uppercase">{preset.category}</span>
              </div>
              <Plus className="w-3.5 h-3.5 text-slate-700 ml-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Uploaded Board */}
      {appState.photos.length > 0 ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg text-slate-900">
              Your Studio Board ({appState.photos.length} item{appState.photos.length > 1 ? 's' : ''})
            </h3>
            <button
              onClick={() => onUpdateState({ photos: [] })}
              className="text-xs text-rose-600 font-bold hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {appState.photos.map((item, index) => (
              <PolaroidFrame
                key={item.id}
                rotate={index % 2 === 0 ? -2 : 2}
                caption={item.name}
              >
                {item.type === 'video' ? (
                  <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                    <video src={item.url} className="w-full h-full object-cover" muted />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-[#F7C948] border-2 border-slate-900 flex items-center justify-center text-slate-900 shadow-md">
                        <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute top-1 left-1 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white flex items-center gap-1">
                      <Video className="w-3 h-3 text-[#F7C948]" /> Video Clip
                    </span>
                  </div>
                ) : (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                )}

                {/* Video Trim Controls Toggle */}
                {item.type === 'video' && (
                  <div className="p-1 text-[10px] bg-amber-50 border-t border-slate-300">
                    <button
                      onClick={() =>
                        setActiveTrimMediaId(activeTrimMediaId === item.id ? null : item.id)
                      }
                      className="w-full font-bold text-[#F0509B] flex items-center justify-center gap-1 hover:underline"
                    >
                      <Scissors className="w-3 h-3" />
                      <span>
                        Trim: {item.trimStart || 0}s - {item.trimEnd || 5}s
                      </span>
                    </button>

                    {activeTrimMediaId === item.id && (
                      <div className="mt-2 space-y-1 bg-white p-2 rounded border border-slate-300">
                        <div className="flex justify-between font-bold">
                          <span>Start: {item.trimStart || 0}s</span>
                          <span>End: {item.trimEnd || 5}s</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={item.trimStart || 0}
                          onChange={(e) =>
                            handleUpdateTrim(
                              item.id,
                              parseInt(e.target.value, 10),
                              item.trimEnd || 5
                            )
                          }
                          className="w-full accent-[#F0509B]"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Overlay Controls */}
                <div className="absolute top-1 right-1 flex gap-1 z-10">
                  <button
                    onClick={() => removePhoto(item.id)}
                    className="p-1 bg-rose-500 text-white rounded-full border border-slate-900 shadow hover:bg-rose-600"
                    title="Remove Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Reorder Buttons */}
                {appState.photos.length > 1 && (
                  <div className="absolute bottom-1 left-1 flex gap-1 z-10">
                    {index > 0 && (
                      <button
                        onClick={() => movePhoto(index, 'up')}
                        className="px-1.5 py-0.5 bg-slate-900 text-white text-[9px] font-bold rounded border border-slate-900"
                      >
                        ←
                      </button>
                    )}
                    {index < appState.photos.length - 1 && (
                      <button
                        onClick={() => movePhoto(index, 'down')}
                        className="px-1.5 py-0.5 bg-slate-900 text-white text-[9px] font-bold rounded border border-slate-900"
                      >
                        →
                      </button>
                    )}
                  </div>
                )}
              </PolaroidFrame>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 text-center text-xs text-amber-800 font-medium mb-6">
          💡 Tip: Upload short videos or photos! AI will generate beat-synced storyboards for Reels & Shorts!
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onUpdateState({ step: 3 })}
          className="bg-white text-slate-900 font-bold py-3 px-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          onClick={() => onUpdateState({ step: 5 })}
          className="flex-1 bg-[#F0509B] text-white font-display text-lg py-3.5 px-6 rounded-xl border-2 border-slate-900 shadow-hard-yellow hover:bg-[#e03d88] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Next: Brief Prompt</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
