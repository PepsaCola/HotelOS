import { useState } from "react";
import type { PurchaseOrder, ReceivingLine } from "@/types/receiving";
import { formatMoney } from "@/lib/money";
import DetailTimeline from "./DetailTimeline";

interface DetailTabsProps {
    po: PurchaseOrder;
}

type DetailTab = "items" | "history";

function lineStatus(line: ReceivingLine): { label: string; cls: string } {
    if (line.received === 0)              return { label: "Pending",  cls: "bg-surface-chip text-ink-700" };
    if (line.missing > 0)                 return { label: "Partial",  cls: "bg-warn-bg text-warn" };
    if (line.received > line.qty)         return { label: "Over",     cls: "bg-crit-bg text-crit" };
    return                                       { label: "Complete", cls: "bg-good-bg text-good" };
}

// Зробили TH адаптивним: менший шрифт, менші відступи та заборона переносу тексту
const TH = "border-b border-hair-2 bg-surface-soft px-2.5 sm:px-3.5 py-2.5 sm:py-3 text-left text-[9.5px] sm:text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong whitespace-nowrap";

export function DetailTabs({ po }: DetailTabsProps) {
    const [tab, setTab] = useState<DetailTab>("items");

    return (
        <div>
            {/* ── Tab switcher ── */}
            <div className="mb-[16px] sm:mb-[18px] flex w-full sm:w-max gap-0.5 rounded-[11px] bg-surface-chip p-1">
                {([
                    { id: "items",   label: "List of Items", count: po.lines.length },
                    { id: "history", label: "History",       count: po.events.length },
                ] as { id: DetailTab; label: string; count: number }[]).map((t) => {
                    const active = tab === t.id;
                    return (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setTab(t.id)}
                            className={`inline-flex flex-1 sm:flex-none justify-center items-center gap-1.5 rounded-lg px-2 sm:px-3.5 py-[6px] sm:py-[7px] text-[12px] sm:text-[13px] font-medium transition-colors ${
                                active
                                    ? "bg-white text-ink-900 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_var(--color-hair-2)]"
                                    : "text-muted-strong hover:text-ink-900"
                            }`}
                        >
                            <span className="truncate">{t.label}</span>
                            <span
                                className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] sm:text-[11px] ${
                                    active ? "bg-accent-soft text-accent-ink" : "bg-[#dcdde0] text-ink-700"
                                }`}
                            >
                                {t.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ── Items tab ── */}
            {tab === "items" && (
                <div className="overflow-hidden rounded-[14px] border border-hair-2 bg-white">
                    <div className="border-b border-hair-2 bg-white px-3 sm:px-3.5 py-3 sm:py-3.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong">
                        List of Items
                    </div>

                    {/* Плавний горизонтальний скрол */}
                    <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
                        <table className="w-full min-w-[700px] border-collapse text-[12.5px] sm:text-[13px]">
                            <thead>
                            <tr>
                                <th className={`${TH} text-right w-[50px] sm:w-[60px]`}>Qty</th>
                                <th className={TH}>Unit</th>
                                <th className={TH}>Description</th>
                                <th className={`${TH} text-center`}>Received</th>
                                <th className={`${TH} text-center`}>Missing</th>
                                <th className={`${TH} text-right`}>Unit Price</th>
                                <th className={`${TH} text-right`}>Amount</th>
                                <th className={`${TH} text-center`}>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {po.lines.map((line) => {
                                const st = lineStatus(line);
                                return (
                                    <tr key={line.id} className="border-b border-hair last:border-0 hover:bg-[#fafbfc] transition-colors">
                                        <td className="px-2.5 sm:px-3.5 py-2.5 sm:py-3.5 text-right align-middle sm:align-top tabular-nums text-ink-700">
                                            {line.qty}
                                        </td>
                                        <td className="px-2.5 sm:px-3.5 py-2.5 sm:py-3.5 align-middle sm:align-top font-medium text-ink-900">
                                            {line.unit}
                                        </td>
                                        <td className="max-w-[180px] sm:max-w-[300px] truncate px-2.5 sm:px-3.5 py-2.5 sm:py-3.5 align-middle sm:align-top font-medium text-ink-900" title={line.description}>
                                            {line.description}
                                        </td>
                                        <td className="px-2.5 sm:px-3.5 py-2.5 sm:py-3.5 text-center align-middle sm:align-top">
                                            <Pill value={line.received} tone={line.received > 0 ? "received" : "none"} />
                                        </td>
                                        <td className="px-2.5 sm:px-3.5 py-2.5 sm:py-3.5 text-center align-middle sm:align-top">
                                            <Pill value={line.missing} tone={line.missing > 0 ? "missing" : "none"} />
                                        </td>
                                        <td className="px-2.5 sm:px-3.5 py-2.5 sm:py-3.5 text-right align-middle sm:align-top tabular-nums text-ink-700">
                                            {formatMoney(line.unitPrice)}
                                        </td>
                                        <td className="px-2.5 sm:px-3.5 py-2.5 sm:py-3.5 text-right align-middle sm:align-top font-semibold tabular-nums text-ink-900">
                                            {formatMoney(line.amount)}
                                        </td>
                                        <td className="px-2.5 sm:px-3.5 py-2.5 sm:py-3.5 text-center align-middle sm:align-top">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 sm:px-2.5 py-[3px] sm:py-1 text-[10.5px] sm:text-[11.5px] font-semibold whitespace-nowrap ${st.cls}`}>
                                                    <span className="h-[4px] w-[4px] sm:h-[5px] sm:w-[5px] shrink-0 rounded-full bg-current" />
                                                    {st.label}
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── History tab ── */}
            {tab === "history" && <DetailTimeline events={po.events} />}
        </div>
    );
}

type PillTone = "received" | "missing" | "none";

const PILL_CLASS: Record<PillTone, string> = {
    received: "bg-good-bg text-good",
    missing:  "bg-warn-bg text-warn",
    none:     "bg-surface-chip text-ink-700",
};

function Pill({ value, tone }: { value: number; tone: PillTone }) {
    return (
        <span className={`inline-flex min-w-[36px] sm:min-w-[44px] items-center justify-center rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-[11.5px] font-semibold tabular-nums ${PILL_CLASS[tone]}`}>
            {value}
        </span>
    );
}