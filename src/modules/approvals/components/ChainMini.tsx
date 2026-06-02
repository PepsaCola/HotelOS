import type { StepStatus } from "@/types/approvals";

interface ChainMiniProps {
  steps: StepStatus[];
}

const STEP_LABELS = ["D", "A", "C", "G", "C"];
const STEP_TITLES = ["Dept Head", "AGM", "Controller", "GM", "Corporate"];

const STEP_BG: Record<StepStatus, string> = {
  done: "bg-good",
  current: "bg-accent shadow-[0_0_0_2px_var(--color-accent-soft)]",
  pending: "bg-muted",
  rejected: "bg-crit",
  changes: "bg-warn",
};

/** Compact horizontal approval-chain indicator with hover tooltips. */
export default function ChainMini({ steps }: ChainMiniProps) {
  return (
    <div className="flex items-center gap-[3px]">
      {steps.map((status, i) => (
        <div key={i} className="group relative flex items-center justify-center">
          <div className={`grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold text-white ${STEP_BG[status]}`}>
            {STEP_LABELS[i] ?? "C"}
          </div>
          <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 flex -translate-x-1/2 flex-col items-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <span className="whitespace-nowrap rounded bg-ink-900 px-2 py-1 text-[11px] font-medium text-white">
              {STEP_TITLES[i] ?? "Corporate"}
            </span>
            <div className="h-0 w-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-ink-900" />
          </div>
        </div>
      ))}
    </div>
  );
}
