import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { SearchIcon } from "@/components/ui/icons";

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

export interface FilterOption {
    key:   string;
    label: string;
}

export interface FilterChipProps {
    label:        string;
    displayValue: string;
    active?:      boolean;
    options:      FilterOption[];
    selected:     string;
    onSelect:     (v: string) => void;
    dropMaxH?:    string;
    searchable?:  boolean;
}

// ── FilterChip ────────────────────────────────────────────────────────────────

export function FilterChip({
                               label,
                               displayValue,
                               active = false,
                               options,
                               selected,
                               onSelect,
                               dropMaxH  = "max-h-[220px]",
                               searchable = false,
                           }: FilterChipProps) {
    const [open,   setOpen]   = useState(false);
    const [pos,    setPos]    = useState({ top: 0, left: 0 });
    const [search, setSearch] = useState("");

    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropRef    = useRef<HTMLDivElement>(null);
    const searchRef  = useRef<HTMLInputElement>(null);

    const calcPos = () => {
        if (!triggerRef.current) return;
        const r     = triggerRef.current.getBoundingClientRect();
        const dropW = 200;
        const left  = r.left + dropW > window.innerWidth ? r.right - dropW : r.left;
        setPos({ top: r.bottom + 6, left });
    };

    const handleToggle = () => {
        if (!open) calcPos();
        setOpen(o => !o);
    };

    // Очистити пошук при закритті; фокус на інпут при відкритті
    useEffect(() => {
        if (!open) {
            setSearch("");
        } else if (searchable) {
            const t = setTimeout(() => searchRef.current?.focus(), 30);
            return () => clearTimeout(t);
        }
    }, [open, searchable]);

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

    // Scroll / resize → перерахувати позицію
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

    const filteredOptions = useMemo(() => {
        if (!search.trim()) return options;
        const q = search.toLowerCase();
        return options.filter(o => o.label.toLowerCase().includes(q));
    }, [options, search]);

    const isActive = active || open;

    return (
        <div className="relative shrink-0">
            <button
                ref={triggerRef}
                type="button"
                onClick={handleToggle}
                aria-expanded={open}
                aria-haspopup="listbox"
                className={[
                    "inline-flex h-8 select-none items-center gap-1.5 rounded-lg border px-3",
                    "text-[13px] font-medium whitespace-nowrap transition-colors",
                    isActive
                        ? "border-accent bg-accent-soft text-accent-ink"
                        : "border-hair-2 bg-white text-ink-700 hover:bg-surface-soft",
                ].join(" ")}
            >
                <span className={isActive ? "text-accent-ink/60" : "text-muted-strong"}>
                    {label}:
                </span>
                <span className="max-w-[120px] truncate font-semibold">{displayValue}</span>
                <ChevronDown className={[
                    "h-3 w-3 shrink-0 transition-transform duration-150",
                    isActive ? "text-accent-ink/60" : "text-muted-strong",
                    open ? "rotate-180" : "",
                ].join(" ")} />
            </button>

            {open && createPortal(
                <div
                    ref={dropRef}
                    role="listbox"
                    style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999 }}
                    className={[
                        "animate-slide-up flex flex-col rounded-[12px] border border-hair-2",
                        "bg-white shadow-[0_8px_32px_rgba(12,19,32,0.12),0_2px_6px_rgba(12,19,32,0.06)]",
                        "min-w-[200px]",
                    ].join(" ")}
                >
                    {searchable && (
                        <div className="relative flex-none border-b border-hair-2 px-3 py-2.5">
                            <SearchIcon className="pointer-events-none absolute left-[22px] top-1/2 h-[13px] w-[13px] -translate-y-1/2 text-muted" />
                            <input
                                ref={searchRef}
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search…"
                                className="h-7 w-full rounded-md border border-page-border bg-surface-soft pl-[26px] pr-2.5 text-[12.5px] text-ink outline-none placeholder:text-muted focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent/20"
                            />
                        </div>
                    )}

                    <div className={`overflow-y-auto py-1 ${dropMaxH}`}>
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-3 text-center text-[12.5px] text-muted-strong">
                                No results
                            </div>
                        ) : (
                            filteredOptions.map(opt => {
                                const isSel = opt.key === selected;
                                return (
                                    <button
                                        key={opt.key}
                                        role="option"
                                        aria-selected={isSel}
                                        type="button"
                                        onClick={() => { onSelect(opt.key); setOpen(false); }}
                                        className={[
                                            "flex w-full items-center justify-between gap-4",
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
                            })
                        )}
                    </div>
                </div>,
                document.body,
            )}
        </div>
    );
}