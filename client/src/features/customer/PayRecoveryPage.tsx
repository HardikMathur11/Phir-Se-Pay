import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../../api';

interface PayRecoveryPageProps {
  token?: string;
  onPaymentSuccess: () => void;
}

export const PayRecoveryPage: React.FC<PayRecoveryPageProps> = ({
  token = 'case_demo_1',
  onPaymentSuccess,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);

  useEffect(() => {
    const fetchRecoveryData = async () => {
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

    fetchRecoveryData();
  }, [token]);

  const handleCompleteRecovery = async () => {
    setPaying(true);
    try {
      const payload = {
        event: 'payment.captured',
        event_id: `evt_rec_cap_${Date.now()}`,
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
      <div className="max-w-xl mx-auto py-24 text-center text-[var(--color-ink-secondary)]">
        <div className="w-8 h-8 border-2 border-[var(--color-ink)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="font-ui text-xs">Loading secure recovery link...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <div className="ledger-panel p-8 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-[var(--color-pending)] mx-auto" />
          <h3 className="font-display font-semibold text-lg text-[var(--color-ink)]">
            Recovery Link Expired or Not Found
          </h3>
          <p className="text-xs text-[var(--color-ink-secondary)] font-ui max-w-sm mx-auto">
            {error || 'No active recovery case for this link token. Initiate a failed checkout first.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4 sm:px-6 space-y-6 animate-fadeIn">
      <div className="ledger-panel p-8 space-y-6">
        {paidSuccess ? (
          /* Success State */
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-recovered-bg)] text-[var(--color-recovered)] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-display font-semibold text-2xl text-[var(--color-ink)]">
                Payment Recovered &amp; Captured
              </h3>
              <p className="text-xs text-[var(--color-ink-secondary)] font-ui mt-1">
                Your payment of ₹{((data.amountInPaise || 0) / 100).toLocaleString('en-IN')} has been verified by the server.
              </p>
            </div>

            <div className="p-4 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-xs font-data text-left space-y-1.5 text-[var(--color-ink)]">
              <div className="flex justify-between">
                <span className="text-[var(--color-ink-secondary)]">Case Ref:</span>
                <span className="font-bold">{data.recoveryCaseId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-ink-secondary)]">Status:</span>
                <span className="font-bold text-[var(--color-recovered)]">RECOVERED (Live Synced)</span>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <>
            {/* Header with single line above amount */}
            <div className="border-b border-[var(--color-border)] pb-6 space-y-1">
              <div className="flex justify-between items-center text-xs text-[var(--color-ink-secondary)] font-ui">
                <span>Secure Recovery</span>
                <span className="font-data">Acme SaaS Inc.</span>
              </div>

              <h2 className="font-display font-semibold text-xl text-[var(--color-ink)] pt-1">
                {data.productName}
              </h2>

              {/* Specific requirement: One line above the amount in secondary text */}
              <p className="text-xs text-[var(--color-ink-secondary)] font-ui pt-2">
                This completes your earlier payment attempt.
              </p>

              <div className="pt-1">
                <span className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-ink)]">
                  ₹{((data.amountInPaise || 0) / 100).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--color-ink-secondary)] font-ui">Customer</span>
                <span className="font-ui font-semibold text-[var(--color-ink)]">{data.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-ink-secondary)] font-ui">Email</span>
                <span className="font-data text-[var(--color-ink)]">{data.customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-ink-secondary)] font-ui">Case Token</span>
                <span className="font-data text-[var(--color-ink-secondary)]">{data.recoveryCaseId}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleCompleteRecovery}
              disabled={paying}
              className="w-full bg-[var(--color-recovered)] hover:opacity-95 text-white font-semibold font-ui py-3 rounded-[var(--radius-pill)] text-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {paying
                  ? 'Verifying Server Capture...'
                  : `Complete Payment (₹${((data.amountInPaise || 0) / 100).toLocaleString('en-IN')})`}
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
