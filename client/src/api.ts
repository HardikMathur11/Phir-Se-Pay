import axios from 'axios';
import {
  DashboardSummary,
  RecoveryCase,
  Notification,
  AuditEvent,
  BatchMetrics,
  DashboardLiveFeedItem,
  DashboardSummaryStrip,
  CaseDetailViewData,
  ReplayWebhookResult,
  EvalComparisonViewData
} from './types';

const envApiUrl = (import.meta as any).env?.VITE_API_URL;
const RAW_BASE = envApiUrl ? String(envApiUrl).replace(/\/$/, '') : '';
export const API_BASE = `${RAW_BASE}/api`;
export const getSseStreamUrl = () => `${API_BASE}/events/stream`;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
  requestId: string;
}

export const api = {
  getHealth: () => axios.get<ApiResponse<any>>(`${API_BASE}/health`).then((res) => res.data.data),
  getProviderMode: () => axios.get<ApiResponse<any>>(`${API_BASE}/config/provider-mode`).then((res) => res.data.data),
  getSystemHealth: () => axios.get<ApiResponse<any>>(`${API_BASE}/system-health`).then((res) => res.data.data),

  // New Read-Optimized Ledger API Layer
  getDashboardLiveFeed: (limit = 20) =>
    axios.get<ApiResponse<DashboardLiveFeedItem[]>>(`${API_BASE}/dashboard/live-feed?limit=${limit}`).then((res) => res.data.data),

  getDashboardSummaryStrip: () =>
    axios.get<ApiResponse<DashboardSummaryStrip>>(`${API_BASE}/dashboard/summary-strip`).then((res) => res.data.data),

  getCaseDetailView: (id: string) =>
    axios.get<ApiResponse<CaseDetailViewData>>(`${API_BASE}/cases/${id}/detail-view`).then((res) => res.data.data),

  replayWebhook: (id: string) =>
    axios.post<ApiResponse<ReplayWebhookResult>>(`${API_BASE}/cases/${id}/replay-webhook`).then((res) => res.data.data),

  getEvalComparisonView: () =>
    axios.get<ApiResponse<EvalComparisonViewData>>(`${API_BASE}/eval/comparison-view`).then((res) => res.data.data),

  // Orders & Payment Attempt
  createOrder: (payload: { name: string; email: string; phone: string; amountInPaise: number; productName: string }) =>
    axios.post<ApiResponse<any>>(`${API_BASE}/orders`, payload).then((res) => res.data.data),

  attemptPayment: (payload: { orderId: string; simulateFailure?: boolean; failureScenario?: string }) =>
    axios.post<ApiResponse<any>>(`${API_BASE}/payments/attempt`, payload).then((res) => res.data.data),

  getCustomerInbox: (customerId: string) =>
    axios.get<ApiResponse<Notification[]>>(`${API_BASE}/customer/inbox/${customerId}`).then((res) => res.data.data),

  getRecoveryPaymentData: (token: string) =>
    axios.get<ApiResponse<any>>(`${API_BASE}/recovery-payment/${token}`).then((res) => res.data.data),

  // Dashboard Legacy & Audit
  getDashboardSummary: () => axios.get<ApiResponse<DashboardSummary>>(`${API_BASE}/dashboard/summary`).then((res) => res.data.data),
  getDashboardFunnel: () => axios.get<ApiResponse<any>>(`${API_BASE}/dashboard/funnel`).then((res) => res.data.data),
  getAuditEvents: () => axios.get<ApiResponse<AuditEvent[]>>(`${API_BASE}/audit-events`).then((res) => res.data.data),

  // Cases Actions
  getRecoveryCases: () => axios.get<ApiResponse<RecoveryCase[]>>(`${API_BASE}/recovery-cases`).then((res) => res.data.data),
  getCaseDetail: (id: string) => axios.get<ApiResponse<any>>(`${API_BASE}/recovery-cases/${id}`).then((res) => res.data.data),
  approveCase: (id: string) => axios.post<ApiResponse<any>>(`${API_BASE}/recovery-cases/${id}/approve`).then((res) => res.data.data),
  stopCase: (id: string) => axios.post<ApiResponse<any>>(`${API_BASE}/recovery-cases/${id}/stop`).then((res) => res.data.data),

  // Scenarios & Simulation
  triggerScenario: (scenario: string) => axios.post<ApiResponse<any>>(`${API_BASE}/simulator/scenarios/${scenario}`).then((res) => res.data.data),
  runBatchSimulation: (seed = 42, count = 500) => axios.post<ApiResponse<BatchMetrics>>(`${API_BASE}/simulation/generate-batch`, { seed, count }).then((res) => res.data.data),
  resetDemoData: () => axios.post<ApiResponse<any>>(`${API_BASE}/simulation/reset`).then((res) => res.data.data),
};
