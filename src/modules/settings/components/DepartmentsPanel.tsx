import { DEPARTMENT_ROWS } from '../data/settingsMock';
import { Section, SectionHead, Avatar, MetaLine, Btn } from './SettingsShared';

export function DepartmentsPanel() {
    return (
        <Section>
            <SectionHead
                title="Departments table"
                sub="Name, code, manager, linked property, and budget ownership."
                action={
                    <Btn size="sm" variant="primary" className="w-full sm:w-auto">
                        Add Department
                    </Btn>
                }
            />

            <div className="flex flex-col">
                {DEPARTMENT_ROWS.map(row => (
                    <div
                        key={row.code}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-hair px-4 py-3.5 sm:px-5 sm:py-3 last:border-0 hover:bg-[#fafbfc] transition-colors"
                    >

                        <div className="flex items-start gap-3 min-w-0">
                            <Avatar initials={row.initials} accent={row.accent} />
                            <div className="min-w-0 flex-1 pt-[1px]">
                                <p className="text-[13px] sm:text-[13.5px] font-semibold text-ink-900 break-words">
                                    {row.name}
                                </p>
                                <MetaLine parts={[
                                    <code key="code" className="font-mono text-[10.5px] sm:text-[11px]">{row.code}</code>,
                                    `Manager: ${row.manager}`,
                                    row.property,
                                    `Budget owner: ${row.budgetOwner}`,
                                ]} />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pl-[44px] sm:pl-0 shrink-0 w-full sm:w-auto">
                            <Btn size="sm" variant="ghost" className="flex-1 sm:flex-none">
                                Edit
                            </Btn>
                            <Btn size="sm" className="flex-1 sm:flex-none">
                                Disable
                            </Btn>
                            <Btn size="sm" variant="danger" className="flex-1 sm:flex-none">
                                Delete
                            </Btn>
                        </div>

                    </div>
                ))}
            </div>
        </Section>
    );
}