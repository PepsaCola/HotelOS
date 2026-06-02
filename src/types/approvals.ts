/**
 * Domain types for the Approvals module.
 *
 * Shapes mirror the backend payload an approval queue endpoint would return,
 * so swapping the mock for a real API only touches the service layer.
 */

export type StepStatus = "done" | "current" | "pending" | "rejected" | "changes";

/** Action a reviewer can take on the PO at their step. */
export type ActionType = "approve" | "reject" | "changes";

export interface ChainActor {
  role: string;
  name: string;
  /** Human-readable action label, e.g. "Approved", "Pending", "Required". */
  action: string;
  /** Timestamp shown next to the actor; empty until they act. */
  time: string;
  comment: string;
}

export interface POLine {
  desc: string;
  qty: number;
  pkg: string;
  unit: number;
  gl: string;
}

export interface POBudget {
  total: number;
  committed: number;
  thisPO: number;
  remaining: number;
}

export type AuditEventType = "create" | "submit" | "approve" | "reject" | "changes" | "current";

export interface AuditEvent {
  type: AuditEventType;
  who: string;
  role: string;
  when: string;
  desc: string;
  comment: string;
}

export interface PurchaseApproval {
  id: string;
  externalId: string;
  poDate: string;
  type: string;
  dept: string;
  gl: string;
  vendor: string;
  cat: string;
  amount: number;
  tax: number;
  shipping: number;
  requester: string;
  submitted: string;
  /** Days the PO has waited at the current step. */
  waiting: number;
  overBudget: boolean;
  overAmt: number;
  capex: boolean;
  chain: StepStatus[];
  chainActors: ChainActor[];
  lines: POLine[];
  budget?: POBudget;
  audit: AuditEvent[];
}

export interface ApprovalDepartment {
  name: string;
  /** CSS color value for the department dot. */
  color: string;
}

export interface ApprovalReviewer {
  name: string;
  initials: string;
  role: string;
}

export interface ApprovalsMeta {
  monthLabel: string;
  propertyName: string;
  reviewer: ApprovalReviewer;
  /** Ordered role labels of the approval chain and the reviewer's position in it. */
  chain: { steps: string[]; activeIndex: number };
  /** Counts shown on the tab badges. */
  tabCounts: { myQueue: number; allActive: number; completed: number };
}

export interface ApprovalsData {
  meta: ApprovalsMeta;
  departments: Record<string, ApprovalDepartment>;
  queue: PurchaseApproval[];
}
