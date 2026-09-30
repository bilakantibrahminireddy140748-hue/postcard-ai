import React from 'react';

interface MarqueeTickerProps {
  text?: string;
  bgColor?: string;
  textColor?: string;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  text = 'CREATE ✨ POST ✨ SLAY ✨ AESTHETIC POSTCRAFT STUDIO ✨ VIRAL REELS ✨ INSTAGRAM VIBES ✨',
  bgColor = 'bg-[#F7C948]',
  textColor = 'text-slate-900',
}) => {
  return (
    <div className={`w-full overflow-hidden border-y-2 border-slate-900 py-1.5 ${bgColor} ${textColor} text-xs font-bold font-mono tracking-wider shadow-sm`}>
      <div className="animate-marquee whitespace-nowrap flex items-center gap-6">
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
};
