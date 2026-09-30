import React, { useState, useRef, useEffect } from 'react';
import { AppState, ChatMessage } from '../types';
import { Sparkles, MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { getThemeKeyForPostType, THEMES } from '../utils/theme';

interface ChatPanelProps {
  appState: AppState;
  onUpdateState: (updates: Partial<AppState>) => void;
}

const QUICK_CHIPS = [
  'Suggest a caption',
  'What should I wear?',
  'Improve my photo',
  'Best hashtags',
];

export const ChatPanel: React.FC<ChatPanelProps> = ({ appState, onUpdateState }) => {
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const themeKey = getThemeKeyForPostType(appState.postType);
  const currentTheme = THEMES[themeKey];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (appState.chatOpen) {
      scrollToBottom();
    }
  }, [appState.chatOpen, appState.chatMessages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMsg).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...appState.chatMessages, userMsg];
    onUpdateState({ chatMessages: updatedMessages });
    setInputMsg('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            name: appState.userName || 'Friend',
            age: appState.userAge || 22,
            postType: appState.postType,
            step: appState.step,
            brief: appState.briefPrompt,
            selectedTemplate: appState.selectedTemplate?.name || '',
            platforms: appState.selectedPlatforms || ['Instagram Post (feed)'],
          },
          history: updatedMessages.slice(-6),
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `assistant_${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        onUpdateState({ chatMessages: [...updatedMessages, assistantMsg] });
      }
    } catch (error) {
      console.error('Error in chat assistant:', error);
      const name = appState.userName || 'Friend';
      const fallbackMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: `Hey ${name}! For the best reach, use warm natural light, add 3-5 relevant hashtags, and keep your first line super catchy! ✨`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onUpdateState({ chatMessages: [...updatedMessages, fallbackMsg] });
    } finally {
      setLoading(false);
    }
  };

  const isProfessional = themeKey === 'professional';

  return (
    <>
      {/* Floating Mascot / Sparkle Button on Every Screen */}
      <button
        onClick={() => onUpdateState({ chatOpen: !appState.chatOpen })}
        className={`fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full border-3 border-slate-900 ${
          isProfessional ? 'bg-[#6B0F1A] text-[#D9C9A8]' : 'bg-[#F0509B] text-white'
        } shadow-hard-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group`}
        title="Open AI Studio Assistant"
      >
        <Sparkles className="w-7 h-7 animate-pulse group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F7C948] rounded-full border border-slate-900" />
      </button>

      {/* Floating Chat Panel Drawer */}
      {appState.chatOpen && (
        <div className={`fixed bottom-22 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-96 max-h-[540px] h-[80vh] rounded-2xl border-3 border-slate-900 shadow-hard-lg z-50 flex flex-col overflow-hidden ${
          isProfessional ? 'bg-[#FAF5EF] text-[#6B0F1A]' : 'bg-[#FFF8EC] text-slate-900'
        }`}>
          {/* Chat Header */}
          <div className={`p-3.5 border-b-2 border-slate-900 flex items-center justify-between ${
            isProfessional ? 'bg-[#6B0F1A] text-white' : 'bg-[#F0509B] text-white'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#F7C948] text-slate-900 border border-slate-900 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display text-sm leading-tight flex items-center gap-1">
                  PostCraft Assistant <Sparkles className="w-3 h-3 text-[#F7C948]" />
                </h3>
                <span className="text-[10px] opacity-90 font-mono">
                  Context: Step {appState.step} • {appState.postType.split(' ')[0]}
                </span>
              </div>
            </div>

            <button
              onClick={() => onUpdateState({ chatOpen: false })}
              className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {appState.chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-[#F7C948] border border-slate-900 flex-shrink-0 flex items-center justify-center text-[10px] font-black">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-xl p-3 border-2 border-slate-900 text-xs leading-relaxed font-medium shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] ${
                      isUser
                        ? 'bg-[#F0509B] text-white rounded-tr-none'
                        : isProfessional
                        ? 'bg-white text-[#6B0F1A] rounded-tl-none font-serif'
                        : 'bg-white text-slate-900 rounded-tl-none font-sans'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[9px] opacity-70 block text-right mt-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-full bg-[#F0509B] text-white border border-slate-900 flex-shrink-0 flex items-center justify-center text-[10px] font-black">
                      {appState.userName ? appState.userName[0].toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2 justify-start items-center text-xs text-slate-500 font-bold p-2 bg-white/80 rounded-xl border border-slate-300 w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F0509B]" />
                <span>Thinking for {appState.userName || 'you'}...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick-Reply Chips */}
          <div className="p-2 border-t border-slate-300 bg-white/70 overflow-x-auto scrollbar-none flex gap-1.5">
            {QUICK_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="flex-shrink-0 text-[10px] font-bold bg-[#FFF8EC] text-slate-900 border border-slate-900 rounded-full px-2.5 py-1 hover:bg-[#F7C948] transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 border-t-2 border-slate-900 bg-white flex gap-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={`Ask styling tips or captions, ${appState.userName || 'friend'}...`}
              className="flex-1 bg-[#FFF8EC] border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              className={`p-2 rounded-xl border-2 border-slate-900 text-white font-bold transition-all ${
                isProfessional ? 'bg-[#6B0F1A]' : 'bg-[#F0509B]'
              } shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
