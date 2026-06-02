import { useState, useMemo } from 'react';
import type { Vendor } from '@/types/vendors';
import { useLayout } from '@/contexts/LayoutContext';
import { useVendors } from './useVendors';
import { calcKpis, filterVendors } from './lib/vendors';
import { VendorsKpis } from './components/VendorsKpis';
import { VendorTabs } from './components/VendorTabs';
import { VendorToolbar } from './components/VendorToolbar';
import { VendorTable } from './components/VendorTable';
import { VendorDrawer } from './components/VendorDrawer';
import { AddVendorPanel } from './components/AddVendorPanel';

export default function VendorsPage() {
    const { data, loading, error } = useVendors();
    const { displayOptions } = useLayout();

    const [mainTab,      setMainTab]      = useState('all');
    const [deptFilter,   setDeptFilter]   = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [selected,     setSelected]     = useState<Vendor | null>(null);
    const [addOpen,      setAddOpen]      = useState(false);

    const kpis = useMemo(() => (data ? calcKpis(data.vendors) : null), [data]);

    const filtered = useMemo(() => {
        if (!data) return [];
        const tabFiltered = mainTab === 'all' ? data.vendors : data.vendors.filter(v => {
            if (mainTab === 'coi_expired') return v.status === 'coi_expired' || v.docs.coi === 'miss';
            return v.status === mainTab;
        });
        return filterVendors(tabFiltered, deptFilter, statusFilter, '');
    }, [data, deptFilter, statusFilter, mainTab]);

    if (loading || !data) return <div className="grid min-h-[320px] place-items-center text-[13px] sm:text-sm text-muted-strong">Loading vendors…</div>;

    if (error) return (
        <div className="grid min-h-[320px] place-items-center rounded-2xl border border-crit-bg bg-crit-soft p-6 sm:p-10 text-center mx-4 sm:mx-0">
            <div>
                <p className="text-[13px] sm:text-sm font-semibold text-crit">Could not load vendors</p>
                <p className="mt-2 text-[12.5px] sm:text-[13px] text-muted-strong">{error.message}</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-4 sm:gap-5 text-ink-900">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-3">
                <div className="w-full md:w-auto">
                    <h1 className="text-[22px] sm:text-2xl font-bold leading-tight tracking-tight text-ink-900">Vendors / Contracts</h1>
                    <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12.5px] sm:text-[13px] text-muted-strong">
                        <span>April 2026</span>
                        <span className="hidden sm:inline text-muted">·</span>
                        <span className="flex items-center gap-1.5"><span className="sm:hidden text-muted">|</span> last sync 4 min ago</span>
                        <span className="hidden lg:inline text-muted">·</span>
                        <span className="flex items-center gap-1.5"><span className="lg:hidden text-muted">|</span> DoubleTree by Hilton Orlando Airport</span>
                    </div>
                </div>

                <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center mt-1 md:mt-0">
                    <button className="inline-flex h-9 w-full sm:w-auto justify-center items-center gap-1.5 sm:gap-2 rounded-[9px] border border-hair-2 bg-white px-2 sm:px-3.5 text-[12.5px] sm:text-[13.5px] font-medium text-ink-900 shadow-sm sm:shadow-none transition-colors hover:bg-surface-soft">
                        <svg viewBox="0 0 24 24" fill="none" className="h-[15px] w-[15px] shrink-0 text-ink-700" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                            <path d="M12 4v12m0 0l-4-4m4 4l4-4" />
                            <path d="M5 18v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" />
                        </svg>
                        <span className="truncate">Export Report</span>
                    </button>

                    <button onClick={() => setAddOpen(true)} className="inline-flex h-9 w-full sm:w-auto justify-center items-center gap-1.5 sm:gap-2 rounded-[9px] bg-[#0c1320] px-2 sm:px-3.5 text-[12.5px] sm:text-[13.5px] font-medium text-white shadow-soft transition-colors hover:bg-black">
                        <svg viewBox="0 0 24 24" fill="none" className="h-[15px] w-[15px] shrink-0" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        <span className="truncate">Add Vendor</span>
                    </button>
                </div>
            </div>

            {/* ── KPIs ── */}
            {displayOptions.showKpiStrip && kpis && <VendorsKpis kpis={kpis} />}

            <VendorTabs
                vendors={data.vendors}
                activeTab={mainTab}
                onChange={setMainTab}
            />

            <div className="overflow-hidden rounded-[14px] border border-hair-2 bg-white shadow-soft">

                <VendorToolbar
                    vendors={data.vendors}
                    deptFilter={deptFilter}
                    setDeptFilter={setDeptFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />

                <VendorTable vendors={filtered} onSelect={setSelected} />

            </div>

            {/* ── Drawers & Modals ── */}
            {selected && <VendorDrawer vendor={selected} onClose={() => setSelected(null)} />}
            {addOpen && <AddVendorPanel onClose={() => setAddOpen(false)} />}

        </div>
    );
}