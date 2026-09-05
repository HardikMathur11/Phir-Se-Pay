import dotenv from 'dotenv';
import { PaymentProvider } from '../providers/payment/paymentProvider';
import { SimulatorPaymentProvider } from '../providers/payment/simulatorProvider';
import { RazorpayTestPaymentProvider } from '../providers/payment/razorpayTestProvider';
import { EmailProvider } from '../providers/email/emailProvider';
import { DemoInboxProvider } from '../providers/email/demoInboxProvider';
import { GmailProvider } from '../providers/email/gmailProvider';

import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

let currentPaymentProvider: PaymentProvider;
let currentEmailProvider: EmailProvider;

export function initializeProviders() {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  dotenv.config();
  const rzpKey = process.env.RAZORPAY_KEY_ID;
  const rzpSecret = process.env.RAZORPAY_KEY_SECRET;
  const rzpWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (rzpKey && rzpSecret && rzpKey.startsWith('rzp_test_') && rzpKey !== 'rzp_test_samplekey123') {
    currentPaymentProvider = new RazorpayTestPaymentProvider(rzpKey, rzpSecret, rzpWebhookSecret);
  } else {
    currentPaymentProvider = new SimulatorPaymentProvider();
  }

  const gmailClientId = process.env.GMAIL_CLIENT_ID;
  const gmailClientSecret = process.env.GMAIL_CLIENT_SECRET;
  const gmailRefreshToken = process.env.GMAIL_REFRESH_TOKEN;
  const gmailSender = process.env.GMAIL_SENDER;

  if (gmailClientId && gmailClientSecret && gmailRefreshToken && gmailSender) {
    currentEmailProvider = new GmailProvider(
      gmailClientId,
      gmailClientSecret,
      gmailRefreshToken,
      gmailSender
    );
  } else {
    currentEmailProvider = new DemoInboxProvider();
  }
}

initializeProviders();

export function getPaymentProvider(): PaymentProvider {
  return currentPaymentProvider;
}

export function getEmailProvider(): EmailProvider {
  return currentEmailProvider;
}

export function setPaymentProvider(provider: PaymentProvider) {
  currentPaymentProvider = provider;
}

export function setEmailProvider(provider: EmailProvider) {
  currentEmailProvider = provider;
}
