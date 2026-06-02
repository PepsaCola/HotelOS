export type InvoiceStatus = "processed" | "ocr" | "over-budget" | "no-match" | "review";
export type InvoiceStatusFilter = "all" | InvoiceStatus;

export type InvoiceDept = "all" | "Rooms" | "F&B" | "A&G" | "IT" | "S&M" | "R&M";
export type AmountRange = "any" | "under-1k" | "1k-3k" | "over-3k";
export type SortKey = "updated" | "received" | "highest" | "lowest";

export interface InvoiceMatch {
    poMatched: boolean;
    linesMatched: number;
    linesTotal: number;
}

export interface Invoice {
    id: string;
    vendor: string;
    dept: InvoiceDept;
    receivedDate: string;
    receivedTimestamp: number;
    amount: number;
    taxIncluded: boolean;
    poRef: string | null;
    match: InvoiceMatch | null;
    status: InvoiceStatus;
    updatedAt: string;
    updatedTimestamp: number;
}

export interface InvoicesKpi {
    receivedCount: number;
    receivedValue: number;
    intakeCount: number;
    intakeExtracting: number;
    intakeQueued: number;
    awaitingMatchCount: number;
    awaitingAttentionCount: number;
    exceptionsCount: number;
    exceptionsValue: number;
}

export interface InvoicesData {
    invoices: Invoice[];
    kpi: InvoicesKpi;
    tabCounts: Record<InvoiceStatusFilter, number>;
    month: string;
    lastSync: string;
}

// ── Review page types ─────────────────────────────────────────────────────────

export interface MismatchEntry {
    field: string;
    invoiceVal: string;
    poVal: string;
    reason: string;
}

export interface LineItem {
    qty: string;
    unit: string;
    desc: string;
    unitPrice: string;
    amount: string;
    mismatch: boolean;
}

export interface PoDetailDept {
    name: string;
    account: string;
    amount: string;
}

/** 1=success 2=reject 3=mismatch 4=partial 5=no-match */
export type ReviewFlow = 1 | 2 | 3 | 4 | 5;

/** A PO candidate that has been fully hydrated with both list-view and form-view data. */
export interface PoDetail {
    ref: string;
    desc: string;
    account: string;
    amount: string;
    date: string;
    percent: string;        // e.g. "72% match" — "" for other-POs rows
    tone: "perfect" | "high" | "mid" | "";
    // PO form fields
    poNumber: string;
    poDate: string;
    budgetClass: string;
    accountNumber: string;
    billedTo: string;
    vendorShort: string;
    lineMatch: string;      // e.g. "LN 9/9"
    mismatches: Record<string, MismatchEntry>;
    lineItems: LineItem[];
    subtotal: string;
    shipping: string;
    tax: string;
    total: string;
    departments: PoDetailDept[];
}

export interface ReviewData {
    flow: ReviewFlow;
    fileRef: string;
    statusPill: { label: string; cls: string };
    closestMatches: PoDetail[];
    otherOpenPos: PoDetail[];
}