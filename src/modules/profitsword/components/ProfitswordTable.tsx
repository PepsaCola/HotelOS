import type { ImportRecord } from '@/types/profitsword';
import { STATUS_META } from '../lib/profitsword';

interface Props {
    rows: ImportRecord[];
    onRowClick: (r: ImportRecord) => void;
}

function StatusBadge({ status }: { status: ImportRecord['status'] }) {
    const m = STATUS_META[status];
    return (
        <span className={`inline-flex items-center gap-[5px] rounded-full ${m.bg} px-[9px] py-[3px] text-[11.5px] font-semibold ${m.text}`}>
            <span className={`h-[5px] w-[5px] rounded-full ${m.dot}`} />
            {m.label}
        </span>
    );
}

export function ProfitswordTable({ rows, onRowClick }: Props) {
    if (rows.length === 0) {
        return (
            <div className="grid min-h-[180px] place-items-center text-[13.5px] text-muted">
                No import records match the current filters.
            </div>
        );
    }

    return (
        // overflow-x-auto дозволяє горизонтальний скрол на мобільних екранах
        <div className="w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
            {/* min-w-[860px] гарантує, що стовпці не стискатимуться занадто сильно */}
            <table className="w-full min-w-[860px] border-collapse text-[13.5px]" style={{ tableLayout: 'fixed' }}>
                <colgroup>
                    <col style={{ width: 120 }} />
                    <col style={{ width: 130 }} />
                    <col style={{ width: 110 }} />
                    <col style={{ width: 110 }} />
                    <col style={{ width: 90 }} />
                    <col style={{ width: 130 }} />
                    <col style={{ width: 80 }} />
                    <col style={{ width: 90 }} />
                </colgroup>
                <thead>
                <tr>
                    {['Import Name', 'Forecast Period', 'Uploaded By', 'Rows', 'Failed', 'Status', 'Active', 'Last Sync'].map((h, i) => (
                        <th
                            key={i}
                            className={`whitespace-nowrap border-b border-hair-2 bg-surface-soft px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[.06em] text-muted ${
                                i === 3 || i === 4 ? 'text-right' : ''
                            }`}
                        >
                            {h}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((r) => {
                    return (
                        <tr
                            key={r.id}
                            onClick={() => onRowClick(r)}
                            className="h-[52px] cursor-pointer border-b border-hair transition-colors hover:bg-surface-soft last:border-0"
                        >
                            {/* Import Name */}
                            <td className="max-w-0 px-3.5 align-middle">
                                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-ink-900">
                                        {r.importName}
                                    </span>
                                <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] text-muted">
                                        {r.fileName}
                                    </span>
                            </td>

                            {/* Period */}
                            <td className="whitespace-nowrap px-3.5 align-middle text-[13px] text-muted">
                                {r.forecastPeriod}
                            </td>

                            {/* Uploaded By */}
                            <td className="whitespace-nowrap px-3.5 align-middle">
                                <span className="block text-[13px] text-ink-700">{r.uploadedBy}</span>
                                <span className="block text-[11.5px] text-muted">{r.uploadedAt}</span>
                            </td>

                            {/* Rows */}
                            <td className="whitespace-nowrap px-3.5 align-middle text-right">
                                {r.rows != null ? (
                                    <span className="block tabular-nums text-[14px] text-good">
                                            {r.rows.toLocaleString()}
                                        </span>
                                ) : (
                                    <span className="text-muted">—</span>
                                )}
                            </td>

                            {/* Failed */}
                            <td className="whitespace-nowrap px-3.5 align-middle text-right">
                                {r.rows != null ? (
                                    <span className={`block text-[14px] ${r.failedRows != null && r.failedRows > 0 ? 'text-crit' : 'text-ink-900'}`}>
                                            {r.failedRows}
                                        </span>
                                ) : (
                                    <span className="text-muted">—</span>
                                )}
                            </td>

                            {/* Status */}
                            <td className="whitespace-nowrap px-3.5 align-middle">
                                <StatusBadge status={r.status} />
                            </td>

                            {/* Active */}
                            <td className="whitespace-nowrap px-3.5 align-middle">
                                {r.active ? (
                                    <span className="flex w-fit items-center justify-center gap-1 rounded-full bg-[#eef0ff] px-[9px] py-[3px] tabular-nums text-[11.5px] font-semibold text-blue">
                                            <svg viewBox="0 0 24 24" width={14} height={14} fill="none">
                                                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Active
                                        </span>
                                ) : (
                                    <span className="text-muted">—</span>
                                )}
                            </td>

                            {/* Last Sync */}
                            <td className="max-w-0 px-3.5 align-middle">
                                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-ink-700">
                                        {r.lastSync}
                                    </span>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}