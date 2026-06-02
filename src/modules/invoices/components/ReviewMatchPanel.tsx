import { useState, useMemo } from "react";
import type { PoDetail, ReviewData } from "@/types/invoices";
import { SearchIcon } from "@/components/ui/icons";
import { Ic, MatchPctPill } from "./ReviewShared";

// Оновлена сітка: 1 колонка на мобільних, розгорнута сітка на планшетах/десктопах
const COL_GRID = "grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_76px_82px_58px_auto] items-center gap-3 sm:gap-2 px-4 sm:px-3.5";
const WARN_ICON = ["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4M12 17h.01"];

function OtherPoSearch({ search, onSearch }: { search: string; onSearch: (v: string) => void }) {
    return (
        <div className="relative flex-none border-b border-page-border px-3.5 py-2.5">
            <SearchIcon className="pointer-events-none absolute left-[26px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-muted" />
            <input
                type="text"
                value={search}
                onChange={e => onSearch(e.target.value)}
                placeholder="Search POs…"
                className="h-9 w-full rounded-full border border-page-border bg-white pl-9 pr-3 text-[13px] text-ink outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
        </div>
    );
}

function OtherPoList({ pos, onOpenForm, onRejectPo }: {
    pos: PoDetail[];
    onOpenForm: (ref: string) => void;
    onRejectPo: (ref: string) => void;
}) {
    if (pos.length === 0) {
        return <div className="px-4 py-8 text-center text-[13px] text-muted-strong">No POs match search.</div>;
    }

    return (
        <div className="flex flex-col">
            {pos.map((po, i) => (
                <div key={po.ref} className={`${COL_GRID} py-3 sm:min-h-[64px] hover:bg-surface-soft transition-colors ${i < pos.length - 1 ? "border-b border-page-border" : ""}`}>
                    <div className="min-w-0">
                        <div className="text-[13.5px] font-semibold text-ink">{po.ref}</div>
                        <div className="truncate text-[12px] text-muted-strong">{po.desc}</div>
                    </div>
                    {/* Приховані на мобільному, щоб не ламати верстку */}
                    <div className="hidden sm:block"><div className="text-[10px] text-muted uppercase">A/C</div><div className="font-mono text-[12px] font-medium text-ink">{po.account}</div></div>
                    <div className="hidden sm:block"><div className="text-[10px] text-muted uppercase">Amt</div><div className="tabular-nums text-[12px] font-medium text-ink">{po.amount}</div></div>
                    <div className="hidden sm:block"><div className="text-[10px] text-muted uppercase">Date</div><div className="text-[12px] font-medium text-ink">{po.date}</div></div>

                    {/* Кнопки: розтягуються на всю ширину на мобільних */}
                    <div className="flex sm:justify-end gap-2 mt-1 sm:mt-0">
                        <button type="button" onClick={() => onOpenForm(po.ref)} className="h-9 sm:h-8 flex-1 sm:flex-none rounded-[8px] bg-ink-900 px-4 sm:px-3 text-[12.5px] font-medium text-white hover:bg-black transition-colors">Form</button>
                        <button type="button" onClick={() => onRejectPo(po.ref)} className="h-9 sm:h-8 flex-1 sm:flex-none rounded-[8px] border border-page-border bg-white px-4 sm:px-3 text-[12.5px] font-medium text-ink hover:bg-surface-soft transition-colors">Reject</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export interface ReviewMatchPanelProps {
    data: ReviewData;
    activePoRef: string;
    closestMatches: PoDetail[];
    otherOpenPos: PoDetail[];
    flow: number;
    onSelectPo: (ref: string) => void;
    onOpenForm: (ref: string) => void;
    onRejectPo: (ref: string) => void;
    onSendToExceptions: () => void;
}

export function ReviewMatchPanel({
                                     data: _data, activePoRef, closestMatches, otherOpenPos, flow,
                                     onSelectPo, onOpenForm, onRejectPo, onSendToExceptions,
                                 }: ReviewMatchPanelProps) {
    const [search, setSearch] = useState("");
    const [noMatchSearchVisible, setNoMatchSearchVisible] = useState(false);

    const showNoMatch = flow === 5 || closestMatches.length === 0;

    const filteredOther = useMemo(
        () => search
            ? otherOpenPos.filter(p =>
                p.ref.toLowerCase().includes(search.toLowerCase()) ||
                p.desc.toLowerCase().includes(search.toLowerCase())
            )
            : otherOpenPos,
        [otherOpenPos, search],
    );

    if (showNoMatch && !noMatchSearchVisible) {
        return (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-page-border bg-white">
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center sm:px-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-crit-bg shrink-0">
                        <Ic d={WARN_ICON} className="h-6 w-6 text-crit" />
                    </div>
                    <div className="max-w-[340px]">
                        <p className="text-[16px] font-semibold text-ink">No matching PO found</p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-strong">
                            The system could not find a strong PO candidate. Search open POs manually or send to Exceptions.
                        </p>
                    </div>
                    {/* Кнопки вишиковуються у стовпчик на мобільних і стають у рядок від sm-екранів */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2 sm:px-0">
                        <button type="button" onClick={() => setNoMatchSearchVisible(true)}
                                className="flex h-11 sm:h-9 items-center justify-center gap-2 rounded-[9px] bg-ink-900 px-5 text-[13px] font-semibold text-white hover:bg-black w-full sm:w-auto transition-colors">
                            <SearchIcon className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                            Search open POs
                        </button>
                        <button type="button" onClick={onSendToExceptions}
                                className="flex h-11 sm:h-9 items-center justify-center gap-2 rounded-[9px] border border-[#f5c6c6] bg-white px-5 text-[13px] font-semibold text-crit hover:bg-crit-soft w-full sm:w-auto transition-colors">
                            <Ic d={WARN_ICON} className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                            Send to Exceptions
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
            {/* Closest matches */}
            <div className="flex-none overflow-hidden rounded-[14px] border border-page-border bg-white">
                <div className="flex items-center justify-between border-b border-page-border px-4 sm:px-3.5 py-2.5 bg-surface-soft sm:bg-transparent">
                    <span className="text-[12px] font-semibold text-ink uppercase tracking-wider sm:normal-case sm:tracking-normal">Closest matches</span>
                </div>
                {closestMatches.map((po, i) => (
                    <div key={po.ref} onClick={() => onSelectPo(po.ref)}
                         className={`cursor-pointer transition-colors ${i > 0 ? "border-t border-page-border" : ""} ${activePoRef === po.ref ? "bg-[#f0f0ff]" : "hover:bg-surface-soft"}`}>
                        <div className={`${COL_GRID} py-3`}>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13.5px] font-semibold text-ink">{po.ref}</span>
                                    <MatchPctPill percent={po.percent} tone={po.tone} />
                                </div>
                                <div className="truncate text-[12px] text-muted-strong mt-0.5">{po.desc}</div>
                            </div>
                            {/* Додаткові дані приховані на мобільному */}
                            <div className="hidden sm:block text-[12px]">{po.account}</div>
                            <div className="hidden sm:block text-[12px] font-medium">{po.amount}</div>
                            <div className="hidden sm:block text-[12px]">{po.date}</div>

                            <div className="flex sm:justify-end mt-1 sm:mt-0" onClick={e => e.stopPropagation()}>
                                <button type="button" onClick={() => onOpenForm(po.ref)} className="h-9 sm:h-8 flex-1 sm:flex-none rounded-[8px] bg-ink-900 px-4 sm:px-3 text-[12.5px] font-medium text-white hover:bg-black transition-colors">Form</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Other POs */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-page-border bg-white">
                <div className="flex flex-none items-center justify-between border-b border-page-border px-4 sm:px-3.5 py-2.5 bg-surface-soft sm:bg-transparent">
                    <span className="text-[12px] font-semibold text-ink uppercase tracking-wider sm:normal-case sm:tracking-normal">Other open POs</span>
                </div>
                <OtherPoSearch search={search} onSearch={setSearch} />
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <OtherPoList pos={filteredOther} onOpenForm={onOpenForm} onRejectPo={onRejectPo} />
                </div>
            </div>
        </div>
    );
}