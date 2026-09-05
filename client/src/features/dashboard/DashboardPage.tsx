import React, { useEffect, useState, useMemo } from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Search, 
  RefreshCw,
  ChevronRight,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { api, getSseStreamUrl } from '../../api';
import { DashboardSummaryStrip, DashboardLiveFeedItem } from '../../types';
import { SummaryFigure } from '../../components/ui/SummaryFigure';
import { HairlineDivider } from '../../components/ui/HairlineDivider';
import { StatusPill } from '../../components/ui/StatusPill';
import { RadialGauge } from '../../components/ui/RadialGauge';
import { LivePipelineVisualizer } from '../../components/LivePipelineVisualizer';

interface DashboardPageProps {
  onSelectCase: (caseId: string) => void;
  onRefreshSummary?: (summary: DashboardSummaryStrip) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectCase, onRefreshSummary }) => {
  const [summary, setSummary] = useState<DashboardSummaryStrip | null>(null);
  const [feed, setFeed] = useState<DashboardLiveFeedItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'RECOVERED' | 'APPROVAL_REQUIRED' | 'ACTIVE'>('ALL');
  const [newCaseIds, setNewCaseIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      const [sumData, feedData] = await Promise.all([
        api.getDashboardSummaryStrip(),
        api.getDashboardLiveFeed(30),
      ]);
      setSummary(sumData);
      setFeed(feedData);
      onRefreshSummary?.(sumData);
    } catch {
      // silent
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Setup SSE Realtime Stream
    const sse = new EventSource(getSseStreamUrl());

    const handleEvent = (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.data?.caseId) {
          setNewCaseIds((prev) => new Set(prev).add(payload.data.caseId));
        }
        fetchDashboardData();
      } catch {
        // silent
      }
    };

    sse.onmessage = handleEvent;
    sse.addEventListener('payment.failed', handleEvent as any);
    sse.addEventListener('recovery.case.created', handleEvent as any);
    sse.addEventListener('recovery.case.recovered', handleEvent as any);
    sse.addEventListener('metrics.updated', handleEvent as any);
    sse.addEventListener('webhook.duplicate', handleEvent as any);

    // Heartbeat sync every 3 seconds to guarantee live data freshness
    const interval = setInterval(fetchDashboardData, 3000);

    return () => {
      sse.close();
      clearInterval(interval);
    };
  }, []);

  const filteredFeed = useMemo(() => {
    return feed.filter((item) => {
      const matchesSearch =
        item.caseId.toLowerCase().includes(search.toLowerCase()) ||
        item.customerName.toLowerCase().includes(search.toLowerCase()) ||
        item.diagnosisCategory.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;
      if (statusFilter === 'ALL') return true;
      if (statusFilter === 'RECOVERED') return item.status === 'RECOVERED';
      if (statusFilter === 'APPROVAL_REQUIRED') return item.status === 'APPROVAL_REQUIRED';
      if (statusFilter === 'ACTIVE') return item.status !== 'RECOVERED' && item.status !== 'STOPPED';
      return true;
    });
  }, [feed, search, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      {/* Primary Raised Ledger Panel (The single elevation step) */}
      <div className="ledger-panel p-6 sm:p-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-ink)] tracking-tight">
                Financial Recovery Ledger
              </h1>
            </div>
            <p className="text-xs text-[var(--color-ink-secondary)] font-ui mt-1">
              Autonomous diagnosis, deterministic policy evaluation, and server-verified revenue recovery.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] hover:bg-[var(--color-border)] text-xs font-semibold font-ui text-[var(--color-ink)] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[var(--color-ink-secondary)]' : ''}`} />
              <span>Sync Ledger</span>
            </button>
          </div>
        </div>

        {/* Summary Strip (4 figures side by side separated by vertical hairlines) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] overflow-hidden">
          <SummaryFigure
            label="Revenue at risk"
            value={`₹${((summary?.revenueAtRiskInPaise || 0) / 100).toLocaleString('en-IN')}`}
            icon={AlertOctagon}
            iconColor="var(--color-pending)"
            className="border-b sm:border-b-0 sm:border-r border-[var(--color-border)] py-4"
          />

          {/* Hero Moment: Recovered Figure + Incremental Accent in Italic Fraunces */}
          <SummaryFigure
            label="Recovered"
            value={`₹${((summary?.recoveredInPaise || 0) / 100).toLocaleString('en-IN')}`}
            hero={true}
            accentValue={
              (summary?.incrementalInPaise || 0) > 0
                ? `+₹${((summary?.incrementalInPaise || 0) / 100).toLocaleString('en-IN')}`
                : undefined
            }
            icon={CheckCircle2}
            iconColor="var(--color-recovered)"
            color="var(--color-ink)"
            className="border-b sm:border-b-0 sm:border-r border-[var(--color-border)] py-4"
          />

          <SummaryFigure
            label="Recovery rate"
            value={`${(summary?.recoveryRatePercent || 0).toFixed(1)}%`}
            icon={TrendingUp}
            iconColor="var(--color-recovered)"
            className="border-b sm:border-b-0 sm:border-r border-[var(--color-border)] py-4"
          />

          <SummaryFigure
            label="Needs approval"
            value={summary?.needsApprovalCount || 0}
            icon={Clock}
            iconColor={
              (summary?.needsApprovalCount || 0) > 0
                ? 'var(--color-pending)'
                : 'var(--color-ink-tertiary)'
            }
            className="py-4"
          />
        </div>

        {/* Live 5-Stage Graph Pipeline Visualizer */}
        <LivePipelineVisualizer />

        {/* Live Cases Section */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-semibold text-xl text-[var(--color-ink)]">
                Live Cases
              </h2>
              <p className="text-xs text-[var(--color-ink-secondary)] font-ui">
                Real-time stream of incoming failed payments and autonomous recovery interventions.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[var(--color-ink-tertiary)] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search case ID, customer, cause..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[var(--color-surface-sunken)] border border-[var(--color-border)] rounded-[var(--radius-pill)] pl-9 pr-3.5 py-1.5 text-xs text-[var(--color-ink)] placeholder-[var(--color-ink-tertiary)] focus:outline-none focus:border-[var(--color-ink-secondary)] w-52 sm:w-64 font-ui"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="bg-[var(--color-surface-sunken)] border border-[var(--color-border)] rounded-[var(--radius-pill)] px-3 py-1.5 text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink-secondary)] font-ui"
              >
                <option value="ALL">All Cases</option>
                <option value="ACTIVE">Active Only</option>
                <option value="APPROVAL_REQUIRED">Needs Approval</option>
                <option value="RECOVERED">Recovered</option>
              </select>
            </div>
          </div>

          {/* Recessed Rows List */}
          <div className="space-y-2.5">
            {filteredFeed.length === 0 ? (
              <div className="py-16 text-center text-[var(--color-ink-secondary)] bg-[var(--color-surface-sunken)] rounded-[var(--radius-tile)] border border-[var(--color-border)]">
                <Layers className="w-8 h-8 mx-auto mb-2 text-[var(--color-ink-tertiary)]" />
                <p className="text-xs font-ui">No cases found matching filter.</p>
                <span className="text-[11px] text-[var(--color-ink-tertiary)] mt-1 block font-data">
                  Trigger a payment failure in Checkout to create a new recovery ledger entry.
                </span>
              </div>
            ) : (
              filteredFeed.map((item) => {
                const isNew = newCaseIds.has(item.caseId);

                return (
                  <div
                    key={item.caseId}
                    onClick={() => onSelectCase(item.caseId)}
                    className={`ledger-sunken p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-[var(--color-surface)] group ${
                      isNew ? 'animate-row-enter' : ''
                    }`}
                  >
                    {/* Left: Gauge + Details */}
                    <div className="flex items-center space-x-4">
                      {/* Radial confidence gauge */}
                      <RadialGauge
                        score={item.diagnosisConfidence}
                        color={item.statusPillColor}
                        size={38}
                      />

                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2.5">
                          <span className="font-ui font-semibold text-xs text-[var(--color-ink)] group-hover:text-[var(--color-ink)]">
                            {item.customerName}
                          </span>
                          <span className="text-[10px] font-data text-[var(--color-ink-tertiary)]">
                            • {item.method}
                          </span>
                          <span className="text-[10px] font-data text-[var(--color-ink-tertiary)]">
                            • {item.caseId}
                          </span>
                        </div>

                        {/* Diagnosis reason */}
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-[11px] font-data text-[var(--color-ink-secondary)] capitalize">
                            {item.diagnosisCategory.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] font-data text-[var(--color-ink-tertiary)]">
                            (
                            {new Date(item.lastUpdatedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                            )
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount + Status Pill + Chevron */}
                    <div className="flex items-center space-x-4 shrink-0">
                      <div className="text-right">
                        <span className="font-display font-semibold text-sm text-[var(--color-ink)] block">
                          ₹{((item.amountInPaise || 0) / 100).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <StatusPill
                        label={item.status}
                        color={item.statusPillColor}
                      />

                      <ChevronRight className="w-4 h-4 text-[var(--color-ink-tertiary)] group-hover:text-[var(--color-ink)] transition-colors" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
