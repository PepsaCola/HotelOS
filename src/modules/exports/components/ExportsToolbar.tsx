import { useState, useMemo } from "react";
import type { ExportStatus } from "@/types/exports";
import { SelectDropdown } from "@/components/ui/SelectDropdown";

type Filter = ExportStatus | "all";

interface Props {
    statusFilter:   Filter;
    onStatusChange: (f: Filter) => void;
}

const MONTH_OPTIONS = [
    { key: "april-2026",    label: "April 2026"    },
    { key: "march-2026",    label: "March 2026"    },
    { key: "february-2026", label: "February 2026" },
];

const STATUS_OPTIONS = [
    { key: "all",      label: "All Statuses" },
    { key: "exported", label: "Exported"     },
    { key: "error",    label: "Failed"       },
];

const DEPT_OPTIONS = [
    { key: "all",   label: "All Departments" },
    { key: "Rooms", label: "Rooms"           },
    { key: "F&B",   label: "F&B"             },
    { key: "A&G",   label: "A&G"             },
    { key: "IT",    label: "IT"              },
    { key: "S&M",   label: "S&M"             },
    { key: "R&M",   label: "R&M"             },
];

export function ExportsToolbar({ statusFilter, onStatusChange }: Props) {
    const [month, setMonth] = useState("april-2026");
    const [dept,  setDept]  = useState("all");

    const statusOptions = useMemo(
        () => STATUS_OPTIONS.map(o => ({ key: o.key, label: o.label })),
        [],
    );

    return (
        <div className="flex w-full items-center gap-2 sm:gap-2.5 rounded-t-[14px] border border-hair-2 border-b-0 bg-white px-3 sm:px-3.5 py-2.5 sm:py-3 overflow-x-auto sm:flex-wrap [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

            <SelectDropdown
                value={month}
                onChange={setMonth}
                options={MONTH_OPTIONS}
                className="shrink-0 w-[148px]"
            />

            <div className="hidden sm:block sm:flex-1" />

            <SelectDropdown
                value={statusFilter}
                onChange={v => onStatusChange(v as Filter)}
                options={statusOptions}
                className="shrink-0 w-[148px]"
            />

            <SelectDropdown
                value={dept}
                onChange={setDept}
                options={DEPT_OPTIONS}
                className="shrink-0 w-[160px]"
            />

        </div>
    );
}