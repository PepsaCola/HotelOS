import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Crumb } from "@/lib/nav";

export type Density = "comfortable" | "compact";

/** Generic display options shared across data pages (driven by the Display Options popup). */
export interface DisplayOptions {
    density: Density;
    showKpiStrip: boolean;
    financialEmphasis: boolean;
}

export const DEFAULT_DISPLAY_OPTIONS: DisplayOptions = {
    density: "comfortable",
    showKpiStrip: true,
    financialEmphasis: true,
};

type Ctx = {
    fullBleed: boolean;
    setFullBleed: (v: boolean) => void;
    displayOptionsOpen: boolean;
    openDisplayOptions: () => void;
    closeDisplayOptions: () => void;
    /** Breadcrumb override published by detail views; null falls back to the route default. */
    breadcrumb: Crumb[] | null;
    setBreadcrumb: (c: Crumb[] | null) => void;
    /** Generic display options (density / KPI strip / financial emphasis). */
    displayOptions: DisplayOptions;
    setDisplayOption: <K extends keyof DisplayOptions>(key: K, value: DisplayOptions[K]) => void;
    resetDisplayOptions: () => void;
    /** PO Log totals bar visibility — controlled by the sidebar toggle and PO Log's own popup. */
    showTotalsBar: boolean;
    setShowTotalsBar: (v: boolean) => void;
};

const LayoutContext = createContext<Ctx>({
    fullBleed: false,
    setFullBleed: () => {},
    displayOptionsOpen: false,
    openDisplayOptions: () => {},
    closeDisplayOptions: () => {},
    breadcrumb: null,
    setBreadcrumb: () => {},
    displayOptions: DEFAULT_DISPLAY_OPTIONS,
    setDisplayOption: () => {},
    resetDisplayOptions: () => {},
    showTotalsBar: true,
    setShowTotalsBar: () => {},
});

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const [fullBleed, setFullBleed] = useState(false);
    const [displayOptionsOpen, setDisplayOptionsOpen] = useState(false);
    const [breadcrumb, setBreadcrumb] = useState<Crumb[] | null>(null);
    const [displayOptions, setDisplayOptions] = useState<DisplayOptions>(DEFAULT_DISPLAY_OPTIONS);
    const [showTotalsBar, setShowTotalsBar] = useState(true);

    const value = useMemo<Ctx>(
        () => ({
            fullBleed,
            setFullBleed,
            displayOptionsOpen,
            openDisplayOptions: () => setDisplayOptionsOpen(true),
            closeDisplayOptions: () => setDisplayOptionsOpen(false),
            breadcrumb,
            setBreadcrumb,
            displayOptions,
            setDisplayOption: (key, value) => setDisplayOptions((prev) => ({ ...prev, [key]: value })),
            resetDisplayOptions: () => setDisplayOptions(DEFAULT_DISPLAY_OPTIONS),
            showTotalsBar,
            setShowTotalsBar,
        }),
        [fullBleed, displayOptionsOpen, breadcrumb, displayOptions, showTotalsBar],
    );

    return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export const useLayout = () => useContext(LayoutContext);

/**
 * Publish a breadcrumb trail to the topbar for as long as the calling component
 * is mounted. Pass null to fall back to the route-derived default.
 */
export function useBreadcrumb(crumbs: Crumb[] | null) {
    const { setBreadcrumb } = useLayout();
    const key = crumbs ? crumbs.map((c) => `${c.label}|${c.to ?? ""}`).join(" › ") : "";

    useEffect(() => {
        setBreadcrumb(crumbs);
        return () => setBreadcrumb(null);
        // Re-publish only when the visible trail changes; handlers are stable.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);
}
