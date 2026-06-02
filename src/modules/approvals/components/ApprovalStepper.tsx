import type { PurchaseApproval, StepStatus } from "@/types/approvals";
import { CheckIcon, ChangesIcon, CircleIcon, CloseIcon, UserIcon } from "./icons";

interface ApprovalStepperProps {
  po: PurchaseApproval;
  reviewerName: string;
}

const STEP_ICON: Record<StepStatus, JSX.Element> = {
  done: <CheckIcon className="h-3 w-3 text-white" />,
  current: <UserIcon className="h-3 w-3 text-white" />,
  pending: <CircleIcon className="h-3 w-3 text-muted" />,
  rejected: <CloseIcon className="h-3 w-3 text-crit" />,
  changes: <ChangesIcon className="h-3 w-3 text-warn" />,
};

const STEP_RING: Record<StepStatus, string> = {
  done: "bg-good border-good",
  current: "bg-accent border-accent shadow-[0_0_0_3px_var(--color-accent-soft)]",
  pending: "bg-white border-hair-2",
  rejected: "bg-crit-soft border-crit-bg",
  changes: "bg-warn-soft border-warn-bg",
};

function StepBadge({ status, action }: { status: StepStatus; action: string }) {
  if (status === "done")
    return (
      <span className="inline-flex items-center gap-1 rounded bg-good-bg px-1.5 py-0.5 text-[10px] font-bold text-good">
        <CheckIcon className="h-3 w-3" /> {action}
      </span>
    );
  if (status === "current")
    return <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold text-accent-ink">Your turn</span>;
  if (status === "rejected")
    return <span className="rounded bg-crit-bg px-1.5 py-0.5 text-[10px] font-bold text-crit">{action}</span>;
  if (status === "changes")
    return <span className="rounded bg-warn-bg px-1.5 py-0.5 text-[10px] font-bold text-warn">{action}</span>;
  return null;
}

export default function ApprovalStepper({ po, reviewerName }: ApprovalStepperProps) {
  return (
    <div className="flex flex-col">
      {po.chainActors.map((actor, i) => {
        const status = po.chain[i] ?? "pending";
        const isYou = actor.name === "You";
        const isLast = i === po.chainActors.length - 1;

        return (
          <div key={i} className="relative flex items-start gap-3 pb-6 last:pb-0">
            {!isLast ? (
              <span
                className={`absolute left-[11px] top-7 bottom-[-8px] z-0 w-[2px] rounded-full ${
                  status === "done" ? "bg-good" : "bg-hair-2"
                }`}
              />
            ) : null}

            <div className={`relative z-10 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${STEP_RING[status]}`}>
              {STEP_ICON[status]}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-ink-900">{isYou ? reviewerName : actor.name}</span>
                <span className="text-xs text-muted-strong">{actor.role}</span>
                {actor.time ? <span className="ml-auto text-xs tabular-nums text-muted">{actor.time}</span> : null}
                <StepBadge status={status} action={actor.action} />
              </div>
              {actor.comment ? (
                <div className="mt-1.5 rounded-r-md border-l-[2.5px] border-hair-2 bg-surface-soft px-2.5 py-1.5 text-xs leading-relaxed text-ink-700">
                  {actor.comment}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
