import type { AuditEventType, PurchaseApproval } from "@/types/approvals";
import { SECTION_HEAD } from "./DetailTab";
import { ChangesIcon, CheckIcon, ClockIcon, CloseIcon, CreateDocIcon, SubmitIcon } from "./icons";

interface AuditTabProps {
  po: PurchaseApproval;
}

const AUDIT_ICON: Record<AuditEventType, JSX.Element> = {
  create: <CreateDocIcon className="h-3.5 w-3.5" />,
  submit: <SubmitIcon className="h-3.5 w-3.5" />,
  approve: <CheckIcon className="h-3.5 w-3.5" />,
  reject: <CloseIcon className="h-3.5 w-3.5" />,
  changes: <ChangesIcon className="h-3.5 w-3.5" />,
  current: <ClockIcon className="h-3.5 w-3.5" />,
};

const AUDIT_DOT: Record<AuditEventType, string> = {
  create: "bg-surface-chip text-muted-strong",
  submit: "bg-accent-soft text-accent-ink",
  approve: "bg-good-bg text-good",
  reject: "bg-crit-bg text-crit",
  changes: "bg-warn-bg text-warn",
  current: "bg-accent text-white",
};

export default function AuditTab({ po }: AuditTabProps) {
  return (
    <div>
      <div className={SECTION_HEAD}>Audit Trail</div>
      <div className="flex flex-col">
        {po.audit.map((ev, i) => {
          const isLast = i === po.audit.length - 1;
          return (
            <div className="relative flex gap-3" key={i}>
              {!isLast ? <span className="absolute left-3.5 top-8 bottom-[-4px] z-0 w-px bg-hair-2" /> : null}
              <div className={`relative z-10 mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full ${AUDIT_DOT[ev.type]}`}>
                {AUDIT_ICON[ev.type]}
              </div>
              <div className="flex-1 pb-5">
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-semibold text-ink-900">{ev.who}</span>
                    <span className="ml-1 text-xs text-muted-strong">— {ev.role}</span>
                  </div>
                  <span className="text-[11.5px] tabular-nums text-muted">{ev.when}</span>
                </div>
                <div className="text-[12.5px] leading-relaxed text-ink-700">{ev.desc}</div>
                {ev.comment ? (
                  <div className="mt-2 rounded-r-md border-l-[2.5px] border-hair-2 bg-surface-soft px-2.5 py-1.5 text-xs italic leading-relaxed text-ink-700">
                    “{ev.comment}”
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
