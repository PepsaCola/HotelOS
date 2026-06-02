export function Ic({ d, w = "1.6", lc = "round", lj = "round", fill = "none", className }: {
    d: string | string[]; w?: string; lc?: string; lj?: string; fill?: string; className?: string;
}) {
    return (
        <svg viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={w}
             strokeLinecap={lc as never} strokeLinejoin={lj as never}
             aria-hidden="true" className={className}>
            {(Array.isArray(d) ? d : [d]).map((path, i) => <path key={i} d={path} />)}
        </svg>
    );
}

export function MatchPctPill({ percent, tone }: { percent: string; tone: string }) {
    if (!percent) return null;
    const cls = tone === "perfect" ? "bg-good-bg text-good" : "bg-warn-bg text-warn";
    return (
        <span className={`inline-flex h-[18px] items-center rounded-full px-1.5 text-[11.5px] font-semibold leading-none ${cls}`}>
            {percent}
        </span>
    );
}

export const STATUS_PILL_CLS: Record<string, string> = {
    good:    "bg-good-bg text-good",
    warn:    "bg-warn-bg text-warn",
    crit:    "bg-crit-bg text-crit",
    indigo:  "bg-accent-soft text-accent-ink",
    neutral: "bg-surface-chip text-ink-700",
};