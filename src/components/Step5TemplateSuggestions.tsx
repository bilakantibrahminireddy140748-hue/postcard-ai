import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { StickerBadge, WashiTape } from './DesignElements';
import { BUILTIN_TEMPLATE_LIBRARY, TemplateItem, PaletteSwatch } from '../utils/templates';
import { TemplateRenderer } from './TemplateRenderer';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Edit2,
  Palette,
  Shuffle,
  Info,
  Loader2,
  Grid,
} from 'lucide-react';

interface Step6Props {
  appState: AppState;
  onUpdateState: (updates: Partial<AppState>) => void;
}

export const Step5TemplateSuggestions: React.FC<Step6Props> = ({ appState, onUpdateState }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'casual' | 'professional'>('all');
  const [rankedTemplates, setTemplates] = useState<TemplateItem[]>(BUILTIN_TEMPLATE_LIBRARY);
  const [fallbackMessage, setFallbackMessage] = useState('');

  // Selected Template State
  const [selected, setSelected] = useState<TemplateItem>(
    appState.selectedTemplate
      ? (BUILTIN_TEMPLATE_LIBRARY.find((t) => t.id === appState.selectedTemplate?.id) || BUILTIN_TEMPLATE_LIBRARY[0])
      : BUILTIN_TEMPLATE_LIBRARY[0]
  );

  // Editable fields for selected template
  const [editedTitle, setEditedTitle] = useState(
    appState.selectedTemplate?.defaultTitle || selected.defaultTitle
  );
  const [editedSubtitle, setEditedSubtitle] = useState(
    appState.selectedTemplate?.defaultSubtitle || selected.defaultSubtitle
  );
  const [activeSwatchIndex, setActiveSwatchIndex] = useState(0);

  // Photo order state for swapping photo slots
  const [photoOrder, setPhotoOrder] = useState<string[]>(
    appState.photos.map((p) => p.url)
  );

  useEffect(() => {
    rankTemplatesWithGemini();
  }, []);

  const rankTemplatesWithGemini = async () => {
    setLoading(true);
    setFallbackMessage('');

    try {
      const isProfessionalType = appState.postType.toLowerCase().includes('professional') || appState.postType.toLowerCase().includes('business');

      const response = await fetch('/api/suggest-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postType: appState.postType,
          analysis: appState.briefAnalysis || {},
          format: appState.outputFormat,
          platforms: appState.selectedPlatforms,
          photoCount: appState.photos.length,
        }),
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.templates) && data.templates.length > 0) {
        // Merge AI custom texts into builtin templates
        const aiMapped = BUILTIN_TEMPLATE_LIBRARY.map((builtin) => {
          const aiMatch = data.templates.find((ai: any) => ai.id === builtin.id || ai.name === builtin.name);
          if (aiMatch) {
            return {
              ...builtin,
              defaultTitle: aiMatch.title || builtin.defaultTitle,
              defaultSubtitle: aiMatch.subtitle || builtin.defaultSubtitle,
              defaultCaption: aiMatch.caption || builtin.defaultCaption,
            };
          }
          return builtin;
        });

        // Re-sort: put matching category first
        const sorted = [...aiMapped].sort((a, b) => {
          if (isProfessionalType) {
            return a.category === 'professional' ? -1 : 1;
          }
          return a.category === 'casual' ? -1 : 1;
        });

        setTemplates(sorted);
        setSelected(sorted[0]);
        setEditedTitle(sorted[0].defaultTitle);
        setEditedSubtitle(sorted[0].defaultSubtitle);
      } else {
        throw new Error('Fallback required');
      }
    } catch (e) {
      console.warn('Gemini template ranking fallback triggered:', e);
      setFallbackMessage("Couldn't personalise with AI, showing all templates!");
      const isProfessionalType = appState.postType.toLowerCase().includes('professional') || appState.postType.toLowerCase().includes('business');

      const sorted = [...BUILTIN_TEMPLATE_LIBRARY].sort((a, b) => {
        if (isProfessionalType) {
          return a.category === 'professional' ? -1 : 1;
        }
        return a.category === 'casual' ? -1 : 1;
      });

      setTemplates(sorted);
      setSelected(sorted[0]);
      setEditedTitle(sorted[0].defaultTitle);
      setEditedSubtitle(sorted[0].defaultSubtitle);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (temp: TemplateItem) => {
    setSelected(temp);
    setEditedTitle(temp.defaultTitle);
    setEditedSubtitle(temp.defaultSubtitle);
    setActiveSwatchIndex(0);

    onUpdateState({
      selectedTemplate: temp as any,
    });
  };

  const handleNextStep = () => {
    const updatedTemplate = {
      ...selected,
      defaultTitle: editedTitle,
      defaultSubtitle: editedSubtitle,
    };

    onUpdateState({
      selectedTemplate: updatedTemplate as any,
      step: 7, // Proceed to Variants Step (Step 7)
    });
  };

  // Filter templates by tab
  const filteredTemplates = rankedTemplates.filter((t) => {
    if (activeTab === 'casual') return t.category === 'casual';
    if (activeTab === 'professional') return t.category === 'professional';
    return true;
  });

  const recommendedTemplates = rankedTemplates.slice(0, 4);

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <StickerBadge text="Step 6 of 9 — Templates" color="purple" rotate={-2} className="mb-2" />
        <h2 className="font-display text-2xl sm:text-3xl text-slate-900 leading-tight">
          Select & Customize Template, <span className="text-[#F0509B]">{appState.userName}</span> 🎨
        </h2>
        <p className="font-handwriting text-base text-slate-600 font-bold mt-1">
          Pick a scrapbook layout from our built-in library & edit text/colors!
        </p>
      </div>

      {fallbackMessage && (
        <div className="bg-amber-100 text-slate-900 border-2 border-slate-900 p-2.5 rounded-xl mb-4 text-xs font-bold text-center shadow-xs flex items-center justify-center gap-1.5">
          <Info className="w-4 h-4 text-[#F0509B]" />
          <span>{fallbackMessage}</span>
        </div>
      )}

      {/* Recommended Section Header */}
      <div className="mb-4">
        <h3 className="font-display text-sm text-slate-900 flex items-center gap-1.5 uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-[#F0509B]" /> Recommended for You
        </h3>

        {/* Top 4 Recommended Cards Carousel */}
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none">
          {recommendedTemplates.map((temp) => {
            const isSelected = selected.id === temp.id;
            return (
              <button
                key={temp.id}
                onClick={() => handleSelectTemplate(temp)}
                className={`flex-shrink-0 w-36 bg-white rounded-2xl border-2 p-2 text-left transition-all relative cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 ring-4 ring-[#F0509B] scale-102 shadow-hard'
                    : 'border-slate-300 hover:border-slate-900'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#F7C948] border border-slate-900 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                )}
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden mb-1.5 border border-slate-200">
                  <TemplateRenderer
                    template={temp}
                    photos={photoOrder}
                    title={temp.defaultTitle}
                    subtitle={temp.defaultSubtitle}
                  />
                </div>
                <h4 className="font-display text-[11px] text-slate-900 truncate">{temp.name}</h4>
                <span className="text-[9px] font-bold uppercase text-[#F0509B]">{temp.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs: All / Casual / Professional */}
      <div className="flex border-b-2 border-slate-900 pb-2 mb-4 gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl font-display text-xs border-2 transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#F7C948] text-slate-900 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800'
          }`}
        >
          All ({rankedTemplates.length})
        </button>

        <button
          onClick={() => setActiveTab('casual')}
          className={`px-3 py-1.5 rounded-xl font-display text-xs border-2 transition-all cursor-pointer ${
            activeTab === 'casual'
              ? 'bg-[#F0509B] text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800'
          }`}
        >
          Casual & Aesthetic (9)
        </button>

        <button
          onClick={() => setActiveTab('professional')}
          className={`px-3 py-1.5 rounded-xl font-display text-xs border-2 transition-all cursor-pointer ${
            activeTab === 'professional'
              ? 'bg-[#6B0F1A] text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800'
          }`}
        >
          Professional (4)
        </button>
      </div>

      {/* Selected Template Customizer Section */}
      <div className="bg-white rounded-2xl border-3 border-slate-900 p-5 shadow-hard mb-6 relative">
        <WashiTape position="top-right" color="bg-amber-300" />

        <div className="flex flex-col sm:flex-row gap-5 items-center">
          {/* Live Preview Render */}
          <div className="w-full sm:w-64 flex-shrink-0">
            <TemplateRenderer
              template={selected}
              photos={photoOrder}
              title={editedTitle}
              subtitle={editedSubtitle}
              swatch={selected.swatches[activeSwatchIndex]}
            />
          </div>

          {/* Quick Customizer Controls */}
          <div className="flex-1 w-full space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-display text-base text-slate-900">{selected.name}</h3>
              <span className="bg-amber-100 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-slate-900">
                {selected.category}
              </span>
            </div>

            {/* Editable Title */}
            <div>
              <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Edit2 className="w-3.5 h-3.5 text-[#F0509B]" /> Headline Title
              </label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full bg-[#FFF8EC] border-2 border-slate-900 rounded-xl p-2 font-bold text-slate-900 focus:outline-none"
              />
            </div>

            {/* Editable Subtitle */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Subtitle Line</label>
              <input
                type="text"
                value={editedSubtitle}
                onChange={(e) => setEditedSubtitle(e.target.value)}
                className="w-full bg-[#FFF8EC] border-2 border-slate-900 rounded-xl p-2 font-bold text-slate-900 focus:outline-none"
              />
            </div>

            {/* Color Palette Preset Swatches */}
            {selected.swatches && selected.swatches.length > 0 && (
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-[#00C49F]" /> Swatch Color Theme
                </label>
                <div className="flex gap-2">
                  {selected.swatches.map((swatch, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => setActiveSwatchIndex(sIdx)}
                      className={`p-1.5 rounded-lg border-2 text-[10px] font-bold flex items-center gap-1.5 transition-transform cursor-pointer ${
                        activeSwatchIndex === sIdx
                          ? 'bg-[#F7C948] text-slate-900 border-slate-900 ring-2 ring-[#F0509B]'
                          : 'bg-slate-100 border-slate-300'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full ${swatch.bgTop} border border-slate-900`} />
                      <span>{swatch.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Swap Photos Order Button */}
            {appState.photos.length > 1 && (
              <div>
                <button
                  onClick={() => {
                    const shuffled = [...photoOrder].reverse();
                    setPhotoOrder(shuffled);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-900 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5 text-[#F0509B]" /> Swap Photo Slots
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Template Gallery Grid */}
      <div className="mb-6">
        <h3 className="font-display text-sm text-slate-900 uppercase tracking-wider mb-3">
          Full Built-in Template Gallery ({filteredTemplates.length})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredTemplates.map((temp) => {
            const isSelected = selected.id === temp.id;
            return (
              <div
                key={temp.id}
                onClick={() => handleSelectTemplate(temp)}
                className={`bg-white rounded-2xl border-2 p-2.5 cursor-pointer transition-all relative ${
                  isSelected
                    ? 'border-slate-900 ring-4 ring-[#F0509B] shadow-hard scale-102 z-10'
                    : 'border-slate-300 hover:border-slate-900 hover:scale-101'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#F7C948] border-2 border-slate-900 flex items-center justify-center text-slate-900 font-bold z-20">
                    ✓
                  </div>
                )}
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden mb-2 border border-slate-200">
                  <TemplateRenderer
                    template={temp}
                    photos={photoOrder}
                    title={temp.defaultTitle}
                    subtitle={temp.defaultSubtitle}
                  />
                </div>
                <h4 className="font-display text-xs text-slate-900 truncate">{temp.name}</h4>
                <p className="text-[10px] text-slate-500 font-medium truncate">{temp.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onUpdateState({ step: 5 })}
          className="bg-white text-slate-900 font-bold py-3 px-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          onClick={handleNextStep}
          className="flex-1 bg-[#F0509B] text-white font-display text-lg py-3.5 px-6 rounded-xl border-2 border-slate-900 shadow-hard-yellow hover:bg-[#e03d88] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Next: 4 Output Options</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
