import { useState, useEffect } from "react";
import type { ExceptionsData } from "@/types/exceptions";
import { getExceptionsMock } from "./data/exceptionsMock";

export function useExceptions() {
    const [data, setData] = useState<ExceptionsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Симуляція завантаження з API
        const timer = setTimeout(() => {
            try {
                const mockData = getExceptionsMock();
                setData(mockData);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Failed to load exceptions"));
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    return { data, loading, error };
}