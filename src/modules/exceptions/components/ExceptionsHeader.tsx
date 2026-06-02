interface ExceptionsHeaderProps {
    month: string;
    lastSync: string;
    onRefresh: () => void;
}

export function ExceptionsHeader({ month, lastSync, onRefresh }: ExceptionsHeaderProps) {
    return (
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

            {/* ── Текстовий блок ── */}
            <div className="w-full sm:w-auto">
                <h1 className="text-[22px] sm:text-2xl font-bold leading-tight tracking-tight text-ink-900">
                    Exceptions
                </h1>

                {/* Адаптивні переноси для мета-даних */}
                <div className="mt-[3px] flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] sm:text-[12.5px] text-muted">
                    <span className="font-medium text-ink-700">{month}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="flex items-center gap-1.5">
                        <span className="sm:hidden">|</span> last sync {lastSync}
                    </span>
                </div>
            </div>

            {/* ── Блок кнопок ── */}
            {/* На мобільному: сітка 1х2 (по 50% ширини). На ПК: flex-рядок */}
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center mt-1 sm:mt-0">

                {/* Ghost button (Отримує рамку та фон на мобільному для балансу сітки) */}
                <button
                    onClick={onRefresh}
                    className="inline-flex h-[34px] w-full sm:w-auto justify-center items-center gap-[7px] rounded-[9px] border border-hair-2 sm:border-transparent bg-white sm:bg-transparent px-[14px] text-[12.5px] sm:text-[13px] font-medium text-ink-700 shadow-sm sm:shadow-none transition-colors hover:bg-surface-soft sm:hover:bg-[#ececeb]"
                >
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" className="shrink-0">
                        <path d="M20 11a8 8 0 1 1-2.34-5.66M20 4v5h-5"
                              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Refresh</span>
                </button>

                {/* Normal button */}
                <button className="inline-flex h-[34px] w-full sm:w-auto justify-center items-center gap-[7px] rounded-[9px] border border-hair-2 bg-white px-[14px] text-[12.5px] sm:text-[13px] font-medium text-ink-900 shadow-sm sm:shadow-none transition-colors hover:border-[#d6d8dc] hover:bg-[#fafafa]">
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" className="shrink-0">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Export</span>
                </button>

            </div>

        </div>
    );
}