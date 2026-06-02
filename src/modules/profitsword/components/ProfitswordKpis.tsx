import type { ImportRecord } from '@/types/profitsword';
import { STATUS_META } from '../lib/profitsword';

interface Props {
    records: readonly ImportRecord[];
}

export function ProfitswordKpis({ records }: Props) {
    const total      = records.length;
    const imported   = records.filter((r) => r.status === 'Imported').length;
    const attention  = records.filter((r) => r.status === 'Failed' || r.status === 'Needs Mapping' || r.status === 'Partial Import').length;
    const active     = records.find((r) => r.active);
    const lastSync   = active?.rows ?? '—';

    // const successRate = total > 0 ? Math.round((imported / total) * 100) : 0;

    const cards = [
        {
            label: 'Total Imports',
            value: total,
            sub: 'This fiscal period',
            accent: 'bg-white',
            textVal: 'text-ink-900',
            textSub: 'text-muted',
            textLabel: 'text-muted',
            hasBorder: false,
        },
        {
            label: 'Active Forecasts',
            value: imported,
            sub: `Across properties`,
            accent: 'bg-white',
            textVal: 'text-blue',
            textSub: 'text-muted',
            textLabel: 'text-muted',
            badge: STATUS_META['Imported'],
            hasBorder: true,
        },
        {
            label: 'Failed / Issues',
            value: attention,
            sub: 'Needs attention',
            accent: 'bg-white',
            textVal: attention > 0 ? 'text-crit' : 'text-ink-900',
            textSub: 'text-muted',
            textLabel: 'text-muted',
            hasBorder: true,
        },
        {
            label: 'Rows Imported',
            value: lastSync,
            sub: 'Across all imports',
            accent: 'bg-white',
            textVal: 'text-ink-900 text-[16px] sm:text-[18px]',
            textSub: 'text-muted',
            textLabel: 'text-muted',
            hasBorder: true,
        },
    ];

    return (
        // Мобільний: 1 колонка. Планшет: 2. Десктоп: 4.
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {cards.map((c, i) => (
                <div
                    key={i}
                    className={`flex flex-col h-full ${c.accent} rounded-[14px] border ${c.hasBorder ? 'border-hair-2' : 'border-transparent'} p-4 shadow-sm sm:shadow-soft`}
                >
                    <p className={`text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[.07em] ${c.textLabel}`}>
                        {c.label}
                    </p>

                    {/* Контейнер для значення з truncate на випадок довгої дати */}
                    <div className="mt-1 sm:mt-1.5 flex-1 min-w-0">
                        <p className={`text-[24px] sm:text-[26px] font-bold leading-tight tabular-nums truncate ${c.textVal}`} title={String(c.value)}>
                            {c.value}
                        </p>
                    </div>

                    <p className={`mt-1 text-[11.5px] sm:text-[12px] font-medium ${c.textSub} truncate`}>
                        {c.sub}
                    </p>
                </div>
            ))}
        </div>
    );
}