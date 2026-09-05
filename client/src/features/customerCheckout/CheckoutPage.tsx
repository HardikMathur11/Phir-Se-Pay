import React, { useState } from 'react';
import { 
  CreditCard, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Smartphone, 
  Building2, 
  HelpCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import { api } from '../../api';

interface CheckoutPageProps {
  onPaymentFailed: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onPaymentFailed }) => {
  const [name, setName] = useState('Amit Sharma');
  const [email, setEmail] = useState('amit@example.com');
  const [phone, setPhone] = useState('+91 9876543210');
  const [productName] = useState('Premium Cloud Pro Suite');
  const [amountRupees] = useState(1499);
  const [failureScenario, setFailureScenario] = useState('bank_technical_error');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'info' | 'error' | 'success'>('info');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('Initiating bank order token with Razorpay API...');

    try {
      // 1. Create order on backend
      const orderData = await api.createOrder({
        name,
        email,
        phone,
        amountInPaise: amountRupees * 100,
        productName,
      });

      setStatusMessage('Order initialized. Awaiting payment authorization...');

      // Check if real Razorpay Checkout script is loaded & keys exist
      if (
        orderData.providerMode === 'razorpay_test' &&
        (window as any).Razorpay &&
        orderData.razorpayKeyId !== 'rzp_test_sample'
      ) {
        const options = {
          key: orderData.razorpayKeyId,
          amount: orderData.amountInPaise,
          currency: orderData.currency,
          name: 'Phir Se Pay Merchant',
          description: productName,
          order_id: orderData.providerOrderId,
          prefill: { name, email, contact: phone },
          theme: { color: '#0284c7' },
          handler: function (response: any) {
            setStatusType('success');
            setStatusMessage(`Payment Success! Razorpay Payment ID: ${response.razorpay_payment_id}`);
            setLoading(false);
          },
          modal: {
            ondismiss: function () {
              setStatusType('error');
              setStatusMessage('Payment modal dismissed. Ingesting payment.failed webhook event.');
              onPaymentFailed();
              setLoading(false);
            },
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // High-Fidelity Simulator Mode Failure
        setTimeout(async () => {
          await api.attemptPayment({
            orderId: orderData.orderId,
            simulateFailure: true,
            failureScenario,
          });
          setStatusType('error');
          setStatusMessage(
            `Payment Failed: Simulated ${failureScenario.replace(/_/g, ' ')} triggered. Live Webhook emitted to Merchant Dashboard.`
          );
          setLoading(false);
          onPaymentFailed();
        }, 1100);
      }
    } catch (err: any) {
      setStatusType('error');
      setStatusMessage(err.message || 'Payment attempt error');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-600/30 border border-sky-500/30 text-sky-400 flex items-center justify-center shadow-inner">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Customer Checkout Portal</h2>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                Step 1 of 3
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate an end-customer purchasing a product where a payment failure occurs.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-slate-400 bg-dark-900/80 px-3 py-1.5 rounded-xl border border-white/5">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Checkout Form & Card Mockup (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          {/* Payment Method Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-300 shadow-md ring-1 ring-sky-400/30'
                    : 'bg-dark-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit / Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-300 shadow-md ring-1 ring-sky-400/30'
                    : 'bg-dark-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-300 shadow-md ring-1 ring-sky-400/30'
                    : 'bg-dark-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>NetBanking</span>
              </button>
            </div>
          </div>

          {/* Realistic Virtual Card Mockup */}
          <div className="relative rounded-2xl p-5 bg-gradient-to-tr from-[#0f2142] via-[#162d59] to-[#0c162b] border border-sky-400/20 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-36 h-36 bg-sky-500/20 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-mono font-bold tracking-widest text-sky-300">RAZORPAY SECURE</span>
              <div className="w-9 h-6 rounded-md bg-amber-400/80 border border-amber-300 flex items-center justify-center shadow-inner">
                <div className="w-6 h-4 border border-amber-600/40 rounded-sm"></div>
              </div>
            </div>
            <div className="text-base sm:text-lg font-mono tracking-widest text-white mb-4">
              4111 •••• •••• 4242
            </div>
            <div className="flex justify-between items-end text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cardholder</span>
                <span className="font-bold text-slate-100 uppercase tracking-wide">{name || 'AMIT SHARMA'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Expires</span>
                <span className="font-mono font-bold text-slate-100">12/28</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Customer Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark-900/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-900/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-dark-900/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Failure Mode Selector */}
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Simulation: Injected Gateway Failure Scenario</span>
              </div>
              <select
                value={failureScenario}
                onChange={(e) => setFailureScenario(e.target.value)}
                className="w-full bg-dark-950 border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400 font-mono"
              >
                <option value="bank_technical_error">1. Temporary Bank Switch Error (bank_technical_error)</option>
                <option value="insufficient_funds">2. Insufficient Account Balance (INSUFFICIENT_FUNDS)</option>
                <option value="authentication_failed">3. 2FA / OTP Expired / Timed Out (AUTHENTICATION_FAILED)</option>
                <option value="opt_out">4. Customer Opt-Out Guard Test (Communication Blocked)</option>
              </select>
              <p className="text-[10px] text-amber-400/80">
                This triggers a realistic payment failure payload so Phir Se Pay can diagnose and recover the revenue.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-shimmer text-white font-extrabold py-3.5 rounded-2xl shadow-xl shadow-sky-500/20 text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Transacting with Gateway...' : `Authorize & Pay ₹${amountRupees.toLocaleString('en-IN')} Securely`}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>

          {/* Status Message Notification */}
          {statusMessage && (
            <div
              className={`p-4 rounded-2xl border text-xs flex items-start space-x-3 animate-fadeIn ${
                statusType === 'error'
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  : statusType === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-sky-500/15 border-sky-500/30 text-sky-300'
              }`}
            >
              {statusType === 'error' ? (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : statusType === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold block mb-0.5">Gateway Event Status</span>
                <span>{statusMessage}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Workflow Guidance (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Order Summary Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base border-b border-white/5 pb-3">Order Breakdown</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Plan Name</span>
                <span className="font-semibold text-white">{productName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Billing Cycle</span>
                <span className="font-semibold text-slate-200">Monthly auto-renew</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Subtotal</span>
                <span className="font-mono text-slate-200">₹{amountRupees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Applicable Taxes (GST 18%)</span>
                <span className="font-mono text-slate-400">Included</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-200">Total Amount Due</span>
                <span className="text-2xl font-extrabold text-sky-400 font-mono">
                  ₹{amountRupees.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="bg-dark-900/60 rounded-xl p-3 border border-white/5 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Risk Demonstration Mode</span>
              </div>
              <p>Safe sandbox environment prefilled with Amit Sharma's customer profile.</p>
            </div>
          </div>

          {/* Workflow Guide */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-sky-400 font-bold">
              <Zap className="w-4 h-4" />
              <span>Demonstration Next Steps</span>
            </div>
            <ol className="space-y-2 text-slate-300 list-decimal list-inside text-[11px] leading-relaxed">
              <li>Click <strong>"Authorize &amp; Pay"</strong> to trigger the selected failure.</li>
              <li>Switch to <strong>Tab 2 (Merchant)</strong> to see the real-time diagnosis &amp; policy check.</li>
              <li>Switch back to <strong>Customer Inbox</strong> to open the recovery payment link.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
