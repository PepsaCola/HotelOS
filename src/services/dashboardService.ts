import type { DashboardData } from "@/types/dashboard";
import { dashboardMock } from "@/modules/dashboard/data/dashboardMock";

/**
 * Data-access seam for the Dashboard.
 *
 * Today it resolves bundled mock data. To wire a real backend, replace the body
 * with a `fetch` (or generated API client) call that returns the same
 * `DashboardData` shape — no component changes required.
 *
 *   const res = await fetch("/api/dashboard", { signal });
 *   if (!res.ok) throw new Error(`Dashboard request failed: ${res.status}`);
 *   return (await res.json()) as DashboardData;
 */
export async function fetchDashboard(_signal?: AbortSignal): Promise<DashboardData> {
  return dashboardMock;
}
