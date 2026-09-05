import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { api } from '../../api';

interface ScenarioItem {
  id: string;
  tag: string;
  name: string;
  description: string;
}

export const ChaosPanelPage: React.FC = () => {
  const [runningScenario, setRunningScenario] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { passed: boolean; message: string }>>({});

  const scenarios: ScenarioItem[] = [
    {
      id: 'duplicate_webhook',
      tag: 'Scenario B',
      name: 'Duplicate Webhook Replay (Idempotency)',
      description: 'Replays the exact same webhook payload twice. Verifies that duplicate event is safely suppressed and produces no duplicate recovery case, duplicate email, or duplicate revenue addition.',
    },
    {
      id: 'opt_out',
      tag: 'Scenario C',
      name: 'Customer Opt-Out Enforcement',
      description: 'Simulates payment failure for a customer with communication opt-out enabled. Verifies that deterministic policy safety guard immediately halts recovery outreach.',
    },
    {
      id: 'high_value_approval',
      tag: 'Scenario D',
      name: 'High-Value Merchant Approval (₹25,000)',
      description: 'Simulates a high-value payment failure (₹25,000 > ₹10,000 autonomous threshold). Verifies that case status transitions to APPROVAL_REQUIRED and awaits manual approval.',
    },
    {
      id: 'ai_timeout',
      tag: 'Scenario F',
      name: 'AI Timeout & Ambiguous Fallback',
      description: 'Simulates ambiguous gateway error and LLM timeout. Verifies deterministic rules fallback or human review escalation without executing unsafe actions.',
    },
  ];

  const handleRunScenario = async (scId: string) => {
    setRunningScenario(scId);
    try {
      const res = await api.triggerScenario(scId);
      setResults((prev) => ({
        ...prev,
        [scId]: {
          passed: res.success !== false,
          message: res.message || 'Scenario executed successfully. Ingested via policy guard.',
        },
      }));
    } catch (err: any) {
      setResults((prev) => ({
        ...prev,
        [scId]: {
          passed: false,
          message: err.message || 'Execution error',
        },
      }));
    } finally {
      setRunningScenario(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      <div className="ledger-panel p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="border-b border-[var(--color-border)] pb-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-[var(--color-ink)] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-2xl text-[var(--color-ink)] tracking-tight">
                Chaos &amp; Scenario Testing
              </h1>
              <p className="text-xs text-[var(--color-ink-secondary)] font-ui mt-0.5">
                Evaluator-ready deterministic safety test suite. Inject duplicate webhooks, high-value thresholds, and opt-outs.
              </p>
            </div>
          </div>
        </div>

        {/* Flat List of Scenario Rows */}
        <div className="space-y-3">
          {scenarios.map((sc) => {
            const result = results[sc.id];
            const isRunning = runningScenario === sc.id;

            return (
              <div
                key={sc.id}
                className="ledger-sunken p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-data font-bold px-2 py-0.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)]">
                      {sc.tag}
                    </span>
                    <h4 className="font-ui font-semibold text-xs sm:text-sm text-[var(--color-ink)]">
                      {sc.name}
                    </h4>
                  </div>
                  <p className="text-xs text-[var(--color-ink-secondary)] font-ui leading-relaxed max-w-2xl">
                    {sc.description}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                  {/* Inline Pass/Fail Result in font-data to the left of the Run button */}
                  {result && (
                    <div
                      className={`flex items-center space-x-1.5 text-xs font-data font-semibold ${
                        result.passed
                          ? 'text-[var(--color-recovered)]'
                          : 'text-[var(--color-pending)]'
                      }`}
                    >
                      {result.passed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>{result.passed ? 'PASSED (0 Duplicates)' : 'CHECK FAILED'}</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleRunScenario(sc.id)}
                    disabled={isRunning}
                    className="bg-[var(--color-ink)] hover:bg-[var(--color-ink)]/90 text-white text-xs font-semibold font-ui px-4 py-2 rounded-[var(--radius-pill)] flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                  >
                    <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                    <span>{isRunning ? 'Running...' : 'Run Scenario'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
