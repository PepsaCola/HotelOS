import { useState } from 'react';
import { PS_IMPORT_LOG, PS_ERROR_LOG } from '../data/settingsMock';
import { Section, SectionHead, SettingsRow, StatCard, Toggle, LogList, Btn } from './SettingsShared';

interface Props { onToast: (msg: string) => void; }

export function ProfitswordPanel({ onToast }: Props) {
    const [enabled, setEnabled] = useState(true);

    return (
        <div className="flex flex-col gap-4 sm:gap-5">

            {/* ── Sync status cards ── */}
            <Section>
                <SectionHead
                    title="Sync status cards"
                    action={
                        <Btn size="sm" onClick={() => onToast('Manual sync started')} className="w-full sm:w-auto">
                            Manual Sync
                        </Btn>
                    }
                />

                {/* 1 колонка на мобільному, 2 на планшеті, 4 на ПК */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5">
                    <StatCard tone="good"    label="Connection"      value="CSV upload"         sub="Connected"              compact />
                    <StatCard tone="good"    label="Last sync"       value="May 15 · 02:04 AM"  sub="Successful import"      compact />
                    <StatCard tone="default" label="Imported rows"   value="1,248"              sub="Across 6 departments"          />
                    <StatCard tone="warn"    label="Open warnings"   value="4"                  sub="Needs follow-up"               />
                </div>

                <SettingsRow>
                    <div className="min-w-0 pr-2 sm:pr-4">
                        <p className="text-[12.5px] sm:text-[13px] font-semibold text-ink-900">Profitsword Integration</p>
                        <p className="mt-0.5 text-[11.5px] sm:text-[12px] text-muted leading-relaxed">
                            Profitsword is connected and available for sync and import workflows.
                        </p>
                    </div>
                    <Toggle checked={enabled} label="Profitsword Integration" onToggle={() => setEnabled(v => !v)} />
                </SettingsRow>
            </Section>

            {/* ── Last sync / import history ── */}
            <Section>
                <SectionHead
                    title="Last sync / import history"
                    sub="Most recent Profitsword imports."
                    action={
                        // На мобільному: сітка 2x2, де головна кнопка займає 2 колонки. На ПК: flex-рядок
                        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
                            <Btn size="sm" variant="ghost" onClick={() => onToast('Retrying sync…')} className="w-full sm:w-auto justify-center">
                                Retry sync
                            </Btn>
                            <Btn size="sm" variant="danger" onClick={() => onToast('Disconnected')} className="w-full sm:w-auto justify-center">
                                Disconnect
                            </Btn>
                            <Btn size="sm" variant="primary" onClick={() => onToast('Reimport started')} className="col-span-2 sm:col-span-1 w-full sm:w-auto justify-center">
                                Reimport
                            </Btn>
                        </div>
                    }
                />
                <LogList rows={PS_IMPORT_LOG} monoMetaIndex={1} />
            </Section>

            {/* ── Error / warning logs ── */}
            <Section>
                <SectionHead
                    title="Error / warning logs"
                    sub="Warnings and failed imports that need review."
                />
                <LogList rows={PS_ERROR_LOG} />
            </Section>

        </div>
    );
}