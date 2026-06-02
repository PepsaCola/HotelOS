import { Fragment } from "react";
import type { PODeptId, PODepartment, POLogPrefs, PurchaseOrderRecord, StatusMeta, POStatus } from "@/types/poLog";
import { StatusPill } from "@/components/ui/StatusPill";
import { fmtUSD } from "@/lib/money";
import { tier, type AmountTier } from "../lib/tier";

interface POTableProps {
  rows: PurchaseOrderRecord[];
  grouped: Array<[PODeptId, { rows: PurchaseOrderRecord[]; total: number }]> | null;
  departments: Record<PODeptId, PODepartment>;
  statusMeta: Record<POStatus, StatusMeta>;
  prefs: POLogPrefs;
  onOpenRow: (row: PurchaseOrderRecord) => void;
}

const ROW_HEIGHT: Record<POLogPrefs["density"], string> = {
  compact: "h-10",
  regular: "h-[52px]",
  comfy: "h-[60px]",
};

const TH = "whitespace-nowrap border-b border-hair-2 bg-surface-soft px-3.5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong";

export function POTable({ rows, grouped, departments, statusMeta, prefs, onOpenRow }: POTableProps) {
  const fontClass = prefs.density === "compact" ? "text-[13px]" : "text-[13.5px]";

  return (
    <div className="overflow-x-auto rounded-b-[14px] border border-t-0 border-hair-2 bg-white">
      <table className={`w-full min-w-[820px] border-collapse tabular-nums ${fontClass}`}>
        <thead>
          <tr>
            <th className={`${TH} w-[9%]`}>PO #</th>
            <th className={`${TH} w-[10%]`}>A/C #</th>
            <th className={TH}>Description{prefs.showVendor ? " / Vendor" : ""}</th>
            <th className={`${TH} w-[14%]`}>Department</th>
            <th className={`${TH} w-[10%]`}>Issued</th>
            <th className={`${TH} w-[13%] text-right`}>Amount</th>
            <th className={`${TH} w-[10%]`}>Status</th>
          </tr>
        </thead>
        <tbody>
          {grouped
            ? grouped.map(([deptId, group]) => (
                <Fragment key={deptId}>
                  <DeptHeader dept={departments[deptId]} count={group.rows.length} total={group.total} />
                  {group.rows.map((row) => (
                    <Row key={row.po} row={row} departments={departments} statusMeta={statusMeta} prefs={prefs} onOpen={onOpenRow} />
                  ))}
                  <SubtotalRow dept={departments[deptId]} count={group.rows.length} total={group.total} />
                </Fragment>
              ))
            : rows.map((row) => (
                <Row key={row.po} row={row} departments={departments} statusMeta={statusMeta} prefs={prefs} onOpen={onOpenRow} />
              ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({
  row,
  departments,
  statusMeta,
  prefs,
  onOpen,
}: {
  row: PurchaseOrderRecord;
  departments: Record<PODeptId, PODepartment>;
  statusMeta: Record<POStatus, StatusMeta>;
  prefs: POLogPrefs;
  onOpen: (row: PurchaseOrderRecord) => void;
}) {
  const dept = departments[row.dept];
  const meta = statusMeta[row.status];
  const cellHeight = ROW_HEIGHT[prefs.density];
  const amountTier = prefs.highlightLarge ? tier(row.amt, prefs.largeThreshold) : "";

  return (
    <tr className="cursor-pointer hover:bg-[#fafbff]" onClick={() => onOpen(row)}>
      <td className={`${cellHeight} border-b border-hair px-3.5 align-middle font-semibold text-ink-900`}>{row.po}</td>
      <td className="border-b border-hair px-3.5 align-middle font-mono text-[12.5px] text-muted-strong">{row.ac}</td>
      <td className="max-w-[520px] truncate border-b border-hair px-3.5 align-middle text-ink-700">
        {row.desc}
        {prefs.showVendor ? <span className="mt-px block text-[11.5px] font-medium text-[#9aa0a8]">{row.vendor}</span> : null}
      </td>
      <td className="border-b border-hair px-3.5 align-middle">
        <DeptPill dept={dept} />
      </td>
      <td className="whitespace-nowrap border-b border-hair px-3.5 align-middle text-ink-700">
        {row.date}
        <small className="mt-px block text-[11px] text-[#9aa0a8]">Due {row.due}</small>
      </td>
      <Amount value={row.amt} tier={amountTier} />
      <td className="border-b border-hair px-3.5 align-middle">
        <StatusPill label={meta.label} tone={meta.tone} />
      </td>
    </tr>
  );
}

const tierTextClass: Record<AmountTier, string> = {
  "": "text-[#0c1320] font-semibold text-[15px]",
  lg: "text-[#1a3d1f] font-bold text-[15px]",
  xl: "text-[#5a1e0d] font-bold text-[15.5px]",
};

function Amount({ value, tier: amountTier }: { value: number; tier: AmountTier }) {
  const f = fmtUSD(value);
  return (
    <td className={`border-b border-hair px-3.5 text-right align-middle tracking-[-0.005em] ${tierTextClass[amountTier]}`}>
      {amountTier === "xl" ? (
        <span className="mr-2 inline-block h-3.5 w-[3px] rounded-sm bg-[#d96a3c] align-[-3px]" />
      ) : null}
      {f.whole}
      <span className="ml-px text-[13px] font-medium text-muted-strong">{f.cents}</span>
    </td>
  );
}

function DeptPill({ dept }: { dept: PODepartment }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f4f3] px-2 py-[3px] text-xs font-medium text-ink-700">
      <span className="h-[7px] w-[7px] rounded-full" style={{ background: dept.color }} />
      {dept.name}
    </span>
  );
}

function DeptHeader({ dept, count, total }: { dept: PODepartment; count: number; total: number }) {
  const f = fmtUSD(total);
  return (
    <tr>
      <td colSpan={7} className="bg-white px-3.5 pb-2 pt-[18px]">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="h-[9px] w-[9px] rounded-full" style={{ background: dept.color }} />
            <h3 className="text-[13px] font-bold tracking-wide text-ink-900">{dept.name}</h3>
            <span className="text-xs font-medium text-[#9aa0a8]">
              {count} {count === 1 ? "order" : "orders"}
            </span>
          </div>
          <div className="text-xs tabular-nums text-ink-700">
            <span className="text-muted-strong">Department total </span>
            <b className="text-sm font-bold text-ink-900">
              {f.whole}
              {f.cents}
            </b>
          </div>
        </div>
      </td>
    </tr>
  );
}

function SubtotalRow({ dept, count, total }: { dept: PODepartment; count: number; total: number }) {
  const f = fmtUSD(total);
  return (
    <tr>
      <td colSpan={5} className="h-[42px] border-y border-hair-2 bg-[#fbfbf9] px-3.5 align-middle text-[11.5px] font-semibold uppercase tracking-[0.04em] text-muted-strong">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3.5 w-1.5 rounded-sm" style={{ background: dept.color }} />
          {dept.name} subtotal
          <span className="font-medium normal-case tracking-normal text-[#9aa0a8]">
            {count} {count === 1 ? "PO" : "POs"}
          </span>
        </span>
      </td>
      <td className="h-[42px] border-y border-hair-2 bg-[#fbfbf9] px-3.5 text-right align-middle text-[15px] font-bold text-ink-900">
        {f.whole}
        <span className="text-[13px] font-medium text-muted-strong">{f.cents}</span>
      </td>
      <td className="h-[42px] border-y border-hair-2 bg-[#fbfbf9]" />
    </tr>
  );
}
