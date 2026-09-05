import React from 'react';
import { ShieldCheck, Cpu, Lock, Send, CheckCircle2, Zap, Clock, Check } from 'lucide-react';

interface LivePipelineVisualizerProps {
  activeStage?: 'DETECT' | 'UNDERSTAND' | 'DECIDE' | 'ACT' | 'VERIFY';
  className?: string;
}

export const LivePipelineVisualizer: React.FC<LivePipelineVisualizerProps> = ({
  activeStage = 'ACT',
  className = '',
}) => {
  const stages = [
    {
      id: 'DETECT',
      step: '01',
      title: 'DETECT',
      subtitle: 'HMAC Ingestion',
      icon: Lock,
      metric: '0.0% Duplicates',
      latency: '24ms',
      actor: 'Cryptographic Edge',
      color: 'var(--color-ink)',
    },
    {
      id: 'UNDERSTAND',
      step: '02',
      title: 'UNDERSTAND',
      subtitle: 'Cognitive Engine',
      icon: Cpu,
      metric: '94% Confidence',
      latency: '140ms',
      actor: 'AI Root-Cause Model',
      color: 'var(--color-escalated)',
    },
    {
      id: 'DECIDE',
      step: '03',
      title: 'DECIDE',
      subtitle: 'Policy Guard',
      icon: ShieldCheck,
      metric: '₹10k Limit Cap',
      latency: '4ms',
      actor: 'Deterministic Guard',
      color: 'var(--color-ink)',
    },
    {
      id: 'ACT',
      step: '04',
      title: 'ACT',
      subtitle: 'Second Chance',
      icon: Send,
      metric: 'Bilingual Dispatch',
      latency: '220ms',
      actor: 'Razorpay Links API',
      color: 'var(--color-pending)',
    },
    {
      id: 'VERIFY',
      step: '05',
      title: 'VERIFY',
      subtitle: 'Settlement Lock',
      icon: CheckCircle2,
      metric: 'Server Capture',
      latency: 'Instant',
      actor: 'HMAC Verified Capture',
      color: 'var(--color-recovered)',
    },
  ];

  return (
    <div className={`w-full ledger-panel p-5 sm:p-6 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-recovered)] animate-ping" />
          <h3 className="font-display font-semibold text-sm sm:text-base text-[var(--color-ink)]">
            Autonomous Recovery Graph (5-Stage Pipeline)
          </h3>
        </div>
        <span className="text-[11px] font-data text-[var(--color-ink-secondary)]">
          Deterministic Guardrails + Cognitive Intelligence
        </span>
      </div>

      {/* 5 Stages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
        {stages.map((st, idx) => {
          const Icon = st.icon;
          const isLast = idx === stages.length - 1;

          return (
            <div
              key={st.id}
              className="p-3.5 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] flex flex-col justify-between space-y-3 relative group hover:bg-[var(--color-surface)] transition-all"
            >
              {/* Step & Latency Badge */}
              <div className="flex items-center justify-between">
                <span className="font-data font-bold text-[10px] text-[var(--color-ink-secondary)]">
                  {st.step}
                </span>
                <span className="font-data text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink-tertiary)]">
                  {st.latency}
                </span>
              </div>

              {/* Title & Icon */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: st.color }} />
                  <span className="font-display font-semibold text-xs text-[var(--color-ink)] tracking-tight">
                    {st.title}
                  </span>
                </div>
                <span className="text-[11px] text-[var(--color-ink-secondary)] font-ui block">
                  {st.subtitle}
                </span>
              </div>

              {/* Metric & Actor Footer */}
              <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between">
                <span className="text-[10px] font-data font-semibold" style={{ color: st.color }}>
                  {st.metric}
                </span>
                <span className="text-[9px] font-data text-[var(--color-ink-tertiary)] truncate max-w-[80px]">
                  {st.actor}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
