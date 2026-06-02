// src/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/ui/PagePlaceholder";
import { allNav } from "@/lib/nav";
import type { DepartmentKey } from "@/types/rooms";
import DashboardPage from "@/modules/dashboard/DashboardPage";
import POLogPage from "@/modules/po-log/POLogPage.tsx";
import ApprovalsPage from "@/modules/approvals/ApprovalsPage";
import ReceivingPage from "@/modules/receiving/ReceivingPage.tsx";
import InvoicesPage from "@/modules/invoices/InvoicesPage.tsx";
import ExportsPage from "@/modules/exports/ExportsPage.tsx";
import ExceptionsPage from "@/modules/exceptions/ExceptionsPage.tsx";
import ProfitswordPage from "@/modules/profitsword/ProfitswordPage.tsx";
import VendorsPage from "@/modules/vendors/VendorsPage.tsx";
import RoomsPage from "@/modules/rooms/RoomsPage.tsx";
import SettingsPage from "@/modules/settings/SettingsPage.tsx";
import CreatePOPage from "@/modules/create-po/CreatePOPage.tsx";

/** Modules that have been migrated render their real page; the rest fall back to a placeholder. */
const moduleElements: Record<string, JSX.Element> = {
  "/dashboard": <DashboardPage />,
  "/po-log": <POLogPage />,
  "/approval": <ApprovalsPage />,
  "/receiving": <ReceivingPage />,
  "/invoices": <InvoicesPage />,
  "/exceptions": <ExceptionsPage />,
  "/exports": <ExportsPage />,
  "/profitsword": <ProfitswordPage />,
  "/vendors":     <VendorsPage />,
  "/settings":     <SettingsPage />,
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "create-po",
        element: <CreatePOPage />,
      },
      ...allNav.flatMap((item) => {
        const basePath = item.path.replace(/^\//, "");

        // Items with sub-navigation (e.g. Departments): redirect the parent
        // to the first child and render each child with its own data.
        if (item.children?.length) {
          return [
            { path: basePath, element: <Navigate to={item.children[0].path} replace /> },
            ...item.children.map((child) => ({
              path: child.path.replace(/^\//, ""),
              element: <RoomsPage department={child.path.split("/").pop() as DepartmentKey} />,
            })),
          ];
        }

        return [{
          path: basePath,
          element: moduleElements[item.path] ?? (
              <PagePlaceholder title={item.title} subtitle={item.subtitle} />
          ),
        }];
      }),
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
], {
  future: {
    v7_relativeSplatPath: true,
  },
});