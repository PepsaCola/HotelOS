import { useState } from "react";
import type { ActionType, PurchaseApproval } from "@/types/approvals";
import { actionConfig } from "../lib/workflow";
import { CheckIcon, ChangesIcon, CloseIcon } from "./icons";

interface ActionSheetProps {
  type: ActionType;
  po: PurchaseApproval;
  onConfirm: (type: ActionType, comment: string) => void;
  onCancel: () => void;
}

const ICON: Record<ActionType, JSX.Element> = {
  approve: <CheckIcon className="h-3.5 w-3.5" />,
  changes: <ChangesIcon className="h-3.5 w-3.5" />,
  reject: <CloseIcon className="h-3.5 w-3.5" />,
};

const ICON_CHIP: Record<ActionType, string> = {
  approve: "bg-good-bg text-good",
  changes: "bg-warn-bg text-warn",
  reject: "bg-crit-bg text-crit",
};

const CONFIRM_BTN: Record<ActionType, string> = {
  approve: "bg-good text-white border-transparent hover:bg-[#0f5a37]",
  changes: "bg-white border-hair-2 text-ink-700 hover:bg-surface-soft",
  reject: "bg-white border-crit-bg text-crit hover:bg-crit-soft",
};

export default function ActionSheet({ type, po, onConfirm, onCancel }: ActionSheetProps) {
  const [comment, setComment] = useState("");
  const [err, setErr] = useState(false);
  const cfg = actionConfig(type, po);

  function handleConfirm() {
    if (cfg.required && !comment.trim()) {
      setErr(true);
      return;
    }
    onConfirm(type, comment);
  }

  return (
    <div className="animate-slide-up border-t border-hair-2 bg-white p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className={`grid h-7 w-7 place-items-center rounded-md ${ICON_CHIP[type]}`}>{ICON[type]}</div>
        <div className="text-sm font-bold text-ink-900">{cfg.title}</div>
      </div>

      <div className={`mb-3 text-[12.5px] ${cfg.required ? "font-medium text-crit" : "text-muted-strong"}`}>
        {cfg.required ? "⚠ Required — " : ""}
        {cfg.hint}
      </div>

      <textarea
        className={`h-20 w-full resize-none rounded-lg border p-2.5 text-sm text-ink-900 outline-none transition-all ${
          err ? "border-crit ring-4 ring-crit-soft" : "border-hair-2 focus:border-accent focus:ring-4 focus:ring-accent-soft"
        }`}
        placeholder={cfg.placeholder}
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          if (err) setErr(false);
        }}
      />

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className={`h-9 flex-1 rounded-lg border text-sm font-semibold transition-colors ${CONFIRM_BTN[type]}`}
          onClick={handleConfirm}
        >
          {cfg.btnLabel}
        </button>
        <button
          type="button"
          className="h-9 rounded-lg px-4 text-sm font-medium text-muted-strong transition-colors hover:bg-surface-muted hover:text-ink-900"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
