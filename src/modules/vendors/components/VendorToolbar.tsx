import { useMemo } from "react";
import type { Vendor } from "@/types/vendors";
import { DEPTS } from "../lib/vendors";
import { SelectDropdown } from "@/components/ui/SelectDropdown";

const STATUS_OPTIONS = [
    { key: "all",         label: "All statuses"     },
    { key: "active",      label: "Active"           },
    { key: "expiring",    label: "Expiring Soon"    },
    { key: "coi_expired", label: "COI Expired"      },
    { key: "pending",     label: "Pending Approval" },
    { key: "inactive",    label: "Inactive"         },
];

interface Props {
    vendors:         readonly Vendor[];
    deptFilter:      string;
    setDeptFilter:   (v: string) => void;
    statusFilter:    string;
    setStatusFilter: (v: string) => void;
}

export function VendorToolbar({ vendors, deptFilter, setDeptFilter, statusFilter, setStatusFilter }: Props) {
    const total = vendors.length;

    const deptCounts = useMemo(
        () => Object.keys(DEPTS).reduce<Record<string, number>>((acc, d) => {
            acc[d] = vendors.filter(v => v.dept === d).length;
            return acc;
        }, {}),
        [vendors],
    );

    const chipCls = (active: boolean) =>
        `shrink-0 inline-flex h-8 items-center gap-1.5 rounded-full border px-3 sm:px-3.5 text-[12px] sm:text-[12.5px] font-semibold transition-colors ${
            active
                ? "border-[#1a2540] bg-[#1a2540] text-white"
                : "border-hair-2 bg-white text-ink-700 hover:border-accent/40"
        }`;

    return (
        <div className="flex w-full items-center gap-2 sm:gap-2.5 overflow-x-auto border-b border-hair-2 px-3 sm:px-4 py-2.5 sm:py-3 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

            {/* Calendar button */}
            <button className="shrink-0 inline-flex h-8 items-center gap-1.5 rounded-lg border border-hair-2 bg-white px-2.5 sm:px-3 text-[12px] sm:text-[12.5px] font-medium text-ink-700 shadow-soft transition hover:bg-surface-soft">
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-muted" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3.5" y="5" width="17" height="15" rx="2" />
                    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
                </svg>
                April 2026
            </button>

            {/* Separator */}
            <div className="shrink-0 h-4 w-px bg-hair-2 mx-0.5" />

            {/* All chip */}
            <button onClick={() => setDeptFilter("all")} className={chipCls(deptFilter === "all")}>
                All <span className="tabular-nums opacity-70">{total}</span>
            </button>

            {/* Dept chips */}
            {Object.entries(DEPTS).map(([key, dept]) => (
                <button
                    key={key}
                    onClick={() => setDeptFilter(deptFilter === key ? "all" : key)}
                    className={chipCls(deptFilter === key)}
                >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: dept.color }} />
                    {dept.name}
                    <span className="tabular-nums opacity-70">{deptCounts[key] ?? 0}</span>
                </button>
            ))}

            <div className="hidden sm:block sm:flex-1" />

            <SelectDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                options={STATUS_OPTIONS}
                className="shrink-0 w-[160px]"
            />

        </div>
    );
}