import type { InvoiceDept, AmountRange, SortKey } from "@/types/invoices";
import { CloseIcon } from "@/components/ui/icons";
import { FilterChip } from "@/components/ui/FilterChip";
import type { FilterOption } from "@/components/ui/FilterChip";
import { SORT_OPTIONS, AMOUNT_OPTIONS, DEPT_OPTIONS } from "../lib/filter";

// ── Props ─────────────────────────────────────────────────────────────────────

interface InvoicesFilterBarProps {
    sort:        SortKey;      setSort:        (v: SortKey) => void;
    vendor:      string;       setVendor:      (v: string) => void;
    dept:        InvoiceDept;  setDept:        (v: InvoiceDept) => void;
    amountRange: AmountRange;  setAmountRange: (v: AmountRange) => void;
    vendors:     string[];
    onClear:     () => void;
    poRef:       string;       setPoRef:       (v: string) => void;
    poRefs:      string[];
}

// ── Bar ───────────────────────────────────────────────────────────────────────

export function InvoicesFilterBar({
                                      sort, setSort, vendor, setVendor, dept, setDept,
                                      amountRange, setAmountRange, vendors, onClear,
                                      poRef, setPoRef, poRefs,
                                  }: InvoicesFilterBarProps) {
    const isFiltered = vendor !== "all" || dept !== "all" || amountRange !== "any" || poRef !== "any" || sort !== "updated";

    const vendorOpts: FilterOption[] = [
        { key: "all", label: "All vendors" },
        ...vendors.map(v => ({ key: v, label: v })),
    ];

    const poOpts: FilterOption[] = [
        { key: "any", label: "Any" },
        ...poRefs.map(r => ({ key: r, label: r })),
    ];

    const deptOpts: FilterOption[] = DEPT_OPTIONS.map(d => ({
        key:   d,
        label: d === "all" ? "All departments" : d,
    }));

    return (
        <div className="flex w-full items-center gap-2 overflow-x-auto px-3.5 py-2.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

            <FilterChip
                label="Sort"
                displayValue={SORT_OPTIONS.find(o => o.key === sort)?.label ?? sort}
                options={SORT_OPTIONS}
                selected={sort}
                onSelect={v => setSort(v as SortKey)}
            />
            <FilterChip
                label="Vendor"
                displayValue={vendor === "all" ? "All" : vendor}
                active={vendor !== "all"}
                options={vendorOpts}
                selected={vendor}
                onSelect={setVendor}
                dropMaxH="max-h-[260px]"
                searchable
            />
            <FilterChip
                label="Department"
                displayValue={dept === "all" ? "All" : dept}
                active={dept !== "all"}
                options={deptOpts}
                selected={dept}
                onSelect={v => setDept(v as InvoiceDept)}
            />
            <FilterChip
                label="PO"
                displayValue={poRef === "any" ? "Any" : poRef}
                active={poRef !== "any"}
                options={poOpts}
                selected={poRef}
                onSelect={setPoRef}
                dropMaxH="max-h-[260px]"
                searchable
            />
            <FilterChip
                label="Amount"
                displayValue={AMOUNT_OPTIONS.find(o => o.key === amountRange)?.label ?? "Any"}
                active={amountRange !== "any"}
                options={AMOUNT_OPTIONS}
                selected={amountRange}
                onSelect={v => setAmountRange(v as AmountRange)}
            />

            <div className="flex-1" />

            {isFiltered && (
                <button
                    type="button"
                    onClick={onClear}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-strong transition-colors hover:bg-surface-chip hover:text-ink-900"
                >
                    <CloseIcon className="h-3.5 w-3.5 shrink-0" />
                    Clear
                </button>
            )}
        </div>
    );
}