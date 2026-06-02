import type { InvoicesKpi } from "@/types/invoices";

interface InvoicesKpisProps {
    kpi: InvoicesKpi;
}

const fmt = (v: number) =>
    "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function InvoicesKpis({ kpi }: InvoicesKpisProps) {
    return (
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2 xl:grid-cols-4">
            <Kpi
                label="Received This Period"
                value={kpi.receivedCount}
                unit="invoices"
                sub={`${fmt(kpi.receivedValue)} face value`}
                spark={<SparkNeutral />}
            />
            <Kpi
                label="In Intake"
                value={kpi.intakeCount}
                sub={`${kpi.intakeExtracting} extracting · ${kpi.intakeQueued} queued`}
                spark={<SparkNeutral />}
            />
            <Kpi
                label="Awaiting Match"
                value={kpi.awaitingMatchCount}
                valueClass="text-warn"
                sub={`${kpi.awaitingAttentionCount} require your attention`}
                spark={<SparkWarn />}
                tinted="warn"
            />
            <Kpi
                label="Exceptions"
                value={kpi.exceptionsCount}
                valueClass="text-crit"
                sub={`${fmt(kpi.exceptionsValue)} disputed`}
                spark={<SparkCrit />}
                tinted="crit"
            />
        </div>
    );
}

// ── Sub-components ─────────────────────────────────────────────────────────

interface KpiProps {
    label: string;
    value: number;
    unit?: string;
    valueClass?: string;
    sub: string;
    spark: React.ReactNode;
    tinted?: "warn" | "crit";
}

const TINT: Record<string, string> = {
    warn: "border-warn-bg",
    crit: "border-crit-bg",
};

function Kpi({ label, value, unit, valueClass = "text-ink-900", sub, spark, tinted }: KpiProps) {
    return (
        <div className={`relative flex flex-col gap-1.5 overflow-hidden rounded-[14px] border bg-white p-[18px] pb-4 ${tinted ? TINT[tinted] : "border-hair-2"}`}>
            <div className="absolute right-3.5 top-3.5 opacity-85">{spark}</div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-strong">
                {label}
            </div>
            <div className={`flex items-baseline gap-1.5 text-[34px] font-bold leading-[1.05] tracking-tight ${valueClass}`}>
                {value}
                {unit && <span className="text-lg font-semibold text-muted">{unit}</span>}
            </div>
            <div className="text-[12.5px] text-muted">{sub}</div>
        </div>
    );
}

function SparkNeutral() {
    return (
        <svg width="76" height="34" viewBox="0 0 76 34" fill="none" aria-hidden="true">
            <path d="M2 26 L12 20 L22 22 L32 16 L44 18 L54 12 L62 14 L74 10" stroke="#cbd2da" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 26 L12 20 L22 22 L32 16 L44 18 L54 12 L62 14 L74 10 L74 34 L2 34 Z" fill="#cbd2da" opacity="0.12" />
        </svg>
    );
}

function SparkWarn() {
    return (
        <svg width="76" height="34" viewBox="0 0 76 34" fill="none" aria-hidden="true">
            <path d="M2 20 L15 16 L28 18 L40 12 L52 14 L64 8 L74 10" stroke="#e8a040" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 20 L15 16 L28 18 L40 12 L52 14 L64 8 L74 10 L74 34 L2 34 Z" fill="#e8a040" opacity="0.1" />
        </svg>
    );
}

function SparkCrit() {
    return (
        <svg width="76" height="34" viewBox="0 0 76 34" fill="none" aria-hidden="true">
            <path d="M2 22 L15 18 L28 20 L40 14 L52 16 L64 10 L74 12" stroke="#e08080" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 22 L15 18 L28 20 L40 14 L52 16 L64 10 L74 12 L74 34 L2 34 Z" fill="#e08080" opacity="0.1" />
        </svg>
    );
}