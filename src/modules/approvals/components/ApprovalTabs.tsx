import type { ApprovalsTab } from "../lib/summary";

interface ApprovalTabsProps {
  tab: ApprovalsTab;
  onChange: (tab: ApprovalsTab) => void;
  counts: { myQueue: number; allActive: number; completed: number };
}

interface TabDef {
  id: ApprovalsTab;
  label: string;
  badge: number;
  critBadge?: boolean;
}

export function ApprovalTabs({ tab, onChange, counts }: ApprovalTabsProps) {
  const tabs: TabDef[] = [
    { id: "myQueue", label: "My Queue", badge: counts.myQueue, critBadge: true },
    { id: "allActive", label: "All Active", badge: counts.allActive },
    { id: "completed", label: "Completed", badge: counts.completed },
  ];

  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <div className="flex w-max gap-0.5 rounded-[11px] bg-surface-chip p-1">
        {tabs.map((item) => {
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
                  item.critBadge ? "bg-crit-bg text-crit" : isActive ? "bg-accent-soft text-accent-ink" : "bg-[#dcdde0] text-ink-700"
                }`}
              >
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
