import type { LineItem, DepartmentAllocation } from "@/types/createPO";
import PODocument from "./PODocument";

interface Props {
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

// Додано justify-center, w-full sm:w-auto, та зменшено розміри для мобільних екранів
const btnBase =
    "inline-flex h-9 sm:h-10 items-center justify-center gap-1.5 sm:gap-2 rounded-xl border px-3 sm:px-[14px] text-[13px] sm:text-sm font-medium transition-opacity w-full sm:w-auto shrink-0";

export default function POFinalView(props: Props) {
    return (
        <div className="overflow-hidden rounded-[16px] sm:rounded-[22px] border border-page-border bg-white shadow-soft">

            {/* ── Header ── */}
            {/* На мобільному - колонка. На ПК - рядок */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-3 border-b border-page-border bg-[#fcfcfd] px-4 sm:px-[22px] py-4 sm:py-[18px]">
                <div className="min-w-0">
                    <div className="mb-1.5 sm:mb-3 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-muted">
                        Purchase Order Created
                    </div>
                    <strong className="block text-[13.5px] sm:text-sm text-ink break-words">
                        Final document ready to print, download, or share
                    </strong>
                </div>

                {/* ── Actions ── */}
                {/* На мобільному: Print і Download по 50%, Send to Vendor на 100%. На ПК - всі в ряд */}
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0">
                    <button type="button" className={`${btnBase} border-page-border bg-white text-ink-700 hover:bg-surface-muted`}>
                        Print
                    </button>
                    <button type="button" className={`${btnBase} border-page-border bg-white text-ink-700 hover:bg-surface-muted`}>
                        Download
                    </button>
                    <button type="button" className={`${btnBase} col-span-2 sm:col-span-1 border-[#1f2028] bg-[#1f2028] text-white hover:opacity-90`}>
                        Send to Vendor
                    </button>
                </div>
            </div>

            {/* ── Document Wrapper ── */}
            <div className="pb-4 sm:pb-8">
                {/* Замінили жорстку ширину 1052px на w-full */}
                <div className="mx-auto w-full">
                    <PODocument {...props} />
                </div>
            </div>

        </div>
    );
}