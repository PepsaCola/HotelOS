import type { Toast, ToastTone } from "../useToasts";
import { AlertIcon, CheckIcon } from "./icons";

interface ToastsProps {
  toasts: Toast[];
}

const TONE_CLASS: Record<ToastTone, string> = {
  good: "border-good-bg text-good",
  warn: "border-warn-bg text-warn",
  crit: "border-crit-bg text-crit",
  neutral: "border-hair-2 text-ink-900",
};

export function Toasts({ toasts }: ToastsProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex animate-slide-up items-center gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-[13px] font-medium shadow-[0_8px_24px_rgba(12,19,32,0.16)] ${TONE_CLASS[toast.tone]}`}
        >
          {toast.tone === "good" ? <CheckIcon className="h-4 w-4" /> : <AlertIcon className="h-4 w-4" />}
          {toast.text}
        </div>
      ))}
    </div>
  );
}
