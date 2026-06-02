import type { PODeptId, POStatus, PurchaseOrderRecord } from "@/types/poLog";

export type POLogTab = "active" | "fixed" | "dept" | "prepaid";

interface FilterArgs {
  tab: POLogTab;
  dept: PODeptId | "all";
  status: POStatus | "all";
}

const OPEN_STATUSES: POStatus[] = ["pending", "partial", "overdue"];

/** Applies tab + chip + status filters to the order book. */
export function filterOrders(orders: PurchaseOrderRecord[], { tab, dept, status }: FilterArgs) {
  return orders.filter((order) => {
    if (dept !== "all" && order.dept !== dept) return false;
    if (status !== "all" && order.status !== status) return false;
    if (tab === "fixed" && order.status !== "fixed") return false;
    return true;
  });
}

/** Whole-book aggregates describing the month (independent of active filters). */
export function summarize(orders: PurchaseOrderRecord[]) {
  const sumByStatus = (statuses: POStatus[]) =>
    orders.filter((o) => statuses.includes(o.status)).reduce((sum, o) => sum + o.amt, 0);
  const countByStatus = (statuses: POStatus[]) =>
    orders.filter((o) => statuses.includes(o.status)).length;

  const deptTotals: Partial<Record<PODeptId, number>> = {};
  const deptCounts: Partial<Record<PODeptId, number>> = {};
  for (const order of orders) {
    deptTotals[order.dept] = (deptTotals[order.dept] ?? 0) + order.amt;
    deptCounts[order.dept] = (deptCounts[order.dept] ?? 0) + 1;
  }

  return {
    spentToDate: orders.reduce((sum, o) => sum + o.amt, 0),
    fixedTotal: sumByStatus(["fixed"]),
    fixedCount: countByStatus(["fixed"]),
    openTotal: sumByStatus(OPEN_STATUSES),
    openCount: countByStatus(OPEN_STATUSES),
    overdueCount: countByStatus(["overdue"]),
    receivedTotal: sumByStatus(["received"]),
    receivedCount: countByStatus(["received"]),
    deptTotals,
    deptCounts,
  };
}

/** Groups rows by department into [deptId, { rows, total }] pairs. */
export function groupByDept(rows: PurchaseOrderRecord[]): Array<[PODeptId, { rows: PurchaseOrderRecord[]; total: number }]> {
  const groups = new Map<PODeptId, { rows: PurchaseOrderRecord[]; total: number }>();
  for (const row of rows) {
    const group = groups.get(row.dept) ?? { rows: [], total: 0 };
    group.rows.push(row);
    group.total += row.amt;
    groups.set(row.dept, group);
  }
  return [...groups.entries()];
}
