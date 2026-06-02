interface Props {
    poNumber: string;
    date: string;
    budgetClassification: string;
    accountNumber: string;
    onDateChange: (v: string) => void;
    onBudgetClassificationChange: (v: string) => void;
    onAccountNumberChange: (v: string) => void;
}

const inputCls =
    "h-10 w-full rounded-xl border border-hair-2 bg-white px-3 text-sm text-ink-700 transition-colors focus:border-blue focus:outline-none";

export default function POInformationSection({
                                                 poNumber, date, budgetClassification, accountNumber,
                                                 onDateChange, onBudgetClassificationChange, onAccountNumberChange,
                                             }: Props) {
    return (
        <div className="overflow-hidden rounded-[16px] sm:rounded-[22px] border border-page-border bg-white shadow-soft">

            {/* ── Header ── */}
            <div className="flex items-center gap-2.5 border-b border-page-border px-4 sm:px-[18px] py-3.5 sm:py-[14px]">
                <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-soft text-[11px] sm:text-xs font-bold text-accent-ink">
                    1
                </div>
                <h2 className="m-0 text-[14px] sm:text-[15px] font-semibold text-ink">
                    PO Information
                </h2>
            </div>

            {/* ── Form Fields ── */}
            <div className="px-4 sm:px-[18px] py-4">
                {/* Адаптивна сітка:
                  - 1 колонка на мобільному
                  - 2 колонки на планшеті (sm)
                  - 4 колонки на десктопі (lg)
                */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-[14px]">

                    <label className="flex flex-col gap-1.5">
                        <span className="text-[11.5px] sm:text-xs font-medium text-ink-700">PO Number</span>
                        <input
                            type="text"
                            value={poNumber}
                            readOnly
                            className={`${inputCls} bg-surface-soft`}
                        />
                    </label>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-[11.5px] sm:text-xs font-medium text-ink-700">Date</span>
                        <input
                            type="text"
                            value={date}
                            onChange={(e) => onDateChange(e.target.value)}
                            className={inputCls}
                        />
                    </label>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-[11.5px] sm:text-xs font-medium text-ink-700">Budget Classification</span>
                        <input
                            type="text"
                            value={budgetClassification}
                            onChange={(e) => onBudgetClassificationChange(e.target.value)}
                            className={inputCls}
                        />
                    </label>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-[11.5px] sm:text-xs font-medium text-ink-700">Account Number</span>
                        <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => onAccountNumberChange(e.target.value)}
                            className={inputCls}
                        />
                    </label>

                </div>
            </div>

        </div>
    );
}