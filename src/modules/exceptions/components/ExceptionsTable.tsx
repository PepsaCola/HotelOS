import type { Exception } from "@/types/exceptions";
import { formatMoney } from "@/lib/money";
import { STATUS_META, EXCEPTION_TYPE_META, deptDisplay } from "../lib/exceptions";

interface ExceptionsTableProps {
    rows: Exception[];
    emptyLabel: string;
    onDetail: (exc: Exception) => void;
}

const TH = "whitespace-nowrap border-b border-hair bg-surface-soft px-4 py-[10px] text-left text-[11px] font-bold uppercase tracking-[0.07em] text-muted";

const BADGE_CLASS: Record<string, string> = {
    good:    "bg-good-bg text-good",
    warn:    "bg-warn-bg text-warn",
    crit:    "bg-crit-bg text-crit",
    indigo:  "bg-accent-soft text-accent-ink",
    neutral: "bg-surface-chip text-ink-700",
};

/* Row background tint */
const ROW_BG: Record<string, string> = {
    crit: "bg-[#fff8f8] hover:bg-[#fff3f3]",
    warn: "bg-[#fffaf4] hover:bg-[#fff6ec]",
    "":   "hover:bg-[#fafafa]",
};

/* First-cell left stripe — hardcoded hex, no CSS var */
const STRIPE: Record<string, string> = {
    crit: "shadow-[inset_3px_0_0_#b13434]",
    warn: "shadow-[inset_3px_0_0_#a55a00]",
    "":   "",
};

export function ExceptionsTable({ rows, emptyLabel, onDetail }: ExceptionsTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left">
                <thead>
                <tr>
                    <th className={`${TH} pl-[18px]`}>Exception</th>
                    <th className={TH}>Invoice / Vendor</th>
                    <th className={TH}>Department</th>
                    <th className={TH}>Type</th>
                    <th className={`${TH} text-right`}>Amount</th>
                    <th className={TH}>Status</th>
                    <th className={TH}>Assignee</th>
                    <th className={TH}>Raised</th>
                    <th className={`${TH} pr-[18px] text-right`}></th>
                </tr>
                </thead>
                <tbody>
                {rows.length === 0 ? (
                    <tr>
                        <td colSpan={9} className="px-4 py-16 text-center text-[13px] text-muted">
                            {emptyLabel}
                        </td>
                    </tr>
                ) : (
                    rows.map((exc) => {
                        const sev      = exc.severity === "crit" ? "crit" : exc.severity === "warn" ? "warn" : "";
                        const meta     = STATUS_META[exc.status];
                        const typeInfo = EXCEPTION_TYPE_META[exc.type];
                        const dept     = deptDisplay(exc.dept);

                        return (
                            <tr
                                key={exc.id}
                                className={`border-b border-hair cursor-pointer transition-colors ${ROW_BG[sev]}`}
                                onClick={() => onDetail(exc)}
                            >
                                <td className={`py-[13px] pl-[18px] pr-[14px] align-middle font-mono text-[11.5px] font-semibold text-ink-700 ${STRIPE[sev]}`}>
                                    {exc.id}
                                </td>
                                <td className="px-[14px] py-[13px] align-middle">
                                    <div className="text-[13px] font-medium text-ink-900">{exc.invoiceNo}</div>
                                    <div className="mt-0.5 text-[12px] text-muted">{exc.vendor}</div>
                                </td>
                                <td className="px-[14px] py-[13px] align-middle">
                    <span className="inline-flex items-center gap-[5px] text-[12px] font-medium text-ink-700">
                      <span className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ backgroundColor: dept.color }} />
                        {dept.name}
                    </span>
                                </td>
                                <td className="px-[14px] py-[13px] align-middle">
                    <span className={`inline-flex items-center gap-[5px] rounded-full px-[9px] py-[3px] text-[11.5px] font-semibold ${BADGE_CLASS[typeInfo.tone]}`}>
                      <span className="h-[5px] w-[5px] rounded-full bg-current" />
                        {typeInfo.label}
                    </span>
                                </td>
                                <td className="px-[14px] py-[13px] text-right align-middle">
                                    <div className="text-[13.5px] font-semibold tabular-nums text-ink-900">
                                        {formatMoney(exc.amount)}
                                    </div>
                                    {exc.exposure ? (
                                        <div className={`mt-0.5 text-[11px] font-semibold ${sev === "warn" ? "text-warn" : "text-crit"}`}>
                                            +{formatMoney(exc.exposure)} over
                                        </div>
                                    ) : null}
                                </td>
                                <td className="px-[14px] py-[13px] align-middle">
                    <span className={`inline-flex items-center gap-[5px] rounded-full px-[9px] py-[3px] text-[11.5px] font-semibold ${BADGE_CLASS[meta.tone]}`}>
                      <span className="h-[5px] w-[5px] rounded-full bg-current" />
                        {meta.label}
                    </span>
                                </td>
                                <td className="px-[14px] py-[13px] align-middle text-[13px] text-ink-700">
                                    {exc.assignee}
                                </td>
                                <td className="px-[14px] py-[13px] align-middle text-[12.5px] text-muted whitespace-nowrap">
                                    {exc.raised}
                                </td>
                                <td className="py-[13px] pl-[14px] pr-[18px] text-right align-middle">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDetail(exc); }}
                                        className="h-7 px-[10px] rounded-lg border border-hair-2 bg-white text-[12px] font-medium text-ink-900 hover:bg-surface-soft transition-colors"
                                    >
                                        Review
                                    </button>
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