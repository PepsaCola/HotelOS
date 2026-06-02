import { useMemo, useState } from "react";
import type { ActionType, PurchaseApproval } from "@/types/approvals";
import { useLayout } from "@/contexts/LayoutContext";
import { useApprovals } from "./useApprovals";
import { useToasts } from "./useToasts";
import { summarize, filterByTab, type ApprovalsTab } from "./lib/summary";
import { actionToast, applyAction } from "./lib/workflow";
import { ApprovalsHeader } from "./components/ApprovalsHeader";
import { RoleBar } from "./components/RoleBar";
import { ApprovalKpis } from "./components/ApprovalKpis";
import { ApprovalTabs } from "./components/ApprovalTabs";
import { ApprovalToolbar, type DeptFilter, type SortKey, type TypeFilter } from "./components/ApprovalToolbar";
import { ApprovalTable } from "./components/ApprovalTable";
import { ApprovalPager } from "./components/ApprovalPager";
import ApprovalDrawer from "./components/ApprovalDrawer";
import { Toasts } from "./components/Toasts";

export default function ApprovalsPage() {
  const { data, loading, error } = useApprovals();
  const { toasts, push } = useToasts();
  const { displayOptions } = useLayout();

  // POs acted on this session, keyed by id — overlays the fetched queue so the
  // base data stays immutable and a refetch would reconcile cleanly.
  const [overrides, setOverrides] = useState<Record<string, PurchaseApproval>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<ApprovalsTab>("myQueue");
  const [deptFilter, setDeptFilter] = useState<DeptFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sort, setSort] = useState<SortKey>("oldest");

  const queue = useMemo(
    () => (data ? data.queue.map((po) => overrides[po.id] ?? po) : []),
    [data, overrides],
  );
  const actedIds = useMemo(() => new Set(Object.keys(overrides)), [overrides]);
  const summary = useMemo(() => summarize(queue), [queue]);

  const rows = useMemo(() => {
    let result = filterByTab(queue, tab, actedIds);
    if (deptFilter !== "all") result = result.filter((po) => po.dept === deptFilter);
    if (typeFilter !== "all") result = result.filter((po) => po.type === typeFilter);
    return [...result].sort((a, b) => {
      if (sort === "highest") return b.amount - a.amount;
      if (sort === "newest") return a.waiting - b.waiting;
      return b.waiting - a.waiting;
    });
  }, [queue, tab, actedIds, deptFilter, typeFilter, sort]);

  const selected = selectedId ? queue.find((po) => po.id === selectedId) ?? null : null;

  const handleAct = (poId: string, type: ActionType, comment: string) => {
    if (!data) return;
    const po = queue.find((p) => p.id === poId);
    if (!po) return;
    setOverrides((prev) => ({ ...prev, [poId]: applyAction(po, type, comment, data.meta.reviewer) }));
    const toast = actionToast(po, type);
    push(toast.text, toast.tone);
  };

  if (loading) {
    return <div className="grid min-h-[320px] place-items-center text-sm text-muted-strong">Loading approvals…</div>;
  }
  if (error || !data) {
    return (
      <div className="grid min-h-[320px] place-items-center rounded-2xl border border-crit-bg bg-crit-soft p-10 text-center">
        <div>
          <p className="text-sm font-semibold text-crit">Could not load approvals</p>
          <p className="mt-2 text-[13px] text-muted-strong">{error?.message ?? "Unknown error"}</p>
        </div>
      </div>
    );
  }

  const emptyLabel =
    tab === "completed"
      ? "No POs completed in this session yet."
      : "No purchase orders match the current filters.";

  return (
    <div className="flex flex-col gap-5 text-ink-900">
      <ApprovalsHeader subtitle={`${data.meta.monthLabel} · ${data.meta.propertyName}`} />
      <RoleBar meta={data.meta} />
      {displayOptions.showKpiStrip && <ApprovalKpis summary={summary} />}
      <ApprovalTabs tab={tab} onChange={setTab} counts={data.meta.tabCounts} />

      <div className="overflow-hidden rounded-[14px] border border-hair-2 bg-white shadow-soft">
        <ApprovalToolbar
          departments={data.departments}
          deptFilter={deptFilter}
          setDeptFilter={setDeptFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          sort={sort}
          setSort={setSort}
        />
        <ApprovalTable
          rows={rows}
          departments={data.departments}
          actedIds={actedIds}
          emptyLabel={emptyLabel}
          onOpenRow={(po) => setSelectedId(po.id)}
        />
        <ApprovalPager shown={rows.length} total={queue.length} />
      </div>

      {selected ? (
        <ApprovalDrawer
          po={selected}
          acted={actedIds.has(selected.id)}
          reviewerName={data.meta.reviewer.name}
          onClose={() => setSelectedId(null)}
          onAct={handleAct}
        />
      ) : null}

      <Toasts toasts={toasts} />
    </div>
  );
}
