import React from 'react';
import { TemplateItem, PaletteSwatch } from '../utils/templates';

interface TemplateRendererProps {
  template: TemplateItem;
  photos: string[]; // array of photo URLs
  title?: string;
  subtitle?: string;
  swatch?: PaletteSwatch;
  interactive?: boolean;
  className?: string;
  customOverlayText?: string;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  template,
  photos = [],
  title,
  subtitle,
  swatch,
  className = '',
}) => {
  // Safe photo slot resolver: if user provided fewer photos than template slots, reuse or fallback!
  const defaultFallbackPhoto =
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';

  const getPhoto = (index: number) => {
    if (photos.length === 0) return defaultFallbackPhoto;
    return photos[index % photos.length] || photos[0] || defaultFallbackPhoto;
  };

  const displayTitle = title || template.defaultTitle;
  const displaySubtitle = subtitle || template.defaultSubtitle;
  const activeSwatch = swatch || template.swatches[0];

  // Helper to split a word for Template 8 (Bye Month Grid)
  const splitTitleIntoGrid = (text: string, count: number = 4) => {
    const parts = text.split(/[\s\/]+/);
    if (parts.length >= count) return parts.slice(0, count);
    const chars = text.replace(/[\s\/]+/g, '');
    const chunkSize = Math.ceil(chars.length / count);
    const result: string[] = [];
    for (let i = 0; i < chars.length; i += chunkSize) {
      result.push(chars.slice(i, i + chunkSize));
    }
    while (result.length < count) {
      result.push('✨');
    }
    return result;
  };

  return (
    <div className={`w-full aspect-[4/5] relative overflow-hidden rounded-xl border-3 border-slate-900 shadow-hard select-none font-sans ${className}`}>
      {/* 1. SCRAPBOOK COLLAGE */}
      {template.id === 'temp_scrapbook_collage' && (
        <div className="w-full h-full flex flex-col relative bg-[#FFF8EC]">
          {/* Top Half */}
          <div className="h-1/2 w-full p-3 relative bg-[#FFF8EC] bg-grid-paper flex items-center justify-center">
            {/* Tilted Photo 1 */}
            <div className="w-28 h-28 bg-white p-1.5 rounded border-2 border-slate-900 shadow-md transform -rotate-6 z-10 hover:scale-105 transition-transform">
              <img src={getPhoto(0)} alt="" className="w-full h-full object-cover rounded" />
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs">📌</div>
            </div>
          </div>

          {/* Stitched Split Line */}
          <div className="w-full border-b-2 border-dashed border-red-600 relative z-20">
            <span className="absolute right-2 -top-2.5 text-xs text-red-600 font-mono font-bold">❌ ❌ ❌</span>
          </div>

          {/* Bottom Half */}
          <div className="h-1/2 w-full p-3 relative bg-[#8B0000] text-white flex items-end justify-between overflow-hidden">
            {/* Tilted Photo 2 */}
            <div className="w-24 h-24 bg-white p-1 rounded border-2 border-slate-900 shadow-md transform rotate-6 z-10">
              <img src={getPhoto(1)} alt="" className="w-full h-full object-cover rounded" />
              <span className="absolute -bottom-2 -right-2 text-base">🍒</span>
            </div>

            {/* Tilted Photo 3 */}
            <div className="w-20 h-20 bg-white p-1 rounded border-2 border-slate-900 shadow-md transform -rotate-12 z-10">
              <img src={getPhoto(2)} alt="" className="w-full h-full object-cover rounded" />
              <span className="absolute -top-2 -right-2 text-base">🪩</span>
            </div>

            {/* Bottom Title Box */}
            <div className="absolute top-3 right-3 bg-[#F7C948] text-slate-900 px-3 py-1 rounded-lg border-2 border-slate-900 font-display text-xs z-20 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] transform -rotate-2">
              {displayTitle}
            </div>
          </div>
        </div>
      )}

      {/* 2. TRAVEL DIARY */}
      {template.id === 'temp_travel_diary' && (
        <div className="w-full h-full relative bg-slate-900 text-slate-900 overflow-hidden">
          {/* Full-bleed background photo */}
          <img src={getPhoto(0)} alt="" className="w-full h-full object-cover opacity-60 blur-[1px]" />

          {/* Postcard Stack Container */}
          <div className="absolute inset-4 bg-white/95 rounded-2xl border-2 border-slate-900 p-3 shadow-hard flex flex-col justify-between">
            {/* Header Lined Paper Note */}
            <div className="bg-amber-100 p-2 rounded-lg border-2 border-slate-900 relative shadow-sm transform -rotate-1">
              <div className="absolute -top-3 left-4 text-sm pointer-events-none">📌</div>
              <h3 className="font-handwriting text-lg font-bold text-slate-900 leading-tight">{displayTitle}</h3>
              <p className="font-sans text-[10px] text-slate-600 font-medium">{displaySubtitle}</p>
            </div>

            {/* Foreground Main Photo Frame */}
            <div className="w-full aspect-[4/3] bg-slate-100 rounded-xl border-2 border-slate-900 overflow-hidden shadow-md my-2">
              <img src={getPhoto(0)} alt="" className="w-full h-full object-cover" />
            </div>

            {/* Torn Paper Bottom Edge */}
            <div className="w-full bg-[#FFF8EC] border-t-2 border-slate-900 p-2 rounded-b-xl flex items-center justify-between text-[10px] font-bold">
              <span>✈️ WANDERLUST</span>
              <span className="font-mono text-slate-500">VOL. 01</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. PHOTO DUMP STACK */}
      {template.id === 'temp_photo_dump_stack' && (
        <div className="w-full h-full bg-white p-2 flex flex-col justify-between relative">
          <div className="w-full h-[47%] rounded-xl overflow-hidden border-2 border-slate-900 shadow-sm relative">
            <img src={getPhoto(0)} alt="" className="w-full h-full object-cover" />
          </div>

          {/* Center Caption Pill */}
          <div className="w-fit mx-auto bg-[#F7C948] text-slate-900 px-3 py-1 rounded-full border-2 border-slate-900 font-display text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] z-10 transform -rotate-1 my-1">
            {displayTitle}
          </div>

          <div className="w-full h-[47%] rounded-xl overflow-hidden border-2 border-slate-900 shadow-sm relative">
            <img src={getPhoto(1)} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* 4. FILM FRAME */}
      {template.id === 'temp_film_frame' && (
        <div className="w-full h-full bg-slate-900 p-3 relative text-white flex flex-col justify-between overflow-hidden">
          {/* Main Photo with Red Stitched Border */}
          <div className="w-full h-[65%] bg-slate-800 rounded-xl border-2 border-dashed border-red-600 p-1 relative shadow-md">
            <img src={getPhoto(0)} alt="" className="w-full h-full object-cover rounded-lg" />
            <div className="absolute top-2 left-2 text-xl">🎀</div>
            <div className="absolute bottom-2 right-2 text-base">❄️</div>
          </div>

          {/* Film Strip Overlap */}
          <div className="w-full h-[30%] bg-black rounded-xl border-2 border-slate-700 p-1.5 flex gap-1 items-center overflow-hidden">
            <div className="w-1/2 h-full rounded border border-slate-700 overflow-hidden">
              <img src={getPhoto(1)} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-1/2 h-full rounded border border-slate-700 overflow-hidden">
              <img src={getPhoto(2)} alt="" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Overlay Title */}
          <div className="absolute top-4 right-4 bg-red-600 text-white font-display text-[10px] uppercase px-2 py-0.5 rounded border border-white">
            {displayTitle}
          </div>
        </div>
      )}

      {/* 5. POLAROID OVERLAY */}
      {template.id === 'temp_polaroid_overlay' && (
        <div className="w-full h-full relative bg-slate-900">
          <img src={getPhoto(0)} alt="" className="w-full h-full object-cover opacity-80" />

          {/* Cream Polaroid Frame */}
          <div className="absolute inset-5 bg-[#FFF8EC] p-3 pb-8 rounded-xl border-2 border-slate-900 shadow-hard flex flex-col justify-between">
            <div className="w-full h-4/5 bg-slate-200 rounded border border-slate-400 overflow-hidden">
              <img src={getPhoto(0)} alt="" className="w-full h-full object-cover" />
            </div>
            <p className="font-handwriting text-center font-bold text-slate-900 text-base mt-2">
              {displayTitle}
            </p>
          </div>

          {/* Corner Mini Polaroid */}
          <div className="absolute bottom-3 right-3 w-24 h-24 bg-white p-1 pb-4 rounded border-2 border-slate-900 shadow-lg transform rotate-12">
            <img src={getPhoto(1)} alt="" className="w-full h-full object-cover rounded" />
          </div>
        </div>
      )}

      {/* 6. SCENIC MINIMAL */}
      {template.id === 'temp_scenic_minimal' && (
        <div className="w-full h-full bg-white p-4 flex flex-col items-center justify-between border-4 border-slate-100 shadow-inner">
          <div className="w-full flex-1 bg-slate-100 rounded-xl border-2 border-slate-300 overflow-hidden mb-3">
            <img src={getPhoto(0)} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="text-center">
            <h3 className="font-serif-display text-sm font-bold tracking-widest text-slate-900 uppercase">
              {displayTitle}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider mt-0.5">{displaySubtitle}</p>
          </div>
        </div>
      )}

      {/* 7. LIFE LATELY */}
      {template.id === 'temp_life_lately' && (
        <div className="w-full h-full relative bg-slate-900 text-white">
          <img src={getPhoto(0)} alt="" className="w-full h-full object-cover opacity-75" />

          <div className="absolute top-4 left-4 right-4">
            <h2 className="font-handwriting text-3xl font-bold text-[#F7C948] drop-shadow-md">
              {displayTitle}
            </h2>
          </div>

          <div className="absolute bottom-4 right-4 text-right bg-slate-900/80 px-3 py-1 rounded-lg border border-white/20 backdrop-blur-xs">
            <p className="font-sans text-xs font-bold text-white">{displaySubtitle}</p>
          </div>
        </div>
      )}

      {/* 8. BYE MONTH GRID */}
      {template.id === 'temp_bye_month_grid' && (
        <div className="w-full h-full bg-slate-900 grid grid-cols-2 grid-rows-3 gap-0.5 relative">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="w-full h-full relative overflow-hidden">
              <img src={getPhoto(idx)} alt="" className="w-full h-full object-cover" />
            </div>
          ))}

          {/* Huge Split Text Overlay */}
          <div className="absolute inset-0 z-20 pointer-events-none grid grid-cols-2 grid-rows-3 p-2">
            {splitTitleIntoGrid(displayTitle, 6).map((chunk, cIdx) => (
              <div key={cIdx} className="flex items-center justify-center">
                <span className="font-display text-2xl text-[#F7C948] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.9)] uppercase tracking-wider">
                  {chunk}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. MONTHLY RECAP ALBUM */}
      {template.id === 'temp_monthly_recap_album' && (
        <div className="w-full h-full bg-[#FFF8EC] p-2 flex flex-col justify-between">
          {/* Top Hero Photo */}
          <div className="w-full h-1/2 bg-slate-200 rounded-xl border-2 border-slate-900 overflow-hidden relative shadow-sm">
            <img src={getPhoto(0)} alt="" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-[#F0509B] text-white px-2.5 py-0.5 rounded-full border border-slate-900 text-xs font-display">
              {displayTitle}
            </div>
          </div>

          {/* Bottom 3x2 Grid */}
          <div className="w-full h-[47%] grid grid-cols-3 grid-rows-2 gap-1 mt-1">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="w-full h-full bg-slate-200 rounded-lg border border-slate-900 overflow-hidden">
                <img src={getPhoto(idx + 1)} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. BOLD HEADLINE CUTOUT */}
      {template.id === 'temp_bold_headline_cutout' && (
        <div className="w-full h-full bg-slate-950 relative text-white overflow-hidden flex flex-col justify-between p-4">
          <img src={getPhoto(0)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />

          {/* Giant Headline BEHIND / Overlaid */}
          <div className="relative z-10 mt-2">
            <span className="bg-[#0A66C2] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded border border-white mb-1 inline-block">
              NO BS POST
            </span>
            <h2 className="font-display text-2xl uppercase leading-none tracking-tight text-[#F7C948] drop-shadow-md">
              {displayTitle}
            </h2>
          </div>

          <div className="relative z-10 bg-slate-900/90 border border-white/30 p-2.5 rounded-xl backdrop-blur-xs flex items-center justify-between">
            <p className="font-serif-display text-xs font-bold text-white max-w-[80%] leading-tight">
              {displaySubtitle}
            </p>
            <span className="font-bold text-lg text-[#0A66C2]">&gt;&gt;&gt;</span>
          </div>
        </div>
      )}

      {/* 11. CAROUSEL TIPS DECK */}
      {template.id === 'temp_carousel_tips_deck' && (
        <div className="w-full h-full bg-[#FAF5EF] p-4 flex flex-col justify-between border-3 border-[#6B0F1A] text-[#6B0F1A]">
          <div className="flex items-center justify-between border-b-2 border-[#6B0F1A] pb-2">
            <span className="font-serif-display text-xs font-bold uppercase tracking-wider">INSIGHT DECK</span>
            <span className="bg-[#6B0F1A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">SLIDE 01</span>
          </div>

          <div className="my-2">
            <h2 className="font-serif-display text-xl font-bold uppercase leading-tight mb-1">
              {displayTitle}
            </h2>
            <p className="font-sans text-xs text-slate-700 font-medium">{displaySubtitle}</p>
          </div>

          <div className="w-full aspect-[16/9] bg-slate-200 rounded-xl border-2 border-[#6B0F1A] overflow-hidden">
            <img src={getPhoto(0)} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#6B0F1A]/30 text-xs font-bold">
            <span>Swipe for tips</span>
            <span>&gt;&gt;&gt;</span>
          </div>
        </div>
      )}

      {/* 12. QUOTE / INSIGHT CARD */}
      {template.id === 'temp_quote_insight_card' && (
        <div className="w-full h-full bg-[#6B0F1A] p-5 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="text-5xl font-serif text-[#D9C9A8] opacity-40">“</div>

          <h2 className="font-serif-display text-lg font-bold leading-relaxed text-[#FAF5EF] my-auto">
            {displayTitle}
          </h2>

          <div className="flex items-center gap-2 border-t border-white/20 pt-3">
            <img src={getPhoto(0)} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-[#D9C9A8]" />
            <div>
              <p className="font-bold text-xs text-[#FAF5EF] flex items-center gap-1">
                {displaySubtitle} <span className="text-sky-400 text-xs">☑️</span>
              </p>
              <span className="text-[10px] text-white/70">Verified Creator</span>
            </div>
          </div>
        </div>
      )}

      {/* 13. ANNOUNCEMENT / ACHIEVEMENT */}
      {template.id === 'temp_announcement_achievement' && (
        <div className="w-full h-full bg-[#FAF5EF] p-3 flex flex-col justify-between relative text-slate-900 border-2 border-[#6B0F1A]">
          <div className="w-full h-[65%] bg-slate-200 rounded-xl border-2 border-[#6B0F1A] overflow-hidden relative">
            <img src={getPhoto(0)} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="bg-[#6B0F1A] text-white p-3 rounded-xl border border-slate-900 shadow-sm mt-2">
            <span className="bg-[#D9C9A8] text-[#6B0F1A] text-[9px] font-bold uppercase px-2 py-0.5 rounded">
              ANNOUNCEMENT
            </span>
            <h3 className="font-serif-display text-sm font-bold mt-1 leading-snug">{displayTitle}</h3>
          </div>
        </div>
      )}
    </div>
  );
};
