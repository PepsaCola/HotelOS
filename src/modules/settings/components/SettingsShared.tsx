import type { ReactNode } from 'react';
import type { BadgeTone, StatTone, AvatarAccent, IconKind, LogRow } from '@/types/settings';

/* ─── Avatar ─── */
const AVATAR_CLS: Record<AvatarAccent, string> = {
    brand:   'bg-accent text-white',
    rooms:   'bg-[#dbeafe] text-[#1d4ed8]',
    fb:      'bg-[#fce7f3] text-[#be185d]',
    admin:   'bg-[#f3f4f6] text-[#374151]',
    eng:     'bg-[#d1fae5] text-[#065f46]',
    sales:   'bg-[#fef3c7] text-[#92400e]',
    spa:     'bg-[#ede9fe] text-[#6d28d9]',
    good:    'bg-good-bg text-good',
    warn:    'bg-warn-bg text-warn',
    crit:    'bg-crit-bg text-crit',
    neutral: 'bg-surface-soft text-muted',
    green:   'bg-[#d1fae5] text-[#065f46]',
    dark:    'bg-[#1a2540] text-white',
};

export function Avatar({ initials, accent = 'neutral' }: { initials: string; accent?: AvatarAccent }) {
    return (
        <div className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl text-[11px] sm:text-[12px] font-bold ${AVATAR_CLS[accent]}`}>
            {initials}
        </div>
    );
}

/* ─── Badge ─── */
const BADGE_CLS: Record<BadgeTone, string> = {
    good:    'bg-good-bg text-good',
    warn:    'bg-warn-bg text-warn',
    crit:    'bg-crit-bg text-crit',
    neutral: 'bg-surface-soft text-muted',
    indigo:  'bg-accent-soft text-accent-ink',
};
const DOT_CLS: Record<BadgeTone, string> = {
    good:    'bg-good',
    warn:    'bg-warn',
    crit:    'bg-crit',
    neutral: 'bg-muted',
    indigo:  'bg-accent',
};

export function Badge({ tone, children }: { tone: BadgeTone; children: string }) {
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] sm:text-[11px] font-semibold ${BADGE_CLS[tone]}`}>
            <span className={`h-[4px] sm:h-[5px] w-[4px] sm:w-[5px] shrink-0 rounded-full ${DOT_CLS[tone]}`} />
            {children}
        </span>
    );
}

/* ─── Toggle ─── */
export function Toggle({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
    return (
        <button
            type="button"
            aria-pressed={checked}
            aria-label={label}
            onClick={onToggle}
            className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-hair-2'}`}
        >
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`} />
        </button>
    );
}

/* ─── StatCard ─── */
const STAT_CLS: Record<StatTone, string> = {
    good:    'border-good/20 bg-good-bg',
    warn:    'border-warn/20 bg-warn-bg',
    crit:    'border-crit/20 bg-crit-bg',
    default: 'border-hair-2 bg-surface-soft/50',
};

export function StatCard({ tone, label, value, sub, compact = false }: {
    tone: StatTone; label: string; value: string; sub: string; compact?: boolean;
}) {
    return (
        <div className={`flex flex-col h-full rounded-xl border p-3.5 ${STAT_CLS[tone]}`}>
            <p className="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[.06em] text-muted">{label}</p>
            <p className={`mt-0.5 font-bold tracking-[-0.02em] text-ink-900 ${compact ? 'text-[14px] sm:text-[15px]' : 'text-[20px] sm:text-[22px]'}`}>{value}</p>
            <p className="mt-1 text-[11px] sm:text-[11.5px] text-muted">{sub}</p>
        </div>
    );
}

/* ─── MetaLine ─── */
export function MetaLine({ parts }: { parts: ReadonlyArray<string | ReactNode> }) {
    return (
        <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
            {parts.map((part, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[11.5px] sm:text-[12px] text-muted">
                    {i > 0 && <span className="inline-block h-[3px] w-[3px] shrink-0 rounded-full bg-muted/40" />}
                    {part}
                </span>
            ))}
        </div>
    );
}

/* ─── LogList ─── */
export function LogList({ rows, monoMetaIndex }: { rows: ReadonlyArray<LogRow>; monoMetaIndex?: number }) {
    return (
        <>
            {rows.map((row, i) => (
                // На мобільному - колонка (аватар зверху, кнопка знизу на всю ширину)
                // На ПК - все в один рядок
                <div key={i} className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 border-b border-hair px-3.5 sm:px-5 py-3.5 sm:py-3 last:border-0">
                    <div className="flex items-start gap-3 min-w-0">
                        <Avatar initials={row.initials} accent={row.tone} />
                        <div className="min-w-0 flex-1 pt-[1px]">
                            <p className="text-[13px] sm:text-[13.5px] font-semibold text-ink-900 break-words">{row.title}</p>
                            <MetaLine
                                parts={row.meta.map((m, mi) =>
                                    monoMetaIndex === mi
                                        ? <code key={mi} className="font-mono text-[10.5px] sm:text-[11px]">{m}</code>
                                        : m
                                )}
                            />
                        </div>
                    </div>
                    <div className="shrink-0 w-full sm:w-auto mt-1 sm:mt-0">
                        <button className="inline-flex h-8 w-full sm:w-auto justify-center items-center rounded-lg border border-hair-2 bg-white px-3 sm:px-2.5 text-[12px] font-medium text-ink-700 shadow-sm sm:shadow-none transition hover:bg-surface-soft">
                            {row.action}
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
}

/* ─── Section wrapper ─── */
export function Section({ children }: { children: ReactNode }) {
    return (
        <div className="overflow-hidden rounded-[14px] border border-hair-2 bg-white shadow-sm sm:shadow-soft">
            {children}
        </div>
    );
}

/* ─── Section head ─── */
export function SectionHead({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
    return (
        // Мобільний: колонка. ПК: рядок.
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-hair-2 px-4 py-3.5 sm:px-5 sm:py-3 bg-[#fafbfc] sm:bg-white">
            <div>
                <h2 className="text-[13.5px] sm:text-[14px] font-bold text-ink-900">{title}</h2>
                {sub && <p className="mt-0.5 text-[12px] sm:text-[12.5px] text-muted">{sub}</p>}
            </div>
            {action && <div className="shrink-0 w-full sm:w-auto">{action}</div>}
        </div>
    );
}

/* ─── Settings Row ─── */
export function SettingsRow({ children }: { children: ReactNode }) {
    return (
        // НАЙВАЖЛИВІШЕ: на мобільному поля будуть під мітками, на ПК - справа
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 border-b border-hair px-4 py-3.5 sm:px-5 sm:py-3 last:border-0 hover:bg-[#fafbfc] transition-colors">
            {children}
        </div>
    );
}

/* ─── Toolbar ─── */
export function Toolbar({ children }: { children: ReactNode }) {
    return (
        // Горизонтальний скрол замість flex-wrap
        <div className="flex items-center gap-2 sm:gap-2.5 border-b border-hair-2 px-3 sm:px-5 py-2.5 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {children}
        </div>
    );
}

/* ─── Buttons ─── */
export function Btn({ children, variant = 'default', size = 'md', onClick, disabled, className = '' }: {
    children: ReactNode;
    variant?: 'default' | 'primary' | 'ghost' | 'danger';
    size?: 'sm' | 'md';
    onClick?: () => void;
    disabled?: boolean;
    className?: string; // Додано для кастомних класів типу w-full
}) {
    const base = 'inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition cursor-pointer disabled:opacity-40 shrink-0';
    const sz   = size === 'sm' ? 'h-8 px-3 text-[12.5px]' : 'h-9 px-4 text-[13px]';
    const vari = {
        default: 'border border-hair-2 bg-white text-ink-700 shadow-sm hover:bg-surface-soft',
        primary: 'bg-[#1a2540] text-white border border-[#1a2540] shadow-sm hover:bg-[#1a2540]/90',
        ghost:   'border-none bg-transparent text-ink-700 hover:bg-surface-soft',
        danger:  'bg-crit-bg text-crit border border-crit/20 hover:bg-crit hover:text-white',
    }[variant];
    return (
        <button type="button" disabled={disabled} onClick={onClick} className={`${base} ${sz} ${vari} ${className}`}>
            {children}
        </button>
    );
}

/* ─── Input / Select ─── */
export function SettingsInput({ value, onChange, disabled, readOnly }: {
    value: string; onChange?: (v: string) => void; disabled?: boolean; readOnly?: boolean;
}) {
    return (
        <input
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            onChange={e => onChange?.(e.target.value)}
            className="h-9 w-full rounded-lg border border-hair-2 bg-white px-3 text-[13px] sm:text-[13.5px] text-ink-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15 disabled:bg-surface-soft disabled:text-muted"
        />
    );
}

export function SettingsSelect({ value, onChange, children }: {
    value?: string; onChange?: (v: string) => void; children: ReactNode;
}) {
    return (
        <select
            value={value}
            onChange={e => onChange?.(e.target.value)}
            className="h-9 w-full sm:w-auto rounded-lg border border-hair-2 bg-white px-3 text-[13px] sm:text-[13.5px] text-ink-700 outline-none transition focus:border-accent"
        >
            {children}
        </select>
    );
}

export function SearchInput({ placeholder }: { placeholder?: string }) {
    return (
        <label className="relative flex w-full sm:min-w-[160px] sm:flex-1 items-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute left-3 h-4 w-4 text-muted" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
                placeholder={placeholder ?? 'Search…'}
                className="h-9 w-full rounded-lg border border-hair-2 bg-white pl-9 pr-3 text-[13px] sm:text-[13.5px] text-ink-900 placeholder:text-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
        </label>
    );
}

/* ─── Section Icons ─── */
export function SectionIcon({ kind }: { kind: IconKind }) {
    const cls = 'h-[16px] w-[16px] sm:h-[17px] sm:w-[17px] shrink-0';
    switch (kind) {
        case 'profile':  return <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a7 7 0 0 1 16 0v1" strokeLinecap="round"/></svg>;
        case 'property': return <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14" strokeLinejoin="round"/><rect x="9" y="13" width="6" height="8" rx="1"/></svg>;
        case 'grid':     return <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="8" height="7" rx="1.5"/><rect x="13" y="4" width="8" height="7" rx="1.5"/><rect x="3" y="13" width="8" height="7" rx="1.5"/><rect x="13" y="13" width="8" height="7" rx="1.5"/></svg>;
        case 'users':    return <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="7" r="4"/><path d="M2 21v-1a7 7 0 0 1 14 0v1" strokeLinecap="round"/><path d="M16 11a4 4 0 0 1 0 8M22 21v-1a7 7 0 0 0-5-6.7" strokeLinecap="round"/></svg>;
        case 'gl':       return <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.5"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/><path d="M16 3v4M8 3v4M16 17v4M8 17v4" strokeLinecap="round"/></svg>;
        case 'tax':      return <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.5"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 9h6M9 13h4" strokeLinecap="round"/></svg>;
        case 'catalog':  return <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4" strokeLinecap="round"/></svg>;
        case 'code':     return <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.5"><path d="M7 16l-4-4 4-4M17 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 4l-4 16" strokeLinecap="round"/></svg>;
        case 'chart':    return <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.5"><path d="M3 17l4-8 4 6 3-4 4 6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="19" cy="7" r="2"/></svg>;
        default:         return null;
    }
}