import type { PurchaseOrder, ReceivingLine } from "@/types/receiving";

export interface PoTotals {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

/** Sums line amounts into PO totals. Shipping/tax default to 0 until the API supplies them. */
export function calcPoTotals(lines: ReceivingLine[], shipping = 0, tax = 0): PoTotals {
    const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
    return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}

export interface LineProgress {
    /** Lines fully received (received ≥ ordered qty). */
    receivedLines: number;
    totalLines: number;
    /** Unit-based completion, clamped to 0–100 for the bar. */
    pct: number;
    /** True when units received exceed units ordered. */
    overReceived: boolean;
}

/** Derives received/missing progress from line quantities. Source of truth for the bars. */
export function lineProgress(po: PurchaseOrder): LineProgress {
    const totalUnits = po.lines.reduce((sum, line) => sum + line.qty, 0);
    const receivedUnits = po.lines.reduce((sum, line) => sum + line.received, 0);
    const receivedLines = po.lines.filter((line) => line.received >= line.qty).length;
    const raw = totalUnits === 0 ? 0 : Math.round((receivedUnits / totalUnits) * 100);
    return {
        receivedLines,
        totalLines: po.lines.length,
        pct: Math.max(0, Math.min(100, raw)),
        overReceived: receivedUnits > totalUnits,
    };
}