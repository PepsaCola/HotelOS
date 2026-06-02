import { useState } from "react";
import type { ActivityTab, InvoiceRow, MatchTag, PORow } from "@/types/dashboard";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { DeptTag } from "@/components/ui/DeptTag";

interface ActivityTableProps {
  invoices: InvoiceRow[];
  purchaseOrders: PORow[];
  counts: { invoices: number; purchaseOrders: number };
}

const matchToneClass: Record<MatchTag["tone"], string> = {
  ok: "bg-good-bg text-good",
  warn: "bg-warn-bg text-warn",
  crit: "bg-crit-bg text-crit",
};

const TH = "whitespace-nowrap border-b border-hair bg-[#f9f8f3] px-4 pb-2 pt-2.5 text-left text-[9.5px] font-bold uppercase tracking-[0.06em] text-muted-strong";
const TD = "whitespace-nowrap border-b border-hair px-4 py-[11px] text-[13px]";

export function ActivityTable({ invoices, purchaseOrders, counts }: ActivityTableProps) {
  const [tab, setTab] = useState<ActivityTab>("invoices");

  return (
    <Card>
      <div className="flex flex-col gap-2.5 border-b border-hair px-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-1 flex items-center gap-0.5 overflow-auto overflow-y-hidden px-1">
          <Tab active={tab === "invoices"} count={counts.invoices} onClick={() => setTab("invoices")}>
            Latest Invoices
          </Tab>
          <Tab active={tab === "pos"} count={counts.purchaseOrders} onClick={() => setTab("pos")}>
            Latest POs
          </Tab>
        </div>
        <div className="flex items-center gap-2 pb-2 sm:pb-0">
          <TableActionButton label="Filter">
            <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </TableActionButton>
          <TableActionButton label="Export">
            <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </TableActionButton>
        </div>
      </div>

      <div className="overflow-x-auto">
        {tab === "invoices" ? <InvoicesTable rows={invoices} /> : <POTable rows={purchaseOrders} />}
      </div>

      <div className="flex flex-col gap-2 border-t border-hair bg-[#fafbfc] px-4 py-2.5 text-xs text-muted-strong sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing{" "}
          <b className="text-ink-700">
            8 of {tab === "invoices" ? counts.invoices : counts.purchaseOrders}
          </b>{" "}
          {tab === "invoices" ? "invoices" : "purchase orders"} · sorted by last updated
        </span>
        <div className="flex items-center gap-2">
          <span>Page 1 of {tab === "invoices" ? 10 : 6}</span>
          <Pager direction="left" />
          <Pager direction="right" />
        </div>
      </div>
    </Card>
  );
}

function Tab({ active, count, onClick, children }: { active: boolean; count: number; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative shrink-0 whitespace-nowrap px-3.5 pb-3.5 pt-3 text-[13.5px] font-semibold ${active ? "text-ink-900" : "text-muted-strong"}`}
    >
      {children}
      <span
        className={`ml-1.5 rounded-full px-1.5 py-px align-[1px] text-[11px] font-bold ${
          active ? "bg-accent-soft text-accent-ink" : "bg-neutral-bg text-neutral-ink"
        }`}
      >
        {count}
      </span>
      {active ? <span className="absolute inset-x-1.5 -bottom-px h-0.5 rounded-sm bg-accent" /> : null}
    </button>
  );
}

function TableActionButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-lg border border-hair-2 bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-ink-700 shadow-sm transition-colors hover:bg-surface-soft"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[15px] w-[15px]">
        {children}
      </svg>
      {label}
    </button>
  );
}

function Pager({ direction }: { direction: "left" | "right" }) {
  return (
    <button
      type="button"
      aria-label={direction === "left" ? "Previous page" : "Next page"}
      className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-hair-2 bg-white text-muted-strong hover:bg-[#fafaf6] hover:text-ink-900"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
        <path
          d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function InvoicesTable({ rows }: { rows: InvoiceRow[] }) {
  return (
    <table className="w-full min-w-[860px] border-collapse">
      <thead>
        <tr>
          <th className={TH}>Invoice #</th>
          <th className={TH}>Vendor</th>
          <th className={TH}>Received</th>
          <th className={TH}>Dept</th>
          <th className={`${TH} text-right`}>Total</th>
          <th className={TH}>PO #</th>
          <th className={TH}>Matching</th>
          <th className={TH}>Status</th>
          <th className={`${TH} text-right`}>Updated</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="last:[&_td]:border-b-0 hover:[&_td]:bg-[#fafbfc]">
            <td className={`${TD} font-mono text-[12.5px] font-semibold text-ink-900`}>{row.id}</td>
            <td className={TD}>
              <div className="flex flex-col">
                <b className="text-[13px] font-semibold text-ink-900">{row.vendor}</b>
                <small className="mt-px text-[11px] font-medium text-muted-strong">{row.note}</small>
              </div>
            </td>
            <td className={TD}>{row.received}</td>
            <td className={TD}>
              <DeptTag dept={row.dept} />
            </td>
            <td className={`${TD} text-right`}>
              <span className="text-[13px] font-bold text-[#0c1320]">{row.amount}</span>
            </td>
            <td className={TD}>
              {row.po === "—" ? (
                <span className="text-muted-strong">—</span>
              ) : (
                <span className="font-mono text-[12.5px] font-semibold text-ink-900">{row.po}</span>
              )}
            </td>
            <td className={TD}>
              {row.matching.length > 0 ? (
                <span className="inline-flex gap-1">
                  {row.matching.map((item) => (
                    <span key={item.label} className={`rounded px-1.5 py-0.5 text-[10.5px] font-bold tracking-wide ${matchToneClass[item.tone]}`}>
                      {item.label}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="text-muted-strong">—</span>
              )}
            </td>
            <td className={TD}>
              <StatusPill label={row.status.label} tone={row.status.tone} />
            </td>
            <td className={`${TD} text-right text-xs font-medium ${row.updatedTone === "warn" ? "text-warn" : row.updatedTone === "crit" ? "font-bold text-crit" : "text-ink-700"}`}>
              {row.updated}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function POTable({ rows }: { rows: PORow[] }) {
  return (
    <table className="w-full min-w-[860px] border-collapse">
      <thead>
        <tr>
          <th className={TH}>PO #</th>
          <th className={TH}>A/C #</th>
          <th className={TH}>Description / Vendor</th>
          <th className={TH}>Dept</th>
          <th className={TH}>Issued</th>
          <th className={`${TH} text-right`}>Amount</th>
          <th className={TH}>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="last:[&_td]:border-b-0 hover:[&_td]:bg-[#fafbfc]">
            <td className={`${TD} font-mono text-[12.5px] font-semibold text-ink-900`}>{row.id}</td>
            <td className={`${TD} font-mono text-[12.5px] font-semibold text-ink-700`}>{row.account}</td>
            <td className={TD}>
              <div className="flex flex-col">
                <b className="text-[13px] font-semibold text-ink-900">{row.title}</b>
                <small className="mt-px text-[11px] font-medium text-muted-strong">{row.vendor}</small>
              </div>
            </td>
            <td className={TD}>
              <DeptTag dept={row.dept} />
            </td>
            <td className={TD}>{row.issued}</td>
            <td className={`${TD} text-right`}>
              <span className="text-[13px] font-bold text-[#0c1320]">{row.amount}</span>
            </td>
            <td className={TD}>
              <StatusPill label={row.status.label} tone={row.status.tone} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
