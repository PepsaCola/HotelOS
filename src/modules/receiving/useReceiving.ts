import { useEffect, useState } from "react";
import type { ReceivingData } from "@/types/receiving";
import { fetchReceiving } from "@/services/receivingService";

interface ReceivingState {
    data: ReceivingData | null;
    loading: boolean;
    error: Error | null;
}

export function useReceiving(): ReceivingState {
    const [state, setState] = useState<ReceivingState>({ data: null, loading: true, error: null });

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        fetchReceiving(controller.signal)
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