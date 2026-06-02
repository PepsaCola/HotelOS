import { useState } from "react";

import type { Exception } from "@/types/exceptions";

import { formatMoney } from "@/lib/money";

import { EXCEPTION_TYPE_META, deptDisplay } from "../lib/exceptions";

interface RejectedTableProps {
    rows: Exception[];
    emptyLabel: string;
    onDetail: (exc: Exception) => void;
    onRevoke: (exc: Exception, comment: string) => void;
}

const TH =
    "whitespace-nowrap border-b border-hair-2 bg-surface-soft px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong";

const BADGE_CLASS: Record<string, string> = {
    crit: "bg-crit-bg text-crit",
    warn: "bg-warn-bg text-warn",
};

function RevokeModal({
                         exc,
                         onCancel,
                         onConfirm,
                     }: {
    exc: Exception;
    onCancel: () => void;
    onConfirm: (comment: string) => void;
}) {
    const [comment, setComment] = useState("");

    const returnStatus =
        exc.type === "no_po"
            ? "No PO Match"
            : exc.type === "over_budget"
                ? "Over Budget"
                : "Line Mismatch";

    const isCommentEmpty = comment.trim().length === 0;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-end justify-center bg-black/45 px-3 py-0 sm:items-center sm:px-4 sm:py-6"
            onClick={onCancel}
        >
            <div
                className="max-h-[90dvh] w-full max-w-[440px] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-[0_16px_48px_rgba(0,0,0,.22)] sm:rounded-2xl sm:p-7"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="text-[15px] font-bold tracking-tight text-ink-900 sm:text-[16px]">
                            Revoke Rejection
                        </div>

                        <div className="mt-1 break-words text-[12px] text-muted sm:text-[12.5px]">
                            {exc.invoiceNo} · {exc.vendor}
                        </div>
                    </div>

                    <button
                        onClick={onCancel}
                        className="shrink-0 p-1 text-lg leading-none text-muted hover:text-ink-900"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                <div className="mb-4 rounded-xl border border-[#f0d090] bg-warn-soft px-3 py-3 text-[12px] font-medium leading-relaxed text-warn sm:px-4 sm:text-[12.5px]">
                    Invoice will return to <strong>{returnStatus}</strong> status for re-processing.
                </div>

                <div className="mb-4">
                    <label className="mb-1.5 block text-[12px] font-semibold text-ink-900">
                        Comment <span className="font-normal text-crit">* required</span>
                    </label>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Reason for revoking this rejection..."
                        className="min-h-[90px] w-full resize-none rounded-lg border border-hair-2 px-3 py-2 text-[13px] focus:border-accent focus:outline-none"
                        rows={3}
                        autoFocus
                    />
                </div>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        onClick={onCancel}
                        className="h-10 rounded-lg border border-hair-2 px-4 text-[13px] font-medium text-ink-900 hover:bg-surface-soft sm:h-9"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={isCommentEmpty}
                        onClick={() => {
                            if (!isCommentEmpty) {
                                onConfirm(comment.trim());
                            }
                        }}
                        className={`h-10 rounded-lg border px-4 text-[13px] font-medium sm:h-9 ${
                            isCommentEmpty
                                ? "cursor-not-allowed border-hair-2 bg-surface-soft text-muted"
                                : "border-[#f0c6c6] bg-crit-bg text-crit hover:bg-[#f8d8d8]"
                        }`}
                    >
                        Revoke Rejection
                    </button>
                </div>
            </div>
        </div>
    );
}

function TypeBadge({ exc }: { exc: Exception }) {
    const typeInfo = EXCEPTION_TYPE_META[exc.type];

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-[11.5px] ${BADGE_CLASS[typeInfo.tone]}`}
        >
            <span className="h-[4px] w-[4px] rounded-full bg-current" />
            {typeInfo.label}
        </span>
    );
}

function DeptBadge({ exc }: { exc: Exception }) {
    const dept = deptDisplay(exc.dept);

    return (
        <span className="inline-flex min-w-0 items-center gap-1 text-[11px] font-medium text-ink-700 sm:text-[12px]">
            <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: dept.color }}
            />
            <span className="truncate">{dept.name}</span>
        </span>
    );
}

function MobileRejectedCard({
                                exc,
                                onDetail,
                                onRevokeClick,
                            }: {
    exc: Exception;
    onDetail: (exc: Exception) => void;
    onRevokeClick: (exc: Exception) => void;
}) {
    return (
        <article
            className="cursor-pointer rounded-2xl border border-hair bg-white p-4 shadow-sm transition hover:bg-[#fff8f8]"
            onClick={() => onDetail(exc)}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="font-mono text-[11px] font-semibold text-ink-900">
                        {exc.id}
                    </div>

                    <div className="mt-1 break-words text-[13px] font-semibold text-ink-900">
                        {exc.invoiceNo}
                    </div>

                    <div className="mt-0.5 break-words text-[12px] text-muted">
                        {exc.vendor}
                    </div>
                </div>

                <div className="shrink-0">
                    <TypeBadge exc={exc} />
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
                <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">
                        Dept
                    </div>
                    <div className="mt-1">
                        <DeptBadge exc={exc} />
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">
                        Amount
                    </div>
                    <div className="mt-1 font-semibold tabular-nums text-ink-900">
                        {formatMoney(exc.amount)}
                    </div>
                    {exc.exposure && (
                        <div className="mt-0.5 text-[11px] font-semibold text-crit">
                            +{formatMoney(exc.exposure)}
                        </div>
                    )}
                </div>

                <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">
                        Rejected By
                    </div>
                    <div className="mt-1 break-words font-medium text-ink-900">
                        {exc.rejectedBy}
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">
                        Date
                    </div>
                    <div className="mt-1 text-muted-strong">
                        {exc.rejectedAt}
                    </div>
                </div>
            </div>

            <div className="mt-4 rounded-xl bg-surface-soft px-3 py-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">
                    Reason
                </div>
                <div className="mt-1 break-words text-[12px] leading-relaxed text-muted-strong">
                    {exc.rejectionReason}
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRevokeClick(exc);
                }}
                className="mt-4 h-9 w-full rounded-lg border border-[#f0c6c6] bg-crit-bg px-3 text-[12px] font-medium text-crit hover:bg-[#f8d8d8]"
            >
                Revoke
            </button>
        </article>
    );
}

export function RejectedTable({
                                  rows,
                                  emptyLabel,
                                  onDetail,
                                  onRevoke,
                              }: RejectedTableProps) {
    const [revokeTarget, setRevokeTarget] = useState<Exception | null>(null);

    if (rows.length === 0) {
        return (
            <div className="px-4 py-12 text-center text-[13px] text-muted-strong sm:py-16">
                {emptyLabel}
            </div>
        );
    }

    return (
        <>
            {revokeTarget && (
                <RevokeModal
                    exc={revokeTarget}
                    onCancel={() => setRevokeTarget(null)}
                    onConfirm={(comment) => {
                        onRevoke(revokeTarget, comment);
                        setRevokeTarget(null);
                    }}
                />
            )}

            <div className="block lg:hidden">
                <div className="grid gap-3 md:grid-cols-2">
                    {rows.map((exc) => (
                        <MobileRejectedCard
                            key={exc.id}
                            exc={exc}
                            onDetail={onDetail}
                            onRevokeClick={setRevokeTarget}
                        />
                    ))}
                </div>
            </div>

            <div className="hidden w-full overflow-x-auto [-webkit-overflow-scrolling:touch] lg:block">
                <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                    <thead>
                    <tr>
                        <th className={`${TH} pl-5`}>Exception</th>
                        <th className={TH}>Invoice / Vendor</th>
                        <th className={TH}>Dept</th>
                        <th className={TH}>Type</th>
                        <th className={`${TH} text-right`}>Amount</th>
                        <th className={TH}>Rejected By</th>
                        <th className={TH}>Reason</th>
                        <th className={TH}>Date</th>
                        <th className={`${TH} pr-5 text-right`}>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {rows.map((exc) => (
                        <tr
                            key={exc.id}
                            className="cursor-pointer border-b border-hair hover:bg-[#fff8f8]"
                            onClick={() => onDetail(exc)}
                        >
                            <td className="py-3 pl-5 pr-3 align-middle font-mono text-[12px] font-semibold text-ink-900 shadow-[inset_3px_0_0_#b13434]">
                                {exc.id}
                            </td>

                            <td className="px-3 py-3 align-middle">
                                <div className="text-[13px] font-medium text-ink-900">
                                    {exc.invoiceNo}
                                </div>
                                <div className="mt-0.5 max-w-[220px] truncate text-[12px] text-muted">
                                    {exc.vendor}
                                </div>
                            </td>

                            <td className="px-3 py-3 align-middle">
                                <DeptBadge exc={exc} />
                            </td>

                            <td className="px-3 py-3 align-middle">
                                <TypeBadge exc={exc} />
                            </td>

                            <td className="px-3 py-3 text-right align-middle">
                                <div className="font-semibold tabular-nums text-ink-900">
                                    {formatMoney(exc.amount)}
                                </div>
                                {exc.exposure && (
                                    <div className="mt-0.5 text-[11.5px] font-semibold text-crit">
                                        +{formatMoney(exc.exposure)}
                                    </div>
                                )}
                            </td>

                            <td className="px-3 py-3 align-middle">
                                <div className="text-[12.5px] font-medium text-ink-900">
                                    {exc.rejectedBy}
                                </div>
                                <div className="text-[11px] text-muted">
                                    {exc.rejectedAt}
                                </div>
                            </td>

                            <td className="max-w-[240px] px-3 py-3 align-middle">
                                <div
                                    className="truncate text-[12px] text-muted-strong"
                                    title={exc.rejectionReason}
                                >
                                    {exc.rejectionReason}
                                </div>
                            </td>

                            <td className="px-3 py-3 align-middle text-[12.5px] text-muted">
                                {exc.rejectedAt}
                            </td>

                            <td className="py-3 pl-3 pr-5 text-right align-middle">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setRevokeTarget(exc);
                                    }}
                                    className="rounded-lg border border-[#f0c6c6] bg-crit-bg px-2.5 py-1 text-xs font-medium text-crit hover:bg-[#f8d8d8]"
                                >
                                    Revoke
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}