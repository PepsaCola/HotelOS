import type { POLogTab } from "../lib/aggregate";

interface POLogTabsProps {
  tab: POLogTab;
  onChange: (tab: POLogTab) => void;
  activeCount: number;
  fixedCount: number;
}

interface TabDef {
  id: POLogTab;
  label: string;
  badge?: number;
}

export function POLogTabs({ tab, onChange, activeCount, fixedCount }: POLogTabsProps) {
  const tabs: TabDef[] = [
    { id: "active", label: "Active POs", badge: activeCount },
    { id: "fixed", label: "Fixed Expenses", badge: fixedCount },
    { id: "dept", label: "By Department" },
    { id: "prepaid", label: "Prepaid Items" },
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
              {item.badge != null ? (
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] ${
                    isActive ? "bg-accent-soft text-accent-ink" : "bg-[#dcdde0] text-ink-700"
                  }`}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
