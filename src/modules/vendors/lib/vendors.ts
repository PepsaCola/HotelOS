import type { Vendor, VendorStatus, VendorDept, VendorsKpis, DocStatus, M3Status } from '@/types/vendors';

/* ─── Department metadata ─── */

export const DEPTS: Record<VendorDept, { name: string; color: string }> = {
    rooms: { name: 'Rooms', color: '#4a78f0' },
    fb:    { name: 'F&B',   color: '#e88a3c' },
    ag:    { name: 'A&G',   color: '#7a6df0' },
    it:    { name: 'IT',    color: '#119da4' },
    sm:    { name: 'S&M',   color: '#c7458a' },
    rm:    { name: 'R&M',   color: '#38a169' },
};

/* ─── Status metadata ─── */

export const STATUS_META: Record<VendorStatus, { label: string; bg: string; text: string; dot: string }> = {
    active:      { label: 'Active',           bg: 'bg-good-bg',     text: 'text-good',       dot: 'bg-good'    },
    expiring:    { label: 'Expiring Soon',    bg: 'bg-warn-bg',     text: 'text-warn',       dot: 'bg-warn'    },
    coi_expired: { label: 'COI Expired',      bg: 'bg-crit-bg',     text: 'text-crit',       dot: 'bg-crit'    },
    pending:     { label: 'Pending Approval', bg: 'bg-accent-soft', text: 'text-accent-ink', dot: 'bg-accent'  },
    inactive:    { label: 'Inactive',         bg: 'bg-surface-soft',text: 'text-muted',      dot: 'bg-muted'   },
};

/* ─── M3 metadata ─── */

export const M3_META: Record<M3Status, { label: string; bg: string; text: string; dot: string }> = {
    mapped:  { label: 'Mapped',     bg: 'bg-good-bg',      text: 'text-good',  dot: 'bg-good'  },
    pending: { label: 'Pending',    bg: 'bg-surface-soft', text: 'text-muted', dot: 'bg-muted' },
    none:    { label: 'Not mapped', bg: 'bg-surface-soft', text: 'text-muted', dot: 'bg-muted' },
};

/* ─── Doc status metadata ─── */

export const DOC_META: Record<DocStatus, { label: string; bg: string; text: string; dot: string }> = {
    ok:   { label: 'Valid',    bg: 'bg-good-bg',      text: 'text-good',  dot: 'bg-good'  },
    warn: { label: 'Expiring', bg: 'bg-warn-bg',      text: 'text-warn',  dot: 'bg-warn'  },
    miss: { label: 'Missing',  bg: 'bg-crit-bg',      text: 'text-crit',  dot: 'bg-crit'  },
    na:   { label: 'N/A',      bg: 'bg-surface-soft', text: 'text-muted', dot: 'bg-muted' },
};

/* ─── KPI aggregation ─── */

export function calcKpis(vendors: readonly Vendor[]): VendorsKpis {
    const active    = vendors.filter(v => v.status === 'active');
    const pending   = vendors.filter(v => v.status === 'pending');
    const expiring  = vendors.filter(v => v.status === 'expiring');
    const coiIssues = vendors.filter(v =>
        v.docs.coi === 'miss' || v.docs.coi === 'warn' || v.status === 'coi_expired',
    );
    const monthlyTotal =
        active.reduce((s, v) => s + v.monthlyCost, 0) +
        expiring.reduce((s, v) => s + v.monthlyCost, 0);

    return { active, pending, expiring, coiIssues, monthlyTotal, total: vendors.length };
}

/* ─── Filtering ─── */

export function filterVendors(
    vendors: readonly Vendor[],
    dept: string,
    status: string,
    search: string,
): Vendor[] {
    const q = search.trim().toLowerCase();
    return vendors.filter(v => {
        if (dept   !== 'all' && v.dept   !== dept)   return false;
        if (status !== 'all' && v.status !== status) return false;
        if (q && !v.name.toLowerCase().includes(q) && !v.category.toLowerCase().includes(q)) return false;
        return true;
    });
}

/* ─── Formatting ─── */

export function fmtUSD(n: number): { whole: string; cents: string } {
    const neg = n < 0;
    const abs = Math.abs(n);
    const [whole, cents] = abs.toFixed(2).split('.');
    return {
        whole: (neg ? '−$' : '$') + Number(whole).toLocaleString('en-US'),
        cents: '.' + cents,
    };
}

export function fmtCompact(n: number): { whole: string; unit: string } {
    const abs = Math.abs(n);
    if (abs >= 1e6) return { whole: '$' + (n / 1e6).toFixed(1), unit: 'M' };
    if (abs >= 1e3) return { whole: '$' + (n / 1e3).toFixed(1), unit: 'k' };
    return { whole: '$' + n.toFixed(0), unit: '' };
}