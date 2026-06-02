import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

interface InvoicesPagerProps {
    shown: number;
    total: number;
}

export function InvoicesPager({ shown, total }: InvoicesPagerProps) {
    return (
        <div className="flex flex-col items-start justify-between gap-3 border-t border-hair-2 px-3 py-3 sm:flex-row sm:items-center">
            <div className="text-[13px] text-muted-strong">
                Showing <b className="font-semibold text-ink-900">{shown}</b> of {total} invoices
            </div>
            <div className="flex items-center gap-3.5 text-[13px] text-muted-strong">
                <div className="flex gap-0.5">
                    <PagerBtn aria-label="Previous page"><ChevronLeftIcon className="h-3.5 w-3.5" /></PagerBtn>
                    <PagerBtn active>1</PagerBtn>
                    <PagerBtn aria-label="Next page"><ChevronRightIcon className="h-3.5 w-3.5" /></PagerBtn>
                </div>
                <span>Lines per page</span>
                <select className="h-[30px] rounded-lg border border-hair-2 bg-white px-2 text-[13px]">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                </select>
            </div>
        </div>
    );
}

function PagerBtn({ active, children, ...props }: { active?: boolean; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            type="button"
            className={`grid h-[30px] min-w-[30px] place-items-center rounded-[7px] px-2 text-[13px] tabular-nums ${
                active ? "border border-hair-2 bg-white font-semibold text-ink-900" : "text-ink-700 hover:bg-surface-chip"
            }`}
            {...props}
        >
            {children}
        </button>
    );
}