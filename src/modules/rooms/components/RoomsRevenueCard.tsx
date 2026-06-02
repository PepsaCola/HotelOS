import type { RevenueRow } from '@/types/rooms';
import { fmtUSD, fmtRevVariance } from '../lib/rooms';

interface Props {
    rows: RevenueRow[];
}

export function RoomsRevenueCard({ rows }: Props) {
    return (
        <div className="overflow-hidden flex flex-col w-full rounded-xl border border-hair-2 bg-white shadow-soft">
            {/* Head */}
            <div className="flex items-baseline justify-between gap-2 border-b border-hair px-3 py-2.5 sm:px-3.5 sm:py-3">
                <span className="text-[12px] sm:text-[13px] font-bold tracking-[-0.005em] text-ink-900">
                    Revenue &amp; expense summary
                </span>
                <span className="hidden text-[10px] font-medium text-muted sm:block sm:text-[11px]">
                    Hatch · Budget · +/− by segment
                </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
                <table className="w-full border-collapse tabular-nums text-left min-w-[500px]">
                    <thead>
                    <tr className="border-b border-hair">
                        <th className="py-1.5 sm:py-2 pl-3 sm:pl-3.5 pr-2 text-left text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-muted min-w-[120px] sm:min-w-[140px]" />
                        <th className="bg-[#fafaf6] py-1.5 sm:py-2 px-2 sm:px-3 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-muted min-w-[80px] sm:min-w-[90px]">
                            Hatch
                        </th>
                        <th className="bg-[#f3f5fb] py-1.5 sm:py-2 px-2 sm:px-3 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-muted min-w-[80px] sm:min-w-[90px]">
                            Budget
                        </th>
                        <th className="bg-[#fbf4d8] py-1.5 sm:py-2 px-2 sm:px-3 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-[#6b5b15] min-w-[70px] sm:min-w-[80px]">
                            +/−
                        </th>
                        <th className="py-1.5 sm:py-2 pl-2 sm:pl-3 pr-3 sm:pr-3.5 text-left text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-muted min-w-[140px] sm:min-w-[160px]">
                            Direction
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((r, i) => {
                        const isTotal   = r.isTotal;
                        const isExpense = r.isExpense;

                        return (
                            <tr
                                key={i}
                                className={`border-b border-hair last:border-0 hover:bg-[#fafbfc] transition-colors ${
                                    isTotal || isExpense ? 'bg-[#fafbfc]' : ''
                                }`}
                            >
                                {/* Label */}
                                <td
                                    className={`py-2 pl-3 sm:pl-3.5 pr-2 whitespace-nowrap truncate max-w-[140px] sm:max-w-none ${
                                        isTotal   ? 'text-[10px] sm:text-[10.5px] font-[800] uppercase tracking-[.05em] text-ink-900' :
                                            isExpense ? 'text-[11.5px] sm:text-[12.5px] font-semibold text-[#6b3b3b]' :
                                                'text-[11.5px] sm:text-[12.5px] font-semibold text-ink-700'
                                    }`}
                                    title={r.label}
                                >
                                    {r.label}
                                </td>

                                {/* Hatch */}
                                <td className={`bg-[#fafaf6]/50 py-2 px-2 sm:px-3 text-right whitespace-nowrap font-bold tracking-[-0.012em] text-[#0c1320] ${
                                    isTotal ? 'text-[14.5px] sm:text-[16px]' : 'text-[13px] sm:text-[14px]'
                                }`}>
                                    {fmtUSD(r.hatch)}
                                </td>

                                {/* Budget */}
                                <td className={`bg-[#f3f5fb]/55 py-2 px-2 sm:px-3 text-right whitespace-nowrap font-semibold tracking-[-0.012em] text-muted ${
                                    isTotal ? 'text-[14.5px] sm:text-[16px]' : 'text-[13px] sm:text-[14px]'
                                }`}>
                                    {fmtUSD(r.budget)}
                                </td>

                                {/* Variance */}
                                <td className={`bg-[#fbf4d8]/45 py-2 px-2 sm:px-3 text-right whitespace-nowrap font-bold ${
                                    isTotal ? 'text-[12px] sm:text-[13px]' : 'text-[11.5px] sm:text-[12.5px]'
                                } ${
                                    r.dir === 'pos' ? 'text-good' :
                                        r.dir === 'neg' ? 'text-crit' : 'text-muted'
                                }`}>
                                    {fmtRevVariance(r.variance)}
                                </td>

                                {/* Direction */}
                                <td className={`py-2 pl-2 sm:pl-3 pr-3 sm:pr-3.5 text-[11px] sm:text-[12px] font-medium whitespace-nowrap overflow-hidden text-ellipsis ${
                                    isExpense ? 'text-crit' : 'text-muted'
                                }`}>
                                        <span className={`mr-1 text-[9px] sm:text-[10px] font-bold ${
                                            r.dir === 'pos' ? 'text-good' :
                                                r.dir === 'neg' ? 'text-crit' : 'text-muted'
                                        }`}>
                                            {r.dir === 'pos' ? '▲' : r.dir === 'neg' ? '▼' : '—'}
                                        </span>
                                    {r.dir === 'pos'  ? 'Increase in revenue' :
                                        isExpense        ? 'Increase in expense' :
                                            'Decrease in revenue'}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}