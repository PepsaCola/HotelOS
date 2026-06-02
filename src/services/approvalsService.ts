import type { ApprovalsData } from "@/types/approvals";
import { approvalsMock } from "@/modules/approvals/data/approvalsMock";

/**
 * Data-access seam for the Approvals queue. Resolves bundled mock data today;
 * swap the body for a `fetch("/api/approvals?reviewer=...")` returning
 * `ApprovalsData`. This is the only file that changes for backend wiring.
 */
export async function fetchApprovals(_signal?: AbortSignal): Promise<ApprovalsData> {
  return approvalsMock;
}
