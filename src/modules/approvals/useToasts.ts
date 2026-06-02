import { useCallback, useEffect, useRef, useState } from "react";

export type ToastTone = "good" | "warn" | "crit" | "neutral";

export interface Toast {
  id: number;
  text: string;
  tone: ToastTone;
}

/** Transient, auto-dismissing notifications. */
export function useToasts(timeout = 3000) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const push = useCallback(
    (text: string, tone: ToastTone = "neutral") => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, text, tone }]);
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, timeout);
      timers.current.push(timer);
    },
    [timeout],
  );

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return { toasts, push };
}
