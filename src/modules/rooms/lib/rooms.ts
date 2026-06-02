import type { ExpenseRow } from '@/types/rooms';

export function fmtUSD(n: number): string {
    const abs = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return n < 0 ? `-$${abs}` : `$${abs}`;
}

export function fmtSplit(n: number): { whole: string; cents: string } {
    const abs = Math.abs(n);
    const whole = Math.floor(abs);
    const cents = Math.round((abs - whole) * 100);
    const wholeStr = (n < 0 ? '-$' : '$') + whole.toLocaleString('en-US');
    const centsStr = '.' + String(cents).padStart(2, '0');
    return { whole: wholeStr, cents: centsStr };
}

export function fmtWeekVal(v: number | null): string {
    if (v === null) return '—';
    return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtPct(n: number): string {
    return n.toFixed(2) + '%';
}

export function fmtPerNight(v: number | null): string {
    if (v === null) return '$—';
    return '$' + v.toFixed(2);
}

export function varianceDir(v: number): 'pos' | 'neg' | 'flat' {
    if (v > 0) return 'pos';
    if (v < 0) return 'neg';
    return 'flat';
}

export function fmtVariance(v: number): string {
    if (v === 0) return '$—';
    const abs = Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return v < 0 ? `$(${abs})` : `+$${abs}`;
}

export function fmtRevVariance(v: number): string {
    return (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
}

export function countNonZero(rows: ExpenseRow[]): number {
    return rows.filter(r => !r.isZero && !r.isSubtotal).length;
}

export function countZero(rows: ExpenseRow[]): number {
    return rows.filter(r => r.isZero).length;
}

export function filterExpenses(rows: ExpenseRow[], hideZero: boolean): ExpenseRow[] {
    if (!hideZero) return rows;
    return rows.filter(r => !r.isZero);
}