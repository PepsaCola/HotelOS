import { useEffect } from "react";

export type ToastType = "good" | "warn" | "crit";

interface ToastProps {
    message: string;
    type: ToastType;
    onDismiss: () => void;
}

const STYLES: Record<ToastType, string> = {
    good: "bg-good-bg border-good/30 text-good",
    warn: "bg-warn-soft border-warn/30 text-warn",
    crit: "bg-crit-soft border-crit/30 text-crit",
};

export function Toast({ message, type, onDismiss }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3500);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className="fixed bottom-7 right-7 z-[400] max-w-[340px] animate-[slidein_.2s_ease]">
            <div
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,.12)] text-[13.5px] font-semibold leading-snug ${STYLES[type]}`}
            >
                <span className="flex-1">{message}</span>
                <button
                    onClick={onDismiss}
                    className="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-base leading-none mt-0.5"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}