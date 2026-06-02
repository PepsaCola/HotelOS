export interface ReceivingLine {
    id: string;
    qty: number;
    unit: string;
    description: string;
    unitPrice: number;
    amount: number;
    received: number;
    missing: number;
}

export interface ReceivingEvent {
    id: string;
    invoiceId: string;
    date: string;
    timestamp: number;
    updatedBy: string;
    type: "partial" | "complete";
    lines: ReceivingLine[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    note: string;
}

export interface PurchaseOrder {
    id: string;
    vendor: string;
    vendorSub: string;
    dept: string;
    deptColor: string;
    amount: number;
    poDate: string;
    expected: string;
    expectedDays: number;
    lines: ReceivingLine[];
    events: ReceivingEvent[];
    progress: number;
    status: "overdue" | "partial" | "today" | "awaiting" | "received";
    accountNumber?: string;
    billedContact?: string;
    terms?: string;
}

export interface ReceivingKpi {
    awaiting: number;
    awaitingValue: number;
    awaitingDueThisWeek: number;
    partial: number;
    partialRemaining: number;
    overdue: number;
    overdueValue: string;
    received: number;
    receivedValue: number;
    overReceivedCount: number;
}

export interface ReceivingData {
    queue: PurchaseOrder[];
    kpi: ReceivingKpi;
    tabCounts: Record<string, number>;
    month: string;
    property: string;
}

export type ReceivingStatus = "all" | "awaiting" | "partial" | "today" | "overdue" | "received";
export type ReceivingDept = "all" | "Rooms" | "F&B" | "A&G" | "IT" | "S&M" | "R&M";