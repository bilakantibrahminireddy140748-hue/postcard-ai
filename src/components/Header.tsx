import React from 'react';
import { Sparkles, Moon, Sun, RefreshCw, User } from 'lucide-react';
import { AppState } from '../types';
import { getThemeKeyForPostType, THEMES } from '../utils/theme';

interface HeaderProps {
  appState: AppState;
  onUpdateState: (updates: Partial<AppState>) => void;
  onRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ appState, onUpdateState, onRestart }) => {
  const themeKey = getThemeKeyForPostType(appState.postType);
  const currentTheme = THEMES[themeKey];

  return (
    <header className={`w-full ${appState.darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-900 text-slate-900'} border-b-2 py-3 px-4 shadow-sm relative z-20`}>
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & App Title */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onUpdateState({ step: 1 })}>
          <div className="w-9 h-9 rounded-full bg-[#F0509B] border-2 border-slate-900 flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] transform -rotate-3 hover:rotate-6 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-xl tracking-tight leading-none flex items-center gap-1">
              PostCraft <span className="text-[#F0509B] text-xs font-mono px-1.5 py-0.5 bg-pink-100 border border-slate-900 rounded">AI</span>
            </h1>
            <p className="font-handwriting text-xs text-slate-500 font-bold -mt-0.5">
              Gen-Z Content Studio
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* User badge if logged in */}
          {appState.userName && (
            <div className="hidden sm:flex items-center gap-1 bg-amber-100 text-slate-900 border-2 border-slate-900 rounded-full px-2.5 py-1 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]">
              <User className="w-3.5 h-3.5 text-[#F0509B]" />
              <span>{appState.userName} ({appState.userAge})</span>
            </div>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={() => onUpdateState({ darkMode: !appState.darkMode })}
            className="p-2 rounded-full border-2 border-slate-900 bg-amber-200 text-slate-900 hover:bg-amber-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] active:translate-y-0.5 transition-all"
            title="Toggle Dark Mode"
          >
            {appState.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Restart Button */}
          {appState.step > 1 && (
            <button
              onClick={onRestart}
              className="p-2 rounded-full border-2 border-slate-900 bg-rose-200 text-slate-900 hover:bg-rose-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] active:translate-y-0.5 transition-all"
              title="Start Over"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
