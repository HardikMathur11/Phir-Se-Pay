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

export class SimulatorPaymentProvider implements PaymentProvider {
  private orders: Map<string, PaymentProviderOrder> = new Map();
  private payments: Map<string, PaymentProviderPayment> = new Map();
  private paymentLinks: Map<string, PaymentLinkResult> = new Map();

  public getMode(): 'simulator' {
    return 'simulator';
  }

  public async createOrder(input: CreateOrderInput): Promise<PaymentProviderOrder> {
    const orderId = `order_sim_${uuidv4().substring(0, 12)}`;
    const order: PaymentProviderOrder = {
      id: orderId,
      amountInPaise: input.amountInPaise,
      currency: input.currency || 'INR',
      status: 'created',
      receipt: input.receipt,
      notes: input.notes,
    };
    this.orders.set(orderId, order);
    return order;
  }

  public async fetchOrder(orderId: string): Promise<PaymentProviderOrder | null> {
    return this.orders.get(orderId) || null;
  }

  public async fetchPayment(paymentId: string): Promise<PaymentProviderPayment | null> {
    return this.payments.get(paymentId) || null;
  }

  public async createPaymentLink(input: CreatePaymentLinkInput): Promise<PaymentLinkResult> {
    const linkId = `plink_sim_${uuidv4().substring(0, 12)}`;
    const origin = process.env.CLIENT_URL || 'http://localhost:5173';
    const shortUrl = `${origin}/recovery-pay/${linkId}`;

    const linkResult: PaymentLinkResult = {
      id: linkId,
      shortUrl,
      amountInPaise: input.amountInPaise,
      currency: input.currency || 'INR',
      status: 'created',
    };

    this.paymentLinks.set(linkId, linkResult);
    return linkResult;
  }

  public verifyWebhook(_rawBody: string | Buffer, _signature: string): boolean {
    return true;
  }

  public normalizeWebhook(rawPayload: any, eventIdHeader?: string): NormalizedWebhookPayload {
    const eventId = rawPayload?.event_id || eventIdHeader || `evt_sim_${uuidv4().substring(0, 12)}`;
    const eventTypeRaw = rawPayload?.event || 'payment.failed';

    let eventType: NormalizedWebhookPayload['eventType'] = 'unknown';
    if (eventTypeRaw === 'payment.failed') eventType = 'payment.failed';
    else if (eventTypeRaw === 'payment.captured' || eventTypeRaw === 'payment.authorized') eventType = 'payment.captured';
    else if (eventTypeRaw === 'payment_link.paid') eventType = 'payment_link.paid';
    else if (eventTypeRaw === 'order.paid') eventType = 'order.paid';

    const entity = rawPayload?.payload?.payment?.entity || rawPayload?.payload?.payment_link?.entity || rawPayload;

    const error: RawPaymentError = entity?.error || {
      code: entity?.error_code || rawPayload?.failureCode || 'BAD_REQUEST_ERROR',
      description: entity?.error_description || rawPayload?.failureDescription || 'Payment processing failed due to temporary bank issue.',
      reason: entity?.error_reason || rawPayload?.failureReason || 'bank_technical_error',
      source: entity?.error_source || rawPayload?.failureSource || 'bank',
      step: entity?.error_step || rawPayload?.failureStep || 'payment_authorization',
    };

    return {
      externalEventId: eventId,
      eventType,
      providerPaymentId: entity?.id || rawPayload?.providerPaymentId || `pay_sim_${uuidv4().substring(0, 12)}`,
      providerOrderId: entity?.order_id || rawPayload?.providerOrderId,
      providerLinkId: entity?.payment_link_id || rawPayload?.providerLinkId,
      amountInPaise: entity?.amount || rawPayload?.amountInPaise || 149900,
      currency: entity?.currency || 'INR',
      status: entity?.status || 'failed',
      method: entity?.method || rawPayload?.method || 'netbanking',
      error,
      notes: entity?.notes || rawPayload?.notes,
      customerEmail: entity?.email || rawPayload?.customerEmail || 'amit@example.com',
      customerPhone: entity?.contact || rawPayload?.customerPhone || '+919876543210',
    };
  }
}
