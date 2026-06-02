import type { ReactNode } from "react";
import { formatMoney } from "@/lib/money";
import type { ApprovalsSummary } from "../lib/summary";
import { glAccount } from "../lib/po";

interface ApprovalKpisProps {
  summary: ApprovalsSummary;
}

export function ApprovalKpis({ summary }: ApprovalKpisProps) {
  const { pendingCount, avgWaitDays, overdueCount, overBudgetCount, overBudgetAmount, capexCount, capexPo } = summary;
  const vsTarget = Math.max(0, avgWaitDays - 1);

  return (
    <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2 xl:grid-cols-4">
      {/* Hero — pending my action */}
      <div className="relative flex flex-col gap-1.5 overflow-hidden rounded-[14px] border border-[#0d101a] bg-gradient-to-b from-[#101321] to-[#1a1f33] p-[18px] pb-4 text-white">
        <div className="absolute right-3.5 top-3.5 opacity-85">
          <Spark />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7ce0a3]" />
          Pending My Action
        </div>
        <div className="text-[34px] font-bold leading-[1.05] tracking-tight">{pendingCount}</div>
        <div className="text-[12.5px] text-white/80">items in your queue</div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-xs text-white/60">
          <span>
            {overBudgetCount} over budget · {capexCount} CapEx
          </span>
          {overdueCount > 0 ? (
            <span className="rounded-md bg-[#f0b675]/20 px-1.5 py-0.5 text-[11.5px] font-semibold text-[#f0b675]">
              {overdueCount} overdue
            </span>
          ) : null}
        </div>
      </div>

      <Kpi
        label="Avg. Wait Time"
        dotClass="bg-warn"
        value={
          <>
            {avgWaitDays.toFixed(1)}
            <span className="ml-1 text-lg font-semibold text-muted">days</span>
          </>
        }
        valueClass="text-warn"
        sub="since submission to your step"
        foot="Target: ≤1 day"
        pill={{ text: `+${vsTarget.toFixed(1)} vs target`, tone: "crit" }}
      />

      <Kpi
        label="Over-Budget POs"
        dotClass="bg-crit"
        value={overBudgetCount}
        valueClass="text-crit"
        sub="require justification comment"
        foot={`${formatMoney(overBudgetAmount)} above forecast`}
        pill={{ text: "Review required", tone: "crit" }}
      />

      <Kpi
        label="CapEx Flagged"
        dotClass="bg-capex"
        value={capexCount}
        valueClass="text-capex"
        sub="capital expenditure PO"
        foot={capexPo ? `GL ${glAccount(capexPo)} · $${capexPo.amount.toLocaleString("en-US")}` : "—"}
        pill={{ text: "Corporate route", tone: "capex" }}
      />
    </div>
  );
}

type PillTone = "crit" | "warn" | "capex";

const PILL_TONE: Record<PillTone, string> = {
  crit: "bg-crit-bg text-crit",
  warn: "bg-warn-bg text-warn",
  capex: "bg-capex-bg text-capex",
};

interface KpiProps {
  label: string;
  dotClass: string;
  value: ReactNode;
  valueClass?: string;
  sub: string;
  foot: ReactNode;
  pill: { text: string; tone: PillTone };
}

function Kpi({ label, dotClass, value, valueClass = "text-ink-900", sub, foot, pill }: KpiProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-[14px] border border-hair-2 bg-white p-[18px] pb-4">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-strong">
        <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
        {label}
      </div>
      <div className={`text-[34px] font-bold leading-[1.05] tracking-tight ${valueClass}`}>{value}</div>
      <div className="text-[12.5px] text-muted">{sub}</div>
      <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-xs text-muted-strong">
        <span>{foot}</span>
        <span className={`rounded-md px-1.5 py-0.5 text-[11.5px] font-semibold ${PILL_TONE[pill.tone]}`}>{pill.text}</span>
      </div>
    </div>
  );
}

function Spark() {
  return (
    <svg width="76" height="34" viewBox="0 0 76 34" fill="none" aria-hidden="true">
      <path d="M2 26 L12 20 L22 22 L32 14 L42 16 L52 8 L62 10 L74 6" stroke="#86b6ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 26 L12 20 L22 22 L32 14 L42 16 L52 8 L62 10 L74 6 L74 34 L2 34 Z" fill="#86b6ff" opacity="0.12" />
    </svg>
  );
}
