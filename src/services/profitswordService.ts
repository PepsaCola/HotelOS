import type { ProfitswordData } from '@/types/profitsword';
import { PROFITSWORD_DATA } from '@/modules/profitsword/data/profitswordMock';

export async function fetchProfitsword(_signal?: AbortSignal): Promise<ProfitswordData> {
    return Promise.resolve(PROFITSWORD_DATA);
}