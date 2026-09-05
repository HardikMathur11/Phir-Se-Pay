import { v4 as uuidv4 } from 'uuid';
import { repo } from '../repositories/inMemoryRepo';
import { AuditEvent, ActorType, PolicyCheckResult } from '../models/types';

export class AuditService {
  public async recordEvent(input: {
    merchantId?: string;
    recoveryCaseId?: string;
    eventType: string;
    actorType: ActorType;
    actorId: string;
    inputSnapshot?: Record<string, any>;
    decision?: string;
    evidence?: string[];
    policyResult?: PolicyCheckResult;
    outcome?: string;
    requestId?: string;
  }): Promise<AuditEvent> {
    const merchant = await repo.getFirstMerchant();
    const event: AuditEvent = {
      id: `audit_${uuidv4().substring(0, 10)}`,
      merchantId: input.merchantId || merchant.id,
      recoveryCaseId: input.recoveryCaseId,
      eventType: input.eventType,
      actorType: input.actorType,
      actorId: input.actorId,
      inputSnapshot: input.inputSnapshot,
      decision: input.decision,
      evidence: input.evidence,
      policyResult: input.policyResult,
      outcome: input.outcome,
      requestId: input.requestId || `req_${uuidv4().substring(0, 8)}`,
      createdAt: new Date().toISOString(),
    };

    await repo.saveAuditEvent(event);
    return event;
  }

  public async getAuditTrail(recoveryCaseId?: string): Promise<AuditEvent[]> {
    const all = await repo.getAuditEvents();
    if (!recoveryCaseId) return all;
    return all.filter((e) => e.recoveryCaseId === recoveryCaseId);
  }
}

export const auditService = new AuditService();
