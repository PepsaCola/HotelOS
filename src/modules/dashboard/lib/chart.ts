export type Point = [number, number];

/** Builds a smooth (Catmull-Rom → Bézier) SVG path through the given points. */
export function linePath(points: Point[]): string {
  if (points.length === 0) {
    return "";
  }
  let result = `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[Math.max(0, index - 1)];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[Math.min(points.length - 1, index + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    result += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return result;
}

export const fmtCurrency = (value: number) => `$${value.toFixed(2)}`;

export function fmtRevenueCompact(value: number) {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}M`;
  }
  return `$${Math.round(value)}K`;
}

export const fmtAxisRevenue = (value: number) => `$${(value / 1000).toFixed(1)}M`;
export const fmtAxisCurrency = (value: number) => `$${Math.round(value)}`;
export const fmtAxisPercent = (value: number) => `${Math.round(value)}%`;

export function fmtSigned(value: number, suffix = "") {
  return `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(1)}${suffix}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
