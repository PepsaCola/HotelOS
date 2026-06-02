import { useState } from 'react';
import type { ProfileForm, NotificationToggles } from '@/types/settings';
import { Section, SectionHead, SettingsRow, Toggle, SettingsInput, Btn } from './SettingsShared';

const INITIAL: ProfileForm = {
    name:  'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (305) 555-0129',
};

interface Props {
    onToast: (msg: string) => void;
}

export function ProfilePanel({ onToast }: Props) {
    const [form, setForm]   = useState<ProfileForm>(INITIAL);
    const [notif, setNotif] = useState<NotificationToggles>({
        approvals:  true,
        exceptions: true,
        digest:     false,
    });

    const set = (k: keyof ProfileForm) => (v: string) =>
        setForm(f => ({ ...f, [k]: v }));

    const toggleNotif = (k: keyof NotificationToggles) =>
        setNotif(n => ({ ...n, [k]: !n[k] }));

    return (
        <div className="flex flex-col gap-4 sm:gap-5">

            {/* ── User information ── */}
            <Section>
                <SectionHead
                    title="User information"
                    sub="Name, email, phone, and profile photo shown across the workspace."
                />
                <SettingsRow>
                    <span className="text-[12.5px] sm:text-[13px] font-semibold text-ink-900 shrink-0">Name</span>
                    <div className="w-full max-w-full sm:max-w-[320px]">
                        <SettingsInput value={form.name} onChange={set('name')} />
                    </div>
                </SettingsRow>
                <SettingsRow>
                    <span className="text-[12.5px] sm:text-[13px] font-semibold text-ink-900 shrink-0">Email</span>
                    <div className="w-full max-w-full sm:max-w-[320px]">
                        <SettingsInput value={form.email} onChange={set('email')} />
                    </div>
                </SettingsRow>
                <SettingsRow>
                    <span className="text-[12.5px] sm:text-[13px] font-semibold text-ink-900 shrink-0">Phone</span>
                    <div className="w-full max-w-full sm:max-w-[320px]">
                        <SettingsInput value={form.phone} onChange={set('phone')} />
                    </div>
                </SettingsRow>
                <SettingsRow>
                    <span className="text-[12.5px] sm:text-[13px] font-semibold text-ink-900 shrink-0">Role</span>
                    <div className="w-full max-w-full sm:max-w-[320px]">
                        <SettingsInput value="Admin" disabled />
                    </div>
                </SettingsRow>
            </Section>

            {/* ── Password & security ── */}
            <Section>
                <SectionHead
                    title="Password & security"
                    sub="Core sign-in and account protection settings."
                />
                {/* Мобільний розклад для безпеки: гнучкий flex/grid залежно від реалізації SettingsRow */}
                <SettingsRow>
                    <div className="min-w-0 flex-1 pr-2">
                        <p className="text-[12.5px] sm:text-[13px] font-semibold text-ink-900">Password</p>
                        <p className="mt-0.5 text-[11.5px] sm:text-[12px] text-muted truncate">Last changed Feb 14, 2026.</p>
                    </div>
                    <Btn size="sm" >Change password</Btn>
                </SettingsRow>
            </Section>

            {/* ── Notification preferences ── */}
            <Section>
                <SectionHead
                    title="Notification preferences"
                    sub="Choose which account-level alerts are delivered to you."
                />
                <SettingsRow>
                    <span className="text-[12.5px] sm:text-[13px] font-semibold text-ink-900 pr-4">PO submitted for my approval</span>
                    <Toggle checked={notif.approvals}  label="PO submitted for my approval" onToggle={() => toggleNotif('approvals')}  />
                </SettingsRow>
                <SettingsRow>
                    <span className="text-[12.5px] sm:text-[13px] font-semibold text-ink-900 pr-4">Invoice exception detected</span>
                    <Toggle checked={notif.exceptions} label="Invoice exception detected"    onToggle={() => toggleNotif('exceptions')} />
                </SettingsRow>
                <SettingsRow>
                    <span className="text-[12.5px] sm:text-[13px] font-semibold text-ink-900 pr-4">Weekly digest</span>
                    <Toggle checked={notif.digest}     label="Weekly digest"                 onToggle={() => toggleNotif('digest')}     />
                </SettingsRow>
            </Section>

            {/* ── Save bar ── */}
            {/* На мобільному: вертикальний стек із центрованим текстом та кнопками 50/50. На ПК: в один рядок */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-[14px] border border-hair-2 bg-white px-4 py-3.5 shadow-soft sm:px-5">
                <span className="text-[12px] sm:text-[12.5px] text-muted text-center sm:text-left">
                    Changes are not saved automatically.
                </span>

                <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
                    <Btn
                        size="sm"
                        onClick={() => { setForm(INITIAL); onToast('Changes discarded'); }}
                    >
                        Discard
                    </Btn>
                    <Btn
                        size="sm"
                        variant="primary"
                        onClick={() => onToast('Saved')}
                    >
                        Save changes
                    </Btn>
                </div>
            </div>

        </div>
    );
}