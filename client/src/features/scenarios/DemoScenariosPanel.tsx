import React, { useState } from 'react';
import { 
  Zap, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Ban,
  Cpu,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { api } from '../../api';

export const DemoScenariosPanel: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [scenarioResult, setScenarioResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const scenarios = [
    {
      id: 'duplicate_webhook',
      tag: 'Scenario B',
      badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
      name: 'Duplicate Webhook Replay (Idempotency)',
      description: 'Replays the exact same webhook payload twice. Verifies that the duplicate event is safely suppressed without duplicate recovery cases, duplicate emails, or duplicate revenue addition.',
    },
    {
      id: 'opt_out',
      tag: 'Scenario C',
      badgeColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
      name: 'Customer Opt-Out Enforcement',
      description: 'Enables communication opt-out for customer. Verifies that deterministic policy safety guard immediately blocks recovery outreach and logs an opt-out audit trail.',
    },
    {
      id: 'high_value_approval',
      tag: 'Scenario D',
      badgeColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
      name: 'High-Value Merchant Approval (₹25,000)',
      description: 'Simulates a high-value failed payment (₹25,000 > ₹10,000 autonomous threshold). Verifies that case status transitions to APPROVAL_REQUIRED and awaits manual merchant approval.',
    },
    {
      id: 'ai_timeout',
      tag: 'Scenario F',
      badgeColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
      name: 'AI Timeout & Ambiguous Fallback',
      description: 'Simulates an ambiguous unrecognized gateway error with LLM timeout. Verifies safe fallback to deterministic rules or operator queue without executing unsafe actions.',
    },
  ];

  const handleRunScenario = async (scId: string) => {
    setLoading(true);
    setActiveScenario(scId);
    setScenarioResult(null);

    try {
      const res = await api.triggerScenario(scId);
      setScenarioResult(res);
    } catch (err: any) {
      setScenarioResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/25 text-amber-400 flex items-center justify-center shadow-inner">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Failure Scenarios Control Panel</h2>
              <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                Judge Test Suite
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute edge cases and failure injections to evaluate deterministic safety safeguards in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {scenarios.map((sc) => (
          <div
            key={sc.id}
            className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-sky-500/30 transition-all duration-300 flex flex-col justify-between shadow-xl group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${sc.badgeColor}`}>
                  {sc.tag}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">1-Click Test</span>
              </div>

              <h4 className="font-bold text-white text-base mb-2 group-hover:text-sky-300 transition-colors">
                {sc.name}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">{sc.description}</p>
            </div>

            <button
              onClick={() => handleRunScenario(sc.id)}
              disabled={loading && activeScenario === sc.id}
              className="w-full bg-dark-900/90 hover:bg-sky-600 text-slate-200 hover:text-white text-xs font-bold py-3 rounded-2xl border border-white/10 hover:border-sky-500 flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${loading && activeScenario === sc.id ? 'animate-spin' : ''}`} />
              <span>{loading && activeScenario === sc.id ? 'Executing Simulation...' : 'Execute Scenario'}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Results Terminal Box */}
      {scenarioResult && (
        <div className="glass-panel p-6 rounded-3xl border border-sky-500/30 shadow-glow-sky/20 space-y-3 animate-fadeIn">
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-400">
            <CheckCircle className="w-4 h-4" />
            <span>Scenario Execution Telemetry Output</span>
          </div>
          <pre className="bg-dark-950/90 p-4 rounded-2xl text-xs font-mono text-slate-300 overflow-x-auto border border-white/10 shadow-inner">
            {JSON.stringify(scenarioResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
