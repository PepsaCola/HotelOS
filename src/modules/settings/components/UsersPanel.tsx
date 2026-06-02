import { USER_ROWS } from '../data/settingsMock';
import { Section, SectionHead, Avatar, Badge, MetaLine, Btn } from './SettingsShared';

const PERMISSIONS = [
    { label: 'Manage users', admin: true,  gm: false, controller: false, dept: false },
    { label: 'Approve PO',   admin: true,  gm: true,  controller: true,  dept: true  },
    { label: 'Run export',   admin: true,  gm: true,  controller: true,  dept: false },
];

function Check({ yes }: { yes: boolean }) {
    if (!yes) return <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-hair-2" />;
    return (
        <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-good-bg shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 text-good" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
    );
}

export function UsersPanel() {
    return (
        <div className="flex flex-col gap-4 sm:gap-5">

            {/* ── Users table ── */}
            <Section>
                <SectionHead
                    title="Users table"
                    sub="Workspace members, access scope, and status."
                    action={
                        <Btn size="sm" variant="primary" className="w-full sm:w-auto">
                            Invite User
                        </Btn>
                    }
                />

                <div className="flex flex-col">
                    {USER_ROWS.map(row => (
                        <div
                            key={row.email}
                            // Мобільний: flex-col (дані зверху, статус+кнопка знизу). ПК: flex-row
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-hair px-4 py-3.5 sm:px-5 sm:py-3 last:border-0 hover:bg-surface-soft/50 transition-colors ${row.highlight ? 'bg-surface-soft/40' : ''}`}
                        >
                            {/* Ліва частина: Аватар + Текст */}
                            <div className="flex items-start gap-3 min-w-0">
                                <Avatar initials={row.initials} accent={row.accent} />
                                <div className="min-w-0 flex-1 pt-[1px]">
                                    <p className="text-[13px] sm:text-[13.5px] font-semibold text-ink-900 break-words">{row.name}</p>
                                    <MetaLine parts={[row.email, row.role, row.property, row.department]} />
                                </div>
                            </div>

                            {/* Права частина: Статус + Кнопка */}
                            {/* pl-[44px] вирівнює бейдж по лінії тексту. justify-between розкидає бейдж і кнопку по краях на мобільному */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 pl-[44px] sm:pl-0 shrink-0 w-full sm:w-auto">
                                <Badge tone={row.status === 'Active' ? 'good' : 'warn'}>{row.status}</Badge>
                                <Btn size="sm" variant="ghost" className="shrink-0">{row.cta}</Btn>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ── Role & permission matrix ── */}
            <Section>
                <SectionHead
                    title="Role & permission matrix"
                    sub="Role coverage for key workspace actions."
                />

                {/* Горизонтальний скрол для мобільних екранів */}
                <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
                    <table className="w-full min-w-[480px] border-collapse text-[12.5px] sm:text-[13px]">
                        <thead>
                        <tr className="border-b border-hair-2 bg-surface-soft">
                            <th className="px-3.5 sm:px-4 py-2.5 text-left text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[.06em] text-muted w-[35%] sm:w-[42%]">
                                Permission
                            </th>
                            {['Admin', 'GM', 'Controller', 'Dept Head'].map(r => (
                                <th key={r} className="px-2 sm:px-3 py-2.5 text-center text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[.06em] text-muted leading-tight">
                                    {r}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {PERMISSIONS.map(p => (
                            <tr key={p.label} className="border-b border-hair last:border-0 hover:bg-surface-soft/50 transition-colors">
                                <td className="px-3.5 sm:px-4 py-3 sm:py-2.5 font-medium text-ink-700">{p.label}</td>
                                <td className="px-2 sm:px-3 py-3 sm:py-2.5 text-center"><Check yes={p.admin} /></td>
                                <td className="px-2 sm:px-3 py-3 sm:py-2.5 text-center"><Check yes={p.gm} /></td>
                                <td className="px-2 sm:px-3 py-3 sm:py-2.5 text-center"><Check yes={p.controller} /></td>
                                <td className="px-2 sm:px-3 py-3 sm:py-2.5 text-center"><Check yes={p.dept} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Section>

        </div>
    );
}