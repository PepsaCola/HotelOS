import type { ReceivingKpi } from "@/types/receiving";

interface ReceivingKpisProps {
    kpi: ReceivingKpi;
}

const fmt = (v: number) => "$" + Math.round(v).toLocaleString("en-US");

const BAR_FILL: Record<string, string> = {
    blue:  "linear-gradient(90deg,#a5e0ff,#5a8bff)",
    warn:  "linear-gradient(90deg,#f5c26b,#e8920a)",
    crit:  "linear-gradient(90deg,#f78080,#c93a3a)",
    good:  "linear-gradient(90deg,#76e2a2,#34a86b)",
};

export function ReceivingKpis({ kpi }: ReceivingKpisProps) {
    return (
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2 xl:grid-cols-4">

            {/* Hero — Awaiting Receipt */}
            <div className="relative flex flex-col gap-1.5 overflow-hidden rounded-[14px] border border-[#0d101a] bg-gradient-to-b from-[#101321] to-[#1a1f33] p-[18px] pb-4 text-white">
                <div className="absolute right-3.5 top-3.5 opacity-85">
                    <SparkBlue />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7ce0a3]" />
                    Awaiting Receipt
                </div>
                <div className="text-[34px] font-bold leading-[1.05] tracking-tight">{kpi.awaiting}</div>
                <div className="text-[12.5px] text-white/80">{fmt(kpi.awaitingValue)} expected value</div>
                <KpiBar pct={62} color="blue" />
                <div className="mt-auto flex items-center justify-between gap-2 pt-1 text-xs text-white/60">
                    <span>{kpi.awaitingDueThisWeek} due this week</span>
                    <TrendPill tone="up" label="+3 vs Mar" dark />
                </div>
            </div>

            <Kpi
                label="Partial Deliveries"
                dotClass="bg-warn"
                value={kpi.partial}
                valueClass="text-warn"
                sub="awaiting remaining lines"
                barPct={42}
                barColor="warn"
                foot={`${fmt(kpi.partialRemaining)} remaining`}
                trend={{ tone: "flat", label: "42% complete" }}
            />

            <Kpi
                label="Overdue"
                dotClass="bg-crit"
                value={kpi.overdue}
                valueClass="text-crit"
                sub="past expected delivery"
                barPct={18}
                barColor="crit"
                foot={kpi.overdueValue}
                trend={{ tone: "down", label: "Action needed" }}
            />

            <Kpi
                label="Received This Month"
                dotClass="bg-good"
                value={kpi.received}
                valueClass="text-ink-900"
                sub={`${fmt(kpi.receivedValue)} value`}
                barPct={78}
                barColor="good"
                foot={`${kpi.overReceivedCount} over-received`}
                trend={{ tone: "up", label: "+12 vs Mar" }}
            />
        </div>
    );
}

// ── Sub-components ─────────────────────────────────────────────────────────

interface KpiProps {
    label: string;
    dotClass: string;
    value: number;
    valueClass?: string;
    sub: string;
    barPct: number;
    barColor: string;
    foot: string;
    trend: { tone: "up" | "down" | "flat"; label: string };
}

function Kpi({ label, dotClass, value, valueClass = "text-ink-900", sub, barPct, barColor, foot, trend }: KpiProps) {
    return (
        <div className="flex flex-col gap-1.5 rounded-[14px] border border-hair-2 bg-white p-[18px] pb-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-strong">
                <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
                {label}
            </div>
            <div className={`text-[34px] font-bold leading-[1.05] tracking-tight ${valueClass}`}>{value}</div>
            <div className="text-[12.5px] text-muted">{sub}</div>
            <KpiBar pct={barPct} color={barColor} />
            <div className="mt-auto flex items-center justify-between gap-2 pt-1 text-xs text-muted-strong">
                <span>{foot}</span>
                <TrendPill tone={trend.tone} label={trend.label} />
            </div>
        </div>
    );
}

function KpiBar({ pct, color }: { pct: number; color: string }) {
    return (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-soft">
            <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: BAR_FILL[color] ?? BAR_FILL.blue }}
            />
        </div>
    );
}

type TrendTone = "up" | "down" | "flat";

const TREND_CLASS: Record<TrendTone, string> = {
    up:   "bg-[#dff3e6] text-[#0a6a3a]",
    down: "bg-crit-bg text-crit",
    flat: "bg-surface-chip text-ink-700",
};

const TREND_CLASS_DARK: Record<TrendTone, string> = {
    up:   "bg-[rgba(124,224,163,.18)] text-[#7ce0a3]",
    down: "bg-crit-bg/20 text-[#f78080]",
    flat: "bg-white/10 text-white/70",
};

function TrendPill({ tone, label, dark = false }: { tone: TrendTone; label: string; dark?: boolean }) {
    const cls = dark ? TREND_CLASS_DARK[tone] : TREND_CLASS[tone];
    return (
        <span className={`rounded-md px-1.5 py-0.5 text-[11.5px] font-semibold ${cls}`}>{label}</span>
    );
}

function SparkBlue() {
    return (
        <svg width="76" height="34" viewBox="0 0 76 34" fill="none" aria-hidden="true">
            <path d="M2 26 L12 22 L20 24 L28 16 L36 18 L46 10 L54 12 L62 6 L74 8" stroke="#86b6ff" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M2 26 L12 22 L20 24 L28 16 L36 18 L46 10 L54 12 L62 6 L74 8 L74 34 L2 34 Z" fill="#86b6ff" opacity="0.12" />
        </svg>
    );
}