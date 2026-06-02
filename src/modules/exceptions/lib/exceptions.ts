import type { Exception, ExceptionType, ExceptionSeverity, ExceptionStatus, ResolutionType } from "@/types/exceptions";

export type RowTone = "crit" | "warn" | "";

export function rowTone(severity: ExceptionSeverity): RowTone {
    if (severity === "crit") return "crit";
    if (severity === "warn") return "warn";
    return "";
}

export type StatusTone = "good" | "warn" | "crit" | "indigo" | "neutral";

export interface StatusMeta {
    label: string;
    tone: StatusTone;
}

export const STATUS_META: Record<ExceptionStatus, StatusMeta> = {
    open:       { label: "Open",                 tone: "crit"    },
    resolved:   { label: "Resolved",             tone: "good"    },
    rejected:   { label: "Rejected",             tone: "crit"    },
    correction: { label: "Correction Requested", tone: "warn"    },
};

export const EXCEPTION_TYPE_META: Record<ExceptionType, { label: string; tone: StatusTone }> = {
    over_budget: { label: "Over Budget",   tone: "crit" },
    no_po:       { label: "No PO Match",   tone: "crit" },
    mismatch:    { label: "Line Mismatch", tone: "warn" },
};

export const RESOLUTION_TYPE_META: Record<ResolutionType, { label: string; cssClass: string }> = {
    override:           { label: "Override Approved",   cssClass: "override"           },
    po_linked:          { label: "PO Linked & Matched", cssClass: "po_linked"          },
    mismatch_corrected: { label: "Lines Corrected",     cssClass: "mismatch_corrected" },
};

export function deptDisplay(dept: string): { name: string; color: string } {
    const DEPTS: Record<string, { name: string; color: string }> = {
        "Rooms":       { name: "Rooms",        color: "#4a78f0" },
        "F&B":         { name: "F&B",          color: "#e88a3c" },
        "Engineering": { name: "Engineering",  color: "#38a169" },
        "Admin":       { name: "Admin",        color: "#7a6df0" },
        "Sales & Mktg":{ name: "Sales & Mktg", color: "#c7458a" },
        "Spa & Maint.":{ name: "Spa & Maint.", color: "#119da4" },
    };
    return DEPTS[dept] ?? { name: dept, color: "#6b7079" };
}

export function groupResolvedByType(exceptions: Exception[]): Record<ResolutionType, Exception[]> {
    return {
        override:           exceptions.filter((e) => e.resolutionType === "override"),
        po_linked:          exceptions.filter((e) => e.resolutionType === "po_linked"),
        mismatch_corrected: exceptions.filter((e) => e.resolutionType === "mismatch_corrected"),
    };
}

/** "all" = все крім resolved; решта tabs по type або status */
export function getExceptionsByTab(exceptions: Exception[], tab: string): Exception[] {
    if (tab === "all")        return exceptions.filter((e) => e.status !== "resolved");
    if (tab === "resolved")   return exceptions.filter((e) => e.status === "resolved");
    if (tab === "rejected")   return exceptions.filter((e) => e.status === "rejected");
    if (tab === "over_budget") return exceptions.filter((e) => e.type === "over_budget" && e.status !== "resolved");
    if (tab === "no_po")      return exceptions.filter((e) => e.type === "no_po"       && e.status !== "resolved");
    if (tab === "mismatch")   return exceptions.filter((e) => e.type === "mismatch"    && e.status !== "resolved");
    return [];
}