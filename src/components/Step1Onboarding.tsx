import React, { useState } from 'react';
import { Sparkles, ArrowRight, Heart, Smile } from 'lucide-react';
import { AppState } from '../types';
import { StickerBadge, WashiTape } from './DesignElements';

interface Step1Props {
  appState: AppState;
  onUpdateState: (updates: Partial<AppState>) => void;
}

export const Step1Onboarding: React.FC<Step1Props> = ({ appState, onUpdateState }) => {
  const [nameInput, setNameInput] = useState(appState.userName || '');
  const [ageInput, setAgeInput] = useState(appState.userAge ? String(appState.userAge) : '');
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setErrorMsg('Please tell us your name to personalize your studio!');
      return;
    }
    const ageNum = parseInt(ageInput, 10);
    if (!ageNum || ageNum < 5 || ageNum > 120) {
      setErrorMsg('Please enter a valid age so we can tailor the captions & vibe!');
      return;
    }

    onUpdateState({
      userName: nameInput.trim(),
      userAge: ageNum,
      step: 2,
      // Initialize greeting chat
      chatMessages: [
        {
          id: 'welcome_1',
          sender: 'assistant',
          text: `Hey ${nameInput.trim()}! Welcome to PostCraft AI! ✨ What kind of post are we creating today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    });
  };

  return (
    <div className="w-full max-w-md mx-auto py-6 px-4 flex flex-col items-center">
      {/* Top sticker badge */}
      <div className="mb-3">
        <StickerBadge text="✨ Gen-Z AI Studio" color="yellow" rotate={-4} />
      </div>

      {/* Main Hero Headline */}
      <h1 className="font-display text-3xl sm:text-4xl text-center leading-tight text-slate-900 mb-2 drop-shadow-sm">
        Hey! Let's make something <span className="text-[#F0509B] underline decoration-wavy decoration-[#F7C948]">magic ✨</span>
      </h1>
      <p className="font-handwriting text-lg text-center text-slate-700 font-bold mb-6">
        Turn your photos & ideas into viral Instagram posts, reels & videos!
      </p>

      {/* Flower-masked Hero Graphic */}
      <div className="relative mb-8 group">
        <div className="w-48 h-48 mask-flower bg-gradient-to-tr from-[#F0509B] via-[#F7C948] to-[#90EE90] p-1 shadow-hard-lg animate-float">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
            alt="Creative Studio Vibes"
            className="w-full h-full object-cover mask-flower scale-105 group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Floating Doodles / Badges around graphic */}
        <div className="absolute -bottom-2 -left-4 bg-[#F7C948] border-2 border-slate-900 rounded-lg px-2.5 py-1 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] transform -rotate-6">
          📸 Photo Magic
        </div>
        <div className="absolute -top-2 -right-4 bg-[#F0509B] text-white border-2 border-slate-900 rounded-full p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] transform rotate-12">
          <Heart className="w-4 h-4 fill-white" />
        </div>
      </div>

      {/* Sticker-Style Input Card */}
      <form
        onSubmit={handleStart}
        className="w-full bg-white rounded-2xl border-3 border-slate-900 p-6 shadow-hard-pink relative flex flex-col gap-4 transform rotate-1 hover:rotate-0 transition-all"
      >
        <WashiTape position="top-center" color="bg-amber-200" />

        <div className="text-center mb-1">
          <h2 className="font-display text-xl text-slate-900 flex items-center justify-center gap-1.5">
            <Smile className="w-5 h-5 text-[#F0509B]" /> Welcome to your Studio!
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Tell us about yourself so PostCraft AI can personalize your style!
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-100 border-2 border-rose-500 text-rose-800 text-xs font-bold p-2.5 rounded-lg text-center">
            {errorMsg}
          </div>
        )}

        {/* Name Input */}
        <div>
          <label className="block text-xs font-black uppercase text-slate-700 mb-1">
            What's your name?
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              setErrorMsg('');
            }}
            placeholder="e.g. Alex or Maya"
            className="w-full bg-[#FFF8EC] border-2 border-slate-900 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#F0509B] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] placeholder:text-slate-400"
          />
        </div>

        {/* Age Input */}
        <div>
          <label className="block text-xs font-black uppercase text-slate-700 mb-1">
            Your Age
          </label>
          <input
            type="number"
            min="5"
            max="120"
            value={ageInput}
            onChange={(e) => {
              setAgeInput(e.target.value);
              setErrorMsg('');
            }}
            placeholder="e.g. 21"
            className="w-full bg-[#FFF8EC] border-2 border-slate-900 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#F0509B] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] placeholder:text-slate-400"
          />
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
            We adapt tone, safety filters & slang based on your age group.
          </span>
        </div>

        {/* Start Button */}
        <button
          type="submit"
          className="mt-2 w-full bg-[#F0509B] text-white font-display text-lg py-3.5 px-6 rounded-xl border-2 border-slate-900 shadow-hard-yellow hover:bg-[#e03d88] active:translate-y-1 transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Let's Craft Posts!</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};
