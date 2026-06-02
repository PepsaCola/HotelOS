import type {
  AgingBucket,
  AgingView,
  AgingRiskView,
  DashboardData,
  DeptView,
  DeptViewData,
  FunnelStage,
  HeatmapView,
  HeatmapMatrix,
  InvoiceRow,
  KpiCard,
  MetricBundle,
  PeriodDef,
  PORow,
  RevPeriod,
  RevSeries,
} from "@/types/dashboard";

const kpis: KpiCard[] = [
  {
    tone: "good",
    label: "Revenue MTD",
    value: "$1.59M",
    delta: "+5.5%",
    deltaTone: "up",
    detail: "$82.6K above budget · pacing +3.1% vs LY",
    dotTone: "good",
  },
  {
    tone: "default",
    label: "Occupancy / RevPAR",
    value: "87.5%",
    delta: "+3.9pt",
    deltaTone: "up",
    detail: "RevPAR $123.74 · budget $119.40",
    dotTone: "good",
  },
  {
    tone: "warn",
    label: "Open A/P Exposure",
    value: "$312.4K",
    detail: "7 invoices awaiting match · $11.9K disputed",
    dotTone: "warn",
  },
  {
    tone: "warn",
    label: "Budget Variance",
    value: "−$3.2K",
    delta: "−0.4%",
    deltaTone: "down",
    detail: "R&M +22% · F&B −10.3% · A&G −7%",
    dotTone: "warn",
  },
  {
    tone: "crit",
    label: "Exceptions / Blocking",
    value: "3",
    subValue: "items · $11,963",
    detail: "2 need controller · 1 vendor reply pending",
    dotTone: "crit",
  },
];

const periods: Record<RevPeriod, PeriodDef> = {
  MTD: {
    length: 31,
    today: 23,
    rangeLabel: "Mar 1 – 31, 2026",
    markerLabel: "DAY 23",
    xLabels: [
      { idx: 0, label: "Mar 1" },
      { idx: 6, label: "7" },
      { idx: 13, label: "14" },
      { idx: 20, label: "21" },
      { idx: 27, label: "28" },
      { idx: 30, label: "Mar 31" },
    ],
  },
  QTD: {
    length: 13,
    today: 10,
    rangeLabel: "Q1 2026 · weekly pace",
    markerLabel: "WK 10",
    xLabels: [
      { idx: 0, label: "Jan" },
      { idx: 4, label: "Feb" },
      { idx: 8, label: "Mar" },
      { idx: 12, label: "QTD" },
    ],
  },
  YTD: {
    length: 12,
    today: 5,
    rangeLabel: "FY26 · monthly pace",
    markerLabel: "MAY",
    xLabels: [
      { idx: 0, label: "Jan" },
      { idx: 2, label: "Mar" },
      { idx: 4, label: "May" },
      { idx: 6, label: "Jul" },
      { idx: 8, label: "Sep" },
      { idx: 11, label: "Dec" },
    ],
  },
};

function seededRand(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function buildTrendSeries(config: {
  length: number;
  today: number;
  seed: number;
  base: number;
  trend: number;
  vol: number;
  min: number;
  max: number;
}): RevSeries {
  const rand = seededRand(config.seed);
  const actual = Array.from({ length: config.length }, (_, index) => {
    const drift = config.trend * index;
    const wave =
      Math.sin((index / Math.max(1, config.length - 1)) * Math.PI * 1.4) * (config.vol * 0.35);
    const noise = (rand() - 0.5) * config.vol;
    return Number(clamp(config.base + drift + wave + noise, config.min, config.max).toFixed(2));
  });
  const budget = actual.map((_, index) =>
    Number(
      clamp(
        config.base + config.trend * index * 0.92 - config.vol * 0.14,
        config.min,
        config.max,
      ).toFixed(2),
    ),
  );
  const ly = actual.map((value, index) =>
    Number(clamp(value * (0.965 + Math.sin(index * 0.4) * 0.01), config.min, config.max).toFixed(2)),
  );
  const forecast = actual.map((value, index) => {
    if (index < config.today - 1) {
      return value;
    }
    const ahead = index - (config.today - 1);
    return Number(clamp(value + ahead * config.trend * 0.55 + 0.6, config.min, config.max).toFixed(2));
  });
  return { actual, budget, ly, forecast };
}

function buildRevenueSeries(period: RevPeriod): RevSeries {
  if (period === "MTD") {
    return {
      actual: [118, 181, 242, 307, 374, 451, 516, 592, 664, 731, 809, 885, 958, 1032, 1091, 1150, 1214, 1282, 1348, 1412, 1488, 1535, 1593, 1691, 1782, 1885, 1976, 2028, 2109, 2164, 2238],
      budget: [104, 161, 219, 279, 337, 392, 444, 499, 553, 610, 665, 722, 774, 827, 879, 930, 982, 1033, 1084, 1133, 1184, 1236, 1286, 1335, 1386, 1437, 1488, 1538, 1586, 1648, 1710],
      ly: [112, 168, 227, 289, 352, 413, 474, 538, 607, 672, 742, 816, 883, 952, 1010, 1070, 1126, 1191, 1248, 1312, 1373, 1440, 1544, 1606, 1682, 1771, 1860, 1964, 2037, 2099, 2160],
      forecast: [118, 181, 242, 307, 374, 451, 516, 592, 664, 731, 809, 885, 958, 1032, 1091, 1150, 1214, 1282, 1348, 1412, 1488, 1535, 1593, 1696, 1798, 1903, 2007, 2104, 2189, 2264, 2336],
    };
  }
  if (period === "QTD") {
    return {
      actual: [318, 654, 1012, 1408, 1822, 2241, 2690, 3145, 3628, 4172, 4718, 5295, 5840],
      budget: [304, 628, 972, 1352, 1746, 2140, 2557, 2985, 3431, 3886, 4349, 4832, 5329],
      ly: [298, 619, 958, 1328, 1716, 2104, 2507, 2928, 3368, 3816, 4279, 4762, 5260],
      forecast: [318, 654, 1012, 1408, 1822, 2241, 2690, 3145, 3628, 4172, 4790, 5439, 6104],
    };
  }
  return {
    actual: [1105, 2240, 3475, 4710, 5980, 7285, 8610, 9985, 11380, 12820, 14290, 15800],
    budget: [1063, 2158, 3345, 4533, 5768, 6998, 8242, 9537, 10890, 12350, 13795, 15280],
    ly: [1039, 2117, 3274, 4420, 5695, 6930, 8153, 9452, 10781, 12230, 13690, 15122],
    forecast: [1105, 2240, 3475, 4710, 5980, 7470, 8960, 10435, 11915, 13390, 14870, 16355],
  };
}

function buildMetricBundle(period: RevPeriod): MetricBundle {
  const def = periods[period];
  return {
    Revenue: buildRevenueSeries(period),
    RevPAR: buildTrendSeries({
      length: def.length,
      today: def.today,
      seed: period === "MTD" ? 21 : period === "QTD" ? 31 : 41,
      base: period === "MTD" ? 112 : period === "QTD" ? 109 : 106,
      trend: period === "MTD" ? 0.58 : period === "QTD" ? 0.82 : 1.05,
      vol: period === "MTD" ? 5.8 : period === "QTD" ? 4.5 : 4.2,
      min: 94,
      max: 148,
    }),
    ADR: buildTrendSeries({
      length: def.length,
      today: def.today,
      seed: period === "MTD" ? 25 : period === "QTD" ? 35 : 45,
      base: period === "MTD" ? 138 : period === "QTD" ? 136 : 134,
      trend: period === "MTD" ? 0.18 : period === "QTD" ? 0.26 : 0.34,
      vol: period === "MTD" ? 4.2 : period === "QTD" ? 3.7 : 3.3,
      min: 121,
      max: 156,
    }),
    Occ: buildTrendSeries({
      length: def.length,
      today: def.today,
      seed: period === "MTD" ? 29 : period === "QTD" ? 39 : 49,
      base: period === "MTD" ? 81.5 : period === "QTD" ? 79.8 : 78.5,
      trend: period === "MTD" ? 0.28 : period === "QTD" ? 0.32 : 0.38,
      vol: period === "MTD" ? 3.2 : period === "QTD" ? 2.6 : 2.4,
      min: 71,
      max: 92,
    }),
  };
}

const metrics: Record<RevPeriod, MetricBundle> = {
  MTD: buildMetricBundle("MTD"),
  QTD: buildMetricBundle("QTD"),
  YTD: buildMetricBundle("YTD"),
};

const deptViews: Record<DeptView, DeptViewData> = {
  actual: {
    subtitle: "MTD actual · variance to plan",
    footLabel: "Burn marker",
    footCallout: "A&G −7.0% under plan ▼",
    footTone: "good",
    rows: [
      { name: "Rooms", amount: "$128.9K", delta: "+1.9% over", deltaTone: "down", fill: 61, marker: 66 },
      { name: "F&B", amount: "$184.3K", delta: "−10.3% under", deltaTone: "up", fill: 79, marker: 93 },
      { name: "A&G", amount: "$71.4K", delta: "−7.0% under", deltaTone: "up", fill: 34, marker: 41 },
      { name: "IT", amount: "$22.2K", delta: "−4.9% under", deltaTone: "up", fill: 11, marker: 13 },
      { name: "S&M", amount: "$58.7K", delta: "−12.9% under", deltaTone: "up", fill: 29, marker: 43 },
      { name: "R&M", amount: "$94.2K", delta: "+22.0% over", deltaTone: "down", fill: 42, marker: 36 },
    ],
  },
  committed: {
    subtitle: "MTD actual + committed · variance to plan",
    footLabel: "Budget pace marker",
    footCallout: "R&M +22% over plan ▲",
    footTone: "crit",
    rows: [
      { name: "Rooms", amount: "$128.9K", delta: "+1.9% over", deltaTone: "down", fill: 61, marker: 66 },
      { name: "F&B", amount: "$184.3K", delta: "−10.3% under", deltaTone: "up", fill: 86, marker: 93 },
      { name: "A&G", amount: "$71.4K", delta: "−7.0% under", deltaTone: "up", fill: 34, marker: 41 },
      { name: "IT", amount: "$22.2K", delta: "−4.9% under", deltaTone: "up", fill: 11, marker: 13 },
      { name: "S&M", amount: "$58.7K", delta: "−12.9% under", deltaTone: "up", fill: 29, marker: 43 },
      { name: "R&M", amount: "$94.2K", delta: "+22.0% over", deltaTone: "down", fill: 42, marker: 36 },
    ],
  },
  forecast: {
    subtitle: "Forecast burn to close · variance to plan",
    footLabel: "Forecast marker",
    footCallout: "Rooms close at +4.2% risk ▲",
    footTone: "crit",
    rows: [
      { name: "Rooms", amount: "$146.4K", delta: "+4.2% risk", deltaTone: "down", fill: 70, marker: 67 },
      { name: "F&B", amount: "$201.1K", delta: "−5.8% under", deltaTone: "up", fill: 88, marker: 94 },
      { name: "A&G", amount: "$76.0K", delta: "−2.4% under", deltaTone: "up", fill: 37, marker: 41 },
      { name: "IT", amount: "$24.9K", delta: "+2.1% risk", deltaTone: "down", fill: 13, marker: 12 },
      { name: "S&M", amount: "$66.9K", delta: "−4.3% under", deltaTone: "up", fill: 34, marker: 39 },
      { name: "R&M", amount: "$117.6K", delta: "+28.4% risk", deltaTone: "down", fill: 53, marker: 38 },
    ],
  },
};

const agingBuckets: AgingBucket[] = [
  { name: "Current", sub: "< 30 days", tone: "g", value: 131.2, count: 34, risk: 22 },
  { name: "31–60 days", sub: "approaching", tone: "n", value: 68.7, count: 12, risk: 26 },
  { name: "61–90 days", sub: "overdue", tone: "w", value: 56.3, count: 8, risk: 31 },
  { name: "90+ days", sub: "critical — escalate", tone: "c", value: 56.2, count: 5, risk: 47 },
];

const agingRiskViews: Record<AgingView, AgingRiskView> = {
  amount: {
    subtitle: "Stacked aging buckets · $312.4K total open balance",
    title: "Risk summary",
    items: [
      { label: "Unmatched invoices", sub: "No PO or receiving ref.", value: "$14.2K · 4 inv.", tone: "crit" },
      { label: "Blocked exports", sub: "Held in M3 export queue", value: "3 inv. · 6d+", tone: "crit" },
      { label: "Price disputes", sub: "Pending vendor reply", value: "$11.9K · 2 inv.", tone: "warn" },
      { label: "Partial receipts", sub: "Receiving mismatch", value: "$6.3K · 5 inv.", tone: "warn" },
    ],
  },
  count: {
    subtitle: "Stacked aging buckets · 59 invoices still open",
    title: "Volume summary",
    items: [
      { label: "Current flow", sub: "Invoices landed this week", value: "34 inv. · 57.6%", tone: "warn" },
      { label: "Watchlist", sub: "31+ days still unresolved", value: "25 inv. · 42.4%", tone: "crit" },
      { label: "Escalations", sub: "Controller follow-up needed", value: "8 inv. · 61–90d", tone: "warn" },
      { label: "Critical", sub: "90+ days aging", value: "5 inv. · 8.5%", tone: "crit" },
    ],
  },
  risk: {
    subtitle: "Weighted severity view · oldest and blocked invoices",
    title: "Risk score summary",
    items: [
      { label: "Critical exposure", sub: "90+ days and blocked export", value: "47 pts", tone: "crit" },
      { label: "Dispute pressure", sub: "Price variance and no-match", value: "31 pts", tone: "warn" },
      { label: "Queue drag", sub: "31–60 day items", value: "26 pts", tone: "warn" },
      { label: "Fresh intake", sub: "Current bucket", value: "22 pts", tone: "crit" },
    ],
  },
};

const funnelStages: FunnelStage[] = [
  { name: "Draft", tone: "neutral", badge: "—", badgeTone: "neutral", count: 18, amount: 184.6, age: 2.1 },
  { name: "Submitted", tone: "accent-soft", badge: "—", badgeTone: "neutral", count: 15, amount: 162.4, age: 2.8 },
  { name: "Approved", tone: "accent", badge: "3 stalled", badgeTone: "warn", count: 12, amount: 148.7, age: 4.6 },
  { name: "Ordered", tone: "accent", badge: "On track", badgeTone: "good", count: 10, amount: 129.3, age: 3.2 },
  { name: "Receiving", tone: "warn", badge: "2 partial", badgeTone: "warn", count: 8, amount: 94.1, age: 5.7 },
  { name: "Invoiced", tone: "warn-soft", badge: "Match pend.", badgeTone: "warn", count: 6, amount: 66.2, age: 6.4 },
  { name: "Exported", tone: "crit", badge: "Blocked ×3", badgeTone: "crit", count: 3, amount: 28.4, age: 8.8 },
];

const heatmapViews: Record<HeatmapView, HeatmapMatrix> = {
  count: {
    subtitle: "Issue frequency by status × department · MTD",
    footLink: "View all exceptions ↗",
    values: [
      [1, 1, 0, 0, 2],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1],
      [0, 1, 0, 0, 1],
      [0, 0, 1, 0, 0],
      [1, 1, 0, 1, 1],
    ],
  },
  amount: {
    subtitle: "Blocked amount by status × department · open exposure",
    footLink: "Open exception ledger ↗",
    values: [
      [4, 2, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [3, 0, 0, 2, 1],
      [0, 2, 0, 0, 1],
      [0, 0, 1, 0, 0],
      [5, 3, 0, 2, 1],
    ],
  },
  trend: {
    subtitle: "Week-over-week trend intensity by department",
    footLink: "Review exception trends ↗",
    values: [
      [2, 1, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 2, 1],
      [0, 2, 0, 0, 1],
      [0, 0, 2, 0, 0],
      [2, 1, 0, 2, 1],
    ],
  },
};

const invoices: InvoiceRow[] = [
  { id: "INV-19763", vendor: "Cleantec Services Group, Inc.", note: "no tax", received: "Mar 23", dept: "Rooms", amount: "$5,174.20", po: "PO-25-0331", matching: [{ label: "PO", tone: "ok" }, { label: "LN 9/9", tone: "ok" }], status: { label: "Processed", tone: "good" }, updated: "2 min ago" },
  { id: "INV-EM-4421", vendor: "Aramark Uniform Services", note: "incl. tax", received: "Mar 19", dept: "A&G", amount: "$5,661.00", po: "—", matching: [{ label: "PO", tone: "crit" }, { label: "LN 4/7", tone: "crit" }], status: { label: "Over Budget", tone: "warn" }, updated: "14 min ago", updatedTone: "warn" },
  { id: "INV-77321", vendor: "HD Supply Facilities Maint.", note: "incl. tax", received: "Mar 14", dept: "R&M", amount: "$2,641.80", po: "—", matching: [{ label: "PO", tone: "crit" }, { label: "LN 0/9", tone: "crit" }], status: { label: "Matching PO not found", tone: "crit" }, updated: "1 h ago", updatedTone: "crit" },
  { id: "INV-0921", vendor: "ABC Pest Control of Orlando", note: "incl. tax", received: "Mar 12", dept: "Rooms", amount: "$627.04", po: "—", matching: [], status: { label: "OCR in progress", tone: "info" }, updated: "1 h ago" },
  { id: "INV-BL-0098", vendor: "Bell Transit Co.", note: "no tax", received: "Mar 12", dept: "Rooms", amount: "$3,927.55", po: "PO-25-0380", matching: [{ label: "PO", tone: "ok" }, { label: "LN 9/9", tone: "ok" }], status: { label: "Processed", tone: "good" }, updated: "2 min ago" },
  { id: "INV-COR-8821", vendor: "Cintas Corporation", note: "incl. tax", received: "Mar 17", dept: "F&B", amount: "$4,711.74", po: "—", matching: [{ label: "PO", tone: "crit" }, { label: "LN 5/6", tone: "crit" }], status: { label: "Needs Review", tone: "warn" }, updated: "1 h ago", updatedTone: "warn" },
  { id: "INV-2086-EDI", vendor: "Sysco Foods of Central FL", note: "no tax", received: "Mar 9", dept: "F&B", amount: "$2,847.30", po: "PO-25-0301", matching: [{ label: "PO", tone: "ok" }, { label: "LN 9/9", tone: "ok" }], status: { label: "Processed", tone: "good" }, updated: "2 min ago" },
  { id: "INV-G-2244", vendor: "Guest Relations Inc.", note: "no tax", received: "Mar 4", dept: "Rooms", amount: "$2,547.45", po: "PO-25-0354", matching: [{ label: "PO", tone: "ok" }, { label: "LN 9/9", tone: "ok" }], status: { label: "Processed", tone: "good" }, updated: "2 min ago" },
];

const purchaseOrders: PORow[] = [
  { id: "FB0311", account: "201500000", title: "Seafood Order — Easter Weekend", vendor: "Pacific Seafood Group", dept: "F&B", issued: "Apr 13", amount: "$9,840.32", status: { label: "Partial", tone: "warn" } },
  { id: "RM0517", account: "106310000", title: "Housekeeping Supplies — Apr Refill", vendor: "Ecolab Inc.", dept: "Rooms", issued: "Apr 11", amount: "$3,884.20", status: { label: "Received", tone: "good" } },
  { id: "FB0308", account: "201200000", title: "Weekly Produce Order — Week 15", vendor: "Sysco Foods", dept: "F&B", issued: "Apr 10", amount: "$6,510.80", status: { label: "Received", tone: "good" } },
  { id: "FB0306", account: "201100000", title: "Wine Replenishment — Cellar (Q2)", vendor: "Southern Glazers", dept: "F&B", issued: "Apr 10", amount: "$18,420.00", status: { label: "Pending", tone: "warn" } },
  { id: "RM0516", account: "106220000", title: "Replacement Mattresses (Topaz Suite)", vendor: "Sealy Commercial", dept: "Rooms", issued: "Apr 09", amount: "$14,250.00", status: { label: "Pending", tone: "warn" } },
  { id: "EN0192", account: "306330000", title: "LED Lamp Replacement Stock (Q2)", vendor: "Phillips Hospitality", dept: "R&M", issued: "Apr 09", amount: "$3,240.00", status: { label: "Received", tone: "good" } },
  { id: "SM0047", account: "506400000", title: "Brand Photography — Suite Refresh", vendor: "Hayes Studios", dept: "S&M", issued: "Apr 09", amount: "$6,400.00", status: { label: "Partial", tone: "warn" } },
  { id: "EN0191", account: "306500000", title: "Boiler Repair — Tower B (Emergency)", vendor: "Johnson Controls", dept: "R&M", issued: "Apr 08", amount: "$54,320.00", status: { label: "Pending", tone: "warn" } },
];

export const dashboardMock: DashboardData = {
  meta: {
    hotel: "Hatch Hotel · Asheville",
    periodLabel: "May 2026",
    daysToClose: 9,
    lastSync: "4 min ago",
    periodDayLabel: "Mar 2026 (Day 23 / 31)",
  },
  kpis,
  periods,
  metrics,
  deptViews,
  agingBuckets,
  agingRiskViews,
  funnelStages,
  heatmap: {
    columns: ["Over Budget", "No PO Match", "Line Mismatch", "Rejected", "Resolved"],
    rows: ["Rooms", "F&B", "A&G", "IT", "S&M", "R&M"],
    views: heatmapViews,
  },
  invoices,
  purchaseOrders,
  counts: { invoices: 78, purchaseOrders: 42 },
};
