import type { Vendor } from '@/types/vendors';
import { DEPTS, STATUS_META, M3_META, DOC_META, fmtUSD } from '../lib/vendors';

interface Props {
    vendor: Vendor;
    onClose: () => void;
}

function DrawerRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start sm:items-center justify-between gap-4 border-b border-dashed border-hair py-2.5 text-[12.5px] sm:text-[13.5px]">
            <span className="text-[12px] sm:text-[12.5px] text-muted shrink-0">{label}</span>
            <span className="text-right font-medium text-ink-900 tabular-nums break-words">{children}</span>
        </div>
    );
}

export function VendorDrawer({ vendor, onClose }: Props) {
    const dept = DEPTS[vendor.dept];
    const statusM = STATUS_META[vendor.status];
    const m3M = M3_META[vendor.m3];
    const cost = fmtUSD(vendor.monthlyCost);
    const mtd = fmtUSD(vendor.mtdSpend);
    const ytd = fmtUSD(vendor.ytdSpend);

    return (
        <div className="fixed inset-0 z-[80] flex justify-end">
            <div className="absolute inset-0 bg-[#0c1320]/35 transition-opacity" onClick={onClose} />

            <div className="relative flex h-full w-full max-w-[540px] flex-col gap-4 sm:gap-[18px] overflow-y-auto bg-white p-4 sm:p-6 shadow-2xl animate-[slideInRight_.22s_cubic-bezier(.2,.8,.2,1)]">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute right-2 sm:right-3.5 top-2 sm:top-3.5 flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:bg-surface-soft hover:text-ink-900 z-10"
                >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>

                {/* ── Header ── */}
                <div className="pr-8 sm:pr-0 shrink-0">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11.5px] sm:text-[12.5px] text-muted">
                        <span className="font-mono font-semibold text-ink-700">{vendor.id}</span>
                        <span className="hidden xs:inline">·</span>
                        <span className="truncate max-w-[120px] sm:max-w-none">{vendor.category}</span>
                        <span className="hidden xs:inline">·</span>
                        <span className={`inline-flex items-center gap-[5px] rounded-full ${statusM.bg} px-[7px] sm:px-[9px] py-[2px] sm:py-[3px] text-[10px] sm:text-[11px] font-semibold ${statusM.text} whitespace-nowrap`}>
                            <span className={`h-[4px] sm:h-[5px] w-[4px] sm:w-[5px] rounded-full ${statusM.dot} shrink-0`} />
                            {statusM.label}
                        </span>
                    </div>
                    <h2 className="text-[18px] sm:text-[20px] font-bold tracking-[-.02em] text-ink-900 leading-tight">{vendor.name}</h2>
                    <div className="mt-1.5 sm:mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] text-muted">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-soft px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11.5px] sm:text-[12px] font-medium text-ink-700">
                            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: dept.color }} />
                            {dept.name}
                        </span>
                        {vendor.contact && <span className="flex items-center gap-1.5 break-all sm:break-normal"><span className="hidden sm:inline">·</span> {vendor.contact.name} · {vendor.contact.email}</span>}
                    </div>
                </div>

                {/* ── Total card ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 rounded-xl bg-[#1a2540] p-4 sm:p-[18px] text-white shrink-0">
                    <div>
                        <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[.06em] text-white/50">Monthly Contract Value</div>
                        <div className="mt-1 text-[28px] sm:text-[34px] font-bold leading-none tracking-[-.02em] tabular-nums">
                            {cost.whole}<span className="text-[14px] sm:text-[17px] font-medium text-white/50">{cost.cents}</span>
                        </div>
                        <div className="mt-2.5 sm:mt-3 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[.06em] text-white/50">Cost type</div>
                        <div className="mt-0.5 sm:mt-1 text-[12px] sm:text-[13px] font-medium capitalize text-white/75">
                            {vendor.costType === 'fixed' ? 'Fixed monthly' : vendor.costType}
                        </div>
                    </div>

                    <div className="h-px w-full bg-white/10 sm:hidden my-1" />

                    <div className="text-left sm:text-right">
                        <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[.06em] text-white/50">Contract End</div>
                        <div className="mt-0.5 sm:mt-1.5 text-[13px] sm:text-[14px] font-medium">{vendor.contractEnd ?? '—'}</div>
                        <div className="mt-2.5 sm:mt-3 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[.06em] text-white/50">Notice Period</div>
                        <div className="mt-0.5 sm:mt-1.5 text-[13px] sm:text-[14px] font-medium">{vendor.noticeDays ? `${vendor.noticeDays} days` : '—'}</div>
                    </div>
                </div>

                {/* ── Contract details ── */}
                {/* ДОДАНО shrink-0 */}
                <div className="shrink-0">
                    <DrawerRow label="Contract Start">{vendor.contractStart ?? '—'}</DrawerRow>
                    <DrawerRow label="Contract End">{vendor.contractEnd ?? '—'}</DrawerRow>
                    <DrawerRow label="Payment Terms">{vendor.paymentTerms}</DrawerRow>
                    <DrawerRow label="COI Expires">{vendor.coiExpires ?? '—'}</DrawerRow>
                    <DrawerRow label="FEIN / Tax ID"><span className="font-mono">{vendor.fein ?? '—'}</span></DrawerRow>
                    <DrawerRow label="M3 Vendor Code"><span className="font-mono">{vendor.m3Code ?? '—'}</span></DrawerRow>
                    <DrawerRow label="M3 Mapping">
                        <span className={`inline-flex items-center gap-[5px] rounded-full ${m3M.bg} px-[9px] py-[3px] text-[10.5px] sm:text-[11px] font-semibold ${m3M.text} whitespace-nowrap`}>
                            <span className={`h-[5px] w-[5px] rounded-full ${m3M.dot} shrink-0`} />
                            {m3M.label}
                        </span>
                    </DrawerRow>
                </div>

                {/* ── Documents ── */}
                {vendor.documents.length > 0 && (
                    <div className="overflow-hidden rounded-[10px] border border-hair shrink-0">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse text-[12.5px] sm:text-[13px]">
                                <thead>
                                <tr className="bg-surface-soft border-b border-hair">
                                    <th className="px-3 py-2.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[.06em] text-muted">Document</th>
                                    <th className="hidden sm:table-cell px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-muted">Type</th>
                                    <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[.06em] text-muted whitespace-nowrap">Expiry</th>
                                    <th className="hidden sm:table-cell px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-muted whitespace-nowrap">Size</th>
                                    <th className="px-3 py-2.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[.06em] text-muted text-right">Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {vendor.documents.map((doc, i) => {
                                    const dm = DOC_META[doc.status];
                                    return (
                                        <tr key={i}
                                            className="border-b border-hair last:border-0 hover:bg-[#fafbfc] transition-colors">
                                            <td className="px-3 py-2.5">
                                                <div
                                                    className="max-w-[130px] sm:max-w-[160px] truncate text-ink-900 font-medium"
                                                    title={doc.name}>{doc.name}</div>
                                                <div
                                                    className="sm:hidden mt-0.5 text-[11px] text-muted font-mono uppercase">
                                                    {doc.type} · <span className="normal-case">{doc.size}</span>
                                                </div>
                                            </td>
                                            <td className="hidden sm:table-cell px-3 py-2.5 font-mono text-[11.5px] sm:text-[12px] text-muted uppercase">{doc.type}</td>
                                            <td className="px-2 sm:px-3 py-2.5 text-[11.5px] sm:text-[12.5px] text-muted tabular-nums whitespace-nowrap">{doc.expiry}</td>
                                            <td className="hidden sm:table-cell px-3 py-2.5 text-[12px] text-muted whitespace-nowrap">{doc.size}</td>
                                            <td className="px-3 py-2.5 text-right">
                                                    <span
                                                        className={`inline-flex items-center gap-[4px] sm:gap-[5px] rounded-full ${dm.bg} px-[7px] sm:px-[9px] py-[2px] sm:py-[3px] text-[10px] sm:text-[11px] font-semibold ${dm.text} whitespace-nowrap`}>
                                                        <span
                                                            className={`h-[4px] sm:h-[5px] w-[4px] sm:w-[5px] rounded-full ${dm.dot} shrink-0`}/>
                                                        {dm.label}
                                                    </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="shrink-0">
                    <DrawerRow label="Open POs">{vendor.openPOs}</DrawerRow>
                    <DrawerRow label="MTD Spend">{mtd.whole}{mtd.cents}</DrawerRow>
                    <DrawerRow label="YTD Spend">{ytd.whole}{ytd.cents}</DrawerRow>
                    <DrawerRow label="Last PO">{vendor.lastPO ?? '—'}</DrawerRow>
                </div>

                {vendor.notes && (
                    <div
                        className="border-t border-dashed border-hair pt-3 pb-2 sm:pb-4 text-[12.5px] sm:text-[13px] leading-relaxed text-muted shrink-0">
                        {vendor.notes}
                    </div>
                )}

                <div className="mt-auto flex flex-col sm:flex-row flex-wrap gap-2 pt-2 shrink-0">
                    <button
                        className="inline-flex h-9 w-full sm:w-auto items-center justify-center rounded-lg bg-[#1a2540] px-4 text-[13px] font-semibold text-white shadow-soft transition hover:bg-[#1a2540]/90">
                        + New PO
                    </button>

                    <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
                        <button
                            className="inline-flex h-9 w-full sm:w-auto items-center justify-center rounded-lg border border-hair-2 bg-white px-3 sm:px-4 text-[12.5px] sm:text-[13px] font-medium text-ink-700 shadow-sm sm:shadow-none transition hover:bg-surface-soft whitespace-nowrap">
                            View PO Log
                        </button>
                        <button
                            className="inline-flex h-9 w-full sm:w-auto items-center justify-center rounded-lg border border-hair-2 sm:border-transparent bg-white sm:bg-transparent px-3 sm:px-4 text-[12.5px] sm:text-[13px] font-medium text-ink-700 shadow-sm sm:shadow-none transition hover:bg-surface-soft whitespace-nowrap">
                            Edit Vendor
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}