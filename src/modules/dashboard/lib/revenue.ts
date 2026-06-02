import type {
  MetricBundle,
  PeriodDef,
  RevMetric,
  RevPeriod,
  RevSeries,
} from "@/types/dashboard";
import {
  fmtAxisCurrency,
  fmtAxisPercent,
  fmtAxisRevenue,
  fmtCurrency,
  fmtRevenueCompact,
  fmtSigned,
  clamp,
} from "./chart";

interface SideStat {
  k: string;
  v: string;
  tone?: "good" | "warn" | "default";
}

/** Presentation view-model for the Revenue vs Budget Pace card. */
export interface RevModel {
  title: string;
  subtitle: string;
  headline: string;
  delta: string;
  deltaTone: "good" | "warn";
  note: string;
  side: SideStat[];
  markerLabel: string;
  yFormatter: (value: number) => string;
  series: RevSeries;
  xLabels: ReadonlyArray<{ idx: number; label: string }>;
  todayIndex: number;
}

/** Derives the Revenue card view-model from the raw metric series. */
export function getRevModel(
  bundle: MetricBundle,
  periodDef: PeriodDef,
  period: RevPeriod,
  metric: RevMetric,
): RevModel {
  const series = bundle[metric];
  const todayIndex = periodDef.today - 1;
  const actualNow = series.actual[todayIndex];
  const budgetNow = series.budget[todayIndex];
  const lyNow = series.ly[todayIndex];
  const forecastEnd = series.forecast[series.forecast.length - 1];
  const deltaBudget = actualNow - budgetNow;
  const deltaLyPct = ((actualNow - lyNow) / lyNow) * 100;
  const confidence = clamp(Math.round(84 + (todayIndex / periodDef.length) * 6), 82, 92);
  const revparNow = bundle.RevPAR.actual[todayIndex];
  const adrNow = bundle.ADR.actual[todayIndex];
  const occNow = bundle.Occ.actual[todayIndex];

  if (metric === "Revenue") {
    return {
      title: "Actual revenue",
      subtitle: `Cumulative ${period} trend · ${periodDef.rangeLabel} · Actual · Budget · Forecast · LY`,
      headline: fmtRevenueCompact(actualNow),
      delta: `${deltaLyPct >= 0 ? "▲" : "▼"} ${Math.abs(deltaLyPct).toFixed(1)}%`,
      deltaTone: deltaLyPct >= 0 ? "good" : "warn",
      note: `Pacing ${deltaBudget >= 0 ? "+" : "−"}$${Math.abs(deltaBudget).toFixed(1)}K ${deltaBudget >= 0 ? "above" : "below"} budget · forecast close ${fmtRevenueCompact(forecastEnd)}`,
      side: [
        { k: "vs LY", v: fmtSigned(deltaLyPct, "%"), tone: deltaLyPct >= 0 ? "good" : "warn" },
        { k: "RevPAR", v: fmtCurrency(revparNow) },
        { k: "Confidence", v: `${confidence}%` },
        { k: "ADR", v: `${fmtCurrency(adrNow)} ${adrNow < bundle.ADR.budget[todayIndex] ? "▼" : "▲"}`, tone: adrNow >= bundle.ADR.budget[todayIndex] ? "good" : "warn" },
      ],
      markerLabel: periodDef.markerLabel,
      yFormatter: fmtAxisRevenue,
      series,
      xLabels: periodDef.xLabels,
      todayIndex,
    };
  }

  if (metric === "RevPAR") {
    const variance = actualNow - budgetNow;
    return {
      title: "Actual RevPAR",
      subtitle: `${period} hotel pace · ${periodDef.rangeLabel} · Actual · Budget · Forecast · LY`,
      headline: fmtCurrency(actualNow),
      delta: `${variance >= 0 ? "▲" : "▼"} ${Math.abs(variance).toFixed(1)} pts`,
      deltaTone: variance >= 0 ? "good" : "warn",
      note: `Running ${fmtSigned(variance)} vs budget · forecast close ${fmtCurrency(forecastEnd)}`,
      side: [
        { k: "vs LY", v: fmtSigned(deltaLyPct, "%"), tone: deltaLyPct >= 0 ? "good" : "warn" },
        { k: "Occ", v: `${occNow.toFixed(1)}%` },
        { k: "ADR", v: fmtCurrency(adrNow) },
        { k: "Budget", v: fmtCurrency(budgetNow) },
      ],
      markerLabel: periodDef.markerLabel,
      yFormatter: fmtAxisCurrency,
      series,
      xLabels: periodDef.xLabels,
      todayIndex,
    };
  }

  if (metric === "ADR") {
    const variance = actualNow - budgetNow;
    return {
      title: "Actual ADR",
      subtitle: `${period} rate trend · ${periodDef.rangeLabel} · Actual · Budget · Forecast · LY`,
      headline: fmtCurrency(actualNow),
      delta: `${variance >= 0 ? "▲" : "▼"} ${Math.abs(variance).toFixed(1)}`,
      deltaTone: variance >= 0 ? "good" : "warn",
      note: `Rate pacing ${fmtSigned(variance)} vs budget · close forecast ${fmtCurrency(forecastEnd)}`,
      side: [
        { k: "vs LY", v: fmtSigned(deltaLyPct, "%"), tone: deltaLyPct >= 0 ? "good" : "warn" },
        { k: "RevPAR", v: fmtCurrency(revparNow) },
        { k: "Mix", v: `${47 + ((todayIndex % 6) * 3)}% premium` },
        { k: "Occ", v: `${occNow.toFixed(1)}%` },
      ],
      markerLabel: periodDef.markerLabel,
      yFormatter: fmtAxisCurrency,
      series,
      xLabels: periodDef.xLabels,
      todayIndex,
    };
  }

  const variance = actualNow - budgetNow;
  return {
    title: "Actual occupancy",
    subtitle: `${period} occupancy pace · ${periodDef.rangeLabel} · Actual · Budget · Forecast · LY`,
    headline: `${actualNow.toFixed(1)}%`,
    delta: `${variance >= 0 ? "▲" : "▼"} ${Math.abs(variance).toFixed(1)} pts`,
    deltaTone: variance >= 0 ? "good" : "warn",
    note: `Occupancy running ${fmtSigned(variance, " pts")} vs budget · forecast close ${forecastEnd.toFixed(1)}%`,
    side: [
      { k: "vs LY", v: fmtSigned(deltaLyPct, "%"), tone: deltaLyPct >= 0 ? "good" : "warn" },
      { k: "RevPAR", v: fmtCurrency(revparNow) },
      { k: "ADR", v: fmtCurrency(adrNow) },
      { k: "Confidence", v: `${confidence}%` },
    ],
    markerLabel: periodDef.markerLabel,
    yFormatter: fmtAxisPercent,
    series,
    xLabels: periodDef.xLabels,
    todayIndex,
  };
}
