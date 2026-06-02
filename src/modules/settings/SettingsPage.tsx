import { useState, useEffect } from 'react';
import type { SettingsSectionId } from '@/types/settings';
import { SECTION_META } from './data/settingsMock';
import { useBreadcrumb } from '@/contexts/LayoutContext';
import { SettingsNav }        from './components/SettingsNav';
import { ProfilePanel }       from './components/ProfilePanel';
import { PropertyPanel }      from './components/PropertyPanel';
import { DepartmentsPanel }   from './components/DepartmentsPanel';
import { UsersPanel }         from './components/UsersPanel';
import { GlPanel }            from './components/GlPanel';
import { TaxPanel }           from './components/TaxPanel';
import { CatalogPanel }       from './components/CatalogPanel';
import { M3Panel }            from './components/M3Panel';
import { ProfitswordPanel }   from './components/ProfitswordPanel';

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
        </svg>
    );
}

export default function SettingsPage() {
    const [active,  setActive]  = useState<SettingsSectionId>('profile');
    const [toast,   setToast]   = useState<string | null>(null);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 1800);
        return () => clearTimeout(t);
    }, [toast]);

    const meta = SECTION_META[active];

    useBreadcrumb([{ label: 'Account Settings' }, { label: meta.title }]);

    function renderPanel() {
        switch (active) {
            case 'profile':     return <ProfilePanel     onToast={setToast} />;
            case 'property':    return <PropertyPanel    />;
            case 'departments': return <DepartmentsPanel />;
            case 'users':       return <UsersPanel       />;
            case 'gl':          return <GlPanel          />;
            case 'tax':         return <TaxPanel         />;
            case 'catalog':     return <CatalogPanel     />;
            case 'm3':          return <M3Panel          onToast={setToast} />;
            case 'profitsword': return <ProfitswordPanel onToast={setToast} />;
            default:            return null;
        }
    }

    return (
        <>
            {/* ── Layout ── */}
            <div className="flex min-h-full flex-col sm:flex-row">

                {/* Left nav (desktop sidebar + mobile tabs) */}
                <SettingsNav active={active} onChange={id => setActive(id)} />

                {/* Right content */}
                <div className="flex min-w-0 flex-1 xl:max-w-[70%] 2xl:max-w-[60%] flex-col gap-4 sm:gap-5 lg:gap-6 p-4 sm:p-6 lg:p-8">

                    {/* Section header */}
                    <div>
                        <h1 className="text-[20px] font-bold tracking-[-0.018em] text-ink-900 sm:text-[24px]">
                            {meta.title}
                        </h1>
                        <p className="mt-1 text-[13px] text-muted sm:text-[13.5px]">
                            {meta.subtitle}
                        </p>
                    </div>

                    {/* Active panel */}
                    {renderPanel()}

                </div>
            </div>

            {/* ── Toast ── */}
            {/* Мобільний: по центру знизу на всю ширину. ПК: в правому нижньому куті */}
            <div
                className={`pointer-events-none fixed z-50 flex items-center justify-center sm:justify-start gap-2 rounded-xl bg-[#1a2540] px-4 py-2.5 text-[13px] font-semibold text-white shadow-2xl transition-all duration-300 
                bottom-6 sm:bottom-5 
                left-1/2 sm:left-auto 
                -translate-x-1/2 sm:translate-x-0 
                sm:right-5 
                w-[calc(100%-2rem)] sm:w-auto 
                max-w-[400px]
                ${toast ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
                <CheckIcon />
                <span>{toast ?? 'Saved'}</span>
            </div>
        </>
    );
}