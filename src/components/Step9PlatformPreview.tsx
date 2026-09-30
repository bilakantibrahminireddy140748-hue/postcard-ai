import React, { useState } from 'react';
import { AppState, SocialPlatform } from '../types';
import { StickerBadge, WashiTape } from './DesignElements';
import { PLATFORM_CONFIGS } from '../utils/platforms';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  MoreHorizontal,
  Download,
  Sun,
  Moon,
  Shield,
  Edit2,
  Sparkles,
  Repeat2,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Check,
  Music,
  ArrowLeft,
  RefreshCw,
  Sliders,
  CheckCircle2,
  User,
} from 'lucide-react';

interface Step9Props {
  appState: AppState;
  onUpdateState: (updates: Partial<AppState>) => void;
  onRestart: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
];

export const Step9PlatformPreview: React.FC<Step9Props> = ({
  appState,
  onUpdateState,
  onRestart,
}) => {
  const selectedPlatforms =
    appState.selectedPlatforms && appState.selectedPlatforms.length > 0
      ? appState.selectedPlatforms
      : (['Instagram Post (feed)'] as SocialPlatform[]);

  const [activePlatform, setActivePlatform] = useState<SocialPlatform>(
    appState.activePreviewPlatform || selectedPlatforms[0]
  );

  const [mockupDarkMode, setMockupDarkMode] = useState<boolean>(appState.platformMockupDarkMode || false);
  const [showSafeZone, setShowSafeZone] = useState<boolean>(appState.showSafeZone || false);

  // Editable Profile Info
  const [profileName, setProfileName] = useState(
    appState.previewProfileName || appState.userName || 'Creative Creator'
  );
  const [username, setUsername] = useState(
    appState.previewUsername ||
      (appState.userName ? `@${appState.userName.toLowerCase().replace(/\s+/g, '_')}` : '@postcraft_studio')
  );
  const [profilePic, setProfilePic] = useState(
    appState.previewProfilePic || PRESET_AVATARS[0]
  );
  const [editableCaption, setEditableCaption] = useState(
    appState.editableCaption || appState.generatedPost?.caption || 'Living for these studio vibes! ✨'
  );

  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const activeCfg = PLATFORM_CONFIGS[activePlatform] || PLATFORM_CONFIGS['Instagram Post (feed)'];

  const filterClass = appState.activeFilter ? `filter-${appState.activeFilter}` : '';

  const activePhotoUrl =
    appState.photos.length > 0
      ? appState.photos[0].url
      : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';

  const handlePostIt = () => {
    // Download and copy action
    const textToCopy = `${editableCaption}\n\n${appState.generatedPost?.hashtags?.join(' ') || ''}`;
    navigator.clipboard.writeText(textToCopy);

    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Title */}
      <div className="text-center mb-6">
        <StickerBadge text="Step 9 of 9 — Live Preview" color="pink" rotate={-1} className="mb-2" />
        <h2 className="font-display text-2xl sm:text-3xl text-slate-900 leading-tight">
          Here's how it will look, <span className="text-[#F0509B]">{appState.userName}</span>! 👀
        </h2>
        <p className="font-handwriting text-base text-slate-600 font-bold mt-1">
          Realistic live platform mockup with safe zones, profile controls & AI review
        </p>
      </div>

      {copiedSuccess && (
        <div className="bg-[#00C49F] text-slate-900 border-2 border-slate-900 p-4 rounded-2xl mb-6 shadow-hard text-center font-display text-base animate-bounce flex items-center justify-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-slate-900" />
          <span>Post Exported! Caption & Hashtags copied to clipboard for {activeCfg.name}!</span>
        </div>
      )}

      {/* Multi-Platform Selection Tabs */}
      {selectedPlatforms.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {selectedPlatforms.map((plat) => {
            const pCfg = PLATFORM_CONFIGS[plat];
            const isActive = activePlatform === plat;
            return (
              <button
                key={plat}
                onClick={() => {
                  setActivePlatform(plat);
                  onUpdateState({ activePreviewPlatform: plat });
                }}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-display text-xs border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#F0509B] text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] scale-105'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-slate-800'
                }`}
              >
                {pCfg.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Mockup Control Bar: Light/Dark Mode Toggle & Safe Zone Overlay Toggle */}
      <div className="bg-white rounded-2xl border-2 border-slate-900 p-3 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setMockupDarkMode(!mockupDarkMode)}
            className="px-3 py-1.5 rounded-xl border-2 border-slate-900 bg-[#FFF8EC] text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.9)] hover:bg-amber-100 cursor-pointer"
          >
            {mockupDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" /> Light Mockup Mode
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" /> Dark Mockup Mode
              </>
            )}
          </button>

          {/* Safe Zone Toggle */}
          {activeCfg.hasSafeZone && (
            <button
              onClick={() => setShowSafeZone(!showSafeZone)}
              className={`px-3 py-1.5 rounded-xl border-2 border-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.9)] transition-all cursor-pointer ${
                showSafeZone ? 'bg-[#F7C948] text-slate-900' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#F0509B]" />
              <span>Safe Zone Overlay {showSafeZone ? 'ON' : 'OFF'}</span>
            </button>
          )}
        </div>

        {/* Profile Edit Trigger */}
        <button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="px-3 py-1.5 rounded-xl border-2 border-slate-900 bg-slate-100 text-slate-900 font-bold text-xs flex items-center gap-1 hover:bg-slate-200 cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5 text-slate-700" />
          <span>Edit Profile & Caption</span>
        </button>
      </div>

      {/* Editable Profile Drawer Panel */}
      {isEditingProfile && (
        <div className="bg-[#FFF8EC] rounded-2xl border-3 border-slate-900 p-4 shadow-hard mb-6 text-xs space-y-3">
          <h4 className="font-display text-sm text-slate-900 flex items-center gap-1">
            <User className="w-4 h-4 text-[#F0509B]" /> Customize Live Preview Details
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Display Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-lg p-2 font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Username Handle</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-lg p-2 font-bold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Caption Text</label>
            <textarea
              rows={2}
              value={editableCaption}
              onChange={(e) => setEditableCaption(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-lg p-2 font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Preset Profile Avatar</label>
            <div className="flex gap-2">
              {PRESET_AVATARS.map((url, aIdx) => (
                <button
                  key={aIdx}
                  onClick={() => setProfilePic(url)}
                  className={`w-8 h-8 rounded-full border-2 overflow-hidden ${
                    profilePic === url ? 'ring-2 ring-[#F0509B] border-slate-900' : 'border-slate-300'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REALISTIC MOCKUP CONTAINER */}
      <div className="max-w-md mx-auto mb-6">
        <div
          className={`rounded-[36px] p-3 border-4 border-slate-900 shadow-hard-lg transition-colors ${
            mockupDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
          }`}
        >
          {/* MOCKUP SWITCHER BY PLATFORM */}

          {/* 1. INSTAGRAM POST */}
          {activePlatform === 'Instagram Post (feed)' && (
            <div className="rounded-[28px] overflow-hidden border border-slate-200/20 p-2">
              <div className="flex items-center justify-between pb-2 px-1">
                <div className="flex items-center gap-2">
                  <img src={profilePic} alt="" className="w-8 h-8 rounded-full border border-slate-300 object-cover" />
                  <div>
                    <p className="font-bold text-xs leading-tight">{username.replace('@', '')}</p>
                    <span className="text-[9px] opacity-60">Goa, India</span>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 opacity-70" />
              </div>

              <div className="relative w-full aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img src={activePhotoUrl} alt="" className={`w-full h-full object-cover ${filterClass}`} />
              </div>

              <div className="flex items-center justify-between py-2 px-1">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <MessageCircle className="w-5 h-5" />
                  <Send className="w-5 h-5" />
                </div>
                <Bookmark className="w-5 h-5" />
              </div>

              <div className="px-1 text-xs">
                <p className="font-bold">1,842 likes</p>
                <p className="mt-0.5">
                  <span className="font-bold mr-1">{username.replace('@', '')}</span>
                  {editableCaption}
                </p>
                <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-sky-500 font-bold">
                  {appState.generatedPost?.hashtags?.slice(0, 6).map((h, i) => (
                    <span key={i}>{h}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. INSTAGRAM STORY */}
          {activePlatform === 'Instagram Story' && (
            <div className="relative w-full aspect-[9/16] bg-slate-900 rounded-[28px] overflow-hidden text-white">
              <img src={activePhotoUrl} alt="" className={`w-full h-full object-cover ${filterClass}`} />

              {/* Story Header */}
              <div className="absolute top-3 inset-x-3 z-20 flex flex-col gap-1.5">
                <div className="w-full h-1 bg-white/40 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-white rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <img src={profilePic} alt="" className="w-7 h-7 rounded-full border border-white object-cover" />
                  <span className="font-bold text-xs">{username.replace('@', '')}</span>
                  <span className="text-[10px] opacity-70">2h</span>
                </div>
              </div>

              {/* Story Center Sticker Text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/80 text-white font-display text-sm px-3 py-1.5 rounded-xl border border-white/20 backdrop-blur-xs text-center max-w-[80%]">
                {editableCaption}
              </div>

              {/* Story Bottom Reply Bar */}
              <div className="absolute bottom-3 inset-x-3 z-20 flex items-center gap-2">
                <div className="flex-1 bg-slate-900/60 border border-white/30 rounded-full px-4 py-2 text-xs font-medium text-white/80">
                  Send message...
                </div>
                <Heart className="w-6 h-6 text-white" />
                <Send className="w-6 h-6 text-white" />
              </div>

              {/* Safe Zone Overlay */}
              {showSafeZone && (
                <div className="absolute inset-0 pointer-events-none z-30 border-y-2 border-rose-500/80 bg-rose-500/10 flex flex-col justify-between p-3">
                  <div className="bg-rose-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded w-fit">
                    ⚠️ Header Safe Zone (Header UI)
                  </div>
                  <div className="bg-rose-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded w-fit self-end">
                    ⚠️ Footer Safe Zone (Reply UI)
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. INSTAGRAM REEL / YOUTUBE SHORTS */}
          {(activePlatform === 'Instagram Reel' || activePlatform === 'YouTube Shorts') && (
            <div className="relative w-full aspect-[9/16] bg-slate-900 rounded-[28px] overflow-hidden text-white">
              <img src={activePhotoUrl} alt="" className={`w-full h-full object-cover ${filterClass}`} />

              {/* Right Side Action Icons */}
              <div className="absolute right-3 bottom-16 z-20 flex flex-col items-center gap-4 text-xs font-bold">
                <div className="flex flex-col items-center">
                  <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
                  <span>24.8K</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-7 h-7" />
                  <span>412</span>
                </div>
                <div className="flex flex-col items-center">
                  <Send className="w-7 h-7" />
                  <span>Share</span>
                </div>
              </div>

              {/* Reel Bottom Details */}
              <div className="absolute bottom-4 left-3 right-16 z-20 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <img src={profilePic} alt="" className="w-7 h-7 rounded-full border border-white object-cover" />
                  <span className="font-bold">{username}</span>
                  <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full border border-white/30">
                    Follow
                  </span>
                </div>
                <p className="line-clamp-2 text-xs font-medium leading-snug">{editableCaption}</p>
                <div className="flex items-center gap-1 text-[10px] opacity-80 mt-1">
                  <Music className="w-3 h-3 text-[#F7C948] animate-spin" />
                  <span>Original Audio • {profileName}</span>
                </div>
              </div>

              {/* Safe Zone Overlay */}
              {showSafeZone && (
                <div className="absolute inset-0 pointer-events-none z-30 border-2 border-rose-500/80 bg-rose-500/10 flex flex-col justify-between p-3">
                  <div className="bg-rose-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded w-fit">
                    ⚠️ Safe Zone Top
                  </div>
                  <div className="bg-rose-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded w-fit self-end">
                    ⚠️ Right UI Covered Area
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. FACEBOOK POST */}
          {activePlatform === 'Facebook Post' && (
            <div className="rounded-[24px] overflow-hidden p-2">
              <div className="flex items-center gap-2 mb-2">
                <img src={profilePic} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-300" />
                <div>
                  <h4 className="font-bold text-xs">{profileName}</h4>
                  <span className="text-[10px] opacity-60">2 hrs • 🌐 Public</span>
                </div>
              </div>

              <p className="text-xs font-medium mb-2 leading-relaxed">{editableCaption}</p>

              <div className="w-full aspect-[1.91/1] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-2">
                <img src={activePhotoUrl} alt="" className={`w-full h-full object-cover ${filterClass}`} />
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/20 pt-2 text-xs font-bold">
                <button className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4 text-blue-500" /> Like
                </button>
                <button className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" /> Comment
                </button>
                <button className="flex items-center gap-1">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>
          )}

          {/* 5. LINKEDIN POST */}
          {activePlatform === 'LinkedIn Post' && (
            <div className="rounded-[24px] overflow-hidden p-3 font-sans">
              <div className="flex items-center gap-2 mb-2">
                <img src={profilePic} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-300" />
                <div>
                  <h4 className="font-bold text-xs">{profileName}</h4>
                  <p className="text-[10px] opacity-70 leading-tight">Product Designer & Content Creator • 1st</p>
                  <span className="text-[9px] opacity-50">2h • 🌐</span>
                </div>
              </div>

              <p className="text-xs font-medium mb-3 leading-relaxed whitespace-pre-line">{editableCaption}</p>

              <div className="w-full aspect-[1.91/1] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-2">
                <img src={activePhotoUrl} alt="" className={`w-full h-full object-cover ${filterClass}`} />
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/20 pt-2 text-[11px] font-bold opacity-90">
                <span>👍 Like</span>
                <span>💬 Comment</span>
                <span>🔁 Repost</span>
                <span>📤 Send</span>
              </div>
            </div>
          )}

          {/* 6. WHATSAPP STATUS */}
          {activePlatform === 'WhatsApp Status' && (
            <div className="relative w-full aspect-[9/16] bg-slate-900 rounded-[28px] overflow-hidden text-white">
              <img src={activePhotoUrl} alt="" className={`w-full h-full object-cover ${filterClass}`} />

              <div className="absolute top-3 inset-x-3 z-20 flex flex-col gap-1">
                <div className="w-full h-1 bg-white/40 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-white" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <img src={profilePic} alt="" className="w-7 h-7 rounded-full border border-white object-cover" />
                  <div>
                    <p className="font-bold text-xs">{profileName}</p>
                    <span className="text-[9px] opacity-80">Today, 2:14 PM</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 inset-x-3 z-20 bg-slate-900/80 border border-white/20 rounded-full py-2 px-4 text-xs text-white/70">
                Reply...
              </div>
            </div>
          )}

          {/* 7. PINTEREST PIN */}
          {activePlatform === 'Pinterest Pin' && (
            <div className="rounded-[24px] overflow-hidden p-2">
              <div className="w-full aspect-[2/3] bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200 mb-2">
                <img src={activePhotoUrl} alt="" className={`w-full h-full object-cover ${filterClass}`} />
                <button className="absolute top-3 right-3 bg-[#BD081C] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  Save
                </button>
              </div>

              <h3 className="font-bold text-sm leading-tight mb-1">{appState.briefPrompt || 'Aesthetic Aesthetic Board Pin'}</h3>
              <p className="text-xs text-slate-500 font-medium line-clamp-2">{editableCaption}</p>
            </div>
          )}

          {/* 8. X (TWITTER) POST */}
          {activePlatform === 'X (Twitter) Post' && (
            <div className="rounded-[24px] overflow-hidden p-3">
              <div className="flex items-center gap-2 mb-2">
                <img src={profilePic} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-300" />
                <div>
                  <h4 className="font-bold text-xs">{profileName}</h4>
                  <span className="text-[10px] opacity-60">{username} • 12m</span>
                </div>
              </div>

              <p className="text-xs font-medium mb-2 leading-snug">{editableCaption}</p>

              <div className="w-full aspect-[16/9] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-3">
                <img src={activePhotoUrl} alt="" className={`w-full h-full object-cover ${filterClass}`} />
              </div>

              <div className="flex items-center justify-between text-xs opacity-70 font-bold px-1">
                <span>💬 24</span>
                <span>🔁 82</span>
                <span>❤️ 412</span>
                <span>👁️ 2.4K</span>
              </div>
            </div>
          )}

          {/* 9. SNAPCHAT STORY */}
          {activePlatform === 'Snapchat Story' && (
            <div className="relative w-full aspect-[9/16] bg-slate-900 rounded-[28px] overflow-hidden text-white">
              <img src={activePhotoUrl} alt="" className={`w-full h-full object-cover ${filterClass}`} />

              <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between">
                <span className="font-bold text-xs bg-black/40 px-2 py-0.5 rounded-full">{username}</span>
                <span className="text-xs">👻</span>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-full border-2 border-slate-900 shadow-md">
                {editableCaption}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI CHATBOT FINAL REVIEW CARD */}
      <div className="bg-white rounded-2xl border-3 border-slate-900 p-5 shadow-hard mb-6 relative">
        <WashiTape position="top-right" color="bg-pink-300" />

        <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#F7C948] text-slate-900 border border-slate-900 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-[#F0509B]" />
          </div>
          <div>
            <h3 className="font-display text-base text-slate-900">
              AI Studio Final Review for {activeCfg.name}
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              3 Quick Optimization Tips for {appState.userName}
            </p>
          </div>
        </div>

        <ul className="space-y-2 text-xs font-medium text-slate-800">
          {activeCfg.tips.map((tip, tIdx) => (
            <li key={tIdx} className="flex items-start gap-2 bg-[#FFF8EC] p-2.5 rounded-xl border border-slate-900/20">
              <span className="text-[#F0509B] font-bold font-mono">0{tIdx + 1}.</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* PART 3: MAIN BUTTONS ON PREVIEW SCREEN */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {/* Button 1: "Looks great, post it!" */}
        <button
          onClick={handlePostIt}
          className="bg-[#F0509B] text-white font-display py-3.5 px-4 rounded-xl border-2 border-slate-900 shadow-hard-yellow hover:bg-[#e03d88] flex items-center justify-center gap-1.5 cursor-pointer text-sm col-span-2 sm:col-span-1"
        >
          <Download className="w-4 h-4" />
          <span>Looks great, post it!</span>
        </button>

        {/* Button 2: "Edit again" (go back to stickers & filters Step 8) */}
        <button
          onClick={() => onUpdateState({ step: 8 })}
          className="bg-white text-slate-900 font-display py-3.5 px-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-slate-100 flex items-center justify-center gap-1.5 cursor-pointer text-sm"
        >
          <Sliders className="w-4 h-4" />
          <span>Edit again</span>
        </button>

        {/* Button 3: "Change platform" (go back to platform selection Step 3) */}
        <button
          onClick={() => onUpdateState({ step: 3 })}
          className="bg-[#F7C948] text-slate-900 font-display py-3.5 px-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-amber-400 flex items-center justify-center gap-1.5 cursor-pointer text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Change platform</span>
        </button>

        {/* Button 4: "Try another template" (go back to Step 6) */}
        <button
          onClick={() => onUpdateState({ step: 6 })}
          className="bg-white text-slate-900 font-display py-3.5 px-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-slate-100 flex items-center justify-center gap-1.5 cursor-pointer text-sm"
        >
          <span>Try template</span>
        </button>
      </div>

      {/* Restart session link */}
      <div className="text-center">
        <button
          onClick={onRestart}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 underline cursor-pointer"
        >
          Start a brand new social post project →
        </button>
      </div>
    </div>
  );
};
