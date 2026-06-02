import type { PurchaseOrder } from "@/types/receiving";
import { lineProgress } from "../lib/po";
import { progressType, dateTone, STATUS_META, type ProgressType } from "../lib/queue";

interface ReceivingTableProps {
    rows: PurchaseOrder[];
    emptyLabel: string;
    onOpenRow: (po: PurchaseOrder) => void;
}

const TH = "whitespace-nowrap border-b border-hair-2 bg-surface-soft px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong";

const BADGE_CLASS: Record<string, string> = {
    good:    "bg-good-bg text-good",
    warn:    "bg-warn-bg text-warn",
    crit:    "bg-crit-bg text-crit",
    indigo:  "bg-accent-soft text-accent-ink",
    neutral: "bg-surface-chip text-ink-700",
};

const BAR_GRADIENT: Record<ProgressType, string> = {
    full:    "linear-gradient(90deg,#76e2a2,#34a86b)",
    partial: "linear-gradient(90deg,#f5c26b,#e8920a)",
    zero:    "#d6d8dc",
    over:    "linear-gradient(90deg,#f78080,#c93a3a)",
};

const DATE_CLASS: Record<string, string> = {
    crit: "font-semibold text-crit",
    warn: "font-semibold text-warn",
    "":   "text-ink-700",
};

const fmt = (v: number) => "$" + Math.round(v).toLocaleString("en-US");

export function ReceivingTable({ rows, emptyLabel, onOpenRow }: ReceivingTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                <thead>
                <tr>
                    <th className={`${TH} pl-4`}>PO #</th>
                    <th className={TH}>Vendor</th>
                    <th className={TH}>Department</th>
                    <th className={`${TH} text-right`}>PO Amount</th>
                    <th className={TH}>Expected</th>
                    <th className={TH}>Progress</th>
                    <th className={TH}>Status</th>
                    <th className={`${TH} pr-4`} />
                </tr>
                </thead>
                <tbody>
                {rows.length === 0 ? (
                    <tr>
                        <td colSpan={8} className="px-4 py-16 text-center text-[13px] text-muted-strong">
                            {emptyLabel}
                        </td>
                    </tr>
                ) : (
                    rows.map((po) => {
                        const prog = lineProgress(po);
                        const pType = progressType(prog.pct, prog.overReceived);
                        const tone = dateTone(po);
                        const meta = STATUS_META[po.status];
                        const dimmed = po.status === "received";

                        return (
                            <tr
                                key={po.id}
                                onClick={() => onOpenRow(po)}
                                className={`cursor-pointer border-b border-hair transition-colors hover:bg-[#fafbff] ${dimmed ? "opacity-75" : ""}`}
                            >
                                <td className="whitespace-nowrap py-3 pl-4 pr-3 align-middle">
                                    <div className="font-semibold text-ink-900" style={{ fontVariantNumeric: "tabular-nums" }}>
                                        {po.id}
                                    </div>
                                    <div className="mt-0.5 text-xs text-muted">
                                        {po.lines.length} lines · {po.poDate.split(",")[0]}
                                    </div>
                                </td>

                                <td className="px-3 py-3 align-middle">
                                    <div className="font-medium text-ink-900">{po.vendor}</div>
                                    <div className="mt-0.5 text-xs text-muted">{po.vendorSub}</div>
                                </td>

                                <td className="px-3 py-3 align-middle">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-chip px-2.5 py-1 text-xs font-medium text-ink-700">
                      <span className="h-[7px] w-[7px] rounded-full" style={{ background: po.deptColor }} />
                        {po.dept}
                    </span>
                                </td>

                                <td className="px-3 py-3 text-right align-middle">
                                    <div className="font-semibold tabular-nums text-ink-900">{fmt(po.amount)}</div>
                                    <div className="mt-0.5 text-xs text-muted">
                                        {prog.receivedLines} of {prog.totalLines} lines
                                    </div>
                                </td>

                                <td className={`whitespace-nowrap px-3 py-3 align-middle text-[13px] ${DATE_CLASS[tone]}`}>
                                    {po.expected}
                                    <div className="mt-0.5 text-xs font-normal text-muted">{expectedSub(po)}</div>
                                </td>

                                <td className="px-3 py-3 align-middle" style={{ minWidth: 160 }}>
                                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="font-medium text-ink-700">
                        {prog.receivedLines} / {prog.totalLines}
                      </span>
                                        <span className="text-muted">{prog.pct}%</span>
                                    </div>
                                    <div className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-surface-chip">
                                        <div
                                            className="h-full rounded-full"
                                            style={{ width: `${prog.pct}%`, background: BAR_GRADIENT[pType] }}
                                        />
                                    </div>
                                </td>

                                <td className="px-3 py-3 align-middle">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${BADGE_CLASS[meta.tone]}`}>
                      <span className="h-[5px] w-[5px] rounded-full bg-current" />
                        {prog.overReceived ? "Over-received" : meta.label}
                    </span>
                                </td>

                                <td className="py-3 pl-3 pr-4 text-right align-middle">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); onOpenRow(po); }}
                                        className="rounded-lg border border-hair-2 bg-white px-3 py-1.5 text-xs font-medium text-ink-900 hover:bg-surface-soft"
                                    >
                                        Show Details
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

function expectedSub(po: PurchaseOrder): string {
    if (po.status === "received") return `received ${Math.abs(po.expectedDays)} days ago`;
    if (po.expectedDays === 0) return "due today";
    if (po.expectedDays === 1) return "tomorrow";
    if (po.expectedDays === -1) return "1 day overdue";
    if (po.expectedDays < 0) return `${Math.abs(po.expectedDays)} days overdue`;
    return `in ${po.expectedDays} days`;
}