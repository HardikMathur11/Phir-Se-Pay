import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  ChevronRight, 
  ShieldCheck, 
  Layers, 
  Mail, 
  Zap, 
  X,
  Compass
} from 'lucide-react';

interface EvaluatorTourBannerProps {
  currentStep: number;
  onNavigateStep: (step: number) => void;
  onQuickSimulate: () => Promise<void> | void;
}

export const EvaluatorTourBanner: React.FC<EvaluatorTourBannerProps> = ({
  currentStep,
  onNavigateStep,
  onQuickSimulate,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const steps = [
    { num: 1, label: '1. Fail Checkout', route: 'pay', tab: 'customer' },
    { num: 2, label: '2. Live Ingestion', route: 'dashboard', tab: 'merchant' },
    { num: 3, label: '3. Inspect AI Drawer', route: 'dashboard', tab: 'merchant' },
    { num: 4, label: '4. Demo Inbox', route: 'inbox', tab: 'customer' },
    { num: 5, label: '5. Capture & Verify', route: 'recover', tab: 'customer' },
  ];

  const handleQuickRun = async () => {
    setSimulating(true);
    try {
      await onQuickSimulate();
    } finally {
      setSimulating(false);
    }
  };

  if (minimized) {
    return (
      <div className="bg-[var(--color-ink)] text-white text-xs px-4 py-1.5 flex items-center justify-between z-30 shadow-md">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-recovered)] animate-pulse" />
          <span className="font-semibold font-ui">🎯 2-Minute Evaluator Walkthrough Active</span>
        </div>
        <button
          onClick={() => setMinimized(false)}
          className="text-[11px] underline text-gray-300 hover:text-white font-ui"
        >
          Expand Guide
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-ink)] text-white border-b border-[var(--color-ink-secondary)]/30 px-4 py-2.5 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Left Title & Quick Run Button */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-recovered)] animate-pulse" />
            <span className="font-bold font-ui uppercase tracking-wider text-[11px] text-[var(--color-recovered)]">
              Evaluator Tour
            </span>
          </div>

          <button
            onClick={handleQuickRun}
            disabled={simulating}
            className="bg-[var(--color-recovered)] hover:opacity-90 text-white px-3 py-1 rounded-[var(--radius-pill)] text-[11px] font-semibold font-ui flex items-center space-x-1.5 transition-all disabled:opacity-50 shadow-sm"
          >
            <Play className={`w-3 h-3 ${simulating ? 'animate-spin' : ''}`} />
            <span>{simulating ? 'Simulating Failure...' : '1-Click Auto Run'}</span>
          </button>
        </div>

        {/* Middle Step Pills */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto py-1">
          {steps.map((s) => {
            const isActive = currentStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => onNavigateStep(s.num)}
                className={`px-2.5 py-1 rounded-[var(--radius-pill)] text-[11px] font-medium transition-all flex items-center space-x-1 whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[var(--color-ink)] font-bold shadow-sm'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3 shrink-0 self-end md:self-auto">
          <button
            onClick={() => setMinimized(true)}
            className="text-gray-400 hover:text-white text-[11px] transition-colors"
            title="Minimize banner"
          >
            Hide
          </button>
        </div>
      </div>
    </div>
  );
};
