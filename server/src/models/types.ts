import { z } from 'zod';

// ==========================================
// 1. DOMAIN ENUMS & TYPES
// ==========================================

export type ProviderMode = 'razorpay_test' | 'simulator';
export type EmailMode = 'gmail' | 'demo_inbox';

export type OrderStatus = 'created' | 'attempted' | 'paid' | 'failed' | 'cancelled' | 'expired';
export type OrderPurpose = 'initial_payment' | 'recovery_payment';

export type PaymentStatus = 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';

export type CaseType =
  | 'failed_payment'
  | 'failed_subscription'
  | 'checkout_abandonment'
  | 'overdue_invoice'
  | 'degradation';

export type RecoveryCaseStatus =
  | 'AT_RISK'
  | 'DIAGNOSING'
  | 'DIAGNOSED'
  | 'ACTION_PENDING'
  | 'APPROVAL_REQUIRED'
  | 'APPROVED'
  | 'ACTION_EXECUTED'
  | 'RETRY_PENDING'
  | 'RECOVERED'
  | 'ESCALATED'
  | 'STOPPED'
  | 'EXPIRED'
  | 'UNRESOLVED';

export type CauseCategory =
  | 'customer_balance_issue'
  | 'authentication_issue'
  | 'temporary_bank_issue'
  | 'gateway_degradation'
  | 'checkout_abandonment'
  | 'unknown';

export type InterventionType =
  | 'retry'
  | 'payment_link'
  | 'reminder'
  | 'alternate_method'
  | 'human_review'
  | 'stop';

export type InterventionChannel = 'email' | 'sms' | 'whatsapp' | 'dashboard' | 'none';

export type InterventionStatus =
  | 'proposed'
  | 'approval_required'
  | 'approved'
  | 'scheduled'
  | 'sent'
  | 'opened'
  | 'succeeded'
  | 'failed'
  | 'cancelled';

export type NotificationProvider = 'gmail' | 'demo_inbox';
export type NotificationStatus = 'queued' | 'sent' | 'opened' | 'failed' | 'cancelled';

export type ActorType = 'system' | 'ai_agent' | 'merchant_user' | 'customer' | 'razorpay' | 'simulator';

// ==========================================
// 2. INTERFACES & SCHEMAS
// ==========================================

export interface Merchant {
  id: string;
  name: string;
  email: string;
  currency: string;
  policyId: string;
  providerMode: ProviderMode;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  merchantId: string;
  name: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  communicationOptOut: boolean;
  lifetimeValueInPaise: number;
  successfulPayments: number;
  failedPayments: number;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  merchantId: string;
  customerId: string;
  providerOrderId: string;
  amountInPaise: number;
  currency: string;
  status: OrderStatus;
  purpose: OrderPurpose;
  recoveryCaseId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RawPaymentError {
  code?: string;
  description?: string;
  reason?: string;
  source?: string;
  step?: string;
  metadata?: Record<string, any>;
}

export interface Payment {
  id: string;
  merchantId: string;
  customerId: string;
  providerPaymentId: string;
  providerOrderId: string;
  subscriptionId?: string;
  amountInPaise: number;
  currency: string;
  method: string;
  status: PaymentStatus;
  failureCode?: string;
  failureReason?: string;
  failureDescription?: string;
  failureSource?: string;
  failureStep?: string;
  rawError?: RawPaymentError;
  failedAt?: string;
  capturedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  merchantId: string;
  customerId: string;
  planId: string;
  providerSubscriptionId: string;
  status: string;
  amountInPaise: number;
  nextBillingAt: string;
  createdAt: string;
  updatedAt: string;
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
  caseType: CaseType;
  status: RecoveryCaseStatus;
  amountAtRiskInPaise: number;
  amountRecoveredInPaise: number;
  cause: CauseCategory;
  diagnosisConfidence: number;
  diagnosisEvidence: string[];
  recoveryProbability: number;
  proposedAction: InterventionType;
  attemptCount: number;
  maxAttempts: number;
  nextActionAt?: string;
  stopReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Intervention {
  id: string;
  recoveryCaseId: string;
  type: InterventionType;
  channel: InterventionChannel;
  status: InterventionStatus;
  message?: string;
  paymentLinkUrl?: string;
  idempotencyKey: string;
  attemptNumber: number;
  scheduledAt?: string;
  executedAt?: string;
  outcome?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Policy {
  id: string;
  merchantId: string;
  maxAutomatedAttempts: number;
  minimumRetryIntervalHours: number;
  maxMessagesPerWeek: number;
  maxAutomatedAmountInPaise: number;
  approvalRequiredAboveAmountInPaise: number;
  lowConfidenceThreshold: number;
  allowedChannels: InterventionChannel[];
  respectOptOut: boolean;
  stopAfterSuccess: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface WebhookEvent {
  id: string;
  provider: 'razorpay' | 'simulator';
  externalEventId: string;
  eventType: string;
  signatureValid: boolean;
  rawPayload: any;
  normalizedPayload: {
    paymentId?: string;
    orderId?: string;
    linkId?: string;
    amountInPaise?: number;
    status?: string;
    error?: RawPaymentError;
    customerEmail?: string;
    customerPhone?: string;
  };
  processingStatus: 'received' | 'processed' | 'duplicate' | 'failed' | 'dead_letter';
  errorMessage?: string;
  receivedAt: string;
  processedAt?: string;
}

export interface Notification {
  id: string;
  customerId: string;
  recoveryCaseId: string;
  provider: NotificationProvider;
  recipient: string;
  subject: string;
  body: string;
  recoveryLink: string;
  status: NotificationStatus;
  providerMessageId?: string;
  sentAt?: string;
  openedAt?: string;
}

export interface Experiment {
  id: string;
  caseId: string;
  group: 'control' | 'treatment';
  strategy: string;
  intervention: InterventionType;
  amountAtRiskInPaise: number;
  recoveredAmountInPaise: number;
  outcome: 'recovered' | 'failed' | 'blocked' | 'escalated';
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  merchantId: string;
  recoveryCaseId?: string;
  eventType: string;
  actorType: ActorType;
  actorId: string;
  inputSnapshot?: Record<string, any>;
  decision?: string;
  evidence?: string[];
  policyResult?: PolicyCheckResult;
  outcome?: string;
  requestId: string;
  createdAt: string;
}

// ==========================================
// 3. ZOD VALIDATORS FOR AI & REQUESTS
// ==========================================

export const AIDiagnosisSchema = z.object({
  cause: z.enum([
    'customer_balance_issue',
    'authentication_issue',
    'temporary_bank_issue',
    'gateway_degradation',
    'checkout_abandonment',
    'unknown',
  ]),
  confidence: z.number().min(0).max(1),
  evidence: z.array(z.string()),
  recoveryProbability: z.number().min(0).max(1),
  recommendedAction: z.enum([
    'retry',
    'payment_link',
    'reminder',
    'alternate_method',
    'human_review',
    'stop',
  ]),
  delayHours: z.number().min(0),
  requiresApproval: z.boolean(),
  messageDraft: z.string(),
  stopConditions: z.array(z.string()),
});

export type AIDiagnosisOutput = z.infer<typeof AIDiagnosisSchema>;

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error: string | null;
  requestId: string;
}
