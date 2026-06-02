import type { PurchaseApproval } from "@/types/approvals";

export type ApprovalsTab = "myQueue" | "allActive" | "completed";

/** A PO is considered overdue once it has waited at a step for 5+ days. */
const OVERDUE_DAYS = 5;

export interface ApprovalsSummary {
  pendingCount: number;
  avgWaitDays: number;
  overdueCount: number;
  overBudgetCount: number;
  overBudgetAmount: number;
  capexCount: number;
  capexPo: PurchaseApproval | null;
}

/** Whole-queue aggregates backing the KPI strip. */
export function summarize(queue: PurchaseApproval[]): ApprovalsSummary {
  const overBudget = queue.filter((po) => po.overBudget);
  const capex = queue.filter((po) => po.capex);
  const totalWait = queue.reduce((sum, po) => sum + po.waiting, 0);

  return {
    pendingCount: queue.length,
    avgWaitDays: queue.length ? totalWait / queue.length : 0,
    overdueCount: queue.filter((po) => po.waiting >= OVERDUE_DAYS).length,
    overBudgetCount: overBudget.length,
    overBudgetAmount: overBudget.reduce((sum, po) => sum + po.overAmt, 0),
    capexCount: capex.length,
    capexPo: capex[0] ?? null,
  };
}

/**
 * Applies the active tab to the loaded queue. The bundled sample only covers the
 * reviewer's queue, so "My Queue" and "All Active" show it in full while
 * "Completed" reflects POs acted on in this session.
 */
export function filterByTab(
  queue: PurchaseApproval[],
  tab: ApprovalsTab,
  actedIds: Set<string>,
): PurchaseApproval[] {
  if (tab === "completed") return queue.filter((po) => actedIds.has(po.id));
  return queue;
}
