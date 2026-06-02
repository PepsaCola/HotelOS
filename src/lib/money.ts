/** Currency formatting helpers shared across finance modules. */

/** Splits a USD amount into whole + cents parts so cents can be styled muted. */
export function fmtUSD(value: number): { whole: string; cents: string } {
  const negative = value < 0;
  const abs = Math.abs(value);
  const [whole, cents] = abs.toFixed(2).split(".");
  const wholeFmt = Number(whole).toLocaleString("en-US");
  return { whole: (negative ? "−$" : "$") + wholeFmt, cents: "." + cents };
}

/** Single-string USD with cents, e.g. $5,174.20 / −$1,420.00. */
export function formatMoney(value: number): string {
  const { whole, cents } = fmtUSD(value);
  return whole + cents;
}

/** Compact currency, e.g. $1.6M / $760.0k / $540. */
export function fmtCompact(value: number): { whole: string; unit: string } {
  const abs = Math.abs(value);
  if (abs >= 1e6) return { whole: "$" + (value / 1e6).toFixed(1), unit: "M" };
  if (abs >= 1e3) return { whole: "$" + (value / 1e3).toFixed(1), unit: "k" };
  return { whole: "$" + value.toFixed(0), unit: "" };
}
