import type { ComponentType, SVGProps } from "react";
import {
  ApprovalIcon,
  DashboardIcon,
  DepartmentsIcon,
  ExceptionsIcon,
  ExportsIcon,
  InvoicesIcon,
  POLogIcon,
  ProfitswordIcon,
  ReceivingIcon,
  SettingsIcon,
  VendorsIcon,
} from "@/components/ui/icons";

export interface NavSubItem {
  path: string;
  label: string;
  /** Page title shown in the topbar breadcrumb. */
  title: string;
  /** Short subtitle describing the sub-page. */
  subtitle: string;
}

export interface NavItem {
  path: string;
  label: string;
  /** Page title shown in the topbar breadcrumb. */
  title: string;
  /** Short subtitle describing the module. */
  subtitle: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Optional expandable sub-navigation (e.g. one page per department). */
  children?: NavSubItem[];
}

export const primaryNav: NavItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    title: "Dashboard",
    subtitle: "Daily visibility across approvals, budgets, and receiving.",
    icon: DashboardIcon,
  },
  {
    path: "/po-log",
    label: "PO Log",
    title: "Purchase Order Log",
    subtitle: "Track the queue, monitor risk, and review purchase order activity.",
    icon: POLogIcon,
  },
  {
    path: "/approval",
    label: "Approval",
    title: "Approvals",
    subtitle: "Review pending purchase orders and act on the approval chain.",
    icon: ApprovalIcon,
  },
  {
    path: "/receiving",
    label: "Receiving",
    title: "Receiving",
    subtitle: "Monitor PO fulfillment, remaining lines, and delivery status.",
    icon: ReceivingIcon,
  },
  {
    path: "/invoices",
    label: "Invoices",
    title: "Invoices",
    subtitle: "Receive, extract, match, approve, and stage invoices for export.",
    icon: InvoicesIcon,
  },
  {
    path: "/exceptions",
    label: "Exceptions",
    title: "Exceptions",
    subtitle: "Investigate invoice and purchasing issues and resolve them.",
    icon: ExceptionsIcon,
  },
  {
    path: "/exports",
    label: "Exports / M3",
    title: "Exports / M3",
    subtitle: "Control the export pipeline from HotelOS to the M3 ERP.",
    icon: ExportsIcon,
  },
  {
    path: "/profitsword",
    label: "Profitsword",
    title: "Profitsword Imports",
    subtitle: "Import, validate, and audit budget & forecast files.",
    icon: ProfitswordIcon,
  },
  {
    path: "/vendors",
    label: "Vendors / Contracts",
    title: "Vendors & Contracts",
    subtitle: "Manage vendor details, contracts, and supplier information.",
    icon: VendorsIcon,
  },
  {
    path: "/departments",
    label: "Departments",
    title: "Departments",
    subtitle: "Review department budgets and account-level performance.",
    icon: DepartmentsIcon,
    children: [
      { path: "/departments/rooms", label: "Rooms Department", title: "Rooms Department", subtitle: "Room operating expenses by A/C line." },
      { path: "/departments/fb",    label: "F&B Department",   title: "F&B Department",   subtitle: "Food & beverage operating expenses by A/C line." },
      { path: "/departments/ag",    label: "A&G Department",   title: "A&G Department",   subtitle: "Administrative & general expenses by A/C line." },
      { path: "/departments/it",    label: "IT Department",    title: "IT Department",    subtitle: "Information technology expenses by A/C line." },
      { path: "/departments/sm",    label: "S&M Department",   title: "S&M Department",   subtitle: "Sales & marketing expenses by A/C line." },
      { path: "/departments/rm",    label: "R&M Department",   title: "R&M Department",   subtitle: "Repairs & maintenance expenses by A/C line." },
    ],
  },
];

export const secondaryNav: NavItem[] = [
  {
    path: "/settings",
    label: "Account Settings",
    title: "Account Settings",
    subtitle: "Manage profile, permissions, accounting structure, and integrations.",
    icon: SettingsIcon,
  },
];

export const allNav: NavItem[] = [...primaryNav, ...secondaryNav];

export function findNavByPath(pathname: string): NavItem | undefined {
  for (const item of allNav) {
    const child = item.children?.find((c) => pathname.startsWith(c.path));
    if (child) return { ...item, title: child.title, subtitle: child.subtitle };
    if (pathname.startsWith(item.path)) return item;
  }
  return undefined;
}

/** A single breadcrumb segment shown in the topbar. */
export interface Crumb {
  label: string;
  /** Route to navigate to when clicked (intermediate crumbs). */
  to?: string;
  /** In-page action (e.g. close a detail view) when there is no route. */
  onClick?: () => void;
}

/** Default breadcrumb trail derived from the current route. */
export function breadcrumbForPath(pathname: string): Crumb[] {
  if (pathname.startsWith("/create-po")) {
    return [{ label: "PO Log", to: "/po-log" }, { label: "New Purchase Order" }];
  }
  for (const item of allNav) {
    const child = item.children?.find((c) => pathname.startsWith(c.path));
    if (child) return [{ label: item.label, to: item.path }, { label: child.title }];
    if (pathname.startsWith(item.path)) return [{ label: item.title }];
  }
  return [{ label: "HotelOS" }];
}
