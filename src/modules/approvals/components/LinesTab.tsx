import type { PurchaseApproval } from "@/types/approvals";
import { formatMoney } from "@/lib/money";
import { calcPoTotals, deptAllocation } from "../lib/po";
import { SECTION_HEAD } from "./DetailTab";

interface LinesTabProps {
  po: PurchaseApproval;
}

// Зробили змінну заголовка таблиці адаптивною: менший шрифт та відступи на мобільному
const TH = "bg-surface-soft px-2 sm:px-2.5 py-2 sm:py-2.5 text-[9.5px] sm:text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong";

export default function LinesTab({ po }: LinesTabProps) {
  const totals = calcPoTotals(po);
  const deptRows = deptAllocation(po, totals.total);

  return (
      <div>
        <div className={`${SECTION_HEAD} flex items-center justify-between`}>
          <span>Line items</span>
          <span className="rounded-full bg-surface-chip px-2 py-0.5 text-[9.5px] sm:text-[10px] text-muted-strong">
          {po.lines.length} items
        </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-hair-2 bg-white">

          {/* ── Таблиця 1: Line Items ── */}
          <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
            <table className="w-full text-left text-[12.5px] sm:text-[13px] min-w-[340px]">
              <thead>
              <tr>
                <th className={`${TH} pl-3 sm:pl-4 w-[60px] sm:w-16 text-right`}>Qty / Unit</th>
                <th className={`${TH} min-w-[140px] sm:min-w-0`}>Description</th>
                <th className={`${TH} text-right min-w-[70px]`}>Unit price</th>
                <th className={`${TH} pr-3 sm:pr-4 text-right min-w-[75px]`}>Amount</th>
              </tr>
              </thead>
              <tbody>
              {po.lines.map((line, i) => (
                  <tr key={i} className="border-t border-hair transition-colors hover:bg-[#fafbfc]">
                    <td className="pl-3 sm:pl-4 px-2 sm:px-2.5 py-2.5 text-right align-top">
                      <span className="block font-bold text-ink-900">{line.qty.toLocaleString("en-US")}</span>
                      <span className="block text-[10.5px] sm:text-[11px] text-muted-strong">{line.pkg || "ea"}</span>
                    </td>
                    <td className="min-w-[140px] max-w-[200px] sm:max-w-[220px] px-2 sm:px-2.5 py-2.5 align-top font-medium leading-relaxed text-ink-900">
                      {line.desc}
                    </td>
                    <td className="whitespace-nowrap px-2 sm:px-2.5 py-2.5 text-right align-top text-muted-strong">
                      {formatMoney(line.unit)}
                    </td>
                    <td className="whitespace-nowrap px-2 sm:px-2.5 py-2.5 pr-3 sm:pr-4 text-right align-top font-semibold text-ink-900">
                      {formatMoney(line.qty * line.unit)}
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          <div className="h-px w-full bg-hair-2" />

          {/* ── Таблиця 2: Departments ── */}
          <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
            <table className="w-full text-left text-[12.5px] sm:text-[13px] min-w-[300px]">
              <thead>
              <tr>
                <th className={`${TH} pl-3 sm:pl-4 min-w-[120px]`}>Department</th>
                <th className={`${TH} text-right min-w-[80px]`}>Account</th>
                <th className={`${TH} pr-3 sm:pr-4 text-right min-w-[80px]`}>Amount</th>
              </tr>
              </thead>
              <tbody>
              {deptRows.map((row, i) => (
                  <tr key={i} className={`border-t border-hair transition-colors ${row.active ? "bg-accent-soft/50 hover:bg-accent-soft/70" : "hover:bg-[#fafbfc]"}`}>
                    <td className={`px-2 sm:px-2.5 py-2.5 pl-3 sm:pl-4 whitespace-nowrap ${row.active ? "font-bold text-ink-900" : "text-muted-strong"}`}>
                      {row.dept}
                    </td>
                    <td className="px-2 sm:px-2.5 py-2.5 text-right font-mono text-[11px] sm:text-xs text-muted-strong">
                      {row.account}
                    </td>
                    <td className={`px-2 sm:px-2.5 py-2.5 pr-3 sm:pr-4 text-right whitespace-nowrap ${row.active ? "font-bold text-ink-900" : "text-muted-strong"}`}>
                      {row.amount != null ? formatMoney(row.amount) : "—"}
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          <div className="h-px w-full bg-hair-2" />

          {/* ── Підсумки (Totals) ── */}
          <div className="flex flex-col gap-1.5 bg-surface-soft p-3 sm:p-4">
            {([
              ["Subtotal", totals.subtotal],
              ["Shipping", totals.shipping],
              ["Tax", totals.tax],
            ] as [string, number][]).map(([label, value]) => (
                <div className="flex items-center justify-between text-[13px] sm:text-sm" key={label}>
                  <span className="text-muted-strong">{label}</span>
                  <span className={`tabular-nums ${value === 0 ? "text-muted" : "font-medium text-ink-900"}`}>
                {formatMoney(value)}
              </span>
                </div>
            ))}

            <div className="mt-1.5 sm:mt-2 flex items-center justify-between border-t border-hair-2 pt-2.5 sm:pt-3">
              <span className="text-[13px] sm:text-sm font-semibold text-ink-700">Total</span>
              <span className="text-[18px] sm:text-xl font-bold tabular-nums tracking-tight text-ink-900">
              {formatMoney(totals.total)}
            </span>
            </div>
          </div>

        </div>
      </div>
  );
}