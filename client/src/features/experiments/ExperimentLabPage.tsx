import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Play, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders, 
  RotateCw 
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { api } from '../../api';
import { EvalComparisonViewData } from '../../types';

export const ExperimentLabPage: React.FC = () => {
  const [data, setData] = useState<EvalComparisonViewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState(42);
  const [caseCount, setCaseCount] = useState(500);
  const [maxAmountLimit, setMaxAmountLimit] = useState(10000);
  const [maxAttempts, setMaxAttempts] = useState(3);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const res = await api.getEvalComparisonView();
      setData(res);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, []);

  const handleRunBatch = async () => {
    setLoading(true);
    try {
      await api.runBatchSimulation(seed, caseCount);
      await fetchComparison();
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      <div className="ledger-panel p-6 sm:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-[var(--color-ink)] flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-2xl text-[var(--color-ink)] tracking-tight">
                Experiment Lab
              </h1>
              <p className="text-xs text-[var(--color-ink-secondary)] font-ui mt-0.5">
                Monte Carlo batch evaluation comparing Control baseline strategy vs Adaptive Phir Se Pay engine.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-[var(--color-surface-sunken)] px-3 py-1.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] text-xs font-data">
              <span className="text-[var(--color-ink-secondary)]">Seed:</span>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                className="w-14 bg-transparent text-[var(--color-ink)] font-bold focus:outline-none"
              />
            </div>

            <button
              onClick={handleRunBatch}
              disabled={loading}
              className="bg-[var(--color-ink)] hover:bg-[var(--color-ink)]/90 text-white text-xs font-semibold font-ui px-4 py-2 rounded-[var(--radius-pill)] flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Simulating...' : 'Run 500+ Batch'}</span>
            </button>
          </div>
        </div>

        {/* Policy Sliders (Feature 8) */}
        <div className="p-4 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] space-y-3">
          <div className="flex items-center justify-between text-xs font-ui font-semibold text-[var(--color-ink)]">
            <span className="flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-[var(--color-ink-secondary)]" />
              <span>Policy Guard Parameter Sliders (What-If Analysis)</span>
            </span>
            <span className="text-[10px] text-[var(--color-ink-secondary)] font-data font-normal">
              Real-time Simulation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-ink-secondary)] font-ui">Autonomous Amount Limit</span>
                <span className="font-data font-semibold text-[var(--color-ink)]">₹{maxAmountLimit.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={maxAmountLimit}
                onChange={(e) => setMaxAmountLimit(Number(e.target.value))}
                className="w-full accent-[var(--color-ink)]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-ink-secondary)] font-ui">Max Automated Attempts</span>
                <span className="font-data font-semibold text-[var(--color-ink)]">{maxAttempts} attempts</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Number(e.target.value))}
                className="w-full accent-[var(--color-ink)]"
              />
            </div>
          </div>
        </div>

        {/* Two-Column Comparison Card with Incremental Callout in Between */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* Left: Baseline Column (5 cols) */}
            <div className="md:col-span-5 p-6 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-secondary)] font-ui block">
                Control Baseline (Generic Retry)
              </span>
              <div className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-ink-secondary)]">
                ₹{((data.baseline.recoveredInPaise || 0) / 100).toLocaleString('en-IN')}
              </div>
              <span className="text-xs font-data text-[var(--color-ink-secondary)] block">
                {data.baseline.recoveryRatePercent}% recovery rate
              </span>
            </div>

            {/* Center: Standalone Incremental Difference Callout (1 col) */}
            <div className="md:col-span-1 text-center py-2 flex flex-col items-center justify-center">
              <span className="text-[10px] font-semibold text-[var(--color-recovered)] uppercase tracking-wider font-ui block">
                Lift
              </span>
              <span className="font-display italic font-semibold text-xl text-[var(--color-recovered)] block">
                +₹{((data.incrementalInPaise || 0) / 100).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Right: Phir Se Pay Column (5 cols) */}
            <div className="md:col-span-5 p-6 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] font-ui block">
                Phir Se Pay (AI Agent Engine)
              </span>
              <div className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-recovered)]">
                ₹{((data.treatment.recoveredInPaise || 0) / 100).toLocaleString('en-IN')}
              </div>
              <span className="text-xs font-data font-semibold text-[var(--color-recovered)] block">
                {data.treatment.recoveryRatePercent}% recovery rate (+{data.incrementalLiftPercent}% lift)
              </span>
            </div>
          </div>
        )}

        {/* Recharts Flat Bar Comparison Chart */}
        {data && data.chartSeries && (
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-lg text-[var(--color-ink)]">
              Recovery Performance by Failure Category (%)
            </h3>

            <div className="p-6 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartSeries} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="category" stroke="var(--color-ink-secondary)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--color-ink-secondary)" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      borderRadius: 'var(--radius-tile)',
                      fontSize: '11px',
                      fontFamily: 'var(--font-data)',
                    }}
                    formatter={(val: any) => [`${val}%`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-ui)' }} />
                  {/* Flat style: one neutral + one emerald series */}
                  <Bar dataKey="baseline" name="Control (Generic)" fill="var(--color-ink-secondary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="treatment" name="Phir Se Pay" fill="var(--color-recovered)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
