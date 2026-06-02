import type { VendorsKpis } from '@/types/vendors';
import { fmtCompact } from '../lib/vendors';

interface Props { kpis: VendorsKpis; }

function Spark({ color }: { color: string }) {
    return (
        <svg width="76" height="34" viewBox="0 0 76 34" fill="none" className="shrink-0">
            <path d="M2 26 L12 22 L20 24 L28 16 L36 18 L46 10 L54 12 L62 6 L74 8"
                  stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 26 L12 22 L20 24 L28 16 L36 18 L46 10 L54 12 L62 6 L74 8 L74 34 L2 34 Z"
                  fill={color} opacity={0.12} />
        </svg>
    );
}

function HeroKpi({ kpis }: { kpis: VendorsKpis }) {
    const v = fmtCompact(kpis.monthlyTotal);
    const activeCount = kpis.active.length + kpis.expiring.length;
    return (
        <div className="rounded-2xl bg-[#161b28] p-5 text-white sm:p-6 shadow-sm">
            <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[.09em] text-white/50">
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#43b976] align-middle" />
                    Total Monthly Commitment
                </p>
                <Spark color="#2c3f5e" />
            </div>
            <p className="mt-2 text-[32px] font-bold leading-none tabular-nums sm:text-[36px]">
                {v.whole}<span className="text-[20px] font-semibold text-white/50">{v.unit}</span>
            </p>
            <p className="mt-1.5 text-[12.5px] text-white/50">across {activeCount} active contracts</p>
            <div className="mt-4 h-[5px] w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-[#43b976]" />
            </div>
            <div className="mt-2 flex items-center justify-between text-[12px]">
                <span className="text-white/50">72% of contract budget</span>
                <span className="rounded bg-[#244033] px-2 py-[2px] text-[11px] font-bold text-[#43b976]">
                    +2.1% vs Mar
                </span>
            </div>
        </div>
    );
}

interface KpiCardProps {
    label:      string;
    value:      number;
    sub:        string;
    barPct:     number;
    foot:       string;
    trend:      string;
    dotColor:   string;
    valueColor?: string;
    barStyle:   React.CSSProperties;
    badgeClass: string;
}

function KpiCard({ label, value, sub, barPct, foot, trend, dotColor, valueColor = "text-[#0f172a]", barStyle, badgeClass }: KpiCardProps) {
    return (
        <div className="flex flex-col gap-1.5 rounded-2xl border border-[#f1f5f9] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] sm:p-6">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: dotColor }} />
                    <p className="text-[11px] font-bold uppercase tracking-[.07em] text-[#8a94a6]">{label}</p>
                </div>
                <Spark color="#e2e8f0" />
            </div>
            <p className={`text-[30px] font-bold leading-none tabular-nums sm:text-[34px] ${valueColor}`}>{value}</p>
            <p className="text-[12.5px] text-[#8a94a6]">{sub}</p>
            <div className="my-1 h-[5px] w-full overflow-hidden rounded-full bg-[#f1f5f9]">
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, barPct)}%`, ...barStyle }} />
            </div>
            <div className="flex items-center justify-between mt-[1px]">
                <span className="text-[12px] text-[#8a94a6]">{foot}</span>
                <span className={`inline-flex items-center px-2 py-[2px] text-[11px] font-bold rounded ${badgeClass}`}>
                    {trend}
                </span>
            </div>
        </div>
    );
}

export function VendorsKpis({ kpis }: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <HeroKpi kpis={kpis} />
            <KpiCard
                label="Active Vendors"
                value={kpis.active.length}
                sub={`${kpis.pending.length} pending approval`}
                barPct={(kpis.active.length / kpis.total) * 100}
                foot={`${kpis.total - kpis.active.length} inactive`}
                trend={`${kpis.total} total`}
                dotColor="#45b777"
                barStyle={{ background: '#45b777' }}
                badgeClass="bg-transparent text-[#64748b] p-0"
            />
            <KpiCard
                label="Expiring Soon"
                value={kpis.expiring.length}
                sub="within 60 days"
                barPct={(kpis.expiring.length / kpis.total) * 100}
                foot="2 within 30 days"
                trend="Action needed"
                dotColor="#bb6916"
                valueColor="text-[#bb6916]"
                barStyle={{ background: '#f2a63a' }}
                badgeClass="bg-[#fbeaea] text-[#c54c46]"
            />
            <KpiCard
                label="COI / Docs Missing"
                value={kpis.coiIssues.length}
                sub="require immediate action"
                barPct={(kpis.coiIssues.length / kpis.total) * 100}
                foot="$11,960 at risk"
                trend="Urgent"
                dotColor="#c04445"
                valueColor="text-[#c14444]"
                barStyle={{ background: 'linear-gradient(90deg, #df5b59 0%, #f79d98 100%)' }}
                badgeClass="bg-[#fbeaea] text-[#c54c46]"
            />
        </div>
    );
}