import type { ReactNode } from "react";
import { TrendUpIcon, TrendDownIcon } from "@/components/ui/icons";
import { fmtCompact } from "@/lib/money";
import { Sparkline } from "./Sparkline";

interface POKpiStripProps {
  monthBudget: number;
  spentToDate: number;
  fixedTotal: number;
  fixedCount: number;
  openTotal: number;
  openCount: number;
  overdueCount: number;
  receivedTotal: number;
  receivedCount: number;
}

export function POKpiStrip(props: POKpiStripProps) {
  const {
    monthBudget,
    spentToDate,
    fixedTotal,
    fixedCount,
    openTotal,
    openCount,
    overdueCount,
    receivedTotal,
    receivedCount,
  } = props;

  const remaining = monthBudget - spentToDate;
  const pctConsumed = (spentToDate / monthBudget) * 100;
  const avgReceived = fmtCompact(receivedTotal / Math.max(1, receivedCount));

  return (
    <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2 xl:grid-cols-4">
      {/* Hero — available budget */}
      <div className="relative flex flex-col gap-1.5 overflow-hidden rounded-[14px] border border-[#0d101a] bg-gradient-to-b from-[#101321] to-[#1a1f33] p-[18px] pb-4 text-white">
        <div className="absolute right-3.5 top-3.5 opacity-85">
          <Sparkline color="#86b6ff" />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7ce0a3]" />
          Available Budget
        </div>
        <div className="flex items-baseline gap-1.5 text-[34px] font-bold leading-[1.05] tracking-tight text-white">
          ${(remaining / 1000).toFixed(1)}
          <span className="text-[18px] font-semibold text-white/50">k</span>
        </div>
        <div className="text-[12.5px] text-white/80">of ${(monthBudget / 1000).toFixed(0)}k allocated for April</div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/12">
          <span className="block h-full rounded-full bg-gradient-to-r from-[#a5e0ff] to-[#5a8bff]" style={{ width: `${pctConsumed}%` }} />
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1 text-xs text-white/60">
          <span>{pctConsumed.toFixed(1)}% consumed</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-[#7ce0a3]/20 px-1.5 py-0.5 text-[11.5px] font-semibold text-[#7ce0a3]">
            <TrendDownIcon className="h-3.5 w-3.5" /> 4.2% vs Mar
          </span>
        </div>
      </div>

      <Kpi
        label="Fixed POs (monthly recurring)"
        value={fixedTotal}
        sub={`${fixedCount} contracts · auto-issued Apr 1`}
        bar={(fixedTotal / spentToDate) * 100}
        foot={<span>{((fixedTotal / spentToDate) * 100).toFixed(1)}% of spend</span>}
        trend={<TrendPill tone="flat">↔ flat</TrendPill>}
      />

      <Kpi
        label="Open / Pending"
        value={openTotal}
        sub={`${openCount} awaiting receipt · ${overdueCount} overdue`}
        sparkColor="#f0b675"
        dotColor="#e8a23c"
        foot={
          <span className={overdueCount ? "text-crit" : "text-muted-strong"}>
            {overdueCount} overdue · action needed
          </span>
        }
        trend={
          <TrendPill tone="up">
            <TrendUpIcon className="h-3.5 w-3.5" /> 12%
          </TrendPill>
        }
      />

      <Kpi
        label="Received this month"
        value={receivedTotal}
        sub={`${receivedCount} POs · invoiced to GL`}
        sparkColor="#7fc99a"
        dotColor="#34a86b"
        foot={<span>Avg PO {avgReceived.whole}{avgReceived.unit}</span>}
        trend={
          <TrendPill tone="up">
            <TrendUpIcon className="h-3.5 w-3.5" /> 8.5%
          </TrendPill>
        }
      />
    </div>
  );
}

interface KpiProps {
  label: string;
  value: number;
  sub?: string;
  bar?: number;
  foot?: ReactNode;
  trend?: ReactNode;
  dotColor?: string;
  sparkColor?: string;
}

function Kpi({ label, value, sub, bar, foot, trend, dotColor, sparkColor }: KpiProps) {
  const compact = fmtCompact(value);
  return (
    <div className="relative flex flex-col gap-1.5 overflow-hidden rounded-[14px] border border-hair-2 bg-white p-[18px] pb-4">
      <div className="absolute right-3.5 top-3.5 opacity-85">
        <Sparkline color={sparkColor ?? "#cbd2da"} />
      </div>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-strong">
        {dotColor ? <span className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} /> : null}
        {label}
      </div>
      <div className="flex items-baseline gap-1.5 text-[34px] font-bold leading-[1.05] tracking-tight text-[#0c1320]">
        {compact.whole}
        <span className="text-[18px] font-semibold text-[#9aa0a8]">{compact.unit}</span>
      </div>
      {sub ? <div className="flex items-center gap-2 text-[12.5px] text-[#9aa0a8]">{sub}</div> : null}
      {bar != null ? (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#ecedf0]">
          <span className="block h-full rounded-full bg-gradient-to-r from-[#76e2a2] to-[#34a86b]" style={{ width: `${Math.min(100, bar)}%` }} />
        </div>
      ) : null}
      {foot ? (
        <div className="mt-auto flex items-center justify-between gap-2 pt-1 text-xs text-muted-strong">
          {foot}
          {trend}
        </div>
      ) : null}
    </div>
  );
}

function TrendPill({ tone, children }: { tone: "up" | "down" | "flat"; children: ReactNode }) {
  const toneClass =
    tone === "up"
      ? "bg-[#dff3e6] text-[#0a6a3a]"
      : tone === "down"
        ? "bg-[#fae3dc] text-[#a8341a]"
        : "bg-neutral-bg text-neutral-ink";
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11.5px] font-semibold ${toneClass}`}>
      {children}
    </span>
  );
}
