import { Fragment, useEffect, useState } from 'react';
import type { ImportRecord, DetailTab, FinancialRow, AuditEvent } from '@/types/profitsword';
import { useBreadcrumb, useLayout } from '@/contexts/LayoutContext';
import { STATUS_META, fmt } from '../lib/profitsword';

interface Props {
    record: ImportRecord;
    financialRows: readonly FinancialRow[];
    auditEvents: readonly AuditEvent[];
    onBack: () => void;
    onImport: () => void;
}

/* ─── Icons ─── */

const PropertyIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-[13px] w-[13px]" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" />
    </svg>
);
const ReprocessIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-[14px] w-[14px]" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4v5h5M20 20v-5h-5M20 9a9 9 0 0 0-15.46-5M4 15a9 9 0 0 0 15.46 5" />
    </svg>
);
const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-[14px] w-[14px]" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1M7 11l5 5 5-5M12 4v12" />
    </svg>
);
const CheckIcon = ({ className = 'h-3 w-3' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
    </svg>
);

/* ─── Financial-table column model ─── */

type Group = { label: string; bg?: 'forecast' | 'budget' | 'actuals'; variance?: boolean };

const GROUPS: Group[] = [
    { label: 'Week 1 · May 1–3' },
    { label: 'Week 2 · May 4–10' },
    { label: 'Week 3 · May 11–17' },
    { label: 'Week 4 · May 18–24' },
    { label: 'Week 5 · May 25–31' },
    { label: 'Primary Forecast', bg: 'forecast' },
    { label: 'Budget', bg: 'budget' },
    { label: 'Variance', variance: true },
    { label: 'Actuals Last Year', bg: 'actuals' },
    { label: 'Variance', variance: true },
];

const DATA_BG: Record<NonNullable<Group['bg']>, string> = {
    forecast: 'bg-[#eef2ff]',
    budget: 'bg-[#f6f2ea]',
    actuals: 'bg-[#edf7f1]',
};

const DESC_W = 'min-w-[240px] w-[240px]';

function fmtCell(v: number | string | undefined, dollar?: boolean): string {
    if (v === '' || v == null) return '';
    if (typeof v === 'string') return v;
    if (dollar) return '$' + v.toFixed(2);
    if (Number.isInteger(v)) return v.toLocaleString('en-US');
    return v.toFixed(1);
}
function fmtCellPct(v: number | string | undefined): string {
    if (v === '' || v === 0 || v == null) return '';
    return v + '%';
}

/* ─── Financial table row ─── */

function FinRow({ row }: { row: FinancialRow }) {
    const d = row.values ?? [];

    if (row.type === 'section') {
        return (
            <tr>
                <td className={`sticky left-0 z-[3] ${DESC_W} border-t-2 border-b border-r border-hair-2 bg-[#f6f6f4] py-[7px] pl-4 pr-3 text-left text-[11px] font-bold uppercase tracking-[.08em] text-ink-900`}>
                    ▾ {row.label}
                </td>
                <td colSpan={20} className="border-t-2 border-b border-hair-2 bg-[#f6f6f4]" />
            </tr>
        );
    }

    const isTotal = row.type === 'total';
    const isHighlight = row.type === 'highlight';
    const strong = isTotal || isHighlight;

    const rowBg = isTotal ? 'bg-[#f0f1f6]' : isHighlight ? 'bg-[#edf1ff]' : 'bg-white';
    const cellBorder = isTotal
        ? 'border-y-[1.5px] border-[#c8cadb]'
        : isHighlight
            ? 'border-y-[1.5px] border-[#c7d2fe]'
            : 'border-b border-hair';
    const descBg = isTotal ? 'bg-[#f0f1f6]' : isHighlight ? 'bg-[#e7ecff]' : 'bg-white';
    const descColor = isHighlight ? 'text-accent-ink' : isTotal ? 'text-[#0c1320]' : 'text-ink-700';
    const baseData = strong ? 'text-[13px] font-bold text-[#0c1320]' : 'text-ink-700';

    return (
        <tr>
            <td className={`sticky left-0 z-[1] ${DESC_W} ${cellBorder} ${isHighlight ? 'border-r-[#c7d2fe]' : 'border-r-hair-2'} border-r ${descBg} py-[5px] pl-4 pr-3 text-left text-[13px] ${strong ? 'font-bold' : ''} ${descColor}`}>
                {row.label}
            </td>
            {GROUPS.map((g, gi) => {
                const dataVal = d[gi * 2];
                const pctVal = d[gi * 2 + 1];

                let dataCls = baseData;
                if (g.variance && typeof dataVal === 'number' && dataVal !== 0) {
                    dataCls = `${strong ? 'text-[13px]' : ''} font-semibold ${dataVal > 0 ? 'text-good' : 'text-crit'}`;
                }
                const dataBg = g.bg ? DATA_BG[g.bg] : rowBg;

                return (
                    <Fragment key={gi}>
                        <td className={`${cellBorder} ${gi > 0 ? 'border-l border-l-hair-2' : ''} ${dataBg} whitespace-nowrap px-3 py-[5px] text-right tabular-nums ${dataCls}`}>
                            {fmtCell(dataVal, row.dollar)}
                        </td>
                        <td className={`${cellBorder} ${rowBg} whitespace-nowrap px-3 py-[5px] text-right text-[11.5px] tabular-nums text-[#9aa0a8]`}>
                            {fmtCellPct(pctVal)}
                        </td>
                    </Fragment>
                );
            })}
        </tr>
    );
}

/* ─── Financial report tab ─── */

function FinancialReport({ rows, record }: { rows: readonly FinancialRow[]; record: ImportRecord }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-hair-2 bg-white shadow-soft">
            {/* toolbar */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-hair px-4 py-[11px]">
                <span className="text-[13px] font-semibold text-ink-900">Current Hatch — Weekly Hatch Report</span>
                <span className="text-[12.5px] text-muted-strong">{record.property} · May 1–31, 2026</span>
                <div className="ml-auto hidden items-center gap-3.5 text-[12px] text-muted-strong lg:flex">
                    <span className="flex items-center gap-[5px]"><span className="h-2.5 w-2.5 rounded-sm bg-good-bg" />Positive variance</span>
                    <span className="flex items-center gap-[5px]"><span className="h-2.5 w-2.5 rounded-sm bg-crit-bg" />Negative variance</span>
                    <span className="flex items-center gap-[5px]"><span className="h-2.5 w-2.5 rounded-sm bg-[#0c1320]" />Key totals</span>
                </div>
            </div>

            {/* scrollable table */}
            <div className="overflow-x-auto">
                <table className="w-max min-w-full border-collapse text-[12.5px]">
                    <thead>
                        <tr>
                            <th
                                rowSpan={2}
                                className={`sticky left-0 z-[4] ${DESC_W} border-b border-r border-hair-2 bg-[#fafafa] py-[9px] pl-4 pr-3 text-left text-[10.5px] font-semibold uppercase tracking-[.05em] text-muted-strong`}
                            >
                                Description
                            </th>
                            {GROUPS.map((g, gi) => (
                                <th
                                    key={gi}
                                    colSpan={2}
                                    className="border-b border-l border-r border-hair-2 bg-[#f3f4f8] px-3 py-[9px] text-center text-[10px] font-semibold uppercase tracking-[.04em] text-accent-ink"
                                >
                                    {g.label}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            {GROUPS.map((g, gi) => (
                                <Fragment key={gi}>
                                    <th className={`border-b border-hair-2 ${gi > 0 ? 'border-l border-l-hair-2' : ''} ${g.bg ? DATA_BG[g.bg] : 'bg-[#fafafa]'} px-3 py-[6px] text-right text-[9.5px] font-semibold uppercase tracking-[.05em] text-[#9aa0a8]`}>
                                        Data
                                    </th>
                                    <th className="border-b border-hair-2 bg-[#fafafa] px-3 py-[6px] text-right text-[9.5px] font-semibold uppercase tracking-[.05em] text-[#9aa0a8]">
                                        %Rev
                                    </th>
                                </Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => <FinRow key={i} row={row} />)}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ─── Validation issues tab ─── */

function IssuesTab({ record }: { record: ImportRecord }) {
    const count = record.failedRows ?? 0;
    return (
        <div className="overflow-hidden rounded-2xl border border-hair-2 bg-white shadow-soft">
            <div className="flex items-center gap-3 border-b border-hair px-[18px] py-[14px]">
                <h3 className="text-[14px] font-bold text-ink-900">Validation Issues</h3>
                <span className="rounded-full bg-warn-bg px-2 py-0.5 text-[11.5px] font-semibold text-warn">{count} issues</span>
                <button className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-lg border border-hair-2 bg-white px-3 text-[12.5px] font-medium text-ink-700 transition hover:bg-surface-soft">
                    <DownloadIcon />
                    Download Error Report
                </button>
            </div>
            <div className="px-10 py-10 text-center text-muted-strong">
                <CheckIcon className="mx-auto mb-2.5 block h-9 w-9 text-good" />
                <div className="mb-1 font-semibold text-ink-900">No validation issues found</div>
                <div className="text-[13px]">
                    All {record.rows ?? 0} rows were imported successfully. No mapping errors or invalid values.
                </div>
            </div>
        </div>
    );
}

/* ─── Audit log tab ─── */

function AuditTab({ events }: { events: readonly AuditEvent[] }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-hair-2 bg-white shadow-soft">
            <div className="border-b border-hair px-[18px] py-[14px]">
                <h3 className="text-[14px] font-bold text-ink-900">Import Audit Timeline</h3>
            </div>
            <div className="flex flex-col px-[18px] py-[10px] pb-[18px]">
                {events.map((ev, i) => (
                    <div key={i} className="flex gap-3.5 py-2.5">
                        <div className="flex flex-col items-center">
                            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-good-bg text-good">
                                <CheckIcon />
                            </div>
                            {i < events.length - 1 && <div className="mt-1 min-h-[18px] w-px flex-1 bg-hair-2" />}
                        </div>
                        <div className="min-w-0 flex-1 pb-1">
                            <p className="text-[13.5px] font-medium text-ink-900">{ev.event}</p>
                            <p className="mt-0.5 text-[12px] text-muted-strong">{ev.time}</p>
                            {ev.detail && (
                                <p className="mt-1 rounded-md border border-hair bg-[#f9f9f8] px-2.5 py-1.5 text-[12.5px] text-ink-700">
                                    {ev.detail}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Detail header ─── */

function DetailHeader({ record, onImport }: { record: ImportRecord; onImport: () => void }) {
    const meta = STATUS_META[record.status];

    const stats: { label: string; value: string; small?: boolean; color?: string }[] = [
        { label: 'Rows Imported', value: record.rows != null ? record.rows.toLocaleString('en-US') : '—' },
        { label: 'Failed Rows', value: String(record.failedRows ?? 0), color: (record.failedRows ?? 0) > 0 ? 'text-crit' : 'text-[#7ce0a3]' },
        { label: 'Total Revenue', value: record.totalRevenue != null ? fmt(record.totalRevenue) : '—' },
        { label: 'GOP', value: record.gop != null ? fmt(record.gop) : '—' },
        { label: 'NOI', value: record.noi != null ? fmt(record.noi) : '—' },
        { label: 'Last Sync', value: record.lastSync, small: true },
    ];

    return (
        <div className="border-b border-hair-2 bg-white px-4 pb-5 pt-5 lg:px-7">
            {/* top row */}
            <div className="mb-[18px] flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-5">
                <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2.5">
                        <span className={`inline-flex items-center gap-[5px] rounded-full ${meta.bg} px-[10px] py-[3px] text-[11px] font-semibold ${meta.text}`}>
                            <span className={`h-[5px] w-[5px] rounded-full ${meta.dot}`} />
                            {meta.label}
                        </span>
                        {record.active && (
                            <span className="inline-flex items-center gap-[5px] rounded-full bg-accent-soft px-[10px] py-[3px] text-[11.5px] font-semibold text-accent-ink">
                                <CheckIcon className="h-3 w-3" />
                                Active Version
                            </span>
                        )}
                    </div>
                    <h2 className="text-[20px] font-bold leading-snug tracking-tight text-ink-900">
                        {record.importName.replace(/_/g, ' ')} — {record.forecastPeriod}
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-muted-strong">
                        <span className="flex items-center gap-[5px]"><PropertyIcon />{record.property}</span>
                        <span className="text-hair-2">·</span>
                        <span>Period: {record.forecastPeriod}</span>
                        <span className="text-hair-2">·</span>
                        <span>Uploaded by {record.uploadedBy} · {record.uploadedAt}</span>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <button
                        onClick={onImport}
                        className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-hair-2 bg-white px-3.5 text-[13.5px] font-medium text-ink-900 transition hover:bg-surface-soft"
                    >
                        <ReprocessIcon />
                        Reprocess
                    </button>
                    <button className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-hair-2 bg-white px-3.5 text-[13.5px] font-medium text-ink-900 transition hover:bg-surface-soft">
                        <DownloadIcon />
                        Download CSV
                    </button>
                </div>
            </div>

            {/* stat strip */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 border-t border-hair pt-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0">
                {stats.map((s, i) => (
                    <div key={s.label} className={i < stats.length - 1 ? 'lg:mr-5 lg:border-r lg:border-hair lg:pr-5' : ''}>
                        <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-[.07em] text-muted-strong">{s.label}</div>
                        <div className={`tabular-nums ${s.small ? 'text-[13.5px] font-medium' : 'text-[18px] font-bold'} ${s.color ?? 'text-ink-900'}`}>
                            {s.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Main component ─── */

export function ProfitswordDetail({ record, financialRows, auditEvents, onBack, onImport }: Props) {
    const [tab, setTab] = useState<DetailTab>('report');
    const issueCount = record.failedRows ?? 0;
    const { setFullBleed } = useLayout();

    useBreadcrumb([{ label: 'Profitsword', onClick: onBack }, { label: record.fileName }]);

    // The detail uses the full content width (no page padding) — like the mock.
    useEffect(() => {
        setFullBleed(true);
        return () => setFullBleed(false);
    }, [setFullBleed]);

    const tabs: { id: DetailTab; label: string; badge?: number }[] = [
        { id: 'report', label: 'Financial Report' },
        { id: 'issues', label: 'Validation Issues', badge: issueCount },
        { id: 'audit', label: 'Audit Log' },
    ];

    return (
        <div className="flex flex-col">
            <DetailHeader record={record} onImport={onImport} />

            {/* Body — padded, full content width */}
            <div className="flex flex-col gap-5 px-4 py-5 lg:px-7 lg:py-6">
                {/* section tabs */}
                <div className="flex w-max max-w-full gap-0.5 overflow-x-auto rounded-[11px] bg-surface-chip p-1">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-[7px] text-[13px] font-medium transition ${
                                tab === t.id
                                    ? 'bg-white text-ink-900 shadow-soft ring-1 ring-hair-2'
                                    : 'text-muted-strong hover:text-ink-900'
                            }`}
                        >
                            {t.label}
                            {t.badge != null && (
                                <span className="rounded-full bg-warn-bg px-[7px] py-0.5 text-[11px] font-semibold text-warn">{t.badge}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* tab content */}
                {tab === 'report' && <FinancialReport rows={financialRows} record={record} />}
                {tab === 'issues' && <IssuesTab record={record} />}
                {tab === 'audit' && <AuditTab events={auditEvents} />}
            </div>
        </div>
    );
}
