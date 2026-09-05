import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  Send,
  Ban,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  Lock,
  Activity
} from 'lucide-react';
import { api } from '../../api';
import { RecoveryCase, Customer, PolicyCheckResult, AuditEvent } from '../../types';

interface CaseDetailPageProps {
  caseId: string;
  onBack: () => void;
}

export const CaseDetailPage: React.FC<CaseDetailPageProps> = ({ caseId, onBack }) => {
  const [detail, setDetail] = useState<{
    case: RecoveryCase;
    customer: Customer;
    payment: any;
    order: any;
    policyResult: PolicyCheckResult;
    scoreFactors: any;
    interventions: any[];
    auditEvents: AuditEvent[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const data = await api.getCaseDetail(caseId);
      setDetail(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [caseId]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await api.approveCase(caseId);
      await fetchDetail();
    } catch {
      // silent
    } finally {
      setActionLoading(false);
    }
  };

  const handleStop = async () => {
    setActionLoading(true);
    try {
      await api.stopCase(caseId);
      await fetchDetail();
    } catch {
      // silent
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !detail) {
    return (
      <div className="max-w-5xl mx-auto py-24 text-center text-slate-400">
        <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold">Performing deep gateway telemetry &amp; AI diagnosis analysis...</p>
      </div>
    );
  }

  const c = detail.case;
  const p = detail.payment;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2.5 bg-dark-900/80 hover:bg-dark-800 text-slate-300 hover:text-white rounded-xl border border-white/10 transition-colors shadow-sm"
            title="Back to case ledger"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-lg font-mono font-bold text-sky-400">{c.id}</span>
              <span
                className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                  c.status === 'RECOVERED'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : c.status === 'APPROVAL_REQUIRED'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : c.status === 'STOPPED'
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    : 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                }`}
              >
                {c.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Customer: <strong className="text-slate-200">{detail.customer?.name || 'Amit Sharma'}</strong> ({detail.customer?.email})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {c.status === 'APPROVAL_REQUIRED' && (
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="btn-shimmer text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionLoading ? 'Approving...' : 'Approve & Dispatch Recovery'}</span>
            </button>
          )}

          {c.status !== 'RECOVERED' && c.status !== 'STOPPED' && (
            <button
              onClick={handleStop}
              disabled={actionLoading}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition-colors"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Stop Recovery Action</span>
            </button>
          )}
        </div>
      </div>

      {/* Side-by-Side: Raw Facts vs AI Interpretation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel 1: Raw Gateway Facts (Deterministic) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-white/5 pb-4 text-emerald-400">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Raw Gateway Facts</h3>
              <p className="text-[10px] text-slate-400 font-mono">DETERMINISTIC RAZORPAY TELEMETRY</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Provider</span>
              <span className="font-bold text-slate-200 uppercase font-mono">RAZORPAY API</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Payment ID</span>
              <span className="font-mono font-bold text-sky-400">{p?.providerPaymentId || c.originalPaymentId}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Order ID</span>
              <span className="font-mono text-slate-300">{p?.providerOrderId || c.originalOrderId}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Failed Amount</span>
              <span className="font-mono font-bold text-white">₹{(c.amountAtRiskInPaise / 100).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Payment Method</span>
              <span className="font-mono text-slate-300 uppercase">{p?.method || 'card'}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Failure Code</span>
              <span className="font-mono font-bold text-rose-400">{p?.failureCode || 'BAD_REQUEST_ERROR'}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Failure Reason</span>
              <span className="font-mono font-bold text-amber-400">{p?.failureReason || 'bank_technical_error'}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Source &amp; Step</span>
              <span className="font-mono text-slate-300">{p?.failureSource || 'bank'} / {p?.failureStep || 'authorization'}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1.5 font-bold uppercase text-[10px] tracking-wider">Raw Gateway Description</span>
              <div className="bg-dark-950/90 border border-white/10 rounded-xl p-3 text-[11px] font-mono text-slate-300 shadow-inner">
                {p?.failureDescription || 'Payment processing failed due to temporary bank issue.'}
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Agentic AI Interpretation */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-white/5 pb-4 text-sky-400">
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Agentic AI Reasoning</h3>
              <p className="text-[10px] text-slate-400 font-mono">AUTONOMOUS COGNITIVE DIAGNOSIS</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-slate-400">Diagnosed Cause</span>
              <span className="font-extrabold text-sky-400 capitalize">{c.cause.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-slate-400">Diagnosis Confidence</span>
              <span className="font-bold text-emerald-400 font-mono">{(c.diagnosisConfidence * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-slate-400">Recovery Probability</span>
              <span className="font-extrabold text-indigo-300 font-mono text-sm">{(c.recoveryProbability * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-slate-400">Recommended Action</span>
              <span className="font-bold text-amber-300 uppercase font-mono">{c.proposedAction}</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1.5 font-bold uppercase text-[10px] tracking-wider">Diagnosis Evidence Base</span>
              <ul className="space-y-1.5">
                {c.diagnosisEvidence?.map((ev, i) => (
                  <li key={i} className="bg-dark-950/70 border border-white/5 rounded-xl p-2.5 text-[11px] text-slate-300 flex items-start space-x-2">
                    <span className="text-sky-400 font-bold mt-0.5">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Policy Safety Guard & Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deterministic Policy Guard */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-white/5 pb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Deterministic Policy Safety Guard</h3>
              <p className="text-[10px] text-slate-400 font-mono">FINANCIAL BOUNDARY CONTROLS</p>
            </div>
          </div>

          {detail.policyResult && (
            <div className="space-y-3 text-xs">
              <div
                className={`p-3.5 rounded-2xl border flex items-center space-x-2.5 font-bold ${
                  detail.policyResult.allowed
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : detail.policyResult.requiresApproval
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                }`}
              >
                {detail.policyResult.allowed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                )}
                <span>{detail.policyResult.reason}</span>
              </div>

              <div className="space-y-2 mt-2">
                {detail.policyResult.checks?.map((ck, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-dark-950/80 border border-white/5">
                    <span className="font-mono text-slate-300 text-[11px]">{ck.name}</span>
                    {ck.passed ? (
                      <span className="text-emerald-400 font-bold flex items-center space-x-1 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>PASSED</span>
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center space-x-1 text-xs">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>BLOCKED</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recovery Score Factor Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-white/5 pb-4">
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Recovery Probability Formula</h3>
              <p className="text-[10px] text-slate-400 font-mono">WEIGHTED MULTI-FACTOR MODEL</p>
            </div>
          </div>

          {detail.scoreFactors && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-dark-950/70 border border-white/5">
                <span className="text-slate-400">Prior Success Rate (25%)</span>
                <span className="font-mono font-bold text-white">{(detail.scoreFactors.priorPaymentSuccessRate * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-dark-950/70 border border-white/5">
                <span className="text-slate-400">Failure Type Recoverability (20%)</span>
                <span className="font-mono font-bold text-white">{(detail.scoreFactors.failureTypeRecoverability * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-dark-950/70 border border-white/5">
                <span className="text-slate-400">Customer History Score (20%)</span>
                <span className="font-mono font-bold text-white">{(detail.scoreFactors.customerHistoryScore * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-dark-950/70 border border-white/5">
                <span className="text-slate-400">Recency Factor (15%)</span>
                <span className="font-mono font-bold text-white">{(detail.scoreFactors.recencyScore * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-dark-950/70 border border-white/5">
                <span className="text-slate-400">Amount Suitability (10%)</span>
                <span className="font-mono font-bold text-white">{(detail.scoreFactors.amountSuitabilityScore * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-extrabold text-xs mt-2">
                <span>Final Probability Score</span>
                <span className="font-mono">{(c.recoveryProbability * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Immutable Audit Ledger Log */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center space-x-2.5 border-b border-white/5 pb-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Immutable Audit Timeline</h3>
            <p className="text-[10px] text-slate-400 font-mono">APPEND-ONLY COMPLIANCE LEDGER</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {detail.auditEvents?.map((evt) => (
            <div key={evt.id} className="bg-dark-950/80 border border-white/5 rounded-2xl p-3.5 text-xs flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-bold text-sky-400 font-mono">{evt.eventType}</span>
                  <span className="text-[10px] bg-dark-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">{evt.actorType}</span>
                </div>
                <p className="text-slate-300">{evt.decision || evt.outcome}</p>
                {evt.requestId && <span className="text-[10px] text-slate-500 font-mono">Request ID: {evt.requestId}</span>}
              </div>
              <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-4">
                {new Date(evt.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
