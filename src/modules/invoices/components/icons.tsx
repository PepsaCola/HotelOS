import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

export function RefreshIcon(props: P) {
    return (
        <svg viewBox="0 0 24 24" fill="none" width={15} height={15} aria-hidden="true" {...props}>
            <path
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/** Checkmark used in the Matching column for a successful PO/line match. */
export function MatchOkIcon(props: P) {
    return (
        <svg viewBox="0 0 24 24" fill="none" width={12} height={12} aria-hidden="true" {...props}>
            <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/** Cross used in the Matching column for a failed PO/line match. */
export function MatchFailIcon(props: P) {
    return (
        <svg viewBox="0 0 24 24" fill="none" width={12} height={12} aria-hidden="true" {...props}>
            <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}