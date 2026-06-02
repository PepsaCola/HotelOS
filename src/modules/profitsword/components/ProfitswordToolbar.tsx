import { useMemo } from "react";
import { SelectDropdown } from "@/components/ui/SelectDropdown";

const ALL_STATUSES = ["All", "Imported", "Partial Import", "Processing", "Needs Mapping", "Archived", "Failed"];

const STATUS_OPTIONS = ALL_STATUSES.map(s => ({ key: s, label: s }));

interface ProfitswordToolbarProps {
    search:      string;   setSearch:   (v: string) => void;
    status:      string;   setStatus:   (v: string) => void;
    property:    string;   setProperty: (v: string) => void;
    properties:  string[];
    onClear:     () => void;
}

export function ProfitswordToolbar({
                                       search, setSearch,
                                       status, setStatus,
                                       property, setProperty,
                                       properties,
                                       onClear,
                                   }: ProfitswordToolbarProps) {
    const isFiltered = search !== "" || status !== "All" || property !== "All";

    const propertyOptions = useMemo(
        () => properties.map(p => ({ key: p, label: p })),
        [properties],
    );

    return (
        <div className="flex overflow-x-auto items-center gap-2.5 p-3 border-b border-gray-200">

            <div className="relative min-w-[300px]">
                <svg viewBox="0 0 24 24" fill="none"
                     className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                     stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7"/>
                    <path d="m21 21-4.35-4.35" strokeLinecap="round"/>
                </svg>
                <input
                    type="text"
                    placeholder="Search imports…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="h-9 w-full rounded-lg border border-hair-2 bg-white pl-9 pr-3.5 text-[13.5px] text-ink-900 placeholder:text-muted shadow-soft outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                />
            </div>

            <SelectDropdown
                value={status}
                onChange={setStatus}
                options={STATUS_OPTIONS}
                className="w-full sm:w-[180px]"
            />

            <SelectDropdown
                value={property}
                onChange={setProperty}
                options={propertyOptions}
                className="w-full sm:w-[180px]"
            />
            <button
                className="h-9 px-3 text-[13px] text-muted transition hover:text-blue ml-auto flex items-center justify-center gap-1"
            >
                <svg viewBox="0 0 24 24" fill="none" width={14} height={14}>
                    <path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1M7 11l5 5 5-5M12 4v12" stroke="currentColor"
                          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                Export
            </button>
            {isFiltered && (
                <button
                    onClick={onClear}
                    className="h-9 rounded-lg border border-hair-2 bg-white px-3 text-[13px] text-muted transition hover:text-crit"
                >
                Clear
                </button>
            )}

        </div>
    );
}