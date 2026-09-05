import { repo } from '../repositories/inMemoryRepo';
import { Customer, RecoveryCase, PolicyCheckResult } from '../models/types';

export class PolicyService {
  public async evaluatePolicy(
    recoveryCase: RecoveryCase,
    customer: Customer
  ): Promise<PolicyCheckResult> {
    const policy = await repo.getPolicyForMerchant(recoveryCase.merchantId);

    const checks: Array<{ name: string; passed: boolean; reason?: string }> = [];

    // 1. Payment status check (stop if already recovered)
    const notAlreadyRecovered = recoveryCase.status !== 'RECOVERED';
    checks.push({
      name: 'payment_not_already_successful',
      passed: notAlreadyRecovered,
      reason: notAlreadyRecovered ? undefined : 'Case is already recovered',
    });

    // 2. Customer opt-out check
    const optOutPassed = !customer.communicationOptOut || !policy.respectOptOut;
    checks.push({
      name: 'opt_out',
      passed: optOutPassed,
      reason: optOutPassed ? undefined : 'Customer has opted out of communication',
    });

    // 3. Attempt limit check
    const attemptPassed = recoveryCase.attemptCount < policy.maxAutomatedAttempts;
    checks.push({
      name: 'attempt_limit',
      passed: attemptPassed,
      reason: attemptPassed
        ? undefined : `Attempt limit reached (${recoveryCase.attemptCount}/${policy.maxAutomatedAttempts})`,
    });

    // 4. Amount limit check
    const amountPassed =
      recoveryCase.amountAtRiskInPaise <= policy.maxAutomatedAmountInPaise;
    checks.push({
      name: 'amount_limit',
      passed: amountPassed,
      reason: amountPassed
        ? undefined : `Amount ₹${(recoveryCase.amountAtRiskInPaise / 100).toLocaleString('en-IN')} exceeds autonomous limit ₹${(policy.maxAutomatedAmountInPaise / 100).toLocaleString('en-IN')}`,
    });

    // 5. Contact frequency check
    const notifications = await repo.getNotificationsForCustomer(customer.id);
    const weeklyCount = notifications.length; // simplified for demo
    const frequencyPassed = weeklyCount < policy.maxMessagesPerWeek;
    checks.push({
      name: 'contact_frequency',
      passed: frequencyPassed,
      reason: frequencyPassed
        ? undefined : `Weekly contact cap reached (${weeklyCount}/${policy.maxMessagesPerWeek})`,
    });

    // 6. Confidence check
    const confidencePassed =
      recoveryCase.diagnosisConfidence >= policy.lowConfidenceThreshold;
    checks.push({
      name: 'confidence_threshold',
      passed: confidencePassed,
      reason: confidencePassed
        ? undefined : `Diagnosis confidence (${recoveryCase.diagnosisConfidence}) below threshold (${policy.lowConfidenceThreshold})`,
    });

    // Determine overall results
    const allPassed = checks.every((c) => c.passed);
    const requiresApproval =
      recoveryCase.amountAtRiskInPaise > policy.approvalRequiredAboveAmountInPaise ||
      !confidencePassed ||
      recoveryCase.cause === 'unknown';

    let reason = 'Action is within merchant policy';
    if (!allPassed) {
      const failed = checks.filter((c) => !c.passed).map((c) => c.reason).join('; ');
      reason = `Policy check blocked action: ${failed}`;
    } else if (requiresApproval) {
      reason = 'Action requires manual merchant approval before execution';
    }

    return {
      allowed: allPassed && !requiresApproval,
      requiresApproval: allPassed && requiresApproval,
      checks,
      reason,
    };
  }
}

export const policyService = new PolicyService();
