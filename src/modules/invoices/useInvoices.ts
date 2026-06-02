import { useEffect, useState } from "react";
import type { InvoicesData } from "@/types/invoices";
import { fetchInvoices } from "@/services/invoicesService";

interface InvoicesState {
    data: InvoicesData | null;
    loading: boolean;
    error: Error | null;
}

export function useInvoices(): InvoicesState {
    const [state, setState] = useState<InvoicesState>({ data: null, loading: true, error: null });

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        fetchInvoices(controller.signal)
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