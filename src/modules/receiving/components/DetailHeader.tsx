import { formatMoney } from "@/lib/money";
import type { PurchaseOrder } from "@/types/receiving";
import { useBreadcrumb } from "@/contexts/LayoutContext";
import { calcPoTotals, lineProgress } from "../lib/po";
import { STATUS_META } from "../lib/queue";
import { DocIcon } from "./icons";

interface DetailHeaderProps {
    po: PurchaseOrder;
    property: string;
    onBack: () => void;
}

const BADGE_CLASS: Record<string, string> = {
    good:    "bg-good-bg text-good",
    warn:    "bg-warn-bg text-warn",
    crit:    "bg-crit-bg text-crit",
    indigo:  "bg-accent-soft text-accent-ink",
    neutral: "bg-surface-chip text-ink-700",
};

const BAR_SEGMENT: Record<string, string> = {
    received: "linear-gradient(90deg,#76e2a2,#34a86b)",
    partial:  "linear-gradient(90deg,#f5c26b,#e8920a)",
};

export function DetailHeader({ po, property, onBack }: DetailHeaderProps) {
    const totals = calcPoTotals(po.lines);
    const prog   = lineProgress(po);
    const meta   = STATUS_META[po.status];
    const receivedPct = prog.totalLines > 0
        ? Math.round((prog.receivedLines / prog.totalLines) * 100)
        : 0;
    const partialPct = prog.pct - receivedPct > 0 ? prog.pct - receivedPct : 0;

    useBreadcrumb([{ label: "Receiving", onClick: onBack }, { label: po.id }]);

    return (
        <div className="mb-4 sm:mb-5">
            {/* ── Title row ── */}
            <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11.5px] sm:text-[12.5px] text-muted-strong">
                        <span className="truncate">{po.vendor} · {po.dept}</span>
                        <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 sm:px-2.5 py-0.5 text-[10.5px] sm:text-[11.5px] font-semibold whitespace-nowrap ${BADGE_CLASS[meta.tone]}`}
                        >
                            <span className="h-[5px] w-[5px] rounded-full bg-current shrink-0" />
                            {prog.overReceived ? "Over-received" : meta.label === "Awaiting" ? "Partially Received" : meta.label}
                        </span>
                    </div>
                    <h2 className="font-mono text-[16px] sm:text-[18px] font-bold tracking-tight text-ink-900 truncate">
                        {po.id}
                    </h2>
                    <p className="mt-0.5 text-[12.5px] sm:text-[13.5px] text-muted-strong truncate">
                        {po.vendorSub}
                    </p>
                </div>

                {/* Розтягуємо кнопку на мобільному */}
                <button
                    type="button"
                    className="inline-flex h-9 w-full sm:w-auto justify-center shrink-0 items-center gap-2 rounded-[9px] border border-hair-2 bg-white px-3.5 text-[13px] sm:text-[13.5px] font-medium text-ink-900 shadow-sm sm:shadow-none hover:bg-surface-soft transition-colors"
                >
                    <DocIcon className="shrink-0" />
                    <span>View PO Form</span>
                </button>
            </div>

            {/* ── Summary grid ── */}
            <div className="overflow-hidden rounded-[14px] border border-hair-2 bg-white flex flex-col">

                {/* Хитрість: gap-[1px] та bg-hair-2 створюють ідеальні внутрішні рамки */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[1px] bg-hair">
                    <SummaryCell label="Billed To">
                        <span className="font-semibold block truncate">{property}</span>
                        {po.billedContact && <span className="mt-0.5 block text-[11px] sm:text-xs text-muted truncate">{po.billedContact}</span>}
                    </SummaryCell>
                    <SummaryCell label="Vendor">
                        <span className="font-semibold block truncate">{po.vendor}</span>
                        <span className="mt-0.5 block text-[11px] sm:text-xs text-muted truncate">{po.vendorSub}</span>
                    </SummaryCell>
                    <SummaryCell label="Account Number">
                        <span className="font-semibold block truncate">{po.accountNumber ?? "—"}</span>
                    </SummaryCell>
                    <SummaryCell label="Date">
                        <span className="font-semibold block truncate">{po.poDate}</span>
                        <span className="mt-0.5 block text-[11px] sm:text-xs text-muted truncate">
                            Due {po.expected}{po.terms ? ` · ${po.terms}` : ""}
                        </span>
                    </SummaryCell>
                    {/* Розтягуємо Total на 2 колонки на телефоні, щоб він не висів порожній */}
                    <SummaryCell label="Total" className="col-span-2 md:col-span-1">
                        <span className="text-[18px] sm:text-[20px] font-bold tracking-tight text-ink-900" style={{ fontVariantNumeric: "tabular-nums" }}>
                            {formatMoney(totals.total)}
                        </span>
                        <span className="mt-0.5 block text-[11px] sm:text-xs text-muted truncate">
                            Shipping {formatMoney(totals.shipping)} · Tax {formatMoney(totals.tax)}
                        </span>
                    </SummaryCell>
                </div>

                {/* ── Progress strip ── */}
                <div className="bg-surface-soft px-3.5 py-3 sm:px-4 border-t border-hair-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">

                        {/* Мобільний: Текст і відсотки в одному рядку над смужкою */}
                        <div className="flex justify-between items-center w-full sm:w-auto">
                            <span className="min-w-[110px] text-[10.5px] sm:text-[11.5px] font-semibold uppercase tracking-[0.05em] text-muted-strong">
                                Line Progress
                            </span>
                            <span className="sm:hidden text-[12px] font-semibold tabular-nums text-ink-700">
                                {prog.receivedLines}/{prog.totalLines} · {prog.pct}%
                            </span>
                        </div>

                        {/* Смужка прогресу */}
                        <div className="relative w-full sm:flex-1 overflow-hidden rounded-full" style={{ height: 8, background: "#ecedf0" }}>
                            <div
                                className="absolute inset-y-0 left-0 rounded-full"
                                style={{ width: `${receivedPct}%`, background: BAR_SEGMENT.received }}
                            />
                            <div
                                className="absolute inset-y-0 rounded-full"
                                style={{ left: `${receivedPct}%`, width: `${partialPct}%`, background: BAR_SEGMENT.partial }}
                            />
                        </div>

                        {/* Десктоп: Текст і відсотки справа */}
                        <span className="hidden sm:block min-w-[110px] text-right text-[13px] font-semibold tabular-nums text-ink-700">
                            {prog.receivedLines} / {prog.totalLines} lines · {prog.pct}%
                        </span>

                    </div>
                </div>
            </div>
        </div>
    );
}

// Додано підтримку className та прибрано логіку last (тепер керується через gap)
function SummaryCell({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={`px-3 py-3 sm:px-4 sm:py-3.5 bg-white flex flex-col justify-center ${className}`}>
            <div className="mb-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-strong">
                {label}
            </div>
            <div className="text-[13px] sm:text-[14px] text-ink-900">
                {children}
            </div>
        </div>
    );
}