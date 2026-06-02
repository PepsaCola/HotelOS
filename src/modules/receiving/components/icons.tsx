import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

export function DocIcon(props: P) {
    return (
        <svg viewBox="0 0 24 24" fill="none" width={15} height={15} aria-hidden="true" {...props}>
            <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function InvoiceIcon(props: P) {
    return (
        <svg viewBox="0 0 24 24" fill="none" width={22} height={22} aria-hidden="true" {...props}>
            <rect x="5" y="3.5" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8.5 8h7M8.5 12h7M8.5 16h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

export function NoteLinesIcon(props: P) {
    return (
        <svg viewBox="0 0 24 24" fill="none" width={14} height={14} aria-hidden="true" {...props}>
            <path d="M4 5h16M4 10h16M4 15h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}