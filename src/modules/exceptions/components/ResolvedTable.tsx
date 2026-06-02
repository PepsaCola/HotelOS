import type { Exception } from "@/types/exceptions";
import { formatMoney } from "@/lib/money";
import { EXCEPTION_TYPE_META, RESOLUTION_TYPE_META, deptDisplay } from "../lib/exceptions";

interface ResolvedTableProps {
    rows: Exception[];
    emptyLabel: string;
    onDetail: (exc: Exception) => void;
}

const TH = "whitespace-nowrap border-b border-hair-2 bg-surface-soft px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong";

const BADGE_CLASS: Record<string, string> = {
    good: "bg-good-bg text-good",
    warn: "bg-warn-bg text-warn",
    crit: "bg-crit-bg text-crit",
};

export function ResolvedTable({ rows, emptyLabel, onDetail }: ResolvedTableProps) {
    if (rows.length === 0) {
        return (
            <div className="px-4 py-16 text-center text-[13px] text-muted-strong">
                {emptyLabel}
            </div>
        );
    }

    // Групуємо за типом резолюції
    const grouped: Record<string, { label: string; icon: string; rows: Exception[] }> = {
        override: {
            label: "Approved Overrides",
            icon: "✅",
            rows: rows.filter((e) => e.resolutionType === "override"),
        },
        po_linked: {
            label: "Corrected PO Matches",
            icon: "🔗",
            rows: rows.filter((e) => e.resolutionType === "po_linked"),
        },
        mismatch_corrected: {
            label: "Corrected Line Mismatches",
            icon: "✔",
            rows: rows.filter((e) => e.resolutionType === "mismatch_corrected"),
        },
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
                <thead>
                <tr>
                    <th className={`${TH} pl-5`}>Exception</th>
                    <th className={TH}>Invoice / Vendor</th>
                    <th className={TH}>Department</th>
                    <th className={TH}>Original Type</th>
                    <th className={`${TH} text-right`}>Amount</th>
                    <th className={TH}>Resolution</th>
                    <th className={TH}>Resolved By</th>
                    <th className={TH}>Resolved</th>
                    <th className={`${TH} pr-5 text-right`}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(grouped).map(([key, group]) => {
                    if (group.rows.length === 0) return null;

                    return [
                        <tr key={`header-${key}`} className="bg-surface-soft">
                            <td colSpan={9} className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
                                {group.icon}&nbsp;&nbsp;{group.label}{" "}
                                <span className="text-muted-strong ml-2">{group.rows.length}</span>
                            </td>
                        </tr>,
                        ...group.rows.map((exc) => {
                            const typeInfo = EXCEPTION_TYPE_META[exc.type];
                            const resInfo = RESOLUTION_TYPE_META[exc.resolutionType!];
                            const dept = deptDisplay(exc.dept);

                            return (
                                <tr
                                    key={exc.id}
                                    className="border-b border-hair transition-colors hover:bg-[#f7fbf8] cursor-pointer"
                                    onClick={() => onDetail(exc)}
                                >
                                    <td className="py-3 pl-5 pr-3 align-middle font-mono text-[12px] font-semibold text-ink-900">
                                        {exc.id}
                                    </td>
                                    <td className="px-3 py-3 align-middle">
                                        <div className="font-medium text-ink-900 text-[13px]">{exc.invoiceNo}</div>
                                        <div className="mt-0.5 text-[12px] text-muted">{exc.vendor}</div>
                                    </td>
                                    <td className="px-3 py-3 align-middle">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-700">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dept.color }} />
                          {dept.name}
                      </span>
                                    </td>
                                    <td className="px-3 py-3 align-middle">
                      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-semibold ${BADGE_CLASS[typeInfo.tone]}`}>
                        <span className="h-2 w-2 rounded-full bg-current" />
                          {typeInfo.label}
                      </span>
                                    </td>
                                    <td className="px-3 py-3 text-right align-middle">
                                        <div className="font-semibold tabular-nums text-ink-900">{formatMoney(exc.amount)}</div>
                                        {exc.exposure ? (
                                            <div className="mt-0.5 text-[11.5px] text-warn font-semibold">
                                                +{formatMoney(exc.exposure)} over
                                            </div>
                                        ) : null}
                                    </td>
                                    <td className="px-3 py-3 align-middle">
                                        <div className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11.5px] font-semibold bg-good-bg text-good">
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                            {resInfo.label}
                                        </div>
                                        {exc.resolutionNote ? (
                                            <div className="mt-1 text-[11.5px] text-muted whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                                                {exc.resolutionNote}
                                            </div>
                                        ) : null}
                                    </td>
                                    <td className="px-3 py-3 align-middle">
                                        <div className="text-[12.5px] font-medium text-ink-900">{exc.resolvedBy}</div>
                                        <div className="mt-0.5 text-[11px] text-muted">
                                            {exc.resolutionType === "po_linked"
                                                ? "via PO link"
                                                : exc.resolutionType === "mismatch_corrected"
                                                    ? "via line correction"
                                                    : "via manual override"}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 align-middle text-[12.5px] text-muted">
                                        {exc.resolvedAt}
                                    </td>
                                    <td className="py-3 pl-3 pr-5 text-right align-middle">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDetail(exc);
                                            }}
                                            className="rounded-lg border border-hair-2 bg-white px-3 py-1.5 text-xs font-medium text-ink-900 hover:bg-surface-soft transition-colors"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            );
                        }),
                    ];
                })}
                </tbody>
            </table>
        </div>
    );
}