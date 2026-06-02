export type ViewMode = "form" | "preview" | "final";

export interface LineItem {
    id: number;
    qty: string;
    unit: string;
    description: string;
    unitPrice: string;
    amount: string;
}

export interface DepartmentAllocation {
    id: number;
    label: string;
    account: string;
    amount: string;
}

export interface CreatePOFormData {
    poNumber: string;
    date: string;
    budgetClassification: string;
    accountNumber: string;
    billedTo: string;
    vendor: string;
    shipping: string;
    tax: string;
    lineItems: LineItem[];
    departments: DepartmentAllocation[];
}