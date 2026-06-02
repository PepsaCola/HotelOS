import type { ExportsData } from '@/types/exports';
import { EXPORTS_DATA } from '@/modules/exports/data/exportsMock';

// Swap the body of this function to call a real API endpoint.
export async function fetchExports(_signal?: AbortSignal): Promise<ExportsData> {
    return Promise.resolve(EXPORTS_DATA);
}