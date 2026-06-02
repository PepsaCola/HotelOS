import type { ExportRecord } from '@/types/exports';
import { fmt } from '../lib/exports';

interface Props {
    rows: ExportRecord[];
    onRowClick: (r: ExportRecord) => void;
    onRetry: (inv: string) => void;
}

function StatusBadge({ status }: { status: ExportRecord['status'] }) {
    if (status === 'exported')
        return (
            <span className="inline-flex items-center gap-[5px] rounded-full bg-good-bg px-[9px] py-[3px] text-[11.5px] font-semibold text-good">
        <span className="h-[5px] w-[5px] rounded-full bg-good" />
        Exported to M3
      </span>
        );
    return (
        <span className="inline-flex items-center gap-[5px] rounded-full bg-crit-bg px-[9px] py-[3px] text-[11.5px] font-semibold text-crit">
      <span className="h-[5px] w-[5px] rounded-full bg-crit" />
      Export Failed
    </span>
    );
}

function MatchPill({ r }: { r: ExportRecord }) {
    if (!r.po)
        return (
            <span className="inline-flex items-center gap-1 rounded bg-crit-bg px-[6px] py-[1px] text-[10.5px] font-bold text-crit">
        ✕ No PO
      </span>
        );
    const ok = r.linesMatched === r.linesTotal;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded px-[6px] py-[1px] text-[10.5px] font-bold ${
                ok ? 'bg-good-bg text-good' : 'bg-crit-bg text-crit'
            }`}
        >
      {ok ? '✓' : '✕'} LN {r.linesMatched}/{r.linesTotal}
    </span>
    );
}

const RetryIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
        <path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export function ExportsTable({ rows, onRowClick, onRetry }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] border-collapse text-[13.5px]" style={{ tableLayout: 'fixed' }}>
                <colgroup>
                    <col style={{ width: 110 }} />
                    <col />
                    <col style={{ width: 76 }} />
                    <col style={{ width: 84 }} />
                    <col style={{ width: 100 }} />
                    <col style={{ width: 110 }} />
                    <col style={{ width: 152 }} />
                    <col style={{ width: 80 }} />
                    <col style={{ width: 90 }} />
                </colgroup>
                <thead>
                <tr>
                    {['Invoice #', 'Vendor', 'Received', 'Processed', 'Total', 'PO #', 'Status', 'Exported', ''].map(
                        (h, i) => (
                            <th
                                key={i}
                                className={`border-b border-hair-2 bg-surface-soft px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[.06em] text-muted whitespace-nowrap ${
                                    i === 4 ? 'text-right' : ''
                                }`}
                            >
                                {h}
                            </th>
                        ),
                    )}
                </tr>
                </thead>
                <tbody>
                {rows.map((r) => {
                    const isErr = r.status === 'error';
                    return (
                        <tr
                            key={r.inv}
                            onClick={() => onRowClick(r)}
                            className={`h-[52px] cursor-pointer border-b border-hair transition-colors last:border-0 ${
                                isErr ? 'bg-[#fffafa] hover:bg-red-50/60' : 'hover:bg-[#fafbff]'
                            }`}
                        >
                            {/* Invoice # */}
                            <td className="whitespace-nowrap px-3.5 align-middle">
                  <span className="block font-mono text-[13px] font-bold text-ink-900 tracking-[.01em]">
                    {r.inv}
                  </span>
                            </td>

                            {/* Vendor */}
                            <td className="max-w-0 px-3.5 align-middle">
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-ink-900">
                    {r.vendor}
                  </span>
                                <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] text-muted">
                    {r.cat}
                  </span>
                            </td>

                            {/* Received */}
                            <td className="whitespace-nowrap px-3.5 align-middle text-[13px] text-ink-700">
                                {r.received}
                            </td>

                            {/* Processed */}
                            <td className="whitespace-nowrap px-3.5 align-middle text-[13px] text-muted">
                                {r.processed ?? '—'}
                            </td>

                            {/* Amount */}
                            <td className="whitespace-nowrap px-3.5 align-middle text-right">
                  <span className="block text-[14px] font-bold text-ink-900 tabular-nums">
                    {fmt(r.amt)}
                  </span>
                                <span className="block text-[11.5px] text-muted">
                    {r.tax ? 'incl. tax' : 'no tax'}
                  </span>
                            </td>

                            {/* PO # */}
                            <td className="whitespace-nowrap px-3.5 align-middle">
                  <span className="block font-mono text-[12.5px] font-semibold text-ink-700">
                    {r.po ?? '—'}
                  </span>
                                <div className="mt-[3px] flex items-center gap-1">
                                    <MatchPill r={r} />
                                </div>
                            </td>

                            {/* Status */}
                            <td className="whitespace-nowrap px-3.5 align-middle">
                                <StatusBadge status={r.status} />
                            </td>

                            {/* Exported date */}
                            <td className="whitespace-nowrap px-3.5 align-middle">
                                <span className="block text-[13px] text-ink-700 tabular-nums">{r.exportedDate}</span>
                            </td>

                            {/* Actions */}
                            <td
    className="whitespace-nowrap px-2 align-middle text-right"
    onClick={(e) => e.stopPropagation()}
>
                                {isErr ? (
                                    <button
                                        onClick={() => onRetry(r.inv)}
                                        className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-[#f5c2c2] bg-white px-2.5 text-[12.5px] font-semibold text-crit transition hover:bg-crit-bg"
                                    >
                                        <RetryIcon /> Retry
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onRowClick(r)}
                                        className="inline-flex h-7 items-center rounded-lg border border-hair-2 bg-white px-2.5 text-[12.5px] font-medium text-ink-700 transition hover:bg-surface-muted"
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
    );
}