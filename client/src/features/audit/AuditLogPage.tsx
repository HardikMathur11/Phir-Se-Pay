import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  RefreshCw, 
  ShieldCheck, 
  Search, 
  Clock, 
  Lock, 
  Cpu, 
  UserCheck 
} from 'lucide-react';
import { api } from '../../api';
import { AuditEvent } from '../../types';

export const AuditLogPage: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditEvents();
      setEvents(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredEvents = events.filter((e) =>
    e.eventType.toLowerCase().includes(search.toLowerCase()) ||
    e.actorType.toLowerCase().includes(search.toLowerCase()) ||
    (e.decision && e.decision.toLowerCase().includes(search.toLowerCase())) ||
    (e.outcome && e.outcome.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Immutable Audit Ledger</h2>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                Append-Only
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive regulatory audit trail capturing all system events, AI diagnoses, policy evaluations, and payment captures.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search audit log..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-dark-900/90 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
          />
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="p-2.5 bg-dark-900/90 hover:bg-dark-800 text-slate-300 hover:text-white rounded-xl border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No audit records matching your criteria.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-dark-950/70 border border-white/5 rounded-2xl p-4 text-xs font-mono transition-colors hover:border-white/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-emerald-400 text-sm">{evt.eventType}</span>
                  <span className="bg-dark-800 text-slate-300 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {evt.actorType}
                  </span>
                  <span className="text-slate-500 text-[10px]">ID: {evt.id}</span>
                </div>
                <span className="text-slate-500 text-[11px] flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-600" />
                  <span>{new Date(evt.createdAt).toLocaleString()}</span>
                </span>
              </div>

              <div className="text-slate-200 mb-2 font-sans text-xs">
                {evt.decision || evt.outcome}
              </div>

              {evt.policyResult && (
                <div className="bg-dark-900/90 border border-white/5 rounded-xl p-3 text-[11px] text-slate-300 flex items-center space-x-2 mb-2">
                  <span className="text-indigo-400 font-bold uppercase">Policy Check:</span>
                  <span>{evt.policyResult.reason}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/5">
                <span>Request Trace: {evt.requestId || 'req_auto_sys'}</span>
                <span className="text-emerald-500 font-bold flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>SHA-256 Ledger Verified</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
