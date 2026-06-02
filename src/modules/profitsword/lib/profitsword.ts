import type { ImportRecord, ImportStatus } from '@/types/profitsword';

export const STATUS_META: Record<ImportStatus, { label: string; bg: string; text: string; dot: string }> = {
    'Imported':       { label: 'Imported',       bg: 'bg-good-bg',     text: 'text-good',        dot: 'bg-good' },
    'Partial Import': { label: 'Partial Import',  bg: 'bg-warn-bg',     text: 'text-warn',        dot: 'bg-warn' },
    'Processing':     { label: 'Processing',      bg: 'bg-accent-soft', text: 'text-accent-ink',  dot: 'bg-accent' },
    'Needs Mapping':  { label: 'Needs Mapping',   bg: 'bg-warn-bg',     text: 'text-warn',        dot: 'bg-warn' },
    'Archived':       { label: 'Archived',        bg: 'bg-surface-soft',text: 'text-muted',       dot: 'bg-muted' },
    'Failed':         { label: 'Failed',          bg: 'bg-crit-bg',     text: 'text-crit',        dot: 'bg-crit' },
};

export function filterRecords(
    records: readonly ImportRecord[],
    search: string,
    status: string,
    property: string,
): ImportRecord[] {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
        if (status !== 'All' && r.status !== status) return false;
        if (property !== 'All' && r.property !== property) return false;
        if (q && !r.importName.toLowerCase().includes(q) && !r.fileName.toLowerCase().includes(q)) return false;
        return true;
    });
}

export function uniqueProperties(records: readonly ImportRecord[]): string[] {
    return ['All', ...Array.from(new Set(records.map((r) => r.property)))];
}

export const fmt = (n: number): string => {
    const abs = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return n < 0 ? `-$${abs}` : `$${abs}`;
};

export const fmtPct = (n: number): string => n.toFixed(1) + '%';