import { useState } from 'react';
import { M3_LOG_ROWS } from '../data/settingsMock';
import { Section, SectionHead, SettingsRow, StatCard, Toggle, Badge, LogList, Btn } from './SettingsShared';

interface Props { onToast: (msg: string) => void; }

export function M3Panel({ onToast }: Props) {
    const [enabled, setEnabled] = useState(true);

    return (
        <div className="flex flex-col gap-4 sm:gap-5">

            {/* ── Mapping validation status ── */}
            <Section>
                <SectionHead
                    title="Mapping validation status"
                    sub="Current readiness for export."
                    action={
                        <Btn size="sm" onClick={() => onToast('Validation started')} className="w-full sm:w-auto">
                            Validate
                        </Btn>
                    }
                />

                {/* 1 колонка на мобільному, 2 на планшеті, 4 на ПК */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5">
                    <StatCard tone="good"    label="Valid mappings"   value="24"            sub="Ready for export"  />
                    <StatCard tone="warn"    label="Warnings"         value="2"             sub="Needs review"      />
                    <StatCard tone="crit"    label="Errors"           value="1"             sub="Export blocked"    />
                    <StatCard tone="good"    label="Last validation"  value="May 22 · 09:14" sub="1 critical issue" compact />
                </div>

                <SettingsRow>
                    <div className="min-w-0 pr-2 sm:pr-4">
                        <p className="text-[12.5px] sm:text-[13px] font-semibold text-ink-900">M3 Integration</p>
                        <p className="mt-0.5 text-[11.5px] sm:text-[12px] text-muted leading-relaxed">
                            Connection is configured and ready for mapped export workflows.
                        </p>
                    </div>
                    <Toggle checked={enabled} label="M3 Integration" onToggle={() => setEnabled(v => !v)} />
                </SettingsRow>
            </Section>

            {/* ── Export preview & testing ── */}
            <Section>
                <SectionHead
                    title="Export preview & testing"
                    sub="Preview how mapped values will appear in the outbound file."
                    action={
                        <Btn size="sm" variant="ghost" onClick={() => onToast('Test export started')} className="w-full sm:w-auto">
                            Run test export
                        </Btn>
                    }
                />
                <SettingsRow>
                    <div className="min-w-0 pr-2">
                        <p className="text-[12.5px] sm:text-[13px] font-semibold text-ink-900">Preview file</p>
                        <p className="mt-0.5 font-mono text-[11.5px] sm:text-[12px] text-muted truncate">m3-export-preview-2026-05-22.csv</p>
                    </div>
                    <Btn size="sm" variant="ghost" className="w-full sm:w-auto justify-center">
                        Open preview
                    </Btn>
                </SettingsRow>
                <SettingsRow>
                    <span className="text-[12.5px] sm:text-[13px] font-semibold text-ink-900 shrink-0">Test result</span>
                    <Badge tone="warn">1 validation error</Badge>
                </SettingsRow>
            </Section>

            {/* ── Sync / error logs ── */}
            <Section>
                <SectionHead title="Sync / error logs" sub="Recent validation and export events." />

                <LogList rows={M3_LOG_ROWS} />

                {/* Адаптивний підвал дій (на мобільному кнопки займають рівно по 50%) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-t border-hair-2 px-4 py-3.5 sm:px-5 sm:py-3">
                    <span className="text-[12px] sm:text-[12.5px] text-muted text-center sm:text-left">
                        Available actions
                    </span>

                    <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
                        <Btn size="sm" onClick={() => onToast('Validation started')} className="w-full sm:w-auto justify-center">
                            Validate
                        </Btn>
                        <Btn size="sm" variant="danger" onClick={() => onToast('Mapping reset')} className="w-full sm:w-auto justify-center">
                            Reset mapping
                        </Btn>
                    </div>
                </div>
            </Section>

        </div>
    );
}