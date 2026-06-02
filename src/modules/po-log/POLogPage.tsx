import { useMemo, useState } from "react";
import type { PODeptId, POStatus, PurchaseOrderRecord } from "@/types/poLog";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { usePOLog } from "./usePOLog";
import { usePOLogPrefs } from "./usePOLogPrefs";
import { useLayout } from "@/contexts/LayoutContext";
import { filterOrders, groupByDept, summarize, type POLogTab } from "./lib/aggregate";
import { POLogHeader } from "./components/POLogHeader";
import { POLogTabs } from "./components/POLogTabs";
import { POKpiStrip } from "./components/POKpiStrip";
import { POToolbar } from "./components/POToolbar";
import { POTable } from "./components/POTable";
import { POTotalsBar } from "./components/POTotalsBar";
import { PODrawer } from "./components/PODrawer";
import { PODisplayOptions } from "./components/PODisplayOptions";

export default function POLogPage() {
  const { data, loading, error } = usePOLog();
  const [prefs, setPref] = usePOLogPrefs();

  const { displayOptionsOpen, closeDisplayOptions, showTotalsBar, setShowTotalsBar } = useLayout();

  const [tab, setTab] = useState<POLogTab>("active");
  const [deptFilter, setDeptFilter] = useState<PODeptId | "all">("all");
  const [statusFilter, setStatusFilter] = useState<POStatus | "all">("all");
  const [drawerRow, setDrawerRow] = useState<PurchaseOrderRecord | null>(null);

  const orders = data?.orders ?? [];

  const filtered = useMemo(
      () => filterOrders(orders, { tab, dept: deptFilter, status: statusFilter }),
      [orders, tab, deptFilter, statusFilter],
  );
  const summary = useMemo(() => summarize(orders), [orders]);
  const grouped = useMemo(
      () => (prefs.groupBy === "department" ? groupByDept(filtered) : null),
      [filtered, prefs.groupBy],
  );

  if (loading) {
    return (
        <div className="grid min-h-[240px] sm:min-h-[320px] place-items-center text-[13px] sm:text-sm text-muted-strong">
          Loading purchase orders…
        </div>
    );
  }

  if (error || !data) {
    return (
        <div className="grid min-h-[240px] sm:min-h-[320px] place-items-center rounded-2xl border border-crit-bg bg-crit-soft p-6 sm:p-10 text-center mx-4 sm:mx-0">
          <div>
            <p className="text-[13px] sm:text-sm font-semibold text-crit">Could not load the PO log</p>
            <p className="mt-2 text-[12.5px] sm:text-[13px] text-muted-strong">{error?.message ?? "Unknown error"}</p>
          </div>
        </div>
    );
  }

  const filteredTotal = filtered.reduce((sum, row) => sum + row.amt, 0);

  const handleTab = (next: POLogTab) => {
    setTab(next);
    if (next === "dept") setPref("groupBy", "department");
  };

  return (
      <div className="flex flex-col gap-3 sm:gap-4 text-ink-900">
        <POLogHeader
            subtitle={`${data.meta.monthLabel} · ${data.meta.closesLabel} · ${orders.length} orders on book`}
        />

        <POLogTabs tab={tab} onChange={handleTab} activeCount={orders.length} fixedCount={summary.fixedCount} />

        {prefs.showHero ? (
            <POKpiStrip
                monthBudget={data.meta.monthBudget}
                spentToDate={summary.spentToDate}
                fixedTotal={summary.fixedTotal}
                fixedCount={summary.fixedCount}
                openTotal={summary.openTotal}
                openCount={summary.openCount}
                overdueCount={summary.overdueCount}
                receivedTotal={summary.receivedTotal}
                receivedCount={summary.receivedCount}
            />
        ) : null}

        <div>
          <POToolbar
              departments={data.departments}
              statusMeta={data.statusMeta}
              deptFilter={deptFilter}
              setDeptFilter={setDeptFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              totalCount={orders.length}
              spentToDate={summary.spentToDate}
              deptCounts={summary.deptCounts}
              deptTotals={summary.deptTotals}
          />
          <POTable
              rows={filtered}
              grouped={grouped}
              departments={data.departments}
              statusMeta={data.statusMeta}
              prefs={prefs}
              onOpenRow={setDrawerRow}
          />
        </div>

        {/* ── Footer / Pagination ── */}
        <div className="flex flex-col items-center justify-between gap-4 px-1 pb-4 sm:flex-row sm:items-center sm:pb-0">

          {/* Info Text */}
          <div className="text-[12.5px] sm:text-[13px] text-muted-strong w-full sm:w-auto text-center sm:text-left">
            Showing <b className="font-semibold text-ink-900">{filtered.length}</b> of {orders.length} purchase orders
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-3 text-[12.5px] sm:text-[13px] text-muted-strong w-full sm:w-auto">

            <div className="flex gap-0.5">
              <PagerButton aria-label="Previous page">
                <ChevronLeftIcon className="h-3.5 w-3.5 shrink-0" />
              </PagerButton>
              <PagerButton active>1</PagerButton>

              {/* Ховаємо проміжні сторінки на мобільних */}
              <PagerButton className="hidden sm:grid">2</PagerButton>
              <PagerButton className="hidden sm:grid">3</PagerButton>
              <span className="grid h-[30px] w-[24px] sm:w-[30px] place-items-center">…</span>

              <PagerButton>9</PagerButton>
              <PagerButton aria-label="Next page">
                <ChevronRightIcon className="h-3.5 w-3.5 shrink-0" />
              </PagerButton>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Lines per page</span>
              <span className="sm:hidden">Per page</span>
              <select className="h-[30px] cursor-pointer rounded-lg border border-hair-2 bg-white px-2 text-[12.5px] sm:text-[13px] outline-none hover:bg-surface-soft">
                <option>40</option>
                <option>20</option>
                <option>10</option>
              </select>
            </div>

          </div>
        </div>

        {showTotalsBar ? <div className="h-5" /> : null}

        {showTotalsBar ? (
            <POTotalsBar
                filteredCount={filtered.length}
                filteredTotal={filteredTotal}
                deptFilter={deptFilter}
                statusFilter={statusFilter}
                departments={data.departments}
                statusMeta={data.statusMeta}
                fixedTotal={summary.fixedTotal}
                openTotal={summary.openTotal}
                receivedTotal={summary.receivedTotal}
                onClose={() => setShowTotalsBar(false)}
            />
        ) : null}

        <PODrawer row={drawerRow} departments={data.departments} statusMeta={data.statusMeta} onClose={() => setDrawerRow(null)} />

        <PODisplayOptions
            open={displayOptionsOpen}
            onClose={closeDisplayOptions}
            prefs={prefs}
            setPref={setPref}
            showTotalsBar={showTotalsBar}
            onShowTotalsBarChange={setShowTotalsBar}
        />
      </div>
  );
}

// ── PagerButton ──
// Додано підтримку className для того, щоб можна було використовувати hidden/sm:grid
function PagerButton({
                       active,
                       className = "",
                       children,
                       ...props
                     }: { active?: boolean; className?: string; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
      <button
          type="button"
          className={`grid h-[30px] min-w-[30px] place-items-center rounded-[7px] px-2 text-[12.5px] sm:text-[13px] tabular-nums transition-colors ${
              active
                  ? "border border-hair-2 bg-white font-semibold text-ink-900 shadow-sm"
                  : "text-ink-700 hover:bg-surface-chip"
          } ${className}`}
          {...props}
      >
        {children}
      </button>
  );
}