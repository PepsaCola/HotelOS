/**
 * Domain types for the Dashboard module.
 *
 * These describe the shape of the data the backend is expected to provide.
 * `DashboardData` is the single aggregate returned by the dashboard service,
 * so swapping the mock for a real API only requires changing the service.
 */

export type Tone = "good" | "warn" | "crit";
export type StatusTone = "good" | "warn" | "crit" | "info";

export type RevPeriod = "MTD" | "QTD" | "YTD";
export type RevMetric = "Revenue" | "RevPAR" | "ADR" | "Occ";
export type DeptView = "actual" | "committed" | "forecast";
export type AgingView = "amount" | "count" | "risk";
export type FunnelView = "count" | "amount" | "age";
export type HeatmapView = "count" | "amount" | "trend";
export type ActivityTab = "invoices" | "pos";

export type DepartmentKey = "Rooms" | "F&B" | "A&G" | "IT" | "S&M" | "R&M";

export interface KpiCard {
  tone: Tone | "default";
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "up" | "down";
  subValue?: string;
  detail: string;
  dotTone: Tone;
}

/** Cumulative time series for a single revenue metric. */
export interface RevSeries {
  actual: number[];
  budget: number[];
  forecast: number[];
  ly: number[];
}

export type MetricBundle = Record<RevMetric, RevSeries>;

export interface PeriodDef {
  length: number;
  /** 1-based index of "today" within the series. */
  today: number;
  rangeLabel: string;
  markerLabel: string;
  xLabels: ReadonlyArray<{ idx: number; label: string }>;
}

export interface DeptRow {
  name: DepartmentKey;
  amount: string;
  delta: string;
  deltaTone: "up" | "down";
  /** Bar fill, 0–100. */
  fill: number;
  /** Budget-pace marker position, 0–100. */
  marker: number;
}

export interface DeptViewData {
  subtitle: string;
  footLabel: string;
  footCallout: string;
  footTone: "good" | "crit";
  rows: DeptRow[];
}

export interface AgingBucket {
  name: string;
  sub: string;
  tone: "g" | "n" | "w" | "c";
  value: number;
  count: number;
  risk: number;
}

export interface RiskItem {
  label: string;
  sub: string;
  value: string;
  tone: "crit" | "warn";
}

export interface AgingRiskView {
  subtitle: string;
  title: string;
  items: RiskItem[];
}

export interface FunnelStage {
  name: string;
  tone: "neutral" | "accent-soft" | "accent" | "warn" | "warn-soft" | "crit";
  badge: string;
  badgeTone: Tone | "neutral";
  count: number;
  amount: number;
  age: number;
}

export interface HeatmapMatrix {
  subtitle: string;
  footLink: string;
  /** rows (departments) × columns (statuses). */
  values: number[][];
}

export interface MatchTag {
  label: string;
  tone: "ok" | "warn" | "crit";
}

export interface InvoiceRow {
  id: string;
  vendor: string;
  note: string;
  received: string;
  dept: DepartmentKey;
  amount: string;
  po: string;
  matching: MatchTag[];
  status: { label: string; tone: StatusTone };
  updated: string;
  updatedTone?: "warn" | "crit";
}

export interface PORow {
  id: string;
  account: string;
  title: string;
  vendor: string;
  dept: DepartmentKey;
  issued: string;
  amount: string;
  status: { label: string; tone: StatusTone };
}

export interface DashboardMeta {
  hotel: string;
  periodLabel: string;
  daysToClose: number;
  lastSync: string;
  periodDayLabel: string;
}

/** The complete payload backing the Dashboard screen. */
export interface DashboardData {
  meta: DashboardMeta;
  kpis: KpiCard[];
  periods: Record<RevPeriod, PeriodDef>;
  metrics: Record<RevPeriod, MetricBundle>;
  deptViews: Record<DeptView, DeptViewData>;
  agingBuckets: AgingBucket[];
  agingRiskViews: Record<AgingView, AgingRiskView>;
  funnelStages: FunnelStage[];
  heatmap: {
    columns: string[];
    rows: DepartmentKey[];
    views: Record<HeatmapView, HeatmapMatrix>;
  };
  invoices: InvoiceRow[];
  purchaseOrders: PORow[];
  counts: { invoices: number; purchaseOrders: number };
}
