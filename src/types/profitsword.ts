export type ImportStatus =
    | 'Imported'
    | 'Partial Import'
    | 'Processing'
    | 'Needs Mapping'
    | 'Archived'
    | 'Failed';

export type DetailTab = 'report' | 'issues' | 'audit';
export type ModalMode = 'validate' | 'import';
export type ModalStep = 0 | 1 | 2 | 3 | 4;

export interface ImportRecord {
    id: string;
    importName: string;
    fileName: string;
    property: string;
    forecastPeriod: string;
    uploadedBy: string;
    uploadedAt: string;
    rows: number | null;
    failedRows: number | null;
    status: ImportStatus;
    active: boolean;
    lastSync: string;
    totalRevenue?: number;
    gop?: number;
    noi?: number;
}

export interface FinancialRow {
    type?: 'section' | 'total' | 'highlight';
    label: string;
    values?: Array<number | string>;
    dollar?: boolean;
    pct?: boolean;
}

export interface AuditEvent {
    event: string;
    time: string;
    detail: string;
}

export interface ProfitswordData {
    records: readonly ImportRecord[];
    financialRows: readonly FinancialRow[];
    auditEvents: readonly AuditEvent[];
}