import type { InvoicesData } from "@/types/invoices";
import { invoicesMock } from "@/modules/invoices/data/invoicesMock";

/**
 * Data-access seam for the Invoices module. Resolves bundled mock data today;
 * swap the body for a `fetch("/api/invoices?month=...")` returning `InvoicesData`.
 * This is the only file that changes for backend wiring.
 */
export async function fetchInvoices(_signal?: AbortSignal): Promise<InvoicesData> {
    return invoicesMock;
}