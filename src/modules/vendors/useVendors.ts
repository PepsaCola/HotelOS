import { useEffect, useState } from 'react';
import type { VendorsData } from '@/types/vendors';
import { fetchVendors } from '@/services/vendorsService';

interface UseVendorsResult {
    data:    VendorsData | null;
    loading: boolean;
    error:   Error | null;
}

export function useVendors(): UseVendorsResult {
    const [data,    setData]    = useState<VendorsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState<Error | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        fetchVendors(controller.signal)
            .then((d) => {
                if (!controller.signal.aborted) {
                    setData(d);
                    setError(null);
                }
            })
            .catch((e: Error) => {
                if (!controller.signal.aborted) setError(e);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, []);

    return { data, loading, error };
}