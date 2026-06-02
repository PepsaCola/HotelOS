import { useState, useMemo } from 'react';
import type { ExportRecord } from '@/types/exports';
import type { ExportStatus } from '@/types/exports';
import { useLayout } from '@/contexts/LayoutContext';
import { useExports } from './useExports';
import { filterRecords } from './lib/exports';
import { ExportsKpis } from './components/ExportsKpis';
import { ExportsTabs } from './components/ExportsTabs';
import { ExportsToolbar } from './components/ExportsToolbar';
import { ExportsTable } from './components/ExportsTable';
import { ExportsPager } from './components/ExportsPager';
import { ExportsDrawer } from './components/ExportsDrawer';

type Filter = ExportStatus | 'all';

export default function ExportsPage() {
    const { data, loading, error } = useExports();
    const { displayOptions } = useLayout();

    const [records, setRecords] = useState<ExportRecord[] | null>(null);
    const [filter, setFilter] = useState<Filter>('all');
    const [drawer, setDrawer] = useState<ExportRecord | null>(null);

    useMemo(() => {
        if (data && !records) setRecords(data.records.map((r) => ({ ...r })));
    }, [data]);

    function retryExport(inv: string) {
        const patch: Partial<ExportRecord> = {
            status: 'exported',
            glBatch: 'M3-GL-202604-RTY',
            exportedAt: 'Just now',
            exportedDate: 'Today',
            exportedSub: 'Manual retry',
        };
        setRecords((prev) => prev ? prev.map((r) => r.inv === inv ? { ...r, ...patch } : r) : prev);
        setDrawer((prev) => prev?.inv === inv ? { ...prev, ...patch } as ExportRecord : prev);
    }

    const rows = useMemo(() => filterRecords(records ?? [], filter), [records, filter]);
    const counts = useMemo(() => ({
        all:      (records ?? []).length,
        exported: (records ?? []).filter((r) => r.status === 'exported').length,
        error:    (records ?? []).filter((r) => r.status === 'error').length,
    }), [records]);

    if (loading || !data) {
        return (
            <div className="grid min-h-[320px] place-items-center text-sm text-muted-strong">
                Loading exports…
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid min-h-[320px] place-items-center rounded-2xl border border-crit-bg bg-crit-soft p-10 text-center">
                <p className="text-sm font-semibold text-crit">Could not load exports</p>
                <p className="mt-2 text-[13px] text-muted-strong">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5 text-ink-900">
            {/* Page header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                {/* ── Текстовий блок з мета-даними ── */}
                <div className="w-full sm:w-auto">
                    <h1 className="text-[22px] sm:text-2xl font-bold leading-tight tracking-tight text-ink-900">
                        Exports / M3
                    </h1>

                    {/* Адаптивна інфо-лінія без ризику кривих переносів */}
                    <div
                        className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12.5px] sm:text-[13.5px] text-muted">
                        <span className="font-medium text-ink-700">{data.period}</span>

                        <span className="hidden sm:inline">·</span>
                        <span className="flex items-center gap-1.5">
                <span className="sm:hidden">|</span> auto-export {data.autoExport}
            </span>

                        <span className="hidden sm:inline">·</span>
                        <span className="flex items-center gap-1.5">
                <span className="sm:hidden">|</span> next sync {data.nextSync}
            </span>
                    </div>
                </div>

                {/* ── Блок кнопок (Мобільний: 50/50 сітка | ПК: звичайний flex) ── */}
                <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center mt-1 sm:mt-0">

                    <button
                        className="inline-flex h-9 w-full sm:w-auto justify-center items-center gap-1.5 sm:gap-2 rounded-[9px] border border-hair-2 bg-white px-3 sm:px-3.5 text-[12.5px] sm:text-[13.5px] font-medium text-ink-900 shadow-sm sm:shadow-none transition hover:bg-surface-muted">
                        <svg viewBox="0 0 24 24" fill="none" className="h-[15px] w-[15px] shrink-0">
                            <path d="M12 3v13m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span className="truncate">Export Report</span>
                    </button>

                    <button
                        className="inline-flex h-9 w-full sm:w-auto justify-center items-center gap-1.5 sm:gap-2 rounded-[9px] border border-hair-2 bg-white px-3 sm:px-3.5 text-[12.5px] sm:text-[13.5px] font-medium text-ink-900 shadow-sm sm:shadow-none transition hover:bg-surface-muted">
                        <svg viewBox="0 0 24 24" fill="none" className="h-[15px] w-[15px] shrink-0">
                            <path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5" stroke="currentColor" strokeWidth="1.5"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5" stroke="currentColor" strokeWidth="1.5"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="truncate">Refresh</span>
                    </button>

                </div>

            </div>

            {displayOptions.showKpiStrip && <ExportsKpis data={data}/>}

            <div>
                <ExportsTabs active={filter} counts={counts} onChange={setFilter}/>

                <ExportsToolbar statusFilter={filter} onStatusChange={setFilter}/>

                <div className="overflow-hidden rounded-b-[14px] border border-hair-2 border-t-0 bg-white">
                    <ExportsTable rows={rows} onRowClick={setDrawer} onRetry={retryExport}/>
                    <ExportsPager shown={rows.length} total={data.totalExported}/>
                </div>
            </div>

            <ExportsDrawer
                record={drawer ? (records ?? []).find((r) => r.inv === drawer.inv) ?? null : null}
                onClose={() => setDrawer(null)}
                onRetry={retryExport}
            />
        </div>
    );
}