interface Props {
    billedTo: string;
    vendor: string;
    onBilledToChange: (v: string) => void;
    onVendorChange: (v: string) => void;
}

const inputCls =
    "h-10 w-full rounded-xl border border-hair-2 bg-white px-3 text-[13.5px] sm:text-sm text-ink-700 transition-colors focus:border-blue focus:outline-none";

export default function ShippingSection({ billedTo, vendor, onBilledToChange, onVendorChange }: Props) {
    return (
        <div className="overflow-hidden rounded-[16px] sm:rounded-[22px] border border-page-border bg-white shadow-soft">

            {/* ── Header ── */}
            <div className="flex items-center gap-2.5 border-b border-page-border px-4 sm:px-[18px] py-3.5 sm:py-[14px]">
                <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-soft text-[11px] sm:text-xs font-bold text-accent-ink">
                    2
                </div>
                <h2 className="m-0 text-[14px] sm:text-[15px] font-semibold text-ink">
                    Shipping Information
                </h2>
            </div>

            {/* ── Form Fields ── */}
            <div className="px-4 sm:px-[18px] py-4">
                {/* Адаптивна сітка: 1 колонка на мобільному, 2 на ПК */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-[14px]">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-[11.5px] sm:text-xs font-medium text-ink-700">Billed to</span>
                        <input
                            type="text"
                            value={billedTo}
                            onChange={(e) => onBilledToChange(e.target.value)}
                            className={inputCls}
                        />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-[11.5px] sm:text-xs font-medium text-ink-700">Vendor</span>
                        <input
                            type="text"
                            value={vendor}
                            onChange={(e) => onVendorChange(e.target.value)}
                            className={inputCls}
                        />
                    </label>
                </div>
            </div>

        </div>
    );
}