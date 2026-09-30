import React from 'react';

// Sticker Badge ("New", "Trending", "Pick me", etc.)
export const StickerBadge: React.FC<{
  text: string;
  color?: 'yellow' | 'pink' | 'green' | 'purple' | 'orange';
  rotate?: number;
  className?: string;
}> = ({ text, color = 'yellow', rotate = -3, className = '' }) => {
  const colorClasses = {
    yellow: 'bg-[#F7C948] text-slate-900',
    pink: 'bg-[#F0509B] text-white',
    green: 'bg-[#6B8E23] text-white',
    purple: 'bg-[#9C27B0] text-white',
    orange: 'bg-[#FF5722] text-white',
  };

  return (
    <span
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-block px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] hover:scale-110 transition-transform ${colorClasses[color]} ${className}`}
    >
      {text}
    </span>
  );
};

// Washi Tape Decoration
export const WashiTape: React.FC<{
  position?: 'top-left' | 'top-right' | 'top-center';
  color?: string;
  pattern?: 'stripes' | 'dots' | 'solid';
}> = ({ position = 'top-center', color = 'bg-amber-200/90', pattern = 'stripes' }) => {
  const posClasses = {
    'top-left': '-top-3 -left-3 -rotate-12',
    'top-right': '-top-3 -right-3 rotate-12',
    'top-center': '-top-3 left-1/2 -translate-x-1/2 -rotate-2',
  };

  return (
    <div
      className={`absolute z-20 w-16 h-5 ${color} border border-slate-900/40 shadow-sm opacity-90 backdrop-blur-[1px] pointer-events-none ${posClasses[position]}`}
      style={{
        clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
        backgroundImage:
          pattern === 'stripes'
            ? 'repeating-linear-gradient(45deg, rgba(0,0,0,0.08) 0, rgba(0,0,0,0.08) 3px, transparent 0, transparent 6px)'
            : 'none',
      }}
    />
  );
};

// Push Pin
export const PushPin: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-6 h-6 rounded-full bg-red-600 border-2 border-slate-900 shadow-md flex items-center justify-center ${className}`}>
      <div className="w-2 h-2 rounded-full bg-white/70" />
    </div>
  );
};

// Paper Clip
export const PaperClip: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute -top-3 right-4 z-20 w-4 h-8 border-2 border-slate-800 rounded-full shadow-sm pointer-events-none transform rotate-12 ${className}`} />
  );
};

// Wavy Section Divider
export const WavyDivider: React.FC<{ color?: string; className?: string }> = ({
  color = 'text-[#F0509B]',
  className = '',
}) => {
  return (
    <div className={`w-full overflow-hidden leading-none my-4 ${className}`}>
      <svg
        className={`relative block w-full h-8 ${color}`}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,90 350,-40 500,50 C650,140 900,-30 1200,40 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

// Polaroid Frame Wrapper
export const PolaroidFrame: React.FC<{
  children: React.ReactNode;
  caption?: string;
  rotate?: number;
  tape?: boolean;
  className?: string;
}> = ({ children, caption, rotate = -1, tape = true, className = '' }) => {
  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`relative bg-white p-3 pb-6 rounded border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] transition-all hover:scale-[1.02] hover:z-10 ${className}`}
    >
      {tape && <WashiTape position="top-center" />}
      <div className="w-full aspect-square bg-slate-100 rounded border border-slate-300 overflow-hidden relative">
        {children}
      </div>
      {caption && (
        <p className="mt-2 text-center font-handwriting text-slate-800 font-bold text-base leading-tight truncate">
          {caption}
        </p>
      )}
    </div>
  );
};
