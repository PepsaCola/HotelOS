import type { StatusTone } from "@/types/dashboard";

type PillTone = StatusTone | "neutral";

const toneClasses: Record<PillTone, { pill: string; dot: string }> = {
  good: { pill: "bg-good-bg text-good", dot: "bg-good" },
  warn: { pill: "bg-warn-bg text-warn", dot: "bg-warn" },
  crit: { pill: "bg-crit-bg text-crit", dot: "bg-crit" },
  info: { pill: "bg-accent-soft text-accent-ink", dot: "bg-accent" },
  neutral: { pill: "bg-neutral-bg text-neutral-ink", dot: "bg-muted-strong" },
};

interface StatusPillProps {
  label: string;
  tone?: PillTone;
}

export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  const classes = toneClasses[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] text-[11px] font-bold ${classes.pill}`}
    >
      <span className={`h-[5px] w-[5px] rounded-full ${classes.dot}`} />
      {label}
    </span>
  );
}
