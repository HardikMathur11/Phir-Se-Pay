import React, { useEffect, useState } from 'react';
import { 
  Mail, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Copy, 
  ShieldCheck, 
  RefreshCw,
  Inbox,
  User
} from 'lucide-react';
import { api } from '../../api';
import { Notification } from '../../types';

interface DemoInboxPageProps {
  onOpenRecoveryLink: (linkUrl: string) => void;
}

export const DemoInboxPage: React.FC<DemoInboxPageProps> = ({ onOpenRecoveryLink }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInbox = async () => {
    setRefreshing(true);
    try {
      const notifs = await api.getCustomerInbox('cust_amit_1');
      setNotifications(notifs);
      if (notifs.length > 0 && !selectedNotif) {
        setSelectedNotif(notifs[0]);
      }
    } catch {
      // silent
    } finally {
      setTimeout(() => setRefreshing(false), 300);
    }
  };

  useEffect(() => {
    fetchInbox();
    const interval = setInterval(fetchInbox, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 flex items-center justify-center shadow-inner">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Customer Email Inbox (Amit Sharma)</h2>
              <span className="text-[10px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                Step 2 of 3
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulated customer mailbox receiving AI-drafted revenue recovery payment links.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-slate-400 bg-dark-900/80 px-3 py-1.5 rounded-xl border border-white/5 hidden sm:inline">
            amit@example.com
          </span>
          <button
            onClick={fetchInbox}
            disabled={refreshing}
            className="p-2 bg-dark-900/80 hover:bg-dark-800 text-slate-400 hover:text-white rounded-xl border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Mail Container */}
      <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {notifications.length === 0 ? (
          <div className="py-24 text-center text-slate-500">
            <div className="w-16 h-16 rounded-3xl bg-dark-900 border border-white/5 flex items-center justify-center mx-auto mb-4 text-slate-600">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-300 mb-1">No Recovery Reminders Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Initiate a failed payment from <strong>Customer Checkout</strong> to trigger the automated AI recovery workflow.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
            {/* Left Mail List Pane (4 Cols) */}
            <div className="md:col-span-4 border-r border-white/5 bg-dark-950/50 overflow-y-auto">
              <div className="p-3 border-b border-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Received Messages ({notifications.length})
              </div>
              <div className="divide-y divide-white/5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNotif(n)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedNotif?.id === n.id
                        ? 'bg-sky-500/10 border-l-4 border-l-sky-400'
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-sky-400 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-sky-400" />
                        <span>फिर से Pay</span>
                      </span>
                      <span className="text-slate-500 text-[10px] font-mono">
                        {n.sentAt ? new Date(n.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1 mb-1">{n.subject}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{n.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Mail View Pane (8 Cols) */}
            <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between bg-dark-900/40">
              {selectedNotif ? (
                <div className="space-y-6">
                  {/* Email Header Card */}
                  <div className="border-b border-white/10 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 px-2.5 py-0.5 rounded-full font-mono font-bold">
                        Delivered via: {selectedNotif.provider.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{selectedNotif.sentAt ? new Date(selectedNotif.sentAt).toLocaleString() : ''}</span>
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{selectedNotif.subject}</h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-[10px]">
                        FP
                      </span>
                      <span>From: <strong className="text-slate-200">support@phirsepay.demo</strong></span>
                      <span>•</span>
                      <span>To: <strong className="text-slate-200">{selectedNotif.recipient}</strong></span>
                    </div>
                  </div>

                  {/* Rendered Email Body Box */}
                  <div className="bg-dark-950/80 border border-white/10 rounded-2xl p-6 text-xs text-slate-200 leading-relaxed font-sans shadow-inner whitespace-pre-wrap">
                    {selectedNotif.body}
                  </div>

                  {/* Action Box with Open Recovery CTA */}
                  <div className="glass-panel p-5 rounded-2xl border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-glow-sky/20">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 text-sky-400 font-bold text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Secure Razorpay Recovery Link</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono break-all">
                        {selectedNotif.recoveryLink}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleCopyLink(selectedNotif.recoveryLink)}
                        className="p-2.5 bg-dark-900 hover:bg-dark-800 text-slate-300 rounded-xl border border-white/10 text-xs font-semibold flex items-center space-x-1 transition-colors"
                        title="Copy recovery link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => onOpenRecoveryLink(selectedNotif.recoveryLink)}
                        className="btn-shimmer text-white text-xs font-extrabold px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-sky-500/25 transition-all"
                      >
                        <span>Open Recovery Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
