import { TAX_PROFILES, TAX_EXEMPTIONS } from '../data/settingsMock';
import { Section, SectionHead, Avatar, Badge, MetaLine, Btn } from './SettingsShared';

export function TaxPanel() {
    return (
        <div className="flex flex-col gap-4 sm:gap-5">

            {/* ── Tax profiles table ── */}
            <Section>
                <SectionHead
                    title="Tax profiles table"
                    sub="Configure rate, region, type, and default status."
                    action={
                        <Btn size="sm" variant="primary" className="w-full sm:w-auto">
                            Add Tax Profile
                        </Btn>
                    }
                />

                <div className="flex flex-col">
                    {TAX_PROFILES.map(row => (
                        <div
                            key={row.name}
                            // На мобільному: flex-col, на ПК: flex-row
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-hair px-4 py-3.5 sm:px-5 sm:py-3 last:border-0 hover:bg-[#fafbfc] transition-colors"
                        >
                            {/* Ліва частина: Аватар + Текст */}
                            <div className="flex items-start gap-3 min-w-0">
                                <Avatar initials={row.initials} accent={row.accent} />
                                <div className="min-w-0 flex-1 pt-[1px]">
                                    <p className="text-[13px] sm:text-[13.5px] font-semibold text-ink-900 break-words">
                                        {row.name}
                                    </p>
                                    <MetaLine parts={[
                                        `Region: ${row.region}`,
                                        `Type: ${row.type}`,
                                        <Badge key="b" tone={row.badge.tone}>{row.badge.label}</Badge>,
                                    ]} />
                                </div>
                            </div>

                            {/* Права частина: Кнопки */}
                            {/* pl-[44px] вирівнює кнопки під текстом. flex-1 робить їх однаковими за шириною на телефонах */}
                            <div className="flex items-center gap-2 pl-[44px] sm:pl-0 shrink-0 w-full sm:w-auto">
                                <Btn size="sm" variant="ghost" className="flex-1 sm:flex-none">Edit</Btn>
                                <Btn size="sm" className="flex-1 sm:flex-none">Duplicate</Btn>
                                <Btn size="sm" className="flex-1 sm:flex-none">Disable</Btn>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ── Exemptions & special rules ── */}
            <Section>
                <SectionHead
                    title="Exemptions & special rules"
                    sub="Exceptions for vendor groups, GL ranges, or special tax handling."
                    action={
                        <Btn size="sm" className="w-full sm:w-auto">
                            Add Rule
                        </Btn>
                    }
                />

                <div className="flex flex-col">
                    {TAX_EXEMPTIONS.map(row => (
                        <div
                            key={row.name}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-hair px-4 py-3.5 sm:px-5 sm:py-3 last:border-0 hover:bg-[#fafbfc] transition-colors"
                        >
                            <div className="flex items-start gap-3 min-w-0">
                                <Avatar initials={row.initials} accent="neutral" />
                                <div className="min-w-0 flex-1 pt-[1px]">
                                    <p className="text-[13px] sm:text-[13.5px] font-semibold text-ink-900 break-words">
                                        {row.name}
                                    </p>
                                    <MetaLine parts={row.parts} />
                                </div>
                            </div>

                            <div className="  shrink-0 w-full sm:w-auto">
                                <Btn size="sm" variant="ghost" className="w-full sm:w-auto">
                                    Edit
                                </Btn>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

        </div>
    );
}