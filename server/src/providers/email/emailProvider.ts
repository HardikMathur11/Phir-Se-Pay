export interface SendEmailInput {
  customerId: string;
  recoveryCaseId: string;
  recipient: string;
  subject: string;
  body: string;
  recoveryLink: string;
}

export interface SendEmailResult {
  id: string;
  provider: 'gmail' | 'demo_inbox';
  recipient: string;
  status: 'queued' | 'sent' | 'failed';
  providerMessageId?: string;
  sentAt: string;
}

export interface EmailProvider {
  getMode(): 'gmail' | 'demo_inbox';
  sendRecoveryEmail(input: SendEmailInput): Promise<SendEmailResult>;
  cancelPendingMessage(notificationId: string): Promise<boolean>;
}
