import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </Base>
  );
}

export function POLogIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </Base>
  );
}

export function ApprovalIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 12l2 2 4-4" />
      <path d="M20.6 6A12 12 0 0 1 12 3 12 12 0 0 1 3.4 6 12 12 0 0 0 3 9c0 5.6 3.8 10.3 9 11.6C17.2 19.3 21 14.6 21 9c0-1.1-.2-2.1-.4-3z" />
    </Base>
  );
}

export function ReceivingIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 7l9-4 9 4-9 4-9-4Z" />
      <path d="M3 12l9 4 9-4M3 17l9 4 9-4" />
    </Base>
  );
}

export function InvoicesIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </Base>
  );
}

export function InvoiceMappingIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="4" width="7" height="6" rx="1.5" />
      <rect x="14" y="14" width="7" height="6" rx="1.5" />
      <path d="M10 7h3a4 4 0 0 1 4 4v3" />
    </Base>
  );
}

export function ExceptionsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </Base>
  );
}

export function ExportsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 4v12m0-12l-4 4m4-4l4 4" />
      <path d="M5 18v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" />
    </Base>
  );
}

export function ProfitswordIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" />
      <circle cx="8" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="10" cy="18" r="1.4" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function VendorsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="4" width="8" height="7" rx="1.5" />
      <rect x="13" y="4" width="8" height="7" rx="1.5" />
      <rect x="3" y="13" width="8" height="7" rx="1.5" />
      <rect x="13" y="13" width="8" height="7" rx="1.5" />
    </Base>
  );
}

export function DepartmentsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 21V8l9-5 9 5v13" />
      <path d="M9 21v-6h6v6M9 11h.01M15 11h.01" />
    </Base>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.7a7.5 7.5 0 0 0 0-3.4l2-1.6-2-3.5-2.4.7a7.5 7.5 0 0 0-3-1.7L13.5 2h-3l-.5 2.2a7.5 7.5 0 0 0-3 1.7l-2.4-.7-2 3.5 2 1.6a7.5 7.5 0 0 0 0 3.4l-2 1.6 2 3.5 2.4-.7c.9.7 1.9 1.3 3 1.7l.5 2.2h3l.5-2.2c1.1-.4 2.1-1 3-1.7l2.4.7 2-3.5-2-1.6Z" />
    </Base>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 5v14M5 12h14" strokeWidth={2} />
    </Base>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Base>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16Z" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </Base>
  );
}

export function HelpIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.35-1.1.9-1.1 1.6V14M12 17.5h.01" />
    </Base>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 17l-5-5 5-5M5 12h12" />
    </Base>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </Base>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Base>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </Base>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 5h16l-6 8v6l-4-2v-4L4 5Z" />
    </Base>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 4v12m0 0l-4-4m4 4l4-4" />
      <path d="M5 18v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" />
    </Base>
  );
}

export function TrendUpIcon(props: IconProps) {
  return (
    <Base strokeWidth={1.8} {...props}>
      <path d="M5 15l5-5 4 4 6-7" />
      <path d="M14 7h6v6" />
    </Base>
  );
}

export function TrendDownIcon(props: IconProps) {
  return (
    <Base strokeWidth={1.8} {...props}>
      <path d="M5 9l5 5 4-4 6 7" />
      <path d="M14 17h6v-6" />
    </Base>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M15 6l-6 6 6 6" />
    </Base>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 6l6 6-6 6" />
    </Base>
  );
}
export function ArrowRightIcon(props: IconProps) {
    return (
        <Base {...props}>
            <path d="M5 12h14m-4-4 4 4-4 4" />
        </Base>
    );
}
