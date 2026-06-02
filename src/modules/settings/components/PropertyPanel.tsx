import { PROPERTY_ROWS } from '../data/settingsMock';
import { Section, SectionHead, Avatar, Badge, Btn, SearchInput, SettingsSelect, MetaLine } from './SettingsShared';

export function PropertyPanel() {
    return (
        <Section>
            <SectionHead
                title="Properties list"
                sub="Current hotel property configured in HotelOS."
            />

            {/* ── Toolbar ── */}
            {/* Мобільний: Пошук на 100%, фільтри під ним. ПК: В один рядок */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 border-b border-hair-2 px-3.5 py-3 sm:px-5 sm:py-2.5">
                <div className="w-full sm:w-auto sm:flex-1">
                    <SearchInput placeholder="Search property…" />
                </div>
                <div className="grid grid-cols-2 sm:flex items-center gap-2.5 sm:gap-2">
                    <SettingsSelect><option>Florida</option></SettingsSelect>
                    <SettingsSelect><option>Active</option></SettingsSelect>
                </div>
            </div>

            {/* ── Property List ── */}
            <div className="flex flex-col">
                {PROPERTY_ROWS.map(row => (
                    <div
                        key={row.code}
                        // На мобільному: flex-col, на ПК: flex-row
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-surface-soft/40 px-4 py-3.5 sm:px-5 sm:py-3 border-b border-hair last:border-0 transition-colors hover:bg-surface-soft/80"
                    >
                        {/* Ліва частина: Аватар + Текст */}
                        <div className="flex items-start gap-3 min-w-0">
                            <Avatar initials={row.initials} accent="brand" />
                            <div className="min-w-0 flex-1 pt-[1px]">
                                <p className="text-[13px] sm:text-[13.5px] font-semibold text-ink-900 break-words">
                                    {row.name}
                                </p>
                                <MetaLine
                                    parts={[
                                        <code key="c" className="font-mono text-[10.5px] sm:text-[11px]">{row.code}</code>,
                                        row.location,
                                        row.meta
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Права частина: Статус + Кнопка */}
                        {/* pl-12 на мобільному вирівнює кнопки по лінії тексту (минаючи ширину аватарки) */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 pl-[44px] sm:pl-0 shrink-0">
                            <Badge tone="good">{row.status}</Badge>
                            <Btn size="sm" variant="ghost">Edit</Btn>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}