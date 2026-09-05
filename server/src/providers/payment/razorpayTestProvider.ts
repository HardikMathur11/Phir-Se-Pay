import Razorpay from 'razorpay';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import {
  PaymentProvider,
  CreateOrderInput,
  PaymentProviderOrder,
  PaymentProviderPayment,
  CreatePaymentLinkInput,
  PaymentLinkResult,
  NormalizedWebhookPayload,
} from './paymentProvider';
import { RawPaymentError } from '../../models/types';

export class RazorpayTestPaymentProvider implements PaymentProvider {
  private razorpay: Razorpay;
  private keySecret: string;
  private webhookSecret: string;

  constructor(keyId: string, keySecret: string, webhookSecret?: string) {
    this.keySecret = keySecret;
    this.webhookSecret = webhookSecret || '';
    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  public getMode(): 'razorpay_test' {
    return 'razorpay_test';
  }

  public async createOrder(input: CreateOrderInput): Promise<PaymentProviderOrder> {
    const options = {
      amount: input.amountInPaise,
      currency: input.currency || 'INR',
      receipt: input.receipt || `rcpt_${uuidv4().substring(0, 8)}`,
      notes: input.notes || {},
    };

    const rzpOrder = await this.razorpay.orders.create(options as any);
    return {
      id: rzpOrder.id,
      amountInPaise: Number(rzpOrder.amount),
      currency: rzpOrder.currency,
      status: rzpOrder.status,
      receipt: rzpOrder.receipt || undefined,
      notes: (rzpOrder.notes as Record<string, string>) || {},
    };
  }

  public async fetchOrder(orderId: string): Promise<PaymentProviderOrder | null> {
    try {
      const rzpOrder = await this.razorpay.orders.fetch(orderId);
      if (!rzpOrder) return null;
      return {
        id: rzpOrder.id,
        amountInPaise: Number(rzpOrder.amount),
        currency: rzpOrder.currency,
        status: rzpOrder.status,
        receipt: rzpOrder.receipt || undefined,
        notes: (rzpOrder.notes as Record<string, string>) || {},
      };
    } catch {
      return null;
    }
  }

  public async fetchPayment(paymentId: string): Promise<PaymentProviderPayment | null> {
    try {
      const rzpPayment: any = await this.razorpay.payments.fetch(paymentId);
      if (!rzpPayment) return null;
      return {
        id: rzpPayment.id,
        orderId: rzpPayment.order_id,
        amountInPaise: Number(rzpPayment.amount),
        currency: rzpPayment.currency,
        status: rzpPayment.status,
        method: rzpPayment.method || 'card',
        error: rzpPayment.error_code
          ? {
              code: rzpPayment.error_code,
              description: rzpPayment.error_description,
              reason: rzpPayment.error_reason,
              source: rzpPayment.error_source,
              step: rzpPayment.error_step,
            }
          : undefined,
      };
    } catch {
      return null;
    }
  }

  public async createPaymentLink(input: CreatePaymentLinkInput): Promise<PaymentLinkResult> {
    const origin = process.env.CLIENT_URL || 'http://localhost:5173';
    const payload = {
      amount: input.amountInPaise,
      currency: input.currency || 'INR',
      accept_partial: false,
      description: input.description,
      customer: {
        name: input.customerName,
        email: input.customerEmail,
        contact: input.customerPhone || '+919876543210',
      },
      notify: {
        sms: false,
        email: false,
      },
      reminder_enable: true,
      notes: input.notes || {},
      callback_url: input.callbackUrl || `${origin}/recovery-pay/callback`,
      callback_method: 'get',
    };

    const link: any = await this.razorpay.paymentLink.create(payload as any);
    return {
      id: link.id,
      shortUrl: link.short_url,
      amountInPaise: Number(link.amount),
      currency: link.currency,
      status: link.status,
    };
  }

  public verifyWebhook(rawBody: string | Buffer, signature: string): boolean {
    if (!this.webhookSecret) return true; // In dev testing without webhook secret configured
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(rawBody)
        .digest('hex');
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    } catch {
      return false;
    }
  }

  public normalizeWebhook(rawPayload: any, eventIdHeader?: string): NormalizedWebhookPayload {
    const eventId = rawPayload?.event_id || eventIdHeader || `evt_rzp_${uuidv4().substring(0, 10)}`;
    const eventTypeRaw = rawPayload?.event || 'payment.failed';

    let eventType: NormalizedWebhookPayload['eventType'] = 'unknown';
    if (eventTypeRaw === 'payment.failed') eventType = 'payment.failed';
    else if (eventTypeRaw === 'payment.captured' || eventTypeRaw === 'payment.authorized') eventType = 'payment.captured';
    else if (eventTypeRaw === 'payment_link.paid') eventType = 'payment_link.paid';
    else if (eventTypeRaw === 'order.paid') eventType = 'order.paid';

    const entity = rawPayload?.payload?.payment?.entity || rawPayload?.payload?.payment_link?.entity || rawPayload;

    const error: RawPaymentError = {
      code: entity?.error_code || 'PAYMENT_ERROR',
      description: entity?.error_description || 'Payment failed during processing',
      reason: entity?.error_reason || 'bank_technical_error',
      source: entity?.error_source || 'bank',
      step: entity?.error_step || 'payment_authorization',
      metadata: entity?.error_metadata || {},
    };

    return {
      externalEventId: eventId,
      eventType,
      providerPaymentId: entity?.id,
      providerOrderId: entity?.order_id,
      providerLinkId: entity?.payment_link_id || rawPayload?.payload?.payment_link?.entity?.id,
      amountInPaise: entity?.amount,
      currency: entity?.currency || 'INR',
      status: entity?.status || 'failed',
      method: entity?.method || 'card',
      error,
      notes: entity?.notes,
      customerEmail: entity?.email || entity?.customer?.email,
      customerPhone: entity?.contact || entity?.customer?.contact,
    };
  }
}
