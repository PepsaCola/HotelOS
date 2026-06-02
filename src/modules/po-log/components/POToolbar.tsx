import { useMemo } from "react";
import type { PODeptId, POStatus, PODepartment, StatusMeta } from "@/types/poLog";
import { CalendarIcon } from "@/components/ui/icons";
import { fmtCompact } from "@/lib/money";
import { SelectDropdown } from "@/components/ui/SelectDropdown";

interface POToolbarProps {
  departments: Record<PODeptId, PODepartment>;
  statusMeta: Record<POStatus, StatusMeta>;
  deptFilter: PODeptId | "all";
  setDeptFilter: (dept: PODeptId | "all") => void;
  statusFilter: POStatus | "all";
  setStatusFilter: (status: POStatus | "all") => void;
  totalCount: number;
  spentToDate: number;
  deptCounts: Partial<Record<PODeptId, number>>;
  deptTotals: Partial<Record<PODeptId, number>>;
}

export function POToolbar({
                            departments,
                            statusMeta,
                            deptFilter,
                            setDeptFilter,
                            statusFilter,
                            setStatusFilter,
                            totalCount,
                            spentToDate,
                            deptCounts,
                            deptTotals,
                          }: POToolbarProps) {
  const orderedDepts = Object.keys(departments) as PODeptId[];
  const spent = fmtCompact(spentToDate);

  const statusOptions = useMemo(() => [
    { key: "all", label: "All statuses" },
    ...(Object.entries(statusMeta) as [POStatus, StatusMeta][]).map(([key, meta]) => ({
      key,
      label: meta.label,
    })),
  ], [statusMeta]);

  return (
      <div className="flex flex-wrap items-center justify-between sm:justify-start gap-y-3 gap-x-2.5 rounded-t-[14px] border border-b-0 border-hair-2 bg-white p-3 sm:p-3.5">

        {/* 1. Date (Мобільний: зліва зверху | ПК: зліва) */}
        <button className="order-1 inline-flex h-[34px] items-center gap-2 rounded-lg border border-hair-2 bg-surface-soft px-2.5 text-[12.5px] sm:text-[13px] font-medium hover:bg-[#f0f0ef]">
          <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-muted-strong" />
          <span>April 2026</span>
        </button>

        {/* 4. Status Dropdown (Мобільний: справа зверху | ПК: повністю справа) */}
        <SelectDropdown
            value={statusFilter}
            onChange={v => setStatusFilter(v as POStatus | "all")}
            options={statusOptions}
            className="order-2 sm:order-4 w-[148px]"
        />

        {/* 3. Spacer (Лише для ПК: штовхає статус вправо) */}
        <div className="hidden sm:block sm:order-3 flex-1" />

        {/* 2. Chips (Мобільний: 2-й рядок, скролиться | ПК: поруч із датою) */}
        <div className="order-3 sm:order-2 flex w-full sm:w-auto overflow-x-auto sm:flex-wrap items-center gap-1.5 pb-1 sm:pb-0 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

          <Chip active={deptFilter === "all"} onClick={() => setDeptFilter("all")}>
            All{" "}
            <span className={deptFilter === "all" ? "text-white/65" : "text-[#9aa0a8]"}>
            <b className={deptFilter === "all" ? "text-white" : "text-ink-700"}>{totalCount}</b> · {spent.whole}
              {spent.unit}
          </span>
          </Chip>

          {orderedDepts.map((d) => {
            const dept = departments[d];
            const total = fmtCompact(deptTotals[d] ?? 0);
            const active = deptFilter === d;
            return (
                <Chip key={d} active={active} onClick={() => setDeptFilter(active ? "all" : d)}>
                  <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: dept.color }} />
                  {dept.name}
                  <span className={active ? "text-white/65" : "text-[#9aa0a8]"}>
                <b className={active ? "text-white" : "text-ink-700"}>{deptCounts[d] ?? 0}</b> · {total.whole}
                    {total.unit}
              </span>
                </Chip>
            );
          })}
        </div>

      </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
      <button
          type="button"
          onClick={onClick}
          // Додано shrink-0 та whitespace-nowrap, щоб текст всередині чипса не переносився під час скролу
          className={`inline-flex shrink-0 items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-[9px] border px-2.5 py-[6px] sm:py-[7px] text-[12px] sm:text-[12.5px] font-medium transition-colors ${
              active
                  ? "border-[#0c1320] bg-[#0c1320] text-white"
                  : "border-transparent bg-surface-muted text-ink-700 hover:bg-surface-chip"
          }`}
      >
        {children}
      </button>
  );
}