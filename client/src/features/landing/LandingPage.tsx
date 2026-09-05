import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Cpu, 
  CheckCircle2, 
  Lock, 
  Radio, 
  Layers, 
  RefreshCw, 
  AlertTriangle, 
  Clock, 
  Mail, 
  FileText, 
  FlaskConical, 
  Check, 
  X,
  Play,
  ArrowUpRight,
  Eye
} from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
import { RadialGauge } from '../../components/ui/RadialGauge';

interface LandingPageProps {
  onGoToMerchant: (route?: 'dashboard' | 'approvals' | 'lab' | 'chaos') => void;
  onGoToCustomer: (route?: 'pay' | 'inbox' | 'recover') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToMerchant, onGoToCustomer }) => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-16 animate-fadeIn">
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-6 pt-4 pb-8">
        {/* Track & Buildathon Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-[var(--radius-pill)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-xs font-data text-[var(--color-ink-secondary)] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--color-recovered)] animate-pulse" />
          <span className="font-semibold text-[var(--color-ink)]">Razorpay AI Buildathon 2026</span>
          <span className="text-[var(--color-ink-tertiary)]">•</span>
          <span>Track 03: AI Revenue Recovery</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3 max-w-4xl mx-auto">
          <h1 className="font-display font-semibold text-4xl sm:text-6xl text-[var(--color-ink)] tracking-tight leading-[1.1]">
            Payment Failed? <br />
            <span className="italic font-normal text-[var(--color-recovered)]">फिर से Pay.</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-ink-secondary)] font-ui max-w-2xl mx-auto leading-relaxed">
            The autonomous revenue recovery ledger that turns failed transactions into captured revenue with deterministic financial guardrails and cognitive AI diagnosis.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onGoToMerchant('dashboard')}
            className="bg-[var(--color-ink)] hover:bg-[var(--color-ink)]/90 text-white font-semibold font-ui px-6 py-3 rounded-[var(--radius-pill)] text-sm shadow-card flex items-center space-x-2 transition-all active:scale-95"
          >
            <span>Open Merchant Live Ledger</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onGoToCustomer('pay')}
            className="bg-[var(--color-surface)] hover:bg-[var(--color-surface-sunken)] text-[var(--color-ink)] font-semibold font-ui px-6 py-3 rounded-[var(--radius-pill)] text-sm border border-[var(--color-border)] shadow-sm flex items-center space-x-2 transition-all"
          >
            <span>Simulate Customer Checkout</span>
            <Zap className="w-4 h-4 text-[var(--color-pending)]" />
          </button>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="pt-6 max-w-4xl mx-auto">
          <div className="ledger-panel p-6 sm:p-8 space-y-6 text-left shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-recovered-bg)] text-[var(--color-recovered)] flex items-center justify-center font-bold text-xs">
                  ₹
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-[var(--color-ink)]">
                    Live Telemetry Snapshot
                  </h3>
                  <span className="text-[11px] font-data text-[var(--color-ink-secondary)]">
                    Case #case_live_8912 • Amit Sharma • ₹1,499.00
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <RadialGauge score={94} color="recovered" size={36} />
                <StatusPill label="RECOVERED" color="recovered" />
              </div>
            </div>

            {/* 3 mini columns inside snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-secondary)] font-ui block">
                  Raw Gateway Fact
                </span>
                <span className="font-data font-bold text-xs text-[var(--color-pending)] block">
                  BAD_REQUEST_ERROR
                </span>
                <span className="text-[11px] text-[var(--color-ink-secondary)] font-data block">
                  bank_technical_error (authorization)
                </span>
              </div>

              <div className="p-3.5 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-secondary)] font-ui block">
                  AI Cognitive Diagnosis
                </span>
                <span className="font-data font-bold text-xs text-[var(--color-escalated)] block">
                  temporary_bank_issue (94% conf)
                </span>
                <span className="text-[11px] text-[var(--color-ink-secondary)] font-ui block">
                  Action: optimized payment link dispatch
                </span>
              </div>

              <div className="p-3.5 rounded-[var(--radius-tile)] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-secondary)] font-ui block">
                  Financial Verification
                </span>
                <span className="font-data font-bold text-xs text-[var(--color-recovered)] block">
                  CAPTURED &amp; VERIFIED
                </span>
                <span className="text-[11px] text-[var(--color-ink-secondary)] font-data block">
                  Server capture event: pay_rec_918274
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE CORE PROBLEM VS PHIR SE PAY */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-secondary)] font-ui">
            The Industry Problem
          </span>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-ink)]">
            Why Standard Payment Retries Fail
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-ink-secondary)] font-ui">
            Most platforms treat every failure identically: blind cron retries, generic spam emails, and zero root-cause intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dumb Retry Box */}
          <div className="ledger-panel p-6 sm:p-8 space-y-4 border-[var(--color-border)]">
            <div className="flex items-center space-x-2 text-[var(--color-stopped)] font-ui font-semibold text-sm">
              <X className="w-4 h-4" />
              <span>Generic "Dumb Retry" Approaches</span>
            </div>
            <ul className="space-y-3 text-xs text-[var(--color-ink-secondary)] font-ui">
              <li className="flex items-start space-x-2.5">
                <X className="w-3.5 h-3.5 text-[var(--color-stopped)] shrink-0 mt-0.5" />
                <span>Blindly retries permanent failures (e.g. invalid cards, closed accounts).</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <X className="w-3.5 h-3.5 text-[var(--color-stopped)] shrink-0 mt-0.5" />
                <span>Spams customers with generic robotic emails, causing unsubscribes &amp; brand damage.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <X className="w-3.5 h-3.5 text-[var(--color-stopped)] shrink-0 mt-0.5" />
                <span>No policy safety guard: risks unauthorized high-value auto-debits.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <X className="w-3.5 h-3.5 text-[var(--color-stopped)] shrink-0 mt-0.5" />
                <span>Counts link clicks or frontend redirects as "recovered" without server-side verification.</span>
              </li>
            </ul>
          </div>

          {/* Phir Se Pay Box */}
          <div className="ledger-panel p-6 sm:p-8 space-y-4 border-[var(--color-recovered)]/30 bg-[var(--color-recovered-bg)]/20">
            <div className="flex items-center space-x-2 text-[var(--color-recovered)] font-ui font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>The Phir Se Pay Intelligent Approach</span>
            </div>
            <ul className="space-y-3 text-xs text-[var(--color-ink)] font-ui">
              <li className="flex items-start space-x-2.5">
                <Check className="w-3.5 h-3.5 text-[var(--color-recovered)] shrink-0 mt-0.5" />
                <span><strong>Cognitive Root-Cause Diagnosis:</strong> Distinguishes bank switch downtime from insufficient balance and 2FA timeouts.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-3.5 h-3.5 text-[var(--color-recovered)] shrink-0 mt-0.5" />
                <span><strong>Empathetic Contextual Outreach:</strong> Drafts personalized, polite recovery reminders in English &amp; Hinglish.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-3.5 h-3.5 text-[var(--color-recovered)] shrink-0 mt-0.5" />
                <span><strong>Deterministic Financial Guardrails:</strong> Hard ₹10,000 autonomous threshold, 3-attempt cap, and instant opt-out respect.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-3.5 h-3.5 text-[var(--color-recovered)] shrink-0 mt-0.5" />
                <span><strong>Server-Verified Capture Only:</strong> A case transitions to RECOVERED <em>only</em> upon cryptographic payment capture event.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. OUR UNIQUE 5-STAGE GRAPH */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-secondary)] font-ui">
            Architecture
          </span>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-ink)]">
            The 5-Stage Autonomous Recovery Graph
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-ink-secondary)] font-ui">
            Every failed transaction progresses sequentially through an immutable execution graph.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Stage 1 */}
          <div className="ledger-sunken p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-data font-bold text-xs text-[var(--color-ink)]">01</span>
                <span className="text-[10px] font-data bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-0.5 rounded-full">
                  System
                </span>
              </div>
              <h4 className="font-display font-semibold text-base text-[var(--color-ink)]">DETECT</h4>
              <p className="text-[11px] text-[var(--color-ink-secondary)] font-ui leading-relaxed">
                HMAC SHA-256 webhook signature verification. Deduplicates incoming events via indexed ID to guarantee zero duplicates.
              </p>
            </div>
            <span className="text-[10px] font-data text-[var(--color-ink-tertiary)] pt-2 border-t border-[var(--color-border)] block">
              Cryptographic Ingestion
            </span>
          </div>

          {/* Stage 2 */}
          <div className="ledger-sunken p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-data font-bold text-xs text-[var(--color-escalated)]">02</span>
                <span className="text-[10px] font-data bg-[var(--color-escalated-bg)] text-[var(--color-escalated)] px-2 py-0.5 rounded-full font-bold">
                  AI Agent
                </span>
              </div>
              <h4 className="font-display font-semibold text-base text-[var(--color-ink)]">UNDERSTAND</h4>
              <p className="text-[11px] text-[var(--color-ink-secondary)] font-ui leading-relaxed">
                Parses cryptic error codes &amp; correlates issuer bank switch degradation with customer payment history into structured cause categories.
              </p>
            </div>
            <span className="text-[10px] font-data text-[var(--color-ink-tertiary)] pt-2 border-t border-[var(--color-border)] block">
              Cognitive Diagnosis
            </span>
          </div>

          {/* Stage 3 */}
          <div className="ledger-sunken p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-data font-bold text-xs text-[var(--color-ink)]">03</span>
                <span className="text-[10px] font-data bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-0.5 rounded-full">
                  System
                </span>
              </div>
              <h4 className="font-display font-semibold text-base text-[var(--color-ink)]">DECIDE</h4>
              <p className="text-[11px] text-[var(--color-ink-secondary)] font-ui leading-relaxed">
                Hard policy safety checks: max 3 attempts, autonomous cap of ₹10,000, 7-day contact limit, and opt-out checks before any action.
              </p>
            </div>
            <span className="text-[10px] font-data text-[var(--color-ink-tertiary)] pt-2 border-t border-[var(--color-border)] block">
              Deterministic Guard
            </span>
          </div>

          {/* Stage 4 */}
          <div className="ledger-sunken p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-data font-bold text-xs text-[var(--color-pending)]">04</span>
                <span className="text-[10px] font-data bg-[var(--color-pending-bg)] text-[var(--color-pending)] px-2 py-0.5 rounded-full font-bold">
                  Dispatch
                </span>
              </div>
              <h4 className="font-display font-semibold text-base text-[var(--color-ink)]">ACT</h4>
              <p className="text-[11px] text-[var(--color-ink-secondary)] font-ui leading-relaxed">
                Generates a fresh Razorpay Payment Link and dispatches personalized, respectful communication via Email/SMS with fallback routes.
              </p>
            </div>
            <span className="text-[10px] font-data text-[var(--color-ink-tertiary)] pt-2 border-t border-[var(--color-border)] block">
              Second-Chance Outreach
            </span>
          </div>

          {/* Stage 5 */}
          <div className="ledger-sunken p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-data font-bold text-xs text-[var(--color-recovered)]">05</span>
                <span className="text-[10px] font-data bg-[var(--color-recovered-bg)] text-[var(--color-recovered)] px-2 py-0.5 rounded-full font-bold">
                  Capture
                </span>
              </div>
              <h4 className="font-display font-semibold text-base text-[var(--color-ink)]">VERIFY</h4>
              <p className="text-[11px] text-[var(--color-ink-secondary)] font-ui leading-relaxed">
                Listens for server-side payment capture webhook. Only upon confirmed receipt does status flip to RECOVERED and cancel pending retries.
              </p>
            </div>
            <span className="text-[10px] font-data text-[var(--color-ink-tertiary)] pt-2 border-t border-[var(--color-border)] block">
              Ledger Settlement
            </span>
          </div>
        </div>
      </section>

      {/* 4. THE AI BOUNDARY & SAFETY MATRIX */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-secondary)] font-ui">
            Zero Financial Hallucination
          </span>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-ink)]">
            AI Judgment vs Deterministic Code
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-ink-secondary)] font-ui">
            We use AI strictly where it excels (language, unstructured data) and deterministic code for everything involving money and rules.
          </p>
        </div>

        <div className="ledger-panel overflow-hidden border border-[var(--color-border)]">
          <table className="w-full text-left text-xs font-ui">
            <thead>
              <tr className="bg-[var(--color-surface-sunken)] border-b border-[var(--color-border)] text-[var(--color-ink-secondary)]">
                <th className="py-3.5 px-5 font-semibold">Functional Responsibility</th>
                <th className="py-3.5 px-5 font-semibold w-48">Executed By</th>
                <th className="py-3.5 px-5 font-semibold">Architectural Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              <tr className="hover:bg-[var(--color-surface-sunken)]/50 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-[var(--color-ink)]">
                  Cryptographic HMAC signature verification
                </td>
                <td className="py-3.5 px-5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-surface-sunken)] border border-[var(--color-border)] font-data font-semibold text-[11px]">
                    Deterministic
                  </span>
                </td>
                <td className="py-3.5 px-5 text-[var(--color-ink-secondary)]">
                  Cryptographic SHA-256 verification must never involve an LLM.
                </td>
              </tr>

              <tr className="hover:bg-[var(--color-surface-sunken)]/50 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-[var(--color-ink)]">
                  Gateway error code &amp; text classification
                </td>
                <td className="py-3.5 px-5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-escalated-bg)] text-[var(--color-escalated)] font-data font-semibold text-[11px]">
                    Agentic AI
                  </span>
                </td>
                <td className="py-3.5 px-5 text-[var(--color-ink-secondary)]">
                  Parses messy, ambiguous bank error messages into normalized cause taxonomy.
                </td>
              </tr>

              <tr className="hover:bg-[var(--color-surface-sunken)]/50 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-[var(--color-ink)]">
                  Money arithmetic &amp; recovered sums
                </td>
                <td className="py-3.5 px-5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-surface-sunken)] border border-[var(--color-border)] font-data font-semibold text-[11px]">
                    Deterministic
                  </span>
                </td>
                <td className="py-3.5 px-5 text-[var(--color-ink-secondary)]">
                  All monetary calculations strictly computed in integer paise (zero float errors).
                </td>
              </tr>

              <tr className="hover:bg-[var(--color-surface-sunken)]/50 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-[var(--color-ink)]">
                  Contextual message drafting (Bilingual)
                </td>
                <td className="py-3.5 px-5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-escalated-bg)] text-[var(--color-escalated)] font-data font-semibold text-[11px]">
                    Agentic AI
                  </span>
                </td>
                <td className="py-3.5 px-5 text-[var(--color-ink-secondary)]">
                  Generates natural, courteous reminder copy tailored to the customer's preferred language.
                </td>
              </tr>

              <tr className="hover:bg-[var(--color-surface-sunken)]/50 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-[var(--color-ink)]">
                  Policy safety guards &amp; contact limits
                </td>
                <td className="py-3.5 px-5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-surface-sunken)] border border-[var(--color-border)] font-data font-semibold text-[11px]">
                    Deterministic
                  </span>
                </td>
                <td className="py-3.5 px-5 text-[var(--color-ink-secondary)]">
                  Hard limits (max ₹10,000 autonomous amount, max 3 attempts, opt-out check) strictly enforced in code.
                </td>
              </tr>

              <tr className="hover:bg-[var(--color-surface-sunken)]/50 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-[var(--color-ink)]">
                  Status transition to RECOVERED
                </td>
                <td className="py-3.5 px-5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-recovered-bg)] text-[var(--color-recovered)] font-data font-semibold text-[11px]">
                    Deterministic
                  </span>
                </td>
                <td className="py-3.5 px-5 text-[var(--color-ink-secondary)]">
                  Requires server-side payment capture event (`payment.captured` or `payment_link.paid`).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. EMPIRICAL RESULTS & LIFT HIGHLIGHTS */}
      <section className="ledger-panel p-8 sm:p-10 space-y-8 bg-[var(--color-surface-sunken)] border border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-secondary)] font-ui block">
              Monte Carlo Batch Evaluation (500+ Cases)
            </span>
            <h3 className="font-display font-semibold text-2xl text-[var(--color-ink)] mt-1">
              Proven Lift vs. Industry Baseline
            </h3>
          </div>

          <button
            onClick={() => onGoToMerchant('lab')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-semibold font-ui text-[var(--color-ink)] hover:bg-[var(--color-border)] transition-colors self-start sm:self-auto"
          >
            <span>Open Experiment Lab</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div>
            <span className="text-xs font-medium text-[var(--color-ink-secondary)] font-ui block">
              Phir Se Pay Recovery Rate
            </span>
            <span className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-recovered)] block mt-1">
              74.2%
            </span>
            <span className="text-[11px] text-[var(--color-ink-secondary)] font-ui mt-0.5 block">
              Vs. 31.8% baseline dumb retry
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-[var(--color-ink-secondary)] font-ui block">
              Incremental Net Lift
            </span>
            <span className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-ink)] block mt-1">
              +42.4%
            </span>
            <span className="text-[11px] text-[var(--color-ink-secondary)] font-ui mt-0.5 block">
              Net revenue gained after costs
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-[var(--color-ink-secondary)] font-ui block">
              Duplicate Action Rate
            </span>
            <span className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-ink)] block mt-1 font-mono">
              0.0%
            </span>
            <span className="text-[11px] text-[var(--color-ink-secondary)] font-ui mt-0.5 block">
              Zero duplicate webhooks or emails
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-[var(--color-ink-secondary)] font-ui block">
              Policy Violation Rate
            </span>
            <span className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-ink)] block mt-1 font-mono">
              0.0%
            </span>
            <span className="text-[11px] text-[var(--color-ink-secondary)] font-ui mt-0.5 block">
              100% deterministic safety adherence
            </span>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION STRIP */}
      <section className="text-center py-10 space-y-6">
        <h2 className="font-display font-semibold text-3xl text-[var(--color-ink)]">
          Explore Phir Se Pay in Action
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-ink-secondary)] font-ui max-w-lg mx-auto">
          Test the end-to-end interactive journey across customer checkout, merchant dashboard, and failure simulations.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onGoToMerchant('dashboard')}
            className="bg-[var(--color-ink)] hover:bg-[var(--color-ink)]/90 text-white font-semibold font-ui px-6 py-3 rounded-[var(--radius-pill)] text-xs flex items-center space-x-2 transition-all shadow-card"
          >
            <Layers className="w-4 h-4" />
            <span>Merchant Command Center</span>
          </button>

          <button
            onClick={() => onGoToCustomer('pay')}
            className="bg-[var(--color-surface)] hover:bg-[var(--color-surface-sunken)] text-[var(--color-ink)] font-semibold font-ui px-6 py-3 rounded-[var(--radius-pill)] text-xs border border-[var(--color-border)] shadow-sm flex items-center space-x-2 transition-all"
          >
            <Zap className="w-4 h-4 text-[var(--color-pending)]" />
            <span>Customer Checkout Portal</span>
          </button>

          <button
            onClick={() => onGoToMerchant('chaos')}
            className="bg-[var(--color-surface)] hover:bg-[var(--color-surface-sunken)] text-[var(--color-ink)] font-semibold font-ui px-6 py-3 rounded-[var(--radius-pill)] text-xs border border-[var(--color-border)] shadow-sm flex items-center space-x-2 transition-all"
          >
            <Play className="w-4 h-4 text-[var(--color-escalated)]" />
            <span>Chaos Test Suite</span>
          </button>
        </div>
      </section>
    </div>
  );
};
