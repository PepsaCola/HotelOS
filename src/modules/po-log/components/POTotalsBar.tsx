import type { PODeptId, POStatus, PODepartment, StatusMeta } from "@/types/poLog";
import { CloseIcon } from "@/components/ui/icons";
import { fmtUSD } from "@/lib/money";

interface POTotalsBarProps {
  filteredCount: number;
  filteredTotal: number;
  deptFilter: PODeptId | "all";
  statusFilter: POStatus | "all";
  departments: Record<PODeptId, PODepartment>;
  statusMeta: Record<POStatus, StatusMeta>;
  fixedTotal: number;
  openTotal: number;
  receivedTotal: number;
  onClose: () => void;
}

function Money({ value, big = false }: { value: number; big?: boolean }) {
  const f = fmtUSD(value);
  return (
    <span className={big ? "text-3xl font-bold tracking-tight" : "text-[22px] font-bold tracking-tight"}>
      {f.whole}
      <span className={`font-medium text-white/60 ${big ? "text-[15px]" : "text-[13px]"}`}>{f.cents}</span>
    </span>
  );
}

const LAB = "mb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/55";

export function POTotalsBar({
  filteredCount,
  filteredTotal,
  deptFilter,
  statusFilter,
  departments,
  statusMeta,
  fixedTotal,
  openTotal,
  receivedTotal,
  onClose,
}: POTotalsBarProps) {
  return (
    <div className="sticky bottom-5 z-20 mt-[18px] flex flex-wrap items-center gap-6 rounded-xl bg-[#0c1320] py-3.5 pl-[18px] pr-14 text-white shadow-[0_8px_24px_rgba(12,19,32,0.18)]">
      <button
        type="button"
        aria-label="Hide totals bar"
        title="Hide totals bar (re-enable from Display Options)"
        onClick={onClose}
        className="absolute right-2.5 top-2.5 grid h-[26px] w-[26px] place-items-center rounded-md text-white/55 hover:bg-white/10 hover:text-white"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>

      <div className="min-w-[180px] flex-1">
        <div className={LAB}>Filtered selection</div>
        <div className="flex flex-wrap items-center gap-2.5 text-[18px] font-semibold text-white/75">
          {filteredCount} {filteredCount === 1 ? "order" : "orders"}
          {deptFilter !== "all" ? <Pill>{departments[deptFilter].name}</Pill> : null}
          {statusFilter !== "all" ? <Pill>{statusMeta[statusFilter].label}</Pill> : null}
        </div>
      </div>

      <div className="hidden h-9 w-px bg-white/10 sm:block" />

      <div>
        <div className={LAB}>Fixed (recurring)</div>
        <Money value={fixedTotal} />
      </div>
      <div>
        <div className={LAB}>Pending</div>
        <Money value={openTotal} />
      </div>
      <div>
        <div className={LAB}>Received</div>
        <Money value={receivedTotal} />
      </div>
      <div>
        <div className={LAB}>Selection total</div>
        <Money value={filteredTotal} big />
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/85">{children}</span>;
}
