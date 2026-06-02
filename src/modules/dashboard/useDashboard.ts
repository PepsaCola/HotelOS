import { useEffect, useState } from "react";
import type { DashboardData } from "@/types/dashboard";
import { fetchDashboard } from "@/services/dashboardService";

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: Error | null;
}

/** Loads dashboard data through the service layer and tracks request state. */
export function useDashboard(): DashboardState {
  const [state, setState] = useState<DashboardState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    fetchDashboard(controller.signal)
      .then((data) => {
        if (active) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setState({ data: null, loading: false, error: error as Error });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return state;
}
