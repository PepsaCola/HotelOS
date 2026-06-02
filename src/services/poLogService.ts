import type { POLogData } from "@/types/poLog";
import { poLogMock } from "@/modules/po-log/data/poLogMock";

/**
 * Data-access seam for the PO Log. Resolves bundled mock data today; swap the
 * body for a `fetch("/api/purchase-orders?month=...")` returning `POLogData`.
 */
export async function fetchPOLog(_signal?: AbortSignal): Promise<POLogData> {
  return poLogMock;
}
