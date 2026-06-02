import { useState } from "react";
import type { MetricBundle, PeriodDef, RevMetric, RevPeriod } from "@/types/dashboard";
import { Card, CardHeader } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { getRevModel } from "../lib/revenue";
import { linePath, type Point } from "../lib/chart";

interface RevenuePaceCardProps {
  metrics: Record<RevPeriod, MetricBundle>;
  periods: Record<RevPeriod, PeriodDef>;
}

const PERIOD_OPTIONS = [
  { value: "MTD" as const, label: "MTD" },
  { value: "QTD" as const, label: "QTD" },
  { value: "YTD" as const, label: "YTD" },
];

const METRIC_OPTIONS = [
  { value: "Revenue" as const, label: "Revenue" },
  { value: "RevPAR" as const, label: "RevPAR" },
  { value: "ADR" as const, label: "ADR" },
  { value: "Occ" as const, label: "Occ" },
];

const CHART_WIDTH = 620;
const CHART_HEIGHT = 220;
const PADDING_X = 26;
const PADDING_TOP = 18;
const PADDING_BOTTOM = 26;

export function RevenuePaceCard({ metrics, periods }: RevenuePaceCardProps) {
  const [period, setPeriod] = useState<RevPeriod>("MTD");
  const [metric, setMetric] = useState<RevMetric>("Revenue");

  const revModel = getRevModel(metrics[period], periods[period], period, metric);
  const { series } = revModel;

  const maxSeries = Math.max(...series.actual, ...series.budget, ...series.forecast, ...series.ly);
  const innerWidth = CHART_WIDTH - PADDING_X * 2;
  const innerHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const scaleX = (index: number) =>
    PADDING_X + (index / Math.max(1, series.actual.length - 1)) * innerWidth;
  const scaleY = (value: number) => PADDING_TOP + (1 - value / maxSeries) * innerHeight;

  const toPoints = (values: number[]): Point[] => values.map((value, index) => [scaleX(index), scaleY(value)]);
  const actualPoints = toPoints(series.actual);
  const budgetPoints = toPoints(series.budget);
  const forecastPoints = toPoints(series.forecast);
  const lyPoints = toPoints(series.ly);
  const todayPoint = actualPoints[revModel.todayIndex];
  const yTicks = Array.from({ length: 4 }, (_, index) => Math.round((maxSeries / 4) * (4 - index)));

  const baseY = CHART_HEIGHT - PADDING_BOTTOM;
  const areaPath = `${linePath(actualPoints)} L${actualPoints[actualPoints.length - 1][0]},${baseY} L${actualPoints[0][0]},${baseY} Z`;

  return (
    <Card>
      <CardHeader
        title="Revenue vs Budget Pace"
        subtitle={revModel.subtitle}
        actions={
          <>
            <SegmentedControl options={PERIOD_OPTIONS} value={period} onChange={setPeriod} aria-label="Period" />
            <SegmentedControl options={METRIC_OPTIONS} value={metric} onChange={setMetric} aria-label="Metric" />
          </>
        }
      />

      <div className="flex flex-col items-start justify-between gap-4 px-4 pb-1 pt-3.5 sm:flex-row sm:items-end sm:px-[18px]">
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted-strong">
            {revModel.title}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2.5 text-[34px] font-extrabold leading-none tracking-tight text-ink-900">
            {revModel.headline}
            <span
              className={`rounded-full px-2 py-[3px] text-xs font-bold ${
                revModel.deltaTone === "good" ? "bg-good-bg text-good" : "bg-warn-bg text-warn"
              }`}
            >
              {revModel.delta}
            </span>
          </div>
          <div className="mt-1.5 text-[11.5px] text-muted-strong">{revModel.note}</div>
        </div>
        <div className="grid grid-cols-2 items-center gap-x-4 gap-y-1">
          {revModel.side.map((item) => (
            <div key={item.k} className="contents">
              <span className="text-[9.5px] font-bold uppercase tracking-[0.07em] text-muted-strong">
                {item.k}
              </span>
              <span
                className={`text-right text-[13px] font-bold ${
                  item.tone === "good" ? "text-good" : item.tone === "warn" ? "text-warn" : "text-ink-700"
                }`}
              >
                {item.v}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div key={`${period}-${metric}`} className="px-3 pb-3.5 pt-1.5">
        <svg
          className="block h-auto w-full overflow-visible animate-chart-enter"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          role="img"
          aria-label={`${revModel.title} chart`}
        >
          {yTicks.map((tick) => {
            const y = scaleY(tick);
            return (
              <g key={tick}>
                <line x1={PADDING_X} y1={y} x2={CHART_WIDTH - PADDING_X} y2={y} stroke="var(--color-hair)" strokeWidth="1" />
                <text x={10} y={y + 4} className="fill-[#9aa0a8] text-[10px] font-medium">
                  {revModel.yFormatter(tick)}
                </text>
              </g>
            );
          })}

          <defs>
            <linearGradient id="dashRevFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(91,91,242,0.18)" />
              <stop offset="100%" stopColor="rgba(91,91,242,0)" />
            </linearGradient>
          </defs>

          <path d={areaPath} fill="url(#dashRevFill)" />
          <path d={linePath(budgetPoints)} fill="none" stroke="#3b3f47" strokeWidth="1.8" strokeDasharray="6 6" />
          <path d={linePath(forecastPoints)} fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeDasharray="6 6" opacity="0.65" />
          <path d={linePath(lyPoints)} fill="none" stroke="#c2c5ca" strokeWidth="1.6" />
          <path d={linePath(actualPoints)} fill="none" stroke="var(--color-accent)" strokeWidth="3" />

          <line
            x1={todayPoint[0]}
            y1={PADDING_TOP - 2}
            x2={todayPoint[0]}
            y2={CHART_HEIGHT - PADDING_BOTTOM}
            stroke="#d8b94d"
            strokeWidth="1.5"
            strokeDasharray="2 4"
          />
          <rect x={todayPoint[0] - 28} y={4} width="56" height="20" rx="5" fill="#fff6c7" stroke="#e8d896" />
          <text x={todayPoint[0]} y={18} textAnchor="middle" className="fill-[#7e6d1e] text-[9px] font-bold tracking-wide">
            {revModel.markerLabel}
          </text>
          <circle cx={todayPoint[0]} cy={todayPoint[1]} r="5" fill="var(--color-accent)" stroke="#ffffff" strokeWidth="2" />

          {revModel.xLabels.map((label) => (
            <text
              key={label.label}
              x={scaleX(label.idx)}
              y={CHART_HEIGHT - 6}
              textAnchor={label.idx === 0 ? "start" : label.idx === series.actual.length - 1 ? "end" : "middle"}
              className="fill-[#9aa0a8] text-[10px] font-medium"
            >
              {label.label}
            </text>
          ))}
        </svg>
      </div>

      <div className="flex gap-4 px-[18px] pb-3 text-[11.5px] text-muted-strong">
        <span className="flex items-center gap-1.5">
          <span className="h-[3px] w-4 rounded-sm bg-accent" />
          Actual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 border-t-2 border-dashed border-[#3b3f47]" />
          Budget
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 border-t-2 border-dashed border-accent opacity-65" />
          Forecast
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#c2c5ca]" />
          LY
        </span>
      </div>
    </Card>
  );
}
