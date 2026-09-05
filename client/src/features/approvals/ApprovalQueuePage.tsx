import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, ChevronRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../../api';
import { DashboardLiveFeedItem } from '../../types';
import { StatusPill } from '../../components/ui/StatusPill';
import { RadialGauge } from '../../components/ui/RadialGauge';

interface ApprovalQueuePageProps {
  onSelectCase: (caseId: string) => void;
}

export const ApprovalQueuePage: React.FC<ApprovalQueuePageProps> = ({ onSelectCase }) => {
  const [cases, setCases] = useState<DashboardLiveFeedItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const feed = await api.getDashboardLiveFeed(50);
      const approvalRequired = feed
        .filter((c) => c.status === 'APPROVAL_REQUIRED')
        .sort((a, b) => b.amountInPaise - a.amountInPaise);
      setCases(approvalRequired);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      <div className="ledger-panel p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-[var(--color-pending-bg)] border border-[var(--color-pending)]/20 text-[var(--color-pending)] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display font-semibold text-2xl text-[var(--color-ink)] tracking-tight">
                  Merchant Approval Queue
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[var(--color-pending-bg)] text-[var(--color-pending)] text-xs font-data font-bold">
                  {cases.length} Pending
                </span>
              </div>
              <p className="text-xs text-[var(--color-ink-secondary)] font-ui mt-0.5">
                High-value failure cases (amount &gt; ₹10,000 threshold) requiring manual merchant operator approval.
              </p>
            </div>
          </div>

          <button
            onClick={fetchQueue}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] hover:bg-[var(--color-border)] text-xs font-semibold font-ui text-[var(--color-ink)] transition-colors disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>

        {/* List of Approval Rows */}
        <div className="space-y-3">
          {cases.length === 0 ? (
            <div className="py-20 text-center text-[var(--color-ink-secondary)] bg-[var(--color-surface-sunken)] rounded-[var(--radius-tile)] border border-[var(--color-border)]">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-[var(--color-recovered)]" />
              <p className="text-xs font-ui font-semibold text-[var(--color-ink)]">
                Approval Queue is Empty
              </p>
              <span className="text-[11px] text-[var(--color-ink-secondary)] font-ui block mt-1">
                All high-value payments have been reviewed. Execute Scenario D from Chaos to simulate a ₹25,000 approval case.
              </span>
            </div>
          ) : (
            cases.map((item) => (
              <div
                key={item.caseId}
                onClick={() => onSelectCase(item.caseId)}
                className="ledger-sunken p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-[var(--color-surface)] group"
              >
                <div className="flex items-center space-x-4">
                  <RadialGauge
                    score={item.diagnosisConfidence}
                    color="pending"
                    size={38}
                  />

                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="font-ui font-semibold text-xs text-[var(--color-ink)]">
                        {item.customerName}
                      </span>
                      <span className="text-[10px] font-data text-[var(--color-ink-tertiary)]">
                        • {item.caseId}
                      </span>
                    </div>
                    <span className="text-[11px] font-data text-[var(--color-pending)] capitalize mt-0.5 font-medium">
                      Requires Approval: {item.diagnosisCategory.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-display font-semibold text-base text-[var(--color-ink)]">
                    ₹{((item.amountInPaise || 0) / 100).toLocaleString('en-IN')}
                  </span>
                  <StatusPill label={item.status} color="pending" />
                  <ChevronRight className="w-4 h-4 text-[var(--color-ink-tertiary)] group-hover:text-[var(--color-ink)]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
