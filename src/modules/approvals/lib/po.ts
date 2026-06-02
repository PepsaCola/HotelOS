import type { PurchaseApproval } from "@/types/approvals";

/** Extracts the bare GL account number from the "number · label" gl string. */
export function glAccount(po: PurchaseApproval): string {
  return (po.gl || "").split("·")[0].trim();
}

export interface POTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

/** Derives subtotal/shipping/tax/total, falling back to the authorised amount. */
export function calcPoTotals(po: PurchaseApproval): POTotals {
  const subtotal = po.lines.reduce((sum, line) => sum + line.qty * line.unit, 0);
  const shipping = po.shipping ?? 0;
  const tax = po.tax != null ? po.tax : Math.max(0, po.amount - subtotal - shipping);
  const total = po.amount ?? subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

/** Fixed display order for the department-allocation table in the drawer. */
const DEPT_ALLOCATION_ORDER = ["Rooms", "A&G", "F&B", "S&M", "R&M"];

export interface DeptAllocationRow {
  dept: string;
  account: string;
  /** Allocated amount; null renders as an em dash for non-owning departments. */
  amount: number | null;
  active: boolean;
}

/** Builds the department-allocation rows, charging the full total to the PO's dept. */
export function deptAllocation(po: PurchaseApproval, total: number): DeptAllocationRow[] {
  const acct = glAccount(po);
  const order = DEPT_ALLOCATION_ORDER.includes(po.dept)
    ? DEPT_ALLOCATION_ORDER
    : [...DEPT_ALLOCATION_ORDER, po.dept];
  return order.map((dept) => ({
    dept,
    account: dept === po.dept ? acct : "—",
    amount: dept === po.dept ? total : null,
    active: dept === po.dept,
  }));
}
