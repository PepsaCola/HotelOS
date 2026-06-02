import { useState } from "react";
import { Ic } from "./ReviewShared";

const ZOOM_STEPS = [50, 75, 100, 125, 150, 200];

// Збільшили кнопки на мобільному (h-8 w-8) для зручного тапу, на ПК залишили h-6 w-6
const PDF_BTN = "grid h-8 w-8 sm:h-6 sm:w-6 place-items-center rounded sm:rounded border border-transparent text-muted-strong transition-colors hover:border-page-border hover:bg-surface-muted disabled:opacity-40 shrink-0";

export function ReviewPdfPane({ fileRef }: { fileRef: string }) {
    const [zoomIdx, setZoomIdx] = useState(2);
    const zoom = ZOOM_STEPS[zoomIdx];

    return (
        <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-[14px] border border-page-border bg-white">
            {/* ── Toolbar ── */}
            <div className="grid flex-none grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-page-border bg-[#fcfcfd] px-3 py-2 sm:py-2">
                <div className="flex items-center gap-1 text-[11px] sm:text-[12px] tabular-nums text-muted-strong truncate">
                    1 <span className="text-muted">of 1</span>
                </div>

                <div className="flex items-center gap-1">
                    <button type="button" disabled={zoomIdx <= 0} onClick={() => setZoomIdx(i => i - 1)} className={PDF_BTN}>
                        <Ic d="M5 12h14" className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5" />
                    </button>
                    <span className="inline-flex h-8 sm:h-6 min-w-[54px] sm:min-w-[48px] items-center justify-center rounded border border-page-border bg-white px-2 text-[12px] tabular-nums text-ink">
                        {zoom}%
                    </span>
                    <button type="button" disabled={zoomIdx >= ZOOM_STEPS.length - 1} onClick={() => setZoomIdx(i => i + 1)} className={PDF_BTN}>
                        <Ic d="M12 5v14M5 12h14" w="2" className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5" />
                    </button>
                </div>

                <div className="flex justify-end">
                    <button type="button" className={PDF_BTN} title="Fullscreen">
                        <Ic d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5" />
                    </button>
                </div>
            </div>

            {/* ── Scrollable document area ── */}
            {/* [-webkit-overflow-scrolling:touch] забезпечує плавний інерційний скрол на iOS */}
            <div className="flex flex-1 justify-center overflow-auto bg-[#f2f1ee] p-4 [-webkit-overflow-scrolling:touch]">
                <div
                    className="origin-top bg-white shadow-[0_2px_8px_rgba(12,19,32,.06),0_8px_28px_rgba(12,19,32,.08)]"
                    style={{
                        width:     `${(540 * zoom) / 100}px`,
                        minHeight: `${(700 * zoom) / 100}px`,
                        padding:   `${(44 * zoom) / 100}px`,
                        fontSize:  `${(13 * zoom) / 100}px`,
                    }}
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="h-6 w-24 rounded bg-[#e8e8e6]" />
                                <div className="mt-2 space-y-1.5">
                                    <div className="h-2.5 w-32 rounded bg-[#ececeb]" />
                                    <div className="h-2.5 w-24 rounded bg-[#ececeb]" />
                                    <div className="h-2.5 w-28 rounded bg-[#ececeb]" />
                                </div>
                            </div>
                            <div className="text-right">
                                <div style={{ fontSize: "1.5em", fontWeight: 700 }} className="text-ink">Invoice</div>
                                <div className="mt-1 font-mono text-[0.85em] text-muted-strong">{fileRef}</div>
                            </div>
                        </div>
                        <div className="h-px bg-[#ececec]" />
                        <div className="space-y-1.5">
                            {[90, 76, 68, 60].map((w, i) => (
                                <div key={i} className="h-2.5 rounded bg-[#ececeb]" style={{ width: `${w}%` }} />
                            ))}
                        </div>
                        <div className="mt-2 grid grid-cols-[1fr_60px_60px_70px] gap-2 border-b border-[#ececec] pb-1.5">
                            {["Description", "Qty", "Rate", "Amount"].map(col => (
                                <div key={col} className="text-[0.8em] font-semibold uppercase tracking-wide text-muted">{col}</div>
                            ))}
                        </div>
                        {[88, 74, 92, 66, 80, 58, 84].map((w, i) => (
                            <div key={i} className="grid grid-cols-[1fr_60px_60px_70px] gap-2 border-b border-[#f1f1ef] py-1">
                                <div className="h-2.5 rounded bg-[#ececeb]" style={{ width: `${w}%` }} />
                                <div className="h-2.5 w-8 rounded bg-[#ececeb]" />
                                <div className="h-2.5 w-10 rounded bg-[#ececeb]" />
                                <div className="h-2.5 w-12 rounded bg-[#ececeb]" />
                            </div>
                        ))}
                        <div className="ml-auto w-44 space-y-1.5 pt-2">
                            {["Subtotal", "Sales Tax (6.5%)", "Total", "Payments/Credits", "Balance Due"].map((label, i) => (
                                <div key={i} className={`flex justify-between text-[0.85em] ${i === 4 ? "font-bold text-ink" : "text-muted-strong"}`}>
                                    <span>{label}</span>
                                    <div className="h-2.5 w-14 self-center rounded bg-[#ececeb]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}