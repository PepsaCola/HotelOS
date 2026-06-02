import { useEffect, useState } from "react";
import type { ApprovalsData } from "@/types/approvals";
import { fetchApprovals } from "@/services/approvalsService";

interface ApprovalsState {
  data: ApprovalsData | null;
  loading: boolean;
  error: Error | null;
}

export function useApprovals(): ApprovalsState {
  const [state, setState] = useState<ApprovalsState>({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    fetchApprovals(controller.signal)
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (active) setState({ data: null, loading: false, error: error as Error });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return state;
}
