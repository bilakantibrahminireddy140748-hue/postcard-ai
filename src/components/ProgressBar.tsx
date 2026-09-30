import React from 'react';

interface ProgressBarProps {
  currentStep: number; // 1 to 9
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

const STEP_LABELS = [
  'Welcome',
  'Type & Format',
  'Platforms',
  'Photos',
  'Brief',
  'Template',
  'Output',
  'Finalize',
  'Live Preview',
];

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps = 9,
  onStepClick,
}) => {
  const percentage = Math.min(100, Math.max(0, ((currentStep - 1) / (totalSteps - 1)) * 100));

  return (
    <div className="w-full bg-[#FFF8EC] border-b-2 border-slate-900 py-2 px-3 sticky top-0 z-30 shadow-sm">
      <div className="max-w-xl mx-auto">
        {/* Ruler Ticks Bar */}
        <div className="relative h-6 bg-amber-100/80 rounded border-2 border-slate-900 overflow-hidden flex items-center px-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]">
          {/* Ruler tick marks background */}
          <div className="absolute inset-0 ruler-ticks opacity-30 pointer-events-none" />

          {/* Pencil Line Fill */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-[#F0509B] transition-all duration-500 border-r-2 border-slate-900"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#F7C948] animate-ping" />
          </div>

          {/* Step markers */}
          <div className="relative z-10 w-full flex justify-between items-center text-[10px] font-bold">
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const stepNum = idx + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;

              return (
                <button
                  key={stepNum}
                  onClick={() => onStepClick && stepNum <= currentStep && onStepClick(stepNum)}
                  disabled={stepNum > currentStep}
                  title={STEP_LABELS[idx]}
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-[#F7C948] text-slate-900 border-2 border-slate-900 scale-125 font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,0.9)]'
                      : isCompleted
                      ? 'bg-[#F0509B] text-white border-1 border-slate-900 cursor-pointer hover:scale-110'
                      : 'bg-white/80 text-slate-400 border border-slate-300'
                  }`}
                >
                  {isCompleted ? '✓' : stepNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Step Label */}
        <div className="flex justify-between items-center mt-1 text-xs font-bold text-slate-800">
          <span className="font-handwriting text-sm text-[#F0509B] font-bold">
            Step {currentStep} of {totalSteps}: {STEP_LABELS[currentStep - 1]}
          </span>
          <span className="text-[10px] uppercase tracking-wider bg-slate-900 text-amber-200 px-1.5 py-0.5 rounded border border-slate-900">
            {Math.round((currentStep / totalSteps) * 100)}% CRAFTED
          </span>
        </div>
      </div>
    </div>
  );
};
