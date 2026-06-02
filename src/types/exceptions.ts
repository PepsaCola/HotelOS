export type ExceptionType = "over_budget" | "no_po" | "mismatch";
export type ExceptionSeverity = "crit" | "warn" | "info";
export type ExceptionStatus = "open" | "resolved" | "rejected" | "correction";
export type ExceptionStatusFilter = "all" | ExceptionType | "rejected" | "resolved";

export type ResolutionType = "override" | "po_linked" | "mismatch_corrected";

export interface HistoryEntry {
  dot: "sys" | "user" | "resolved";
  actor: string;
  msg: string;
  time: string;
}

export interface Exception {
  id: string;
  type: ExceptionType;
  severity: ExceptionSeverity;
  invoiceNo: string;
  vendor: string;
  dept: string;
  poNo: string | null;
  poMatch: string;
  amount: number;
  exposure: number | null;
  received: string;
  raised: string;
  assignee: string;
  status: ExceptionStatus;
  invoiceStatus: string;
  exportBlocked: boolean;
  title: string;
  desc: string;
  history: HistoryEntry[];
  correctionAssignee?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionType?: ResolutionType;
  resolutionNote?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

export interface ExceptionsKpi {
  openCount: number;
  overBudgetCount: number;
  overBudgetExposure: number;
  noPOCount: number;
  resolvedThisMonthCount: number;
  avgResolutionDays: number;
}

export interface ExceptionsData {
  exceptions: Exception[];
  kpi: ExceptionsKpi;
  tabCounts: Record<ExceptionStatusFilter, number>;
  month: string;
  lastSync: string;
}