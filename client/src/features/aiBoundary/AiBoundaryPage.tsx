import React, { useEffect, useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  Sparkles, 
  Lock, 
  Layers, 
  AlertCircle,
  FileCode2,
  Server
} from 'lucide-react';
import { api } from '../../api';

export const AiBoundaryPage: React.FC = () => {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    api.getSystemHealth().then((h) => setHealth(h)).catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/25 text-purple-400 flex items-center justify-center shadow-inner">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">AI Boundary &amp; Safety Architecture</h2>
              <span className="text-[10px] bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                Zero Financial Hallucination
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict isolation between Agentic AI Cognitive Judgment and Deterministic Financial Execution.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-dark-900/90 px-3.5 py-2 rounded-xl border border-white/10 text-xs">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-slate-400">LLM Engine:</span>
          <span className="font-bold text-emerald-400 font-mono">{health?.llmStatus || 'Active (Gemini / Claude)'}</span>
        </div>
      </div>

      {/* Side-by-Side Boundary Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Agentic AI Cognitive Boundary */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/20 shadow-xl space-y-6">
          <div className="flex items-center space-x-3 border-b border-white/5 pb-4">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Agentic AI Responsibilities</h3>
              <p className="text-[10px] text-purple-300 font-mono">JUDGMENT &amp; NATURAL LANGUAGE</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start space-x-2.5 bg-dark-950/60 p-3 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Gateway Text Classification:</strong> Interprets cryptic bank descriptions into structured root causes.</span>
            </li>
            <li className="flex items-start space-x-2.5 bg-dark-950/60 p-3 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Multi-Factor Synthesis:</strong> Correlates merchant failure spikes with customer LTV &amp; issuer health.</span>
            </li>
            <li className="flex items-start space-x-2.5 bg-dark-950/60 p-3 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Intervention Recommendation:</strong> Recommends optimal recovery action from approved playbook.</span>
            </li>
            <li className="flex items-start space-x-2.5 bg-dark-950/60 p-3 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Bilingual Message Drafting:</strong> Crafts empathetic, high-converting recovery copy in English &amp; Hinglish.</span>
            </li>
          </ul>
        </div>

        {/* Right: Deterministic Financial Safety Boundary */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/20 shadow-xl space-y-6">
          <div className="flex items-center space-x-3 border-b border-white/5 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Deterministic Safety Boundary</h3>
              <p className="text-[10px] text-emerald-300 font-mono">FINANCIAL &amp; POLICY SAFEGUARDS</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start space-x-2.5 bg-dark-950/60 p-3 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>HMAC Webhook Verification:</strong> Cryptographic SHA-256 signature verification &amp; deduplication.</span>
            </li>
            <li className="flex items-start space-x-2.5 bg-dark-950/60 p-3 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Integer Paise Financials:</strong> All monetary sums strictly calculated in integer paise (Zero float errors).</span>
            </li>
            <li className="flex items-start space-x-2.5 bg-dark-950/60 p-3 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Hardcoded Policy Limits:</strong> Max 3 automated attempts, max ₹10,000 autonomous amount, 7-day contact caps.</span>
            </li>
            <li className="flex items-start space-x-2.5 bg-dark-950/60 p-3 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Strict RECOVERED Status:</strong> Transitions to RECOVERED <em>only</em> upon verified server payment capture.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
