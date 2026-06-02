import type { ApprovalDepartment, PurchaseApproval } from "@/types/approvals";
import { formatMoney } from "@/lib/money";
import { glAccount } from "../lib/po";
import ChainMini from "./ChainMini";

interface ApprovalTableProps {
  rows: PurchaseApproval[];
  departments: Record<string, ApprovalDepartment>;
  actedIds: Set<string>;
  emptyLabel: string;
  onOpenRow: (po: PurchaseApproval) => void;
}

const TH = "whitespace-nowrap border-b border-hair-2 bg-surface-soft px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong";

function waitClass(days: number) {
  if (days >= 5) return "font-bold text-crit";
  if (days >= 3) return "font-semibold text-warn";
  return "text-muted-strong";
}

export function ApprovalTable({ rows, departments, actedIds, emptyLabel, onOpenRow }: ApprovalTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-left text-sm">
        <thead>
          <tr>
            <th className={`${TH} pl-4`}>PO #</th>
            <th className={TH}>Vendor</th>
            <th className={TH}>Dept</th>
            <th className={TH}>A/C #</th>
            <th className={`${TH} text-right`}>Amount</th>
            <th className={TH}>Requested by</th>
            <th className={TH}>Waiting</th>
            <th className={TH}>Flags</th>
            <th className={TH}>Chain</th>
            <th className={`${TH} pr-4`} />
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-4 py-16 text-center text-[13px] text-muted-strong">
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((po) => {
              const acted = actedIds.has(po.id);
              const dept = departments[po.dept];
              return (
                <tr
                  key={po.id}
                  onClick={() => onOpenRow(po)}
                  className={`cursor-pointer border-b border-hair transition-colors hover:bg-[#fafbff] ${acted ? "bg-surface-soft opacity-60" : ""}`}
                >
                  <td className="whitespace-nowrap px-3 py-3 pl-4 align-middle">
                    <div className="font-bold text-ink-900">{po.id}</div>
                    <div className="text-xs text-muted-strong">{po.poDate}</div>
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <div className="font-semibold text-ink-900">{po.vendor}</div>
                    <div className="text-xs font-medium text-muted">{po.cat}</div>
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-chip px-2.5 py-1 text-xs font-medium text-ink-700">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dept?.color ?? "var(--color-muted)" }} />
                      {po.dept}
                    </span>
                  </td>
                  <td className="px-3 py-3 align-middle font-mono text-xs text-muted-strong">{glAccount(po)}</td>
                  <td className="px-3 py-3 text-right align-middle font-bold tabular-nums text-ink-900">{formatMoney(po.amount)}</td>
                  <td className="px-3 py-3 align-middle text-ink-700">{po.requester}</td>
                  <td className={`whitespace-nowrap px-3 py-3 align-middle tabular-nums ${waitClass(po.waiting)}`}>
                    {po.waiting === 1 ? "1 day" : `${po.waiting} days`}
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <div className="flex gap-1">
                      {po.overBudget ? (
                        <span className="rounded bg-crit-bg px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-crit">OVER BUDGET</span>
                      ) : null}
                      {po.capex ? (
                        <span className="rounded bg-capex-bg px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-capex">CAPEX</span>
                      ) : null}
                      {!po.overBudget && !po.capex ? <span className="text-xs text-muted">—</span> : null}
                    </div>
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <ChainMini steps={po.chain} />
                  </td>
                  <td className="px-3 py-3 pr-4 text-right align-middle">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRow(po);
                      }}
                      className="rounded border border-hair-2 bg-white px-3 py-1.5 text-xs font-medium text-ink-900 hover:bg-surface-soft"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
