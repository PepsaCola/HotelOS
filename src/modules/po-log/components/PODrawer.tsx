import type { PODeptId, PODepartment, POStatus, StatusMeta, PurchaseOrderRecord } from "@/types/poLog";
import { Drawer } from "@/components/ui/Drawer";
import { StatusPill } from "@/components/ui/StatusPill";
import { fmtUSD } from "@/lib/money";

interface PODrawerProps {
  row: PurchaseOrderRecord | null;
  departments: Record<PODeptId, PODepartment>;
  statusMeta: Record<POStatus, StatusMeta>;
  onClose: () => void;
}

export function PODrawer({ row, departments, statusMeta, onClose }: PODrawerProps) {
  return (
    <Drawer open={row !== null} onClose={onClose} label="Purchase order detail">
      {row ? <PODrawerBody row={row} departments={departments} statusMeta={statusMeta} /> : null}
    </Drawer>
  );
}

function PODrawerBody({
  row,
  departments,
  statusMeta,
}: {
  row: PurchaseOrderRecord;
  departments: Record<PODeptId, PODepartment>;
  statusMeta: Record<POStatus, StatusMeta>;
}) {
  const dept = departments[row.dept];
  const meta = statusMeta[row.status];
  const total = fmtUSD(row.amt);
  // Synthetic single line until the API exposes `row.lines`.
  const line = { desc: row.desc, qty: 1, unit: row.amt * 0.92, tax: row.amt * 0.08 };
  const unit = fmtUSD(line.unit);
  const tax = fmtUSD(line.tax);

  return (
    <>
      <div>
        <div className="mb-1.5 flex flex-wrap items-center gap-2.5 text-[12.5px] text-muted-strong">
          <span className="font-mono font-semibold text-ink-700">{row.po}</span>
          <span>·</span>
          <span>
            A/C <span className="font-mono">{row.ac}</span>
          </span>
          <span>·</span>
          <StatusPill label={meta.label} tone={meta.tone} />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-ink-900">{row.desc}</h2>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[13px] text-muted-strong">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f4f3] px-2 py-[3px] text-xs font-medium text-ink-700">
            <span className="h-[7px] w-[7px] rounded-full" style={{ background: dept.color }} />
            {dept.name}
          </span>
          · {row.vendor}
        </div>
      </div>

      <div className="flex items-end justify-between rounded-xl bg-[#0c1320] p-[18px] text-white">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-white/60">Authorised total</div>
          <div className="mt-1.5 text-[34px] font-bold tracking-tight tabular-nums">
            {total.whole}
            <span className="text-[17px] font-medium text-white/60">{total.cents}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-white/60">Issued</div>
          <div className="mt-1.5 text-sm font-medium">{row.date} · 2026</div>
          <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/60">Due</div>
          <div className="mt-1.5 text-sm font-medium">{row.due}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-hair">
        <table className="w-full border-collapse text-[13px] tabular-nums">
          <thead>
            <tr>
              <th className="bg-surface-soft px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong">Description</th>
              <th className="bg-surface-soft px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong">Qty</th>
              <th className="bg-surface-soft px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong">Unit</th>
              <th className="bg-surface-soft px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong">Tax</th>
              <th className="bg-surface-soft px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-t border-hair px-3 py-2.5">{line.desc}</td>
              <td className="border-t border-hair px-3 py-2.5 text-right font-medium">{line.qty}</td>
              <td className="border-t border-hair px-3 py-2.5 text-right font-medium">{unit.whole}{unit.cents}</td>
              <td className="border-t border-hair px-3 py-2.5 text-right font-medium">{tax.whole}{tax.cents}</td>
              <td className="border-t border-hair px-3 py-2.5 text-right font-medium">
                <b>{total.whole}{total.cents}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <DetailRow k="Requester" v="Sandra K. — F&B Director" />
      <DetailRow k="Approved by" v="Marcus L. — GM" />
      <DetailRow k="Cost center" v={`${dept.name} · ${row.ac}`} />
      <DetailRow k="Payment terms" v="Net 30" />
      <DetailRow k="PO created" v={`${row.date} 2026, 09:42`} />

      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        <button className="inline-flex h-9 items-center rounded-[9px] border border-ink-900 bg-ink-900 px-3.5 text-[13.5px] font-medium text-white hover:bg-black">
          Open in Receiving
        </button>
        <button className="inline-flex h-9 items-center rounded-[9px] border border-hair-2 bg-white px-3.5 text-[13.5px] font-medium text-ink-900 hover:bg-surface-soft">
          Edit PO
        </button>
        <button className="inline-flex h-9 items-center rounded-[9px] px-3.5 text-[13.5px] font-medium text-ink-700 hover:bg-surface-chip">
          Download PDF
        </button>
      </div>
    </>
  );
}

function DetailRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-dashed border-hair pb-2.5 text-[13.5px]">
      <span className="text-[12.5px] text-muted-strong">{k}</span>
      <span className="text-right font-medium tabular-nums text-ink-900">{v}</span>
    </div>
  );
}
