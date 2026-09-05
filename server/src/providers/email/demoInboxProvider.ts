import { v4 as uuidv4 } from 'uuid';
import { EmailProvider, SendEmailInput, SendEmailResult } from './emailProvider';
import { repo } from '../../repositories/inMemoryRepo';
import { Notification } from '../../models/types';

export class DemoInboxProvider implements EmailProvider {
  public getMode(): 'demo_inbox' {
    return 'demo_inbox';
  }

  public async sendRecoveryEmail(input: SendEmailInput): Promise<SendEmailResult> {
    const notificationId = `notif_demo_${uuidv4().substring(0, 10)}`;
    const sentAt = new Date().toISOString();

    const notif: Notification = {
      id: notificationId,
      customerId: input.customerId,
      recoveryCaseId: input.recoveryCaseId,
      provider: 'demo_inbox',
      recipient: input.recipient,
      subject: input.subject,
      body: input.body,
      recoveryLink: input.recoveryLink,
      status: 'sent',
      sentAt,
    };

    await repo.saveNotification(notif);

    return {
      id: notificationId,
      provider: 'demo_inbox',
      recipient: input.recipient,
      status: 'sent',
      sentAt,
    };
  }

  public async cancelPendingMessage(notificationId: string): Promise<boolean> {
    const existing = await repo.getNotification(notificationId);
    if (existing && existing.status === 'queued') {
      await repo.updateNotification(notificationId, { status: 'cancelled' });
      return true;
    }
    return false;
  }
}
