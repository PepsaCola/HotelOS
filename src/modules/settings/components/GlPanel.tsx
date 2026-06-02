import { useState, useMemo } from 'react';
import { ACCOUNT_ROWS } from '../data/settingsMock';
import { Section, SectionHead, SearchInput, SettingsSelect, Btn } from './SettingsShared';

const PER_PAGE = 15;

export function GlPanel() {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(ACCOUNT_ROWS.length / PER_PAGE);

    const paged = useMemo(() => {
        const start = (page - 1) * PER_PAGE;
        return ACCOUNT_ROWS.slice(start, start + PER_PAGE);
    }, [page]);

    const start = (page - 1) * PER_PAGE + 1;
    const end   = Math.min(page * PER_PAGE, ACCOUNT_ROWS.length);

    return (
        <Section>
            <SectionHead
                title="Account numbers table"
                sub="Current account number structure for DoubleTree by Hilton Hotel Orlando Airport."
                action={
                    <Btn size="sm" variant="primary" className="w-full sm:w-auto">
                        Add A/C
                    </Btn>
                }
            />

            {/* ── Toolbar ── */}
            {/* Горизонтальний скрол для мобільних екранів, щоб фільтри не переносилися в "кашу" */}
            <div className="flex items-center gap-2 sm:gap-3 border-b border-hair-2 px-3 sm:px-5 py-2.5 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                {/* Фіксуємо ширину пошуку на мобільному, щоб він не сплющувався, а на ПК віддаємо йому вільний простір */}
                <div className="w-[220px] shrink-0 sm:w-auto sm:flex-1 sm:min-w-[200px]">
                    <SearchInput placeholder="Search account number or name…" />
                </div>

                <div className="shrink-0">
                    <SettingsSelect><option>ROOMS</option></SettingsSelect>
                </div>
                <div className="shrink-0">
                    <SettingsSelect><option>Property 021</option></SettingsSelect>
                </div>

                {/* Спейсер: ховаємо на мобільному, щоб не робити дірку, залишаємо на ПК */}
                <div className="hidden sm:block sm:flex-1" />

                <Btn size="sm" variant="ghost" className="shrink-0">Import CSV</Btn>
                <Btn size="sm" variant="ghost" className="shrink-0">Export CSV</Btn>
            </div>

            {/* ── Table ── */}
            <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
                <table className="w-full min-w-[480px] border-collapse text-[12.5px] sm:text-[13px]">
                    <thead>
                    <tr className="border-b border-hair-2 bg-surface-soft">
                        <th className="px-3.5 sm:px-4 py-2.5 text-left text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[.06em] text-muted">
                            Account Number
                        </th>
                        <th className="px-3.5 sm:px-4 py-2.5 text-left text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[.06em] text-muted">
                            Account Name
                        </th>
                        <th className="px-3.5 sm:px-4 py-2.5 text-left text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[.06em] text-muted">
                            Department
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {paged.map(row => (
                        <tr key={row.accountNumber} className="border-b border-hair last:border-0 hover:bg-surface-soft/50 transition-colors">
                            <td className="px-3.5 sm:px-4 py-2.5 font-mono text-[11.5px] sm:text-[12px] text-ink-700">
                                {row.accountNumber}
                            </td>
                            <td className="px-3.5 sm:px-4 py-2.5 text-ink-700 font-medium">
                                {row.accountName}
                            </td>
                            <td className="px-3.5 sm:px-4 py-2.5 text-muted">
                                {row.department}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination ── */}
            {/* Мобільний: колонка і центрований текст. ПК: рядок */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-hair-2 px-4 py-3.5 sm:px-5 sm:py-3 text-[12.5px] text-muted">
                <span className="text-center sm:text-left">
                    Showing <b className="font-semibold text-ink-900">{start}–{end}</b> of {ACCOUNT_ROWS.length} account numbers
                </span>

                <div className="flex items-center justify-center sm:justify-end gap-1 w-full sm:w-auto">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-hair-2 text-ink-700 transition hover:bg-surface-soft disabled:opacity-30 shrink-0"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-[12.5px] font-semibold transition shrink-0 ${
                                page === n
                                    ? 'bg-accent text-white shadow-sm'
                                    : 'border border-hair-2 text-ink-700 hover:bg-surface-soft'
                            }`}
                        >
                            {n}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-hair-2 text-ink-700 transition hover:bg-surface-soft disabled:opacity-30 shrink-0"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>
        </Section>
    );
}