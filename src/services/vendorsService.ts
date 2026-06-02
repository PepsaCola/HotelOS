import type { VendorsData } from '@/types/vendors';
import { VENDORS } from '@/modules/vendors/data/vendorsMock';

export async function fetchVendors(_signal?: AbortSignal): Promise<VendorsData> {
    return Promise.resolve({ vendors: VENDORS });
}