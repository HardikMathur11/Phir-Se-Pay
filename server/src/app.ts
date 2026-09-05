import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import { initializeProviders } from './config/providers';
import * as api from './controllers/apiController';

dotenv.config();

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize dual-provider layer
initializeProviders();

// Enable CORS
app.use(cors({ origin: '*', credentials: true }));

// Request ID middleware & raw body capture for webhooks
app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as any).id = `req_${uuidv4().substring(0, 8)}`;
  next();
});

app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  },
}));

app.use(express.urlencoded({ extended: true }));

// ROOT & HEALTH ENDPOINTS
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Phir Se Pay (फिर से Pay) API Server is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      summary: '/api/dashboard/summary-strip',
      liveFeed: '/api/dashboard/live-feed',
      events: '/api/events/stream',
      webhooks: '/api/webhooks/razorpay',
    },
  });
});

app.get('/health', api.healthCheck);
app.get('/api/health', api.healthCheck);
app.get('/api/config/provider-mode', api.getProviderMode);
app.get('/api/system-health', api.getSystemHealth);

// CUSTOMER / PAYMENT ENDPOINTS
app.post('/api/orders', api.createOrder);
app.get('/api/orders/:id', api.getOrder);
app.post('/api/payments/attempt', api.attemptPayment);
app.get('/api/customer/inbox/:customerId', api.getCustomerInbox);
app.post('/api/notifications/:id/open', api.markNotificationOpened);
app.get('/api/recovery-payment/:token', api.getRecoveryPaymentData);

// WEBHOOKS & REALTIME SSE
app.post('/api/webhooks/razorpay', api.handleRazorpayWebhook);
app.post('/api/simulator/events', api.handleSimulatorEvents);
app.post('/api/simulator/scenarios/:scenario', api.triggerScenario);
app.get('/api/events/stream', api.streamEvents);

// NEW READ-OPTIMIZED LEDGER API LAYER
app.get('/api/dashboard/live-feed', api.getDashboardLiveFeed);
app.get('/api/dashboard/summary-strip', api.getDashboardSummaryStrip);
app.get('/api/cases/:id/detail-view', api.getCaseDetailView);
app.post('/api/cases/:id/replay-webhook', api.replayWebhookForCase);
app.get('/api/eval/comparison-view', api.getEvalComparisonView);

// RECOVERY CASES ENDPOINTS
app.get('/api/recovery-cases', api.getRecoveryCases);
app.get('/api/recovery-cases/:id', api.getRecoveryCaseDetail);
app.post('/api/recovery-cases/:id/approve', api.approveRecoveryCase);
app.post('/api/recovery-cases/:id/stop', api.stopRecoveryCase);

// DASHBOARD ENDPOINTS
app.get('/api/dashboard/summary', api.getDashboardSummary);
app.get('/api/dashboard/funnel', api.getDashboardFunnel);
app.get('/api/audit-events', api.getAuditEvents);

// SIMULATION & RESET
app.post('/api/simulation/generate-batch', api.runBatchSimulation);
app.post('/api/simulation/reset', api.resetDemoData);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  res.status(500).json({
    success: false,
    data: null,
    error: err.message || 'Internal Server Error',
    requestId: `req_${uuidv4().substring(0, 8)}`,
  });
});

// Start Server if launched directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Phir Se Pay API Server running on port ${PORT}`);
  });
}

export default app;
