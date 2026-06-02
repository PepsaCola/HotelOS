import { useState } from 'react';
import type { ExportRecord, InvoiceLine } from '@/types/exports';
import { fmt } from '../lib/exports';
import { DEFAULT_LINES } from '../data/exportsMock';

type DrawerTab = 'overview' | 'lines' | 'timeline';

interface Props {
    record: ExportRecord | null;
    onClose: () => void;
    onRetry: (inv: string) => void;
}

function StatusBadge({ status }: { status: ExportRecord['status'] }) {
    if (status === 'exported')
        return (
            <span className="inline-flex shrink-0 items-center gap-[5px] rounded-full bg-good-bg px-[9px] py-[3px] text-[11px] sm:text-[11.5px] font-semibold text-good">
                <span className="h-[5px] w-[5px] rounded-full bg-good shrink-0" />
                <span className="whitespace-nowrap">Exported to M3</span>
            </span>
        );
    return (
        <span className="inline-flex shrink-0 items-center gap-[5px] rounded-full bg-crit-bg px-[9px] py-[3px] text-[11px] sm:text-[11.5px] font-semibold text-crit">
            <span className="h-[5px] w-[5px] rounded-full bg-crit shrink-0" />
            <span className="whitespace-nowrap">Export Failed</span>
        </span>
    );
}

const RetryIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0">
        <path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

function OverviewTab({ r, onRetry }: { r: ExportRecord; onRetry: (inv: string) => void }) {
    const isErr = r.status === 'error';
    const details: [string, string][] = [
        ['Invoice #',   r.inv],
        ['Vendor',      r.vendor],
        ['Received',    r.received],
        ['Processed',   r.processed ?? '—'],
        ['Department',  r.dept],
        ['PO #',        r.po ?? '—'],
        ['A/C #',       r.gl],
        ['Exported At', r.exportedAt],
    ];

    return (
        <div className="flex flex-col gap-4 sm:gap-5">
            {isErr && (
                // На мобільному: col. На ПК: row
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 rounded-xl border border-[#f5c2c2] bg-crit-bg p-3.5 text-[12.5px] sm:text-[13px] text-crit">
                    <div className="flex items-start gap-2.5 sm:flex-1">
                        <svg viewBox="0 0 24 24" fill="none" className="mt-[2px] h-4 w-4 flex-shrink-0">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <div className="flex-1">
                            <div className="mb-0.5 font-bold">Export Failed</div>
                            <div className="text-[12px] sm:text-[12.5px] leading-relaxed text-[#9b2c2c]">{r.errorMsg}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => onRetry(r.inv)}
                        className="inline-flex w-full sm:w-auto justify-center flex-shrink-0 items-center gap-1.5 rounded-lg border border-[#f5c2c2] bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-crit transition hover:bg-crit-bg"
                    >
                        <RetryIcon /> Retry
                    </button>
                </div>
            )}

            {/* Dark summary card */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 rounded-[14px] bg-gradient-to-b from-[#101321] to-[#1a1f33] p-4 sm:p-5 text-white">
                <div>
                    <div className="mb-1 sm:mb-1.5 text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[.08em] text-white/50">
                        Invoice Total
                    </div>
                    <div className="text-[22px] sm:text-[26px] font-bold leading-none tracking-tight tabular-nums">
                        {fmt(r.amt)}
                    </div>
                </div>
                <div>
                    <div className="mb-1 sm:mb-1.5 text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[.08em] text-white/50">
                        A/C #
                    </div>
                    <div className="font-mono text-[22px] sm:text-[26px] font-bold leading-none tracking-tight truncate">
                        {r.gl}
                    </div>
                </div>
            </div>

            {/* Detail rows */}
            <div>
                <div className="mb-1 flex items-center justify-between border-b border-hair pb-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[.08em] text-muted">
                    Invoice Details
                </div>
                {details.map(([k, v]) => (
                    <div
                        key={k}
                        className="flex items-baseline justify-between gap-4 sm:gap-6 border-b border-hair py-2.5 last:border-0"
                    >
                        <span className="flex-shrink-0 text-[12.5px] sm:text-[13px] text-muted">{k}</span>
                        <span className="text-right font-mono text-[12.5px] sm:text-[13px] font-semibold text-ink-900 tabular-nums">
                            {v}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function LinesTab({ r }: { r: ExportRecord }) {
    const lines: InvoiceLine[] = r.lines ?? (DEFAULT_LINES as InvoiceLine[]);
    const subtotal = lines.reduce((s, l) => s + l.qty * l.unit, 0);
    const shipping = 0;
    const tax = 124.41;
    const total = subtotal + tax;

    return (
        <div>
            <div className="mb-2.5 flex items-center justify-between border-b border-hair pb-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[.08em] text-muted">
                Line Items
                <span className="inline-flex items-center rounded-full bg-neutral-bg px-2 sm:px-[9px] py-0.5 sm:py-[3px] text-[10.5px] sm:text-[11.5px] font-semibold normal-case text-neutral-ink">
                    {lines.length} items
                </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-hair-2">
                <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
                    <table className="w-full min-w-[460px] border-collapse text-[12.5px] sm:text-[13px]">
                        <thead>
                        <tr>
                            <th className="w-[60px] border-b border-hair-2 bg-surface-soft px-2.5 sm:px-3 py-2 sm:py-2.5 text-right text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[.06em] text-muted whitespace-nowrap">
                                Qty / Unit
                            </th>
                            <th className="border-b border-hair-2 bg-surface-soft px-2.5 sm:px-3 py-2 sm:py-2.5 text-left text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[.06em] text-muted">
                                Description
                            </th>
                            <th className="border-b border-hair-2 bg-surface-soft px-2.5 sm:px-3 py-2 sm:py-2.5 text-right text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[.06em] text-muted whitespace-nowrap">
                                Unit Price
                            </th>
                            <th className="border-b border-hair-2 bg-surface-soft px-2.5 sm:px-3 py-2 sm:py-2.5 text-right text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[.06em] text-muted whitespace-nowrap">
                                Amount
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {lines.map((l, i) => (
                            <tr key={i} className="border-b border-hair last:border-0 hover:bg-[#fafbfc]">
                                <td className="w-[60px] whitespace-nowrap px-2.5 sm:px-3 py-2 sm:py-2.5 text-right align-top">
                                    <span className="block font-bold text-ink-900">{l.qty}</span>
                                    <span className="block text-[10.5px] sm:text-[11px] text-muted">{l.pkg}</span>
                                </td>
                                <td className="px-2.5 sm:px-3 py-2 sm:py-2.5 font-medium leading-[1.45] text-ink-900 min-w-[140px]">{l.desc}</td>
                                <td className="whitespace-nowrap px-2.5 sm:px-3 py-2 sm:py-2.5 text-right font-semibold text-ink-900 tabular-nums align-top">
                                    {fmt(l.unit)}
                                </td>
                                <td className="whitespace-nowrap px-2.5 sm:px-3 py-2 sm:py-2.5 text-right font-semibold text-ink-900 tabular-nums align-top">
                                    {fmt(l.qty * l.unit)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-hair-2 bg-[#fafaf9] px-3.5 sm:px-4 py-3">
                    {[['Subtotal', fmt(subtotal)], ['Shipping', fmt(shipping)], ['Tax', fmt(tax)]].map(
                        ([k, v]) => (
                            <div key={k} className="flex items-baseline justify-between py-1 text-[12.5px] sm:text-[13px]">
                                <span className="text-[12px] sm:text-[12.5px] text-muted">{k}</span>
                                <span className="text-ink-900 tabular-nums">{v}</span>
                            </div>
                        ),
                    )}
                    <div className="mt-1 sm:mt-1.5 flex items-baseline justify-between border-t-2 border-hair-2 pt-2 sm:pt-2.5">
                        <span className="text-[12.5px] sm:text-[13px] font-semibold text-ink-700">Total</span>
                        <span className="text-[18px] sm:text-[20px] font-bold tracking-tight text-ink-900 tabular-nums">
                            {fmt(total)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimelineTab({ r }: { r: ExportRecord }) {
    const isErr = r.status === 'error';
    const events = [
        {
            dot: 'neutral',
            title: 'Invoice received',
            meta: r.received,
            detail: `Invoice ${r.inv} received from ${r.vendor}.`,
        },
        {
            dot: 'indigo',
            title: 'PO matching completed',
            meta: 'Apr 30 · 11:58 PM',
            detail: r.po
                ? `Matched to ${r.po} · ${r.linesMatched}/${r.linesTotal} lines confirmed.`
                : 'No matching PO found. Invoice flagged.',
        },
        isErr
            ? { dot: 'crit', title: 'Export to M3 failed', meta: r.exportedAt, detail: r.errorMsg ?? '' }
            : { dot: 'good', title: 'Exported to M3',      meta: r.exportedAt, detail: `GL batch ${r.glBatch} posted successfully.` },
    ];

    const dotCls: Record<string, string> = {
        good:    'bg-good border-good',
        crit:    'bg-crit border-crit',
        neutral: 'bg-muted border-muted',
        indigo:  'bg-accent border-accent',
    };

    return (
        <div>
            <div className="mb-3.5 border-b border-hair pb-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[.08em] text-muted">
                Export Log
            </div>
            <div className="flex flex-col">
                {events.map((t, i) => (
                    <div key={i} className="relative flex gap-2.5 sm:gap-3 pb-4 last:pb-0">
                        <div className="flex w-6 sm:w-7 flex-shrink-0 flex-col items-center">
                            <span className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full border-2 ${dotCls[t.dot]}`} />
                            {i < events.length - 1 && (
                                <span className="mt-1 w-px flex-1 bg-hair-2" />
                            )}
                        </div>
                        <div className="flex-1 pt-[1px] min-w-0">
                            <div className="text-[13px] sm:text-[13.5px] font-semibold text-ink-900 truncate">{t.title}</div>
                            <div className="mt-0.5 text-[11.5px] sm:text-[12px] tabular-nums text-muted truncate">{t.meta}</div>
                            {t.detail && (
                                <div className="mt-1.5 rounded-lg border border-hair bg-surface-soft p-2 sm:p-2.5 font-mono text-[11.5px] sm:text-[12.5px] leading-relaxed text-ink-700 break-words">
                                    {t.detail}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ExportsDrawer({ record, onClose, onRetry }: Props) {
    const [tab, setTab] = useState<DrawerTab>('overview');

    if (!record) return null;

    const tabs: { key: DrawerTab; label: string }[] = [
        { key: 'overview', label: 'Overview' },
        { key: 'lines',    label: 'Line Items' },
        { key: 'timeline', label: 'Export Log' },
    ];

    return (
        <div className="fixed inset-0 z-[80]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#0c1320]/30 animate-[fadeIn_.18s_ease]"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="absolute bottom-0 right-0 top-0 flex w-full max-w-full sm:max-w-[580px] flex-col overflow-hidden bg-white shadow-[-16px_0_48px_rgba(0,0,0,.16)] animate-[slideInRight_.22s_cubic-bezier(.2,.8,.2,1)]">
                {/* Header */}
                <div className="flex-shrink-0 border-b border-hair bg-white">
                    <div className="px-4 sm:px-5 pb-0 pt-4">
                        <div className="mb-2.5 flex items-start justify-between gap-2 sm:gap-3">
                            <div className="min-w-0">
                                <div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[.07em] text-muted">
                                    <span className="truncate max-w-[80px] sm:max-w-none">{record.received}</span>
                                    <span className="text-hair-2">·</span>
                                    <span className="truncate max-w-[80px] sm:max-w-none">{record.dept}</span>
                                    <span className="text-hair-2 hidden xs:inline">·</span>
                                    <StatusBadge status={record.status} />
                                </div>
                                <div className="text-[20px] sm:text-[22px] font-bold leading-snug tracking-tight text-ink-900 truncate">
                                    {record.inv}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-bg text-muted transition hover:bg-hair-2 hover:text-ink-900"
                            >
                                <svg viewBox="0 0 24 24" fill="none" className="h-[13px] w-[13px]">
                                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Drawer tabs */}
                    <div className="flex px-4 sm:px-5 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`whitespace-nowrap border-b-2 px-3 sm:px-3.5 py-2.5 text-[12.5px] sm:text-[13px] font-medium transition-colors ${
                                    tab === t.key
                                        ? 'border-accent text-ink-900'
                                        : 'border-transparent text-muted hover:text-ink-700'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 [-webkit-overflow-scrolling:touch]">
                    {tab === 'overview' && <OverviewTab r={record} onRetry={onRetry} />}
                    {tab === 'lines'    && <LinesTab r={record} />}
                    {tab === 'timeline' && <TimelineTab r={record} />}
                </div>

                {/* Footer (На мобільному: col. На ПК: row) */}
                <div className="flex flex-col sm:flex-row flex-shrink-0 gap-2 border-t border-hair bg-white p-3 sm:p-3.5">
                    <button className="flex flex-1 h-[38px] items-center justify-center gap-2 rounded-[9px] border border-hair-2 bg-white text-[13px] sm:text-[13.5px] font-medium text-ink-900 transition hover:bg-surface-muted">
                        <svg viewBox="0 0 24 24" fill="none" className="h-[14px] w-[14px] sm:h-[15px] sm:w-[15px] shrink-0">
                            <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span>Show Invoice</span>
                    </button>
                    <button className="flex flex-1 h-[38px] items-center justify-center gap-2 rounded-[9px] border border-hair-2 bg-white text-[13px] sm:text-[13.5px] font-medium text-ink-900 transition hover:bg-surface-muted">
                        <svg viewBox="0 0 24 24" fill="none" className="h-[14px] w-[14px] sm:h-[15px] sm:w-[15px] shrink-0">
                            <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span>Show PO Form</span>
                    </button>
                </div>
            </div>
        </div>
    );
}