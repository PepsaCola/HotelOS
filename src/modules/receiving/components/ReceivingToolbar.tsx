import { useMemo } from "react";
import { CalendarIcon } from "@/components/ui/icons";
import type { ReceivingDept } from "@/types/receiving";
import type { SortKey } from "../lib/queue";
import { SORT_OPTIONS } from "../lib/queue";
import { SelectDropdown } from "@/components/ui/SelectDropdown";

interface ReceivingToolbarProps {
    month: string;
    deptFilter: ReceivingDept;
    setDeptFilter: (value: ReceivingDept) => void;
    sort: SortKey;
    setSort: (value: SortKey) => void;
}

interface DeptChip {
    id: ReceivingDept;
    label: string;
    color?: string;
}

const DEPT_CHIPS: DeptChip[] = [
    { id: "all",   label: "All" },
    { id: "Rooms", label: "Rooms", color: "#4a78f0" },
    { id: "F&B",   label: "F&B",   color: "#e88a3c" },
    { id: "A&G",   label: "A&G",   color: "#7a6df0" },
    { id: "IT",    label: "IT",    color: "#119da4" },
    { id: "S&M",   label: "S&M",   color: "#c7458a" },
    { id: "R&M",   label: "R&M",   color: "#38a169" },
];

export function ReceivingToolbar({ month, deptFilter, setDeptFilter, sort, setSort }: ReceivingToolbarProps) {
    const sortOptions = useMemo(
        () => SORT_OPTIONS.map(o => ({ key: o.key, label: o.label })),
        [],
    );

    return (
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-x-2.5 gap-y-3 border-b border-hair-2 bg-white px-3 py-3 sm:px-3.5">

            {/* 1. Date Button */}
            <button
                type="button"
                className="order-1 inline-flex h-[34px] items-center gap-2 rounded-lg border border-hair-2 bg-surface-soft px-2.5 text-[12.5px] sm:text-[13px] font-medium text-ink-700 hover:bg-surface-muted"
            >
                <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                <span>{month}</span>
            </button>

            {/* 2. Dept Chips */}
            <div className="order-3 sm:order-2 flex w-full sm:w-auto overflow-x-auto sm:flex-wrap items-center gap-1.5 pb-1 sm:pb-0 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {DEPT_CHIPS.map((chip) => {
                    const active = deptFilter === chip.id;
                    return (
                        <button
                            key={chip.id}
                            type="button"
                            onClick={() => setDeptFilter(chip.id)}
                            className={`inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-[9px] border px-2.5 py-[6px] sm:py-[7px] text-[12px] sm:text-[12.5px] font-medium transition-colors ${
                                active
                                    ? "border-hair-2 bg-white text-ink-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                                    : "border-transparent bg-surface-soft text-ink-700 hover:bg-surface-chip"
                            }`}
                        >
                            {chip.color && (
                                <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: chip.color }} />
                            )}
                            <span>{chip.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* 3. Spacer */}
            <div className="hidden sm:block sm:order-3 flex-1" />

            {/* 4. Sort Dropdown */}
            <SelectDropdown
                value={sort}
                onChange={v => setSort(v as SortKey)}
                options={sortOptions}
                className="order-2 sm:order-4 w-[148px]"
            />

        </div>
    );
}