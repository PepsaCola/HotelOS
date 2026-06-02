import type { ApprovalsMeta } from "@/types/approvals";
import { UserIcon } from "./icons";

interface RoleBarProps {
    meta: ApprovalsMeta;
}

export function RoleBar({ meta }: RoleBarProps) {
    const { reviewer, chain } = meta;
    const step = chain.activeIndex + 1;

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3 rounded-xl border border-[#d9dbff] bg-accent-soft px-3.5 py-3 sm:px-4 sm:py-2.5">

            {/* ── Ліва частина: Роль та Поточний крок ── */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[13px] sm:text-sm font-medium text-accent-ink">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-accent" />
                    <span>
            Reviewing as <strong>{reviewer.role}</strong>
          </span>
                </div>

                {/* На мобільному падає на новий рядок без тире, на ПК - в лінію з тире */}
                <span className="hidden sm:inline opacity-70">—</span>
                <span className="opacity-70 text-[12px] sm:text-[13px]">
          Step {step} of {chain.steps.length} in the approval chain
        </span>
            </div>

            {/* ── Права частина: Візуальний ланцюжок ── */}
            <div className="hidden text-[11.5px] sm:text-xs text-muted-strong md:block">
                {chain.steps.map((label, i) => (
                    <span key={label} className="whitespace-nowrap">
            {i > 0 ? <span className="mx-1.5 opacity-50">→</span> : ""}
                        {i === chain.activeIndex ? (
                            <strong className="text-ink-900">{label}</strong>
                        ) : (
                            label
                        )}
          </span>
                ))}
            </div>

        </div>
    );
}