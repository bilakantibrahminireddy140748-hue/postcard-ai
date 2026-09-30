import React, { useState, useRef } from 'react';
import { AppState, FilterStyle, StickerOverlay } from '../types';
import { StickerBadge, WashiTape } from './DesignElements';
import {
  Download,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Smile,
  Type,
  Music,
  Sliders,
  Send,
  Plus,
  Trash2,
} from 'lucide-react';

interface Step7Props {
  appState: AppState;
  onUpdateState: (updates: Partial<AppState>) => void;
  onRestart: () => void;
}

const STICKER_LIBRARY: { label: string; content: string; type: StickerOverlay['type'] }[] = [
  { label: 'Sparkles', content: '✨', type: 'emoji' },
  { label: 'Trending', content: '🔥 TRENDING', type: 'badge' },
  { label: 'Heart', content: '❤️', type: 'emoji' },
  { label: 'Location', content: '📍 Goa, India', type: 'location' },
  { label: 'Date', content: '📅 OCT 2026', type: 'date' },
  { label: 'Vibe', content: '⚡ ICONIC VIBE', type: 'badge' },
  { label: 'Camera', content: '📸 PHOTO DUMP', type: 'badge' },
  { label: 'Star', content: '⭐', type: 'emoji' },
  { label: 'Verified', content: '☑️ Official', type: 'badge' },
];

const FILTERS: { id: FilterStyle; name: string; class: string }[] = [
  { id: 'none', name: 'Original', class: '' },
  { id: 'warm', name: 'Warm Sun', class: 'sepia-[0.25] contrast-[1.1] brightness-[1.05]' },
  { id: 'vintage', name: 'Y2K Vintage', class: 'sepia-[0.4] hue-rotate-[-10deg] saturate-[1.2]' },
  { id: 'cinematic', name: 'Cinematic', class: 'contrast-[1.2] saturate-[0.8] brightness-[0.95]' },
  { id: 'bright', name: 'Pop Bright', class: 'saturate-[1.4] brightness-[1.1]' },
  { id: 'bw', name: 'B&W Classic', class: 'grayscale contrast-[1.2]' },
  { id: 'holographic', name: 'Pastel Holo', class: 'hue-rotate-[30deg] saturate-[1.3]' },
];

export const Step7Finalize: React.FC<Step7Props> = ({ appState, onUpdateState, onRestart }) => {
  const [activeTab, setActiveTab] = useState<'stickers' | 'filters' | 'text' | 'music'>('stickers');
  const [copied, setCopied] = useState(false);
  const [postedSuccess, setPostedSuccess] = useState(false);
  const [textOverlayInput, setTextOverlayInput] = useState(appState.customOverlayText || '');

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddSticker = (item: { content: string; type: StickerOverlay['type'] }) => {
    const newSticker: StickerOverlay = {
      id: `sticker_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: item.type,
      content: item.content,
      x: 30 + Math.floor(Math.random() * 40),
      y: 30 + Math.floor(Math.random() * 40),
      rotation: Math.floor(Math.random() * 20) - 10,
      scale: 1,
    };

    onUpdateState({
      overlayStickers: [...appState.overlayStickers, newSticker],
    });
  };

  const removeSticker = (id: string) => {
    onUpdateState({
      overlayStickers: appState.overlayStickers.filter((s) => s.id !== id),
    });
  };

  const handleDownload = () => {
    // Triggers a simulated download or image save notification
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(appState.generatedPost, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${appState.userName || 'postcraft'}_instagram_post.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setPostedSuccess(true);
    setTimeout(() => setPostedSuccess(false), 4000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PostCraft AI Studio Creation',
          text: appState.generatedPost?.caption || 'Check out my post crafted with PostCraft AI!',
          url: window.location.href,
        });
      } catch (e) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(appState.generatedPost?.caption || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activePhotoUrl =
    appState.photos.length > 0
      ? appState.photos[0].url
      : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';

  const filterClass = FILTERS.find((f) => f.id === appState.activeFilter)?.class || '';

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Step Header */}
      <div className="text-center mb-6">
        <StickerBadge text="Step 8 of 9 — Finalizing" color="pink" rotate={-1} className="mb-2" />
        <h2 className="font-display text-2xl sm:text-3xl text-slate-900 leading-tight">
          Ready to Post or Customize, <span className="text-[#F0509B]">{appState.userName}</span>? 🚀
        </h2>
        <p className="font-handwriting text-base text-slate-600 font-bold mt-1">
          Add stickers, filters, text overlays & music before publishing!
        </p>
      </div>

      {postedSuccess && (
        <div className="bg-[#00C49F] text-slate-900 border-2 border-slate-900 p-4 rounded-2xl mb-6 shadow-hard text-center font-display text-lg animate-bounce flex items-center justify-center gap-2">
          <span>🎉 Post Exported Successfully! Ready to upload to Instagram!</span>
        </div>
      )}

      {/* Main Interactive Studio Canvas Preview */}
      <div
        ref={canvasRef}
        className="w-full max-w-sm mx-auto aspect-square bg-[#FFF8EC] rounded-2xl border-3 border-slate-900 shadow-hard-lg relative overflow-hidden mb-6 group"
      >
        <WashiTape position="top-center" color="bg-amber-300" />

        {/* Filtered Base Photo */}
        <img
          src={activePhotoUrl}
          alt="Studio Output"
          className={`w-full h-full object-cover transition-all ${filterClass}`}
        />

        {/* Custom Text Overlay */}
        {textOverlayInput && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-display text-sm uppercase tracking-wider px-3 py-1 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] transform -rotate-1 pointer-events-none">
            {textOverlayInput}
          </div>
        )}

        {/* Render Added Interactive Stickers */}
        {appState.overlayStickers.map((st) => (
          <div
            key={st.id}
            style={{
              left: `${st.x}%`,
              top: `${st.y}%`,
              transform: `rotate(${st.rotation}deg) scale(${st.scale})`,
            }}
            className="absolute z-20 cursor-pointer group/sticker"
          >
            <div className="bg-[#F7C948] text-slate-900 font-bold text-xs px-2.5 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] flex items-center gap-1 hover:scale-110 transition-transform">
              <span>{st.content}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSticker(st.id);
                }}
                className="hidden group-hover/sticker:inline-block text-rose-700 hover:text-rose-900 font-black ml-1"
                title="Delete sticker"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Studio Add-Ons Toolbar Panel */}
      <div className="bg-white rounded-2xl border-3 border-slate-900 p-5 shadow-hard mb-6">
        {/* Toolbar Tabs */}
        <div className="flex border-b-2 border-slate-900 pb-3 mb-4 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stickers')}
            className={`px-3 py-1.5 rounded-xl font-display text-xs flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
              activeTab === 'stickers'
                ? 'bg-[#F7C948] border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]'
                : 'bg-slate-100 border-slate-300 hover:border-slate-800'
            }`}
          >
            <Smile className="w-4 h-4 text-[#F0509B]" /> Stickers
          </button>

          <button
            onClick={() => setActiveTab('filters')}
            className={`px-3 py-1.5 rounded-xl font-display text-xs flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
              activeTab === 'filters'
                ? 'bg-[#F7C948] border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]'
                : 'bg-slate-100 border-slate-300 hover:border-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#00C49F]" /> Filters
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1.5 rounded-xl font-display text-xs flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-[#F7C948] border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]'
                : 'bg-slate-100 border-slate-300 hover:border-slate-800'
            }`}
          >
            <Type className="w-4 h-4 text-[#FF5722]" /> Overlay Text
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`px-3 py-1.5 rounded-xl font-display text-xs flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
              activeTab === 'music'
                ? 'bg-[#F7C948] border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]'
                : 'bg-slate-100 border-slate-300 hover:border-slate-800'
            }`}
          >
            <Music className="w-4 h-4 text-[#9C27B0]" /> Music Mood
          </button>
        </div>

        {/* Tab 1: Stickers Tray */}
        {activeTab === 'stickers' && (
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Click a sticker badge to overlay on post graphic:
            </span>
            <div className="flex flex-wrap gap-2">
              {STICKER_LIBRARY.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddSticker(item)}
                  className="bg-[#FFF8EC] text-slate-900 border-2 border-slate-900 rounded-full px-3 py-1.5 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:scale-105 active:scale-95 transition-transform flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F0509B]" />
                  <span>{item.content}</span>
                </button>
              ))}
            </div>

            {appState.overlayStickers.length > 0 && (
              <div className="mt-3 text-[11px] text-slate-500 font-medium">
                Added {appState.overlayStickers.length} sticker(s). Hover over a sticker on graphic to remove.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Filters Strip */}
        {activeTab === 'filters' && (
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Choose an aesthetic filter style:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onUpdateState({ activeFilter: f.id })}
                  className={`flex-shrink-0 p-2 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    appState.activeFilter === f.id
                      ? 'bg-[#F0509B] text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]'
                      : 'bg-slate-100 border-slate-300 hover:border-slate-900 text-slate-800'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-amber-200 mb-1 mx-auto ${f.class}`} />
                  <span className="text-[10px] font-bold block">{f.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Text Overlay */}
        {activeTab === 'text' && (
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Custom Headline Text Overlay:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={textOverlayInput}
                onChange={(e) => {
                  setTextOverlayInput(e.target.value);
                  onUpdateState({ customOverlayText: e.target.value });
                }}
                placeholder="e.g. GOA DREAMS ✨"
                className="flex-1 bg-[#FFF8EC] border-2 border-slate-900 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none"
              />
              <button
                onClick={() => {
                  setTextOverlayInput('');
                  onUpdateState({ customOverlayText: '' });
                }}
                className="bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border-2 border-slate-900"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Music Mood */}
        {activeTab === 'music' && (
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Select Background BGM Mood for Video/Reel:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Golden Hour Acoustic',
                'Lo-Fi Study Beats',
                'Upbeat Summer Pop',
                'Cinematic Dreamy Waves',
              ].map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => onUpdateState({ selectedMusicMood: m })}
                  className={`p-2.5 rounded-xl border-2 text-xs font-bold text-left transition-all cursor-pointer ${
                    appState.selectedMusicMood === m
                      ? 'bg-[#F7C948] text-slate-900 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]'
                      : 'bg-slate-50 border-slate-300 hover:border-slate-800'
                  }`}
                >
                  <Music className="w-3.5 h-3.5 text-[#F0509B] mb-1 inline mr-1" />
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Publishing Action Buttons */}
      <div className="flex flex-col gap-3 mb-6">
        <button
          onClick={() => onUpdateState({ step: 9 })}
          className="w-full bg-[#F0509B] text-white font-display py-4 px-6 rounded-2xl border-3 border-slate-900 shadow-hard-yellow hover:bg-[#e03d88] flex items-center justify-center gap-2 cursor-pointer text-lg animate-pulse"
        >
          <Sparkles className="w-5 h-5 text-[#F7C948]" />
          <span>Next: Live Platform Preview 👀</span>
        </button>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={handleDownload}
            className="bg-white text-slate-900 font-bold py-2.5 px-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer text-xs"
          >
            <Download className="w-3.5 h-3.5" /> Export Post
          </button>

          <button
            onClick={handleShare}
            className="bg-white text-slate-900 font-bold py-2.5 px-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer text-xs"
          >
            <Share2 className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Share'}
          </button>

          <button
            onClick={() => onUpdateState({ step: 7 })}
            className="bg-white text-slate-900 font-bold py-2.5 px-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate
          </button>

          <button
            onClick={() => onUpdateState({ step: 6 })}
            className="bg-white text-slate-900 font-bold py-2.5 px-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer text-xs"
          >
            Try Template
          </button>
        </div>
      </div>

      {/* Restart Fresh Studio Session */}
      <div className="text-center">
        <button
          onClick={onRestart}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 underline cursor-pointer"
        >
          Create another social post project from scratch →
        </button>
      </div>
    </div>
  );
};
