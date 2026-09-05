import React, { useEffect, useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  RotateCw, 
  Ban, 
  Play, 
  Clock, 
  Layers, 
  HelpCircle,
  TrendingUp,
  CreditCard,
  Copy,
  Check,
  Zap,
  Lock,
  ExternalLink
} from 'lucide-react';
import { api } from '../api';
import { CaseDetailViewData, ReplayWebhookResult } from '../types';
import { StatusPill } from './ui/StatusPill';
import { TimelineDots } from './ui/TimelineDots';
import { DataTable } from './ui/DataTable';

interface CaseDetailDrawerProps {
  caseId: string | null;
  onClose: () => void;
  onActionComplete?: () => void;
}

export const CaseDetailDrawer: React.FC<CaseDetailDrawerProps> = ({
  caseId,
  onClose,
  onActionComplete,
}) => {
  const [detail, setDetail] = useState<CaseDetailViewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [replayResult, setReplayResult] = useState<ReplayWebhookResult | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    if (!caseId) {
      setDetail(null);
      setReplayResult(null);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await api.getCaseDetailView(caseId);
        setDetail(data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [caseId]);

  if (!caseId) return null;

  const handleApprove = async () => {
    setActionLoading('approve');
    try {
      await api.approveCase(caseId);
      const updated = await api.getCaseDetailView(caseId);
      setDetail(updated);
      onActionComplete?.();
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  };

  const handleStop = async () => {
    setActionLoading('stop');
    try {
      await api.stopCase(caseId);
      const updated = await api.getCaseDetailView(caseId);
      setDetail(updated);
      onActionComplete?.();
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  };

  const handleReplayWebhook = async () => {
    setActionLoading('replay');
    setReplayResult(null);
    try {
      const res = await api.replayWebhook(caseId);
      setReplayResult(res);
      onActionComplete?.();
    } catch {
      setReplayResult({
        passed: false,
        explanation: 'Webhook replay failed to execute.',
        newDocumentsCreated: 0,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyJson = () => {
    if (!detail) return;
    navigator.clipboard.writeText(JSON.stringify(detail, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end drawer-backdrop animate-fadeIn">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-2xl bg-[var(--color-surface)] h-full shadow-drawer flex flex-col border-l border-[var(--color-border)] z-10 overflow-hidden">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface)]">
          <div className="flex items-center space-x-3">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-display font-semibold text-lg text-[var(--color-ink)]">
                  {detail?.case.customerName || 'Case Telemetry Record'}
                </span>
                {detail?.case && (
                  <StatusPill
                    label={detail.case.status}
                    color={detail.case.statusPillColor}
                  />
                )}
              </div>
              <span className="font-data text-[11px] text-[var(--color-ink-secondary)] mt-0.5">
                {caseId}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyJson}
              className="p-2 rounded-full hover:bg-[var(--color-surface-sunken)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] transition-colors border border-[var(--color-border)]"
              title="Copy Raw Telemetry JSON"
            >
              {copiedJson ? <Check className="w-4 h-4 text-[var(--color-recovered)]" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--color-surface-sunken)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {loading || !detail ? (
            <div className="py-24 text-center text-[var(--color-ink-secondary)]">
              <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--color-ink-tertiary)]" />
              <span className="font-ui text-xs">Loading case ledger record...</span>
            </div>
          ) : (
            <>
              {/* Summary Strip in Drawer */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)]">
                <div>
                  <span className="text-[11px] font-medium text-[var(--color-ink-secondary)] block">
                    Amount at Risk
                  </span>
                  <span className="font-display font-semibold text-lg text-[var(--color-ink)]">
                    ₹{((detail.case.amountAtRiskInPaise || 0) / 100).toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-[var(--color-ink-secondary)] block">
                    Method
                  </span>
                  <span className="font-data font-semibold text-xs text-[var(--color-ink)] uppercase mt-1 block">
                    {detail.case.method}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-[var(--color-ink-secondary)] block">
                    AI Confidence
                  </span>
                  <span className="font-data font-semibold text-xs text-[var(--color-escalated)] mt-1 block">
                    {Math.round((detail.diagnosis.confidence || 0) * 100)}%
                  </span>
                </div>
              </div>

              {/* Latency & Execution Breakdown */}
              <div className="p-3 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] flex items-center justify-between text-[10px] font-data">
                <span className="text-[var(--color-ink-secondary)] flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-[var(--color-pending)]" />
                  <span>Execution Latency:</span>
                </span>
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)]">
                    Edge: 24ms
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-escalated)] font-semibold">
                    AI: 140ms
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-recovered)] font-semibold">
                    Guard: 4ms
                  </span>
                </div>
              </div>

              {/* 5-Stage Ledger Timeline */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider font-ui">
                    Ledger Execution Timeline
                  </h4>
                  <span className="text-[10px] text-[var(--color-ink-tertiary)] font-data">
                    5-Stage Graph
                  </span>
                </div>
                <div className="p-4 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)]">
                  <TimelineDots stages={detail.ledgerTimeline} />
                </div>
              </div>

              {/* Evidence Block (Raw Gateway Facts) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider font-ui">
                    Evidence (Raw Gateway Telemetry)
                  </h4>
                  <span className="text-[10px] text-[var(--color-ink-secondary)] font-data">
                    Immutable Facts
                  </span>
                </div>
                <DataTable
                  rows={[
                    { key: 'Error Code', value: detail.evidence.code },
                    { key: 'Reason', value: detail.evidence.reason },
                    { key: 'Source / Step', value: `${detail.evidence.source} / ${detail.evidence.step}` },
                    { key: 'Payment ID', value: detail.evidence.paymentId },
                    { key: 'Order ID', value: detail.evidence.orderId },
                    { key: 'Description', value: detail.evidence.description },
                  ]}
                />
              </div>

              {/* Diagnosis Block (AI Classification & Attribution) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider font-ui">
                    Diagnosis &amp; Decision Model
                  </h4>
                  <span className="text-[10px] text-[var(--color-escalated)] font-data font-medium">
                    Cognitive Layer
                  </span>
                </div>
                <div className="p-4 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[var(--color-ink-secondary)]">Diagnosed Category</span>
                    <span className="font-data font-semibold text-[var(--color-ink)] capitalize">
                      {detail.diagnosis.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[var(--color-ink-secondary)]">Recommended Action</span>
                    <span className="font-data font-semibold text-[var(--color-pending)] uppercase">
                      {detail.diagnosis.recommendedAction}
                    </span>
                  </div>

                  {/* Feature Attribution Bars */}
                  {detail.diagnosis.featureAttributions && detail.diagnosis.featureAttributions.length > 0 && (
                    <div className="pt-2 border-t border-[var(--color-border)]">
                      <span className="text-[11px] font-medium text-[var(--color-ink-secondary)] block mb-2 font-ui">
                        Feature Attribution Weights
                      </span>
                      <div className="space-y-2">
                        {detail.diagnosis.featureAttributions.map((fa, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-data">
                              <span className="text-[var(--color-ink)]">{fa.feature}</span>
                              <span className="text-[var(--color-ink-secondary)]">
                                {Math.round(fa.importance * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-[var(--color-border)] rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-[var(--color-ink)] h-full rounded-full"
                                style={{ width: `${Math.round(fa.importance * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {detail && detail.availableActions.length > 0 && (
          <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface)] space-y-3">
            <div className="flex items-center space-x-3">
              {detail.availableActions.includes('approve') && (
                <button
                  onClick={handleApprove}
                  disabled={actionLoading !== null}
                  className="flex-1 bg-[var(--color-recovered)] hover:opacity-95 text-white py-2.5 px-4 rounded-[var(--radius-pill)] text-xs font-semibold font-ui transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{actionLoading === 'approve' ? 'Approving...' : 'Approve Recovery Action'}</span>
                </button>
              )}

              {detail.availableActions.includes('stop') && (
                <button
                  onClick={handleStop}
                  disabled={actionLoading !== null}
                  className="bg-[var(--color-surface-sunken)] hover:bg-[var(--color-border)] text-[var(--color-ink)] py-2.5 px-4 rounded-[var(--radius-pill)] text-xs font-semibold font-ui border border-[var(--color-border)] transition-all flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Ban className="w-3.5 h-3.5 text-[var(--color-stopped)]" />
                  <span>Stop Case</span>
                </button>
              )}

              {detail.availableActions.includes('replay_webhook') && (
                <button
                  onClick={handleReplayWebhook}
                  disabled={actionLoading !== null}
                  className="bg-[var(--color-surface-sunken)] hover:bg-[var(--color-border)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] py-2.5 px-4 rounded-[var(--radius-pill)] text-xs font-semibold font-data border border-[var(--color-border)] transition-all flex items-center space-x-1.5 disabled:opacity-50"
                  title="Chaos Replay Test: Test HMAC Deduplication"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Replay Webhook</span>
                </button>
              )}
            </div>

            {/* Inline Chaos Replay Result */}
            {replayResult && (
              <div
                className={`p-3 rounded-[var(--radius-tile)] text-xs font-data border ${
                  replayResult.passed
                    ? 'bg-[var(--color-recovered-bg)] text-[var(--color-recovered)] border-[var(--color-recovered)]/20'
                    : 'bg-[var(--color-pending-bg)] text-[var(--color-pending)] border-[var(--color-pending)]/20'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-semibold mb-1">
                  {replayResult.passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <span>{replayResult.passed ? 'Idempotency Passed' : 'Test Error'}</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">{replayResult.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
