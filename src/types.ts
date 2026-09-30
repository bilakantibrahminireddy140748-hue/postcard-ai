export type PostType =
  | 'Professional (LinkedIn / brand / business)'
  | 'Travel'
  | 'Fashion / OOTD'
  | 'Food'
  | 'Fitness'
  | 'Lifestyle / Vlog'
  | 'Festival / Celebration'
  | 'Birthday / Events'
  | 'Motivational / Quotes'
  | 'Product / Small Business Promo'
  | 'Memes / Fun'
  | 'Other (custom)';

export type OutputFormat = 'Picture' | 'Video' | 'Animated video / Reel';

export type SocialPlatform =
  | 'Instagram Post (feed)'
  | 'Instagram Story'
  | 'Instagram Reel'
  | 'Facebook Post'
  | 'WhatsApp Status'
  | 'LinkedIn Post'
  | 'YouTube Shorts'
  | 'Pinterest Pin'
  | 'X (Twitter) Post'
  | 'Snapchat Story';

export type PaletteThemeKey = 'fun' | 'travel' | 'professional' | 'food';

export interface UploadedMedia {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video';
  duration?: number; // video total duration in seconds
  trimStart?: number; // trim start in seconds
  trimEnd?: number; // trim end in seconds
}

// Backward compatibility alias for UploadedPhoto
export type UploadedPhoto = UploadedMedia;

export interface BriefAnalysis {
  theme: string;
  mood: string;
  colors: string[];
  outfitStyle: string;
  location: string;
  targetAudience: string;
  recommendedFormat: OutputFormat;
  moodChips: string[];
}

export interface TemplateSuggestion {
  id: string;
  name: string;
  category?: 'casual' | 'professional';
  styleLabel?: string;
  palette: string[];
  swatches?: any[];
  layoutType: 'collage' | 'single' | 'carousel' | 'split screen' | 'grid' | 'stack' | 'quote';
  captionTone?: string;
  description?: string;
  frameStyle?: 'polaroid' | 'flower' | 'blob' | 'scallop' | 'clean' | 'magazine';
  stickerPacks?: string[];
  defaultTitle?: string;
  defaultSubtitle?: string;
  defaultCaption?: string;
}

export interface MusicMood {
  genre: string;
  trackName: string;
  tempo: string;
  vibe: string;
}

export interface GeneratedPost {
  caption: string;
  altCaptions: string[];
  hashtags: string[];
  musicMood: MusicMood;
  overlayText: string;
  stickerSuggestions: string[];
  filterRecommendation: string;
  platformSpecificCaptions?: Record<string, string>;
  platformTips?: Record<string, string[]>;
}

export interface StickerOverlay {
  id: string;
  type: 'emoji' | 'text' | 'badge' | 'image' | 'location' | 'date';
  content: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  rotation: number; // degrees -180 to 180
  scale: number; // 0.5 to 3.0
  zIndex?: number;
  flipX?: boolean;
  startTime?: number; // in video mode, start second
  endTime?: number; // in video mode, end second
  animation?: 'pop' | 'wiggle' | 'float' | 'fade';
}

export type FilterStyle = 'none' | 'warm' | 'vintage' | 'cinematic' | 'bw' | 'bright' | 'moody' | 'holographic';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface VideoScene {
  id: string;
  mediaId: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  duration: number; // seconds
  motion: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-[#right]' | 'pan-right' | 'parallax' | 'shake' | 'none';
  transition: 'fade' | 'slide' | 'zoom' | 'polaroid-flip' | 'glitch' | 'torn-paper' | 'none';
  textOverlay?: {
    content: string;
    font?: string;
    position?: 'top' | 'center' | 'bottom';
    animation?: 'typewriter' | 'pop' | 'slide' | 'fade';
  };
  trimStart?: number;
  trimEnd?: number;
}

export interface VideoStoryboard {
  id: string;
  variantName: string;
  totalDuration: number; // in seconds
  musicMood: string;
  bpm: number;
  scenes: VideoScene[];
  whyItWorks: string;
}

export interface AppState {
  // User info
  userName: string;
  userAge: number;
  step: number; // 1 to 9

  // Selections
  postType: PostType;
  outputFormat: OutputFormat;
  selectedPlatforms: SocialPlatform[]; // Multi-select array of platforms
  activePreviewPlatform: SocialPlatform;

  photos: UploadedMedia[]; // Supports both photos and short videos
  briefPrompt: string;
  briefAnalysis: BriefAnalysis | null;
  templates: TemplateSuggestion[];
  selectedTemplate: TemplateSuggestion | null;
  generatedPost: GeneratedPost | null;

  // Video Storyboards
  storyboards: VideoStoryboard[];
  activeStoryboardIndex: number;
  renderedVideoBlobUrl: string | null;
  renderedVideoFormat: string; // e.g. "mp4" or "webm"
  customBgmAudioUrl?: string | null;

  // Finalize / Addons state
  activeFilter: FilterStyle;
  overlayStickers: StickerOverlay[];
  stickerHistory: StickerOverlay[][];
  stickerHistoryIndex: number;
  customOverlayText: string;
  selectedMusicMood: string;

  // Platform Live Preview State
  platformMockupDarkMode: boolean;
  showSafeZone: boolean;
  previewProfileName: string;
  previewUsername: string;
  previewProfilePic: string;
  editableCaption: string;

  // Global settings
  darkMode: boolean;

  // Chat Assistant
  chatOpen: boolean;
  chatMessages: ChatMessage[];
}
