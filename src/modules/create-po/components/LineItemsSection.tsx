import type { LineItem } from "@/types/createPO.ts";
import { CloseIcon, PlusIcon } from "@/components/ui/icons.tsx";
import { formatCurrency } from "../lib/po";

interface Props {
    lineItems: LineItem[];
    subtotal: number;
    total: number;
    shipping: string;
    tax: string;
    onUpdateLineItem: (id: number, field: keyof LineItem, value: string) => void;
    onAddLineItem: () => void;
    onRemoveLineItem: (id: number) => void;
    onShippingChange: (v: string) => void;
    onTaxChange: (v: string) => void;
}

const cellInput =
    "w-full h-[34px] rounded-[9px] border border-hair-2 bg-white px-2.5 sm:px-3 text-[13px] sm:text-sm text-ink-700 transition-colors focus:border-blue focus:outline-none placeholder:text-muted/60";

const thCls =
    "border-y border-page-border bg-[#fbfbfd] px-2 sm:px-3 py-2.5 sm:py-[11px] text-[11.5px] sm:text-xs font-medium text-muted whitespace-nowrap";

export default function LineItemsSection({
                                             lineItems, subtotal, total, shipping, tax,
                                             onUpdateLineItem, onAddLineItem, onRemoveLineItem,
                                             onShippingChange, onTaxChange,
                                         }: Props) {
    return (
        <div className="overflow-hidden rounded-[16px] sm:rounded-[22px] border border-page-border bg-white shadow-soft">

            {/* ── Header ── */}
            <div className="flex items-center gap-2.5 border-b border-page-border px-4 sm:px-[18px] py-3.5 sm:py-[14px]">
                <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-soft text-[11px] sm:text-xs font-bold text-accent-ink">
                    3
                </div>
                <h2 className="m-0 text-[14px] sm:text-[15px] font-semibold text-ink">Line Items</h2>
            </div>

            <div className="px-4 sm:px-[18px] py-4 pb-5 sm:pb-[18px]">

                {/* ── Table (зі скролом на мобільних) ── */}
                <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <table className="w-full min-w-[760px] border-separate border-spacing-0 text-[13px] sm:text-[13.5px]">
                        <thead>
                        <tr>
                            <th className={`${thCls} w-20 rounded-l-[10px] border-l text-left`}>QTY</th>
                            <th className={`${thCls} w-[140px] text-left`}>Package/Unit #</th>
                            <th className={`${thCls} text-left min-w-[200px]`}>Description</th>
                            <th className={`${thCls} w-[120px] text-right`}>Unit Price</th>
                            <th className={`${thCls} w-[120px] text-right`}>Amount</th>
                            <th className={`${thCls} w-[50px] rounded-r-[10px] border-r`} />
                        </tr>
                        </thead>
                        <tbody>
                        {lineItems.map((item) => (
                            <tr key={item.id} className="group">
                                <td className="border-b border-page-border px-2 sm:px-3 py-2.5 sm:py-[14px]">
                                    <input
                                        type="text"
                                        value={item.qty}
                                        placeholder="QTY"
                                        onChange={(e) => onUpdateLineItem(item.id, "qty", e.target.value)}
                                        className={cellInput}
                                    />
                                </td>
                                <td className="border-b border-page-border px-2 sm:px-3 py-2.5 sm:py-[14px]">
                                    <input
                                        type="text"
                                        value={item.unit}
                                        placeholder="Pkg/Unit #"
                                        onChange={(e) => onUpdateLineItem(item.id, "unit", e.target.value)}
                                        className={cellInput}
                                    />
                                </td>
                                <td className="border-b border-page-border px-2 sm:px-3 py-2.5 sm:py-[14px]">
                                    <input
                                        type="text"
                                        value={item.description}
                                        placeholder="Description"
                                        onChange={(e) => onUpdateLineItem(item.id, "description", e.target.value)}
                                        className={cellInput}
                                    />
                                </td>
                                <td className="border-b border-page-border px-2 sm:px-3 py-2.5 sm:py-[14px]">
                                    <input
                                        type="text"
                                        value={item.unitPrice}
                                        placeholder="0.00"
                                        onChange={(e) => onUpdateLineItem(item.id, "unitPrice", e.target.value)}
                                        className={`${cellInput} text-right`}
                                    />
                                </td>
                                <td className="border-b border-page-border px-2 sm:px-3 py-2.5 sm:py-[14px]">
                                    <input
                                        type="text"
                                        value={item.amount}
                                        placeholder="0.00"
                                        onChange={(e) => onUpdateLineItem(item.id, "amount", e.target.value)}
                                        className={`${cellInput} text-right`}
                                    />
                                </td>
                                <td className="border-b border-page-border px-2 sm:px-3 py-2.5 sm:py-[14px] text-center">
                                    <button
                                        type="button"
                                        onClick={() => onRemoveLineItem(item.id)}
                                        aria-label="Remove line item"
                                        className="inline-grid h-7 w-7 place-items-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-ink"
                                    >
                                        <CloseIcon className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Add Item Button ── */}
                {/* Мобільний: на всю ширину. ПК: компактна кнопка */}
                <button
                    type="button"
                    onClick={onAddLineItem}
                    className="mt-4 sm:mt-3 w-full sm:w-auto inline-flex h-9 items-center justify-center gap-1.5 sm:gap-2 rounded-[10px] bg-[#20212a] px-4 sm:px-3.5 text-[13px] sm:text-sm font-medium text-white hover:opacity-90 transition-opacity"
                >
                    <PlusIcon className="h-4 w-4" />
                    Add Item
                </button>

                {/* ── Summary panel ── */}
                {/* Мобільний: на всю ширину екрана. ПК: притиснуто вправо */}
                <div className="ml-auto mt-6 sm:mt-2 w-full sm:w-[250px]">
                    <div className="flex items-center justify-between gap-2.5 py-1.5">
                        <span className="text-[13px] sm:text-[13.5px] text-[#615f72]">Subtotal</span>
                        <span className="text-[13px] sm:text-[13.5px] font-semibold text-ink">{formatCurrency(subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2.5 py-1.5">
                        <span className="text-[13px] sm:text-[13.5px] text-[#615f72]">Shipping</span>
                        <input
                            type="text"
                            value={shipping}
                            placeholder="0.00"
                            onChange={(e) => onShippingChange(e.target.value)}
                            className="h-[34px] w-24 rounded-xl border border-hair-2 bg-white px-3 text-right text-[13px] sm:text-sm text-ink-700 transition-colors focus:border-blue focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-between gap-2.5 py-1.5">
                        <span className="text-[13px] sm:text-[13.5px] text-[#615f72]">Tax</span>
                        <input
                            type="text"
                            value={tax}
                            placeholder="0.00"
                            onChange={(e) => onTaxChange(e.target.value)}
                            className="h-[34px] w-24 rounded-xl border border-hair-2 bg-white px-3 text-right text-[13px] sm:text-sm text-ink-700 transition-colors focus:border-blue focus:outline-none"
                        />
                    </div>

                    <div className="mt-2.5 sm:mt-2 flex items-center justify-between gap-2.5 border-t border-[#55586d] pt-3 sm:pt-3">
                        <span className="text-[13.5px] font-medium text-[#615f72]">Total</span>
                        <span className="text-[20px] sm:text-[22px] font-bold text-ink">{formatCurrency(total)}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}