import { useState } from "react";
import type { DeptView, DeptViewData } from "@/types/dashboard";
import { Card, CardHeader } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { departmentBgClass } from "@/lib/departments";

interface DeptBurnCardProps {
  views: Record<DeptView, DeptViewData>;
}

const VIEW_OPTIONS = [
  { value: "actual" as const, label: "Actual" },
  { value: "committed" as const, label: "+Committed" },
  { value: "forecast" as const, label: "Forecast" },
];

export function DeptBurnCard({ views }: DeptBurnCardProps) {
  const [view, setView] = useState<DeptView>("committed");
  const model = views[view];

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Dept. Spend vs Budget Burn"
        subtitle={model.subtitle}
        actions={<SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} aria-label="Spend view" />}
      />

      <div key={view} className="flex flex-col gap-2 px-4 pb-1.5 pt-3">
        {model.rows.map((row, index) => (
          <div
            key={row.name}
            className="grid animate-fade-up grid-cols-[104px_1fr_80px] items-center gap-2.5"
            style={{ animationDelay: `${index * 45}ms` }}
          >
            <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-900">
              <span className={`h-2 w-2 flex-shrink-0 rounded-sm ${departmentBgClass[row.name]}`} />
              {row.name}
            </div>
            <div className="relative h-4 rounded border border-hair bg-[#fafaf6]">
              <span
                className={`absolute left-0 top-0 h-full origin-left animate-bar-grow rounded-sm ${departmentBgClass[row.name]}`}
                style={{ width: `${row.fill}%` }}
              />
              <span
                className="absolute -top-1 -bottom-1 w-0.5 bg-ink-900 before:absolute before:-left-[3px] before:-top-[3px] before:h-[3px] before:w-2 before:bg-ink-900 before:content-['']"
                style={{ left: `${row.marker}%` }}
              />
            </div>
            <div className="text-right text-xs font-bold text-ink-900">
              {row.amount}
              <small className={`mt-px block text-[10.5px] font-semibold ${row.deltaTone === "up" ? "text-good" : "text-crit"}`}>
                {row.delta}
              </small>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-hair px-4 py-2.5 text-[11.5px] text-muted-strong">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-0.5 bg-ink-900" />
          {model.footLabel}
        </span>
        <span className={`font-bold ${model.footTone === "good" ? "text-good" : "text-crit"}`}>
          {model.footCallout}
        </span>
      </div>
    </Card>
  );
}
