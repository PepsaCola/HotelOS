import type { Invoice } from "@/types/invoices";
import { formatMoney } from "@/lib/money";
import { rowTone, matchDisplay, STATUS_META } from "../lib/invoice";
import { MatchOkIcon, MatchFailIcon } from "./icons";

interface InvoicesTableProps {
    rows: Invoice[];
    emptyLabel: string;
    onReview: (inv: Invoice) => void;
}

// Зробили TH адаптивним: менші шрифти та відступи на мобільному
const TH = "whitespace-nowrap border-b border-hair-2 bg-surface-soft px-2.5 sm:px-3 py-2.5 sm:py-3 text-left text-[9.5px] sm:text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong";

const ROW_TINT: Record<string, string> = {
    crit: "bg-[#fff8f8]",
    warn: "bg-[#fffaf4]",
    "":   "",
};

const BADGE_CLASS: Record<string, string> = {
    good:    "bg-good-bg text-good",
    warn:    "bg-warn-bg text-warn",
    crit:    "bg-crit-bg text-crit",
    indigo:  "bg-accent-soft text-accent-ink",
    neutral: "bg-surface-chip text-ink-700",
};

// Менші відступи для тегів на мобільному
const TAG_OK   = "inline-flex items-center gap-1 rounded-md bg-good-bg px-1 sm:px-1.5 py-0.5 text-[10.5px] sm:text-[11px] font-semibold text-good whitespace-nowrap";
const TAG_FAIL = "inline-flex items-center gap-1 rounded-md bg-crit-bg px-1 sm:px-1.5 py-0.5 text-[10.5px] sm:text-[11px] font-semibold text-crit whitespace-nowrap";

export function InvoicesTable({ rows, emptyLabel, onReview }: InvoicesTableProps) {
    return (
        <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[750px] sm:min-w-[900px] border-collapse text-left text-[12.5px] sm:text-sm">
                <thead>
                <tr>
                    <th className={`${TH} pl-3 sm:pl-4`}>Invoice #</th>
                    <th className={TH}>Vendor</th>
                    <th className={TH}>Received</th>
                    <th className={`${TH} text-right`}>Total</th>
                    <th className={TH}>PO #</th>
                    <th className={TH}>Matching</th>
                    <th className={TH}>Status</th>
                    <th className={TH}>Updated</th>
                    <th className={`${TH} pr-3 sm:pr-4 text-right`}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {rows.length === 0 ? (
                    <tr>
                        <td colSpan={9} className="px-4 py-12 sm:py-16 text-center text-[12.5px] sm:text-[13px] text-muted-strong">
                            {emptyLabel}
                        </td>
                    </tr>
                ) : (
                    rows.map((inv) => {
                        const tone   = rowTone(inv.status);
                        const meta   = STATUS_META[inv.status];
                        const match  = matchDisplay(inv);
                        const needsAction = inv.status === "over-budget" || inv.status === "no-match" || inv.status === "review";

                        return (
                            <tr
                                key={inv.id}
                                className={`border-b border-hair transition-colors hover:bg-[#fafbff] ${ROW_TINT[tone]}`}
                            >
                                <td className="py-2.5 sm:py-3 pl-3 sm:pl-4 pr-2.5 sm:pr-3 align-middle font-semibold tabular-nums text-ink-900">
                                    {inv.id}
                                </td>
                                <td className="px-2.5 sm:px-3 py-2.5 sm:py-3 align-middle font-medium text-ink-700">
                                    {inv.vendor}
                                </td>
                                <td className="whitespace-nowrap px-2.5 sm:px-3 py-2.5 sm:py-3 align-middle text-[12px] sm:text-[13px] text-ink-700">
                                    {inv.receivedDate}
                                </td>
                                <td className="px-2.5 sm:px-3 py-2.5 sm:py-3 text-right align-middle">
                                    <div className="font-semibold tabular-nums text-ink-900">
                                        {formatMoney(inv.amount)}
                                    </div>
                                    <div className="mt-0.5 text-[10.5px] sm:text-[11.5px] text-muted whitespace-nowrap">
                                        {inv.taxIncluded ? "incl. tax" : "no tax"}
                                    </div>
                                </td>
                                <td className="px-2.5 sm:px-3 py-2.5 sm:py-3 align-middle font-mono text-[11.5px] sm:text-[12.5px] tabular-nums text-ink-700">
                                    {inv.poRef ?? <span className="text-muted">—</span>}
                                </td>
                                <td className="px-2.5 sm:px-3 py-2.5 sm:py-3 align-middle">
                                    {match ? (
                                        <div className="flex items-center gap-1 sm:gap-1.5">
                                            <span className={match.poOk ? TAG_OK : TAG_FAIL}>
                                                {match.poOk ? <MatchOkIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : <MatchFailIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                                                PO
                                            </span>
                                            <span className={match.linesOk ? TAG_OK : TAG_FAIL}>
                                                {match.linesLabel}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[12px] sm:text-[13px] text-muted">—</span>
                                    )}
                                </td>
                                <td className="px-2.5 sm:px-3 py-2.5 sm:py-3 align-middle">
                                    <span className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10.5px] sm:text-[11.5px] font-semibold whitespace-nowrap ${BADGE_CLASS[meta.tone]}`}>
                                        <span className="h-[4px] w-[4px] sm:h-[5px] sm:w-[5px] rounded-full bg-current shrink-0" />
                                        {meta.label}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-2.5 sm:px-3 py-2.5 sm:py-3 align-middle text-[12px] sm:text-[13px] text-muted-strong">
                                    {inv.updatedAt}
                                </td>
                                <td className="py-2.5 sm:py-3 pl-2.5 sm:pl-3 pr-3 sm:pr-4 text-right align-middle">
                                    {needsAction ? (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); onReview(inv); }}
                                            className="rounded-lg border border-hair-2 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium text-ink-900 hover:bg-surface-soft transition-colors"
                                        >
                                            Review
                                        </button>
                                    ) : (
                                        <span className="text-muted">—</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
}