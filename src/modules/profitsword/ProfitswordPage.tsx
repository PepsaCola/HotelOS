import { useState, useMemo } from 'react';
import type { ImportRecord } from '@/types/profitsword';
import { useLayout } from '@/contexts/LayoutContext';
import { useProfitsword } from './useProfitsword';
import { filterRecords, uniqueProperties } from './lib/profitsword';
import { ProfitswordKpis } from './components/ProfitswordKpis';
import { ProfitswordTable } from './components/ProfitswordTable';
import { ProfitswordDetail } from './components/ProfitswordDetail';
import { ProfitswordToolbar } from './components/ProfitswordToolbar';
import { ImportModal } from './components/ImportModal';

const RefreshIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5" />
        <path d="M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5" />
    </svg>
);
const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1M7 11l5 5 5-5M12 4v12" />
    </svg>
);

export default function ProfitswordPage() {
    const { data, loading, error } = useProfitsword();
    const { displayOptions } = useLayout();

    const [search,   setSearch]   = useState('');
    const [status,   setStatus]   = useState('All');
    const [property, setProperty] = useState('All');
    const [detail,   setDetail]   = useState<ImportRecord | null>(null);
    const [modal,    setModal]    = useState(false);

    const properties = useMemo(
        () => (data ? uniqueProperties(data.records) : ['All']),
        [data],
    );

    const rows = useMemo(() => {
        if (!data) return [];
        return filterRecords(data.records, search, status, property);
    }, [data, search, status, property]);

    const handleImport = (r?: ImportRecord) => {
        if (r) setDetail(null);
        setModal(true);
    };

    const handleClear = () => {
        setSearch('');
        setStatus('All');
        setProperty('All');
    };

    if (loading || !data) {
        return (
            <div className="grid min-h-[320px] place-items-center text-sm text-muted-strong">
                Loading Profitsword data…
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid min-h-[320px] place-items-center rounded-2xl border border-crit-bg bg-crit-soft p-10 text-center">
                <p className="text-sm font-semibold text-crit">Could not load Profitsword data</p>
                <p className="mt-2 text-[13px] text-muted-strong">{error.message}</p>
            </div>
        );
    }

    /* ── Detail view ── */
    if (detail) {
        return (
            <div className="flex flex-col gap-5 text-ink-900">
                <ProfitswordDetail
                    record={detail}
                    financialRows={data.financialRows}
                    auditEvents={data.auditEvents}
                    onBack={() => setDetail(null)}
                    onImport={() => handleImport(detail)}
                />
                {modal && <ImportModal onClose={() => setModal(false)} onDone={() => setModal(false)} />}
            </div>
        );
    }

    /* ── List view ── */
    return (
        <div className="flex flex-col gap-5 text-ink-900">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="w-full sm:w-auto">
                    <h1 className="text-[22px] sm:text-2xl font-bold leading-tight tracking-tight text-ink-900">
                        Profitsword Imports
                    </h1>
                    <p className="mt-0.5 text-[12.5px] sm:text-[13.5px] text-muted">
                        Forecast & budget file import center<span className={'px-2'}>·</span>11 imports this period

                    </p>
                </div>
                <div className="grid w-full grid-cols-2 gap-2 sm:mt-0 sm:flex sm:w-auto sm:items-center">
                    <button
                        className="inline-flex h-9 w-full sm:w-auto items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-transparent px-2 sm:px-3.5 text-[12.5px] sm:text-[13px] font-medium text-ink-700 transition hover:bg-surface-muted"
                    >
                        <DownloadIcon />
                        <span>Download Template</span>
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex h-9 w-full sm:w-auto items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-hair-2 bg-white px-2 sm:px-3.5 text-[12.5px] sm:text-[13px] font-medium text-ink-700 shadow-sm transition hover:bg-surface-soft"
                    >
                        <RefreshIcon />
                        <span>Reprocess</span>
                    </button>
                    <button
                        onClick={() => handleImport()}
                        className="col-span-2 inline-flex h-9 w-full sm:w-auto sm:col-span-1 items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-[#14151a] px-2 sm:px-4 text-[12.5px] sm:text-[13px] font-semibold text-white shadow-soft transition hover:bg-accent/90"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        <span className="truncate">Import CSV</span>
                    </button>
                </div>
            </div>

            {/* KPIs */}
            {displayOptions.showKpiStrip && <ProfitswordKpis records={data.records} />}


            {/* Table */}
            <div className="overflow-hidden rounded-[14px] border border-hair-2 bg-white shadow-soft">
                <ProfitswordToolbar
                    search={search}       setSearch={setSearch}
                    status={status}       setStatus={setStatus}
                    property={property}   setProperty={setProperty}
                    properties={properties}
                    onClear={handleClear}
                />
                <ProfitswordTable rows={rows} onRowClick={setDetail}/>
            </div>

            {modal && <ImportModal onClose={() => setModal(false)} onDone={() => setModal(false)} />}
        </div>
    );
}