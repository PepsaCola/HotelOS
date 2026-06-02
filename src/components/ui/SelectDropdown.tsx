import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// ── Icons ─────────────────────────────────────────────────────────────────────

function ChevronDown({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}

function CheckMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SelectOption {
    key: string;
    label: string;
}

export interface SelectDropdownProps {
    value:     string;
    onChange:  (v: string) => void;
    options:   SelectOption[];
    /** Extra classes on the wrapper div (e.g. width) */
    className?: string;
    /** Pixel height cap for the dropdown list. Default 260. */
    maxHeight?: number;
}

// ── SelectDropdown ─────────────────────────────────────────────────────────────

export function SelectDropdown({
    value,
    onChange,
    options,
    className = "",
    maxHeight = 260,
}: SelectDropdownProps) {
    const [open, setOpen] = useState(false);
    const [pos,  setPos]  = useState({ top: 0, left: 0, width: 0 });

    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropRef    = useRef<HTMLDivElement>(null);

    const calcPos = () => {
        if (!triggerRef.current) return;
        const r = triggerRef.current.getBoundingClientRect();
        setPos({ top: r.bottom + 4, left: r.left, width: r.width });
    };

    const handleToggle = () => {
        if (!open) calcPos();
        setOpen(o => !o);
    };

    // Click outside → close
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            const t = e.target as Node;
            if (!triggerRef.current?.contains(t) && !dropRef.current?.contains(t)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    // Escape → close
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open]);

    // Scroll / resize → оновити позицію
    useEffect(() => {
        if (!open) return;
        const handler = () => calcPos();
        window.addEventListener("scroll", handler, true);
        window.addEventListener("resize", handler);
        return () => {
            window.removeEventListener("scroll", handler, true);
            window.removeEventListener("resize", handler);
        };
    }, [open]);

    const selectedLabel = options.find(o => o.key === value)?.label ?? value;

    return (
        <div className={`relative ${className}`}>
            <button
                ref={triggerRef}
                type="button"
                onClick={handleToggle}
                aria-expanded={open}
                aria-haspopup="listbox"
                className={[
                    "inline-flex h-[34px] w-full items-center justify-between gap-2 rounded-lg border px-2.5",
                    "text-[12.5px] sm:text-[13px] font-medium whitespace-nowrap transition-colors select-none",
                    open
                        ? "border-accent bg-accent-soft text-accent-ink"
                        : "border-hair-2 bg-white text-ink-700 hover:bg-surface-soft",
                ].join(" ")}
            >
                <span className="truncate">{selectedLabel}</span>
                <ChevronDown className={[
                    "h-3.5 w-3.5 shrink-0 transition-transform duration-150",
                    open ? "rotate-180 text-accent-ink/60" : "text-muted-strong",
                ].join(" ")} />
            </button>

            {open && createPortal(
                <div
                    ref={dropRef}
                    role="listbox"
                    style={{
                        position:  "fixed",
                        top:       pos.top,
                        left:      pos.left,
                        minWidth:  pos.width,
                        maxHeight,
                        zIndex:    9999,
                    }}
                    className="animate-slide-up overflow-y-auto overflow-x-hidden rounded-[12px] border border-hair-2 bg-white py-1 shadow-[0_8px_32px_rgba(12,19,32,0.12),0_2px_6px_rgba(12,19,32,0.06)]"
                >
                    {options.map(opt => {
                        const isSel = opt.key === value;
                        return (
                            <button
                                key={opt.key}
                                role="option"
                                aria-selected={isSel}
                                type="button"
                                onClick={() => { onChange(opt.key); setOpen(false); }}
                                className={[
                                    "flex w-full items-center justify-between gap-6",
                                    "px-3.5 py-[7px] text-left text-[13px] transition-colors",
                                    isSel
                                        ? "bg-accent-soft/50 font-semibold text-accent-ink"
                                        : "font-medium text-ink-700 hover:bg-surface-soft",
                                ].join(" ")}
                            >
                                <span>{opt.label}</span>
                                {isSel && <CheckMark className="h-3.5 w-3.5 shrink-0 text-accent" />}
                            </button>
                        );
                    })}
                </div>,
                document.body,
            )}
        </div>
    );
}
