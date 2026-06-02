import type { SettingsSectionId } from '@/types/settings';
import { SECTION_NAV } from '../data/settingsMock';
import { SectionIcon } from './SettingsShared';

interface Props {
    active:   SettingsSectionId;
    onChange: (id: SettingsSectionId) => void;
}

const GROUPS = ['Account', 'Workspace', 'Finance', 'Integrations'] as const;

export function SettingsNav({ active, onChange }: Props) {
    const grouped = SECTION_NAV.reduce<Record<string, typeof SECTION_NAV[number][]>>(
        (acc, item) => { (acc[item.group] ??= []).push(item); return acc; },
        {},
    );

    return (
        <>
            {/* ── Desktop sidebar ── */}
            <nav className="hidden shrink-0 flex-col gap-4 border-r border-hair-2 bg-surface-soft/40 px-3 py-4 sm:flex" style={{ width: 220 }}>
                {GROUPS.map(group => (
                    <div key={group} className="flex flex-col gap-0.5">
                        <p className="mb-1 px-2.5 text-[9.5px] font-bold uppercase tracking-[.07em] text-muted">
                            {group}
                        </p>
                        {(grouped[group] ?? []).map(item => {
                            const isActive = active === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onChange(item.id)}
                                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition ${
                                        isActive
                                            ? 'bg-white font-semibold text-accent shadow-soft'
                                            : 'text-ink-700 hover:bg-white/70'
                                    }`}
                                >
                                    <span className={isActive ? 'text-accent' : 'text-muted'}>
                                        <SectionIcon kind={item.icon} />
                                    </span>
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.count != null && (
                                        <span className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-bold tabular-nums ${
                                            isActive ? 'bg-accent text-white' : 'bg-hair-2 text-muted'
                                        }`}>
                                            {item.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* ── Mobile horizontal scroll tabs ── */}
            <div className="flex overflow-x-auto border-b border-hair-2 bg-white px-2 sm:hidden">
                {SECTION_NAV.map(item => {
                    const isActive = active === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onChange(item.id)}
                            className={`inline-flex shrink-0 items-center gap-1.5 px-3 py-2.5 text-[12.5px] font-semibold transition ${
                                isActive
                                    ? 'border-b-2 border-accent text-accent'
                                    : 'text-muted hover:text-ink-900'
                            }`}
                        >
                            {item.label}
                            {item.count != null && (
                                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                                    isActive ? 'bg-accent text-white' : 'bg-surface-soft text-muted'
                                }`}>
                                    {item.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </>
    );
}