import { useState, useEffect } from 'react';
import type { Vendor } from '@/types/vendors';
import { DEPTS, STATUS_META, M3_META, DOC_META, fmtUSD } from '../lib/vendors';

const DOC_KEYS = ['coi', 'w9', 'cnt'] as const;

function Badge({ bg, text, dot, label }: { bg: string; text: string; dot: string; label: string }) {
    return (
        <span className={`inline-flex items-center gap-[5px] rounded-full ${bg} px-[9px] py-[3px] text-[11.5px] font-semibold ${text}`}>
            <span className={`h-[5px] w-[5px] rounded-full ${dot}`} />
            {label}
        </span>
    );
}

function DocChips({ docs }: { docs: Vendor['docs'] }) {
    return (
        <div className="flex items-center gap-1">
            {DOC_KEYS.map(k => {
                const m = DOC_META[docs[k]];
                return (
                    <span key={k} className={`rounded px-1.5 py-0.5 text-[10.5px] font-bold uppercase ${m.bg} ${m.text}`}>
                        {k.toUpperCase()}
                    </span>
                );
            })}
        </div>
    );
}

interface Props {
    vendors: readonly Vendor[]; // Додано readonly
    onSelect: (v: Vendor) => void;
}

export function VendorTable({ vendors, onSelect }: Props) {
    const [page, setPage] = useState(1);
    const PER_PAGE = 10;

    // Скидаємо сторінку на першу, якщо змінився фільтр/вкладка і дані оновилися
    useEffect(() => {
        setPage(1);
    }, [vendors.length]);

    const totalPages = Math.max(1, Math.ceil(vendors.length / PER_PAGE));
    const pageSlice  = vendors.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="bg-white ">

            {/* Table */}
            {/* Додано плавний скрол для iOS */}
            <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
                <table className="w-full min-w-[960px] border-collapse text-[13.5px]" style={{tableLayout: 'fixed'}}>
                    <colgroup>
                        <col style={{width: 200}}/>
                        <col style={{width: 100}}/>
                        <col style={{width: 120}}/>
                        <col style={{width: 115}}/>
                        <col style={{width: 75}}/>
                        <col style={{width: 115}}/>
                        <col style={{width: 110}}/>
                        <col style={{width: 95}}/>
                        <col style={{width: 135}}/>
                        <col style={{width: 116}}/>
                    </colgroup>
                    <thead>
                    <tr className="border-b border-hair-2 bg-surface-soft">
                        {['Vendor', 'Department', 'Monthly Cost', 'Contract End', 'Notice', 'COI Expires', 'Documents', 'M3', 'Status', ''].map((h, i) => (
                            <th key={i}
                                className={`px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-muted whitespace-nowrap ${i === 2 ? 'text-right' : 'text-left'}`}>
                                {h}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {pageSlice.length === 0 ? (
                        <tr>
                            <td colSpan={10} className="py-12 text-center text-[13.5px] text-muted">
                                No vendors match the current filters.
                            </td>
                        </tr>
                    ) : pageSlice.map(v => {
                        const dept = DEPTS[v.dept];
                        const statusM = STATUS_META[v.status];
                        const m3M = M3_META[v.m3];
                        const cost = fmtUSD(v.monthlyCost);
                        const coiCrit = v.docs.coi === 'miss' || v.status === 'coi_expired';
                        const coiWarn = v.docs.coi === 'warn';
                        const endWarn = v.status === 'expiring';

                        return (
                            <tr
                                key={v.id}
                                onClick={() => onSelect(v)}
                                className="h-[52px] cursor-pointer border-b border-hair transition-colors last:border-0 hover:bg-[#fafbff]"
                            >
                                {/* Усі комірки залишаються як були у вашому коді... */}
                                {/* Vendor */}
                                <td className="max-w-0 px-3.5 align-middle">
                                    <span
                                        className="block overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-ink-900">{v.name}</span>
                                    <span
                                        className="block overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] text-muted">{v.category}</span>
                                </td>

                                {/* Department */}
                                <td className="px-3.5 align-middle">
                                    <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-700">
                                        <span className="h-2 w-2 shrink-0 rounded-full"
                                              style={{background: dept.color}}/>
                                        {dept.name}
                                    </span>
                                </td>

                                {/* Monthly cost */}
                                <td className="whitespace-nowrap px-3.5 align-middle text-right">
                                    <span className="font-bold text-ink-900 tabular-nums">
                                        {cost.whole}<span
                                        className="text-[12px] font-normal text-muted">{cost.cents}</span>
                                    </span>
                                    <span className="block text-[11.5px] text-muted">
                                        {v.costType === 'fixed' ? 'fixed / mo' : 'variable'}
                                    </span>
                                </td>

                                {/* Contract end */}
                                <td className={`whitespace-nowrap px-3.5 align-middle text-[13px] ${endWarn ? 'font-semibold text-warn' : 'text-ink-700'}`}>
                                    {v.contractEnd ?? <span className="text-muted">—</span>}
                                </td>

                                {/* Notice */}
                                <td className="whitespace-nowrap px-3.5 align-middle text-[13px] text-muted">
                                    {v.noticeDays ? `${v.noticeDays} days` : '—'}
                                </td>

                                {/* COI expires */}
                                <td className={`whitespace-nowrap px-3.5 align-middle text-[13px] ${coiCrit ? 'font-semibold text-crit' : coiWarn ? 'font-semibold text-warn' : 'text-ink-700'}`}>
                                    {v.coiExpires ?? <span className="text-muted">—</span>}
                                </td>

                                {/* Docs */}
                                <td className="px-3.5 align-middle">
                                    <DocChips docs={v.docs}/>
                                </td>

                                {/* M3 */}
                                <td className="px-3.5 align-middle">
                                    <Badge {...m3M} label={m3M.label}/>
                                </td>

                                {/* Status */}
                                <td className="px-3.5 align-middle">
                                    <Badge {...statusM} label={statusM.label}/>
                                </td>

                                {/* Action */}
                                <td className="whitespace-nowrap px-2 align-middle text-right"
                                    onClick={e => e.stopPropagation()}>
                                    {v.status === 'coi_expired' && (
                                        <button
                                            className="inline-flex h-7 items-center rounded-lg bg-[#1a2540] px-2.5 text-[12.5px] font-semibold text-white transition hover:bg-[#1a2540]/90">
                                            Upload COI
                                        </button>
                                    )}
                                    {v.status === 'expiring' && (
                                        <button
                                            className="inline-flex h-7 items-center rounded-lg bg-[#1a2540] px-2.5 text-[12.5px] font-semibold text-white transition hover:bg-[#1a2540]/90">
                                            Renew
                                        </button>
                                    )}
                                    {v.status === 'pending' && (
                                        <button
                                            className="inline-flex h-7 items-center rounded-lg bg-[#1a2540] px-2.5 text-[12.5px] font-semibold text-white transition hover:bg-[#1a2540]/90">
                                            Review
                                        </button>
                                    )}
                                    {(v.status === 'active' || v.status === 'inactive') && (
                                        <button
                                            onClick={() => onSelect(v)}
                                            className="inline-flex h-7 items-center rounded-lg border border-hair-2 bg-white px-2.5 text-[12.5px] font-medium text-ink-700 transition hover:bg-surface-soft"
                                        >
                                            View
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Pager — always visible. Перероблено під мобільний адаптив */}
            <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-hair-2 px-3 sm:px-4 py-3 text-[12.5px] text-muted">
                <span className="text-center sm:text-left">
                    Showing {vendors.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, vendors.length)} of {vendors.length}
                </span>

                <div className="flex items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-hair-2 text-ink-700 transition hover:bg-surface-soft disabled:opacity-30"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor"
                                 strokeWidth="2" strokeLinecap="round">
                                <path d="M15 18l-6-6 6-6"/>
                            </svg>
                        </button>

                        {Array.from({length: totalPages}, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                onClick={() => setPage(n)}
                                className={`flex h-7 w-7 items-center justify-center rounded-lg text-[12.5px] font-semibold transition ${
                                    page === n ? 'bg-accent text-white' : 'border border-hair-2 text-ink-700 hover:bg-surface-soft'
                                }`}
                            >
                                {n}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-hair-2 text-ink-700 transition hover:bg-surface-soft disabled:opacity-30"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor"
                                 strokeWidth="2" strokeLinecap="round">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </button>
                    </div>
                    <span className="hidden sm:inline">Lines per page</span>
                </div>
            </div>

        </div>
    );
}