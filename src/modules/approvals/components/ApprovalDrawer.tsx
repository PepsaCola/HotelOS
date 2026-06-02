import { useEffect, useState } from "react";
import type { ActionType, PurchaseApproval } from "@/types/approvals";
import { formatMoney } from "@/lib/money";
import { nextPendingStep } from "../lib/workflow";
import DetailTab from "./DetailTab";
import LinesTab from "./LinesTab";
import AuditTab from "./AuditTab";
import ActionSheet from "./ActionSheet";
import { AlertIcon, CapExIcon, ChangesIcon, CheckIcon, CloseIcon } from "./icons";

interface ApprovalDrawerProps {
  po: PurchaseApproval;
  acted: boolean;
  reviewerName: string;
  onClose: () => void;
  onAct: (poId: string, type: ActionType, comment: string) => void;
}

type TabKey = "detail" | "lines" | "audit";

const TABS: [TabKey, string][] = [
  ["detail", "PO Detail"],
  ["lines", "Line Items"],
  ["audit", "Audit Trail"],
];

export default function ApprovalDrawer({ po, acted, reviewerName, onClose, onAct }: ApprovalDrawerProps) {
  const [tab, setTab] = useState<TabKey>("detail");
  const [activeSheet, setActiveSheet] = useState<ActionType | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const next = nextPendingStep(po);

  return (
      <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Approval detail">
        {/* Backdrop */}
        <div className="absolute inset-0 animate-fade-in bg-[#0c1320]/35 transition-opacity" onClick={onClose} />

        {/* Drawer Panel */}
        <div className="relative flex h-full w-full max-w-full animate-slide-in-right flex-col bg-white shadow-[-12px_0_40px_rgba(0,0,0,0.18)] sm:w-[580px]">

          {/* Header */}
          <div className="shrink-0 bg-white pt-4 sm:pt-5">
            <div className="relative px-4 sm:px-5 pb-3">
              <button
                  type="button"
                  aria-label="Close panel"
                  onClick={onClose}
                  className="absolute right-3 top-0 sm:right-4 grid h-8 w-8 sm:h-7 sm:w-7 place-items-center rounded-md text-muted-strong transition-colors hover:bg-surface-muted hover:text-ink-900"
              >
                <CloseIcon className="h-4 w-4" />
              </button>

              {/* Breadcrumbs / Meta */}
              <div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted pr-8">
                <span>{po.id}</span>
                <span className="text-hair-2">·</span>
                <span>{po.type}</span>
                <span className="text-hair-2">·</span>
                <span>{po.dept}</span>
              </div>

              {/* Title */}
              <h2 className="text-[18px] sm:text-xl font-bold leading-tight text-ink-900 pr-8">
                {po.vendor}
              </h2>

              {/* Alerts */}
              {(po.overBudget || po.capex) && (
                  <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                    {po.overBudget && (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-crit-soft px-2 py-1 text-[11px] sm:text-[11.5px] font-semibold text-crit">
                    <AlertIcon className="h-3.5 w-3.5 shrink-0" />
                    <span>Over budget by {formatMoney(po.overAmt)} — justification required</span>
                  </span>
                    )}
                    {po.capex && (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-capex-bg px-2 py-1 text-[11px] sm:text-[11.5px] font-semibold text-capex">
                    <CapExIcon className="h-3.5 w-3.5 shrink-0" />
                    <span>CapEx — Corporate Approval Required</span>
                  </span>
                    )}
                  </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-hair-2 px-4 sm:px-5 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TABS.map(([key, label]) => (
                  <button
                      key={key}
                      type="button"
                      onClick={() => setTab(key)}
                      className={`whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[13px] sm:text-sm font-semibold transition-colors ${
                          tab === key ? "border-[#0c1320] text-ink-900" : "border-transparent text-muted-strong hover:text-ink-700"
                      }`}
                  >
                    {label}
                  </button>
              ))}
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 [-webkit-overflow-scrolling:touch]">
            {tab === "detail" && <DetailTab po={po} reviewerName={reviewerName} />}
            {tab === "lines" && <LinesTab po={po} />}
            {tab === "audit" && <AuditTab po={po} />}
          </div>

          {/* Footer Actions */}
          {acted ? (
              <div className="flex shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 border-t border-hair-2 bg-white p-3 sm:p-4">
                <div className="flex items-center gap-2 text-[13px] sm:text-sm font-semibold text-good">
              <span className="grid h-6 w-6 sm:h-7 sm:w-7 shrink-0 place-items-center rounded-full bg-good text-white">
                <CheckIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </span>
                  Action recorded
                </div>
                <div className="text-[11.5px] sm:text-xs text-muted-strong pl-8 sm:pl-0">
                  {next ? `Next: ${next.role} — ${next.name}` : "Approval complete"}
                </div>
              </div>
          ) : tab !== "audit" ? (
              <div className="shrink-0 border-t border-hair-2 bg-white p-3 sm:p-4">
                {activeSheet ? (
                    <ActionSheet
                        type={activeSheet}
                        po={po}
                        onConfirm={(type, comment) => {
                          onAct(po.id, type, comment);
                          setActiveSheet(null);
                        }}
                        onCancel={() => setActiveSheet(null)}
                    />
                ) : (
                    <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-3">
                      <button
                          type="button"
                          onClick={() => setActiveSheet("approve")}
                          className="col-span-2 sm:flex-1 flex h-10 items-center justify-center gap-2 rounded-lg bg-[#148351] text-[13px] sm:text-sm font-semibold text-white transition-colors hover:bg-[#0f5a37]"
                      >
                        <CheckIcon className="h-4 w-4 shrink-0" /> Approve
                      </button>

                      <button
                          type="button"
                          onClick={() => setActiveSheet("changes")}
                          className="col-span-1 sm:flex-1 flex h-10 items-center justify-center gap-1.5 rounded-lg border border-hair-2 bg-white text-[12.5px] sm:text-sm font-semibold text-ink-700 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-surface-soft"
                      >
                        <ChangesIcon className="h-3.5 w-3.5 shrink-0" />
                        <span className="hidden sm:inline">Request Changes</span>
                        <span className="sm:hidden">Changes</span>
                      </button>

                      <button
                          type="button"
                          onClick={() => setActiveSheet("reject")}
                          className="col-span-1 sm:flex-1 flex h-10 items-center justify-center gap-1.5 rounded-lg border border-crit-bg bg-white text-[12.5px] sm:text-sm font-semibold text-crit shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-crit-soft"
                      >
                        <CloseIcon className="h-3.5 w-3.5 shrink-0" /> Reject
                      </button>
                    </div>
                )}
              </div>
          ) : null}
        </div>
      </div>
  );
}