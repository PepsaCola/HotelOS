import { useState } from "react";
import type { AgingBucket, AgingRiskView, AgingView } from "@/types/dashboard";
import { Card, CardHeader } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

interface AgingRiskCardProps {
  buckets: AgingBucket[];
  views: Record<AgingView, AgingRiskView>;
}

const VIEW_OPTIONS = [
  { value: "amount" as const, label: "Amount" },
  { value: "count" as const, label: "Count" },
  { value: "risk" as const, label: "Risk" },
];

const segToneClass: Record<AgingBucket["tone"], string> = {
  g: "bg-good",
  n: "bg-[#9aa0a8]",
  w: "bg-warn",
  c: "bg-crit",
};

function bucketValue(bucket: AgingBucket, view: AgingView) {
  return view === "amount" ? bucket.value : view === "count" ? bucket.count : bucket.risk;
}

export function AgingRiskCard({ buckets, views }: AgingRiskCardProps) {
  const [view, setView] = useState<AgingView>("amount");
  const meta = views[view];
  const total = buckets.reduce((sum, bucket) => sum + bucketValue(bucket, view), 0);

  return (
    <Card className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
      <div className="border-b border-hair lg:border-b-0 lg:border-r">
        <CardHeader
          title="A/P Aging + Invoice Risk"
          subtitle={meta.subtitle}
          noBorder
          actions={<SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} aria-label="Aging view" />}
        />

        <div key={`bar-${view}`} className="mx-[18px] mb-1.5 mt-2 flex h-[18px] overflow-hidden rounded-[5px] border border-hair-2">
          {buckets.map((bucket) => (
            <span
              key={bucket.name}
              className={`h-full animate-bar-grow ${segToneClass[bucket.tone]}`}
              style={{ width: `${(bucketValue(bucket, view) / total) * 100}%` }}
            />
          ))}
        </div>

        <table className="w-full border-collapse">
          <tbody key={`table-${view}`}>
            {buckets.map((bucket, index) => {
              const display =
                view === "amount" ? `$${bucket.value.toFixed(1)}K` : view === "count" ? `${bucket.count} inv.` : `${bucket.risk} pts`;
              const countLabel =
                view === "amount"
                  ? `${bucket.count} inv.`
                  : view === "count"
                    ? `${Math.round((bucket.count / total) * 100)}% share`
                    : `${bucket.value.toFixed(1)}K`;
              const amountTone = view === "amount" && bucket.tone === "w" ? "text-warn" : view === "amount" && bucket.tone === "c" ? "text-crit" : "text-ink-900";
              return (
                <tr key={bucket.name} className="animate-fade-up [&:first-child_td]:border-t-0" style={{ animationDelay: `${index * 45}ms` }}>
                  <td className="border-t border-hair px-[18px] py-[9px] text-[12.5px]">
                    <span className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-sm ${segToneClass[bucket.tone]}`} />
                      <span className="font-semibold text-ink-900">
                        {bucket.name} <span className="ml-0.5 text-[11px] font-normal text-muted-strong">{bucket.sub}</span>
                      </span>
                    </span>
                  </td>
                  <td className="border-t border-hair px-[18px] py-[9px] text-right text-[12.5px] text-muted-strong">{countLabel}</td>
                  <td className={`border-t border-hair px-[18px] py-[9px] text-right text-[12.5px] font-bold ${amountTone}`}>{display}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div key={`risk-${view}`} className="flex flex-col gap-3 p-4">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted-strong">{meta.title}</div>
        {meta.items.map((item) => (
          <div
            key={item.label}
            className={`flex animate-fade-up items-center justify-between rounded-lg border px-3 py-[9px] text-[12.5px] ${
              item.tone === "crit" ? "border-[#f3cfcb] bg-crit-soft" : "border-[#ecd5a8] bg-warn-soft"
            }`}
          >
            <div>
              <div className="font-semibold text-ink-700">{item.label}</div>
              <div className="mt-0.5 text-[10.5px] text-muted-strong">{item.sub}</div>
            </div>
            <div className={`font-bold ${item.tone === "crit" ? "text-crit" : "text-warn"}`}>{item.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
