import React from 'react';
import { RefreshCw, Zap, Layers, Clock, FlaskConical, Play, Sparkles, BookOpen, Compass } from 'lucide-react';
import { ProviderMode, EmailMode } from '../types';

interface NavbarProps {
  activeTab: 'customer' | 'merchant';
  setActiveTab: (tab: 'customer' | 'merchant') => void;
  activeMerchantRoute: 'landing' | 'dashboard' | 'approvals' | 'lab' | 'chaos' | 'guide';
  setActiveMerchantRoute: (route: 'landing' | 'dashboard' | 'approvals' | 'lab' | 'chaos' | 'guide') => void;
  activeCustomerRoute: 'pay' | 'recover' | 'inbox';
  setActiveCustomerRoute: (route: 'pay' | 'recover' | 'inbox') => void;
  providerMode: ProviderMode;
  emailMode: EmailMode;
  onResetDemo: () => Promise<void> | void;
  needsApprovalCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeMerchantRoute,
  setActiveMerchantRoute,
  activeCustomerRoute,
  setActiveCustomerRoute,
  providerMode,
  emailMode,
  onResetDemo,
  needsApprovalCount = 0,
}) => {
  return (
    <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Wordmark (small circular mark + serif "Phir Se Pay" text) */}
          <div
            onClick={() => {
              setActiveTab('merchant');
              setActiveMerchantRoute('landing');
            }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--color-ink)] group-hover:bg-[var(--color-recovered)] flex items-center justify-center text-white font-display text-sm font-semibold shadow-sm transition-colors">
              ₹
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-display font-semibold text-lg text-[var(--color-ink)] tracking-tight group-hover:text-[var(--color-ink)] transition-colors">
                Phir Se Pay
              </span>
              <span className="text-[11px] text-[var(--color-ink-secondary)] font-ui hidden sm:inline">
                Revenue Recovery Ledger
              </span>
            </div>
          </div>

          {/* Role Switcher (Tab 1 Customer vs Tab 2 Merchant) */}
          <div className="flex items-center bg-[var(--color-surface-sunken)] p-1 rounded-[var(--radius-pill)] border border-[var(--color-border)]">
            <button
              onClick={() => setActiveTab('merchant')}
              className={`px-3.5 py-1 rounded-[var(--radius-pill)] text-xs font-semibold font-ui transition-all ${
                activeTab === 'merchant'
                  ? 'bg-[var(--color-surface)] text-[var(--color-ink)] shadow-sm'
                  : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
              }`}
            >
              Merchant Control
            </button>
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-3.5 py-1 rounded-[var(--radius-pill)] text-xs font-semibold font-ui transition-all ${
                activeTab === 'customer'
                  ? 'bg-[var(--color-surface)] text-[var(--color-ink)] shadow-sm'
                  : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
              }`}
            >
              Customer View
            </button>
          </div>

          {/* Mode Badge & Merchant Avatar */}
          <div className="flex items-center space-x-3">
            {/* Mode badge in monospace inside hairline pill */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-[10px] font-data text-[var(--color-ink-secondary)]">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  providerMode === 'razorpay_test'
                    ? 'bg-[var(--color-recovered)]'
                    : 'bg-[var(--color-pending)]'
                }`}
              />
              <span>
                {providerMode === 'razorpay_test' ? 'razorpay test mode' : 'simulator mode'}
              </span>
            </div>

            {/* Reset Button */}
            <button
              onClick={onResetDemo}
              className="p-1.5 rounded-full hover:bg-[var(--color-surface-sunken)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] transition-colors border border-[var(--color-border)]"
              title="Reset Demo Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Merchant Avatar */}
            <div className="w-8 h-8 rounded-full bg-[var(--color-surface-sunken)] border border-[var(--color-border)] flex items-center justify-center font-data text-xs font-semibold text-[var(--color-ink)]">
              M
            </div>
          </div>
        </div>

        {/* Sub-Navigation Strip */}
        <div className="flex items-center space-x-6 border-t border-[var(--color-border)] py-2 text-xs font-ui overflow-x-auto">
          {activeTab === 'merchant' ? (
            <>
              <button
                onClick={() => setActiveMerchantRoute('landing')}
                className={`pb-1 font-semibold flex items-center space-x-1.5 transition-colors border-b-2 whitespace-nowrap ${
                  activeMerchantRoute === 'landing'
                    ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
                    : 'border-transparent text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Product Overview</span>
              </button>

              <button
                onClick={() => setActiveMerchantRoute('dashboard')}
                className={`pb-1 font-semibold flex items-center space-x-1.5 transition-colors border-b-2 whitespace-nowrap ${
                  activeMerchantRoute === 'dashboard'
                    ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
                    : 'border-transparent text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Live Cases &amp; Ledger</span>
              </button>

              <button
                onClick={() => setActiveMerchantRoute('approvals')}
                className={`pb-1 font-semibold flex items-center space-x-1.5 transition-colors border-b-2 relative whitespace-nowrap ${
                  activeMerchantRoute === 'approvals'
                    ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
                    : 'border-transparent text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Approval Queue</span>
                {needsApprovalCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[var(--color-pending-bg)] text-[var(--color-pending)] font-data text-[10px] font-bold">
                    {needsApprovalCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveMerchantRoute('lab')}
                className={`pb-1 font-semibold flex items-center space-x-1.5 transition-colors border-b-2 whitespace-nowrap ${
                  activeMerchantRoute === 'lab'
                    ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
                    : 'border-transparent text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Experiment Lab</span>
              </button>

              <button
                onClick={() => setActiveMerchantRoute('chaos')}
                className={`pb-1 font-semibold flex items-center space-x-1.5 transition-colors border-b-2 whitespace-nowrap ${
                  activeMerchantRoute === 'chaos'
                    ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
                    : 'border-transparent text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Chaos &amp; Scenarios</span>
              </button>

              <button
                onClick={() => setActiveMerchantRoute('guide')}
                className={`pb-1 font-semibold flex items-center space-x-1.5 transition-colors border-b-2 whitespace-nowrap ${
                  activeMerchantRoute === 'guide'
                    ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
                    : 'border-transparent text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Design System</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveCustomerRoute('pay')}
                className={`pb-1 font-semibold flex items-center space-x-1.5 transition-colors border-b-2 whitespace-nowrap ${
                  activeCustomerRoute === 'pay'
                    ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
                    : 'border-transparent text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Checkout (/pay)</span>
              </button>

              <button
                onClick={() => setActiveCustomerRoute('recover')}
                className={`pb-1 font-semibold flex items-center space-x-1.5 transition-colors border-b-2 whitespace-nowrap ${
                  activeCustomerRoute === 'recover'
                    ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
                    : 'border-transparent text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recovery (/recover)</span>
              </button>

              <button
                onClick={() => setActiveCustomerRoute('inbox')}
                className={`pb-1 font-semibold flex items-center space-x-1.5 transition-colors border-b-2 whitespace-nowrap ${
                  activeCustomerRoute === 'inbox'
                    ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
                    : 'border-transparent text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]'
                }`}
              >
                <span>Demo Inbox (/inbox)</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
