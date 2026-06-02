import { FilterChip } from "@/components/ui/FilterChip";
import type { FilterOption } from "@/components/ui/FilterChip";

interface ExceptionsFilterBarProps {
    dept:        string;  setDept:        (v: string) => void;
    severity:    string;  setSeverity:    (v: string) => void;
    assignee:    string;  setAssignee:    (v: string) => void;
    onClear: () => void;
}

const DEPT_OPTIONS: FilterOption[] = [
    "All", "Rooms", "F&B", "Engineering", "Admin", "Sales & Mktg", "Spa & Maint.",
].map(v => ({ key: v, label: v }));

const SEVERITY_OPTIONS: FilterOption[] = [
    "All", "Critical", "Warning", "Info",
].map(v => ({ key: v, label: v }));

const ASSIGNEE_OPTIONS: FilterOption[] = [
    "All", "Marcus L.", "Sandra K.", "Controller",
].map(v => ({ key: v, label: v }));

export function ExceptionsFilterBar({
                                        dept, setDept, severity, setSeverity, assignee, setAssignee, onClear,
                                    }: ExceptionsFilterBarProps) {
    const isFiltered = dept !== "All" || severity !== "All" || assignee !== "All";

    return (
        <div className="flex w-full items-center gap-2 sm:gap-3 overflow-x-auto sm:flex-wrap pb-1 sm:pb-0 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

            <FilterChip
                label="Department"
                displayValue={dept}
                active={dept !== "All"}
                options={DEPT_OPTIONS}
                selected={dept}
                onSelect={setDept}
            />
            <FilterChip
                label="Severity"
                displayValue={severity}
                active={severity !== "All"}
                options={SEVERITY_OPTIONS}
                selected={severity}
                onSelect={setSeverity}
            />
            <FilterChip
                label="Assignee"
                displayValue={assignee}
                active={assignee !== "All"}
                options={ASSIGNEE_OPTIONS}
                selected={assignee}
                onSelect={setAssignee}
            />

            <div className="hidden sm:block sm:flex-1" />

            {isFiltered && (
                <button
                    onClick={onClear}
                    className="shrink-0 px-1 text-[12.5px] sm:text-[13px] font-medium text-muted transition-colors hover:text-ink-900"
                >
                    Clear all
                </button>
            )}
        </div>
    );
}