import React from 'react';
import { StatusPill } from './ui/StatusPill';
import { RadialGauge } from './ui/RadialGauge';
import { SummaryFigure } from './ui/SummaryFigure';
import { HairlineDivider } from './ui/HairlineDivider';
import { TimelineDots } from './ui/TimelineDots';
import { DataTable } from './ui/DataTable';
import { AlertOctagon, CheckCircle2, TrendingUp, Clock, ShieldCheck } from 'lucide-react';

export const StyleGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-10 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="font-display font-semibold text-3xl text-[var(--color-ink)]">
          Elevated Ledger Design System
        </h1>
        <p className="text-xs text-[var(--color-ink-secondary)] font-ui mt-1">
          Internal component guide &amp; token reference. Clean white canvas, soft depth, Fraunces serif, IBM Plex Mono, and Inter.
        </p>
      </div>

      {/* 1. Tokens Palette */}
      <div className="ledger-panel p-6 space-y-4">
        <h3 className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider font-ui">
          1. Color &amp; Surface Tokens
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-data">
          <div className="p-3 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)]">
            <div className="w-full h-8 rounded bg-[var(--color-page-bg)] border border-[var(--color-border)] mb-2" />
            <span className="text-[10px] text-[var(--color-ink-secondary)] block">--color-page-bg</span>
            <span className="font-bold">#FBFBFA</span>
          </div>

          <div className="p-3 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)]">
            <div className="w-full h-8 rounded bg-[var(--color-recovered)] mb-2" />
            <span className="text-[10px] text-[var(--color-ink-secondary)] block">--color-recovered</span>
            <span className="font-bold">#12805C</span>
          </div>

          <div className="p-3 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)]">
            <div className="w-full h-8 rounded bg-[var(--color-pending)] mb-2" />
            <span className="text-[10px] text-[var(--color-ink-secondary)] block">--color-pending</span>
            <span className="font-bold">#B45309</span>
          </div>

          <div className="p-3 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)]">
            <div className="w-full h-8 rounded bg-[var(--color-escalated)] mb-2" />
            <span className="text-[10px] text-[var(--color-ink-secondary)] block">--color-escalated</span>
            <span className="font-bold">#4338CA</span>
          </div>
        </div>
      </div>

      {/* 2. Status Pills */}
      <div className="ledger-panel p-6 space-y-4">
        <h3 className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider font-ui">
          2. Status Pills (Role-colored)
        </h3>
        <div className="flex flex-wrap gap-3">
          <StatusPill label="RECOVERED" color="recovered" />
          <StatusPill label="APPROVAL_REQUIRED" color="pending" />
          <StatusPill label="ESCALATED" color="escalated" />
          <StatusPill label="STOPPED" color="stopped" />
          <StatusPill label="AT_RISK" color="neutral" />
        </div>
      </div>

      {/* 3. Radial Confidence Gauges */}
      <div className="ledger-panel p-6 space-y-4">
        <h3 className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider font-ui">
          3. Radial Confidence Gauges (SVG, ~40px)
        </h3>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <RadialGauge score={94} color="recovered" />
            <span className="text-xs text-[var(--color-ink-secondary)] font-ui">Recovered (94%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <RadialGauge score={76} color="escalated" />
            <span className="text-xs text-[var(--color-ink-secondary)] font-ui">Escalated (76%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <RadialGauge score={52} color="pending" />
            <span className="text-xs text-[var(--color-ink-secondary)] font-ui">Pending (52%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <RadialGauge score={18} color="stopped" />
            <span className="text-xs text-[var(--color-ink-secondary)] font-ui">Stopped (18%)</span>
          </div>
        </div>
      </div>

      {/* 4. Summary Strip & Hero Figure */}
      <div className="ledger-panel p-6 space-y-4">
        <h3 className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider font-ui">
          4. Summary Strip Figures &amp; Hero Moment
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-0 p-3 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)]">
          <SummaryFigure
            label="Revenue at risk"
            value="₹44,970"
            icon={AlertOctagon}
            iconColor="var(--color-pending)"
          />
          <SummaryFigure
            label="Recovered"
            value="₹32,490"
            hero={true}
            accentValue="+₹14,990"
            icon={CheckCircle2}
            iconColor="var(--color-recovered)"
          />
          <SummaryFigure
            label="Recovery rate"
            value="74.2%"
            icon={TrendingUp}
            iconColor="var(--color-recovered)"
          />
          <SummaryFigure
            label="Needs approval"
            value="2"
            icon={Clock}
            iconColor="var(--color-pending)"
          />
        </div>
      </div>

      {/* 5. Timeline Dots (5-Stage Graph) */}
      <div className="ledger-panel p-6 space-y-4">
        <h3 className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider font-ui">
          5. 5-Stage Graph Timeline Dots
        </h3>
        <div className="p-4 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)]">
          <TimelineDots
            stages={[
              { stage: 'DETECT', label: 'Webhook Ingested', timestamp: new Date().toISOString(), actor: 'system', actorLabel: 'HMAC Ingestion', completed: true },
              { stage: 'UNDERSTAND', label: 'AI Diagnosis', timestamp: new Date().toISOString(), actor: 'ai', actorLabel: 'Cognitive Engine', completed: true },
              { stage: 'DECIDE', label: 'Policy Evaluated', timestamp: new Date().toISOString(), actor: 'system', actorLabel: 'Financial Guard', completed: true },
              { stage: 'ACT', label: 'Link Dispatched', timestamp: new Date().toISOString(), actor: 'system', actorLabel: 'Email Provider', completed: true },
              { stage: 'VERIFY', label: 'Capture Verified', timestamp: null, actor: 'system', actorLabel: 'Payment Capture', completed: false },
            ]}
          />
        </div>
      </div>

      {/* 6. Data Table */}
      <div className="ledger-panel p-6 space-y-4">
        <h3 className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider font-ui">
          6. Telemetry Data Table
        </h3>
        <DataTable
          rows={[
            { key: 'Error Code', value: 'BAD_REQUEST_ERROR' },
            { key: 'Reason', value: 'bank_technical_error' },
            { key: 'Payment ID', value: 'pay_live_994827104' },
          ]}
        />
      </div>
    </div>
  );
};
