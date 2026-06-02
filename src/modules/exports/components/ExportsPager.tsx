interface Props {
    shown: number;
    total: number;
}

export function ExportsPager({ shown, total }: Props) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-hair bg-surface-soft px-3 sm:px-4 py-3 sm:py-3.5">

            {/* ── Info Text ── */}
            <span className="text-[12.5px] sm:text-[13px] text-muted text-center sm:text-left w-full sm:w-auto">
                Showing <b className="font-semibold text-ink-900">{shown}</b> of {total}
            </span>

            {/* ── Controls ── */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3.5 sm:gap-x-4 gap-y-3 text-[12.5px] sm:text-[13px] text-muted w-full sm:w-auto">

                {/* Pages */}
                <div className="flex gap-0.5">
                    {['‹', '1', '2', '…', '7', '›'].map((p, i) => {
                        // Ховаємо проміжні сторінки на мобільних телефонах
                        const hideOnMobile = p === '2' || p === '…';

                        return (
                            <button
                                key={i}
                                data-active={p === '1' ? true : undefined}
                                className={`${hideOnMobile ? 'hidden sm:flex' : 'flex'} h-[30px] min-w-[30px] px-1 items-center justify-center rounded-[7px] text-[12.5px] sm:text-[13px] font-medium tabular-nums transition-colors ${
                                    p === '1'
                                        ? 'border border-hair-2 bg-white font-semibold text-ink-900 shadow-sm'
                                        : 'text-ink-700 hover:bg-surface-chip'
                                }`}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>

                {/* Per Page Select */}
                <div className="flex items-center gap-2">
                    <span className="hidden sm:inline">Lines per page</span>
                    <span className="sm:hidden">Per page</span>

                    <select className="h-[30px] cursor-pointer rounded-lg border border-hair-2 bg-white px-2 text-[12.5px] sm:text-[13px] font-medium text-ink-700 outline-none hover:bg-surface-soft transition-colors">
                        <option>10</option>
                        <option>25</option>
                    </select>
                </div>

            </div>
        </div>
    );
}