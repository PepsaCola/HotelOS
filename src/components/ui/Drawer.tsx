import { useEffect, type ReactNode } from "react";
import { CloseIcon } from "./icons";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Panel width on desktop; full-width below sm. */
  widthClass?: string;
  label?: string;
}

/** Right-side slide-over panel with a dimmed backdrop. Shared across modules. */
export function Drawer({ open, onClose, children, widthClass = "sm:w-[540px]", label }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={label}>
      <div className="absolute inset-0 animate-fade-in bg-[#0c1320]/35" onClick={onClose} />
      <div
        className={`absolute inset-y-0 right-0 flex w-full ${widthClass} animate-slide-in-right flex-col gap-[18px] overflow-auto bg-white p-6 shadow-[-12px_0_40px_rgba(0,0,0,0.18)]`}
      >
        <button
          type="button"
          aria-label="Close panel"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 grid h-8 w-8 place-items-center rounded-md text-muted-strong hover:bg-surface-muted hover:text-ink-900"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
