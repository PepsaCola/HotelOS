import { CalendarIcon, PlusIcon } from "@/components/ui/icons";
import { RefreshIcon } from "./icons";

interface InvoicesHeaderProps {
    month: string;
    lastSync: string;
    onAddInvoice: () => void;
}

export function InvoicesHeader({ month, lastSync, onAddInvoice }: InvoicesHeaderProps) {
    return (
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            {/* ── Текстовий блок ── */}
            <div className="w-full sm:w-auto">
                <h1 className="text-[22px] sm:text-2xl font-bold leading-tight tracking-tight text-ink-900">
                    Invoices
                </h1>

                {/* Адаптивні переноси для мета-даних */}
                <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] sm:text-[13.5px] text-muted-strong">
                    <span className="font-semibold text-ink-700">{month}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="flex items-center gap-1.5">
                        <span className="sm:hidden">|</span> last sync {lastSync}
                    </span>
                </div>
            </div>

            {/* ── Блок кнопок ── */}
            {/* На мобільному: сітка 2х2 (Add Invoice на всю ширину). На ПК: flex-рядок */}
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center mt-1 sm:mt-0">

                <button
                    type="button"
                    className="inline-flex h-9 w-full sm:w-auto justify-center items-center gap-1.5 sm:gap-2 rounded-[9px] border border-hair-2 bg-white px-2 sm:px-3.5 text-[12.5px] sm:text-[13.5px] font-medium text-ink-900 shadow-sm sm:shadow-none hover:bg-surface-soft transition-colors"
                >
                    <RefreshIcon className="shrink-0" />
                    <span>Refresh</span>
                </button>

                <button
                    type="button"
                    className="inline-flex h-9 w-full sm:w-auto justify-center items-center gap-1.5 sm:gap-2 rounded-[9px] border border-hair-2 bg-white px-2 sm:px-3.5 text-[12.5px] sm:text-[13.5px] font-medium text-ink-900 shadow-sm sm:shadow-none hover:bg-surface-soft transition-colors"
                >
                    <CalendarIcon className="h-[14px] w-[14px] shrink-0" />
                    <span className="truncate">{month}</span>
                </button>

                <button
                    type="button"
                    onClick={onAddInvoice}
                    className="col-span-2 sm:col-span-1 inline-flex h-9 w-full sm:w-auto justify-center items-center gap-1.5 sm:gap-2 rounded-[9px] border border-ink-900 bg-ink-900 px-3 sm:px-3.5 text-[12.5px] sm:text-[13.5px] font-medium text-white shadow-soft hover:bg-black transition-colors"
                >
                    <PlusIcon className="h-4 w-4 shrink-0" />
                    <span>Add Invoice</span>
                </button>

            </div>

        </div>
    );
}