import type { RoomsProperty } from '@/types/rooms';

interface Props {
    property: RoomsProperty;
}

export function RoomsHotelStrip({ property: p }: Props) {
    return (
        <div className="flex flex-wrap items-start gap-x-5 gap-y-3 rounded-xl border border-hair-2 bg-white px-4 py-3 shadow-soft sm:items-center">

            {/* Property name + sub */}
            <div className="min-w-0 flex-1 basis-full sm:basis-auto">
                <p className="text-[14px] font-bold tracking-[-0.01em] text-ink-900 sm:text-[15px]">
                    {p.name}
                </p>
                <p className="mt-0.5 text-[11px] text-muted sm:text-[11.5px]">
                    {p.department} · {p.keys} keys · {p.hierarchy}
                </p>
            </div>

            {/* Meta blocks */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5">
                <div className="flex flex-col">
                    <span className="text-[9.5px] font-bold uppercase tracking-[.06em] text-muted">Month #</span>
                    <span className="mt-0.5 text-[13px] font-semibold tabular-nums text-ink-900">
                        {p.monthNum}
                        <span className="ml-1 text-[12px] font-medium text-muted">· {p.monthName}</span>
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9.5px] font-bold uppercase tracking-[.06em] text-muted">M3 Site Tag</span>
                    <span className="mt-0.5 text-[13px] font-semibold tabular-nums text-ink-900">{p.m3Tag}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9.5px] font-bold uppercase tracking-[.06em] text-muted">Ledger Mapping ID</span>
                    <span className="mt-0.5 text-[13px] font-semibold tabular-nums text-ink-900">{p.ledgerId}</span>
                </div>
            </div>

            {/* Week type pill */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#efe5b0] bg-[#fff8d6] px-2.5 py-1 text-[11.5px] font-bold text-[#6b5b15]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c19a13]" />
                WEEK: {p.weekType}
            </span>

        </div>
    );
}