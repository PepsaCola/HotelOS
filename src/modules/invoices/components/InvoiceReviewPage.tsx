import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type { Invoice, InvoiceStatus } from "@/types/invoices";
import { getReviewData } from "../data/reviewMock";
import { STATUS_META } from "../lib/invoice";
import { formatMoney } from "@/lib/money";
import { ChevronRightIcon } from "@/components/ui/icons";
import { STATUS_PILL_CLS } from "./ReviewShared";
import { ReviewPdfPane } from "./ReviewPdfPane";
import { ReviewMatchPanel } from "./ReviewMatchPanel";
import { ReviewPoFormPanel } from "./ReviewPoFormPanel";
import { ReviewStickyBar } from "./ReviewStickyBar";
import { useLayout, useBreadcrumb } from "@/contexts/LayoutContext.tsx";

const TOAST_CLS = {
    success: "bg-[#1a1f2e] text-[#6be0a3] border-[#2a3a2a]",
    warn:    "bg-[#1a1f2e] text-[#e8a040] border-[#3a2a1a]",
    error:   "bg-[#1a1f2e] text-[#e08080] border-[#3a1a1a]",
};

function Toast({ msg, type }: { msg: string; type: "success" | "warn" | "error" }) {
    return (
        <div className={`animate-slide-up pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] sm:w-auto max-w-[400px] rounded-[10px] border px-4 py-3 text-[13.5px] font-medium shadow-xl flex items-center justify-center text-center transition-all ${TOAST_CLS[type]}`}>
            {msg}
        </div>
    );
}

interface Props {
    invoice: Invoice;
    onClose: () => void;
    onStatusChange?: (id: string, status: InvoiceStatus) => void;
}

export default function InvoiceReviewPage({ invoice, onClose, onStatusChange }: Props) {
    const reviewData = useMemo(() => getReviewData(invoice.id), [invoice.id]);

    const [panelView,      setPanelView]      = useState<"matches" | "po-form">("matches");
    const [activePoRef,    setActivePoRef]    = useState(reviewData.closestMatches[0]?.ref ?? "");
    const [closestMatches, setClosestMatches] = useState(reviewData.closestMatches);
    const [otherOpenPos,   setOtherOpenPos]   = useState(reviewData.otherOpenPos);
    const [approveNote,    setApproveNote]    = useState("");
    const [approveNoteVis, setApproveNoteVis] = useState(false);
    const [toast,          setToast]          = useState<{ msg: string; type: "success" | "warn" | "error" } | null>(null);

    const { setFullBleed } = useLayout();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFullBleed(true);
        return () => setFullBleed(false);
    }, [setFullBleed]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    const showToast = useCallback((msg: string, type: "success" | "warn" | "error") => {
        setToast({ msg, type });
    }, []);

    const activePo = useMemo(
        () => [...closestMatches, ...otherOpenPos].find(p => p.ref === activePoRef) ?? closestMatches[0] ?? null,
        [closestMatches, otherOpenPos, activePoRef],
    );

    const handleRejectPo = useCallback((ref: string) => {
        setClosestMatches(prev => prev.filter(p => p.ref !== ref));
        setOtherOpenPos(prev => prev.filter(p => p.ref !== ref));
        if (activePoRef === ref) { setActivePoRef(""); setPanelView("matches"); }
        showToast(`PO ${ref} rejected`, "warn");
    }, [activePoRef, showToast]);

    const handleOpenForm = useCallback((ref: string) => {
        setActivePoRef(ref);
        setPanelView("po-form");

        if (window.innerWidth < 1024) {
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                        top: scrollContainerRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 50);
        }
    }, []);

    const handleGoBack = useCallback(() => {
        setPanelView("matches");
        setApproveNoteVis(false);
        setApproveNote("");

        if (window.innerWidth < 1024) {
            scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    const handleApproveMapping = useCallback(() => {
        if (reviewData.flow === 4) { setApproveNoteVis(true); return; }
        onStatusChange?.(invoice.id, "processed");
        showToast(`Invoice ${invoice.id} approved and mapped to ${activePoRef}`, "success");
        setTimeout(onClose, 1400);
    }, [reviewData.flow, invoice.id, activePoRef, onStatusChange, onClose, showToast]);

    const handleConfirmNote = useCallback(() => {
        if (!approveNote.trim()) { showToast("Please enter an approval note first.", "error"); return; }
        onStatusChange?.(invoice.id, "processed");
        showToast(`Invoice ${invoice.id} approved with note`, "success");
        setTimeout(onClose, 1400);
    }, [approveNote, invoice.id, onStatusChange, onClose, showToast]);

    const handleCancelNote = useCallback(() => { setApproveNoteVis(false); setApproveNote(""); }, []);

    const handleStickyReject = useCallback(() => {
        showToast(`Invoice ${invoice.id} rejected`, "warn");
        setTimeout(onClose, 1400);
    }, [invoice.id, onClose, showToast]);

    const handleSendToExceptions = useCallback(() => {
        onStatusChange?.(invoice.id, "no-match");
        showToast(`Invoice ${invoice.id} sent to Exceptions`, "warn");
        setTimeout(onClose, 1400);
    }, [invoice.id, onStatusChange, onClose, showToast]);

    const meta = STATUS_META[invoice.status];

    useBreadcrumb([{ label: "Invoices", onClick: onClose }, { label: invoice.id }]);

    const isFormOpen = panelView === "po-form" && activePo;

    return (
        <div className="flex flex-col bg-[#f6f6f4] text-ink-900 animate-slide-up h-[100dvh] lg:h-[calc(100svh-60px)] w-full fixed lg:relative inset-0 z-50 lg:z-auto overflow-hidden">
            {/* HEADER */}
            <header className="flex flex-col sm:flex-row flex-none items-start sm:items-center justify-between gap-4 border-b border-page-border bg-[#f6f6f4] px-4 py-4 lg:px-6 shrink-0">
                <div className="flex min-w-0 w-full sm:w-auto flex-col gap-1.5 sm:gap-1">
                    {/* Мобільні хлібні крихти */}
                    <nav className="flex lg:hidden items-center gap-1 text-[12px] sm:text-[13px] text-muted-strong min-w-0">
                        <button type="button" onClick={onClose} className="hover:text-ink transition-colors shrink-0">Invoices</button>
                        <ChevronRightIcon className="h-[12px] sm:h-[13px] w-[12px] sm:w-[13px] text-page-border shrink-0"/>
                        <span className="font-medium text-ink truncate">{invoice.id}</span>
                    </nav>

                    <h1 className="text-[20px] sm:text-[22px] font-semibold leading-tight tracking-[-0.03em] text-ink truncate">
                        {invoice.id}
                    </h1>

                    {/* Метадані */}
                    <div className="flex flex-wrap items-center gap-y-1 text-[12px] sm:text-[12.5px] text-muted-strong mt-0.5 sm:mt-0">
                        <span className="truncate max-w-[200px]">{invoice.vendor}</span>
                        <span className="mx-2 text-page-border">·</span>
                        <span className="whitespace-nowrap">Total: <b className="font-semibold text-ink">{formatMoney(invoice.amount)}</b></span>
                        <span className="mx-2 text-page-border">·</span>
                        <span className="whitespace-nowrap">Dept: <b className="font-semibold text-ink">{invoice.dept}</b></span>
                        <span className="hidden sm:inline mx-2 text-page-border">·</span>
                        <span className="hidden sm:inline whitespace-nowrap">File: <span className="truncate max-w-[120px] inline-block align-bottom">{reviewData.fileRef}</span></span>
                        <span className="hidden lg:inline mx-2 text-page-border">·</span>
                        <span className="hidden lg:inline whitespace-nowrap">Received: {invoice.receivedDate}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 w-full sm:w-auto items-center justify-between sm:justify-end gap-3 sm:mt-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#eaeaea]">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${STATUS_PILL_CLS[meta.tone]}`}>
                        <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-current"/>
                        {meta.label}
                    </span>
                    <button type="button" onClick={handleSendToExceptions}
                            className="flex h-10 sm:h-8 w-full sm:w-auto justify-center items-center gap-1.5 rounded-[8px] bg-white px-4 sm:px-3 text-[13px] sm:text-[12.5px] font-medium text-crit shadow-sm sm:shadow-none hover:bg-[#fff8f7] transition-colors border border-[#f5c6c0]">
                        <svg viewBox="0 0 24 24" fill="none" width="14" height="14" className="shrink-0">
                            <path
                                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                                stroke="currentColor" strokeWidth="1.6"></path>
                            <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.6"
                                  strokeLinecap="round"></path>
                        </svg>
                        Send to Exceptions
                    </button>
                </div>
            </header>

            {/* BODY */}
            <div
                ref={scrollContainerRef}
                className={`relative flex-1 overflow-y-auto lg:overflow-hidden p-4 lg:p-5 min-h-0 flex flex-col ${isFormOpen ? "lg:pb-[88px]" : ""}`}
            >
                {/* Використовуємо lg:grid замість xl:grid для кращого досвіду на планшетах */}
                <div className={`flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-1 gap-4 lg:gap-5 flex-1 min-h-0 ${isFormOpen ? "pb-4 lg:pb-0" : "pb-4 lg:pb-0"}`}>

                    {/* Ліва панель (PDF) */}
                    <div className="h-[45vh] min-h-[300px] lg:h-full w-full shrink-0">
                        <ReviewPdfPane fileRef={reviewData.fileRef}/>
                    </div>

                    {/* Права панель (Matches / Form) */}
                    <div className="h-auto lg:h-full w-full flex flex-col lg:overflow-hidden">
                        {panelView === "matches" ? (
                            <ReviewMatchPanel
                                data={reviewData}
                                activePoRef={activePoRef}
                                closestMatches={closestMatches}
                                otherOpenPos={otherOpenPos}
                                flow={reviewData.flow}
                                onSelectPo={setActivePoRef}
                                onOpenForm={handleOpenForm}
                                onRejectPo={handleRejectPo}
                                onSendToExceptions={handleSendToExceptions}
                            />
                        ) : activePo ? (
                            <ReviewPoFormPanel
                                po={activePo}
                                flow={reviewData.flow}
                                approveNoteVisible={approveNoteVis}
                                approveNote={approveNote}
                                onApproveNote={setApproveNote}
                                onConfirmNote={handleConfirmNote}
                                onCancelNote={handleCancelNote}
                                onGoBack={handleGoBack}
                            />
                        ) : null}
                    </div>

                </div>

                {isFormOpen && (
                    <ReviewStickyBar
                        invoice={invoice}
                        activePo={activePo}
                        flow={reviewData.flow}
                        onReject={handleStickyReject}
                        onApprove={handleApproveMapping}
                    />
                )}

                {toast && <Toast msg={toast.msg} type={toast.type}/>}
            </div>
        </div>
    );
}