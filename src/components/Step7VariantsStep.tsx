import React, { useState, useEffect } from 'react';
import { AppState, GeneratedPost } from '../types';
import { StickerBadge, WashiTape } from './DesignElements';
import { TemplateRenderer } from './TemplateRenderer';
import { BUILTIN_TEMPLATE_LIBRARY, TemplateItem } from '../utils/templates';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  RefreshCw,
  Info,
  Copy,
  ThumbsUp,
} from 'lucide-react';

interface Step7VariantsProps {
  appState: AppState;
  onUpdateState: (updates: Partial<AppState>) => void;
}

export interface PostVariant {
  id: string;
  name: string;
  photoOrder: string[];
  swatchIndex: number;
  title: string;
  subtitle: string;
  caption: string;
  hashtags: string[];
  whyItWorks: string;
  stickerSet: string[];
}

export const Step7VariantsStep: React.FC<Step7VariantsProps> = ({
  appState,
  onUpdateState,
}) => {
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<PostVariant[]>([]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const selectedTemplate: TemplateItem =
    appState.selectedTemplate
      ? (BUILTIN_TEMPLATE_LIBRARY.find((t) => t.id === appState.selectedTemplate?.id) || BUILTIN_TEMPLATE_LIBRARY[0])
      : BUILTIN_TEMPLATE_LIBRARY[0];

  const basePhotos = appState.photos.map((p) => p.url);

  useEffect(() => {
    generate4Variants();
  }, []);

  const generate4Variants = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: appState.briefPrompt,
          postType: appState.postType,
          template: selectedTemplate,
          analysis: appState.briefAnalysis || {},
          format: appState.outputFormat,
          photos: basePhotos,
          age: appState.userAge,
          name: appState.userName,
          platforms: appState.selectedPlatforms,
        }),
      });

      const data = await response.json();
      const basePost: GeneratedPost = data.post || {};

      // Construct 4 distinct variants with shuffled photos, swatches, titles & tones
      const generatedVariants: PostVariant[] = [
        {
          id: 'v1',
          name: 'Variant 1: High Energy Pop',
          photoOrder: [...basePhotos],
          swatchIndex: 0,
          title: selectedTemplate.defaultTitle || 'GOLDEN MEMORIES ✨',
          subtitle: selectedTemplate.defaultSubtitle || 'Vibe & Sunshine',
          caption: basePost.caption || `Living my best life in ${appState.briefAnalysis?.location || 'the moment'}! ✨`,
          hashtags: basePost.hashtags || ['#PostCraft', '#InstagramVibes', '#Aesthetic', '#Trending'],
          whyItWorks: 'High-contrast palette draws immediate thumb-stop attention on social feeds.',
          stickerSet: ['✨ Sparkles', '🔥 Trending', '🤍 Memory'],
        },
        {
          id: 'v2',
          name: 'Variant 2: Minimal Chic',
          photoOrder: basePhotos.length > 1 ? [...basePhotos].reverse() : [...basePhotos],
          swatchIndex: 1 % selectedTemplate.swatches.length,
          title: `SUNDAY ${selectedTemplate.defaultTitle || 'DUMP'}`,
          subtitle: 'Unfiltered Moments',
          caption: basePost.altCaptions?.[0] || `A little bit of magic from today 📸`,
          hashtags: ['#PhotoDump', '#AestheticDaily', '#ContentCreator', '#Explore'],
          whyItWorks: 'Reversed photo sequence reveals a fresh storytelling angle for carousels.',
          stickerSet: ['📸 Photo Dump', '📌 Memory', '✨ Glow'],
        },
        {
          id: 'v3',
          name: 'Variant 3: Editorial Luxe',
          photoOrder: basePhotos.length > 2 ? [basePhotos[1], basePhotos[2], basePhotos[0]] : [...basePhotos],
          swatchIndex: (2 % selectedTemplate.swatches.length),
          title: selectedTemplate.defaultTitle ? selectedTemplate.defaultTitle.toUpperCase() : 'STORIES',
          subtitle: 'Curated Collection',
          caption: basePost.altCaptions?.[1] || `Keep it simple, keep it iconic 🤍`,
          hashtags: ['#Editorial', '#LuxeAesthetic', '#VibeCheck', '#Reels'],
          whyItWorks: 'Subtle warm tones and clean typography emphasize brand elegance.',
          stickerSet: ['🏷️ Label', '🤍 Vibe', '✨ Magic'],
        },
        {
          id: 'v4',
          name: 'Variant 4: Retro Scrapbook',
          photoOrder: [...basePhotos],
          swatchIndex: 0,
          title: `✨ ${selectedTemplate.defaultTitle || 'MEMORIES'}`,
          subtitle: 'Handcrafted Scrapbook',
          caption: basePost.altCaptions?.[2] || `Daily dose of warm sunshine & bright memories! ☀️`,
          hashtags: ['#Scrapbook', '#Y2KAesthetic', '#PostCraft', '#DailyVibe'],
          whyItWorks: 'Playful sticker combination drives higher comment engagement & shares.',
          stickerSet: ['📌 Tape', '🍒 Cherry', '🪩 Disco'],
        },
      ];

      setVariants(generatedVariants);
      setSelectedVariantIndex(0);
    } catch (error) {
      console.warn('Fallback variants generation triggered:', error);
      // Fallback 4 shuffled variants
      const fallbackVariants: PostVariant[] = [
        {
          id: 'v1',
          name: 'Variant 1: High Energy Pop',
          photoOrder: [...basePhotos],
          swatchIndex: 0,
          title: selectedTemplate.defaultTitle,
          subtitle: selectedTemplate.defaultSubtitle,
          caption: `Creating magic with PostCraft AI! ✨ ${appState.briefPrompt}`,
          hashtags: ['#PostCraft', '#Aesthetic', '#InstagramDaily'],
          whyItWorks: 'Bold layout with maximum color contrast.',
          stickerSet: ['✨ Sparkles', '🔥 Trending'],
        },
        {
          id: 'v2',
          name: 'Variant 2: Reversed Sequence',
          photoOrder: basePhotos.length > 1 ? [...basePhotos].reverse() : [...basePhotos],
          swatchIndex: 1 % selectedTemplate.swatches.length,
          title: `DAILY ${selectedTemplate.defaultTitle}`,
          subtitle: 'Unfiltered Highlights',
          caption: `A little bit of sunshine from today! ☀️`,
          hashtags: ['#PhotoDump', '#ContentCreator'],
          whyItWorks: 'Fresh photo focal point for higher carousel engagement.',
          stickerSet: ['📸 Snap', '📌 Memory'],
        },
        {
          id: 'v3',
          name: 'Variant 3: Minimal Vibe',
          photoOrder: [...basePhotos],
          swatchIndex: 0,
          title: selectedTemplate.defaultTitle.toUpperCase(),
          subtitle: 'Curated Edition',
          caption: `Keep it iconic, keep it real 🤍`,
          hashtags: ['#MinimalChic', '#PostCraft'],
          whyItWorks: 'Clean layout with focus on typography.',
          stickerSet: ['🤍 Vibe'],
        },
        {
          id: 'v4',
          name: 'Variant 4: Y2K Scrapbook',
          photoOrder: basePhotos.length > 2 ? [basePhotos[1], basePhotos[2], basePhotos[0]] : [...basePhotos],
          swatchIndex: 0,
          title: `✨ ${selectedTemplate.defaultTitle}`,
          subtitle: 'Retro Moments',
          caption: `Living for these everyday memories! 📸`,
          hashtags: ['#Scrapbook', '#Y2K'],
          whyItWorks: 'Playful sticker placement.',
          stickerSet: ['📌 Tape', '🍒 Cherry'],
        },
      ];

      setVariants(fallbackVariants);
      setSelectedVariantIndex(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePickVariant = (variant: PostVariant) => {
    // Update generated post and move to Post-Output Editor (Step 8)
    const updatedPost: GeneratedPost = {
      caption: variant.caption,
      altCaptions: [variant.caption],
      hashtags: variant.hashtags,
      musicMood: appState.generatedPost?.musicMood || {
        genre: 'Lo-Fi Chill',
        trackName: 'Sunny Afternoon',
        tempo: '88 BPM',
        vibe: 'Warm',
      },
      overlayText: variant.title,
      stickerSuggestions: variant.stickerSet,
      filterRecommendation: 'Warm Vintage',
    };

    onUpdateState({
      generatedPost: updatedPost,
      customOverlayText: variant.title,
      step: 8, // Move to Post-Output Editor (Step 8)
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <StickerBadge text="Step 7 of 9 — 4 Output Variants" color="yellow" rotate={-1} className="mb-2" />
        <h2 className="font-display text-2xl sm:text-3xl text-slate-900 leading-tight">
          Choose Your Favorite Variant, <span className="text-[#F0509B]">{appState.userName}</span> ✨
        </h2>
        <p className="font-handwriting text-base text-slate-600 font-bold mt-1">
          We generated 4 unique post variations with different photo orders, swatches & tones
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border-3 border-slate-900 p-12 text-center shadow-hard flex flex-col items-center justify-center my-8">
          <Sparkles className="w-10 h-10 animate-spin text-[#F0509B] mb-3" />
          <h3 className="font-display text-xl text-slate-900">Crafting 4 Post Variants...</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Gemini is tweaking photo order, crop, color swatches & captions!
          </p>
        </div>
      ) : (
        <>
          {/* 2x2 Grid of Variants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {variants.map((v, idx) => {
              const isSelected = selectedVariantIndex === idx;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`bg-white rounded-2xl border-3 border-slate-900 p-4 text-left cursor-pointer transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'ring-4 ring-[#F0509B] shadow-hard-pink scale-101 z-10'
                      : 'shadow-hard hover:scale-100 hover:z-10'
                  }`}
                >
                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#F7C948] border-2 border-slate-900 flex items-center justify-center text-slate-900 font-black z-20 shadow-md">
                      ✓
                    </div>
                  )}

                  {/* Header Badge */}
                  <div className="mb-2 flex items-center justify-between">
                    <span className="bg-amber-100 text-slate-900 border border-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                      {v.name}
                    </span>
                  </div>

                  {/* Live Render Preview */}
                  <div className="w-full aspect-[4/5] rounded-xl overflow-hidden mb-3 border border-slate-200">
                    <TemplateRenderer
                      template={selectedTemplate}
                      photos={v.photoOrder}
                      title={v.title}
                      subtitle={v.subtitle}
                      swatch={selectedTemplate.swatches[v.swatchIndex]}
                    />
                  </div>

                  {/* Caption & Why This Works */}
                  <div className="space-y-1.5 text-xs">
                    <p className="font-handwriting font-bold text-slate-900 line-clamp-2">
                      "{v.caption}"
                    </p>

                    <div className="bg-[#FFF8EC] p-2 rounded-lg border border-slate-900/20 text-[11px] text-slate-700 font-medium">
                      <span className="font-bold text-[#F0509B] block">💡 Why this works:</span>
                      {v.whyItWorks}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePickVariant(v);
                      }}
                      className="w-full mt-2 bg-[#F0509B] text-white font-display text-sm py-2 px-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-[#e03d88] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Pick This One!
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Regeneration & Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={() => generate4Variants()}
              className="bg-[#F7C948] text-slate-900 font-display py-3 px-5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-amber-400 flex items-center justify-center gap-1.5 cursor-pointer text-sm"
            >
              <RefreshCw className="w-4 h-4" /> Generate 4 More
            </button>

            <button
              onClick={() => onUpdateState({ step: 6 })}
              className="bg-white text-slate-900 font-display py-3 px-5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-slate-100 flex items-center justify-center gap-1.5 cursor-pointer text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Templates
            </button>
          </div>
        </>
      )}
    </div>
  );
};
