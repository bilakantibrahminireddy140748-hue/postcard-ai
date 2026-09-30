import React, { useState } from 'react';
import { AppState, BriefAnalysis } from '../types';
import { StickerBadge, WashiTape } from './DesignElements';
import { Sparkles, ArrowRight, ArrowLeft, Edit3, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

interface Step4Props {
  appState: AppState;
  onUpdateState: (updates: Partial<AppState>) => void;
}

const BRIEF_EXAMPLES = [
  'Goa trip with friends, beachy, sunset chill vibe',
  'Monochrome streetwear OOTD fit check with urban backdrop',
  'Cozy weekend cafe coffee dump, aesthetic pastry shots',
  'Product launch promo for handmade organic candles',
  'Morning workout grind, high energy motivational reel',
];

export const Step4BriefPrompt: React.FC<Step4Props> = ({ appState, onUpdateState }) => {
  const [promptInput, setPromptInput] = useState(appState.briefPrompt || '');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BriefAnalysis | null>(appState.briefAnalysis || null);
  const [errorText, setErrorText] = useState('');

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim() && appState.photos.length === 0) {
      setErrorText('Please write a brief prompt or upload at least one photo!');
      return;
    }

    setLoading(true);
    setErrorText('');

    try {
      const response = await fetch('/api/analyze-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptInput.trim() || 'Aesthetic social media post',
          postType: appState.postType,
          photos: appState.photos.map((p) => p.url),
          age: appState.userAge,
          name: appState.userName,
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
        onUpdateState({
          briefPrompt: promptInput.trim(),
          briefAnalysis: data.analysis,
        });
      } else {
        throw new Error('Analysis failed');
      }
    } catch (err) {
      console.error('Error analyzing brief:', err);
      // Fallback local analysis
      const fallback: BriefAnalysis = {
        theme: promptInput.trim() || 'Aesthetic Story Vibe',
        mood: 'Vibrant, sun-drenched & trendy',
        colors: ['#F0509B', '#F7C948', '#00C49F', '#FFF8EC'],
        outfitStyle: 'Casual chic & effortless',
        location: 'Scenic backdrop',
        targetAudience: 'Instagram & TikTok followers',
        recommendedFormat: appState.outputFormat || 'Picture',
        moodChips: ['✨ Vibrant', '📸 Aesthetic', '🌴 Chill', '🔥 Trending', '🤍 Memory'],
      };
      setAnalysisResult(fallback);
      onUpdateState({
        briefPrompt: promptInput.trim(),
        briefAnalysis: fallback,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (!analysisResult) {
      handleAnalyze();
      return;
    }
    onUpdateState({ step: 6 });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <StickerBadge text="Step 5 of 9" color="green" rotate={-2} className="mb-2" />
        <h2 className="font-display text-2xl sm:text-3xl text-slate-900 leading-tight">
          Describe Your Post Vibe, <span className="text-[#F0509B]">{appState.userName}</span> ✨
        </h2>
        <p className="font-handwriting text-base text-slate-600 font-bold mt-1">
          Tell AI what story, mood or style you want in your scrapbook post
        </p>
      </div>

      {/* Notebook-Style Text Box */}
      <div className="bg-[#FFF8EC] rounded-2xl border-3 border-slate-900 p-6 shadow-hard relative mb-6">
        <WashiTape position="top-left" color="bg-amber-300" />
        <WashiTape position="top-right" color="bg-pink-300" />

        <label className="block font-display text-sm text-slate-900 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Edit3 className="w-4 h-4 text-[#F0509B]" /> Notebook Brief
          </span>
          <span className="text-[10px] text-slate-500 font-normal">Handwritten style prompt</span>
        </label>

        <textarea
          value={promptInput}
          onChange={(e) => {
            setPromptInput(e.target.value);
            setErrorText('');
          }}
          placeholder="Goa trip with friends, beachy, sunset chill vibe..."
          rows={3}
          className="w-full bg-white border-2 border-slate-900 rounded-xl p-4 font-handwriting text-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#F0509B] shadow-inner placeholder:text-slate-400 leading-relaxed resize-none"
        />

        {/* Quick Example Chips */}
        <div className="mt-3">
          <span className="text-[11px] font-bold text-slate-600 block mb-1.5">Quick Inspiration Chips:</span>
          <div className="flex flex-wrap gap-1.5">
            {BRIEF_EXAMPLES.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPromptInput(ex);
                  setErrorText('');
                }}
                className="text-[11px] font-bold bg-white text-slate-800 border border-slate-900 rounded-full px-2.5 py-1 hover:bg-[#F7C948] transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,0.9)] cursor-pointer"
              >
                + {ex}
              </button>
            ))}
          </div>
        </div>

        {errorText && (
          <div className="mt-3 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-300 p-2 rounded">
            {errorText}
          </div>
        )}

        <button
          onClick={() => handleAnalyze()}
          disabled={loading}
          className="mt-4 w-full bg-[#F7C948] text-slate-900 font-display text-base py-3 px-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
              <span>Analyzing Vibe & Photos with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-[#F0509B]" />
              <span>{analysisResult ? 'Re-Analyze Brief' : 'Analyze Vibe with Gemini AI'}</span>
            </>
          )}
        </button>
      </div>

      {/* "Here's what I understood" Summary Card */}
      {analysisResult && (
        <div className="bg-white rounded-2xl border-3 border-slate-900 p-6 shadow-hard-pink mb-6 transform -rotate-1 relative">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
            <h3 className="font-display text-lg text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#00C49F]" /> Here's what I understood!
            </h3>
            <span className="bg-[#F0509B] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-slate-900">
              AI Insight
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-black uppercase text-slate-500 tracking-wider">Theme Title:</span>
              <p className="font-display text-base text-slate-900 mt-0.5">{analysisResult.theme}</p>
            </div>

            <div>
              <span className="font-black uppercase text-slate-500 tracking-wider">Overall Mood:</span>
              <p className="text-slate-800 font-bold mt-0.5">{analysisResult.mood}</p>
            </div>

            {/* Mood Chips */}
            <div>
              <span className="font-black uppercase text-slate-500 tracking-wider block mb-1">
                Detected Mood Chips:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.moodChips?.map((chip, idx) => (
                  <span
                    key={idx}
                    className="bg-[#FFF8EC] text-slate-900 border-2 border-slate-900 px-2.5 py-1 rounded-full text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-300">
                <span className="font-bold text-slate-600 block text-[10px] uppercase">Styling & Outfit:</span>
                <p className="text-slate-800 font-medium text-[11px] mt-0.5">{analysisResult.outfitStyle}</p>
              </div>
              <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-300">
                <span className="font-bold text-slate-600 block text-[10px] uppercase">Suggested Target:</span>
                <p className="text-slate-800 font-medium text-[11px] mt-0.5">{analysisResult.targetAudience}</p>
              </div>
            </div>

            {/* Suggested Palette */}
            <div>
              <span className="font-black uppercase text-slate-500 tracking-wider block mb-1">
                Extracted Palette:
              </span>
              <div className="flex gap-2">
                {analysisResult.colors?.map((hex, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.9)]"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-[10px] font-mono text-slate-600">{hex}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onUpdateState({ step: 4 })}
          className="bg-white text-slate-900 font-bold py-3 px-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          onClick={handleNextStep}
          className="flex-1 bg-[#F0509B] text-white font-display text-lg py-3.5 px-6 rounded-xl border-2 border-slate-900 shadow-hard-yellow hover:bg-[#e03d88] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Next: Template Suggestions</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
