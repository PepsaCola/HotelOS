import { useState } from 'react';
import type { DepartmentKey } from '@/types/rooms';
import { useRooms }           from './useRooms';
import { useLayout }          from '@/contexts/LayoutContext';
import { RoomsHotelStrip }    from './components/RoomsHotelStrip';
import { RoomsMetricsCard }   from './components/RoomsMetricsCard';
import { RoomsRevenueCard }   from './components/RoomsRevenueCard';
import { RoomsDetailTable } from './components/RoomsDetailTable';
import type { RoomsDisplayOpts } from './components/RoomsDetailTable';

/* ─── Icons ──────────────────────────────────────────────────── */
const ExportIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
    </svg>
);
const RefreshIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 5h18M6 12h12M10 19h4" />
    </svg>
);
const CalendarIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" />
    </svg>
);

/* ─── Page ───────────────────────────────────────────────────── */
interface RoomsPageProps {
    /** Which department's data to render. Defaults to Rooms. */
    department?: DepartmentKey;
}

export default function RoomsPage({ department = 'rooms' }: RoomsPageProps) {
    const { displayOptions } = useLayout();

    // The in-table "Hide zero-activity" button keeps its own local state.
    const [showZeroActivity, setShowZeroActivity] = useState(false);

    const displayOpts: RoomsDisplayOpts = {
        density:             displayOptions.density,
        showWeeklyBreakdown: true,
        showPercentRevenue:  true,
        showPerNight:        true,
        showCents:           true,
        showZeroActivity,
    };

    const { data, loading, error } = useRooms(department);

    if (loading || !data) {
        return (
            <div className="grid min-h-[320px] place-items-center text-sm text-muted">
                Loading department data…
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid min-h-[320px] place-items-center rounded-2xl border border-crit-bg bg-crit-soft p-10 text-center">
                <p className="text-sm font-semibold text-crit">Could not load department data</p>
                <p className="mt-2 text-[13px] text-muted">{error.message}</p>
            </div>
        );
    }

    const { property, metrics, revenue, expenses, footer } = data;

    return (
        <div className="flex flex-col gap-4 text-ink-900">

            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-3">
                <div className="w-full md:w-auto">
                    <h1 className="text-[22px] sm:text-2xl font-bold leading-tight tracking-tight text-ink-900">
                        {property.department}
                    </h1>
                    <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11.5px] sm:text-[12.5px] text-muted">
                        <b className="font-semibold text-ink-700">{property.periodLabel}</b>
                        <span className="hidden sm:inline">·</span>
                        <span className="flex items-center gap-1.5">
                            <span className="sm:hidden">|</span> period closes {property.closesDate}
                        </span>
                        <span className="hidden sm:inline">·</span>
                        <span className="flex items-center gap-1.5">
                            <span className="sm:hidden">|</span> last refresh {property.lastRefresh}
                        </span>
                    </div>
                </div>

                <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center mt-1 md:mt-0">
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex h-9 w-full justify-center items-center gap-2 rounded-lg border border-hair-2 bg-white px-3 sm:px-3.5 text-[12px] sm:text-[13px] font-semibold text-ink-700 shadow-soft transition hover:bg-surface-soft sm:w-auto"
                    >
                        <RefreshIcon />
                        <span>Refresh</span>
                    </button>
                    <button className="inline-flex h-9 w-full justify-center items-center gap-2 rounded-lg border border-hair-2 bg-white px-3 sm:px-3.5 text-[12px] sm:text-[13px] font-semibold text-ink-700 shadow-soft transition hover:bg-surface-soft sm:w-auto">
                        <CalendarIcon />
                        <span className="truncate max-w-[85px] sm:max-w-none">{property.periodLabel}</span>
                    </button>
                    <button className="col-span-2 inline-flex h-9 w-full justify-center items-center gap-2 rounded-lg bg-[#1a2540] px-4 text-[12px] sm:text-[13px] font-semibold text-white shadow-soft transition hover:bg-[#1a2540]/90 sm:col-span-1 sm:w-auto">
                        <ExportIcon />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Hotel info strip */}
            <RoomsHotelStrip property={property} />

            {/* Summary grid */}
            {displayOptions.showKpiStrip && (
                <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[340px_1fr]">
                    <RoomsMetricsCard rows={metrics} />
                    <RoomsRevenueCard rows={revenue} />
                </div>
            )}

            {/* Expense detail table */}
            <RoomsDetailTable
                rows={expenses}
                period={property.periodLabel}
                footer={footer}
                displayOpts={displayOpts}
                onToggleZeroActivity={() => setShowZeroActivity(v => !v)}
            />
        </div>
    );
}