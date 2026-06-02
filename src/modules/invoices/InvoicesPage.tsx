import { useMemo, useState } from "react";
import type { InvoiceDept, InvoiceStatusFilter, AmountRange, SortKey, InvoiceStatus } from "@/types/invoices";
import { useLayout } from "@/contexts/LayoutContext";
import { useInvoices } from "./useInvoices";
import { filterInvoices, sortInvoices } from "./lib/filter";
import { InvoicesHeader } from "./components/InvoicesHeader";
import { InvoicesKpis } from "./components/InvoicesKpis";
import { InvoicesTabs } from "./components/InvoicesTabs";
import { InvoicesFilterBar } from "./components/InvoicesFilterBar";
import { InvoicesTable } from "./components/InvoicesTable";
import { InvoicesPager } from "./components/InvoicesPager";
import AddInvoiceDrawer from "./components/AddInvoiceDrawer";
import InvoiceReviewPage from "./components/InvoiceReviewPage";
import type { Invoice } from "@/types/invoices";

export default function InvoicesPage() {
    const { data, loading, error } = useInvoices();
    const { displayOptions } = useLayout();

    const [tab,         setTab]         = useState<InvoiceStatusFilter>("all");
    const [sort,        setSort]        = useState<SortKey>("updated");
    const [vendor,      setVendor]      = useState("all");
    const [poRef, setPoRef] = useState("any");
    const [dept,        setDept]        = useState<InvoiceDept>("all");
    const [amountRange, setAmountRange] = useState<AmountRange>("any");
    const [drawerOpen,    setDrawerOpen]    = useState(false);
    const [reviewInvoice, setReviewInvoice] = useState<Invoice | null>(null);
    const [statusOverrides, setStatusOverrides] = useState<Record<string, InvoiceStatus>>({});

    const handleStatusChange = (id: string, status: InvoiceStatus) => {
        setStatusOverrides(prev => ({ ...prev, [id]: status }));
    };

    const vendors = useMemo(
        () => data ? Array.from(new Set(data.invoices.map((inv) => inv.vendor))).sort() : [],
        [data],
    );

    const poRefs = useMemo(
        () => data
            ? Array.from(new Set(
                data.invoices
                    .map(inv => inv.poRef)
                    .filter((r): r is string => r !== null)
            )).sort()
            : [],
        [data],
    );

    const rows = useMemo(() => {
        if (!data) return [];
        const withOverrides = data.invoices.map(inv =>
            statusOverrides[inv.id] ? { ...inv, status: statusOverrides[inv.id] } : inv
        );
        const filtered = filterInvoices(withOverrides, tab, dept, vendor, amountRange, poRef);
        return sortInvoices(filtered, sort);
    }, [data, tab, dept, vendor, amountRange, sort, statusOverrides]);

    const handleClear = () => {
        setVendor("all");
        setDept("all");
        setAmountRange("any");
        setPoRef("any");
        setSort("updated");
    };

    if (loading) {
        return (
            <div className="grid min-h-[320px] place-items-center text-sm text-muted-strong">
                Loading invoices…
            </div>
        );
    }
    if (error || !data) {
        return (
            <div className="grid min-h-[320px] place-items-center rounded-2xl border border-crit-bg bg-crit-soft p-10 text-center">
                <div>
                    <p className="text-sm font-semibold text-crit">Could not load invoices</p>
                    <p className="mt-2 text-[13px] text-muted-strong">{error?.message ?? "Unknown error"}</p>
                </div>
            </div>
        );
    }

    if (reviewInvoice) {
        return (
            <InvoiceReviewPage
                key={reviewInvoice.id}
                invoice={reviewInvoice}
                onClose={() => setReviewInvoice(null)}
                onStatusChange={handleStatusChange}
            />
        );
    }

    return (
        <div className="flex flex-col gap-5 text-ink-900">
            <InvoicesHeader
                month={data.month}
                lastSync={data.lastSync}
                onAddInvoice={() => setDrawerOpen(true)}
            />
            {displayOptions.showKpiStrip && <InvoicesKpis kpi={data.kpi} />}

            <InvoicesFilterBar
                sort={sort}           setSort={setSort}
                vendor={vendor}       setVendor={setVendor}
                dept={dept}           setDept={setDept}
                amountRange={amountRange} setAmountRange={setAmountRange}
                poRef={poRef}         setPoRef={setPoRef}
                vendors={vendors}
                poRefs={poRefs}
                onClear={handleClear}
            />
            <div className="overflow-hidden rounded-[14px] border border-hair-2 bg-white shadow-soft">
                <InvoicesTabs tab={tab} onChange={setTab} counts={data.tabCounts} />
                <InvoicesTable
                    rows={rows}
                    emptyLabel="No invoices match the current filters."
                    onReview={(inv) => setReviewInvoice(inv)}
                />
                <InvoicesPager shown={rows.length} total={data.invoices.length} />
            </div>

            <AddInvoiceDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </div>
    );
}