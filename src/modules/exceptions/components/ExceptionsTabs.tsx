import type { ExceptionStatusFilter } from "@/types/exceptions";

interface ExceptionsTabsProps {
    tab: ExceptionStatusFilter;
    onChange: (tab: ExceptionStatusFilter) => void;
    counts: Record<ExceptionStatusFilter, number>;
}

const TABS: Array<{
    id: ExceptionStatusFilter;
    label: string;
    shortLabel: string;
    variant: "default" | "crit" | "warn";
}> = [
    { id: "all",         label: "All",           shortLabel: "All",      variant: "default" },
    { id: "over_budget", label: "Over Budget",   shortLabel: "Budget",   variant: "crit"    },
    { id: "no_po",       label: "No PO Match",   shortLabel: "No PO",   variant: "crit"    },
    { id: "mismatch",    label: "Line Mismatch", shortLabel: "Mismatch", variant: "warn"    },
    { id: "rejected",    label: "Rejected",      shortLabel: "Rejected", variant: "default" },
    { id: "resolved",    label: "Resolved",      shortLabel: "Resolved", variant: "default" },
];

export function ExceptionsTabs({ tab, onChange, counts }: ExceptionsTabsProps) {
    return (
        <div className="border-b border-hair bg-[#fbfbfa]">
            {/* Scrollable container — прибираємо scrollbar візуально */}
            <div className="overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex min-w-max gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4">
                    {TABS.map((t) => {
                        const isActive = tab === t.id;

                        const activeClass =
                            isActive && t.variant === "crit" ? "bg-crit text-white" :
                                isActive && t.variant === "warn" ? "bg-warn text-white" :
                                    isActive                          ? "bg-[#0c1320] text-white" : "";

                        const count = counts[t.id];
                        const showBadge = !isActive && count > 0 && (t.variant === "crit" || t.variant === "warn");

                        return (
                            <button
                                key={t.id}
                                onClick={() => onChange(t.id)}
                                className={`relative inline-flex h-8 items-center gap-2 rounded-lg px-3 text-[13px] font-semibold transition-colors sm:h-9 sm:gap-[10px] sm:px-4 sm:text-[14px] ${
                                    isActive
                                        ? activeClass
                                        : "bg-[#f1f1ef] text-[#4a505a] hover:bg-[#ececeb] hover:text-ink-900"
                                }`}
                            >
                                {/* Повна назва на sm+, скорочена на mobile */}
                                <span className="hidden sm:inline">{t.label}</span>
                                <span className="inline sm:hidden">{t.shortLabel}</span>

                                {/* Лічильник */}
                                <span
                                    className={`tabular-nums text-[13px] font-medium sm:text-[14px] ${
                                        isActive ? "text-white/70" : "text-[#8f96a0]"
                                    }`}
                                >
                  {count}
                </span>

                                {/* Dot-індикатор для критичних вкладок з активними items */}
                                {showBadge && (
                                    <span
                                        className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-white ${
                                            t.variant === "crit" ? "bg-crit" : "bg-warn"
                                        }`}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}