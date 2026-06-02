import { useMemo, useState, useCallback } from "react";
import type { ExceptionStatusFilter, Exception } from "@/types/exceptions";
import { useLayout } from "@/contexts/LayoutContext";
import { useExceptions } from "./useExceptions";
import { getExceptionsByTab } from "./lib/exceptions";
import { ExceptionsHeader } from "./components/ExceptionsHeader";
import { ExceptionsKpis } from "./components/ExceptionsKpis";
import { ExceptionsTabs } from "./components/ExceptionsTabs";
import { ExceptionsFilterBar } from "./components/ExceptionsFilterBar";
import { ExceptionsTable } from "./components/ExceptionsTable";
import { ResolvedTable } from "./components/ResolvedTable";
import { RejectedTable } from "./components/RejectedTable";
import { ExceptionsPager } from "./components/ExceptionsPager";
import { DetailDrawer, type DrawerAction } from "./components/DetailDrawer";
import { MatchingLoader } from "./components/MatchingLoader";
import { Toast, type ToastType } from "./components/Toast";

export default function ExceptionsPage() {
    const { data, loading, error } = useExceptions();
    const { displayOptions } = useLayout();

    const [exceptions, setExceptions] = useState<Exception[] | null>(null);

    useMemo(() => {
        if (data && !exceptions) {
            setExceptions(data.exceptions.map((e) => ({ ...e })));
        }
    }, [data]);

    const [tab,      setTab]      = useState<ExceptionStatusFilter>("all");
    const [dept,     setDept]     = useState("All");
    const [severity, setSeverity] = useState("All");
    const [assignee, setAssignee] = useState("All");

    const [detailException, setDetailException] = useState<Exception | null>(null);
    const [matchingLoader,  setMatchingLoader]  = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const showToast = useCallback((message: string, type: ToastType = "good") => {
        setToast({ message, type });
    }, []);

    const mutateException = useCallback((id: string, patch: Partial<Exception>) => {
        setExceptions((prev) =>
            prev ? prev.map((e) => (e.id === id ? { ...e, ...patch } : e)) : prev
        );
        setDetailException((prev) =>
            prev && prev.id === id ? { ...prev, ...patch } : prev
        );
    }, []);

    const handleAction = useCallback(
        (exc: Exception, action: DrawerAction) => {
            setDetailException(null);

            if (action.type === "approve_override") {
                mutateException(exc.id, {
                    status: "resolved", invoiceStatus: "Proceeded",
                    resolutionType: "override", resolvedBy: "You", resolvedAt: "Just now",
                    resolutionNote: action.comment,
                    history: [...exc.history, { dot: "resolved", actor: "You", msg: `Override approved — invoice cleared to proceed. Comment: "${action.comment}"`, time: "Just now" }],
                });
                showToast("Override approved. Invoice marked as Proceeded.", "good");
            }

            else if (action.type === "reject") {
                mutateException(exc.id, {
                    status: "rejected", invoiceStatus: "Rejected", exportBlocked: true,
                    rejectedBy: "You", rejectedAt: "Just now", rejectionReason: action.comment,
                    history: [...exc.history, { dot: "user", actor: "You", msg: `Invoice rejected. Reason: "${action.comment}"`, time: "Just now" }],
                });
                showToast("Invoice rejected. Export blocked.", "crit");
            }

            else if (action.type === "correction") {
                mutateException(exc.id, {
                    status: "correction", correctionAssignee: action.assignee,
                    history: [...exc.history, { dot: "user", actor: "You", msg: `Correction requested — assigned to ${action.assignee}.${action.comment ? ` Note: "${action.comment}"` : ""}`, time: "Just now" }],
                });
                showToast(`Correction requested. Assigned to ${action.assignee}.`, "warn");
            }

            else if (action.type === "link_po" || action.type === "po_approval") {
                setMatchingLoader(action.poNumber);
                setTimeout(() => {
                    setMatchingLoader(null);
                    const isOdd = parseInt(action.poNumber.slice(-1)) % 2 !== 0;
                    if (isOdd) {
                        mutateException(exc.id, {
                            type: "mismatch", severity: "warn", status: "open",
                            invoiceStatus: "Line Mismatch", poNo: action.poNumber,
                            poMatch: "PO found — partial match",
                            title: `Line Mismatch — ${exc.vendor}`,
                            desc: `PO ${action.poNumber} was linked and matching reran. PO found but line items do not fully reconcile.`,
                            history: [...exc.history, { dot: "sys", actor: "System", msg: `PO ${action.poNumber} linked. Matching reran — line mismatch detected.`, time: "Just now" }],
                        });
                        showToast(`PO linked. Lines mismatched — exception moved to Line Mismatch.`, "warn");
                    } else {
                        mutateException(exc.id, {
                            status: "resolved", invoiceStatus: "Matched",
                            resolutionType: "po_linked", resolvedBy: "System", resolvedAt: "Just now",
                            resolutionNote: `${action.poNumber} linked. All lines matched on rerun.`,
                            poNo: action.poNumber, poMatch: "PO found — all lines matched",
                            history: [...exc.history, { dot: "resolved", actor: "System", msg: `PO ${action.poNumber} linked. Matching reran — all lines reconciled. Exception resolved.`, time: "Just now" }],
                        });
                        showToast(`PO ${action.poNumber} linked. All lines matched — exception resolved.`, "good");
                    }
                }, 1800);
            }

            else if (action.type === "revoke") {
                const returnStatus = exc.type === "no_po" ? "No PO Match" : exc.type === "over_budget" ? "Over Budget" : "Line Mismatch";
                mutateException(exc.id, {
                    status: "open", invoiceStatus: returnStatus,
                    history: [...exc.history, { dot: "user", actor: "You", msg: `Rejection revoked. Invoice returned to ${returnStatus}. Comment: "${action.comment}"`, time: "Just now" }],
                });
                showToast(`Rejection revoked. Invoice returned to ${returnStatus}.`, "warn");
            }

            else if (action.type === "resolve_mismatch") {
                mutateException(exc.id, {
                    status: "resolved", invoiceStatus: "Matched",
                    resolutionType: "mismatch_corrected", resolvedBy: "You", resolvedAt: "Just now",
                    resolutionNote: action.comment,
                    history: [...exc.history, { dot: "resolved", actor: "You", msg: `Action: ${action.action} — "${action.comment}"`, time: "Just now" }],
                });
                showToast("Exception resolved.", "good");
            }
        },
        [mutateException, showToast]
    );

    const handleRevoke = useCallback(
        (exc: Exception, comment: string) => {
            const returnStatus = exc.type === "no_po" ? "No PO Match" : exc.type === "over_budget" ? "Over Budget" : "Line Mismatch";
            mutateException(exc.id, {
                status: "open", invoiceStatus: returnStatus,
                history: [...exc.history, { dot: "user", actor: "You", msg: `Rejection revoked. Invoice returned to ${returnStatus}. Comment: "${comment}"`, time: "Just now" }],
            });
            showToast(`Rejection revoked. Invoice returned to ${returnStatus}.`, "warn");
        },
        [mutateException, showToast]
    );

    const handleClear = () => {
        setDept("All");
        setSeverity("All");
        setAssignee("All");
    };

    const tabCounts = useMemo(() => {
        const all = exceptions ?? [];
        return {
            all:         all.filter((e) => e.status !== "resolved").length,
            over_budget: all.filter((e) => e.type === "over_budget" && e.status !== "resolved").length,
            no_po:       all.filter((e) => e.type === "no_po"       && e.status !== "resolved").length,
            mismatch:    all.filter((e) => e.type === "mismatch"    && e.status !== "resolved").length,
            rejected:    all.filter((e) => e.status === "rejected").length,
            resolved:    all.filter((e) => e.status === "resolved").length,
        };
    }, [exceptions]);

    const rows = useMemo(() => {
        if (!exceptions) return [];
        let filtered = getExceptionsByTab(exceptions, tab);
        if (dept !== "All")     filtered = filtered.filter((e) => e.dept === dept);
        if (severity !== "All") {
            const map: Record<string, string> = { Critical: "crit", Warning: "warn", Info: "info" };
            filtered = filtered.filter((e) => e.severity === map[severity]);
        }
        if (assignee !== "All") filtered = filtered.filter((e) => e.assignee === assignee);
        return filtered;
    }, [exceptions, tab, dept, severity, assignee]);

    if (loading || !data) {
        return (
            <div className="grid min-h-[320px] place-items-center text-sm text-muted-strong">
                Loading exceptions…
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid min-h-[320px] place-items-center rounded-2xl border border-crit-bg bg-crit-soft p-10 text-center">
                <p className="text-sm font-semibold text-crit">Could not load exceptions</p>
                <p className="mt-2 text-[13px] text-muted-strong">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5 text-ink-900">
            <ExceptionsHeader
                month={data.month}
                lastSync={data.lastSync}
                onRefresh={() => window.location.reload()}
            />

            {displayOptions.showKpiStrip && (
                <ExceptionsKpis kpi={{
                    ...data.kpi,
                    openCount:             tabCounts.all,
                    overBudgetCount:       tabCounts.over_budget,
                    noPOCount:             tabCounts.no_po,
                    resolvedThisMonthCount: tabCounts.resolved,
                }} />
            )}

            {/* FilterBar — ПОЗА контейнером таблиці */}
            <ExceptionsFilterBar
                dept={dept}         setDept={setDept}
                severity={severity} setSeverity={setSeverity}
                assignee={assignee} setAssignee={setAssignee}
                onClear={handleClear}
            />

            {/* Table container */}
            <div className="overflow-hidden rounded-[14px] border border-hair-2 bg-white shadow-soft">
                <ExceptionsTabs tab={tab} onChange={setTab} counts={tabCounts} />

                {tab === "resolved" ? (
                    <ResolvedTable
                        rows={rows}
                        emptyLabel="No resolved exceptions yet"
                        onDetail={setDetailException}
                    />
                ) : tab === "rejected" ? (
                    <RejectedTable
                        rows={rows}
                        emptyLabel="No rejected exceptions yet"
                        onDetail={setDetailException}
                        onRevoke={handleRevoke}
                    />
                ) : (
                    <ExceptionsTable
                        rows={rows}
                        emptyLabel="No exceptions match the current filters."
                        onDetail={setDetailException}
                    />
                )}

                <ExceptionsPager shown={rows.length} total={rows.length} />
            </div>

            <DetailDrawer
                exception={detailException}
                onClose={() => setDetailException(null)}
                onSubmit={handleAction}
            />

            {matchingLoader && <MatchingLoader poNumber={matchingLoader} />}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onDismiss={() => setToast(null)}
                />
            )}
        </div>
    );
}