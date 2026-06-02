import type { PurchaseOrder, ReceivingStatus, ReceivingDept } from "@/types/receiving";

export type SortKey = "expected" | "amount" | "po";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "expected", label: "Sort: Expected date ↑" },
    { key: "amount",   label: "Sort: PO amount" },
    { key: "po",       label: "Sort: PO #" },
];

export function filterQueue(
    queue: PurchaseOrder[],
    status: ReceivingStatus,
    dept: ReceivingDept,
): PurchaseOrder[] {
    return queue.filter((po) => {
        const matchStatus = status === "all" || po.status === status;
        const matchDept = dept === "all" || po.dept === dept;
        return matchStatus && matchDept;
    });
}

export function sortQueue(rows: PurchaseOrder[], sort: SortKey): PurchaseOrder[] {
    return [...rows].sort((a, b) => {
        if (sort === "amount") return b.amount - a.amount;
        if (sort === "po") return a.id.localeCompare(b.id);
        return a.expectedDays - b.expectedDays; // expected date ascending
    });
}

// ── Presentation mappers ───────────────────────────────────────────────────

export type StatusTone = "good" | "warn" | "crit" | "indigo" | "neutral";

export interface StatusMeta {
    label: string;
    tone: StatusTone;
}

export const STATUS_META: Record<ReceivingStatus, StatusMeta> = {
    all:      { label: "All",              tone: "neutral" },
    awaiting: { label: "Awaiting",         tone: "indigo"  },
    partial:  { label: "Partial",          tone: "warn"    },
    today:    { label: "Awaiting",         tone: "indigo"  },
    overdue:  { label: "Overdue",          tone: "crit"    },
    received: { label: "Received",         tone: "good"    },
};

export type ProgressType = "full" | "partial" | "zero" | "over";

export function progressType(pct: number, overReceived: boolean): ProgressType {
    if (overReceived) return "over";
    if (pct === 100)  return "full";
    if (pct > 0)      return "partial";
    return "zero";
}

/** CSS color for date column: empty = normal, warn = 1–4 days overdue, crit = 5+ days. */
export function dateTone(po: PurchaseOrder): "crit" | "warn" | "" {
    if (po.status === "overdue") return po.expectedDays <= -5 ? "crit" : "warn";
    return "";
}