import { PostType } from '../types';

export interface PaletteSwatch {
  name: string;
  bgTop: string;
  bgBottom: string;
  textColor: string;
  accentColor: string;
  highlightBg: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  category: 'casual' | 'professional';
  bestFor: PostType[];
  layoutType: 'collage' | 'single' | 'carousel' | 'split screen' | 'grid' | 'stack' | 'quote';
  slots: number;
  palette: string[];
  swatches: PaletteSwatch[];
  fonts: { display: string; body: string };
  decorativeElements: string[];
  defaultTitle: string;
  defaultSubtitle: string;
  defaultCaption: string;
  description: string;
}

export const BUILTIN_TEMPLATE_LIBRARY: TemplateItem[] = [
  // 1. Scrapbook Collage
  {
    id: 'temp_scrapbook_collage',
    name: 'Scrapbook Collage',
    category: 'casual',
    bestFor: ['Lifestyle / Vlog', 'Travel', 'Fashion / OOTD', 'Festival / Celebration'],
    layoutType: 'collage',
    slots: 3,
    palette: ['#FFF8EC', '#8B0000', '#F7C948', '#000000'],
    swatches: [
      { name: 'Classic Red & Cream', bgTop: 'bg-[#FFF8EC]', bgBottom: 'bg-[#8B0000]', textColor: 'text-slate-900', accentColor: '#8B0000', highlightBg: 'bg-[#F7C948]' },
      { name: 'Hot Pink & Sun', bgTop: 'bg-[#FFF0F5]', bgBottom: 'bg-[#F0509B]', textColor: 'text-slate-900', accentColor: '#F0509B', highlightBg: 'bg-[#F7C948]' },
      { name: 'Olive & Lavender', bgTop: 'bg-[#F5F5DC]', bgBottom: 'bg-[#556B2F]', textColor: 'text-slate-900', accentColor: '#556B2F', highlightBg: 'bg-[#E6E6FA]' },
    ],
    fonts: { display: 'font-display', body: 'font-handwriting' },
    decorativeElements: ['📌 Paper Clip', '❌ Red Stitched Line', '💌 Postage Stamp', '🍒 Cherry Sticker', '🪩 Disco Ball'],
    defaultTitle: 'MEMORIES ✨',
    defaultSubtitle: 'Snapshots & Doodles',
    defaultCaption: 'Living for these golden everyday moments! 📸✨',
    description: 'Light paper top & deep red bottom split by a red stitched dashed line with paper clips and disco stickers.',
  },

  // 2. Travel Diary
  {
    id: 'temp_travel_diary',
    name: 'Travel Diary',
    category: 'casual',
    bestFor: ['Travel', 'Lifestyle / Vlog', 'Festival / Celebration'],
    layoutType: 'split screen',
    slots: 2,
    palette: ['#E0F7FA', '#FF8042', '#FFF8EC', '#2D3748'],
    swatches: [
      { name: 'Postcard Pastel', bgTop: 'bg-sky-100', bgBottom: 'bg-[#FFF8EC]', textColor: 'text-slate-900', accentColor: '#FF8042', highlightBg: 'bg-[#F7C948]' },
      { name: 'Sunset Glow', bgTop: 'bg-amber-100', bgBottom: 'bg-[#FF5722]', textColor: 'text-slate-900', accentColor: '#FF5722', highlightBg: 'bg-amber-200' },
    ],
    fonts: { display: 'font-handwriting', body: 'font-sans' },
    decorativeElements: ['📌 Taped Lined Note', '📌 Paper Clip', '🌊 Torn Paper Edge', '✈️ Stamp'],
    defaultTitle: 'My Travel Diaries ✈️',
    defaultSubtitle: 'Wanderlust Moments',
    defaultCaption: 'Chasing sunsets, ocean breezes & unforgettable places! 🌴🌊',
    description: 'Full-bleed photo background with postcard stack, taped paper clip note & torn paper edge.',
  },

  // 3. Photo Dump Stack
  {
    id: 'temp_photo_dump_stack',
    name: 'Photo Dump Stack',
    category: 'casual',
    bestFor: ['Food', 'Fashion / OOTD', 'Lifestyle / Vlog', 'Memes / Fun'],
    layoutType: 'stack',
    slots: 2,
    palette: ['#FFFFFF', '#000000', '#F7C948', '#F0509B'],
    swatches: [
      { name: 'Minimal White', bgTop: 'bg-white', bgBottom: 'bg-slate-900', textColor: 'text-slate-900', accentColor: '#000000', highlightBg: 'bg-[#F7C948]' },
      { name: 'Vibrant Pink', bgTop: 'bg-pink-50', bgBottom: 'bg-[#F0509B]', textColor: 'text-slate-900', accentColor: '#F0509B', highlightBg: 'bg-[#F7C948]' },
    ],
    fonts: { display: 'font-display', body: 'font-sans' },
    decorativeElements: ['💬 Centered Pill Tag', '⚪ Carousel Dots', '📌 Washi Tape'],
    defaultTitle: 'Breakfast in Bed ☕',
    defaultSubtitle: 'Weekend Photo Dump',
    defaultCaption: 'A little bit of everything from the week! 🥐☕',
    description: 'Photos stacked vertically edge to edge with a tiny centered caption box and carousel dots.',
  },

  // 4. Film Frame
  {
    id: 'temp_film_frame',
    name: 'Film Frame',
    category: 'casual',
    bestFor: ['Fashion / OOTD', 'Lifestyle / Vlog', 'Birthday / Events', 'Travel'],
    layoutType: 'collage',
    slots: 3,
    palette: ['#1A202C', '#8B0000', '#E2E8F0', '#FFD700'],
    swatches: [
      { name: 'Dark Red Yarn', bgTop: 'bg-slate-900', bgBottom: 'bg-slate-800', textColor: 'text-white', accentColor: '#8B0000', highlightBg: 'bg-red-600' },
      { name: 'Holo Glow', bgTop: 'bg-indigo-950', bgBottom: 'bg-purple-900', textColor: 'text-white', accentColor: '#00C49F', highlightBg: 'bg-[#F7C948]' },
    ],
    fonts: { display: 'font-display', body: 'font-pixel' },
    decorativeElements: ['🎀 Red Yarn Bow', '❌ Red Stitched Border', '🎞️ Film Strip', '❄️ Snowflake Sticker'],
    defaultTitle: '35MM FILM ROLL 🎞️',
    defaultSubtitle: 'Analog Vibe',
    defaultCaption: 'Developing warm film memories in digital HD! 🎞️✨',
    description: 'Dark textured background with red stitched photo frame, yarn bow & overlapping film strip photos.',
  },

  // 5. Polaroid Overlay
  {
    id: 'temp_polaroid_overlay',
    name: 'Polaroid Overlay',
    category: 'casual',
    bestFor: ['Lifestyle / Vlog', 'Travel', 'Birthday / Events', 'Other (custom)'],
    layoutType: 'split screen',
    slots: 2,
    palette: ['#FFF8EC', '#F0509B', '#F7C948', '#2D3748'],
    swatches: [
      { name: 'Cream Polaroid', bgTop: 'bg-[#FFF8EC]', bgBottom: 'bg-amber-100', textColor: 'text-slate-900', accentColor: '#F0509B', highlightBg: 'bg-[#F7C948]' },
    ],
    fonts: { display: 'font-handwriting', body: 'font-sans' },
    decorativeElements: ['📸 Cream Polaroid Frame', '📌 Washi Tape', '✨ Sparkles'],
    defaultTitle: 'Polaroid Dump 📸',
    defaultSubtitle: 'Captured Forever',
    defaultCaption: 'Old school polaroid aesthetic with a modern twist ✨',
    description: 'Full-bleed background photo overlaid with a large cream polaroid frame and tilted corner photo.',
  },

  // 6. Scenic Minimal
  {
    id: 'temp_scenic_minimal',
    name: 'Scenic Minimal',
    category: 'casual',
    bestFor: ['Travel', 'Motivational / Quotes', 'Fashion / OOTD'],
    layoutType: 'single',
    slots: 1,
    palette: ['#FFFFFF', '#E2E8F0', '#1A202C', '#64748B'],
    swatches: [
      { name: 'Clean White', bgTop: 'bg-white', bgBottom: 'bg-slate-100', textColor: 'text-slate-900', accentColor: '#000000', highlightBg: 'bg-slate-200' },
    ],
    fonts: { display: 'font-serif-display', body: 'font-sans' },
    decorativeElements: ['🖼️ Soft Gradient Border', '⚪ Carousel Dots', '✨ Minimal Serif'],
    defaultTitle: 'TAKING THE SCENIC TRAIL',
    defaultSubtitle: 'VOL. 04',
    defaultCaption: 'Pause, breathe and take the scenic route 🌄',
    description: 'White framed photo with soft gradient border and centered serif uppercase title.',
  },

  // 7. Life Lately
  {
    id: 'temp_life_lately',
    name: 'Life Lately',
    category: 'casual',
    bestFor: ['Lifestyle / Vlog', 'Food', 'Travel', 'Fashion / OOTD'],
    layoutType: 'single',
    slots: 1,
    palette: ['#0F172A', '#F7C948', '#FFF8EC', '#F0509B'],
    swatches: [
      { name: 'Midnight Gold', bgTop: 'bg-slate-900', bgBottom: 'bg-slate-950', textColor: 'text-[#FFF8EC]', accentColor: '#F7C948', highlightBg: 'bg-[#F7C948]' },
    ],
    fonts: { display: 'font-handwriting', body: 'font-sans' },
    decorativeElements: ['✍️ Elegant Script Header', '📍 Right-Aligned Subtitle'],
    defaultTitle: 'Life Lately...',
    defaultSubtitle: 'September highlights & quiet moments',
    defaultCaption: 'Life lately in pictures & quiet gratitude ✨🤍',
    description: 'Full-bleed dark photo with large elegant cream-yellow script title at top and small subtitle at bottom.',
  },

  // 8. Bye Month Grid
  {
    id: 'temp_bye_month_grid',
    name: 'Bye Month Grid',
    category: 'casual',
    bestFor: ['Lifestyle / Vlog', 'Travel', 'Food', 'Festival / Celebration'],
    layoutType: 'grid',
    slots: 6,
    palette: ['#FFF8EC', '#F7C948', '#000000', '#F0509B'],
    swatches: [
      { name: 'Pale Yellow Word', bgTop: 'bg-slate-900', bgBottom: 'bg-[#F7C948]', textColor: 'text-[#F7C948]', accentColor: '#F7C948', highlightBg: 'bg-[#F7C948]' },
    ],
    fonts: { display: 'font-display', body: 'font-sans' },
    decorativeElements: ['🔤 Huge Split Text Overlay', '📸 2x3 Gapless Grid'],
    defaultTitle: 'BYE / SEP / TEM / BER',
    defaultSubtitle: 'Monthly Recap Dump',
    defaultCaption: 'Goodbye September! Thanks for all the sweet memories 👋✨',
    description: '2x3 grid of 6 photos with a huge bold pale-yellow word split across cells automatically.',
  },

  // 9. Monthly Recap Album
  {
    id: 'temp_monthly_recap_album',
    name: 'Monthly Recap Album',
    category: 'casual',
    bestFor: ['Lifestyle / Vlog', 'Travel', 'Food', 'Birthday / Events'],
    layoutType: 'grid',
    slots: 7,
    palette: ['#FFF8EC', '#2D3748', '#F0509B', '#F7C948'],
    swatches: [
      { name: 'Album Cream', bgTop: 'bg-[#FFF8EC]', bgBottom: 'bg-white', textColor: 'text-slate-900', accentColor: '#F0509B', highlightBg: 'bg-[#F7C948]' },
    ],
    fonts: { display: 'font-display', body: 'font-sans' },
    decorativeElements: ['🏆 Hero Top Banner', '📸 3x2 Grid Below', '🏷️ Item Count Badge'],
    defaultTitle: 'SEPTEMBER RECAP',
    defaultSubtitle: '24 Shots • 31 Days',
    defaultCaption: 'September album dump! Swipe to see all the highlights 📸',
    description: 'Large hero photo on top with bold title & count, plus 3x2 grid of small photos below.',
  },

  // ================= PROFESSIONAL TEMPLATES =================
  // 10. Bold Headline Cutout (LinkedIn style)
  {
    id: 'temp_bold_headline_cutout',
    name: 'Bold Headline Cutout',
    category: 'professional',
    bestFor: ['Professional (LinkedIn / brand / business)', 'Product / Small Business Promo', 'Motivational / Quotes'],
    layoutType: 'single',
    slots: 1,
    palette: ['#0A66C2', '#6B0F1A', '#FAF5EF', '#F7C948'],
    swatches: [
      { name: 'Brand Blue LinkedIn', bgTop: 'bg-slate-900', bgBottom: 'bg-[#0A66C2]', textColor: 'text-white', accentColor: '#0A66C2', highlightBg: 'bg-[#F7C948]' },
      { name: 'Executive Burgundy', bgTop: 'bg-[#FAF5EF]', bgBottom: 'bg-[#6B0F1A]', textColor: 'text-[#6B0F1A]', accentColor: '#6B0F1A', highlightBg: 'bg-[#D9C9A8]' },
    ],
    fonts: { display: 'font-display', body: 'font-serif-display' },
    decorativeElements: ['🏷️ "NO BS POST" Highlight Badge', '⏩ ">>>" Swipe Arrow', '🔤 Behind-Text Layer'],
    defaultTitle: 'THE SECRET TO CONSISTENT GROWTH',
    defaultSubtitle: 'Actionable Insights for Creators & Founders',
    defaultCaption: 'Stop overcomplicating strategy. Here is what actually moves the needle in 2026 📈',
    description: 'Giant bold sans-serif headline sitting BEHIND subject with brand blue word highlight & "NO BS POST" badge.',
  },

  // 11. Carousel Tips Deck
  {
    id: 'temp_carousel_tips_deck',
    name: 'Carousel Tips Deck',
    category: 'professional',
    bestFor: ['Professional (LinkedIn / brand / business)', 'Product / Small Business Promo', 'Fitness'],
    layoutType: 'carousel',
    slots: 1,
    palette: ['#6B0F1A', '#D9C9A8', '#FAF5EF', '#000000'],
    swatches: [
      { name: 'Burgundy Executive', bgTop: 'bg-[#FAF5EF]', bgBottom: 'bg-[#6B0F1A]', textColor: 'text-[#6B0F1A]', accentColor: '#6B0F1A', highlightBg: 'bg-[#D9C9A8]' },
      { name: 'Modern Dark Tech', bgTop: 'bg-slate-900', bgBottom: 'bg-indigo-600', textColor: 'text-white', accentColor: '#6366F1', highlightBg: 'bg-[#F7C948]' },
    ],
    fonts: { display: 'font-serif-display', body: 'font-sans' },
    decorativeElements: ['🔢 Numbered Slide Badge (01, 02)', '👉 CTA Follow Box', '🏷️ Brand Accent Bar'],
    defaultTitle: '5 HABITS OF HIGH-PERFORMING TEAMS',
    defaultSubtitle: 'Slide 01 • Swipe for Tips >>>',
    defaultCaption: '5 game-changing habits every leader should adopt today 🚀',
    description: 'Cover slide with big title & photo followed by numbered tip slides with clean modern layout.',
  },

  // 12. Quote / Insight Card
  {
    id: 'temp_quote_insight_card',
    name: 'Quote / Insight Card',
    category: 'professional',
    bestFor: ['Professional (LinkedIn / brand / business)', 'Motivational / Quotes', 'Other (custom)'],
    layoutType: 'quote',
    slots: 1,
    palette: ['#6B0F1A', '#FAF5EF', '#D9C9A8', '#F7C948'],
    swatches: [
      { name: 'Burgundy Quote', bgTop: 'bg-[#6B0F1A]', bgBottom: 'bg-[#FAF5EF]', textColor: 'text-white', accentColor: '#D9C9A8', highlightBg: 'bg-[#D9C9A8]' },
      { name: 'Navy Blue Quote', bgTop: 'bg-[#0A66C2]', bgBottom: 'bg-slate-900', textColor: 'text-white', accentColor: '#38BDF8', highlightBg: 'bg-sky-400' },
    ],
    fonts: { display: 'font-serif-display', body: 'font-sans' },
    decorativeElements: ['💬 Giant Quote Marks', '👤 Small Circular Avatar', '☑️ Verified Badge'],
    defaultTitle: '"Consistency beats intensity every single time."',
    defaultSubtitle: 'Founder Insight • PostCraft Studio',
    defaultCaption: 'A reminder for anyone building something great right now 💡',
    description: 'Big quote or statistic on solid brand color with small circular profile avatar & verified badge.',
  },

  // 13. Announcement / Achievement
  {
    id: 'temp_announcement_achievement',
    name: 'Announcement / Achievement',
    category: 'professional',
    bestFor: ['Professional (LinkedIn / brand / business)', 'Product / Small Business Promo', 'Birthday / Events'],
    layoutType: 'single',
    slots: 1,
    palette: ['#FAF5EF', '#6B0F1A', '#D9C9A8', '#000000'],
    swatches: [
      { name: 'Luxe Banner', bgTop: 'bg-[#FAF5EF]', bgBottom: 'bg-[#6B0F1A]', textColor: 'text-slate-900', accentColor: '#6B0F1A', highlightBg: 'bg-[#D9C9A8]' },
    ],
    fonts: { display: 'font-serif-display', body: 'font-sans' },
    decorativeElements: ['🎗️ Clean Overlay Banner', '🏷️ Logo / Handle Area', '✨ Celebration Doodles'],
    defaultTitle: "I'm excited to share a major milestone!",
    defaultSubtitle: 'New Chapter Unlocked 🎉',
    defaultCaption: 'Thrilled to announce the next step in our journey! Thank you to everyone who supported us 🙏',
    description: 'Photo with clean overlay banner, bold headline, and logo/handle area.',
  },
];
