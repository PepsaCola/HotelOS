import type { Invoice, InvoiceStatusFilter, InvoiceDept, AmountRange, SortKey } from "@/types/invoices";

export function filterInvoices(
    invoices: Invoice[],
    status: InvoiceStatusFilter,
    dept: InvoiceDept,
    vendor: string,
    amountRange: AmountRange,
    poRef: string = "any",
): Invoice[] {
    return invoices.filter((inv) => {
        if (status !== "all" && inv.status !== status)               return false;
        if (dept !== "all" && inv.dept !== dept)                     return false;
        if (vendor !== "all" && inv.vendor !== vendor)               return false;
        if (poRef !== "any" && inv.poRef !== poRef)                  return false;
        if (amountRange === "under-1k" && inv.amount >= 1000)        return false;
        if (amountRange === "1k-3k" && (inv.amount < 1000 || inv.amount > 3000)) return false;
        if (amountRange === "over-3k" && inv.amount <= 3000)         return false;
        return true;
    });
}

export function sortInvoices(invoices: Invoice[], sort: SortKey): Invoice[] {
    return [...invoices].sort((a, b) => {
        if (sort === "received") return b.receivedTimestamp - a.receivedTimestamp;
        if (sort === "highest")  return b.amount - a.amount;
        if (sort === "lowest")   return a.amount - b.amount;
        return b.updatedTimestamp - a.updatedTimestamp; // "updated" — default
    });
}

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "updated",  label: "Last Updated"   },
    { key: "received", label: "Received Date"  },
    { key: "highest",  label: "Highest Amount" },
    { key: "lowest",   label: "Lowest Amount"  },
];

export const AMOUNT_OPTIONS: { key: AmountRange; label: string }[] = [
    { key: "any",      label: "Any"       },
    { key: "under-1k", label: "Under $1k" },
    { key: "1k-3k",    label: "$1k–$3k"   },
    { key: "over-3k",  label: "Over $3k"  },
];

export const DEPT_OPTIONS: InvoiceDept[] = ["all", "Rooms", "F&B", "A&G", "IT", "S&M", "R&M"];