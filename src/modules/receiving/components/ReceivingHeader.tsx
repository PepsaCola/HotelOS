import { DownloadIcon } from "@/components/ui/icons";

interface ReceivingHeaderProps {
    subtitle: string;
}

export function ReceivingHeader({ subtitle }: ReceivingHeaderProps) {
    return (
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            {/* ── Текстовий блок ── */}
            <div className="w-full sm:w-auto">
                <h1 className="text-[22px] sm:text-2xl font-bold leading-tight tracking-tight text-ink-900">
                    Receiving
                </h1>
                <p className="mt-1 text-[13px] sm:text-[13.5px] text-muted-strong">
                    {subtitle}
                </p>
            </div>

            {/* ── Блок кнопок ── */}
            <div className="w-full sm:w-auto mt-1 sm:mt-0">
                <button
                    type="button"
                    className="inline-flex h-9 w-full sm:w-auto justify-center items-center gap-1.5 sm:gap-2 rounded-[9px] border border-hair-2 bg-white px-3.5 text-[12.5px] sm:text-[13.5px] font-medium text-ink-900 shadow-sm sm:shadow-none transition-colors hover:bg-surface-soft"
                >
                    <DownloadIcon className="h-[15px] w-[15px] shrink-0" />
                    <span>Export Report</span>
                </button>
            </div>

        </div>
    );
}