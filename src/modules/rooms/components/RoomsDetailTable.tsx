'use client';

import type { ExpenseRow, RoomsFooter } from '@/types/rooms';
import {
    fmtUSD, fmtSplit, fmtWeekVal, fmtPct, fmtPerNight,
    fmtVariance, varianceDir, filterExpenses, countZero,
} from '../lib/rooms';

/* ─── Display options ────────────────────────────────────────── */
export interface RoomsDisplayOpts {
    density:              'comfortable' | 'compact';
    showWeeklyBreakdown:  boolean;   // Fixed + W1-W5 columns
    showPercentRevenue:   boolean;   // % columns after Total / Budget / Adjusted
    showPerNight:         boolean;   // $/Night column
    showCents:            boolean;   // e.g. $2,641.80 vs $2,641
    showZeroActivity:     boolean;   // show rows where all values = 0
}

export const DEFAULT_ROOMS_DISPLAY_OPTS: RoomsDisplayOpts = {
    density:             'comfortable',
    showWeeklyBreakdown: true,
    showPercentRevenue:  true,
    showPerNight:        true,
    showCents:           true,
    showZeroActivity:    false,
};

function resolveOpts(partial?: Partial<RoomsDisplayOpts>): RoomsDisplayOpts {
    return { ...DEFAULT_ROOMS_DISPLAY_OPTS, ...partial };
}

/* ─── Props ──────────────────────────────────────────────────── */
interface Props {
    rows:                 ExpenseRow[];
    period:               string;
    footer:               RoomsFooter;
    displayOpts?:         Partial<RoomsDisplayOpts>;
    onToggleZeroActivity?: () => void;
}

/* ─── Helpers ────────────────────────────────────────────────── */
function FooterUSD(n: number): string {
    if (n === 0) return '$(0.00)';
    const abs = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return n < 0 ? `$(${abs})` : `$${abs}`;
}

/* ─── Row ────────────────────────────────────────────────────── */
function TableRow({ row, opts }: { row: ExpenseRow; opts: RoomsDisplayOpts }) {
    const isZero = !!row.isZero;
    const isSub  = !!row.isSubtotal;
    const varDir = varianceDir(row.variance);
    const wkVals = [row.fixed, row.w1, row.w2, row.w3, row.w4, row.w5];
    const py     = opts.density === 'compact' ? 'py-1' : 'py-2';

    function Money({ value }: { value: number }) {
        if (opts.showCents) {
            const { whole, cents } = fmtSplit(value);
            return <>{whole}<span className="text-[10px] sm:text-[11.5px] font-medium text-muted">{cents}</span></>;
        }
        return <>{fmtUSD(value)}</>;
    }

    const trCls   = isSub ? 'border-t-2 border-t-ink-900 bg-[#f5f6f9]' : 'group border-b border-hair last:border-0 hover:bg-[#fafbfc]';
    const bgStick = isSub ? 'bg-[#f5f6f9]' : 'bg-white group-hover:bg-[#fafbfc]';

    return (
        <tr className={trCls}>
            {/* Category */}
            <td className={`sticky left-0 z-10 border-r border-hair px-2 sm:px-3 ${py} align-middle ${bgStick} min-w-[130px] max-w-[130px] sm:min-w-[200px] sm:max-w-[200px] shadow-[4px_0_4px_-4px_rgba(0,0,0,.08)] sm:shadow-none ${
                isSub  ? 'text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[.05em] text-ink-900' :
                    isZero ? 'text-[11.5px] sm:text-[12.5px] font-medium text-muted truncate' :
                        'text-[11.5px] sm:text-[12.5px] font-semibold text-ink-900 truncate'
            }`}>
                <span title={row.name}>{row.name}</span>
            </td>

            {/* Code */}
            <td className={`static sm:sticky sm:left-[200px] z-[5] sm:z-10 border-r border-hair-2 px-2 sm:px-2.5 ${py} align-middle ${bgStick} min-w-[80px] sm:min-w-[106px] sm:shadow-[4px_0_4px_-4px_rgba(0,0,0,.08)] ${
                isZero ? 'text-[10px] sm:text-[11px] text-[#9aa0a8]' : 'text-[10px] sm:text-[11px] font-medium text-muted'
            }`}>
                {row.code}
            </td>

            {/* Weekly breakdown */}
            {opts.showWeeklyBreakdown && wkVals.map((v, wi) => (
                <td key={wi} className={`px-2 sm:px-2.5 ${py} text-right text-[11px] sm:text-[12px] align-middle whitespace-nowrap min-w-[70px] sm:min-w-[84px] ${
                    v === null ? 'text-[#9aa0a8]' : isSub ? 'font-bold text-ink-700' : 'font-medium text-ink-700'
                }`}>
                    {fmtWeekVal(v)}
                </td>
            ))}

            {/* Total */}
            <td className={`bg-[#efeed8]/35 px-2 sm:px-2.5 ${py} text-right align-middle whitespace-nowrap tracking-[-0.01em] min-w-[90px] sm:min-w-[108px] ${
                isSub ? 'text-[13.5px] sm:text-[15px] font-bold text-[#0c1320]' :
                    isZero ? 'text-[12px] sm:text-[13.5px] font-medium text-[#9aa0a8]' :
                        'text-[12px] sm:text-[13.5px] font-bold text-[#0c1320]'
            }`}>
                <Money value={row.total} />
            </td>
            {opts.showPercentRevenue && (
                <td className={`px-2 sm:px-2.5 ${py} text-right text-[10.5px] sm:text-[11.5px] align-middle whitespace-nowrap min-w-[50px] sm:min-w-[60px] ${isZero ? 'text-[#9aa0a8]' : 'font-semibold text-muted'}`}>
                    {fmtPct(row.totalPct)}
                </td>
            )}

            {/* Budget */}
            <td className={`bg-[#ebeff8]/35 px-2 sm:px-2.5 ${py} text-right align-middle whitespace-nowrap tracking-[-0.01em] min-w-[90px] sm:min-w-[108px] ${
                isZero ? 'text-[12px] sm:text-[13.5px] font-medium text-[#9aa0a8]' : 'text-[12px] sm:text-[13.5px] font-semibold text-ink-700'
            }`}>
                <Money value={row.budget} />
            </td>
            {opts.showPercentRevenue && (
                <td className={`px-2 sm:px-2.5 ${py} text-right text-[10.5px] sm:text-[11.5px] align-middle whitespace-nowrap min-w-[50px] sm:min-w-[60px] ${isZero ? 'text-[#9aa0a8]' : 'font-semibold text-muted'}`}>
                    {fmtPct(row.budgetPct)}
                </td>
            )}

            {/* $/Night */}
            {opts.showPerNight && (
                <td className={`px-2 sm:px-2.5 ${py} text-right text-[10.5px] sm:text-[11.5px] align-middle whitespace-nowrap min-w-[66px] sm:min-w-[76px] ${isZero ? 'text-[#9aa0a8]' : 'font-medium text-muted'}`}>
                    {fmtPerNight(row.perNight)}
                </td>
            )}

            {/* Variance */}
            <td className={`bg-[#fbf4d8]/35 px-2 sm:px-2.5 ${py} text-right align-middle whitespace-nowrap font-bold min-w-[90px] sm:min-w-[108px] ${isSub ? 'text-[12px] sm:text-[13px]' : 'text-[11px] sm:text-[12px]'} ${
                varDir === 'pos' ? 'text-good' : varDir === 'neg' ? 'text-crit' : 'text-[#9aa0a8]'
            }`}>
                {fmtVariance(row.variance)}
            </td>

            {/* Adjusted */}
            <td className={`bg-[#ebeff8]/35 px-2 sm:px-2.5 ${py} text-right align-middle whitespace-nowrap tracking-[-0.01em] min-w-[90px] sm:min-w-[108px] ${
                isZero ? 'text-[12px] sm:text-[13.5px] font-medium text-[#9aa0a8]' : 'text-[12px] sm:text-[13.5px] font-semibold text-ink-700'
            }`}>
                <Money value={row.adjusted} />
            </td>
            {opts.showPercentRevenue && (
                <td className={`px-2 sm:px-2.5 ${py} text-right text-[10.5px] sm:text-[11.5px] align-middle whitespace-nowrap min-w-[50px] sm:min-w-[60px] ${isZero ? 'text-[#9aa0a8]' : 'font-semibold text-muted'}`}>
                    {fmtPct(row.adjustedPct)}
                </td>
            )}
        </tr>
    );
}

/* ─── Table ──────────────────────────────────────────────────── */
export function RoomsDetailTable({ rows, period, footer, displayOpts, onToggleZeroActivity }: Props) {
    const opts      = resolveOpts(displayOpts);
    const hideZero  = !opts.showZeroActivity;
    const zeroCount = countZero(rows);
    const visible   = filterExpenses(rows, hideZero);

    return (
        <div className="overflow-hidden rounded-xl border border-hair-2 bg-white shadow-soft flex flex-col w-full">

            {/* Head */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hair px-3 sm:px-4 py-3">
                <div>
                    <h2 className="text-[14px] sm:text-[15px] font-bold tracking-[-0.005em] text-ink-900">
                        Expense detail · by A/C line
                    </h2>
                    <p className="mt-0.5 text-[11px] sm:text-[12px] font-medium text-muted">
                        {period} · <b className="font-semibold text-ink-700">{rows.filter(r => !r.isSubtotal).length}</b> GL lines
                        <span className="inline-block mt-1 sm:mt-0 sm:inline sm:ml-1 text-ink-500">
                            (Scroll horizontally to view) 👉
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={onToggleZeroActivity}
                        className={`flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition ${
                            hideZero
                                ? 'border-[#1a2540] bg-[#1a2540] text-white'
                                : 'border-hair-2 bg-white text-ink-700 hover:bg-surface-soft'
                        }`}
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12l5 5L20 7" />
                        </svg>
                        <span className="hidden sm:inline">Hide zero-activity</span>
                        <span className="sm:hidden">Hide Zeros</span>
                        <span>({zeroCount})</span>
                    </button>
                    <button className="flex-none inline-flex items-center justify-center gap-1.5 rounded-lg border border-hair-2 bg-white px-3 py-2 text-[12px] font-medium text-ink-700 transition hover:bg-surface-soft">
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
                        </svg>
                        <span className="hidden sm:inline">Download CSV</span>
                        <span className="sm:hidden">CSV</span>
                    </button>
                </div>
            </div>

            {/* Scrollable table */}
            <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
                <table className="w-full border-collapse tabular-nums text-left">
                    <thead>
                    <tr className="border-b border-hair bg-[#fafafa]">
                        {/* Sticky cols */}
                        <th className="sticky left-0 z-20 border-r border-hair bg-[#fafafa] px-2 py-2 sm:px-3 text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-muted whitespace-nowrap min-w-[130px] sm:min-w-[200px] shadow-[4px_0_4px_-4px_rgba(0,0,0,.08)] sm:shadow-none">Category</th>
                        <th className="static sm:sticky sm:left-[200px] z-10 border-r border-hair-2 bg-[#fafafa] px-2 sm:px-2.5 py-2 text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-muted whitespace-nowrap min-w-[80px] sm:min-w-[106px] sm:shadow-[4px_0_4px_-4px_rgba(0,0,0,.08)]">Code</th>

                        {/* Weekly */}
                        {opts.showWeeklyBreakdown && <>
                            <th className="bg-[#f4f3eb] px-2 sm:px-2.5 py-2 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-muted whitespace-nowrap min-w-[70px] sm:min-w-[84px]">Fixed</th>
                            <th className="bg-[#f4f3eb] px-2 sm:px-2.5 py-2 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-muted whitespace-nowrap min-w-[70px] sm:min-w-[84px]">W1</th>
                            <th className="bg-[#f4f3eb] px-2 sm:px-2.5 py-2 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-muted whitespace-nowrap min-w-[70px] sm:min-w-[84px]">W2</th>
                            <th className="bg-[#f4f3eb] px-2 sm:px-2.5 py-2 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-muted whitespace-nowrap min-w-[70px] sm:min-w-[84px]">W3</th>
                            <th className="bg-[#f4f3eb] px-2 sm:px-2.5 py-2 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-muted whitespace-nowrap min-w-[70px] sm:min-w-[84px]">W4</th>
                            <th className="bg-[#f4f3eb] px-2 sm:px-2.5 py-2 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-muted whitespace-nowrap min-w-[70px] sm:min-w-[84px]">W5</th>
                        </>}

                        {/* Total */}
                        <th className="bg-[#efeed8] px-2 sm:px-2.5 py-2 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-[#5d5b2a] whitespace-nowrap min-w-[90px] sm:min-w-[108px]">Total</th>
                        {opts.showPercentRevenue && <th className="bg-[#efeed8] px-2 sm:px-2.5 py-2 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-[#5d5b2a] whitespace-nowrap min-w-[50px] sm:min-w-[60px]">%</th>}

                        {/* Budget */}
                        <th className="bg-[#ebeff8] px-2 sm:px-2.5 py-2 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-[#2e3d5e] whitespace-nowrap min-w-[90px] sm:min-w-[108px]">Budget</th>
                        {opts.showPercentRevenue && <th className="bg-[#ebeff8] px-2 sm:px-2.5 py-2 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-[#2e3d5e] whitespace-nowrap min-w-[50px] sm:min-w-[60px]">%</th>}

                        {/* $/Night */}
                        {opts.showPerNight && <th className="bg-[#fbf4d8] px-2 sm:px-2.5 py-2 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-[#6b5b15] whitespace-nowrap min-w-[66px] sm:min-w-[76px]">$/Night</th>}

                        {/* Variance */}
                        <th className="bg-[#fbf4d8] px-2 sm:px-2.5 py-2 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-[#6b5b15] whitespace-nowrap min-w-[90px] sm:min-w-[108px]">Variance</th>

                        {/* Adjusted */}
                        <th className="bg-[#ebeff8] px-2 sm:px-2.5 py-2 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-[#2e3d5e] whitespace-nowrap min-w-[90px] sm:min-w-[108px]">Adjusted</th>
                        {opts.showPercentRevenue && <th className="bg-[#ebeff8] px-2 sm:px-2.5 py-2 text-right text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[.06em] text-[#2e3d5e] whitespace-nowrap min-w-[50px] sm:min-w-[60px]">%</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {visible.map((row, i) => (
                        <TableRow key={i} row={row} opts={opts} />
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 border-t border-hair bg-[#fafbfc] px-3 py-3 sm:px-4 text-[11.5px] text-muted">
                <div className="flex justify-between sm:block w-full sm:w-auto">
                    <span>Hatch Forecasted Expenses</span>
                    <span className="sm:before:content-['·_']"><b className="font-semibold text-ink-700">${footer.hatchForecasted.toLocaleString()}</b></span>
                </div>
                <div className="flex justify-between sm:block w-full sm:w-auto">
                    <span>Adjusted Amount to Spend</span>
                    <span className="sm:before:content-['·_']"><b className="font-semibold text-ink-700">${footer.adjustedToSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}</b></span>
                </div>
                <div className="flex justify-between sm:block w-full sm:w-auto">
                    <span>Total to Spend vs. Hatch</span>
                    <span className="sm:before:content-['·_']"><b className="font-semibold text-ink-700">{FooterUSD(footer.totalVsHatch)}</b></span>
                </div>
                <div className="flex justify-between items-center w-full sm:w-auto mt-1 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-hair-2">
                    <span>GL closes {footer.glCloses}</span>
                    <span className="sm:ml-2 inline-flex items-center gap-1 rounded-full bg-[#fbe8e6] px-2.5 py-0.5 text-[11px] sm:text-[11.5px] font-bold text-crit">
                        ▲ over budget · −${footer.overBudget.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}