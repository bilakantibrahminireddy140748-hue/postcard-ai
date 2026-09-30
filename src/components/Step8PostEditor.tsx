import React, { useState } from 'react';
import { AppState, FilterStyle, StickerOverlay } from '../types';
import { StickerBadge, WashiTape } from './DesignElements';
import { BUILTIN_TEMPLATE_LIBRARY, TemplateItem } from '../utils/templates';
import { TemplateRenderer } from './TemplateRenderer';
import { DraggableStickerCanvas } from './DraggableStickerCanvas';
import { playStickerPopSound } from '../utils/audio';
import {
  Crop,
  Smile,
  Type,
  Plus,
  Trash2,
  Copy,
  Undo,
  Redo,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  ZoomIn,
} from 'lucide-react';

interface Step8EditorProps {
  appState: AppState;
  onUpdateState: (updates: Partial<AppState>) => void;
}

interface StickerArt {
  id: string;
  pack: 'scrapbook' | 'genz' | 'professional';
  name: string;
  content: string;
  type: StickerOverlay['type'];
  dieCut: boolean;
}

const DIE_CUT_STICKER_PACKS: StickerArt[] = [
  // Scrapbook Pack
  { id: 's_paperclip', pack: 'scrapbook', name: 'Paper Clip', content: '📌', type: 'emoji', dieCut: true },
  { id: 's_tape', pack: 'scrapbook', name: 'Washi Tape', content: '🏷️ TAPE', type: 'badge', dieCut: true },
  { id: 's_stamp', pack: 'scrapbook', name: 'Stamp', content: '💌 STAMP', type: 'badge', dieCut: true },
  { id: 's_pushpin', pack: 'scrapbook', name: 'Push Pin', content: '📍 PIN', type: 'badge', dieCut: true },
  { id: 's_bow', pack: 'scrapbook', name: 'Yarn Bow', content: '🎀', type: 'emoji', dieCut: true },
  { id: 's_stitch', pack: 'scrapbook', name: 'Stitched Line', content: '❌ STITCH', type: 'badge', dieCut: true },

  // Gen-Z Fun Pack
  { id: 's_cherry', pack: 'genz', name: 'Cherry', content: '🍒', type: 'emoji', dieCut: true },
  { id: 's_discoball', pack: 'genz', name: 'Disco Ball', content: '🪩', type: 'emoji', dieCut: true },
  { id: 's_sparkle', pack: 'genz', name: 'Sparkles', content: '✨', type: 'emoji', dieCut: true },
  { id: 's_fire', pack: 'genz', name: 'Fire', content: '🔥 TRENDING', type: 'badge', dieCut: true },
  { id: 's_star', pack: 'genz', name: 'Star Doodle', content: '⭐ STAR', type: 'badge', dieCut: true },
  { id: 's_heart', pack: 'genz', name: 'Heart', content: '❤️', type: 'emoji', dieCut: true },
  { id: 's_lightning', pack: 'genz', name: 'Lightning', content: '⚡ ICONIC', type: 'badge', dieCut: true },

  // Professional Pack
  { id: 's_verified', pack: 'professional', name: 'Verified', content: '☑️ VERIFIED', type: 'badge', dieCut: true },
  { id: 's_nobs', pack: 'professional', name: 'NO BS POST', content: '🏷️ NO BS POST', type: 'badge', dieCut: true },
  { id: 's_quote', pack: 'professional', name: 'Quote Mark', content: '“ ” QUOTE', type: 'badge', dieCut: true },
  { id: 's_arrow', pack: 'professional', name: 'Arrow >>>', content: '⏩ >>>', type: 'badge', dieCut: true },
];

export const Step8PostEditor: React.FC<Step8EditorProps> = ({
  appState,
  onUpdateState,
}) => {
  const [activeTab, setActiveTab] = useState<'crop' | 'stickers' | 'text' | 'filters'>('stickers');
  const [selectedStickerPack, setSelectedStickerPack] = useState<'scrapbook' | 'genz' | 'professional'>('scrapbook');

  // Crop & Transform Controls
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '9:16' | '16:9'>('4:5');
  const [zoomScale, setZoomScale] = useState(1);
  const [rotationDeg, setRotationDeg] = useState(0);

  // Selected Sticker ID
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  // Editable Text State
  const [headlineText, setHeadlineText] = useState(
    appState.customOverlayText || appState.selectedTemplate?.defaultTitle || 'MEMORIES ✨'
  );
  const [captionText, setCaptionText] = useState(
    appState.generatedPost?.caption || 'Living for these everyday moments! 📸'
  );

  // History Stack for Undo / Redo
  const [history, setHistory] = useState<StickerOverlay[][]>([appState.overlayStickers]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const selectedTemplate: TemplateItem =
    appState.selectedTemplate
      ? (BUILTIN_TEMPLATE_LIBRARY.find((t) => t.id === appState.selectedTemplate?.id) || BUILTIN_TEMPLATE_LIBRARY[0])
      : BUILTIN_TEMPLATE_LIBRARY[0];

  const updateStickersWithHistory = (newStickers: StickerOverlay[]) => {
    const updatedHistory = [...history.slice(0, historyIdx + 1), newStickers];
    setHistory(updatedHistory);
    setHistoryIdx(updatedHistory.length - 1);
    onUpdateState({ overlayStickers: newStickers });
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prevIdx = historyIdx - 1;
      setHistoryIdx(prevIdx);
      onUpdateState({ overlayStickers: history[prevIdx] });
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      onUpdateState({ overlayStickers: history[nextIdx] });
    }
  };

  const handleAddSticker = (st: StickerArt) => {
    const newSticker: StickerOverlay = {
      id: `sticker_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: st.type,
      content: st.content,
      x: 35 + Math.floor(Math.random() * 30),
      y: 35 + Math.floor(Math.random() * 30),
      rotation: Math.floor(Math.random() * 20) - 10,
      scale: 1,
      zIndex: appState.overlayStickers.length + 10,
    };

    updateStickersWithHistory([...appState.overlayStickers, newSticker]);
    setSelectedStickerId(newSticker.id);
    playStickerPopSound();
  };

  const handleProceedToPreview = () => {
    if (appState.generatedPost) {
      onUpdateState({
        generatedPost: {
          ...appState.generatedPost,
          caption: captionText,
          overlayText: headlineText,
        },
        customOverlayText: headlineText,
        step: 9,
      });
    } else {
      onUpdateState({ step: 9 });
    }
  };

  const filteredStickerPack = DIE_CUT_STICKER_PACKS.filter((s) => s.pack === selectedStickerPack);

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <StickerBadge text="Step 8 of 9 — Post-Output Editor" color="pink" rotate={-1} className="mb-2" />
        <h2 className="font-display text-2xl sm:text-3xl text-slate-900 leading-tight">
          Post-Output Studio Editor, <span className="text-[#F0509B]">{appState.userName}</span> ✂️
        </h2>
        <p className="font-handwriting text-base text-slate-600 font-bold mt-1">
          Pointer Events draggable stickers, undo/redo history, crop & text customizer
        </p>
      </div>

      {/* Undo / Redo Control Bar */}
      <div className="flex justify-end gap-2 mb-2">
        <button
          onClick={handleUndo}
          disabled={historyIdx <= 0}
          className="bg-white border-2 border-slate-900 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs disabled:opacity-40 cursor-pointer"
          title="Undo sticker action"
        >
          <Undo className="w-3.5 h-3.5" /> Undo
        </button>
        <button
          onClick={handleRedo}
          disabled={historyIdx >= history.length - 1}
          className="bg-white border-2 border-slate-900 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs disabled:opacity-40 cursor-pointer"
          title="Redo sticker action"
        >
          <Redo className="w-3.5 h-3.5" /> Redo
        </button>
      </div>

      {/* Main Studio Canvas Preview with Pointer Events Draggable Stickers */}
      <div className="max-w-sm mx-auto bg-white rounded-2xl border-3 border-slate-900 shadow-hard-lg relative overflow-hidden mb-6 p-2">
        <WashiTape position="top-center" color="bg-amber-300" />

        <DraggableStickerCanvas
          stickers={appState.overlayStickers}
          selectedId={selectedStickerId}
          onSelectSticker={(id) => setSelectedStickerId(id)}
          onChangeStickers={(updated) => updateStickersWithHistory(updated)}
          className="w-full aspect-[4/5] rounded-xl overflow-hidden border-2 border-slate-900 relative"
        >
          <div
            style={{ transform: `scale(${zoomScale}) rotate(${rotationDeg}deg)` }}
            className="w-full h-full transition-transform duration-300"
          >
            <TemplateRenderer
              template={selectedTemplate}
              photos={appState.photos.map((p) => p.url)}
              title={headlineText}
              subtitle={selectedTemplate.defaultSubtitle}
            />
          </div>
        </DraggableStickerCanvas>
      </div>

      {/* Editor Controls Tabs */}
      <div className="bg-white rounded-2xl border-3 border-slate-900 p-5 shadow-hard mb-6">
        <div className="flex border-b-2 border-slate-900 pb-3 mb-4 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stickers')}
            className={`px-3 py-1.5 rounded-xl font-display text-xs flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
              activeTab === 'stickers'
                ? 'bg-[#F7C948] border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]'
                : 'bg-slate-100 border-slate-300 hover:border-slate-800'
            }`}
          >
            <Smile className="w-4 h-4 text-[#F0509B]" /> Die-Cut Stickers
          </button>

          <button
            onClick={() => setActiveTab('crop')}
            className={`px-3 py-1.5 rounded-xl font-display text-xs flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
              activeTab === 'crop'
                ? 'bg-[#F7C948] border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]'
                : 'bg-slate-100 border-slate-300 hover:border-slate-800'
            }`}
          >
            <Crop className="w-4 h-4 text-[#00C49F]" /> Crop & Zoom
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1.5 rounded-xl font-display text-xs flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-[#F7C948] border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]'
                : 'bg-slate-100 border-slate-300 hover:border-slate-800'
            }`}
          >
            <Type className="w-4 h-4 text-[#FF5722]" /> Edit Text
          </button>
        </div>

        {/* Tab 1: Die-Cut Sticker Packs */}
        {activeTab === 'stickers' && (
          <div>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setSelectedStickerPack('scrapbook')}
                className={`text-xs font-bold px-3 py-1 rounded-full border-2 cursor-pointer ${
                  selectedStickerPack === 'scrapbook'
                    ? 'bg-[#F0509B] text-white border-slate-900'
                    : 'bg-slate-100 border-slate-300'
                }`}
              >
                📌 Scrapbook Pack
              </button>

              <button
                onClick={() => setSelectedStickerPack('genz')}
                className={`text-xs font-bold px-3 py-1 rounded-full border-2 cursor-pointer ${
                  selectedStickerPack === 'genz'
                    ? 'bg-[#F0509B] text-white border-slate-900'
                    : 'bg-slate-100 border-slate-300'
                }`}
              >
                🪩 Gen-Z Fun Pack
              </button>

              <button
                onClick={() => setSelectedStickerPack('professional')}
                className={`text-xs font-bold px-3 py-1 rounded-full border-2 cursor-pointer ${
                  selectedStickerPack === 'professional'
                    ? 'bg-[#6B0F1A] text-white border-slate-900'
                    : 'bg-slate-100 border-slate-300'
                }`}
              >
                🏷️ Pro Pack
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {filteredStickerPack.map((st) => (
                <button
                  key={st.id}
                  onClick={() => handleAddSticker(st)}
                  className="bg-white text-slate-900 border-2 border-slate-900 rounded-full px-3 py-1.5 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:scale-105 active:scale-95 transition-transform flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F0509B]" />
                  <span>{st.content}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Crop & Zoom Controls */}
        {activeTab === 'crop' && (
          <div className="space-y-4 text-xs">
            <div>
              <span className="font-bold text-slate-700 block mb-2">Aspect Ratio Presets:</span>
              <div className="flex gap-2">
                {(['1:1', '4:5', '9:16', '16:9'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1.5 rounded-xl border-2 font-bold transition-all cursor-pointer ${
                      aspectRatio === ratio
                        ? 'bg-[#F7C948] text-slate-900 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]'
                        : 'bg-slate-100 border-slate-300'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Zoom Scale</span>
                <span>{Math.round(zoomScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.8"
                step="0.05"
                value={zoomScale}
                onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                className="w-full accent-[#F0509B]"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Rotation Angle</span>
                <span>{rotationDeg}°</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                value={rotationDeg}
                onChange={(e) => setRotationDeg(parseInt(e.target.value, 10))}
                className="w-full accent-[#F0509B]"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Text Customizer */}
        {activeTab === 'text' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Headline Text Overlay</label>
              <input
                type="text"
                value={headlineText}
                onChange={(e) => setHeadlineText(e.target.value)}
                className="w-full bg-[#FFF8EC] border-2 border-slate-900 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Post Caption</label>
              <textarea
                rows={3}
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
                className="w-full bg-[#FFF8EC] border-2 border-slate-900 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Primary Proceed Button */}
      <div className="flex gap-3">
        <button
          onClick={() => onUpdateState({ step: 7 })}
          className="bg-white text-slate-900 font-bold py-3.5 px-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Variants
        </button>

        <button
          onClick={handleProceedToPreview}
          className="flex-1 bg-[#F0509B] text-white font-display text-lg py-4 px-6 rounded-2xl border-3 border-slate-900 shadow-hard-yellow hover:bg-[#e03d88] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
        >
          <span>Proceed to Live Platform Preview 👀</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
