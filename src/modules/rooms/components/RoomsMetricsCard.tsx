import type { MetricRow } from '@/types/rooms';

interface Props {
    rows: MetricRow[];
}

export function RoomsMetricsCard({ rows }: Props) {
    return (
        <div className="overflow-hidden flex flex-col w-full rounded-xl border border-hair-2 bg-white shadow-soft">
            {/* Head */}
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-hair px-3 py-2.5 sm:px-3.5 sm:py-3">
                <span className="text-[12px] sm:text-[13px] font-bold tracking-[-0.005em] text-ink-900">
                    Rooms metrics
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-muted">
                    Hatch vs Budget
                </span>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
                <table className="w-full border-collapse tabular-nums min-w-[280px]">
                    <thead>
                    <tr className="border-b border-hair">
                        <th className="py-1.5 sm:py-2 pl-3 sm:pl-3.5 pr-2 text-left text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-muted">
                            {/* Порожній заголовок для першої колонки */}
                        </th>
                        <th className="bg-[#fafaf6] py-1.5 sm:py-2 px-2 sm:px-3 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-muted">
                            Hatch
                        </th>
                        <th className="bg-[#f3f5fb] py-1.5 sm:py-2 pr-3 sm:pr-3.5 pl-2 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-muted">
                            Budget
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((r, i) => (
                        <tr key={i} className="border-b border-hair last:border-0 hover:bg-[#fafbfc] transition-colors">
                            {/* Label */}
                            <td className="py-2 pl-3 sm:pl-3.5 pr-2 text-[11.5px] sm:text-[12.5px] font-semibold whitespace-nowrap text-ink-700 max-w-[140px] sm:max-w-none truncate sm:whitespace-nowrap">
                                <span title={r.label}>{r.label}</span>
                            </td>

                            {/* Hatch */}
                            <td className={`bg-[#fafaf6]/50 py-2 px-2 sm:px-3 text-right text-[13.5px] sm:text-[14.5px] font-bold tracking-[-0.012em] whitespace-nowrap ${
                                r.hatchDir === 'up'   ? 'text-good' :
                                    r.hatchDir === 'down' ? 'text-crit' : 'text-[#0c1320]'
                            }`}>
                                {r.hatch}
                            </td>

                            {/* Budget */}
                            <td className="bg-[#f3f5fb]/55 py-2 pr-3 sm:pr-3.5 pl-2 text-right text-[13.5px] sm:text-[14.5px] font-semibold tracking-[-0.012em] whitespace-nowrap text-muted">
                                {r.budget}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}