import type { ExportRecord, ExportStatus } from '@/types/exports';

export const fmt = (n: number): string =>
    '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function filterRecords(
    records: ExportRecord[],
    filter: ExportStatus | 'all',
): ExportRecord[] {
    if (filter === 'all') return records;
    return records.filter((r) => r.status === filter);
}