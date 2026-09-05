import { RawPaymentError } from '../../models/types.js';

export interface CreateOrderInput {
  amountInPaise: number;
  currency: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface PaymentProviderOrder {
  id: string;
  amountInPaise: number;
  currency: string;
  status: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface PaymentProviderPayment {
  id: string;
  orderId: string;
  amountInPaise: number;
  currency: string;
  status: string;
  method: string;
  error?: RawPaymentError;
}

export interface CreatePaymentLinkInput {
  amountInPaise: number;
  currency: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: Record<string, string>;
  callbackUrl?: string;
}

export interface PaymentLinkResult {
  id: string;
  shortUrl: string;
  amountInPaise: number;
  currency: string;
  status: string;
}

export interface NormalizedWebhookPayload {
  externalEventId: string;
  eventType: 'payment.failed' | 'payment.captured' | 'payment_link.paid' | 'order.paid' | 'unknown';
  providerPaymentId?: string;
  providerOrderId?: string;
  providerLinkId?: string;
  amountInPaise?: number;
  currency?: string;
  status?: string;
  method?: string;
  error?: RawPaymentError;
  notes?: Record<string, string>;
  customerEmail?: string;
  customerPhone?: string;
}

export interface PaymentProvider {
  getMode(): 'razorpay_test' | 'simulator';
  createOrder(input: CreateOrderInput): Promise<PaymentProviderOrder>;
  fetchOrder(orderId: string): Promise<PaymentProviderOrder | null>;
  fetchPayment(paymentId: string): Promise<PaymentProviderPayment | null>;
  createPaymentLink(input: CreatePaymentLinkInput): Promise<PaymentLinkResult>;
  verifyWebhook(rawBody: string | Buffer, signature: string): boolean;
  normalizeWebhook(rawPayload: any, eventIdHeader?: string): NormalizedWebhookPayload;
}
