import { useMemo } from 'react';
import type { Vendor } from '@/types/vendors';

const TABS = [
    { key: 'all',         label: 'All'              },
    { key: 'active',      label: 'Active'           },
    { key: 'pending',     label: 'Pending Approval' },
    { key: 'expiring',    label: 'Expiring Soon'    },
    { key: 'coi_expired', label: 'COI Issues'       },
    { key: 'inactive',    label: 'Inactive'         },
];

interface VendorTabsProps {
    vendors: readonly Vendor[];
    activeTab: string;
    onChange: (tab: string) => void;
}

export function VendorTabs({ vendors, activeTab, onChange }: VendorTabsProps) {
    // Мемоізація для запобігання зайвим обчисленням при ререндерах
    const counts = useMemo(() => {
        return {
            all:         vendors.length,
            active:      vendors.filter(v => v.status === 'active').length,
            pending:     vendors.filter(v => v.status === 'pending').length,
            expiring:    vendors.filter(v => v.status === 'expiring').length,
            coi_expired: vendors.filter(v => v.status === 'coi_expired' || v.docs?.coi === 'miss').length,
            inactive:    vendors.filter(v => v.status === 'inactive').length,
        } as Record<string, number>;
    }, [vendors]);

    return (
        // Обгортка для обмеження ширини та правильного позиціонування
        <div className="w-fit ">
            {/* Додано snap-x для плавного магнітного скролінгу на тач-пристроях */}
            <div className="flex w-full snap-x snap-mandatory items-center gap-1 overflow-x-auto rounded-[14px] bg-[#f1f2f4] p-1.5 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {TABS.map((t) => {
                    const active = activeTab === t.key;

                    return (
                        <button
                            key={t.key}
                            onClick={() => onChange(t.key)}
                            // py-2 для телефонів (зручніше натискати), sm:py-1.5 для ПК
                            // snap-start для рівної зупинки скролу
                            className={`flex shrink-0 snap-start items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-medium transition-all sm:py-1.5 ${
                                active
                                    ? 'bg-white text-ink-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                                    : 'text-muted-strong hover:text-ink-900'
                            }`}
                        >
                            <span>{t.label}</span>

                            <span className={`flex items-center justify-center rounded-full px-2 py-[3px] text-[11px] font-bold tabular-nums leading-none transition-colors ${
                                active
                                    ? 'bg-[#eeecff] text-[#4f46e5]'
                                    : 'bg-[#e2e4e9] text-ink-700'
                            }`}>
                                {counts[t.key] ?? 0}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}