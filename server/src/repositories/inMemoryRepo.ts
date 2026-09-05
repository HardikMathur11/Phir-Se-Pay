import {
  Merchant,
  Customer,
  Order,
  Payment,
  Subscription,
  RecoveryCase,
  Intervention,
  Policy,
  WebhookEvent,
  Notification,
  Experiment,
  AuditEvent,
} from '../models/types';

export class InMemoryRepository {
  private merchants: Map<string, Merchant> = new Map();
  private customers: Map<string, Customer> = new Map();
  private orders: Map<string, Order> = new Map();
  private payments: Map<string, Payment> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();
  private recoveryCases: Map<string, RecoveryCase> = new Map();
  private interventions: Map<string, Intervention> = new Map();
  private policies: Map<string, Policy> = new Map();
  private webhookEvents: Map<string, WebhookEvent> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private experiments: Map<string, Experiment> = new Map();
  private auditEvents: AuditEvent[] = [];

  constructor() {
    this.seedDefaults();
  }

  public seedDefaults() {
    this.clearAll();

    const merchantId = 'merchant_default_1';
    const policyId = 'policy_default_1';
    const customerId = 'cust_amit_1';

    const defaultMerchant: Merchant = {
      id: merchantId,
      name: 'Acme SaaS India',
      email: 'merchant@acmesaas.in',
      currency: 'INR',
      policyId,
      providerMode: 'simulator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const defaultPolicy: Policy = {
      id: policyId,
      merchantId,
      maxAutomatedAttempts: 3,
      minimumRetryIntervalHours: 12,
      maxMessagesPerWeek: 3,
      maxAutomatedAmountInPaise: 1000000, // ₹10,000.00
      approvalRequiredAboveAmountInPaise: 1000000,
      lowConfidenceThreshold: 0.55,
      allowedChannels: ['email', 'dashboard'],
      respectOptOut: true,
      stopAfterSuccess: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const defaultCustomer: Customer = {
      id: customerId,
      merchantId,
      name: 'Amit Sharma',
      email: 'amit@example.com',
      phone: '+91 9876543210',
      preferredLanguage: 'en',
      communicationOptOut: false,
      lifetimeValueInPaise: 449700, // ₹4,497
      successfulPayments: 3,
      failedPayments: 1,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.merchants.set(merchantId, defaultMerchant);
    this.policies.set(policyId, defaultPolicy);
    this.customers.set(customerId, defaultCustomer);

    // Additional Realistic Customers
    const customersData: Customer[] = [
      {
        id: 'cust_priya_2',
        merchantId,
        name: 'Priya Patel',
        email: 'priya.patel@techcorp.in',
        phone: '+91 9811223344',
        preferredLanguage: 'en',
        communicationOptOut: false,
        lifetimeValueInPaise: 12500000,
        successfulPayments: 8,
        failedPayments: 1,
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cust_vikram_3',
        merchantId,
        name: 'Vikram Malhotra',
        email: 'vikram.m@startupventures.co',
        phone: '+91 9988776655',
        preferredLanguage: 'en',
        communicationOptOut: false,
        lifetimeValueInPaise: 349900,
        successfulPayments: 2,
        failedPayments: 1,
        createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cust_sneha_4',
        merchantId,
        name: 'Sneha Reddy',
        email: 'sneha.reddy@enterprisegroup.in',
        phone: '+91 9765432109',
        preferredLanguage: 'en',
        communicationOptOut: false,
        lifetimeValueInPaise: 25000000,
        successfulPayments: 12,
        failedPayments: 1,
        createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cust_rohan_5',
        merchantId,
        name: 'Rohan Iyer',
        email: 'rohan.iyer@fintechlabs.in',
        phone: '+91 9123456789',
        preferredLanguage: 'en',
        communicationOptOut: false,
        lifetimeValueInPaise: 899700,
        successfulPayments: 5,
        failedPayments: 1,
        createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cust_ananya_6',
        merchantId,
        name: 'Ananya Deshmukh',
        email: 'ananya.d@designstudio.io',
        phone: '+91 9876501234',
        preferredLanguage: 'en',
        communicationOptOut: false,
        lifetimeValueInPaise: 1699800,
        successfulPayments: 4,
        failedPayments: 1,
        createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const c of customersData) {
      this.customers.set(c.id, c);
    }

    // Seed Realistic Recovery Cases & Payments
    const casesData: Array<{
      case: RecoveryCase;
      order: Order;
      payment: Payment;
    }> = [
      {
        case: {
          id: 'case_demo_1',
          merchantId,
          customerId: 'cust_amit_1',
          originalPaymentId: 'pay_rzp_994827101',
          originalOrderId: 'order_rzp_8819201',
          recoveryPaymentId: 'pay_rec_994827999',
          recoveryPaymentLinkId: 'plink_rec_1',
          caseType: 'failed_payment',
          status: 'RECOVERED',
          amountAtRiskInPaise: 149900,
          amountRecoveredInPaise: 149900,
          cause: 'temporary_bank_issue',
          diagnosisConfidence: 0.94,
          diagnosisEvidence: ['HDFC Switch Error 502', 'Previous 3 payments successful', 'Failure during authorization step'],
          recoveryProbability: 0.92,
          proposedAction: 'payment_link',
          attemptCount: 1,
          maxAttempts: 3,
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        order: {
          id: 'order_rzp_8819201',
          merchantId,
          customerId: 'cust_amit_1',
          providerOrderId: 'order_TYE8yV3pqSsryR',
          amountInPaise: 149900,
          currency: 'INR',
          status: 'paid',
          purpose: 'initial_payment',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        payment: {
          id: 'pay_rzp_994827101',
          merchantId,
          customerId: 'cust_amit_1',
          providerPaymentId: 'pay_live_994827101',
          providerOrderId: 'order_TYE8yV3pqSsryR',
          amountInPaise: 149900,
          currency: 'INR',
          method: 'netbanking',
          status: 'captured',
          failureCode: 'BAD_REQUEST_ERROR',
          failureReason: 'bank_technical_error',
          failureDescription: 'HDFC Netbanking switch connection timeout',
          failureSource: 'bank',
          failureStep: 'payment_authorization',
          rawError: {
            code: 'BAD_REQUEST_ERROR',
            reason: 'bank_technical_error',
            source: 'bank',
            step: 'payment_authorization',
            description: 'HDFC Netbanking switch connection timeout',
          },
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      },
      {
        case: {
          id: 'case_demo_2',
          merchantId,
          customerId: 'cust_priya_2',
          originalPaymentId: 'pay_rzp_994827102',
          originalOrderId: 'order_rzp_8819202',
          caseType: 'failed_payment',
          status: 'APPROVAL_REQUIRED',
          amountAtRiskInPaise: 2499900, // ₹24,999 (> ₹10,000 threshold)
          amountRecoveredInPaise: 0,
          cause: 'customer_balance_issue',
          diagnosisConfidence: 0.88,
          diagnosisEvidence: ['High-value transaction above ₹10k limit', 'Corporate card declined: Limit exceeded', 'Requires merchant operator review'],
          recoveryProbability: 0.81,
          proposedAction: 'human_review',
          attemptCount: 0,
          maxAttempts: 3,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        order: {
          id: 'order_rzp_8819202',
          merchantId,
          customerId: 'cust_priya_2',
          providerOrderId: 'order_prov_priya_1',
          amountInPaise: 2499900,
          currency: 'INR',
          status: 'failed',
          purpose: 'initial_payment',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        payment: {
          id: 'pay_rzp_994827102',
          merchantId,
          customerId: 'cust_priya_2',
          providerPaymentId: 'pay_live_994827102',
          providerOrderId: 'order_prov_priya_1',
          amountInPaise: 2499900,
          currency: 'INR',
          method: 'card',
          status: 'failed',
          failureCode: 'INSUFFICIENT_FUNDS',
          failureReason: 'card_limit_exceeded',
          failureDescription: 'Daily transaction limit exceeded on corporate Visa card',
          failureSource: 'issuer',
          failureStep: 'payment_authorization',
          rawError: {
            code: 'INSUFFICIENT_FUNDS',
            reason: 'card_limit_exceeded',
            source: 'issuer',
            step: 'payment_authorization',
            description: 'Daily transaction limit exceeded on corporate Visa card',
          },
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      },
      {
        case: {
          id: 'case_demo_3',
          merchantId,
          customerId: 'cust_vikram_3',
          originalPaymentId: 'pay_rzp_994827103',
          originalOrderId: 'order_rzp_8819203',
          recoveryPaymentLinkId: 'plink_rec_3',
          caseType: 'failed_payment',
          status: 'ACTION_EXECUTED',
          amountAtRiskInPaise: 499900, // ₹4,999
          amountRecoveredInPaise: 0,
          cause: 'authentication_issue',
          diagnosisConfidence: 0.91,
          diagnosisEvidence: ['2FA OTP expired after 180s', 'Customer clicked retry twice on checkout', 'Empathetic WhatsApp & Email reminder dispatched'],
          recoveryProbability: 0.87,
          proposedAction: 'payment_link',
          attemptCount: 1,
          maxAttempts: 3,
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        order: {
          id: 'order_rzp_8819203',
          merchantId,
          customerId: 'cust_vikram_3',
          providerOrderId: 'order_prov_vikram_1',
          amountInPaise: 499900,
          currency: 'INR',
          status: 'failed',
          purpose: 'initial_payment',
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        payment: {
          id: 'pay_rzp_994827103',
          merchantId,
          customerId: 'cust_vikram_3',
          providerPaymentId: 'pay_live_994827103',
          providerOrderId: 'order_prov_vikram_1',
          amountInPaise: 499900,
          currency: 'INR',
          method: 'upi',
          status: 'failed',
          failureCode: 'AUTHENTICATION_FAILED',
          failureReason: 'otp_timeout',
          failureDescription: 'Customer 2FA authentication timed out during bank redirect',
          failureSource: 'customer',
          failureStep: 'payment_authentication',
          rawError: {
            code: 'AUTHENTICATION_FAILED',
            reason: 'otp_timeout',
            source: 'customer',
            step: 'payment_authentication',
            description: 'Customer 2FA authentication timed out during bank redirect',
          },
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
      },
      {
        case: {
          id: 'case_demo_4',
          merchantId,
          customerId: 'cust_sneha_4',
          originalPaymentId: 'pay_rzp_994827104',
          originalOrderId: 'order_rzp_8819204',
          caseType: 'failed_payment',
          status: 'APPROVAL_REQUIRED',
          amountAtRiskInPaise: 1250000, // ₹12,500
          amountRecoveredInPaise: 0,
          cause: 'temporary_bank_issue',
          diagnosisConfidence: 0.86,
          diagnosisEvidence: ['ICICI Bank Gateway Gateway Timeout', 'Amount > ₹10,000 threshold requires approval'],
          recoveryProbability: 0.79,
          proposedAction: 'human_review',
          attemptCount: 0,
          maxAttempts: 3,
          createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        },
        order: {
          id: 'order_rzp_8819204',
          merchantId,
          customerId: 'cust_sneha_4',
          providerOrderId: 'order_prov_sneha_1',
          amountInPaise: 1250000,
          currency: 'INR',
          status: 'failed',
          purpose: 'initial_payment',
          createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        },
        payment: {
          id: 'pay_rzp_994827104',
          merchantId,
          customerId: 'cust_sneha_4',
          providerPaymentId: 'pay_live_994827104',
          providerOrderId: 'order_prov_sneha_1',
          amountInPaise: 1250000,
          currency: 'INR',
          method: 'netbanking',
          status: 'failed',
          failureCode: 'GATEWAY_ERROR',
          failureReason: 'gateway_timeout',
          failureDescription: 'ICICI Corporate banking switch 504 gateway timeout',
          failureSource: 'gateway',
          failureStep: 'payment_authorization',
          rawError: {
            code: 'GATEWAY_ERROR',
            reason: 'gateway_timeout',
            source: 'gateway',
            step: 'payment_authorization',
            description: 'ICICI Corporate banking switch 504 gateway timeout',
          },
          createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        },
      },
      {
        case: {
          id: 'case_demo_5',
          merchantId,
          customerId: 'cust_rohan_5',
          originalPaymentId: 'pay_rzp_994827105',
          originalOrderId: 'order_rzp_8819205',
          recoveryPaymentId: 'pay_rec_994827105',
          recoveryPaymentLinkId: 'plink_rec_5',
          caseType: 'failed_payment',
          status: 'RECOVERED',
          amountAtRiskInPaise: 299900, // ₹2,999
          amountRecoveredInPaise: 299900,
          cause: 'temporary_bank_issue',
          diagnosisConfidence: 0.96,
          diagnosisEvidence: ['SBI UPI Switch Degradation Resolved', 'Automated link sent 20 mins post outage', 'Payment verified on Razorpay'],
          recoveryProbability: 0.95,
          proposedAction: 'payment_link',
          attemptCount: 1,
          maxAttempts: 3,
          createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 7).toISOString(),
        },
        order: {
          id: 'order_rzp_8819205',
          merchantId,
          customerId: 'cust_rohan_5',
          providerOrderId: 'order_prov_rohan_1',
          amountInPaise: 299900,
          currency: 'INR',
          status: 'paid',
          purpose: 'initial_payment',
          createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 7).toISOString(),
        },
        payment: {
          id: 'pay_rzp_994827105',
          merchantId,
          customerId: 'cust_rohan_5',
          providerPaymentId: 'pay_live_994827105',
          providerOrderId: 'order_prov_rohan_1',
          amountInPaise: 299900,
          currency: 'INR',
          method: 'upi',
          status: 'captured',
          failureCode: 'BAD_REQUEST_ERROR',
          failureReason: 'bank_technical_error',
          failureDescription: 'SBI UPI Switch temporary failure',
          failureSource: 'bank',
          failureStep: 'payment_authorization',
          rawError: {
            code: 'BAD_REQUEST_ERROR',
            reason: 'bank_technical_error',
            source: 'bank',
            step: 'payment_authorization',
            description: 'SBI UPI Switch temporary failure',
          },
          createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 7).toISOString(),
        },
      },
      {
        case: {
          id: 'case_demo_6',
          merchantId,
          customerId: 'cust_ananya_6',
          originalPaymentId: 'pay_rzp_994827106',
          originalOrderId: 'order_rzp_8819206',
          recoveryPaymentId: 'pay_rec_994827106',
          recoveryPaymentLinkId: 'plink_rec_6',
          caseType: 'failed_payment',
          status: 'RECOVERED',
          amountAtRiskInPaise: 849900, // ₹8,499
          amountRecoveredInPaise: 849900,
          cause: 'customer_balance_issue',
          diagnosisConfidence: 0.90,
          diagnosisEvidence: ['Card declined: Insufficient Balance', 'Payday recovery schedule triggered on 1st', 'Captured on first retry attempt'],
          recoveryProbability: 0.89,
          proposedAction: 'retry',
          attemptCount: 1,
          maxAttempts: 3,
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
        },
        order: {
          id: 'order_rzp_8819206',
          merchantId,
          customerId: 'cust_ananya_6',
          providerOrderId: 'order_prov_ananya_1',
          amountInPaise: 849900,
          currency: 'INR',
          status: 'paid',
          purpose: 'initial_payment',
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
        },
        payment: {
          id: 'pay_rzp_994827106',
          merchantId,
          customerId: 'cust_ananya_6',
          providerPaymentId: 'pay_live_994827106',
          providerOrderId: 'order_prov_ananya_1',
          amountInPaise: 849900,
          currency: 'INR',
          method: 'card',
          status: 'captured',
          failureCode: 'INSUFFICIENT_FUNDS',
          failureReason: 'insufficient_funds',
          failureDescription: 'Insufficient funds in customer card account',
          failureSource: 'bank',
          failureStep: 'payment_authorization',
          rawError: {
            code: 'INSUFFICIENT_FUNDS',
            reason: 'insufficient_funds',
            source: 'bank',
            step: 'payment_authorization',
            description: 'Insufficient funds in customer card account',
          },
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
        },
      },
    ];

    for (const item of casesData) {
      this.recoveryCases.set(item.case.id, item.case);
      this.orders.set(item.order.id, item.order);
      this.payments.set(item.payment.id, item.payment);
    }

    // Seed Realistic Customer Notifications for Demo Inbox
    const notificationsData: Notification[] = [
      {
        id: 'notif_demo_1',
        customerId: 'cust_amit_1',
        recoveryCaseId: 'case_demo_1',
        provider: 'demo_inbox',
        recipient: 'amit@example.com',
        subject: 'Action Required: Complete your Acme Cloud subscription (₹1,499.00)',
        body: `Hi Amit,

We noticed your payment of ₹1,499 for the Premium Cloud Pro Suite couldn't be completed due to a temporary bank network issue.

No worries! Your order and cart items have been securely reserved. You can complete your transaction with a single click below using any UPI, Card, or Netbanking method:

🔗 Payment Link: http://localhost:5173/recover/case_demo_1

If you already completed this or need help, simply ignore this message.

Warm regards,
Phir Se Pay Revenue Recovery Support`,
        recoveryLink: 'http://localhost:5173/recover/case_demo_1',
        status: 'opened',
        sentAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        openedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'notif_demo_2',
        customerId: 'cust_amit_1',
        recoveryCaseId: 'case_demo_3',
        provider: 'demo_inbox',
        recipient: 'amit@example.com',
        subject: 'Payment Update: Your recent order attempt was interrupted',
        body: `Hi Amit,

Your 2FA session for order #8819203 timed out during checkout. We have kept your invoice active for the next 24 hours.

Click the link below to resume right where you left off:
🔗 http://localhost:5173/recover/case_demo_1

Thank you for choosing Acme SaaS!`,
        recoveryLink: 'http://localhost:5173/recover/case_demo_1',
        status: 'sent',
        sentAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'notif_demo_3',
        customerId: 'cust_amit_1',
        recoveryCaseId: 'case_demo_5',
        provider: 'demo_inbox',
        recipient: 'amit@example.com',
        subject: 'Payment Confirmed: Your ₹2,999.00 renewal is successful',
        body: `Hi Amit,

Great news! Your recovery payment of ₹2,999.00 has been verified and captured on the server. Your pro features are now active.

Invoice ID: INV-994827105
Status: RECOVERED & VERIFIED

Thank you for your business!`,
        recoveryLink: 'http://localhost:5173/recover/case_demo_5',
        status: 'opened',
        sentAt: new Date(Date.now() - 3600000 * 7).toISOString(),
      },
    ];

    for (const notif of notificationsData) {
      this.notifications.set(notif.id, notif);
    }
  }

  public clearAll() {
    this.merchants.clear();
    this.customers.clear();
    this.orders.clear();
    this.payments.clear();
    this.subscriptions.clear();
    this.recoveryCases.clear();
    this.interventions.clear();
    this.policies.clear();
    this.webhookEvents.clear();
    this.notifications.clear();
    this.experiments.clear();
    this.auditEvents = [];
  }

  // Merchant
  public async getMerchant(id: string): Promise<Merchant | null> {
    return this.merchants.get(id) || null;
  }
  public async getFirstMerchant(): Promise<Merchant> {
    const list = Array.from(this.merchants.values());
    if (list.length > 0) return list[0];
    this.seedDefaults();
    return Array.from(this.merchants.values())[0];
  }
  public async updateMerchant(id: string, updates: Partial<Merchant>): Promise<Merchant> {
    const existing = await this.getMerchant(id);
    if (!existing) throw new Error(`Merchant ${id} not found`);
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.merchants.set(id, updated);
    return updated;
  }

  // Customer
  public async getCustomer(id: string): Promise<Customer | null> {
    return this.customers.get(id) || null;
  }
  public async getCustomerByEmail(email: string): Promise<Customer | null> {
    for (const cust of this.customers.values()) {
      if (cust.email.toLowerCase() === email.toLowerCase()) return cust;
    }
    return null;
  }
  public async saveCustomer(customer: Customer): Promise<Customer> {
    this.customers.set(customer.id, customer);
    return customer;
  }
  public async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    const existing = await this.getCustomer(id);
    if (!existing) throw new Error(`Customer ${id} not found`);
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.customers.set(id, updated);
    return updated;
  }

  // Order
  public async getOrder(id: string): Promise<Order | null> {
    return this.orders.get(id) || null;
  }
  public async getOrderByProviderOrderId(providerOrderId: string): Promise<Order | null> {
    for (const ord of this.orders.values()) {
      if (ord.providerOrderId === providerOrderId) return ord;
    }
    return null;
  }
  public async saveOrder(order: Order): Promise<Order> {
    this.orders.set(order.id, order);
    return order;
  }
  public async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const existing = await this.getOrder(id);
    if (!existing) throw new Error(`Order ${id} not found`);
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.orders.set(id, updated);
    return updated;
  }

  // Payment
  public async getPayment(id: string): Promise<Payment | null> {
    return this.payments.get(id) || null;
  }
  public async getPaymentByProviderPaymentId(providerPaymentId: string): Promise<Payment | null> {
    for (const pay of this.payments.values()) {
      if (pay.providerPaymentId === providerPaymentId) return pay;
    }
    return null;
  }
  public async savePayment(payment: Payment): Promise<Payment> {
    this.payments.set(payment.id, payment);
    return payment;
  }
  public async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    const existing = await this.getPayment(id);
    if (!existing) throw new Error(`Payment ${id} not found`);
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.payments.set(id, updated);
    return updated;
  }

  // Recovery Case
  public async getRecoveryCase(id: string): Promise<RecoveryCase | null> {
    return this.recoveryCases.get(id) || null;
  }
  public async getRecoveryCaseByOriginalPayment(paymentId: string): Promise<RecoveryCase | null> {
    for (const c of this.recoveryCases.values()) {
      if (c.originalPaymentId === paymentId) return c;
    }
    return null;
  }
  public async getRecoveryCaseByLinkOrOrderId(linkOrOrderId: string): Promise<RecoveryCase | null> {
    for (const c of this.recoveryCases.values()) {
      if (
        c.recoveryPaymentLinkId === linkOrOrderId ||
        c.recoveryOrderId === linkOrOrderId ||
        c.originalOrderId === linkOrOrderId
      ) {
        return c;
      }
    }
    return null;
  }
  public async getAllRecoveryCases(): Promise<RecoveryCase[]> {
    return Array.from(this.recoveryCases.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  public async saveRecoveryCase(caseItem: RecoveryCase): Promise<RecoveryCase> {
    this.recoveryCases.set(caseItem.id, caseItem);
    return caseItem;
  }
  public async updateRecoveryCase(id: string, updates: Partial<RecoveryCase>): Promise<RecoveryCase> {
    const existing = await this.getRecoveryCase(id);
    if (!existing) throw new Error(`RecoveryCase ${id} not found`);
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.recoveryCases.set(id, updated);
    return updated;
  }

  // Intervention
  public async getIntervention(id: string): Promise<Intervention | null> {
    return this.interventions.get(id) || null;
  }
  public async getInterventionsForCase(caseId: string): Promise<Intervention[]> {
    return Array.from(this.interventions.values()).filter((i) => i.recoveryCaseId === caseId);
  }
  public async saveIntervention(intervention: Intervention): Promise<Intervention> {
    this.interventions.set(intervention.id, intervention);
    return intervention;
  }
  public async updateIntervention(id: string, updates: Partial<Intervention>): Promise<Intervention> {
    const existing = await this.getIntervention(id);
    if (!existing) throw new Error(`Intervention ${id} not found`);
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.interventions.set(id, updated);
    return updated;
  }

  // Policy
  public async getPolicy(id: string): Promise<Policy | null> {
    return this.policies.get(id) || null;
  }
  public async getPolicyForMerchant(merchantId: string): Promise<Policy> {
    for (const pol of this.policies.values()) {
      if (pol.merchantId === merchantId) return pol;
    }
    const defaultPol: Policy = {
      id: `policy_${merchantId}`,
      merchantId,
      maxAutomatedAttempts: 3,
      minimumRetryIntervalHours: 12,
      maxMessagesPerWeek: 3,
      maxAutomatedAmountInPaise: 1000000,
      approvalRequiredAboveAmountInPaise: 1000000,
      lowConfidenceThreshold: 0.55,
      allowedChannels: ['email', 'dashboard'],
      respectOptOut: true,
      stopAfterSuccess: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.policies.set(defaultPol.id, defaultPol);
    return defaultPol;
  }
  public async updatePolicy(id: string, updates: Partial<Policy>): Promise<Policy> {
    const existing = await this.getPolicy(id);
    if (!existing) throw new Error(`Policy ${id} not found`);
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.policies.set(id, updated);
    return updated;
  }

  // Webhook Event
  public async getWebhookEventByExternalId(
    provider: string,
    externalEventId: string
  ): Promise<WebhookEvent | null> {
    const key = `${provider}:${externalEventId}`;
    return this.webhookEvents.get(key) || null;
  }
  public async saveWebhookEvent(event: WebhookEvent): Promise<WebhookEvent> {
    const key = `${event.provider}:${event.externalEventId}`;
    this.webhookEvents.set(key, event);
    return event;
  }

  // Notification
  public async getNotification(id: string): Promise<Notification | null> {
    return this.notifications.get(id) || null;
  }
  public async getNotificationsForCustomer(customerId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((n) => n.customerId === customerId)
      .sort((a, b) => new Date(b.sentAt || a.id).getTime() - new Date(a.sentAt || a.id).getTime());
  }
  public async getAllNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values()).sort(
      (a, b) => new Date(b.sentAt || a.id).getTime() - new Date(a.sentAt || a.id).getTime()
    );
  }
  public async saveNotification(notif: Notification): Promise<Notification> {
    this.notifications.set(notif.id, notif);
    return notif;
  }
  public async updateNotification(id: string, updates: Partial<Notification>): Promise<Notification> {
    const existing = await this.getNotification(id);
    if (!existing) throw new Error(`Notification ${id} not found`);
    const updated = { ...existing, ...updates };
    this.notifications.set(id, updated);
    return updated;
  }

  // Experiments
  public async saveExperiment(exp: Experiment): Promise<Experiment> {
    this.experiments.set(exp.id, exp);
    return exp;
  }
  public async getAllExperiments(): Promise<Experiment[]> {
    return Array.from(this.experiments.values());
  }
  public async clearExperiments(): Promise<void> {
    this.experiments.clear();
  }

  // Audit Event
  public async saveAuditEvent(event: AuditEvent): Promise<AuditEvent> {
    this.auditEvents.push(event);
    return event;
  }
  public async getAuditEvents(): Promise<AuditEvent[]> {
    return [...this.auditEvents].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const repo = new InMemoryRepository();
