import { createPortal } from "react-dom";
import { useLayout, type Density } from "@/contexts/LayoutContext";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                checked ? "bg-[#4949f3]" : "bg-gray-200"
            }`}
        >
            <span
                className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                    checked ? "translate-x-4" : "translate-x-0"
                }`}
            />
        </button>
    );
}

const DENSITIES: Density[] = ["comfortable", "compact"];

/**
 * Shared Display Options popup for every data page (PO Log uses its own richer
 * "Tweaks" popup). Reads/writes the global display options in LayoutContext and
 * anchors to the bottom-right corner.
 */
export function DisplayOptionsPopup() {
    const { displayOptionsOpen, closeDisplayOptions, displayOptions, setDisplayOption, resetDisplayOptions } = useLayout();

    if (!displayOptionsOpen) return null;

    const { density, showKpiStrip, financialEmphasis } = displayOptions;

    return createPortal(
        <>
            {/* Invisible backdrop */}
            <div className="fixed inset-0 z-40" onClick={closeDisplayOptions} aria-hidden="true" />

            {/* Panel — bottom-right */}
            <div
                className="fixed bottom-4 right-4 z-50 flex w-[300px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-page-border bg-white shadow-2xl max-h-[calc(100vh-2rem)]"
                role="dialog"
                aria-modal="true"
                aria-label="Display options"
            >
                {/* Header */}
                <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-page-border px-4">
                    <span className="text-[14px] font-bold text-ink">Display options</span>
                    <button
                        type="button"
                        onClick={closeDisplayOptions}
                        className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-surface-muted transition-colors"
                        aria-label="Close"
                    >
                        <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M3 3l10 10M13 3L3 13" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-4">

                    {/* Density */}
                    <div className="flex flex-col gap-2.5">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Density</p>
                        <div className="grid grid-cols-2 gap-1 rounded-[9px] border border-page-border bg-surface-soft p-1">
                            {DENSITIES.map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => setDisplayOption("density", d)}
                                    className={`rounded-[7px] py-1.5 text-[12.5px] font-semibold capitalize transition-colors ${
                                        density === d ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1 pr-3">
                                <p className="text-[13px] text-ink">Show KPI strip</p>
                                <p className="mt-0.5 text-[11px] leading-tight text-muted">Summary cards above the table</p>
                            </div>
                            <Toggle checked={showKpiStrip} onChange={(v) => setDisplayOption("showKpiStrip", v)} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1 pr-3">
                                <p className="text-[13px] text-ink">Financial emphasis</p>
                                <p className="mt-0.5 text-[11px] leading-tight text-muted">Color-code variances & key amounts</p>
                            </div>
                            <Toggle checked={financialEmphasis} onChange={(v) => setDisplayOption("financialEmphasis", v)} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex shrink-0 items-center justify-between border-t border-page-border px-4 py-2">
                    <button
                        type="button"
                        onClick={resetDisplayOptions}
                        className="text-[13px] font-medium text-muted hover:text-ink transition-colors"
                    >
                        Reset to default
                    </button>
                    <button
                        type="button"
                        onClick={closeDisplayOptions}
                        className="text-[13px] font-bold text-[#4949f3] hover:text-[#3838d0] transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </>,
        document.body,
    );
}
