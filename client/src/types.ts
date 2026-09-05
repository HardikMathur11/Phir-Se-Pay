export type ProviderMode = 'razorpay_test' | 'simulator';
export type EmailMode = 'gmail' | 'demo_inbox';
export type StatusPillColor = 'recovered' | 'pending' | 'escalated' | 'stopped' | 'neutral';

export interface DashboardSummaryStrip {
  revenueAtRiskInPaise: number;
  recoveredInPaise: number;
  incrementalInPaise: number;
  recoveryRatePercent: number;
  needsApprovalCount: number;
}

export interface DashboardLiveFeedItem {
  caseId: string;
  customerName: string;
  method: string;
  amountInPaise: number;
  status: string;
  diagnosisCategory: string;
  diagnosisConfidence: number;
  statusPillColor: StatusPillColor;
  lastUpdatedAt: string;
}

export interface CaseDetailViewData {
  case: {
    id: string;
    merchantId: string;
    originalPaymentId: string;
    originalOrderId: string;
    amountAtRiskInPaise: number;
    amountRecoveredInPaise: number;
    currency: string;
    status: string;
    statusPillColor: StatusPillColor;
    cause: string;
    proposedAction: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    method: string;
    createdAt: string;
    lastUpdatedAt: string;
  };
  evidence: {
    code: string;
    reason: string;
    source: string;
    step: string;
    description: string;
    paymentId: string;
    orderId: string;
  };
  diagnosis: {
    category: string;
    confidence: number;
    recommendedAction: string;
    evidence: string[];
    featureAttributions?: Array<{
      feature: string;
      importance: number;
    }>;
  };
  ledgerTimeline: Array<{
    stage: 'DETECT' | 'UNDERSTAND' | 'DECIDE' | 'ACT' | 'VERIFY';
    label: string;
    timestamp: string | null;
    actor: 'system' | 'ai' | 'human';
    actorLabel: string;
    completed: boolean;
  }>;
  availableActions: Array<'approve' | 'reject' | 'stop' | 'replay_webhook'>;
}

export interface ReplayWebhookResult {
  passed: boolean;
  explanation: string;
  newDocumentsCreated: number;
}

export interface EvalComparisonViewData {
  baseline: {
    recoveredInPaise: number;
    recoveryRatePercent: number;
  };
  treatment: {
    recoveredInPaise: number;
    recoveryRatePercent: number;
  };
  incrementalInPaise: number;
  incrementalLiftPercent: number;
  chartSeries: Array<{
    category: string;
    baseline: number;
    treatment: number;
  }>;
}

export interface DashboardSummary {
  revenueAtRiskInPaise: number;
  recoveredRevenueInPaise: number;
  incrementalRecoveryInPaise: number;
  recoveryRate: number;
  totalCases: number;
  activeCases: number;
  approvalCases: number;
  duplicateWebhooksHandled: number;
  providerMode: ProviderMode;
  emailMode: EmailMode;
}

export interface RecoveryCase {
  id: string;
  merchantId: string;
  customerId: string;
  originalPaymentId: string;
  originalOrderId: string;
  recoveryPaymentId?: string;
  recoveryOrderId?: string;
  recoveryPaymentLinkId?: string;
  caseType: string;
  status: string;
  amountAtRiskInPaise: number;
  amountRecoveredInPaise: number;
  cause: string;
  diagnosisConfidence: number;
  diagnosisEvidence: string[];
  recoveryProbability: number;
  proposedAction: string;
  attemptCount: number;
  maxAttempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  communicationOptOut: boolean;
  lifetimeValueInPaise: number;
  successfulPayments: number;
  failedPayments: number;
}

export interface PolicyCheckResult {
  allowed: boolean;
  requiresApproval: boolean;
  checks: Array<{
    name: string;
    passed: boolean;
    reason?: string;
  }>;
  reason: string;
}

export interface Notification {
  id: string;
  customerId: string;
  recoveryCaseId: string;
  provider: string;
  recipient: string;
  subject: string;
  body: string;
  recoveryLink: string;
  status: string;
  sentAt?: string;
}

export interface AuditEvent {
  id: string;
  merchantId: string;
  recoveryCaseId?: string;
  eventType: string;
  actorType: string;
  actorId: string;
  decision?: string;
  evidence?: string[];
  policyResult?: PolicyCheckResult;
  outcome?: string;
  requestId: string;
  createdAt: string;
}

export interface BatchMetrics {
  totalCasesProcessed: number;
  eligibleCases: number;
  totalAmountAtRiskInPaise: number;
  controlRecoveredAmountInPaise: number;
  treatmentRecoveredAmountInPaise: number;
  incrementalRecoveryInPaise: number;
  controlRecoveryRate: number;
  treatmentRecoveryRate: number;
  moneyRecoveryRate: number;
  netRecoveredRevenueInPaise: number;
  duplicateActionRate: number;
  policyViolationRate: number;
  escalationRate: number;
  recoveryByCause: Record<string, { total: number; recovered: number }>;
  recoveryByIntervention: Record<string, { total: number; recovered: number }>;
}
