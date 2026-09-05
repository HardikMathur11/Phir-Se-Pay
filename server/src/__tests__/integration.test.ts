import request from 'supertest';
import app from '../app.js';

describe('Phir Se Pay — Integration Test Suite', () => {
  it('GET /api/health should return operational status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
  });

  it('Full Journey: Order -> Failed Webhook -> Case Created -> Success Webhook -> RECOVERED', async () => {
    // 1. Create order
    const orderRes = await request(app).post('/api/orders').send({
      name: 'Amit Sharma',
      email: 'amit@example.com',
      phone: '+919876543210',
      amountInPaise: 149900,
      productName: 'Premium Subscription',
    });
    expect(orderRes.status).toBe(200);
    const { orderId, providerOrderId } = orderRes.body.data;

    // 2. Simulate Payment Failure Webhook
    const failEventId = `evt_test_fail_${Date.now()}`;
    const failPayload = {
      event: 'payment.failed',
      event_id: failEventId,
      payload: {
        payment: {
          entity: {
            id: `pay_test_${Date.now()}`,
            order_id: providerOrderId,
            amount: 149900,
            currency: 'INR',
            status: 'failed',
            method: 'netbanking',
            email: 'amit@example.com',
            contact: '+919876543210',
            error_code: 'BAD_REQUEST_ERROR',
            error_description: 'Temporary bank switch failure',
            error_reason: 'bank_technical_error',
          },
        },
      },
    };

    const webhookRes = await request(app)
      .post('/api/webhooks/razorpay')
      .send(failPayload);
    expect(webhookRes.status).toBe(200);

    // 3. Verify Recovery Case created
    const casesRes = await request(app).get('/api/recovery-cases');
    expect(casesRes.status).toBe(200);
    expect(casesRes.body.data.length).toBeGreaterThan(0);
    const recoveryCase = casesRes.body.data[0];
    expect(recoveryCase.amountAtRiskInPaise).toBe(149900);

    // 4. Simulate Verified Payment Success Webhook
    const successEventId = `evt_test_succ_${Date.now()}`;
    const successPayload = {
      event: 'payment.captured',
      event_id: successEventId,
      payload: {
        payment: {
          entity: {
            id: `pay_succ_${Date.now()}`,
            order_id: providerOrderId,
            payment_link_id: recoveryCase.recoveryPaymentLinkId,
            amount: 149900,
            currency: 'INR',
            status: 'captured',
            email: 'amit@example.com',
            notes: { recoveryCaseId: recoveryCase.id },
          },
        },
      },
    };

    const successWebhookRes = await request(app)
      .post('/api/webhooks/razorpay')
      .send(successPayload);
    expect(successWebhookRes.status).toBe(200);

    // 6. Test New Read-Optimized API Endpoints
    const liveFeedRes = await request(app).get('/api/dashboard/live-feed?limit=10');
    expect(liveFeedRes.status).toBe(200);
    expect(liveFeedRes.body.success).toBe(true);
    expect(Array.isArray(liveFeedRes.body.data)).toBe(true);
    if (liveFeedRes.body.data.length > 0) {
      const feedItem = liveFeedRes.body.data[0];
      expect(feedItem).toHaveProperty('caseId');
      expect(feedItem).toHaveProperty('customerName');
      expect(feedItem).toHaveProperty('amountInPaise');
      expect(feedItem).toHaveProperty('statusPillColor');
    }

    const summaryStripRes = await request(app).get('/api/dashboard/summary-strip');
    expect(summaryStripRes.status).toBe(200);
    expect(summaryStripRes.body.data).toHaveProperty('revenueAtRiskInPaise');
    expect(summaryStripRes.body.data).toHaveProperty('recoveredInPaise');
    expect(summaryStripRes.body.data).toHaveProperty('incrementalInPaise');
    expect(summaryStripRes.body.data).toHaveProperty('recoveryRatePercent');
    expect(summaryStripRes.body.data).toHaveProperty('needsApprovalCount');

    const detailViewRes = await request(app).get(`/api/cases/${recoveryCase.id}/detail-view`);
    expect(detailViewRes.status).toBe(200);
    expect(detailViewRes.body.data).toHaveProperty('case');
    expect(detailViewRes.body.data).toHaveProperty('evidence');
    expect(detailViewRes.body.data).toHaveProperty('diagnosis');
    expect(detailViewRes.body.data).toHaveProperty('ledgerTimeline');
    expect(detailViewRes.body.data).toHaveProperty('availableActions');

    const replayRes = await request(app).post(`/api/cases/${recoveryCase.id}/replay-webhook`);
    expect(replayRes.status).toBe(200);
    expect(replayRes.body.data.passed).toBe(true);
    expect(replayRes.body.data.newDocumentsCreated).toBe(0);

    const evalCompRes = await request(app).get('/api/eval/comparison-view');
    expect(evalCompRes.status).toBe(200);
    expect(evalCompRes.body.data).toHaveProperty('baseline');
    expect(evalCompRes.body.data).toHaveProperty('treatment');
    expect(evalCompRes.body.data).toHaveProperty('chartSeries');
  });
});
