import React, { useState } from 'react';
import { PostType, OutputFormat, AppState } from '../types';
import { StickerBadge, WavyDivider } from './DesignElements';
import { Camera, Video, Film, ArrowRight, Sparkles } from 'lucide-react';

interface Step2Props {
  appState: AppState;
  onUpdateState: (updates: Partial<AppState>) => void;
}

interface PostTypeOption {
  type: PostType;
  emoji: string;
  bg: string;
  rotate: number;
  badge?: string;
  desc: string;
}

const POST_TYPES: PostTypeOption[] = [
  {
    type: 'Professional (LinkedIn / brand / business)',
    emoji: '💼',
    bg: 'bg-[#FAF5EF] border-[#6B0F1A]',
    rotate: -1,
    badge: 'Pro Vibe',
    desc: 'Sleek, polished & executive',
  },
  {
    type: 'Travel',
    emoji: '✈️',
    bg: 'bg-sky-100 border-slate-900',
    rotate: 2,
    badge: 'Wanderlust',
    desc: 'Beach, mountains & city trips',
  },
  {
    type: 'Fashion / OOTD',
    emoji: '👗',
    bg: 'bg-pink-100 border-slate-900',
    rotate: -2,
    badge: 'Trending',
    desc: 'Fit checks, style & outfit details',
  },
  {
    type: 'Food',
    emoji: '🍕',
    bg: 'bg-amber-100 border-slate-900',
    rotate: 1,
    badge: 'Yum!',
    desc: 'Cafes, recipes & food aesthetic',
  },
  {
    type: 'Fitness',
    emoji: '🏋️‍♀️',
    bg: 'bg-emerald-100 border-slate-900',
    rotate: -1,
    desc: 'Workouts, routine & health goals',
  },
  {
    type: 'Lifestyle / Vlog',
    emoji: '☕',
    bg: 'bg-orange-100 border-slate-900',
    rotate: 2,
    badge: 'Popular',
    desc: 'Daily aesthetic, dump & chill',
  },
  {
    type: 'Festival / Celebration',
    emoji: '🎉',
    bg: 'bg-purple-100 border-slate-900',
    rotate: -2,
    desc: 'Parties, concerts & festive joy',
  },
  {
    type: 'Birthday / Events',
    emoji: '🎂',
    bg: 'bg-rose-100 border-slate-900',
    rotate: 1,
    desc: 'Milestones & celebrations',
  },
  {
    type: 'Motivational / Quotes',
    emoji: '✨',
    bg: 'bg-yellow-100 border-slate-900',
    rotate: -1,
    desc: 'Mindset, quotes & inspiration',
  },
  {
    type: 'Product / Small Business Promo',
    emoji: '🛍️',
    bg: 'bg-teal-100 border-slate-900',
    rotate: 2,
    badge: 'Grow Sales',
    desc: 'Unboxing, showcase & store promos',
  },
  {
    type: 'Memes / Fun',
    emoji: '🤪',
    bg: 'bg-lime-100 border-slate-900',
    rotate: -2,
    desc: 'Humor, trends & funny clips',
  },
  {
    type: 'Other (custom)',
    emoji: '🎨',
    bg: 'bg-indigo-100 border-slate-900',
    rotate: 1,
    desc: 'Your unique custom post theme',
  },
];

const FORMAT_OPTIONS: { format: OutputFormat; icon: React.ReactNode; label: string; desc: string }[] = [
  {
    format: 'Picture',
    icon: <Camera className="w-6 h-6 text-[#F0509B]" />,
    label: 'High-Res Picture / Carousel',
    desc: 'Single post, polaroid collage or photo album dump',
  },
  {
    format: 'Video',
    icon: <Video className="w-6 h-6 text-[#00C49F]" />,
    label: 'HD Video Clip',
    desc: 'Short video with music mood & filter transitions',
  },
  {
    format: 'Animated video / Reel',
    icon: <Film className="w-6 h-6 text-[#FF5722]" />,
    label: 'Animated Reel / Slideshow',
    desc: 'Dynamic photo-to-reel motion with stickers & beat-sync',
  },
];

export const Step2ChooseType: React.FC<Step2Props> = ({ appState, onUpdateState }) => {
  const [selectedType, setSelectedType] = useState<PostType>(appState.postType || 'Lifestyle / Vlog');
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>(appState.outputFormat || 'Picture');

  const handleContinue = () => {
    onUpdateState({
      postType: selectedType,
      outputFormat: selectedFormat,
      step: 3,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Title */}
      <div className="text-center mb-6">
        <StickerBadge text="Step 2 of 7" color="pink" rotate={-2} className="mb-2" />
        <h2 className="font-display text-2xl sm:text-3xl text-slate-900 leading-tight">
          What kind of post do you want to create today, <span className="text-[#F0509B]">{appState.userName}</span>?
        </h2>
        <p className="font-handwriting text-base text-slate-600 font-bold mt-1">
          Pick a category & output format for your studio project
        </p>
      </div>

      {/* Grid of colourful rotated cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {POST_TYPES.map((pt) => {
          const isSelected = selectedType === pt.type;
          return (
            <button
              key={pt.type}
              onClick={() => setSelectedType(pt.type)}
              style={{ transform: `rotate(${isSelected ? 0 : pt.rotate}deg)` }}
              className={`p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between transition-all relative overflow-hidden cursor-pointer ${
                pt.bg
              } ${
                isSelected
                  ? 'ring-4 ring-[#F0509B] scale-105 z-10 shadow-hard-lg'
                  : 'shadow-hard hover:scale-102 hover:z-10'
              }`}
            >
              {pt.badge && (
                <span className="absolute top-2 right-2 bg-slate-900 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-slate-900">
                  {pt.badge}
                </span>
              )}

              <div className="text-3xl mb-2">{pt.emoji}</div>

              <div>
                <h3 className="font-display text-sm text-slate-900 leading-tight mb-0.5">
                  {pt.type.split(' (')[0]}
                </h3>
                <p className="text-[11px] text-slate-600 font-medium leading-tight">
                  {pt.desc}
                </p>
              </div>

              {isSelected && (
                <div className="mt-2 self-end bg-[#F0509B] text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-900">
                  Selected ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Wavy Divider */}
      <WavyDivider color="text-[#F7C948]" />

      {/* Output Format Picker */}
      <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-hard mb-6">
        <h3 className="font-display text-lg text-slate-900 mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#F0509B]" /> Choose Output Format
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-4">
          How do you want your post rendered in the studio?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FORMAT_OPTIONS.map((f) => {
            const isSelected = selectedFormat === f.format;
            return (
              <button
                key={f.format}
                onClick={() => setSelectedFormat(f.format)}
                className={`p-4 rounded-xl border-2 text-left flex flex-col gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFF8EC] border-slate-900 ring-2 ring-[#F0509B] shadow-hard'
                    : 'bg-slate-50 border-slate-300 hover:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  {f.icon}
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-[#F0509B] text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-display text-sm text-slate-900">{f.label}</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
                    {f.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="w-full bg-[#F0509B] text-white font-display text-lg py-3.5 px-6 rounded-xl border-2 border-slate-900 shadow-hard-yellow hover:bg-[#e03d88] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Next: Upload Photos</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
