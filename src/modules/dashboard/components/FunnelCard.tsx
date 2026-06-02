import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FunnelStage, FunnelView } from "@/types/dashboard";
import { Card, CardHeader } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

interface FunnelCardProps {
  stages: FunnelStage[];
}

const VIEW_OPTIONS = [
  { value: "count" as const, label: "Count" },
  { value: "amount" as const, label: "Amount" },
  { value: "age" as const, label: "Avg age" },
];

const fillColor: Record<FunnelStage["tone"], string> = {
  neutral: "rgba(74, 80, 90, 0.3)",
  "accent-soft": "rgba(91, 91, 242, 0.5)",
  accent: "var(--color-accent)",
  warn: "var(--color-warn)",
  "warn-soft": "rgba(165, 90, 0, 0.7)",
  crit: "rgba(177, 52, 52, 0.8)",
};

const badgeToneClass: Record<FunnelStage["badgeTone"], string> = {
  good: "bg-good-bg text-good",
  warn: "bg-warn-bg text-warn",
  crit: "bg-crit-bg text-crit",
  neutral: "bg-neutral-bg text-neutral-ink",
};

const subtitleByView: Record<FunnelView, string> = {
  count: "Workflow progression · bottleneck detection",
  amount: "Open PO value through workflow stages",
  age: "Average days spent at each stage",
};

const footByView: Record<FunnelView, string> = {
  count: "42 active POs · Day 23 of period",
  amount: "$813.7K moving through workflow",
  age: "Median handoff 4.6 days",
};

function stageValue(stage: FunnelStage, view: FunnelView) {
  return view === "count" ? stage.count : view === "amount" ? stage.amount : stage.age;
}

export function FunnelCard({ stages }: FunnelCardProps) {
  const [view, setView] = useState<FunnelView>("count");
  const navigate = useNavigate();
  const max = Math.max(...stages.map((stage) => stageValue(stage, view)));

  return (
    <Card>
      <CardHeader
        title="PO Lifecycle Funnel"
        subtitle={subtitleByView[view]}
        actions={<SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} aria-label="Funnel view" />}
      />

      <div key={view} className="px-[18px] py-3.5">
        {stages.map((stage, index) => {
          const value = stageValue(stage, view);
          return (
            <div
              key={stage.name}
              className="grid animate-fade-up grid-cols-[80px_1fr_64px_56px] items-center gap-2.5 border-b border-hair py-1.5 last:border-b-0"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <div className="text-[12.5px] font-semibold text-ink-700">{stage.name}</div>
              <div className="relative h-3.5 rounded-sm bg-[#fafaf6]">
                <span
                  className="absolute left-0 top-0 h-full origin-left animate-bar-grow rounded-sm"
                  style={{ width: `${(value / max) * 100}%`, background: fillColor[stage.tone] }}
                />
              </div>
              <div className="text-right text-xs font-bold text-ink-900">
                {view === "count" ? value : view === "amount" ? `$${value.toFixed(1)}K` : `${value.toFixed(1)}d`}
              </div>
              <div className={`whitespace-nowrap rounded px-1.5 py-0.5 text-center text-[10px] font-bold ${badgeToneClass[stage.badgeTone]}`}>
                {stage.badge}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-hair bg-[#fafbfa] px-[18px] py-2.5 text-[11.5px] text-muted-strong">
        <span>{footByView[view]}</span>
        <button type="button" className="text-xs font-semibold text-accent-ink hover:underline" onClick={() => navigate("/po-log")}>
          Open PO log
        </button>
      </div>
    </Card>
  );
}
