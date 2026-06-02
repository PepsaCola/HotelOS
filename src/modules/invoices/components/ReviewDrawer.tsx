import type { Invoice } from "@/types/invoices";
import { formatMoney } from "@/lib/money";
import { CloseIcon } from "@/components/ui/icons";
import { STATUS_META, matchDisplay } from "../lib/invoice";
import { MatchOkIcon, MatchFailIcon } from "./icons";

interface ReviewDrawerProps {
  invoice: Invoice | null;
  onClose: () => void;
}

const BADGE_CLASS: Record<string, string> = {
  good:    "bg-good-bg text-good",
  warn:    "bg-warn-bg text-warn",
  crit:    "bg-crit-bg text-crit",
  indigo:  "bg-accent-soft text-accent-ink",
  neutral: "bg-surface-chip text-ink-700",
};

const TAG_OK   = "inline-flex items-center gap-1 rounded-md bg-good-bg px-2 py-0.5 text-[11.5px] font-semibold text-good";
const TAG_FAIL = "inline-flex items-center gap-1 rounded-md bg-crit-bg px-2 py-0.5 text-[11.5px] font-semibold text-crit";

const ROW = "flex items-center justify-between gap-4 border-b border-hair py-3 last:border-0";
const LABEL = "text-[12.5px] text-muted-strong";
const VALUE = "text-[13px] font-medium text-ink-900";

export default function ReviewDrawer({ invoice, onClose }: ReviewDrawerProps) {
  if (!invoice) return null;

  const meta  = STATUS_META[invoice.status];
  const match = matchDisplay(invoice);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative flex h-full w-full max-w-[440px] flex-col bg-white shadow-[−8px_0_32px_rgba(12,19,32,0.12)]">

        {/* Head */}
        <div className="flex items-start justify-between border-b border-hair-2 px-6 py-5">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${BADGE_CLASS[meta.tone]}`}>
                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                {meta.label}
              </span>
            </div>
            <h2 className="font-mono text-[17px] font-bold tracking-tight text-ink-900">
              {invoice.id}
            </h2>
            <p className="mt-0.5 text-[13px] text-muted-strong">{invoice.vendor}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-hair-2 text-muted-strong hover:bg-surface-soft"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* Amount hero */}
          <div className="mb-5 rounded-[14px] border border-hair-2 bg-surface-soft px-5 py-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-strong">
              Invoice Total
            </div>
            <div className="mt-1 text-[28px] font-bold tracking-tight text-ink-900">
              {formatMoney(invoice.amount)}
            </div>
            <div className="mt-0.5 text-[12.5px] text-muted-strong">
              {invoice.taxIncluded ? "Tax included" : "No tax"}
            </div>
          </div>

          {/* Details */}
          <div className="mb-5">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-strong">
              Details
            </div>
            <div className="rounded-[14px] border border-hair-2 bg-white px-4">
              <div className={ROW}>
                <span className={LABEL}>Vendor</span>
                <span className={VALUE}>{invoice.vendor}</span>
              </div>
              <div className={ROW}>
                <span className={LABEL}>Department</span>
                <span className={VALUE}>{invoice.dept}</span>
              </div>
              <div className={ROW}>
                <span className={LABEL}>Received</span>
                <span className={VALUE}>{invoice.receivedDate}</span>
              </div>
              <div className={ROW}>
                <span className={LABEL}>Last updated</span>
                <span className={VALUE}>{invoice.updatedAt}</span>
              </div>
              <div className={ROW}>
                <span className={LABEL}>PO Reference</span>
                <span className={`${VALUE} font-mono text-[12.5px]`}>
                  {invoice.poRef ?? <span className="font-sans text-muted">Not linked</span>}
                </span>
              </div>
            </div>
          </div>

          {/* Matching */}
          <div className="mb-5">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-strong">
              Matching
            </div>
            <div className="rounded-[14px] border border-hair-2 bg-white px-4 py-4">
              {match ? (
                <div className="flex items-center gap-3">
                  <span className={match.poOk ? TAG_OK : TAG_FAIL}>
                    {match.poOk ? <MatchOkIcon /> : <MatchFailIcon />}
                    PO Match
                  </span>
                  <span className={match.linesOk ? TAG_OK : TAG_FAIL}>
                    {match.linesOk ? <MatchOkIcon /> : <MatchFailIcon />}
                    {match.linesLabel} lines
                  </span>
                  {!match.poOk && (
                    <span className="text-[12.5px] text-muted-strong">No PO linked</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[13px] text-muted-strong">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
                  OCR extraction in progress…
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-hair-2 px-6 py-4">
          {invoice.status === "no-match" && (
            <div className="mb-3 rounded-xl border border-crit-bg bg-crit-soft px-4 py-3 text-[12.5px] text-crit">
              No matching PO found. Link a PO manually or reject this invoice.
            </div>
          )}
          {invoice.status === "over-budget" && (
            <div className="mb-3 rounded-xl border border-warn-bg bg-warn-soft px-4 py-3 text-[12.5px] text-warn">
              Invoice amount exceeds the linked PO budget.
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 flex-1 rounded-[9px] border border-hair-2 bg-white text-[13.5px] font-medium text-ink-900 hover:bg-surface-soft"
            >
              Close
            </button>
            {(invoice.status === "review" || invoice.status === "over-budget" || invoice.status === "no-match") && (
              <button
                type="button"
                className="h-9 flex-1 rounded-[9px] bg-ink-900 text-[13.5px] font-medium text-white hover:bg-black"
              >
                Mark Reviewed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
