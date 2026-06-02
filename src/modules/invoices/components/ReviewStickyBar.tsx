import type { Invoice, PoDetail } from "@/types/invoices";
import { formatMoney } from "@/lib/money";
import { Ic } from "./ReviewShared";

interface ReviewStickyBarProps {
    invoice: Invoice;
    activePo: PoDetail;
    flow: number;
    onReject: () => void;
    onApprove: () => void;
}

export function ReviewStickyBar({ invoice, activePo, flow, onReject, onApprove }: ReviewStickyBarProps) {
    const approveLabel = flow === 4 ? "Approve with note" : "Approve mapping";

    return (
        // Адаптація: semantic footer + підтримка safe-area для iOS
        <div className="fixed inset-x-4 bottom-4 z-[60] pb-[env(safe-area-inset-bottom)] lg:absolute lg:inset-x-4 lg:bottom-4 lg:z-30 lg:pb-0">
            <div className="flex flex-col gap-3.5 rounded-[14px] border border-white/10 bg-gradient-to-b from-[#0f1423] to-[#191f35] p-4 shadow-[0_4px_24px_rgba(12,19,32,.35),inset_0_1px_0_rgba(255,255,255,.06)] lg:min-h-[64px] lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-5 lg:py-0">

                {/* Інформаційний блок */}
                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-5">

                    {/* Десктопне інфо про інвойс */}
                    <div className="hidden min-w-0 flex-col gap-0.5 lg:flex">
                        <span className="truncate text-[15px] font-medium text-white">{invoice.id}</span>
                        <div className="flex items-center gap-1.5 text-[12.5px] text-[#90959c]">
                            <span className="max-w-[120px] truncate">{invoice.vendor}</span>
                            <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-[#90959c]" />
                            <span className="font-semibold text-white">{formatMoney(invoice.amount)}</span>
                        </div>
                    </div>

                    {/* Вертикальний розділювач для великих екранів */}
                    <div className="hidden h-10 w-px shrink-0 bg-white/12 lg:block" />

                    {/* Дані про цільове замовлення (PO) */}
                    <div className="flex min-w-0 items-center justify-between gap-4 sm:justify-start">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#90959c]">PO Target</span>
                            <span className="max-w-[150px] truncate text-base font-semibold text-white sm:max-w-none lg:text-lg">
                                {activePo.ref}
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#90959c]">Matching</span>
                            <div className="mt-0.5 flex items-center gap-1">
                                <span className="inline-flex h-[20px] items-center gap-1 whitespace-nowrap rounded-[6px] bg-green-soft px-2 text-[12px] font-medium text-green sm:h-[22px]">
                                    PO <Ic d="m5 12 4 4L19 6" w="2" className="h-3 w-3" />
                                </span>
                                <span className="inline-flex h-[20px] items-center gap-1 whitespace-nowrap rounded-[6px] bg-green-soft px-2 text-[12px] font-medium text-green sm:h-[22px]">
                                    {activePo.lineMatch}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Компактний рядок суми для мобільних пристроїв */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[13px] sm:hidden">
                        <span className="text-[#90959c]">Invoice Total:</span>
                        <span className="font-bold text-white">{formatMoney(invoice.amount)}</span>
                    </div>
                </div>

                {/* Блок із кнопками дій */}
                <div className="flex w-full items-center gap-2.5 lg:w-auto lg:shrink-0 lg:py-3">
                    <button
                        type="button"
                        onClick={onReject}
                        className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-[#ececec] bg-white px-4 text-[13px] font-semibold text-crit transition-colors hover:bg-surface-soft sm:text-[13.5px] lg:h-9 lg:flex-none"
                    >
                        <Ic d="M18 6L6 18M6 6l12 12" w="1.8" className="h-3.5 w-3.5" />
                        Reject
                    </button>

                    <button
                        type="button"
                        onClick={onApprove}
                        className="flex h-10 flex-[2] items-center justify-center gap-1.5 whitespace-nowrap rounded-[10px] border border-white/15 bg-gradient-to-b from-[#2cbc6e] to-[#1fa05c] px-5 text-[13px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.2)] transition-colors hover:from-[#28a862] hover:to-[#1a8f52] sm:text-[13.5px] lg:h-9 lg:flex-none"
                    >
                        <Ic d="m5 12 4 4L19 6" w="1.8" className="h-3.5 w-3.5" />
                        {approveLabel}
                    </button>
                </div>

            </div>
        </div>
    );
}