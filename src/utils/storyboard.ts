import { VideoStoryboard, VideoScene, UploadedMedia, PostType, SocialPlatform } from '../types';

export function generateFallbackStoryboard(
  mediaItems: UploadedMedia[],
  postType: PostType = 'Lifestyle / Vlog',
  platform: SocialPlatform = 'Instagram Reel'
): VideoStoryboard {
  const fallbackMedia =
    mediaItems.length > 0
      ? mediaItems
      : [
          {
            id: 'm1',
            url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
            name: 'Beach Sunset',
            type: 'image' as const,
          },
          {
            id: 'm2',
            url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
            name: 'Streetwear Fit',
            type: 'image' as const,
          },
        ];

  const motions: VideoScene['motion'][] = ['zoom-in', 'pan-right', 'zoom-out', 'pan-left', 'shake'];
  const transitions: VideoScene['transition'][] = ['fade', 'slide', 'zoom', 'polaroid-flip'];

  const isProfessional =
    postType.toLowerCase().includes('professional') || postType.toLowerCase().includes('business');

  const scenes: VideoScene[] = fallbackMedia.slice(0, 5).map((item, idx) => ({
    id: `scene_${idx}_${Date.now()}`,
    mediaId: item.id,
    mediaType: item.type,
    mediaUrl: item.url,
    duration: 3.0,
    motion: motions[idx % motions.length],
    transition: transitions[idx % transitions.length],
    textOverlay: {
      content: idx === 0 ? 'GOA DREAMS ✨' : idx === 1 ? 'GOLDEN HOUR 🌅' : 'GOOD VIBES 🤍',
      position: idx % 2 === 0 ? 'center' : 'bottom',
      animation: 'pop',
    },
    trimStart: item.trimStart || 0,
    trimEnd: item.trimEnd || 5,
  }));

  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

  return {
    id: `sb_${Date.now()}`,
    variantName: isProfessional ? 'Professional Insight Reel' : 'Vibrant Beat Sync Reel',
    totalDuration,
    musicMood: isProfessional ? 'Corporate Minimal' : 'Upbeat Summer Pop',
    bpm: isProfessional ? 90 : 120,
    scenes,
    whyItWorks: isProfessional
      ? 'Clean subtle zooms and structured slide flow highlight key business takeaways.'
      : 'Rhythmic cuts and energetic zooms maximize engagement and keep audience watching.',
  };
}

export async function create3VideoVariants(
  mediaItems: UploadedMedia[],
  postType: PostType = 'Lifestyle / Vlog',
  platform: SocialPlatform = 'Instagram Reel',
  briefPrompt: string = ''
): Promise<VideoStoryboard[]> {
  const baseStoryboard = generateFallbackStoryboard(mediaItems, postType, platform);

  // Variant 1: Standard Beat Sync
  const v1: VideoStoryboard = {
    ...baseStoryboard,
    id: `v1_${Date.now()}`,
    variantName: 'Variant 1: High Energy Beat Sync',
    musicMood: 'Upbeat Summer Pop',
    bpm: 124,
    whyItWorks: 'Fast pacing and rhythmic transitions catch viewers in the first 3 seconds.',
  };

  // Variant 2: Relaxed Chill Flow
  const v2: VideoStoryboard = {
    ...baseStoryboard,
    id: `v2_${Date.now()}`,
    variantName: 'Variant 2: Dreamy Lo-Fi Waves',
    musicMood: 'Lo-Fi Chill Beats',
    bpm: 88,
    scenes: baseStoryboard.scenes.map((s) => ({
      ...s,
      duration: 3.5,
      motion: 'zoom-in' as const,
      transition: 'fade' as const,
    })),
    totalDuration: baseStoryboard.scenes.length * 3.5,
    whyItWorks: 'Slower transitions create an aesthetic, relaxing mood ideal for travel & lifestyle dumps.',
  };

  // Variant 3: Cinematic Story
  const v3: VideoStoryboard = {
    ...baseStoryboard,
    id: `v3_${Date.now()}`,
    variantName: 'Variant 3: Cinematic Film Roll',
    musicMood: 'Cinematic Dreamy',
    bpm: 100,
    scenes: baseStoryboard.scenes.map((s, idx) => ({
      ...s,
      duration: 2.5,
      motion: idx % 2 === 0 ? ('pan-right' as const) : ('pan-left' as const),
      transition: 'zoom' as const,
    })),
    totalDuration: baseStoryboard.scenes.length * 2.5,
    whyItWorks: 'Dynamic pan motions give an analog film-roll look across frames.',
  };

  return [v1, v2, v3];
}
