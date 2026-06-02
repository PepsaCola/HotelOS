import { useLayout } from "@/contexts/LayoutContext";
import { useDashboard } from "./useDashboard";
import { DashboardHeader } from "./components/DashboardHeader";
import { KpiStrip } from "./components/KpiStrip";
import { RevenuePaceCard } from "./components/RevenuePaceCard";
import { DeptBurnCard } from "./components/DeptBurnCard";
import { AgingRiskCard } from "./components/AgingRiskCard";
import { FunnelCard } from "./components/FunnelCard";
import { HeatmapCard } from "./components/HeatmapCard";
import { ActivityTable } from "./components/ActivityTable";

export default function DashboardPage() {
  const { data, loading, error } = useDashboard();
  const { displayOptions } = useLayout();

  if (loading) {
    return (
      <div className="grid min-h-[320px] place-items-center text-sm text-muted-strong">
        Loading dashboard…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid min-h-[320px] place-items-center rounded-2xl border border-crit-bg bg-crit-soft p-10 text-center">
        <div>
          <p className="text-sm font-semibold text-crit">Could not load the dashboard</p>
          <p className="mt-2 text-[13px] text-muted-strong">{error?.message ?? "Unknown error"}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-3.5 text-ink-900">
      <DashboardHeader meta={data.meta} />

      {displayOptions.showKpiStrip && <KpiStrip cards={data.kpis} />}

      <div className="grid grid-cols-1 gap-3.5 min-[1440px]:grid-cols-[1.5fr_1fr]">
        <RevenuePaceCard metrics={data.metrics} periods={data.periods} />
        <DeptBurnCard views={data.deptViews} />
      </div>

      <AgingRiskCard buckets={data.agingBuckets} views={data.agingRiskViews} />

      <div className="grid grid-cols-1 gap-3.5 min-[1440px]:grid-cols-2">
        <FunnelCard stages={data.funnelStages} />
        <HeatmapCard columns={data.heatmap.columns} rows={data.heatmap.rows} views={data.heatmap.views} />
      </div>

      <ActivityTable invoices={data.invoices} purchaseOrders={data.purchaseOrders} counts={data.counts} />

      <div className="mt-0.5 flex flex-wrap gap-3.5 px-1 text-[11.5px] text-[#9aa0a8]">
        <span>
          <b className="font-semibold text-muted-strong">Hatch period</b> · {data.meta.periodDayLabel}
        </span>
        <span>·</span>
        <span>
          Showing all data for <b className="font-semibold text-muted-strong">{data.meta.hotel}</b>
        </span>
        <span className="sm:ml-auto">Last sync {data.meta.lastSync} · M3 connected</span>
      </div>
    </section>
  );
}
