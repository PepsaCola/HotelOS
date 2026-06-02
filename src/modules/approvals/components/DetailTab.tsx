import type { PurchaseApproval } from "@/types/approvals";
import { formatMoney } from "@/lib/money";
import { glAccount } from "../lib/po";
import ApprovalStepper from "./ApprovalStepper";
import { AlertIcon } from "./icons";

interface DetailTabProps {
  po: PurchaseApproval;
  reviewerName: string;
}

const SECTION_HEAD = "mb-3 border-b border-hair-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong";

export default function DetailTab({ po, reviewerName }: DetailTabProps) {

  const rows: [string, string][] = [
    ["PO Number", po.id],
    ["Vendor", po.vendor],
    ["Category", po.cat],
    ["Type", po.type],
    ["Department", po.dept],
    ["GL Account", glAccount(po)],
    ["Requested by", po.requester],
    ["Submitted", po.submitted],
    ["PO Date", po.poDate],
  ];

  return (
      <div className="flex flex-col gap-6">
        {po.overBudget ? (
            <div className="flex items-start gap-3 rounded-lg border border-crit-bg bg-crit-soft p-3">
              <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-crit"/>
              <div className="text-sm leading-relaxed text-crit">
                <strong className="font-bold">Over budget by {formatMoney(po.overAmt)}</strong> — this PO exceeds the
                approved department budget. A justification comment is required before approving.
              </div>
            </div>
        ) : null}

        <div>
          <div className={SECTION_HEAD}>Approval Chain</div>
          <ApprovalStepper po={po} reviewerName={reviewerName}/>
        </div>

        {po.budget ? (
            <div>
              <div className={SECTION_HEAD}>Budget Snapshot</div>
              {/* Трюк для ідеальних бордерів у сітці:
                Контейнер має колір ліній (bg-hair-2) і відступ 1px (gap-px).
                А самі картки всередині мають свій колір фону (bg-surface-soft).
              */}
              <div className="rounded-lg border border-hair-2 bg-hair-2 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden">
                <BudgetCard label="Dept Budget" value={formatMoney(po.budget.total)}/>
                <BudgetCard label="Committed" value={formatMoney(po.budget.committed)}/>
                <BudgetCard label="This PO" value={formatMoney(po.budget.thisPO)}/>
                <BudgetCard
                    label="Remaining"
                    value={formatMoney(po.budget.remaining)}
                    valueClass={po.budget.remaining < 0 ? "text-crit" : po.budget.remaining < 1000 ? "text-ink-900" : "text-good"}
                />
              </div>
            </div>
        ) : null}

        <div>
          <div className={SECTION_HEAD}>PO Details</div>
          <div className="flex flex-col">
            {rows.map(([k, v]) => (
                <div className="flex justify-between gap-4 border-b border-hair py-2.5 text-sm last:border-0"
                     key={k}>
                  {/* shrink-0 не дасть назві звужуватися, а text-right вирівняє значення */}
                  <span className="shrink-0 text-xs text-muted-strong mt-0.5">{k}</span>
                  <span className="font-medium text-ink-900 text-right">{v}</span>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}

function BudgetCard({label, value, valueClass = "text-ink-900"}: {
  label: string;
  value: string;
  valueClass?: string
}) {
  return (
      // Додали bg-surface-soft сюди, щоб gap-px у батьківському контейнері працював як рамка
      <div className="flex h-full flex-col justify-center bg-surface-soft p-3">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">{label}</div>
        <div className={`text-[17px] sm:text-lg font-bold tabular-nums ${valueClass}`}>{value}</div>
      </div>
  );
}

export {SECTION_HEAD};