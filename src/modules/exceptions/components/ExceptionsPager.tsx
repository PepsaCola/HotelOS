interface ExceptionsPagerProps {
    shown: number;
    total: number;
}

export function ExceptionsPager({ shown, total }: ExceptionsPagerProps) {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-hair">
            <div className="text-[13px] text-muted">
                Showing <span className="font-semibold text-ink-900">{shown}</span> of{" "}
                <span className="font-semibold text-ink-900">{total}</span> exceptions
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <button className="grid place-items-center w-8 h-8 rounded-lg border border-hair-2 text-muted hover:bg-surface-soft transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                            <path
                                d="M15 6l-6 6 6 6"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <button className="grid place-items-center w-8 h-8 rounded-lg border border-hair-2 bg-white text-ink-900 font-semibold hover:bg-surface-soft transition-colors">
                        1
                    </button>
                    <button className="grid place-items-center w-8 h-8 rounded-lg border border-hair-2 text-muted hover:bg-surface-soft transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                            <path
                                d="M9 6l6 6-6 6"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}