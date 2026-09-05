import React, { useState } from 'react';
import { CreditCard, AlertTriangle, ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { api } from '../../api';

interface PayCheckoutPageProps {
  onPaymentFailed: () => void;
}

export const PayCheckoutPage: React.FC<PayCheckoutPageProps> = ({ onPaymentFailed }) => {
  const [name, setName] = useState('Amit Sharma');
  const [email, setEmail] = useState('amit@example.com');
  const [phone, setPhone] = useState('+91 9876543210');
  const [productName] = useState('Premium Cloud Pro Suite');
  const [amountRupees] = useState(1499);
  const [failureScenario, setFailureScenario] = useState('bank_technical_error');

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'info' | 'error' | 'success'>('info');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('Creating order token...');

    try {
      const orderData = await api.createOrder({
        name,
        email,
        phone,
        amountInPaise: amountRupees * 100,
        productName,
      });

      if (
        orderData.providerMode === 'razorpay_test' &&
        (window as any).Razorpay &&
        orderData.razorpayKeyId !== 'rzp_test_sample'
      ) {
        const options = {
          key: orderData.razorpayKeyId,
          amount: orderData.amountInPaise,
          currency: orderData.currency,
          name: 'Acme SaaS India',
          description: productName,
          order_id: orderData.providerOrderId,
          prefill: { name, email, contact: phone },
          theme: { color: '#14171A' },
          handler: function (response: any) {
            setStatusType('success');
            setStatusMessage(`Payment Success! Razorpay Payment ID: ${response.razorpay_payment_id}`);
            setLoading(false);
          },
          modal: {
            ondismiss: async function () {
              setStatusType('error');
              setStatusMessage('Payment attempt abandoned / cancelled. Ingesting into recovery ledger...');
              try {
                await api.attemptPayment({
                  orderId: orderData.orderId,
                  simulateFailure: true,
                  failureScenario: 'checkout_abandonment',
                });
              } catch {}
              onPaymentFailed();
              setLoading(false);
            },
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // High-Fidelity Simulator Mode
        setTimeout(async () => {
          await api.attemptPayment({
            orderId: orderData.orderId,
            simulateFailure: true,
            failureScenario,
          });
          setStatusType('error');
          setStatusMessage(`Payment failed: Simulated ${failureScenario.replace(/_/g, ' ')}. Webhook ingested into live ledger.`);
          setLoading(false);
          onPaymentFailed();
        }, 800);
      }
    } catch (err: any) {
      setStatusType('error');
      setStatusMessage(err.message || 'Payment processing error');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 sm:px-6 space-y-6 animate-fadeIn">
      {/* Checkout Card */}
      <div className="ledger-panel p-8 space-y-6">
        {/* Minimal Header */}
        <div className="border-b border-[var(--color-border)] pb-6 space-y-1">
          <div className="flex justify-between items-center text-xs text-[var(--color-ink-secondary)] font-ui">
            <span>Checkout</span>
            <span className="font-data">Acme SaaS Inc.</span>
          </div>
          <h2 className="font-display font-semibold text-xl text-[var(--color-ink)]">
            {productName}
          </h2>
          <div className="pt-2">
            <span className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-ink)]">
              ₹{amountRupees.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-[var(--color-ink-secondary)] font-ui ml-1.5">
              / month
            </span>
          </div>
        </div>

        {/* Customer Information Form */}
        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-ink)] font-ui mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[var(--color-surface-sunken)] border border-[var(--color-border)] rounded-[var(--radius-tile)] px-3.5 py-2 text-xs text-[var(--color-ink)] font-ui focus:outline-none focus:border-[var(--color-ink)]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-ink)] font-ui mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--color-surface-sunken)] border border-[var(--color-border)] rounded-[var(--radius-tile)] px-3.5 py-2 text-xs text-[var(--color-ink)] font-ui focus:outline-none focus:border-[var(--color-ink)]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-ink)] font-ui mb-1">
                Phone (+91)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[var(--color-surface-sunken)] border border-[var(--color-border)] rounded-[var(--radius-tile)] px-3.5 py-2 text-xs text-[var(--color-ink)] font-ui focus:outline-none focus:border-[var(--color-ink)]"
                required
              />
            </div>
          </div>

          {/* Deliberate Developer Simulator Panel (Dashed hairline border + simulator label) */}
          <div className="p-4 rounded-[var(--radius-tile)] border border-dashed border-[var(--color-pending)] bg-[var(--color-pending-bg)]/40 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-data font-semibold text-[var(--color-pending)]">
              <span className="flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>simulator controls (demo mode)</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider">Dev Ingestion</span>
            </div>
            <select
              value={failureScenario}
              onChange={(e) => setFailureScenario(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-tile)] px-3 py-1.5 text-xs text-[var(--color-ink)] font-data focus:outline-none"
            >
              <option value="bank_technical_error">Simulate: Temporary Bank Switch Issue (bank_technical_error)</option>
              <option value="insufficient_funds">Simulate: Insufficient Balance (INSUFFICIENT_FUNDS)</option>
              <option value="authentication_failed">Simulate: 2FA / OTP Timeout (AUTHENTICATION_FAILED)</option>
              <option value="opt_out">Simulate: Customer Opt-Out Policy Test</option>
            </select>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-ink)] hover:bg-[var(--color-ink)]/90 text-white font-semibold font-ui py-3 rounded-[var(--radius-pill)] text-xs flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{loading ? 'Processing Payment...' : `Pay ₹${amountRupees.toLocaleString('en-IN')}`}</span>
          </button>
        </form>

        {/* Inline Status Feedback */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-[var(--radius-tile)] text-xs font-ui border ${
              statusType === 'error'
                ? 'bg-[var(--color-pending-bg)] text-[var(--color-pending)] border-[var(--color-pending)]/20'
                : statusType === 'success'
                ? 'bg-[var(--color-recovered-bg)] text-[var(--color-recovered)] border-[var(--color-recovered)]/20'
                : 'bg-[var(--color-surface-sunken)] text-[var(--color-ink-secondary)] border-[var(--color-border)]'
            }`}
          >
            <div className="flex items-center space-x-2 font-semibold">
              {statusType === 'error' ? (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
