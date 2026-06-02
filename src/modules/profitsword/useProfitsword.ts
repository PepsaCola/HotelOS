import { useEffect, useState } from 'react';
import type { ProfitswordData } from '@/types/profitsword';
import { fetchProfitsword } from '@/services/profitswordService';

interface UseProfitswordResult {
    data: ProfitswordData | null;
    loading: boolean;
    error: Error | null;
}

export function useProfitsword(): UseProfitswordResult {
    const [data, setData] = useState<ProfitswordData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        fetchProfitsword(controller.signal)
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