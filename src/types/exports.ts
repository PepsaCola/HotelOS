export type ExportStatus = 'exported' | 'error';

export interface InvoiceLine {
    qty: number;
    pkg: string;
    desc: string;
    unit: number;
}

export interface ExportRecord {
    inv: string;
    received: string;
    processed?: string;
    vendor: string;
    cat: string;
    dept: string;
    amt: number;
    tax: boolean;
    po?: string | null;
    linesMatched: number;
    linesTotal: number;
    gl: string;
    glSub: string;
    status: ExportStatus;
    glBatch?: string | null;
    exportedAt: string;
    exportedDate: string;
    exportedSub?: string;
    errorMsg?: string;
    lines?: InvoiceLine[];
}

export interface ExportsData {
    period: string;
    autoExport: string;
    nextSync: string;
    totalExported: number;
    totalAmount: number;
    successRate: number;
    successOf: number;
    failedCount: number;
    failedAmount: number;
    nextAutoExport: string;
    nextAutoExportSub: string;
    records: ExportRecord[];
}