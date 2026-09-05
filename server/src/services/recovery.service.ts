import { v4 as uuidv4 } from 'uuid';
import { repo } from '../repositories/inMemoryRepo';
import { getPaymentProvider, getEmailProvider } from '../config/providers';
import { diagnosisService } from './diagnosis.service';
import { scoringService } from './scoring.service';
import { policyService } from './policy.service';
import { auditService } from './audit.service';
import { realtimeService } from './realtime.service';
import {
  RecoveryCase,
  Payment,
  Order,
  Intervention,
  RecoveryCaseStatus,
} from '../models/types';

export class RecoveryService {
  public async createRecoveryCaseForPayment(
    payment: Payment,
    order: Order,
    requestId: string
  ): Promise<RecoveryCase> {
    // Check if recovery case already exists for this payment
    const existing = await repo.getRecoveryCaseByOriginalPayment(payment.id);
    if (existing) return existing;

    const customer = await repo.getCustomer(payment.customerId);
    if (!customer) throw new Error(`Customer ${payment.customerId} not found`);

    const caseId = `case_${uuidv4().substring(0, 10)}`;
    const amountInRupees = payment.amountInPaise / 100;

    // 1. Run Diagnosis
    const diagnosis = await diagnosisService.diagnoseFailure(
      payment.rawError,
      customer.name,
      amountInRupees
    );

    // 2. Calculate Recovery Score
    const scoreFactors = scoringService.calculateRecoveryScore(
      customer,
      diagnosis.cause,
      payment.amountInPaise
    );

    let initialStatus: RecoveryCaseStatus = 'DIAGNOSED';
    if (diagnosis.requiresApproval || diagnosis.cause === 'unknown' || scoreFactors.finalScore < 0.55) {
      initialStatus = 'APPROVAL_REQUIRED';
    } else {
      initialStatus = 'ACTION_PENDING';
    }

    const newCase: RecoveryCase = {
      id: caseId,
      merchantId: payment.merchantId,
      customerId: payment.customerId,
      originalPaymentId: payment.id,
      originalOrderId: order.id,
      caseType: 'failed_payment',
      status: initialStatus,
      amountAtRiskInPaise: payment.amountInPaise,
      amountRecoveredInPaise: 0,
      cause: diagnosis.cause,
      diagnosisConfidence: diagnosis.confidence,
      diagnosisEvidence: diagnosis.evidence,
      recoveryProbability: scoreFactors.finalScore,
      proposedAction: diagnosis.recommendedAction,
      attemptCount: 0,
      maxAttempts: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await repo.saveRecoveryCase(newCase);

    // Audit Event
    await auditService.recordEvent({
      merchantId: payment.merchantId,
      recoveryCaseId: caseId,
      eventType: 'recovery.case.created',
      actorType: 'ai_agent',
      actorId: 'phir_se_pay_engine',
      inputSnapshot: { paymentId: payment.id, error: payment.rawError },
      decision: `Diagnosed cause: ${diagnosis.cause} with probability ${scoreFactors.finalScore}`,
      evidence: diagnosis.evidence,
      outcome: `Case status set to ${initialStatus}`,
      requestId,
    });

    // SSE Broadcast
    realtimeService.broadcast('recovery.case.created', {
      caseId: newCase.id,
      customerName: customer.name,
      amountInPaise: newCase.amountAtRiskInPaise,
      cause: newCase.cause,
      status: newCase.status,
      recoveryProbability: newCase.recoveryProbability,
    });

    // Auto-execute if status is ACTION_PENDING
    if (initialStatus === 'ACTION_PENDING') {
      await this.executeActionForCase(newCase.id, requestId);
    }

    return newCase;
  }

  public async executeActionForCase(caseId: string, requestId: string): Promise<RecoveryCase> {
    const recoveryCase = await repo.getRecoveryCase(caseId);
    if (!recoveryCase) throw new Error(`Recovery case ${caseId} not found`);

    if (recoveryCase.status === 'RECOVERED' || recoveryCase.status === 'STOPPED') {
      return recoveryCase;
    }

    const customer = await repo.getCustomer(recoveryCase.customerId);
    if (!customer) throw new Error(`Customer ${recoveryCase.customerId} not found`);

    // 1. Evaluate Policy Guard
    const policyResult = await policyService.evaluatePolicy(recoveryCase, customer);

    await auditService.recordEvent({
      merchantId: recoveryCase.merchantId,
      recoveryCaseId: caseId,
      eventType: 'policy.check.evaluated',
      actorType: 'system',
      actorId: 'policy_guard',
      policyResult,
      decision: policyResult.allowed ? 'POLICY_PASSED' : 'POLICY_BLOCKED',
      requestId,
    });

    if (!policyResult.allowed) {
      if (policyResult.requiresApproval) {
        const updated = await repo.updateRecoveryCase(caseId, { status: 'APPROVAL_REQUIRED' });
        realtimeService.broadcast('human.approval.required', { caseId, reason: policyResult.reason });
        return updated;
      } else {
        const updated = await repo.updateRecoveryCase(caseId, {
          status: 'STOPPED',
          stopReason: policyResult.reason,
        });
        realtimeService.broadcast('recovery.case.stopped', { caseId, reason: policyResult.reason });
        return updated;
      }
    }

    // 2. Create Payment Link using PaymentProvider
    const paymentProvider = getPaymentProvider();
    const emailProvider = getEmailProvider();
    const amountInRupees = recoveryCase.amountAtRiskInPaise / 100;

    const linkResult = await paymentProvider.createPaymentLink({
      amountInPaise: recoveryCase.amountAtRiskInPaise,
      currency: 'INR',
      description: `Phir Se Pay Recovery Payment for Order #${recoveryCase.originalOrderId.substring(0, 8)}`,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      notes: {
        recoveryCaseId: caseId,
        originalPaymentId: recoveryCase.originalPaymentId,
      },
    });

    const interventionId = `interv_${uuidv4().substring(0, 10)}`;
    const intervention: Intervention = {
      id: interventionId,
      recoveryCaseId: caseId,
      type: recoveryCase.proposedAction,
      channel: 'email',
      status: 'sent',
      message: `Payment recovery link created for ₹${amountInRupees}`,
      paymentLinkUrl: linkResult.shortUrl,
      idempotencyKey: `idemp_${caseId}_${recoveryCase.attemptCount + 1}`,
      attemptNumber: recoveryCase.attemptCount + 1,
      executedAt: new Date().toISOString(),
      outcome: 'Payment link generated and dispatched',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await repo.saveIntervention(intervention);

    // 3. Send Reminder Email via EmailProvider
    const emailSubject = `Aapka payment dobara complete karein — Phir Se Pay`;
    const emailBody = `Namaste ${customer.name},\n\nPremium Subscription ke liye ₹${amountInRupees.toLocaleString('en-IN')} ka payment complete nahi ho paya.\n\nAap is secure link se dobara try kar sakte hain:\n${linkResult.shortUrl}\n\nAgar payment already ho gaya hai, to is message ko ignore karein.\n\nRegards,\nPhir Se Pay`;

    await emailProvider.sendRecoveryEmail({
      customerId: customer.id,
      recoveryCaseId: caseId,
      recipient: customer.email,
      subject: emailSubject,
      body: emailBody,
      recoveryLink: linkResult.shortUrl,
    });

    // Update case record
    const updatedCase = await repo.updateRecoveryCase(caseId, {
      status: 'ACTION_EXECUTED',
      recoveryPaymentLinkId: linkResult.id,
      attemptCount: recoveryCase.attemptCount + 1,
    });

    await auditService.recordEvent({
      merchantId: recoveryCase.merchantId,
      recoveryCaseId: caseId,
      eventType: 'intervention.sent',
      actorType: 'ai_agent',
      actorId: 'phir_se_pay_engine',
      decision: `Generated recovery link ${linkResult.id} and dispatched email to ${customer.email}`,
      outcome: `Intervention status set to SENT via ${emailProvider.getMode()}`,
      requestId,
    });

    realtimeService.broadcast('notification.sent', {
      caseId,
      customerEmail: customer.email,
      provider: emailProvider.getMode(),
      paymentLinkUrl: linkResult.shortUrl,
    });

    return updatedCase;
  }

  public async handleVerifiedPaymentSuccess(input: {
    providerPaymentId?: string;
    providerOrderId?: string;
    providerLinkId?: string;
    amountInPaise: number;
    notes?: Record<string, string>;
    requestId: string;
  }): Promise<RecoveryCase | null> {
    // Locate recovery case
    let recoveryCase: RecoveryCase | null = null;

    if (input.notes?.recoveryCaseId) {
      recoveryCase = await repo.getRecoveryCase(input.notes.recoveryCaseId);
    }

    if (!recoveryCase && input.providerLinkId) {
      recoveryCase = await repo.getRecoveryCaseByLinkOrOrderId(input.providerLinkId);
    }

    if (!recoveryCase && input.providerOrderId) {
      recoveryCase = await repo.getRecoveryCaseByLinkOrOrderId(input.providerOrderId);
    }

    if (!recoveryCase) {
      // Fallback: search all AT_RISK or ACTION_EXECUTED cases matching amount
      const allCases = await repo.getAllRecoveryCases();
      recoveryCase = allCases.find((c) => c.status !== 'RECOVERED' && c.status !== 'STOPPED') || null;
    }

    if (!recoveryCase) return null;

    // Strict Rule: Prevent duplicate recovered amount incrementing!
    if (recoveryCase.status === 'RECOVERED') {
      await auditService.recordEvent({
        merchantId: recoveryCase.merchantId,
        recoveryCaseId: recoveryCase.id,
        eventType: 'webhook.duplicate_success_ignored',
        actorType: 'system',
        actorId: 'recovery_engine',
        decision: 'Ignored duplicate success event; case is already RECOVERED',
        requestId: input.requestId,
      });
      return recoveryCase;
    }

    // Mark RECOVERED & increment recovered revenue
    const updatedCase = await repo.updateRecoveryCase(recoveryCase.id, {
      status: 'RECOVERED',
      amountRecoveredInPaise: recoveryCase.amountAtRiskInPaise,
      recoveryPaymentId: input.providerPaymentId || `pay_rec_${uuidv4().substring(0, 8)}`,
      recoveryOrderId: input.providerOrderId || `ord_rec_${uuidv4().substring(0, 8)}`,
    });

    // Update customer stats
    const customer = await repo.getCustomer(recoveryCase.customerId);
    if (customer) {
      await repo.updateCustomer(customer.id, {
        successfulPayments: customer.successfulPayments + 1,
        lifetimeValueInPaise: customer.lifetimeValueInPaise + recoveryCase.amountAtRiskInPaise,
      });
    }

    // Cancel pending interventions and notifications
    const interventions = await repo.getInterventionsForCase(recoveryCase.id);
    for (const interv of interventions) {
      if (interv.status === 'proposed' || interv.status === 'scheduled') {
        await repo.updateIntervention(interv.id, { status: 'cancelled' });
      }
    }

    // Record Audit Event
    await auditService.recordEvent({
      merchantId: recoveryCase.merchantId,
      recoveryCaseId: recoveryCase.id,
      eventType: 'recovery.case.recovered',
      actorType: 'razorpay',
      actorId: 'payment_provider',
      decision: `Verified payment success. Case marked RECOVERED with ₹${recoveryCase.amountAtRiskInPaise / 100}`,
      outcome: 'Pending retries and reminders cancelled',
      requestId: input.requestId,
    });

    // Broadcast SSE Event to Merchant Dashboard Live
    realtimeService.broadcast('recovery.case.recovered', {
      caseId: recoveryCase.id,
      amountRecoveredInPaise: recoveryCase.amountAtRiskInPaise,
      providerPaymentId: input.providerPaymentId,
      customerName: customer?.name || 'Customer',
    });

    return updatedCase;
  }
}

export const recoveryService = new RecoveryService();
