import type { InvoiceStatusFilter } from "@/types/invoices";

interface InvoicesTabsProps {
    tab: InvoiceStatusFilter;
    onChange: (tab: InvoiceStatusFilter) => void;
    counts: Record<string, number>;
}

const TABS: { id: InvoiceStatusFilter; label: string; critBadge?: boolean }[] = [
    { id: "all",          label: "All" },
    { id: "ocr",          label: "OCR in Progress" },
    { id: "over-budget",  label: "Over Budget",           critBadge: true },
    { id: "no-match",     label: "No PO Match",           critBadge: true },
    { id: "processed",    label: "Processed" },
    { id: "review",       label: "Needs Review" },
];

export function InvoicesTabs({ tab, onChange, counts }: InvoicesTabsProps) {
    return (
        <div className=" overflow-x-auto p-3  border-b border-hair">
            <div className="flex w-max gap-3 rounded-[11px]">
                {TABS.map((item) => {
                    const isActive = tab === item.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onChange(item.id)}
                            className={`flex shrink-0 items-center whitespace-nowrap  rounded-lg px-4 py-[7px] text-[13px] font-medium transition-colors ${
                                isActive
                                    ? "bg-[#0c1320] text-white text-ink-900 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_var(--color-hair-2)]"
                                    : "bg-surface-chip text-muted-strong hover:text-ink-900"
                            }`}
                        >
                            {item.label}
                            <span
                                className={`ml-1.5 rounded-full px-0.5 py-0.5 text-[11px] 
                                }`}
                            >
                {counts[item.id] ?? 0}
              </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}