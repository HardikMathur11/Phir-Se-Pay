import { v4 as uuidv4 } from 'uuid';
import { repo } from '../repositories/inMemoryRepo';
import { getPaymentProvider } from '../config/providers';
import { recoveryService } from './recovery.service';
import { auditService } from './audit.service';
import { realtimeService } from './realtime.service';
import { WebhookEvent, Order, Payment } from '../models/types';

export class WebhookService {
  public async processWebhook(
    rawBody: string | Buffer,
    signature: string,
    rawPayload: any,
    requestId: string
  ): Promise<{ status: 'processed' | 'duplicate' | 'failed'; eventId: string }> {
    const paymentProvider = getPaymentProvider();
    const providerName = paymentProvider.getMode();

    // 1. Signature Verification
    const signatureValid = paymentProvider.verifyWebhook(rawBody, signature);

    // 2. Event Normalization
    const normalized = paymentProvider.normalizeWebhook(rawPayload);

    // 3. Deduplication Check
    const existing = await repo.getWebhookEventByExternalId(providerName, normalized.externalEventId);
    if (existing) {
      // Record duplicate event without re-triggering case creation or revenue increments!
      await auditService.recordEvent({
        merchantId: (await repo.getFirstMerchant()).id,
        eventType: 'webhook.duplicate',
        actorType: 'system',
        actorId: 'webhook_ingestion',
        inputSnapshot: { externalEventId: normalized.externalEventId, eventType: normalized.eventType },
        decision: 'Duplicate event detected. Skipped state mutation.',
        requestId,
      });

      realtimeService.broadcast('webhook.duplicate', {
        externalEventId: normalized.externalEventId,
        eventType: normalized.eventType,
      });

      return { status: 'duplicate', eventId: normalized.externalEventId };
    }

    // 4. Save Webhook Event Record
    const eventRecord: WebhookEvent = {
      id: `whevt_${uuidv4().substring(0, 10)}`,
      provider: providerName === 'razorpay_test' ? 'razorpay' : 'simulator',
      externalEventId: normalized.externalEventId,
      eventType: normalized.eventType,
      signatureValid,
      rawPayload,
      normalizedPayload: normalized,
      processingStatus: 'received',
      receivedAt: new Date().toISOString(),
    };

    await repo.saveWebhookEvent(eventRecord);

    const merchant = await repo.getFirstMerchant();
    let customer = await repo.getCustomerByEmail(normalized.customerEmail || 'amit@example.com');
    if (!customer) {
      customer = await repo.getCustomer('cust_amit_1') || (await repo.saveCustomer({
        id: `cust_${uuidv4().substring(0, 8)}`,
        merchantId: merchant.id,
        name: 'Amit Sharma',
        email: normalized.customerEmail || 'amit@example.com',
        phone: normalized.customerPhone || '+91 9876543210',
        preferredLanguage: 'en',
        communicationOptOut: false,
        lifetimeValueInPaise: 449700,
        successfulPayments: 3,
        failedPayments: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }

    // 5. Handle Payment Failure
    if (normalized.eventType === 'payment.failed') {
      const orderId = `ord_${uuidv4().substring(0, 10)}`;
      const paymentId = `pay_${uuidv4().substring(0, 10)}`;

      const order: Order = {
        id: orderId,
        merchantId: merchant.id,
        customerId: customer.id,
        providerOrderId: normalized.providerOrderId || `order_prov_${uuidv4().substring(0, 8)}`,
        amountInPaise: normalized.amountInPaise || 149900,
        currency: normalized.currency || 'INR',
        status: 'failed',
        purpose: 'initial_payment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const payment: Payment = {
        id: paymentId,
        merchantId: merchant.id,
        customerId: customer.id,
        providerPaymentId: normalized.providerPaymentId || `pay_prov_${uuidv4().substring(0, 8)}`,
        providerOrderId: order.providerOrderId,
        amountInPaise: order.amountInPaise,
        currency: order.currency,
        method: normalized.method || 'netbanking',
        status: 'failed',
        failureCode: normalized.error?.code,
        failureReason: normalized.error?.reason,
        failureDescription: normalized.error?.description,
        failureSource: normalized.error?.source,
        failureStep: normalized.error?.step,
        rawError: normalized.error,
        failedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repo.saveOrder(order);
      await repo.savePayment(payment);

      // Broadcast raw payment.failed event
      realtimeService.broadcast('payment.failed', {
        paymentId: payment.id,
        orderId: order.id,
        providerPaymentId: payment.providerPaymentId,
        amountInPaise: payment.amountInPaise,
        rawError: payment.rawError,
        customerName: customer.name,
      });

      // Orchestrate Recovery Case creation
      const recoveryCase = await recoveryService.createRecoveryCaseForPayment(payment, order, requestId);

      await repo.saveWebhookEvent({
        ...eventRecord,
        processingStatus: 'processed',
        processedAt: new Date().toISOString(),
      });

      return { status: 'processed', eventId: normalized.externalEventId };
    }

    // 6. Handle Payment Capture / Link Paid (Success Events)
    if (
      normalized.eventType === 'payment.captured' ||
      normalized.eventType === 'payment_link.paid' ||
      normalized.eventType === 'order.paid'
    ) {
      await recoveryService.handleVerifiedPaymentSuccess({
        providerPaymentId: normalized.providerPaymentId,
        providerOrderId: normalized.providerOrderId,
        providerLinkId: normalized.providerLinkId,
        amountInPaise: normalized.amountInPaise || 149900,
        notes: normalized.notes,
        requestId,
      });

      await repo.saveWebhookEvent({
        ...eventRecord,
        processingStatus: 'processed',
        processedAt: new Date().toISOString(),
      });

      return { status: 'processed', eventId: normalized.externalEventId };
    }

    return { status: 'processed', eventId: normalized.externalEventId };
  }
}

export const webhookService = new WebhookService();
