import type { ReceivingEvent } from "@/types/receiving";
import { formatMoney } from "@/lib/money";
import { InvoiceIcon, NoteLinesIcon } from "./icons";

interface DetailTimelineProps {
    events: ReceivingEvent[];
}

export default function DetailTimeline({ events }: DetailTimelineProps) {
    if (events.length === 0) {
        return (
            <div className="rounded-[14px] border border-hair-2 bg-white px-4 py-8 sm:px-6 sm:py-12 text-center text-[13px] text-muted-strong">
                No invoices recorded yet.
            </div>
        );
    }

    return (
        <div>
            <div className="mb-3 flex items-center gap-2.5 text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-strong">
                <span>Invoices Timeline · newest first</span>
                <div className="h-px flex-1 bg-hair" />
            </div>

            {/* Збільшено відступ pl-6 -> pl-7 для кращого центрування лінії та крапок */}
            <div className="relative flex flex-col gap-4 sm:gap-3.5 pl-7 sm:pl-8">

                {/* vertical line (відцентровано) */}
                <div className="absolute bottom-3.5 left-[10px] top-3.5 w-px bg-hair-2 -translate-x-1/2" />

                {events.map((event, idx) => {
                    const isLast = idx === events.length - 1;
                    const isPartial = event.type === "partial";

                    return (
                        <div key={event.id} className="relative overflow-hidden rounded-[14px] border border-hair-2 bg-white shadow-soft sm:shadow-none">

                            {/* timeline dot (відцентровано на лінії) */}
                            <div
                                className="absolute -left-[28px] sm:-left-[32px] top-[24px] sm:top-[28px] h-2.5 w-2.5 rounded-full border-2 border-[#f6f6f4] -translate-x-1/2 z-10"
                                style={{ background: isLast ? "var(--color-muted-strong)" : "var(--color-accent)" }}
                            />

                            {/* ── Event head ── */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-hair px-3.5 sm:px-4 py-3 sm:py-3.5">

                                {/* Іконка та Інформація */}
                                <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5 min-w-0">
                                    <div className={`grid h-9 w-9 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-[10px] sm:rounded-xl ${isPartial ? "bg-warn-bg text-warn" : "bg-good-bg text-good"}`}>
                                        <InvoiceIcon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="text-[14.5px] sm:text-[15px] font-bold tracking-tight text-ink-900 truncate">
                                            Invoice {event.invoiceId}
                                        </h3>
                                        <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11.5px] sm:text-[12.5px] text-muted-strong">
                                            <span>
                                                <b className="font-semibold text-ink-700">{event.date}</b>
                                            </span>
                                            <span className="hidden xs:inline text-muted">·</span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="xs:hidden">|</span>
                                                Updated by <b className="font-semibold text-ink-700">{event.updatedBy}</b>
                                            </span>
                                            <span className="hidden sm:inline text-muted">·</span>
                                            <span className="flex items-center gap-1.5 w-full sm:w-auto mt-0.5 sm:mt-0">
                                                {isPartial ? "Partial PO fulfillment" : "Final PO completion"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Кнопки дій (Мобільний: сітка 2х2. ПК: flex) */}
                                <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                                    <button
                                        type="button"
                                        className="h-8 sm:h-7 w-full sm:w-auto rounded-lg px-2.5 text-[12.5px] font-medium text-ink-700 bg-surface-soft sm:bg-transparent hover:bg-surface-chip transition-colors"
                                    >
                                        Add Note
                                    </button>
                                    <button
                                        type="button"
                                        className="h-8 sm:h-7 w-full sm:w-auto rounded-lg border border-hair-2 bg-white px-2.5 text-[12.5px] font-medium text-ink-900 shadow-sm sm:shadow-none hover:bg-surface-soft transition-colors"
                                    >
                                        View Invoice
                                    </button>
                                </div>
                            </div>

                            {/* ── Lines table ── */}
                            <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
                                <table className="w-full min-w-[500px] border-collapse text-[12.5px] sm:text-sm text-left">
                                    <thead>
                                    <tr>
                                        {["Qty", "Unit", "Description", "Unit Price", "Amount"].map((h, i) => (
                                            <th
                                                key={h}
                                                className={`border-b border-hair-2 bg-surface-soft px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-[9.5px] sm:text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong whitespace-nowrap ${i === 0 || i >= 3 ? "text-right" : "text-left"}`}
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {event.lines.map((line) => (
                                        <tr key={line.id} className="border-b border-hair last:border-0 hover:bg-[#fafbfc] transition-colors">
                                            <td className="px-2.5 sm:px-3.5 py-2.5 sm:py-3 text-right tabular-nums text-ink-700">{line.qty}</td>
                                            <td className="px-2.5 sm:px-3.5 py-2.5 sm:py-3 font-medium text-ink-900">{line.unit}</td>
                                            <td className="max-w-[180px] sm:max-w-[320px] truncate px-2.5 sm:px-3.5 py-2.5 sm:py-3 font-medium text-ink-900" title={line.description}>
                                                {line.description}
                                            </td>
                                            <td className="px-2.5 sm:px-3.5 py-2.5 sm:py-3 text-right tabular-nums text-ink-700">{formatMoney(line.unitPrice)}</td>
                                            <td className="px-2.5 sm:px-3.5 py-2.5 sm:py-3 text-right font-semibold tabular-nums text-ink-900">{formatMoney(line.amount)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* ── Footer: note + totals ── */}
                            {/* На мобільному flex-col-reverse (Totals зверху, Note знизу), на ПК: grid */}
                            <div className="flex flex-col-reverse sm:grid sm:gap-5 border-t border-hair p-3.5 sm:p-4 sm:grid-cols-[1fr_auto]">

                                {event.note ? (
                                    <div className="flex items-start gap-2 text-[12px] sm:text-[12.5px] text-ink-700 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t border-hair-2 sm:border-0">
                                        <NoteLinesIcon className="mt-[3px] shrink-0 text-muted-strong" />
                                        <div>
                                            <span className="mr-1 font-semibold text-muted-strong">Note:</span>
                                            {event.note}
                                        </div>
                                    </div>
                                ) : (
                                    <div /> /* Empty div for grid layout on desktop */
                                )}

                                <div className="w-full sm:w-[320px]">
                                    {[
                                        ["Subtotal:", event.subtotal],
                                        ["Shipping:", event.shipping],
                                        ["Tax:", event.tax],
                                    ].map(([label, val]) => (
                                        <div key={label as string} className="flex items-baseline justify-between gap-4 py-1">
                                            <span className="text-[13px] sm:text-[14px] text-ink-700">{label}</span>
                                            <span className="text-[13px] sm:text-[14px] font-bold tabular-nums text-ink-900">{formatMoney(val as number)}</span>
                                        </div>
                                    ))}
                                    <div className="mt-2 sm:mt-2.5 flex items-baseline justify-between gap-4 border-t-2 border-[#2f2b45] pt-2.5 sm:pt-3">
                                        <span className="text-[16px] sm:text-[18px] font-semibold text-ink-900">Total</span>
                                        <span className="text-[16px] sm:text-[18px] font-bold tracking-tight tabular-nums text-ink-900">{formatMoney(event.total)}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}