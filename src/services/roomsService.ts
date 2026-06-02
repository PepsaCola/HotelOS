import type { DepartmentKey, RoomsData } from '@/types/rooms';
import { DEPARTMENTS_MOCK } from '@/modules/rooms/data/departmentsMock';

export async function fetchRoomsData(department: DepartmentKey = 'rooms', signal?: AbortSignal): Promise<RoomsData> {
    await new Promise<void>((resolve, reject) => {
        const t = setTimeout(resolve, 300);
        signal?.addEventListener('abort', () => { clearTimeout(t); reject(new DOMException('Aborted', 'AbortError')); });
    });
    return DEPARTMENTS_MOCK[department];
}
