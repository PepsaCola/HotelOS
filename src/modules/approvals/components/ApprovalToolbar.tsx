import type { ApprovalDepartment } from "@/types/approvals";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import type { SelectOption } from "@/components/ui/SelectDropdown";

export type DeptFilter = "all" | string;
export type TypeFilter = "all" | "Operational" | "Fixed / Recurring" | "CapEx" | "Prepaid";
export type SortKey = "oldest" | "newest" | "highest";

const TYPE_OPTIONS: { key: TypeFilter; label: string }[] = [
    { key: "all",                label: "All types"          },
    { key: "Operational",        label: "Operational"        },
    { key: "Fixed / Recurring",  label: "Fixed / Recurring"  },
    { key: "CapEx",              label: "CapEx"              },
    { key: "Prepaid",            label: "Prepaid"            },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "oldest",  label: "Oldest first"   },
    { key: "newest",  label: "Newest first"   },
    { key: "highest", label: "Highest amount" },
];

// ── ApprovalToolbar ───────────────────────────────────────────────────────────

interface ApprovalToolbarProps {
    departments:   Record<string, ApprovalDepartment>;
    deptFilter:    DeptFilter;
    setDeptFilter: (value: DeptFilter) => void;
    typeFilter:    TypeFilter;
    setTypeFilter: (value: TypeFilter) => void;
    sort:          SortKey;
    setSort:       (value: SortKey) => void;
}

export function ApprovalToolbar({
                                    departments, deptFilter, setDeptFilter,
                                    typeFilter, setTypeFilter,
                                    sort, setSort,
                                }: ApprovalToolbarProps) {
    const deptOptions: SelectOption[] = [
        { key: "all", label: "All departments" },
        ...Object.keys(departments).map(d => ({ key: d, label: d })),
    ];

    return (
        <div className="grid grid-cols-2 gap-2.5 border-b border-hair-2 bg-surface-soft p-3 sm:flex sm:flex-wrap sm:items-center sm:gap-3 sm:p-3.5">

            <SelectDropdown
                value={deptFilter}
                onChange={setDeptFilter}
                options={deptOptions}
                className="col-span-2 sm:w-[180px]"
            />

            <SelectDropdown
                value={typeFilter}
                onChange={v => setTypeFilter(v as TypeFilter)}
                options={TYPE_OPTIONS}
                className="sm:w-[160px]"
            />

            <SelectDropdown
                value={sort}
                onChange={v => setSort(v as SortKey)}
                options={SORT_OPTIONS}
                className="sm:w-[160px]"
            />

        </div>
    );
}