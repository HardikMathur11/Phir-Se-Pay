import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { EvaluatorTourBanner } from './components/EvaluatorTourBanner';
import { LandingPage } from './features/landing/LandingPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { ApprovalQueuePage } from './features/approvals/ApprovalQueuePage';
import { ExperimentLabPage } from './features/experiments/ExperimentLabPage';
import { ChaosPanelPage } from './features/chaos/ChaosPanelPage';
import { StyleGuide } from './components/StyleGuide';
import { PayCheckoutPage } from './features/customer/PayCheckoutPage';
import { PayRecoveryPage } from './features/customer/PayRecoveryPage';
import { CustomerInboxPage } from './features/customer/CustomerInboxPage';
import { CaseDetailDrawer } from './components/CaseDetailDrawer';
import { api } from './api';
import { ProviderMode, EmailMode, DashboardSummaryStrip } from './types';
import { CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customer' | 'merchant'>('merchant');
  const [activeMerchantRoute, setActiveMerchantRoute] = useState<'landing' | 'dashboard' | 'approvals' | 'lab' | 'chaos' | 'guide'>('landing');
  const [activeCustomerRoute, setActiveCustomerRoute] = useState<'pay' | 'recover' | 'inbox'>('pay');

  const [tourStep, setTourStep] = useState<number>(1);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [recoveryToken, setRecoveryToken] = useState<string>('case_demo_1');

  const [providerMode, setProviderMode] = useState<ProviderMode>('simulator');
  const [emailMode, setEmailMode] = useState<EmailMode>('demo_inbox');
  const [summaryData, setSummaryData] = useState<DashboardSummaryStrip | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchModes();
  }, []);

  const fetchModes = async () => {
    try {
      const modeData = await api.getProviderMode();
      setProviderMode(modeData.providerMode);
      setEmailMode(modeData.emailMode);
    } catch {
      // silent
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResetDemo = async () => {
    try {
      await api.resetDemoData();
      await fetchModes();
      showToast('Demo environment reset to pristine initial seed state');
      setSelectedCaseId(null);
    } catch {
      showToast('Reset demo failed');
    }
  };

  const handlePaymentFailed = () => {
    showToast('Payment failure event processed. Live ledger updated.');
    setTourStep(2);
  };

  const handleOpenRecoveryLink = (linkUrl: string) => {
    const parts = linkUrl.split('/');
    const token = parts[parts.length - 1];
    setRecoveryToken(token);
    setActiveTab('customer');
    setActiveCustomerRoute('recover');
    setTourStep(5);
  };

  const handlePaymentSuccess = () => {
    showToast('Payment captured on server! Case marked RECOVERED.');
    setTourStep(2);
  };

  const handleGoToMerchant = (route: 'dashboard' | 'approvals' | 'lab' | 'chaos' = 'dashboard') => {
    setActiveTab('merchant');
    setActiveMerchantRoute(route);
  };

  const handleGoToCustomer = (route: 'pay' | 'inbox' | 'recover' = 'pay') => {
    setActiveTab('customer');
    setActiveCustomerRoute(route);
  };

  const handleNavigateTourStep = async (stepNum: number) => {
    setTourStep(stepNum);
    if (stepNum === 1) {
      setActiveTab('customer');
      setActiveCustomerRoute('pay');
    } else if (stepNum === 2) {
      setActiveTab('merchant');
      setActiveMerchantRoute('dashboard');
      setSelectedCaseId(null);
    } else if (stepNum === 3) {
      setActiveTab('merchant');
      setActiveMerchantRoute('dashboard');
      try {
        const feed = await api.getDashboardLiveFeed(10);
        if (feed && feed.length > 0) {
          setSelectedCaseId(feed[0].caseId);
        }
      } catch {}
    } else if (stepNum === 4) {
      setActiveTab('customer');
      setActiveCustomerRoute('inbox');
    } else if (stepNum === 5) {
      setActiveTab('customer');
      setActiveCustomerRoute('recover');
    }
  };

  const handleQuickAutoRun = async () => {
    showToast('Step 1/5: Simulating Customer Checkout Failure (₹1,499)...');
    try {
      const order = await api.createOrder({
        name: 'Pooja Sharma',
        email: 'pooja@example.com',
        phone: '+91 9876543210',
        amountInPaise: 149900,
        productName: 'Premium Cloud Pro Suite',
      });

      await api.attemptPayment({
        orderId: order.orderId,
        simulateFailure: true,
        failureScenario: 'temporary_bank_issue',
      });

      // Jump to Step 2
      setActiveTab('merchant');
      setActiveMerchantRoute('dashboard');
      setTourStep(2);
      showToast('Step 2/5: Ingested via HMAC into Live Recovery Ledger!');

      setTimeout(async () => {
        const feed = await api.getDashboardLiveFeed(5);
        if (feed && feed.length > 0) {
          setSelectedCaseId(feed[0].caseId);
          setTourStep(3);
          showToast('Step 3/5: AI Root-Cause Diagnosis & Feature Attribution synthesized.');
        }
      }, 1500);
    } catch (err: any) {
      showToast(err.message || 'Auto-run simulation error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-page-bg)] text-[var(--color-ink)] font-ui">
      {/* Evaluator Guided Tour Ribbon */}
      <EvaluatorTourBanner
        currentStep={tourStep}
        onNavigateStep={handleNavigateTourStep}
        onQuickSimulate={handleQuickAutoRun}
      />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeMerchantRoute={activeMerchantRoute}
        setActiveMerchantRoute={setActiveMerchantRoute}
        activeCustomerRoute={activeCustomerRoute}
        setActiveCustomerRoute={setActiveCustomerRoute}
        providerMode={providerMode}
        emailMode={emailMode}
        onResetDemo={handleResetDemo}
        needsApprovalCount={summaryData?.needsApprovalCount || 0}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--color-ink)] text-white px-4 py-2.5 rounded-[var(--radius-pill)] shadow-card text-xs font-medium flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[var(--color-recovered)]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content View */}
      <main className="flex-1 pb-16">
        {activeTab === 'merchant' ? (
          <>
            {activeMerchantRoute === 'landing' && (
              <LandingPage
                onGoToMerchant={handleGoToMerchant}
                onGoToCustomer={handleGoToCustomer}
              />
            )}
            {activeMerchantRoute === 'dashboard' && (
              <DashboardPage
                onSelectCase={(id) => setSelectedCaseId(id)}
                onRefreshSummary={(s) => setSummaryData(s)}
              />
            )}
            {activeMerchantRoute === 'approvals' && (
              <ApprovalQueuePage onSelectCase={(id) => setSelectedCaseId(id)} />
            )}
            {activeMerchantRoute === 'lab' && <ExperimentLabPage />}
            {activeMerchantRoute === 'chaos' && <ChaosPanelPage />}
            {activeMerchantRoute === 'guide' && <StyleGuide />}
          </>
        ) : (
          <>
            {activeCustomerRoute === 'pay' && (
              <PayCheckoutPage onPaymentFailed={handlePaymentFailed} />
            )}
            {activeCustomerRoute === 'recover' && (
              <PayRecoveryPage
                token={recoveryToken}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}
            {activeCustomerRoute === 'inbox' && (
              <CustomerInboxPage onOpenRecoveryLink={handleOpenRecoveryLink} />
            )}
          </>
        )}
      </main>

      {/* Case Detail Drawer Overlay */}
      <CaseDetailDrawer
        caseId={selectedCaseId}
        onClose={() => setSelectedCaseId(null)}
        onActionComplete={() => {
          // Triggers refresh
        }}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-4 text-center text-xs text-[var(--color-ink-tertiary)] font-ui">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Phir Se Pay • Evaluator-Ready Financial Ledger Architecture</span>
          <span className="font-data text-[11px]">Track 03 • AI Revenue Recovery</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
