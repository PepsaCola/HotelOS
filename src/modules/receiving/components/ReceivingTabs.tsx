import type { ReceivingStatus } from "@/types/receiving";

interface ReceivingTabsProps {
    tab: ReceivingStatus;
    onChange: (tab: ReceivingStatus) => void;
    counts: Record<string, number>;
}

interface TabDef {
    id: ReceivingStatus;
    label: string;
    critBadge?: boolean;
}

const TABS: TabDef[] = [
    { id: "all",      label: "All" },
    { id: "awaiting", label: "Awaiting Receipt" },
    { id: "partial",  label: "Partial" },
    { id: "today",    label: "Today" },
    { id: "overdue",  label: "Overdue", critBadge: true },
    { id: "received", label: "Received" },
];

export function ReceivingTabs({ tab, onChange, counts }: ReceivingTabsProps) {
    return (
        <div className="-mx-1 overflow-x-auto px-1">
            <div className="flex w-max gap-0.5 rounded-[11px] bg-surface-chip p-1">
                {TABS.map((item) => {
                    const isActive = tab === item.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onChange(item.id)}
                            className={`flex shrink-0 items-center whitespace-nowrap rounded-lg px-3.5 py-[7px] text-[13px] font-medium transition-colors ${
                                isActive
                                    ? "bg-white text-ink-900 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_var(--color-hair-2)]"
                                    : "text-muted-strong hover:text-ink-900"
                            }`}
                        >
                            {item.label}
                            <span
                                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] ${
                                    item.critBadge
                                        ? "bg-crit-bg text-crit"
                                        : isActive
                                            ? "bg-accent-soft text-accent-ink"
                                            : "bg-[#dcdde0] text-ink-700"
                                }`}
                            >
                {counts[item.id] ?? 0}
              </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}