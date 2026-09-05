import { diagnosisService } from '../services/diagnosis.service.js';
import { scoringService } from '../services/scoring.service.js';
import { policyService } from '../services/policy.service.js';
import { Customer, RecoveryCase } from '../models/types.js';

describe('Phir Se Pay — Unit Test Suite', () => {
  describe('Diagnosis Service', () => {
    it('should correctly classify insufficient funds error', async () => {
      const result = await diagnosisService.diagnoseFailure(
        { code: 'INSUFFICIENT_FUNDS', reason: 'insufficient_balance' },
        'Amit Sharma',
        1499
      );
      expect(result.cause).toBe('customer_balance_issue');
      expect(result.recommendedAction).toBe('payment_link');
    });

    it('should correctly classify temporary bank network error', async () => {
      const result = await diagnosisService.diagnoseFailure(
        { code: 'BAD_REQUEST_ERROR', reason: 'bank_technical_error' },
        'Amit Sharma',
        1499
      );
      expect(result.cause).toBe('temporary_bank_issue');
    });
  });

  describe('Scoring Service', () => {
    it('should calculate valid recovery probability between 0 and 1', () => {
      const mockCustomer: Customer = {
        id: 'cust_test_1',
        merchantId: 'merchant_1',
        name: 'Amit Sharma',
        email: 'amit@example.com',
        phone: '+919876543210',
        preferredLanguage: 'en',
        communicationOptOut: false,
        lifetimeValueInPaise: 449700,
        successfulPayments: 3,
        failedPayments: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const factors = scoringService.calculateRecoveryScore(mockCustomer, 'temporary_bank_issue', 149900);
      expect(factors.finalScore).toBeGreaterThanOrEqual(0.0);
      expect(factors.finalScore).toBeLessThanOrEqual(1.0);
      expect(factors.failureTypeRecoverability).toBe(0.9);
    });
  });

  describe('Policy Service', () => {
    it('should block communication if customer has opted out', async () => {
      const mockCustomer: Customer = {
        id: 'cust_opt_out',
        merchantId: 'merchant_default_1',
        name: 'Opt Out User',
        email: 'optout@example.com',
        phone: '+919876543210',
        preferredLanguage: 'en',
        communicationOptOut: true,
        lifetimeValueInPaise: 0,
        successfulPayments: 0,
        failedPayments: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockCase: RecoveryCase = {
        id: 'case_opt_out',
        merchantId: 'merchant_default_1',
        customerId: 'cust_opt_out',
        originalPaymentId: 'pay_1',
        originalOrderId: 'ord_1',
        caseType: 'failed_payment',
        status: 'ACTION_PENDING',
        amountAtRiskInPaise: 149900,
        amountRecoveredInPaise: 0,
        cause: 'customer_balance_issue',
        diagnosisConfidence: 0.9,
        diagnosisEvidence: ['Insufficient funds'],
        recoveryProbability: 0.8,
        proposedAction: 'payment_link',
        attemptCount: 0,
        maxAttempts: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await policyService.evaluatePolicy(mockCase, mockCustomer);
      expect(result.allowed).toBe(false);
      expect(result.checks.find((c) => c.name === 'opt_out')?.passed).toBe(false);
    });
  });
});
