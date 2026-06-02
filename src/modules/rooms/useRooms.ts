import { useEffect, useState } from 'react';
import type { DepartmentKey, RoomsData } from '@/types/rooms';
import { fetchRoomsData } from '@/services/roomsService';

interface State {
    data:    RoomsData | null;
    loading: boolean;
    error:   Error | null;
}

export function useRooms(department: DepartmentKey = 'rooms'): State {
    const [state, setState] = useState<State>({ data: null, loading: true, error: null });

    useEffect(() => {
        const ctrl = new AbortController();
        setState({ data: null, loading: true, error: null });

        fetchRoomsData(department, ctrl.signal)
            .then(data => setState({ data, loading: false, error: null }))
            .catch(err => {
                if (err.name !== 'AbortError') setState({ data: null, loading: false, error: err });
            });

        return () => ctrl.abort();
    }, [department]);

    return state;
}