import React, { useState, useEffect, useRef } from 'react';
import { AppState, GeneratedPost, VideoStoryboard, VideoScene } from '../types';
import { StickerBadge, WashiTape } from './DesignElements';
import { DraggableStickerCanvas } from './DraggableStickerCanvas';
import { create3VideoVariants } from '../utils/storyboard';
import { renderStoryboardToVideo } from '../utils/videoRenderer';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Play,
  Pause,
  Music,
  Share2,
  RefreshCw,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  Loader2,
  Volume2,
  VolumeX,
  Sliders,
  Film,
  Video,
  Scissors,
  Plus,
  Trash2,
  Wand2,
} from 'lucide-react';

interface Step7Props {
  appState: AppState;
  onUpdateState: (updates: Partial<AppState>) => void;
}

const LOADING_MESSAGES = [
  '🎨 Mixing hot pink & sunny yellow palettes...',
  '✨ Stamping tape & polaroid frames...',
  '✍️ Crafting viral Instagram caption with Gemini AI...',
  '🎵 Syncing Web Audio synth beat & transitions...',
  '🎬 Pre-rendering 60fps canvas video stream...',
];

export const Step6GenerateOutput: React.FC<Step7Props> = ({ appState, onUpdateState }) => {
  const [generating, setGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [postData, setPostData] = useState<GeneratedPost | null>(appState.generatedPost || null);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Video State
  const isVideoMode = appState.outputFormat === 'Video' || appState.outputFormat === 'Animated video / Reel';
  const [storyboardVariants, setStoryboardVariants] = useState<VideoStoryboard[]>(appState.storyboards || []);
  const [activeVariantIdx, setActiveVariantIndex] = useState(appState.activeStoryboardIndex || 0);

  const [renderingVideo, setRenderingVideo] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderMsg, setRenderMsg] = useState('');
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(appState.renderedVideoBlobUrl || null);
  const [videoFormat, setVideoFormat] = useState<string>(appState.renderedVideoFormat || 'mp4');

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Selected Sticker ID for Pointer Events canvas
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  useEffect(() => {
    if (!postData) {
      generatePostAndVideo();
    }
  }, []);

  useEffect(() => {
    if (!generating) return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [generating]);

  const generatePostAndVideo = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: appState.briefPrompt,
          postType: appState.postType,
          template: appState.selectedTemplate || {},
          analysis: appState.briefAnalysis || {},
          format: appState.outputFormat,
          photos: appState.photos.map((p) => p.url),
          age: appState.userAge,
          name: appState.userName,
          platforms: appState.selectedPlatforms,
        }),
      });

      const data = await response.json();
      if (data.success && data.post) {
        setPostData(data.post);
        onUpdateState({ generatedPost: data.post });
      }

      // If Video mode, generate 3 Storyboard Variants & Render
      if (isVideoMode) {
        const variants = await create3VideoVariants(
          appState.photos,
          appState.postType,
          appState.selectedPlatforms[0] || 'Instagram Reel',
          appState.briefPrompt
        );

        setStoryboardVariants(variants);
        onUpdateState({ storyboards: variants, activeStoryboardIndex: 0 });

        // Auto render first variant to Canvas Video
        await handleRenderCanvasVideo(variants[0]);
      }
    } catch (error) {
      console.error('Error generating output:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleRenderCanvasVideo = async (storyboardToRender?: VideoStoryboard) => {
    const activeSb = storyboardToRender || storyboardVariants[activeVariantIdx];
    if (!activeSb) return;

    setRenderingVideo(true);
    setRenderProgress(0);

    try {
      const result = await renderStoryboardToVideo(
        activeSb,
        appState.overlayStickers,
        '9:16',
        (info) => {
          setRenderProgress(info.progress);
          setRenderMsg(info.message);
        }
      );

      setVideoBlobUrl(result.blobUrl);
      setVideoFormat(result.format);
      onUpdateState({
        renderedVideoBlobUrl: result.blobUrl,
        renderedVideoFormat: result.format,
      });
    } catch (err) {
      console.error('Error rendering canvas video:', err);
    } finally {
      setRenderingVideo(false);
    }
  };

  const handleUpdateSceneDuration = (sceneIdx: number, newDur: number) => {
    if (!storyboardVariants[activeVariantIdx]) return;
    const updatedScenes = [...storyboardVariants[activeVariantIdx].scenes];
    updatedScenes[sceneIdx] = { ...updatedScenes[sceneIdx], duration: newDur };

    const updatedVariants = [...storyboardVariants];
    updatedVariants[activeVariantIdx] = {
      ...updatedVariants[activeVariantIdx],
      scenes: updatedScenes,
      totalDuration: updatedScenes.reduce((acc, s) => acc + s.duration, 0),
    };

    setStoryboardVariants(updatedVariants);
    onUpdateState({ storyboards: updatedVariants });
  };

  const handleUpdateSceneTransition = (sceneIdx: number, trans: VideoScene['transition']) => {
    if (!storyboardVariants[activeVariantIdx]) return;
    const updatedScenes = [...storyboardVariants[activeVariantIdx].scenes];
    updatedScenes[sceneIdx] = { ...updatedScenes[sceneIdx], transition: trans };

    const updatedVariants = [...storyboardVariants];
    updatedVariants[activeVariantIdx] = {
      ...updatedVariants[activeVariantIdx],
      scenes: updatedScenes,
    };

    setStoryboardVariants(updatedVariants);
    onUpdateState({ storyboards: updatedVariants });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const currentPhotoUrl =
    appState.photos.length > 0
      ? appState.photos[0].url
      : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';

  const activeStoryboard = storyboardVariants[activeVariantIdx];

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <StickerBadge text="Step 7 of 9 — Studio Render" color="yellow" rotate={2} className="mb-2" />
        <h2 className="font-display text-2xl sm:text-3xl text-slate-900 leading-tight">
          Your Rendered Studio Output, <span className="text-[#F0509B]">{appState.userName}</span> ✨
        </h2>
        <p className="font-handwriting text-base text-slate-600 font-bold mt-1">
          {isVideoMode ? 'Beat-synced video reel with canvas rendering & Web Audio BGM!' : 'High-res post graphic preview'}
        </p>
      </div>

      {generating ? (
        <div className="bg-white rounded-2xl border-3 border-slate-900 p-12 text-center shadow-hard flex flex-col items-center justify-center my-8">
          <Sparkles className="w-12 h-12 text-[#F0509B] animate-spin mb-4" />
          <h3 className="font-display text-xl text-slate-900 mb-2">
            Rendering Studio Creation...
          </h3>
          <p className="font-handwriting text-[#F0509B] font-bold text-lg mb-4">
            {LOADING_MESSAGES[loadingStep]}
          </p>
          <div className="w-48 h-3 bg-slate-100 rounded-full border border-slate-900 overflow-hidden">
            <div className="h-full bg-[#F0509B] animate-pulse w-3/4" />
          </div>
        </div>
      ) : (
        <>
          {/* VIDEO VARIANTS TAB SWITCHER IF IN VIDEO MODE */}
          {isVideoMode && storyboardVariants.length > 0 && (
            <div className="mb-4">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                🎬 Select Video Variant (3 Storyboards):
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {storyboardVariants.map((sb, idx) => (
                  <button
                    key={sb.id}
                    onClick={() => {
                      setActiveVariantIndex(idx);
                      onUpdateState({ activeStoryboardIndex: idx });
                      handleRenderCanvasVideo(sb);
                    }}
                    className={`flex-shrink-0 px-3.5 py-2 rounded-xl font-display text-xs border-2 transition-all cursor-pointer ${
                      activeVariantIdx === idx
                        ? 'bg-[#F0509B] text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] scale-105'
                        : 'bg-white text-slate-800 border-slate-300 hover:border-slate-800'
                    }`}
                  >
                    {sb.variantName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MAIN RENDER PHONE FRAME CONTAINER */}
          <div className="max-w-sm mx-auto bg-slate-950 rounded-[38px] p-3 border-4 border-slate-900 shadow-hard-lg relative mb-6">
            <div className="w-32 h-4 bg-slate-900 rounded-b-xl mx-auto absolute top-3 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center gap-2">
              <div className="w-10 h-1 bg-slate-700 rounded-full" />
            </div>

            <div className="w-full bg-[#FFF8EC] rounded-[30px] overflow-hidden pt-7 pb-4 px-3 flex flex-col min-h-[500px] relative">
              {/* Media Player Frame with Pointer Events Draggable Sticker Layer */}
              <DraggableStickerCanvas
                stickers={appState.overlayStickers}
                selectedId={selectedStickerId}
                onSelectSticker={(id) => setSelectedStickerId(id)}
                onChangeStickers={(updated) => onUpdateState({ overlayStickers: updated })}
                className="w-full aspect-[9/16] bg-slate-900 rounded-2xl border-2 border-slate-900 overflow-hidden shadow-sm relative group"
              >
                {isVideoMode && videoBlobUrl ? (
                  <video
                    ref={videoRef}
                    src={videoBlobUrl}
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src={currentPhotoUrl} alt="" className="w-full h-full object-cover" />
                )}

                {/* Video Controls Bar */}
                {isVideoMode && (
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950/90 to-transparent flex items-center justify-between text-white z-30">
                    <button
                      onClick={() => {
                        if (videoRef.current) {
                          if (isPlaying) videoRef.current.pause();
                          else videoRef.current.play();
                          setIsPlaying(!isPlaying);
                        }
                      }}
                      className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 border border-white/40"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold bg-slate-900/80 px-2.5 py-1 rounded-full border border-white/20 backdrop-blur-xs">
                      <Music className="w-3.5 h-3.5 text-[#F7C948] animate-spin" />
                      <span className="truncate max-w-[110px]">
                        {activeStoryboard?.musicMood || 'Web Audio Synth Beat'}
                      </span>
                    </div>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 border border-white/40"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </DraggableStickerCanvas>

              {/* Format Badge Banner */}
              <div className="mt-2 text-center text-xs font-bold text-slate-700 bg-amber-100 p-2 rounded-xl border border-slate-900">
                <span>Exported Format: </span>
                <span className="uppercase text-[#F0509B] font-mono font-black">{videoFormat}</span>
              </div>
            </div>
          </div>

          {/* TIMELINE EDITOR (FOR VIDEO MODE) */}
          {isVideoMode && activeStoryboard && (
            <div className="bg-white rounded-2xl border-3 border-slate-900 p-5 shadow-hard mb-6 relative">
              <WashiTape position="top-right" color="bg-pink-300" />

              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
                <h3 className="font-display text-base text-slate-900 flex items-center gap-1.5">
                  <Film className="w-5 h-5 text-[#F0509B]" /> Video Timeline Editor
                </h3>
                <span className="text-xs font-bold font-mono text-slate-600">
                  Total: {activeStoryboard.totalDuration.toFixed(1)}s
                </span>
              </div>

              {/* Scenes Timeline Track */}
              <div className="space-y-3 text-xs mb-4">
                {activeStoryboard.scenes.map((scene, sIdx) => (
                  <div
                    key={scene.id}
                    className="bg-[#FFF8EC] border-2 border-slate-900 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-display text-sm text-[#F0509B]">Scene 0{sIdx + 1}</span>
                      <img
                        src={scene.mediaUrl}
                        alt=""
                        className="w-12 h-12 object-cover rounded border border-slate-900"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{scene.textOverlay?.content || 'Visual Scene'}</p>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">
                          Motion: {scene.motion}
                        </span>
                      </div>
                    </div>

                    {/* Scene Duration Control */}
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 text-[11px]">Dur:</span>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        step="0.5"
                        value={scene.duration}
                        onChange={(e) =>
                          handleUpdateSceneDuration(sIdx, parseFloat(e.target.value) || 2)
                        }
                        className="w-14 bg-white border border-slate-900 rounded px-2 py-1 font-bold text-center"
                      />
                      <span className="text-[10px] font-bold">s</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Re-render Video Button */}
              <button
                onClick={() => handleRenderCanvasVideo()}
                disabled={renderingVideo}
                className="w-full bg-[#F0509B] text-white font-display text-base py-3 px-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-[#e03d88] flex items-center justify-center gap-2 cursor-pointer"
              >
                {renderingVideo ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Rendering Canvas Video ({renderProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>Apply Timeline Changes & Re-Render Video</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Caption & Hashtags Notepad Card */}
          <div className="bg-white rounded-2xl border-3 border-slate-900 p-6 shadow-hard relative mb-6">
            <WashiTape position="top-left" color="bg-amber-300" />

            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-3">
              <h3 className="font-display text-base text-slate-900">Studio Caption</h3>
              <button
                onClick={() => copyToClipboard(postData?.caption || '')}
                className="bg-[#F7C948] text-slate-900 text-xs font-bold px-3 py-1 rounded-lg border-2 border-slate-900 flex items-center gap-1 cursor-pointer"
              >
                {copiedCaption ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCaption ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <p className="font-handwriting text-lg text-slate-900 font-bold leading-relaxed mb-3">
              {postData?.caption}
            </p>

            <div className="flex flex-wrap gap-1">
              {postData?.hashtags?.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="bg-slate-100 text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded border border-slate-900"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onUpdateState({ step: 6 })}
              className="bg-white text-slate-900 font-bold py-3 px-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Templates
            </button>

            <button
              onClick={() => onUpdateState({ step: 8 })}
              className="flex-1 bg-[#F0509B] text-white font-display text-lg py-3.5 px-6 rounded-xl border-2 border-slate-900 shadow-hard-yellow hover:bg-[#e03d88] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next: Post Editor & Stickers</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
