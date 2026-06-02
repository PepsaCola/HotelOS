import type { ExportsData } from '@/types/exports';
import { fmt } from '../lib/exports';

interface Props {
    data: ExportsData;
}

export function ExportsKpis({ data }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">

            {/* ── Hero — dark card ── */}
            <div className="relative flex flex-col h-full overflow-hidden rounded-[14px] bg-gradient-to-b from-[#101321] to-[#1a1f33] p-4 sm:p-[18px] text-white shadow-sm">
                <div className="absolute right-3.5 top-3.5 opacity-85 z-0">
                    <svg width="76" height="34" viewBox="0 0 76 34" fill="none">
                        <path d="M2 26 L12 22 L20 24 L28 16 L36 18 L46 10 L54 12 L62 6 L74 8"
                              stroke="#a5e0ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 26 L12 22 L20 24 L28 16 L36 18 L46 10 L54 12 L62 6 L74 8 L74 34 L2 34 Z"
                              fill="#a5e0ff" opacity=".12" />
                    </svg>
                </div>

                <div className="relative z-10 text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[.08em] text-white/60">
                    Exported This Period
                </div>
                <div className="relative z-10 mt-1 sm:mt-1.5 text-[32px] sm:text-[34px] font-bold leading-none tracking-tight">
                    {data.totalExported}
                </div>
                <div className="relative z-10 mt-1 text-[12px] sm:text-[12.5px] text-white/60">
                    invoices · {fmt(data.totalAmount)} total
                </div>

                <div className="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 text-[11.5px] sm:text-[12px] text-white/60">
                    <span>{data.period}</span>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-400/20 px-1.5 py-0.5 text-[11px] sm:text-[11.5px] font-semibold text-emerald-200">
                        ↑ 12%
                    </span>
                </div>
            </div>

            {/* ── Success rate ── */}
            <div className="relative flex flex-col h-full overflow-hidden rounded-[14px] border border-hair-2 bg-white p-4 sm:p-[18px] shadow-sm sm:shadow-none">
                <div className="text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[.08em] text-muted">
                    Export Success Rate
                </div>
                <div className="mt-1 sm:mt-1.5 text-[32px] sm:text-[34px] font-bold leading-none tracking-tight text-ink-900">
                    {data.successRate}%
                </div>
                <div className="mt-1 text-[12px] sm:text-[12.5px] text-muted">
                    {data.successOf} of {data.totalExported} sent to M3
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 text-[11.5px] sm:text-[12px] text-muted">
                    <span>This period</span>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-good-bg px-1.5 py-0.5 text-[11px] sm:text-[11.5px] font-semibold text-good">
                        ↑ 2% vs Mar
                    </span>
                </div>
            </div>

            {/* ── Failed ── */}
            <div className="relative flex flex-col h-full overflow-hidden rounded-[14px] border border-hair-2 bg-white p-4 sm:p-[18px] shadow-sm sm:shadow-none">
                <div className="text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[.08em] text-muted">
                    Failed Exports
                </div>
                <div className="mt-1 sm:mt-1.5 text-[32px] sm:text-[34px] font-bold leading-none tracking-tight text-crit">
                    {data.failedCount}
                </div>
                <div className="mt-1 text-[12px] sm:text-[12.5px] text-muted">
                    retry available · {fmt(data.failedAmount)}
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 text-[11.5px] sm:text-[12px] text-muted">
                    <span>Current period</span>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-crit-bg px-1.5 py-0.5 text-[11px] sm:text-[11.5px] font-semibold text-crit">
                        Action needed
                    </span>
                </div>
            </div>

            {/* ── Next auto-export ── */}
            <div className="relative flex flex-col h-full rounded-[14px] border border-hair-2 bg-white p-4 sm:p-[18px] shadow-sm sm:shadow-none">
                <div className="text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[.08em] text-muted">
                    Next Auto-Export
                </div>
                <div className="mt-1 sm:mt-1.5 text-[20px] sm:text-[22px] font-bold leading-none tracking-tight text-ink-900">
                    {data.nextAutoExport}
                </div>
                <div className="mt-1 text-[12px] sm:text-[12.5px] text-muted">
                    {data.nextAutoExportSub}
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 text-[11.5px] sm:text-[12px] text-muted">
                    <span className="truncate">M3 PROD · GL batch</span>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-neutral-bg px-1.5 py-0.5 text-[11px] sm:text-[11.5px] font-semibold text-neutral-ink">
                        Scheduled
                    </span>
                </div>
            </div>

        </div>
    );
}