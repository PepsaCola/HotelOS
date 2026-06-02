import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DepartmentKey, HeatmapMatrix, HeatmapView } from "@/types/dashboard";
import { Card, CardHeader } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

interface HeatmapCardProps {
  columns: string[];
  rows: DepartmentKey[];
  views: Record<HeatmapView, HeatmapMatrix>;
}

const VIEW_OPTIONS = [
  { value: "count" as const, label: "Count" },
  { value: "amount" as const, label: "Amount" },
  { value: "trend" as const, label: "Trend" },
];

const LOW = "color-mix(in srgb, var(--color-warn) 25%, white)";
const MID = "color-mix(in srgb, var(--color-warn) 55%, white)";

function cellStyle(value: number): { background: string; color: string } {
  if (value === 0) return { background: "#D1E7DF", color: "#157347" };
  if (value <= 2) return { background: LOW, color: "var(--color-warn)" };
  if (value <= 5) return { background: MID, color: "#ffffff" };
  return { background: "var(--color-crit)", color: "#ffffff" };
}

export function HeatmapCard({ columns, rows, views }: HeatmapCardProps) {
  const [view, setView] = useState<HeatmapView>("count");
  const navigate = useNavigate();
  const matrix = views[view];
  const gridTemplateColumns = `110px repeat(${columns.length}, 1fr)`;

  return (
    <Card>
      <CardHeader
        title="Exceptions & Matching Heatmap"
        subtitle={matrix.subtitle}
        actions={<SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} aria-label="Heatmap view" />}
      />

      <div className="px-4 py-3">
        <div className="overflow-x-auto">
          <div key={view} className="grid min-w-[460px] gap-0.5" style={{ gridTemplateColumns }}>
            <div />
            {columns.map((label) => (
              <div key={label} className="animate-fade-up px-0.5 py-1 text-center text-[9px] font-bold uppercase tracking-wide text-muted-strong">
                {label}
              </div>
            ))}

            {rows.map((rowLabel, rowIndex) => (
              <Row key={rowLabel} label={rowLabel} values={matrix.values[rowIndex]} rowIndex={rowIndex} />
            ))}
          </div>
        </div>

        <div className="mt-2.5 flex flex-col gap-2 border-t border-hair pt-2.5 text-[11.5px] text-muted-strong sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm border border-hair-2" style={{ background: "#D1E7DF" }} />
            <span>0</span>
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: LOW }} />
            <span>1–2</span>
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: MID }} />
            <span>3–5</span>
            <span className="h-2.5 w-2.5 rounded-sm bg-crit" />
            <span>6+</span>
          </div>
          <button type="button" className="self-start text-xs font-semibold text-accent-ink hover:underline sm:self-auto" onClick={() => navigate("/exceptions")}>
            {matrix.footLink}
          </button>
        </div>
      </div>
    </Card>
  );
}

function Row({ label, values, rowIndex }: { label: string; values: number[]; rowIndex: number }) {
  return (
    <>
      <div
        className="flex animate-fade-up items-center py-[3px] text-[11px] font-semibold text-ink-700"
        style={{ animationDelay: `${rowIndex * 36}ms` }}
      >
        {label}
      </div>
      {values.map((value, columnIndex) => (
        <div
          key={columnIndex}
          className="flex h-8 animate-fade-up items-center justify-center rounded text-[11px] font-bold"
          style={{ ...cellStyle(value), animationDelay: `${rowIndex * 36 + columnIndex * 22}ms` }}
        >
          {value === 0 ? "" : value}
        </div>
      ))}
    </>
  );
}
