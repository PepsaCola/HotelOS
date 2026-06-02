import type { ReceivingData } from "@/types/receiving";
import { receivingMock } from "@/modules/receiving/data/receivingMock";

/**
 * Data-access seam for the Receiving queue. Resolves bundled mock data today;
 * swap the body for a `fetch("/api/receiving?property=...")` returning
 * `ReceivingData`. This is the only file that changes for backend wiring.
 */
export async function fetchReceiving(_signal?: AbortSignal): Promise<ReceivingData> {
    return receivingMock;
}