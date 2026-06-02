import type { CreatePOFormData } from "@/types/createPO";

export const createPODefaults: CreatePOFormData = {
    poNumber: "EN0513",
    date: "19.05.2026",
    budgetClassification: "Expense",
    accountNumber: "726680000.00",
    billedTo: "COURTYARD LAKE BUENA VISTA",
    vendor: "Ferran",
    shipping: "$0.00",
    tax: "$0.00",
    lineItems: [
        {
            id: 1,
            qty: "2,582",
            unit: "Sq.Ft.",
            description: "Water Extraction 3,399 sq.ft. at $0.35/sq.ft.",
            unitPrice: "$0.35",
            amount: "$903.70",
        },
        { id: 2, qty: "", unit: "", description: "", unitPrice: "", amount: "" },
    ],
    departments: [
        { id: 1, label: "Rooms", account: "Account", amount: "Amount" },
        { id: 2, label: "A&G", account: "Account", amount: "Amount" },
        { id: 3, label: "F&B", account: "Account", amount: "Amount" },
        { id: 4, label: "S&M", account: "Account", amount: "Amount" },
        { id: 5, label: "R&M", account: "Account", amount: "Amount" },
    ],
};