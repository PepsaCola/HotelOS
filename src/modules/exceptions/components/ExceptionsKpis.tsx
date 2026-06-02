import type { ExceptionsKpi } from "@/types/exceptions";
import { formatMoney } from "@/lib/money";

interface ExceptionsKpisProps {
    kpi: ExceptionsKpi;
}

const LABEL = "flex items-center gap-[6px] text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted";
const SUB   = "text-[12px] text-[#9aa0a8]";

export function ExceptionsKpis({ kpi }: ExceptionsKpisProps) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-[14px] lg:grid-cols-4">

            {/* Open Exceptions — crit-card */}
            <div className="flex flex-col gap-[5px] rounded-[14px] border border-[#f0c6c6] bg-[#fff8f8] px-4 pb-4 pt-4 sm:px-[18px] sm:pb-[16px] sm:pt-[18px]">
                <div className={LABEL}>Open Exceptions</div>
                <div className="text-[28px] font-bold leading-[1.1] tracking-[-0.025em] tabular-nums text-crit sm:text-[32px]">
                    {kpi.openCount}
                </div>
                <div className={SUB}>Require your attention</div>
            </div>

            {/* Over Budget — warn-card */}
            <div className="flex flex-col gap-[5px] rounded-[14px] border border-[#f3d9b0] bg-[#fffaf4] px-4 pb-4 pt-4 sm:px-[18px] sm:pb-[16px] sm:pt-[18px]">
                <div className={LABEL}>Over Budget</div>
                <div className="text-[28px] font-bold leading-[1.1] tracking-[-0.025em] tabular-nums text-warn sm:text-[32px]">
                    {kpi.overBudgetCount}
                </div>
                <div className={SUB}>{formatMoney(kpi.overBudgetExposure)} total exposure</div>
            </div>

            {/* No PO Match — warn-card */}
            <div className="flex flex-col gap-[5px] rounded-[14px] border border-[#f3d9b0] bg-[#fffaf4] px-4 pb-4 pt-4 sm:px-[18px] sm:pb-[16px] sm:pt-[18px]">
                <div className={LABEL}>No PO Match</div>
                <div className="text-[28px] font-bold leading-[1.1] tracking-[-0.025em] tabular-nums text-warn sm:text-[32px]">
                    {kpi.noPOCount}
                </div>
                <div className={SUB}>Invoices without linked PO</div>
            </div>

            {/* Resolved — neutral */}
            <div className="flex flex-col gap-[5px] rounded-[14px] border border-hair-2 bg-white px-4 pb-4 pt-4 sm:px-[18px] sm:pb-[16px] sm:pt-[18px]">
                <div className={LABEL}>Resolved This Month</div>
                <div className="text-[28px] font-bold leading-[1.1] tracking-[-0.025em] tabular-nums text-ink-900 sm:text-[32px]">
                    {kpi.resolvedThisMonthCount}
                </div>
                <div className={SUB}>Avg. resolution {kpi.avgResolutionDays} days</div>
            </div>

        </div>
    );
}