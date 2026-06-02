import type { CreatePOFormData } from "@/types/createPO";
import { createPODefaults } from "@/modules/create-po/data/createPOMock";

export async function fetchPODefaults(_signal?: AbortSignal): Promise<CreatePOFormData> {
    // Replace with: return fetch("/api/po/defaults", { signal: _signal }).then(r => r.json())
    return Promise.resolve(createPODefaults);
}

export async function submitPO(_data: CreatePOFormData, _signal?: AbortSignal): Promise<{ id: string }> {
    // Replace with: return fetch("/api/po", { method: "POST", body: JSON.stringify(_data), signal: _signal }).then(r => r.json())
    return Promise.resolve({ id: _data.poNumber });
}