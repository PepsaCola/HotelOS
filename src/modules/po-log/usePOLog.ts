import { useEffect, useState } from "react";
import type { POLogData } from "@/types/poLog";
import { fetchPOLog } from "@/services/poLogService";

interface POLogState {
  data: POLogData | null;
  loading: boolean;
  error: Error | null;
}

export function usePOLog(): POLogState {
  const [state, setState] = useState<POLogState>({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    fetchPOLog(controller.signal)
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
