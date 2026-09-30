import React, { useState } from 'react';
import { AppState } from './types';
import { getThemeKeyForPostType, THEMES } from './utils/theme';
import { ProgressBar } from './components/ProgressBar';
import { MarqueeTicker } from './components/MarqueeTicker';
import { Header } from './components/Header';
import { Step1Onboarding } from './components/Step1Onboarding';
import { Step2ChooseType } from './components/Step2ChooseType';
import { Step3PlatformSelection } from './components/Step3PlatformSelection';
import { Step3UploadPhotos } from './components/Step3UploadPhotos';
import { Step4BriefPrompt } from './components/Step4BriefPrompt';
import { Step5TemplateSuggestions } from './components/Step5TemplateSuggestions';
import { Step7VariantsStep } from './components/Step7VariantsStep';
import { Step8PostEditor } from './components/Step8PostEditor';
import { Step9PlatformPreview } from './components/Step9PlatformPreview';
import { ChatPanel } from './components/ChatPanel';

const INITIAL_STATE: AppState = {
  userName: '',
  userAge: 22,
  step: 1,

  postType: 'Lifestyle / Vlog',
  outputFormat: 'Picture',
  selectedPlatforms: ['Instagram Post (feed)'],
  activePreviewPlatform: 'Instagram Post (feed)',

  photos: [],
  briefPrompt: '',
  briefAnalysis: null,
  templates: [],
  selectedTemplate: null,
  generatedPost: null,

  activeFilter: 'none',
  overlayStickers: [],
  stickerHistory: [[]],
  stickerHistoryIndex: 0,
  customOverlayText: '',
  selectedMusicMood: 'Golden Hour Acoustic',

  storyboards: [],
  activeStoryboardIndex: 0,
  renderedVideoBlobUrl: null,
  renderedVideoFormat: 'mp4',

  platformMockupDarkMode: false,
  showSafeZone: false,
  previewProfileName: '',
  previewUsername: '',
  previewProfilePic: '',
  editableCaption: '',

  darkMode: false,

  chatOpen: false,
  chatMessages: [
    {
      id: 'init_welcome',
      sender: 'assistant',
      text: "Hey! Welcome to PostCraft AI Studio! ✨ Tell me your name and let's craft an awesome post together!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
};

export default function App() {
  const [appState, setAppState] = useState<AppState>(INITIAL_STATE);

  const handleUpdateState = (updates: Partial<AppState>) => {
    setAppState((prev) => ({ ...prev, ...updates }));
  };

  const handleRestart = () => {
    setAppState((prev) => ({
      ...INITIAL_STATE,
      userName: prev.userName,
      userAge: prev.userAge,
      darkMode: prev.darkMode,
      step: 2,
    }));
  };

  const themeKey = getThemeKeyForPostType(appState.postType);
  const currentTheme = THEMES[themeKey];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        appState.darkMode ? 'bg-slate-950 text-slate-100' : currentTheme.bgBase
      }`}
    >
      {/* Top Header */}
      <Header appState={appState} onUpdateState={handleUpdateState} onRestart={handleRestart} />

      {/* Step Progress Ruler Bar */}
      <ProgressBar
        currentStep={appState.step}
        totalSteps={9}
        onStepClick={(s) => handleUpdateState({ step: s })}
      />

      {/* Scrolling Marquee Ticker */}
      <MarqueeTicker
        bgColor={
          themeKey === 'professional'
            ? 'bg-[#D9C9A8]'
            : themeKey === 'travel'
            ? 'bg-sky-200'
            : themeKey === 'food'
            ? 'bg-amber-200'
            : 'bg-[#F7C948]'
        }
        textColor="text-slate-900"
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-2 py-4 flex flex-col justify-center">
        {appState.step === 1 && (
          <Step1Onboarding appState={appState} onUpdateState={handleUpdateState} />
        )}

        {appState.step === 2 && (
          <Step2ChooseType appState={appState} onUpdateState={handleUpdateState} />
        )}

        {appState.step === 3 && (
          <Step3PlatformSelection appState={appState} onUpdateState={handleUpdateState} />
        )}

        {appState.step === 4 && (
          <Step3UploadPhotos appState={appState} onUpdateState={handleUpdateState} />
        )}

        {appState.step === 5 && (
          <Step4BriefPrompt appState={appState} onUpdateState={handleUpdateState} />
        )}

        {appState.step === 6 && (
          <Step5TemplateSuggestions appState={appState} onUpdateState={handleUpdateState} />
        )}

        {appState.step === 7 && (
          <Step7VariantsStep appState={appState} onUpdateState={handleUpdateState} />
        )}

        {appState.step === 8 && (
          <Step8PostEditor appState={appState} onUpdateState={handleUpdateState} />
        )}

        {appState.step === 9 && (
          <Step9PlatformPreview
            appState={appState}
            onUpdateState={handleUpdateState}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer Scrapbook Note */}
      <footer className="w-full py-4 text-center text-xs font-handwriting text-slate-500 font-bold border-t border-slate-900/10">
        Crafted with ✨ PostCraft AI • Made for Instagram, TikTok, LinkedIn, Shorts & X Creators
      </footer>

      {/* Always-On Floating AI Chat Assistant */}
      <ChatPanel appState={appState} onUpdateState={handleUpdateState} />
    </div>
  );
}
