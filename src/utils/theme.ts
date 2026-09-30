import { PaletteThemeKey, PostType } from '../types';

export function getThemeKeyForPostType(postType: PostType): PaletteThemeKey {
  const pt = postType.toLowerCase();
  if (pt.includes('professional') || pt.includes('business') || pt.includes('brand')) {
    return 'professional';
  }
  if (pt.includes('travel') || pt.includes('ootd') || pt.includes('fashion')) {
    return 'travel';
  }
  if (pt.includes('food') || pt.includes('festival') || pt.includes('birthday') || pt.includes('celebration')) {
    return 'food';
  }
  return 'fun';
}

export interface ThemeStyles {
  key: PaletteThemeKey;
  bgBase: string;
  bgCard: string;
  primaryBg: string;
  primaryText: string;
  accentBg: string;
  borderClass: string;
  headingFontClass: string;
  shadowClass: string;
  stickerStyle: string;
}

export const THEMES: Record<PaletteThemeKey, ThemeStyles> = {
  fun: {
    key: 'fun',
    bgBase: 'bg-[#FFF8EC] bg-grid-paper',
    bgCard: 'bg-white border-2 border-slate-900',
    primaryBg: 'bg-[#F0509B]',
    primaryText: 'text-[#F0509B]',
    accentBg: 'bg-[#F7C948]',
    borderClass: 'border-2 border-slate-900',
    headingFontClass: 'font-display',
    shadowClass: 'shadow-hard',
    stickerStyle: 'bg-[#F7C948] text-slate-900 border-2 border-slate-900 font-bold',
  },
  travel: {
    key: 'travel',
    bgBase: 'bg-holo-gradient',
    bgCard: 'bg-white/90 backdrop-blur-sm border-2 border-slate-900',
    primaryBg: 'bg-[#00C49F]',
    primaryText: 'text-[#00C49F]',
    accentBg: 'bg-[#FF8042]',
    borderClass: 'border-2 border-slate-900',
    headingFontClass: 'font-display',
    shadowClass: 'shadow-hard-lg',
    stickerStyle: 'bg-sky-200 text-slate-900 border-2 border-slate-900 font-bold',
  },
  professional: {
    key: 'professional',
    bgBase: 'bg-[#FAF5EF] bg-burgundy-theme',
    bgCard: 'bg-white border-2 border-[#6B0F1A]',
    primaryBg: 'bg-[#6B0F1A]',
    primaryText: 'text-[#6B0F1A]',
    accentBg: 'bg-[#D9C9A8]',
    borderClass: 'border-2 border-[#6B0F1A]',
    headingFontClass: 'font-serif-display',
    shadowClass: 'shadow-hard-burgundy',
    stickerStyle: 'bg-[#D9C9A8] text-[#6B0F1A] border-2 border-[#6B0F1A] font-medium',
  },
  food: {
    key: 'food',
    bgBase: 'bg-[#FFF0F5] bg-gingham-pink',
    bgCard: 'bg-white border-2 border-slate-900',
    primaryBg: 'bg-[#FF5722]',
    primaryText: 'text-[#FF5722]',
    accentBg: 'bg-[#9C27B0]',
    borderClass: 'border-2 border-slate-900',
    headingFontClass: 'font-display',
    shadowClass: 'shadow-hard-yellow',
    stickerStyle: 'bg-[#FFEB3B] text-slate-900 border-2 border-slate-900 font-bold',
  },
};
