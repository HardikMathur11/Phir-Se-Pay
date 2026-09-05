import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { EmailProvider, SendEmailInput, SendEmailResult } from './emailProvider';
import { repo } from '../../repositories/inMemoryRepo';
import { Notification } from '../../models/types';
import { DemoInboxProvider } from './demoInboxProvider';

export class GmailProvider implements EmailProvider {
  private transporter: nodemailer.Transporter | null = null;
  private fallback: DemoInboxProvider;
  private senderEmail: string;

  constructor(clientId: string, clientSecret: string, refreshToken: string, senderEmail: string) {
    this.fallback = new DemoInboxProvider();
    this.senderEmail = senderEmail;

    if (clientId && clientSecret && refreshToken) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: senderEmail,
          clientId,
          clientSecret,
          refreshToken,
        },
      });
    }
  }

  public getMode(): 'gmail' | 'demo_inbox' {
    return this.transporter ? 'gmail' : 'demo_inbox';
  }

  public async sendRecoveryEmail(input: SendEmailInput): Promise<SendEmailResult> {
    if (!this.transporter) {
      return this.fallback.sendRecoveryEmail(input);
    }

    const notificationId = `notif_gmail_${uuidv4().substring(0, 10)}`;
    const sentAt = new Date().toISOString();

    try {
      const info = await this.transporter.sendMail({
        from: `Phir Se Pay <${this.senderEmail}>`,
        to: input.recipient,
        subject: input.subject,
        text: input.body,
        html: `<div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #1e293b;">
          <h2>Payment Action Required</h2>
          <p>${input.body.replace(/\n/g, '<br/>')}</p>
          <div style="margin-top: 24px;">
            <a href="${input.recoveryLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Complete Recovery Payment →
            </a>
          </div>
        </div>`,
      });

      const notif: Notification = {
        id: notificationId,
        customerId: input.customerId,
        recoveryCaseId: input.recoveryCaseId,
        provider: 'gmail',
        recipient: input.recipient,
        subject: input.subject,
        body: input.body,
        recoveryLink: input.recoveryLink,
        status: 'sent',
        providerMessageId: info.messageId,
        sentAt,
      };

      await repo.saveNotification(notif);

      return {
        id: notificationId,
        provider: 'gmail',
        recipient: input.recipient,
        status: 'sent',
        providerMessageId: info.messageId,
        sentAt,
      };
    } catch {
      // Automatic fallback to Demo Inbox on delivery failure
      return this.fallback.sendRecoveryEmail(input);
    }
  }

  public async cancelPendingMessage(notificationId: string): Promise<boolean> {
    return this.fallback.cancelPendingMessage(notificationId);
  }
}
