import { ArrowRightIcon } from "@/components/ui/icons";
import { useCreatePO } from "./useCreatePO";
import POFormView from "./components/POFormView";
import POPreviewView from "./components/POPreviewView";
import POFinalView from "./components/POFinalView";
import SuccessToast from "./components/SuccessToast";

// Зробили кнопку адаптивною: h-9 на мобільному, h-10 на ПК, додано justify-center для рівномірного розподілу тексту
const btnBase =
    "inline-flex h-9 sm:h-10 items-center justify-center gap-1.5 sm:gap-2 rounded-xl border px-3 sm:px-[14px] text-[12.5px] sm:text-sm font-medium transition-opacity shrink-0";

export default function CreatePOPage() {
    const po = useCreatePO();

    const docProps = {
        poNumber: po.poNumber,
        date: po.date,
        budgetClassification: po.budgetClassification,
        accountNumber: po.accountNumber,
        billedTo: po.billedTo,
        vendor: po.vendor,
        shipping: po.shipping,
        tax: po.tax,
        lineItems: po.lineItems,
        departments: po.departments,
    };

    return (
        <>
            <div className="flex min-h-[calc(100vh-60px)] flex-col bg-[#ededea]">

                {/* ── Sticky page header ── */}
                {po.view !== "final" && (
                    <div className="sticky top-0 z-10 border-b border-page-border bg-[#f6f6f4] px-4 sm:px-6 py-4 sm:py-[18px]">

                        {/* Адаптивний контейнер: flex-col на мобільному, flex-row на ПК */}
                        <div className="mx-auto flex w-full max-w-5xl flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6">

                            {/* Заголовок та кнопка "Back" */}
                            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5 min-w-0">
                                {po.view === "preview" && (
                                    <button
                                        type="button"
                                        onClick={() => po.setView("form")}
                                        className={`${btnBase} border-page-border bg-white text-ink-700 hover:bg-surface-muted w-full sm:w-auto`}
                                    >
                                        Back to Edit
                                    </button>
                                )}
                                <div className="min-w-0">
                                    <h1 className="text-[22px] sm:text-2xl font-bold leading-tight tracking-tight text-ink-900">
                                        New Purchase Order
                                    </h1>
                                    <div className="text-[12px] sm:text-[13.5px] text-muted flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                                        <span className="truncate max-w-full">DoubleTree by Hilton Hotel Orlando Airport</span>
                                        <span className="hidden xs:inline">·</span>
                                        <span className="whitespace-nowrap">
                                            Auto-number: <b className="text-ink">{po.poNumber}</b>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Кнопки дій: сітка 50/50 на мобільному */}
                            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full md:w-auto shrink-0 mt-1 md:mt-0">
                                <button
                                    type="button"
                                    onClick={po.resetForm}
                                    className={`${btnBase} border-page-border bg-white text-ink-700 hover:bg-surface-muted w-full sm:w-auto`}
                                >
                                    Discard Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={po.handlePrimaryAction}
                                    className={`${btnBase} border-[#1f2028] bg-[#1f2028] text-white hover:opacity-90 w-full sm:w-auto`}
                                >
                                    {po.primaryActionLabel}
                                    {po.view === "form" && <ArrowRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                {/* ── Main Content Areas ── */}

                {po.view === "form" && (
                    <POFormView
                        poNumber={po.poNumber}
                        date={po.date}
                        budgetClassification={po.budgetClassification}
                        accountNumber={po.accountNumber}
                        billedTo={po.billedTo}
                        vendor={po.vendor}
                        shipping={po.shipping}
                        tax={po.tax}
                        lineItems={po.lineItems}
                        departments={po.departments}
                        subtotal={po.subtotal}
                        total={po.total}
                        onDateChange={po.setDate}
                        onBudgetClassificationChange={po.setBudgetClassification}
                        onAccountNumberChange={po.setAccountNumber}
                        onBilledToChange={po.setBilledTo}
                        onVendorChange={po.setVendor}
                        onShippingChange={po.setShipping}
                        onTaxChange={po.setTax}
                        onUpdateLineItem={po.updateLineItem}
                        onAddLineItem={po.addLineItem}
                        onRemoveLineItem={po.removeLineItem}
                        onUpdateDepartment={po.updateDepartment}
                    />
                )}

                {po.view === "preview" && (
                    <div className="p-4 sm:py-5 px-4 sm:px-6">
                        <div className="mx-auto w-full max-w-5xl">
                            <POPreviewView {...docProps} />
                        </div>
                    </div>
                )}

                {po.view === "final" && (
                    <div className="p-4 sm:p-5">
                        {/* Замінили фіксовану ширину 1100px на гнучку */}
                        <div className="mx-auto w-full max-w-[1100px]">
                            <POFinalView {...docProps} />
                        </div>
                    </div>
                )}
            </div>

            <SuccessToast visible={po.showToast} />
        </>
    );
}