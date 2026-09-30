import { SocialPlatform } from '../types';

export interface PlatformConfig {
  id: SocialPlatform;
  name: string;
  badge: string;
  bgColor: string;
  iconBg: string;
  aspectRatioLabel: string;
  aspectRatioValue: string; // e.g. "aspect-[4/5]", "aspect-[9/16]", etc.
  maxHashtags: number;
  captionStyle: string;
  hasSafeZone: boolean;
  safeZoneTopPct?: number; // e.g. 15% top
  safeZoneBottomPct?: number; // e.g. 20% bottom
  safeZoneRightPct?: number; // e.g. 15% right for reels/shorts
  defaultAvatar: string;
  tips: string[];
}

export const PLATFORM_CONFIGS: Record<SocialPlatform, PlatformConfig> = {
  'Instagram Post (feed)': {
    id: 'Instagram Post (feed)',
    name: 'Instagram Post',
    badge: 'Feed 4:5 / 1:1',
    bgColor: 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white',
    iconBg: 'bg-[#E1306C]',
    aspectRatioLabel: '4:5 / 1:1',
    aspectRatioValue: 'aspect-[4/5]',
    maxHashtags: 30,
    captionStyle: 'Short, engaging & trendy with emoji breaks',
    hasSafeZone: false,
    defaultAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    tips: [
      'Put key hooks in the first 2 lines before the "more" cut-off.',
      'Use 15-20 niche hashtags for targeted explore page reach.',
      'Tag locations to boost local community discovery.',
    ],
  },
  'Instagram Story': {
    id: 'Instagram Story',
    name: 'Instagram Story',
    badge: 'Story 9:16',
    bgColor: 'bg-gradient-to-r from-[#833AB4] to-[#FD1D1D] text-white',
    iconBg: 'bg-[#C13584]',
    aspectRatioLabel: '9:16 Fullscreen',
    aspectRatioValue: 'aspect-[9/16]',
    maxHashtags: 5,
    captionStyle: 'Ultra short, snappy overlay sticker text',
    hasSafeZone: true,
    safeZoneTopPct: 14,
    safeZoneBottomPct: 18,
    defaultAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    tips: [
      'Keep text in the center 70% so profile bar & reply box do not cover it.',
      'Add interactive poll or question sticker for higher engagement.',
      'Use high-contrast text background pills for readability.',
    ],
  },
  'Instagram Reel': {
    id: 'Instagram Reel',
    name: 'Instagram Reel',
    badge: 'Reel 9:16',
    bgColor: 'bg-gradient-to-tr from-[#FF007A] to-[#7928CA] text-white',
    iconBg: 'bg-[#833AB4]',
    aspectRatioLabel: '9:16 Vertical Reel',
    aspectRatioValue: 'aspect-[9/16]',
    maxHashtags: 30,
    captionStyle: 'Hook in first 3s, trending audio reference',
    hasSafeZone: true,
    safeZoneTopPct: 12,
    safeZoneBottomPct: 22,
    safeZoneRightPct: 18,
    defaultAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    tips: [
      'Keep text inside center box to avoid right-side like/share buttons.',
      'Sync transitions with audio beats for maximum watch time.',
      'Add a clear call to action in caption ("Save for later!").',
    ],
  },
  'Facebook Post': {
    id: 'Facebook Post',
    name: 'Facebook Post',
    badge: 'Feed 1.91:1 / 1:1',
    bgColor: 'bg-[#1877F2] text-white',
    iconBg: 'bg-[#1877F2]',
    aspectRatioLabel: '1.91:1 / 1:1',
    aspectRatioValue: 'aspect-[1.91/1]',
    maxHashtags: 8,
    captionStyle: 'Conversational, story-driven & relatable',
    hasSafeZone: false,
    defaultAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    tips: [
      'Write conversational paragraphs with open-ended questions.',
      'Keep hashtags to 3-5 highly relevant tags.',
      'Ask followers to share or tag a friend.',
    ],
  },
  'WhatsApp Status': {
    id: 'WhatsApp Status',
    name: 'WhatsApp Status',
    badge: 'Status 9:16',
    bgColor: 'bg-[#25D366] text-white',
    iconBg: 'bg-[#25D366]',
    aspectRatioLabel: '9:16 Status',
    aspectRatioValue: 'aspect-[9/16]',
    maxHashtags: 0,
    captionStyle: 'Casual, personal update or status highlight',
    hasSafeZone: true,
    safeZoneTopPct: 12,
    safeZoneBottomPct: 16,
    defaultAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    tips: [
      'Keep text concise for 30-second status views.',
      'Avoid bottom area where reply field sits.',
      'Use warm emojis and friendly tones.',
    ],
  },
  'LinkedIn Post': {
    id: 'LinkedIn Post',
    name: 'LinkedIn Post',
    badge: 'Pro 1.91:1 / 1:1',
    bgColor: 'bg-[#0A66C2] text-white',
    iconBg: 'bg-[#0A66C2]',
    aspectRatioLabel: '1.91:1 / 1:1',
    aspectRatioValue: 'aspect-[1.91/1]',
    maxHashtags: 5,
    captionStyle: 'Polished, key takeaways, bullet points & insights',
    hasSafeZone: false,
    defaultAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    tips: [
      'Start with a strong professional hook line.',
      'Use clean bullet points for easy scanning.',
      'Include 3-5 industry hashtags at the bottom.',
    ],
  },
  'YouTube Shorts': {
    id: 'YouTube Shorts',
    name: 'YouTube Shorts',
    badge: 'Shorts 9:16',
    bgColor: 'bg-[#FF0000] text-white',
    iconBg: 'bg-[#FF0000]',
    aspectRatioLabel: '9:16 Vertical',
    aspectRatioValue: 'aspect-[9/16]',
    maxHashtags: 3,
    captionStyle: 'Punchy title under 60 chars, subscribe prompt',
    hasSafeZone: true,
    safeZoneTopPct: 10,
    safeZoneBottomPct: 24,
    safeZoneRightPct: 18,
    defaultAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    tips: [
      'Ensure main subject is centered to fit Shorts frame.',
      'Include #Shorts in description for algorithm boost.',
      'Add a pinned comment asking viewers to subscribe.',
    ],
  },
  'Pinterest Pin': {
    id: 'Pinterest Pin',
    name: 'Pinterest Pin',
    badge: 'Pin 2:3',
    bgColor: 'bg-[#BD081C] text-white',
    iconBg: 'bg-[#BD081C]',
    aspectRatioLabel: '2:3 Vertical Pin',
    aspectRatioValue: 'aspect-[2/3]',
    maxHashtags: 5,
    captionStyle: 'SEO-rich title & detailed descriptive text',
    hasSafeZone: false,
    defaultAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    tips: [
      'Use 2:3 vertical aspect ratio for maximum feed real estate.',
      'Include target keywords in pin title and description.',
      'Add text overlay on image for clear topic context.',
    ],
  },
  'X (Twitter) Post': {
    id: 'X (Twitter) Post',
    name: 'X (Twitter) Post',
    badge: 'Tweet 16:9',
    bgColor: 'bg-[#000000] text-white',
    iconBg: 'bg-[#000000]',
    aspectRatioLabel: '16:9 Landscape',
    aspectRatioValue: 'aspect-[16/9]',
    maxHashtags: 2,
    captionStyle: 'Punchy, direct, under 280 characters',
    hasSafeZone: false,
    defaultAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    tips: [
      'Keep tweet text punchy and under 280 characters.',
      'Use 1 or 2 relevant hashtags at most.',
      'End with a question to drive replies.',
    ],
  },
  'Snapchat Story': {
    id: 'Snapchat Story',
    name: 'Snapchat Story',
    badge: 'Snap 9:16',
    bgColor: 'bg-[#FFFC00] text-slate-900',
    iconBg: 'bg-[#FFFC00]',
    aspectRatioLabel: '9:16 Fullscreen',
    aspectRatioValue: 'aspect-[9/16]',
    maxHashtags: 3,
    captionStyle: 'Ultra playful, emoji-heavy sticker text',
    hasSafeZone: true,
    safeZoneTopPct: 14,
    safeZoneBottomPct: 20,
    defaultAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    tips: [
      'Keep content authentic, fun, and fast-paced.',
      'Use bright sticker badges and handwritten text.',
      'Keep text inside safe zone away from chat input.',
    ],
  },
};
