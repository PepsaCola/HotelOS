import { useMemo, useState } from "react";
import type { ReceivingDept, ReceivingStatus } from "@/types/receiving";
import { useLayout } from "@/contexts/LayoutContext";
import { useReceiving } from "./useReceiving";
import { filterQueue, sortQueue, type SortKey } from "./lib/queue";
import { ReceivingHeader } from "./components/ReceivingHeader";
import { ReceivingKpis } from "./components/ReceivingKpis";
import { ReceivingTabs } from "./components/ReceivingTabs";
import { ReceivingToolbar } from "./components/ReceivingToolbar";
import { ReceivingTable } from "./components/ReceivingTable";
import { ReceivingPager } from "./components/ReceivingPager";
import { DetailHeader } from "./components/DetailHeader";
import { DetailTabs } from "./components/DetailTabs";

export default function ReceivingPage() {
    const { data, loading, error } = useReceiving();
    const { displayOptions } = useLayout();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [tab, setTab]               = useState<ReceivingStatus>("all");
    const [deptFilter, setDeptFilter] = useState<ReceivingDept>("all");
    const [sort, setSort]             = useState<SortKey>("expected");

    const rows = useMemo(() => {
        if (!data) return [];
        const filtered = filterQueue(data.queue, tab, deptFilter);
        return sortQueue(filtered, sort);
    }, [data, tab, deptFilter, sort]);

    const selected = useMemo(
        () => (selectedId && data ? (data.queue.find((po) => po.id === selectedId) ?? null) : null),
        [selectedId, data],
    );

    if (loading) {
        return (
            <div className="grid min-h-[320px] place-items-center text-sm text-muted-strong">
                Loading receiving queue…
            </div>
        );
    }
    if (error || !data) {
        return (
            <div className="grid min-h-[320px] place-items-center rounded-2xl border border-crit-bg bg-crit-soft p-10 text-center">
                <div>
                    <p className="text-sm font-semibold text-crit">Could not load receiving data</p>
                    <p className="mt-2 text-[13px] text-muted-strong">{error?.message ?? "Unknown error"}</p>
                </div>
            </div>
        );
    }

    const subtitle = `${data.month} · ${data.queue.length} POs in queue · ${data.property}`;

    // ── Detail view ───────────────────────────────────────────────────────────
    if (selected) {
        return (
            <div className="flex flex-col gap-5 text-ink-900">
                <DetailHeader
                    po={selected}
                    property={data.property}
                    onBack={() => setSelectedId(null)}
                />
                <DetailTabs po={selected} />
            </div>
        );
    }

    // ── List view ─────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-5 text-ink-900">
            <ReceivingHeader subtitle={subtitle} />
            {displayOptions.showKpiStrip && <ReceivingKpis kpi={data.kpi} />}
            <ReceivingTabs tab={tab} onChange={setTab} counts={data.tabCounts} />

            <div className="overflow-hidden rounded-[14px] border border-hair-2 bg-white shadow-soft">
                <ReceivingToolbar
                    month={data.month}
                    deptFilter={deptFilter}
                    setDeptFilter={setDeptFilter}
                    sort={sort}
                    setSort={setSort}
                />
                <ReceivingTable
                    rows={rows}
                    emptyLabel="No purchase orders match the current filters."
                    onOpenRow={(po) => setSelectedId(po.id)}
                />
                <ReceivingPager shown={rows.length} total={data.queue.length} />
            </div>
        </div>
    );
}