import type { ExportStatus } from '@/types/exports';

type Filter = ExportStatus | 'all';

interface Props {
    active: Filter;
    counts: { all: number; exported: number; error: number };
    onChange: (f: Filter) => void;
}

export function ExportsTabs({ active, counts, onChange }: Props) {
    const tabs: { key: Filter; label: string; crit?: boolean }[] = [
        { key: 'all',      label: 'All' },
        { key: 'exported', label: 'Exported' },
        { key: 'error',    label: 'Failed', crit: true },
    ];

    const countFor = (k: Filter) =>
        k === 'all' ? counts.all : k === 'exported' ? counts.exported : counts.error;

    return (
        <div className="flex gap-0.5 rounded-[11px] bg-surface-chip p-1 w-max mb-[18px]">
            {tabs.map((t) => (
                <button
                    key={t.key}
                    onClick={() => onChange(t.key)}
                    className={`flex items-center gap-1.5 rounded-lg px-3.5 py-[7px] text-[13px] font-medium transition-all ${
                        active === t.key
                            ? 'bg-white text-ink-900 shadow-sm ring-1 ring-hair-2'
                            : 'text-muted hover:text-ink-700'
                    }`}
                >
                    {t.label}
                    <span
                        className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                            t.crit
                                ? 'bg-crit-bg text-crit'
                                : active === t.key
                                    ? 'bg-accent-soft text-accent-ink'
                                    : 'bg-surface-chip text-ink-700'
                        }`}
                    >
            {countFor(t.key)}
          </span>
                </button>
            ))}
        </div>
    );
}