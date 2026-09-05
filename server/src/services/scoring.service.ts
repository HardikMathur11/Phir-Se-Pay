import { Customer, CauseCategory } from '../models/types';

export interface ScoreFactors {
  priorPaymentSuccessRate: number; // 0 to 1
  failureTypeRecoverability: number; // 0 to 1
  customerHistoryScore: number; // 0 to 1
  recencyScore: number; // 0 to 1
  amountSuitabilityScore: number; // 0 to 1
  merchantInterventionHistory: number; // 0 to 1
  finalScore: number;
}

export class ScoringService {
  public calculateRecoveryScore(
    customer: Customer,
    cause: CauseCategory,
    amountInPaise: number
  ): ScoreFactors {
    // 1. Prior payment success rate
    const totalPayments = customer.successfulPayments + customer.failedPayments;
    const priorPaymentSuccessRate =
      totalPayments > 0 ? customer.successfulPayments / totalPayments : 0.8;

    // 2. Failure type recoverability
    let failureTypeRecoverability = 0.5;
    switch (cause) {
      case 'temporary_bank_issue':
        failureTypeRecoverability = 0.9;
        break;
      case 'customer_balance_issue':
        failureTypeRecoverability = 0.7;
        break;
      case 'authentication_issue':
        failureTypeRecoverability = 0.75;
        break;
      case 'gateway_degradation':
        failureTypeRecoverability = 0.85;
        break;
      case 'checkout_abandonment':
        failureTypeRecoverability = 0.6;
        break;
      case 'unknown':
        failureTypeRecoverability = 0.35;
        break;
    }

    // 3. Customer history score (based on LTV)
    const ltvInRupees = customer.lifetimeValueInPaise / 100;
    let customerHistoryScore = 0.5;
    if (ltvInRupees > 5000) customerHistoryScore = 0.95;
    else if (ltvInRupees > 2000) customerHistoryScore = 0.8;
    else if (ltvInRupees > 0) customerHistoryScore = 0.65;

    // 4. Recency score (always fresh in demo)
    const recencyScore = 0.9;

    // 5. Amount suitability score (small to moderate amounts are easier to recover)
    const amountInRupees = amountInPaise / 100;
    let amountSuitabilityScore = 0.85;
    if (amountInRupees > 50000) amountSuitabilityScore = 0.3;
    else if (amountInRupees > 10000) amountSuitabilityScore = 0.55;
    else if (amountInRupees > 2000) amountSuitabilityScore = 0.75;

    // 6. Merchant intervention history baseline
    const merchantInterventionHistory = 0.78;

    // Formula calculation
    const rawScore =
      0.25 * priorPaymentSuccessRate +
      0.20 * failureTypeRecoverability +
      0.20 * customerHistoryScore +
      0.15 * recencyScore +
      0.10 * amountSuitabilityScore +
      0.10 * merchantInterventionHistory;

    const finalScore = Math.max(0.0, Math.min(1.0, Math.round(rawScore * 100) / 100));

    return {
      priorPaymentSuccessRate,
      failureTypeRecoverability,
      customerHistoryScore,
      recencyScore,
      amountSuitabilityScore,
      merchantInterventionHistory,
      finalScore,
    };
  }
}

export const scoringService = new ScoringService();
