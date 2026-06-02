import { useEffect, useState } from 'react';
import type { ExportsData } from '@/types/exports';
import { fetchExports } from '@/services/exportsService';

export function useExports() {
    const [data, setData] = useState<ExportsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const ctrl = new AbortController();
        fetchExports(ctrl.signal)
            .then(setData)
            .catch((e: Error) => { if (e.name !== 'AbortError') setError(e); })
            .finally(() => setLoading(false));
        return () => ctrl.abort();
    }, []);

    return { data, loading, error };
}