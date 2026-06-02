import { useState, useRef, useEffect } from 'react';
import type { ModalStep } from '@/types/profitsword';

interface Props {
    onClose: () => void;
    onDone: () => void;
}

const STEPS = ['Upload', 'Validate', 'Review', 'Import', 'Done'] as const;

const VALIDATION_ISSUES = [
    { type: 'warn', msg: '3 rows have unrecognised GL account codes — will be mapped to default.' },
    { type: 'warn', msg: 'Column "NOI" missing in 2 sheets — values will be zero-filled.' },
    { type: 'info', msg: '847 rows ready to import across 4 properties.' },
];

export function ImportModal({ onClose, onDone }: Props) {
    const [step, setStep]         = useState<ModalStep>(0);
    const [progress, setProgress] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileRef    = useRef<HTMLInputElement>(null);
    const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

    const runProgress = (cb: () => void) => {
        clearTimer();
        setProgress(0);
        timerRef.current = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) { clearTimer(); cb(); return 100; }
                return Math.min(p + 2, 100);
            });
        }, 30);
    };

    useEffect(() => () => clearTimer(), []);

    const handleFile = (file: File) => {
        setFileName(file.name);
        setStep(1);
        runProgress(() => setStep(2));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    };

    const handleImport = () => {
        setStep(3);
        runProgress(() => setStep(4));
    };

    /* progress bar width for the stepper (0–100%) */
    const stepPct = (step / (STEPS.length - 1)) * 100;

    return (
        /* overlay — bottom sheet on mobile, centered on desktop */
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4">
            <div className="w-full rounded-t-2xl bg-white shadow-2xl sm:max-w-[520px] sm:rounded-2xl">

                {/* ── Header ── */}
                <div className="flex items-center justify-between border-b border-hair-2 px-5 py-4 sm:px-6">
                    <div>
                        <h2 className="text-[15px] font-bold text-ink-900">Import Profitsword Data</h2>
                        <p className="text-[12px] text-muted">Upload an Excel file exported from Profitsword</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface-soft hover:text-ink-900"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* ── Stepper ── */}
                <div className="border-b border-hair-2 px-5 pb-3 pt-4 sm:px-6">
                    {/* top row: current label + counter */}
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-[12.5px] font-semibold text-ink-900">{STEPS[step]}</span>
                        <span className="text-[11.5px] text-muted">Step {step + 1} of {STEPS.length}</span>
                    </div>
                    {/* track */}
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-soft">
                        <div
                            className="absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-500"
                            style={{ width: `${stepPct}%` }}
                        />
                    </div>
                    {/* dots + labels — visible on desktop only */}
                    <div className="mt-2.5 hidden sm:flex justify-between">
                        {STEPS.map((s, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                                    i < step ? 'bg-good' : i === step ? 'bg-accent' : 'bg-hair-2'
                                }`} />
                                <span className={`text-[10px] font-medium leading-none ${
                                    i === step ? 'text-accent' : i < step ? 'text-good' : 'text-muted'
                                }`}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="px-5 py-5 sm:px-6">

                    {/* Step 0 — Upload */}
                    {step === 0 && (
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileRef.current?.click()}
                            className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed py-10 transition-colors sm:py-14 ${
                                dragging ? 'border-accent bg-accent-soft' : 'border-hair-2 hover:border-accent/50 hover:bg-surface-soft'
                            }`}
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-soft">
                                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-muted" stroke="currentColor" strokeWidth="1.4">
                                    <path d="M12 15V3m0 0L8 7m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 16v1a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-1" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="px-4 text-center">
                                <p className="text-[14px] font-semibold text-ink-900">
                                    Drop your Profitsword Excel file here
                                </p>
                                <p className="mt-1 text-[12.5px] text-muted">or tap to browse — .xlsx or .xls</p>
                            </div>
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".xlsx,.xls"
                                className="hidden"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                            />
                        </div>
                    )}

                    {/* Steps 1 & 3 — Loading */}
                    {(step === 1 || step === 3) && (
                        <div className="flex flex-col items-center gap-5 py-8">
                            <div className={`h-12 w-12 animate-spin rounded-full border-4 ${
                                step === 1 ? 'border-accent/20 border-t-accent' : 'border-good/20 border-t-good'
                            }`} />
                            <div className="text-center">
                                <p className="text-[14px] font-semibold text-ink-900">
                                    {step === 1 ? 'Validating file…' : 'Importing data…'}
                                </p>
                                <p className="mt-1 max-w-[280px] truncate text-[12.5px] text-muted">
                                    {step === 1 ? fileName : 'Writing rows to database'}
                                </p>
                            </div>
                            <div className="w-full overflow-hidden rounded-full bg-surface-soft">
                                <div
                                    className={`h-2 rounded-full transition-all ${step === 1 ? 'bg-accent' : 'bg-good'}`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-[12px] font-semibold tabular-nums text-muted">{progress}%</span>
                        </div>
                    )}

                    {/* Step 2 — Review */}
                    {step === 2 && (
                        <div className="flex flex-col gap-3">
                            {/* file pill */}
                            <div className="flex items-center gap-3 rounded-xl border border-hair-2 bg-surface-soft px-4 py-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-hair-2 bg-white">
                                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-muted" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
                                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10.5px] font-semibold uppercase tracking-[.06em] text-muted">Selected file</p>
                                    <p className="truncate text-[13px] font-semibold text-ink-900">{fileName}</p>
                                </div>
                            </div>
                            {/* issues */}
                            {VALIDATION_ISSUES.map((issue, i) => (
                                <div
                                    key={i}
                                    className={`flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-[12.5px] leading-relaxed ${
                                        issue.type === 'warn' ? 'bg-warn-bg text-warn' : 'bg-accent-soft text-accent-ink'
                                    }`}
                                >
                                    <span className="mt-px shrink-0 font-bold">{issue.type === 'warn' ? '⚠' : 'ℹ'}</span>
                                    <span>{issue.msg}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 4 — Done */}
                    {step === 4 && (
                        <div className="flex flex-col items-center gap-4 py-8 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-good-bg">
                                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-good" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[16px] font-bold text-ink-900">Import complete!</p>
                                <p className="mt-1 text-[13px] text-muted">847 rows imported successfully.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-end gap-2.5 border-t border-hair-2 px-5 py-4 sm:px-6">
                    {step === 0 && (
                        <button
                            onClick={onClose}
                            className="h-9 rounded-lg border border-hair-2 px-5 text-[13px] font-medium text-ink-700 transition hover:bg-surface-soft"
                        >
                            Cancel
                        </button>
                    )}
                    {step === 2 && (
                        <>
                            <button
                                onClick={onClose}
                                className="h-9 rounded-lg border border-hair-2 px-4 text-[13px] font-medium text-ink-700 transition hover:bg-surface-soft"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImport}
                                className="h-9 rounded-lg bg-accent px-5 text-[13px] font-semibold text-white transition hover:bg-accent/90"
                            >
                                Import anyway
                            </button>
                        </>
                    )}
                    {step === 4 && (
                        <button
                            onClick={onDone}
                            className="h-9 rounded-lg bg-accent px-5 text-[13px] font-semibold text-white transition hover:bg-accent/90"
                        >
                            Done
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
