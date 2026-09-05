import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Lock, 
  Clock, 
  CreditCard, 
  Sparkles,
  Zap,
  Building
} from 'lucide-react';
import { api } from '../../api';

interface RecoveryPaymentPageProps {
  token?: string;
  onPaymentSuccess: () => void;
}

export const RecoveryPaymentPage: React.FC<RecoveryPaymentPageProps> = ({ token = 'case_demo_1', onPaymentSuccess }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(899); // 14:59

  useEffect(() => {
    fetchData();
  }, [token]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getRecoveryPaymentData(token);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Recovery link expired or invalid');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateSuccess = async () => {
    setPaying(true);
    try {
      // Send verified payment capture webhook event
      const payload = {
        event: 'payment.captured',
        event_id: `evt_rec_succ_${Date.now()}`,
        payload: {
          payment: {
            entity: {
              id: `pay_rec_${Date.now()}`,
              order_id: data?.originalOrderId || 'order_rec_1',
              payment_link_id: data?.recoveryCaseId,
              amount: data?.amountInPaise || 149900,
              currency: 'INR',
              status: 'captured',
              method: 'card',
              email: data?.customer?.email || 'amit@example.com',
              notes: { recoveryCaseId: data?.recoveryCaseId },
            },
          },
        },
      };

      await api.triggerScenario('payment_success');
      await fetch('/api/simulator/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setPaidSuccess(true);
      onPaymentSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to complete recovery payment');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-24 text-center text-slate-400">
        <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold">Loading verified recovery checkout...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center shadow-2xl">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Recovery Link Notice</h3>
          <p className="text-xs text-slate-400 mb-6">{error || 'No active recovery case selected.'}</p>
          <p className="text-[11px] text-slate-500">
            Initiate a payment failure in Customer Checkout to generate a fresh recovery link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-10 px-4 sm:px-6 space-y-6 animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center font-extrabold text-lg text-white shadow-lg shadow-sky-500/20">
              फिर
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">फिर से Pay — Secure Recovery</h2>
              <p className="text-xs text-slate-400">Instant retry with optimized bank route</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-1 text-amber-400 text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Session Timer</span>
          </div>
        </div>

        {paidSuccess ? (
          /* Payment Captured Success State */
          <div className="space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-glow-emerald">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white mb-1">Payment Successfully Recovered!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Your payment of <strong className="text-emerald-400">₹{(data.amountInPaise / 100).toLocaleString('en-IN')}</strong> has been verified and captured on the server.
              </p>
            </div>

            <div className="bg-dark-950/80 border border-white/10 rounded-2xl p-4 text-xs font-mono text-left space-y-2 text-slate-300 shadow-inner">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-slate-500">Case Reference</span>
                <span className="text-sky-400 font-bold">{data.recoveryCaseId}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-slate-500">Captured Amount</span>
                <span className="text-emerald-400 font-bold">₹{(data.amountInPaise / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Merchant Sync</span>
                <span className="text-emerald-400 font-bold">RECOVERED (SSE Synced)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Switch to <strong>Tab 2 (Merchant Dashboard)</strong> to inspect the live updated metrics.
            </p>
          </div>
        ) : (
          /* Payment Checkout Form */
          <div className="space-y-6">
            {/* Invoice Breakdown Card */}
            <div className="bg-dark-900/80 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Product / Plan</span>
                <span className="font-bold text-white">{data.productName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Customer Name</span>
                <span className="font-medium text-slate-200">{data.customer.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Recovery Case ID</span>
                <span className="font-mono text-sky-400">{data.recoveryCaseId}</span>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300">Amount Due</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                  ₹{(data.amountInPaise / 100).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Smart Recovery Explanation */}
            <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-4 text-xs text-sky-300 flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Optimized Bank Fallback Active</span>
                <span className="text-[11px] text-sky-300/80 leading-relaxed">
                  Your prior attempt failed due to a bank processing glitch. This second chance link routes through an optimal authorization channel.
                </span>
              </div>
            </div>

            <button
              onClick={handleSimulateSuccess}
              disabled={paying}
              className="w-full btn-shimmer text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-emerald-500/20 text-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>
                {paying ? 'Verifying with Bank Gateway...' : `Simulate Successful Recovery (₹${(data.amountInPaise / 100).toLocaleString('en-IN')})`}
              </span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 font-mono text-center">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Server-verified payment capture required for RECOVERED status</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
