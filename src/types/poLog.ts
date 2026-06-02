/**
 * Domain types for the PO Log module.
 *
 * The department taxonomy here (rooms/fb/eng/admin/sales/spa) is specific to
 * purchasing and differs from the dashboard's reporting departments, so it
 * lives with this module's data rather than in the shared layer.
 */

export type PODeptId = "rooms" | "fb" | "ag" | "it" | "sm" | "rm";

export interface PODepartment {
  id: PODeptId;
  name: string;
  short: string;
  /** CSS color value used for the department dot/swatch. */
  color: string;
}

export type POStatus = "fixed" | "received" | "pending" | "partial" | "overdue" | "draft";

export interface StatusMeta {
  label: string;
  tone: "good" | "warn" | "crit" | "neutral";
}

export interface PurchaseOrderRecord {
  po: string;
  ac: string;
  desc: string;
  vendor: string;
  dept: PODeptId;
  amt: number;
  status: POStatus;
  date: string;
  due: string;
}

export interface POLogData {
  meta: {
    monthLabel: string;
    closesLabel: string;
    /** Monthly budget envelope for the available-budget KPI. */
    monthBudget: number;
  };
  departments: Record<PODeptId, PODepartment>;
  statusMeta: Record<POStatus, StatusMeta>;
  orders: PurchaseOrderRecord[];
}

/** User display preferences (persisted to localStorage). */
export interface POLogPrefs {
  density: "compact" | "regular" | "comfy";
  groupBy: "none" | "department";
  showVendor: boolean;
  highlightLarge: boolean;
  largeThreshold: number;
  showHero: boolean;
  showTotalsBar: boolean;
}
