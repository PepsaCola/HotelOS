import type { PoDetail } from "@/types/invoices";
import { Ic, MatchPctPill } from "./ReviewShared";

const CHECK_SVG = (
    <svg viewBox="0 0 18 18" fill="none" className="inline h-[16px] w-[16px] shrink-0">
        <path
            d="M3 9L7 13.5L15 4.5"
            stroke="#0BAC66"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const FAIL_SVG = (
    <svg viewBox="0 0 24 24" fill="none" className="inline h-[16px] w-[16px] shrink-0">
        <path
            d="M18 6L6 18M6 6l12 12"
            stroke="#b13434"
            strokeWidth="2.5"
            strokeLinecap="round"
        />
    </svg>
);

const WARN_ICON = [
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    "M12 9v4M12 17h.01",
];

export interface ReviewPoFormPanelProps {
    po: PoDetail;
    flow: number;
    approveNoteVisible: boolean;
    approveNote: string;
    onApproveNote: (v: string) => void;
    onConfirmNote: () => void;
    onCancelNote: () => void;
    onGoBack: () => void;
}

export function ReviewPoFormPanel({
                                      po,
                                      flow,
                                      approveNoteVisible,
                                      approveNote,
                                      onApproveNote,
                                      onConfirmNote,
                                      onCancelNote,
                                      onGoBack,
                                  }: ReviewPoFormPanelProps) {
    const mismatches = Object.values(po.mismatches ?? {});
    const mismatchCount = mismatches.length;

    return (
        <div className="flex min-h-0 h-full flex-col overflow-hidden rounded-[14px] border border-page-border bg-white">
            {/* Summary bar — stacks cleanly to fit the (half-width) panel at any size */}
            <div className="flex flex-none flex-col gap-3 border-b border-page-border px-3 py-3 sm:px-4">

                {/* Back + PO ref + match / mismatch pills */}
                <div className="flex items-center gap-3 min-w-0 w-full">
                    <button
                        type="button"
                        onClick={onGoBack}
                        className="h-8 shrink-0 rounded-[8px] border border-page-border bg-white px-2.5 text-[12px] font-semibold text-ink hover:bg-surface-soft"
                    >
                        ← Back
                    </button>

                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                        <span className="break-all text-[13px] font-semibold text-ink">
                            {po.ref}
                        </span>
                        <MatchPctPill percent={po.percent} tone={po.tone} />
                        {mismatchCount > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-crit-bg px-2 py-0.5 text-[11px] font-semibold text-crit whitespace-nowrap">
                                {mismatchCount} mismatch{mismatchCount > 1 ? "es" : ""}
                            </span>
                        )}
                    </div>
                </div>

                {/* Description — now fully visible (wraps to 2 lines) instead of being truncated away */}
                {po.desc && (
                    <div className="line-clamp-2 break-words text-[11.5px] leading-relaxed text-muted-strong">
                        {po.desc}
                    </div>
                )}

                {/* Financial metrics — compact 3-up card */}
                <div className="grid grid-cols-3 gap-2 rounded-[10px] border border-[#f1f1ee] bg-surface-soft p-2">
                    <div className="min-w-0 px-1">
                        <div className="text-[10px] sm:text-[10.5px] text-muted font-medium">A/C</div>
                        <div className="truncate font-mono text-[11.5px] sm:text-[12px] font-medium text-ink">
                            {po.account}
                        </div>
                    </div>

                    <div className="min-w-0 border-l border-[#d8d8dd] px-1">
                        <div className="text-[10px] sm:text-[10.5px] text-muted font-medium">Amount</div>
                        <div className="truncate text-[11.5px] sm:text-[12px] font-medium tabular-nums text-ink">
                            {po.amount}
                        </div>
                    </div>

                    <div className="min-w-0 border-l border-[#d8d8dd] px-1">
                        <div className="text-[10px] sm:text-[10.5px] text-muted font-medium">Date</div>
                        <div className="truncate text-[11.5px] sm:text-[12px] font-medium text-ink">
                            {po.date}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mismatch banner */}
            {mismatchCount > 0 && (
                <div className="flex-none border-b border-[#f5c6c0] bg-[#fff8f7] px-3 py-3 sm:px-5">
                    <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.07em] text-crit">
                        <Ic d={WARN_ICON} className="h-3.5 w-3.5 shrink-0" />
                        {mismatchCount} mismatch{mismatchCount > 1 ? "es" : ""} detected
                    </div>

                    <div className="space-y-2">
                        {mismatches.map((m, i) => (
                            <div
                                key={i}
                                className="rounded-[10px] border border-[#f5c6c0] bg-white/60 px-3 py-2 text-[12.5px] lg:flex lg:flex-wrap lg:items-baseline lg:gap-2 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0"
                            >
                                <span className="block font-semibold text-crit lg:min-w-[130px] lg:shrink-0">
                                    {m.field}
                                </span>

                                <span className="mt-1 block text-muted-strong lg:mt-0 lg:inline">
                                    Invoice: <b className="text-ink">{m.invoiceVal}</b>
                                </span>

                                <span className="hidden text-page-border lg:inline">vs</span>

                                <span className="block text-muted-strong lg:inline">
                                    PO: <b className="text-ink">{m.poVal}</b>
                                </span>

                                <span className="mt-1 block text-[11.5px] text-crit lg:mt-0 lg:inline">
                                    - {m.reason}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Scrollable form */}
            <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
                {/* PO Information */}
                <section className="border-b border-page-border">
                    <div className="px-3 pb-3 pt-4 text-[14px] sm:text-[15px] font-bold text-ink sm:px-5">
                        PO Information
                    </div>

                    {[
                        { label: "PO number", value: po.poNumber, mono: false },
                        { label: "PO date", value: po.poDate, mono: false },
                        { label: "Budget Classification", value: po.budgetClass, mono: false },
                        { label: "Account Number", value: po.accountNumber, mono: true },
                    ].map((row) => (
                        <div
                            key={row.label}
                            className="flex flex-col gap-1 border-t border-[#f1f1ee] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5"
                        >
                            <span className="text-[12.5px] sm:text-[13.5px] text-muted-strong">
                                {row.label}
                            </span>

                            <span
                                className={`break-words text-[12.5px] font-medium text-ink sm:text-right sm:text-[13.5px] ${
                                    row.mono ? "font-mono sm:text-[13px]" : ""
                                }`}
                            >
                                {row.value}
                            </span>
                        </div>
                    ))}
                </section>

                {/* Shipping */}
                <section className="border-b border-page-border">
                    <div className="px-3 pb-3 pt-4 text-[14px] sm:text-[15px] font-bold text-ink sm:px-5">
                        Shipping Information
                    </div>

                    {[
                        { label: "Billed to", value: po.billedTo },
                        { label: "Vendor", value: po.vendorShort },
                    ].map((row) => (
                        <div
                            key={row.label}
                            className="grid grid-cols-1 gap-1 border-t border-[#f1f1ee] px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_2fr] sm:items-center sm:gap-4 sm:px-5"
                        >
                            <div className="flex items-center gap-2">
                                {CHECK_SVG}
                                <span className="text-[12.5px] sm:text-[13.5px] text-muted-strong">
                                    {row.label}
                                </span>
                            </div>

                            <span className="break-words pl-[22px] sm:pl-0 text-[12.5px] font-medium text-ink sm:text-[13.5px]">
                                {row.value}
                            </span>
                        </div>
                    ))}
                </section>

                {/* Line Items */}
                <section className="border-b border-page-border">
                    <div className="px-3 pb-3 pt-4 text-[14px] sm:text-[15px] font-bold text-ink sm:px-5">
                        Line Items
                    </div>

                    {/* Cards — used until the (half-width) panel is wide enough for the table */}
                    <div className="space-y-3 px-3 pb-4 2xl:hidden">
                        {po.lineItems.map((item, i) => {
                            const isMismatch = item.mismatch;
                            const statusColor = isMismatch ? "text-crit" : "text-[#0BAC66]";
                            const cardBorder = isMismatch ? "border-l-crit border-l-4" : "border-l-[#0BAC66] border-l-4";

                            return (
                                <div
                                    key={i}
                                    className={`rounded-[12px] border border-[#f1f1ee] ${cardBorder} p-3 ${
                                        isMismatch ? "bg-[#fff8f7]" : "bg-white"
                                    } shadow-sm`}
                                >
                                    <div className="mb-2.5 flex items-start gap-2">
                                        <span className={`mt-0.5 shrink-0 ${statusColor}`}>
                                            {isMismatch ? FAIL_SVG : CHECK_SVG}
                                        </span>
                                        <div className="min-w-0">
                                            <div className="text-[10px] font-semibold uppercase tracking-[0.07em] text-muted-strong">
                                                Description
                                            </div>
                                            <div className={`break-words text-[13px] font-medium leading-relaxed ${isMismatch ? "text-crit" : "text-ink"}`}>
                                                {item.desc}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Мобільна сітка параметрів — чиста, без дублювання іконок в кожній комірці */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[12.5px] pt-2 border-t border-[#f1f1ee]/60">
                                        <div>
                                            <div className="text-[10px] font-medium text-muted">Qty</div>
                                            <div className="mt-0.5 font-medium text-ink">{item.qty}</div>
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-medium text-muted">Package / Unit #</div>
                                            <div className="mt-0.5 font-mono text-ink break-all">{item.unit}</div>
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-medium text-muted">Unit Price</div>
                                            <div className="mt-0.5 font-medium tabular-nums text-ink">{item.unitPrice}</div>
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-medium text-muted">Amount</div>
                                            <div className={`mt-0.5 font-semibold tabular-nums ${isMismatch ? "text-crit" : "text-ink"}`}>{item.amount}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop table — only once the panel is genuinely wide (2xl) */}
                    <div className="hidden 2xl:block">
                        <div className="grid grid-cols-[70px_110px_minmax(0,1fr)_100px_100px] gap-2 border-b border-t border-[#f1f1ee] bg-surface-soft px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-strong">
                            <span>QTY</span>
                            <span>Package/Unit #</span>
                            <span>Description</span>
                            <span>Unit Price</span>
                            <span>Amount</span>
                        </div>

                        {po.lineItems.map((item, i) => {
                            const color = item.mismatch ? "text-crit" : "text-ink";
                            const icon = item.mismatch ? FAIL_SVG : CHECK_SVG;

                            return (
                                <div
                                    key={i}
                                    className={`grid grid-cols-[70px_110px_minmax(0,1fr)_100px_100px] gap-2 border-b border-[#f1f1ee] px-5 py-2.5 text-[13.5px] last:border-0 ${
                                        item.mismatch ? "bg-[#fff8f7]" : ""
                                    }`}
                                >
                                    <span className={`flex items-center gap-1 ${color}`}>
                                        {icon}
                                        {item.qty}
                                    </span>

                                    <span className={`flex items-center gap-1 ${color}`}>
                                        {icon}
                                        {item.unit}
                                    </span>

                                    <span className={`flex items-start gap-1 leading-relaxed ${color}`}>
                                        <span className="mt-0.5 shrink-0">{icon}</span>
                                        {item.desc}
                                    </span>

                                    <span className={`flex items-center gap-1 ${color}`}>
                                        {icon}
                                        {item.unitPrice}
                                    </span>

                                    <span className={`flex items-center gap-1 ${color}`}>
                                        {icon}
                                        {item.amount}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Totals */}
                    <div className="ml-auto w-full space-y-1.5 px-3 py-4 sm:max-w-[320px] sm:px-5 sm:py-5">
                        {[
                            { label: "Subtotal:", value: po.subtotal },
                            { label: "Shipping:", value: po.shipping },
                            { label: "Tax:", value: po.tax },
                        ].map((row) => (
                            <div
                                key={row.label}
                                className="flex items-center justify-between gap-3 text-[13.5px] sm:text-[14px] text-muted-strong"
                            >
                                <span className="flex items-center gap-1">
                                    {CHECK_SVG}
                                    {row.label}
                                </span>

                                <strong className="font-medium text-ink">{row.value}</strong>
                            </div>
                        ))}

                        <div className="my-2 h-px bg-[#d8d8dd]" />

                        <div className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-1 text-[17px] sm:text-[22px] font-bold text-ink">
                                {CHECK_SVG}
                                Total
                            </span>

                            <strong className="text-[17px] sm:text-[22px] font-bold text-ink">
                                {po.total}
                            </strong>
                        </div>
                    </div>
                </section>

                {/* Departments */}
                <section>
                    <div className="px-3 pb-3 pt-4 text-[14px] sm:text-[15px] font-bold text-ink sm:px-5">
                        Departments
                    </div>

                    {po.departments.map((dept, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-1 gap-1 border-t border-[#f1f1ee] px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-x-4 sm:gap-y-1 sm:px-5"
                        >
                            <span className="break-words text-[13px] font-medium text-ink">
                                {dept.name}
                            </span>

                            <span className="font-mono text-[12.5px] font-medium text-ink sm:text-right">
                                {dept.account}
                            </span>

                            <span className="text-[13px] font-medium tabular-nums text-ink sm:text-right">
                                {dept.amount}
                            </span>
                        </div>
                    ))}
                </section>

                {/* Spacer so the fixed bottom action bar can't cover the last content on mobile */}
                <div aria-hidden className="h-[210px] lg:hidden" />
            </div>

            {/* Flow 4: approve with note */}
            {flow === 4 && approveNoteVisible && (
                <div className="flex-none border-t border-page-border bg-[#fffcf5] px-3 py-3 sm:px-4">
                    <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-warn">
                        <Ic d={WARN_ICON} className="h-3.5 w-3.5 shrink-0" />
                        Partial match - approval note required
                    </div>

                    <textarea
                        value={approveNote}
                        onChange={(e) => onApproveNote(e.target.value)}
                        placeholder="Describe why this partial match is acceptable (required)..."
                        className="h-20 w-full resize-none rounded-[8px] border border-[#e2d9c0] bg-white px-3 py-2 text-[13px] font-[inherit] text-ink outline-none focus:border-warn focus:ring-2 focus:ring-warn/20 sm:h-16"
                    />

                    <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onCancelNote}
                            className="h-9 rounded-[8px] border border-page-border bg-white px-3 text-[12.5px] font-medium text-ink hover:bg-surface-soft sm:h-8"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={onConfirmNote}
                            className="h-9 rounded-[8px] bg-ink-900 px-4 text-[12.5px] font-semibold text-white hover:bg-black sm:h-8"
                        >
                            Confirm approval
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}