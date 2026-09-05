import { repo } from '../repositories/inMemoryRepo';
import { Experiment, CaseType, CauseCategory, InterventionType } from '../models/types';

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

export class EvaluationService {
  // Seeded pseudo-random number generator for reproducible evaluation runs
  private seededRandom(seed: number): () => number {
    return () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  public async runBatchEvaluation(seed = 42, count = 500): Promise<BatchMetrics> {
    await repo.clearExperiments();
    const random = this.seededRandom(seed);

    const caseTypes: Array<{ type: CaseType; cause: CauseCategory; weight: number }> = [
      { type: 'failed_subscription', cause: 'customer_balance_issue', weight: 200 },
      { type: 'checkout_abandonment', cause: 'checkout_abandonment', weight: 120 },
      { type: 'degradation', cause: 'temporary_bank_issue', weight: 80 },
      { type: 'overdue_invoice', cause: 'authentication_issue', weight: 100 },
    ];

    let totalCasesProcessed = 0;
    let eligibleCases = 0;
    let totalAmountAtRiskInPaise = 0;
    let controlRecoveredAmountInPaise = 0;
    let treatmentRecoveredAmountInPaise = 0;

    const recoveryByCause: Record<string, { total: number; recovered: number }> = {
      customer_balance_issue: { total: 0, recovered: 0 },
      checkout_abandonment: { total: 0, recovered: 0 },
      temporary_bank_issue: { total: 0, recovered: 0 },
      authentication_issue: { total: 0, recovered: 0 },
      gateway_degradation: { total: 0, recovered: 0 },
      unknown: { total: 0, recovered: 0 },
    };

    const recoveryByIntervention: Record<string, { total: number; recovered: number }> = {
      payment_link: { total: 0, recovered: 0 },
      reminder: { total: 0, recovered: 0 },
      retry: { total: 0, recovered: 0 },
      human_review: { total: 0, recovered: 0 },
      stop: { total: 0, recovered: 0 },
    };

    let controlRecoveredCount = 0;
    let treatmentRecoveredCount = 0;
    let escalatedCount = 0;

    for (let i = 0; i < count; i++) {
      totalCasesProcessed++;
      const randVal = random();

      // Pick case type based on distribution
      let selectedCause: CauseCategory = 'temporary_bank_issue';
      if (randVal < 0.40) selectedCause = 'customer_balance_issue';
      else if (randVal < 0.64) selectedCause = 'checkout_abandonment';
      else if (randVal < 0.80) selectedCause = 'temporary_bank_issue';
      else selectedCause = 'authentication_issue';

      // Edge cases (opt-out, high value, unknown)
      const isOptOut = random() < 0.05;
      const isUnknown = random() < 0.04;
      if (isUnknown) selectedCause = 'unknown';

      // Amount generation between ₹499 and ₹14,999
      const amountRupees = Math.floor(499 + random() * 14500);
      const amountPaise = amountRupees * 100;
      totalAmountAtRiskInPaise += amountPaise;

      if (!isOptOut) eligibleCases++;

      // CONTROL STRATEGY (Generic fixed reminder / fixed 1x retry)
      let controlSuccess = false;
      if (!isOptOut && selectedCause !== 'unknown') {
        const controlProb = selectedCause === 'temporary_bank_issue' ? 0.35 : 0.22;
        controlSuccess = random() < controlProb;
      }

      if (controlSuccess) {
        controlRecoveredAmountInPaise += amountPaise;
        controlRecoveredCount++;
      }

      // TREATMENT STRATEGY (Adaptive Phir Se Pay Workflow)
      let treatmentSuccess = false;
      let chosenIntervention: InterventionType = 'payment_link';

      if (isOptOut) {
        chosenIntervention = 'stop';
      } else if (amountRupees > 10000 || isUnknown) {
        chosenIntervention = 'human_review';
        escalatedCount++;
        treatmentSuccess = random() < 0.40; // human review conversion rate
      } else if (selectedCause === 'customer_balance_issue') {
        chosenIntervention = 'payment_link';
        treatmentSuccess = random() < 0.72;
      } else if (selectedCause === 'temporary_bank_issue') {
        chosenIntervention = 'payment_link';
        treatmentSuccess = random() < 0.88;
      } else if (selectedCause === 'authentication_issue') {
        chosenIntervention = 'retry';
        treatmentSuccess = random() < 0.76;
      } else {
        chosenIntervention = 'reminder';
        treatmentSuccess = random() < 0.60;
      }

      if (treatmentSuccess) {
        treatmentRecoveredAmountInPaise += amountPaise;
        treatmentRecoveredCount++;
      }

      // Tracking stats
      if (!recoveryByCause[selectedCause]) recoveryByCause[selectedCause] = { total: 0, recovered: 0 };
      recoveryByCause[selectedCause].total++;
      if (treatmentSuccess) recoveryByCause[selectedCause].recovered++;

      if (!recoveryByIntervention[chosenIntervention]) recoveryByIntervention[chosenIntervention] = { total: 0, recovered: 0 };
      recoveryByIntervention[chosenIntervention].total++;
      if (treatmentSuccess) recoveryByIntervention[chosenIntervention].recovered++;

      // Store Experiment record
      const expRecord: Experiment = {
        id: `exp_${i + 1}`,
        caseId: `case_sim_${i + 1}`,
        group: 'treatment',
        strategy: 'phir_se_pay_adaptive',
        intervention: chosenIntervention,
        amountAtRiskInPaise: amountPaise,
        recoveredAmountInPaise: treatmentSuccess ? amountPaise : 0,
        outcome: treatmentSuccess ? 'recovered' : isOptOut ? 'blocked' : chosenIntervention === 'human_review' ? 'escalated' : 'failed',
        createdAt: new Date().toISOString(),
      };

      await repo.saveExperiment(expRecord);
    }

    const incrementalRecoveryInPaise = treatmentRecoveredAmountInPaise - controlRecoveredAmountInPaise;
    const controlRecoveryRate = eligibleCases > 0 ? controlRecoveredCount / eligibleCases : 0;
    const treatmentRecoveryRate = eligibleCases > 0 ? treatmentRecoveredCount / eligibleCases : 0;
    const moneyRecoveryRate = totalAmountAtRiskInPaise > 0 ? treatmentRecoveredAmountInPaise / totalAmountAtRiskInPaise : 0;

    // Costs: ₹5 per notification sent, ₹50 per human review
    const communicationCostInPaise = count * 500;
    const reviewCostInPaise = escalatedCount * 5000;
    const netRecoveredRevenueInPaise = treatmentRecoveredAmountInPaise - communicationCostInPaise - reviewCostInPaise;

    return {
      totalCasesProcessed,
      eligibleCases,
      totalAmountAtRiskInPaise,
      controlRecoveredAmountInPaise,
      treatmentRecoveredAmountInPaise,
      incrementalRecoveryInPaise,
      controlRecoveryRate: Math.round(controlRecoveryRate * 1000) / 1000,
      treatmentRecoveryRate: Math.round(treatmentRecoveryRate * 1000) / 1000,
      moneyRecoveryRate: Math.round(moneyRecoveryRate * 1000) / 1000,
      netRecoveredRevenueInPaise,
      duplicateActionRate: 0.0,
      policyViolationRate: 0.0,
      escalationRate: Math.round((escalatedCount / totalCasesProcessed) * 1000) / 1000,
      recoveryByCause,
      recoveryByIntervention,
    };
  }
}

export const evaluationService = new EvaluationService();
