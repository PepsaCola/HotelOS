import type { Invoice, InvoiceStatus } from "@/types/invoices";

export type RowTone = "crit" | "warn" | "";

/** Background tint for table rows. */
export function rowTone(status: InvoiceStatus): RowTone {
    if (status === "no-match")    return "crit";
    if (status === "over-budget") return "warn";
    if (status === "review")      return "warn";
    return "";
}

export type StatusTone = "good" | "warn" | "crit" | "indigo" | "neutral";

export interface StatusMeta {
    label: string;
    tone: StatusTone;
}

export const STATUS_META: Record<InvoiceStatus, StatusMeta> = {
    processed:    { label: "Processed",            tone: "good"    },
    ocr:          { label: "OCR in Progress",       tone: "indigo"  },
    "over-budget":{ label: "Over Budget",           tone: "warn"    },
    "no-match":   { label: "Matching PO not found", tone: "crit"    },
    review:       { label: "Needs Review",          tone: "warn"    },
};

export interface MatchDisplay {
    /** true = green check, false = red cross */
    poOk: boolean;
    linesLabel: string;
    linesOk: boolean;
}

/** Derives display values for the Matching column. Returns null when match data is absent (e.g. OCR). */
export function matchDisplay(inv: Invoice): MatchDisplay | null {
    if (!inv.match) return null;
    const { poMatched, linesMatched, linesTotal } = inv.match;
    return {
        poOk:       poMatched,
        linesLabel: `LN ${linesMatched}/${linesTotal}`,
        linesOk:    linesMatched === linesTotal,
    };
}