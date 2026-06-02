export type VendorStatus = 'active' | 'expiring' | 'coi_expired' | 'pending' | 'inactive';
export type VendorDept   = 'rooms' | 'fb' | 'ag' | 'it' | 'sm' | 'rm';
export type M3Status     = 'mapped' | 'pending' | 'none';
export type DocStatus    = 'ok' | 'warn' | 'miss' | 'na';
export type CostType     = 'fixed' | 'variable' | 'per_occurrence';

export interface VendorDocs {
    coi: DocStatus;
    w9:  DocStatus;
    cnt: DocStatus;
}

export interface VendorContact {
    name:  string;
    email: string;
    phone: string;
}

export interface VendorDocument {
    name:   string;
    type:   string;
    expiry: string;
    status: DocStatus;
    size:   string;
}

export interface Vendor {
    id:              string;
    name:            string;
    category:        string;
    dept:            VendorDept;
    monthlyCost:     number;
    costType:        CostType;
    contractStart:   string | null;
    contractEnd:     string | null;
    contractEndTs:   Date | null;
    noticeDays:      number | null;
    coiExpires:      string | null;
    coiExpiresTs:    Date | null;
    docs:            VendorDocs;
    m3:              M3Status;
    m3Code:          string | null;
    status:          VendorStatus;
    contact:         VendorContact;
    fein:            string | null;
    paymentTerms:    string;
    ytdSpend:        number;
    mtdSpend:        number;
    openPOs:         number;
    lastPO:          string | null;
    notes:           string;
    documents:       VendorDocument[];
}

export interface VendorsKpis {
    active:       Vendor[];
    pending:      Vendor[];
    expiring:     Vendor[];
    coiIssues:    Vendor[];
    monthlyTotal: number;
    total:        number;
}

export interface VendorsData {
    vendors: readonly Vendor[];
}