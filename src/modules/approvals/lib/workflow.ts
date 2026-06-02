import type { ActionType, ApprovalReviewer, ChainActor, PurchaseApproval } from "@/types/approvals";
import type { ToastTone } from "../useToasts";

/** First chain step still awaiting action, or null when the chain is complete. */
export function nextPendingStep(po: PurchaseApproval): ChainActor | null {
  return po.chainActors.find((a) => a.action === "Pending" || a.action === "Required") ?? null;
}

/**
 * Pure transition for a reviewer acting on their step. Returns a new PO with the
 * chain, actors, and audit trail updated — never mutates the input.
 */
export function applyAction(
  po: PurchaseApproval,
  type: ActionType,
  comment: string,
  reviewer: ApprovalReviewer,
): PurchaseApproval {
  const idx = po.chain.indexOf("current");
  if (idx === -1) return po;

  const chain = [...po.chain];
  const actors = po.chainActors.map((a) => ({ ...a }));

  if (type === "approve") {
    chain[idx] = "done";
    if (idx + 1 < chain.length) chain[idx + 1] = "current";
  } else if (type === "reject") {
    chain[idx] = "rejected";
  } else {
    chain[idx] = "changes";
    // Send back to the AGM (step 1) for revision.
    if (idx > 1) {
      chain[1] = "current";
      actors[1].action = "Pending";
      actors[1].time = "";
    }
  }

  actors[idx].action = type === "approve" ? "Approved" : type === "reject" ? "Rejected" : "Changes Requested";
  actors[idx].time = "May 20, just now";
  actors[idx].comment = comment;

  const desc =
    type === "approve"
      ? `${reviewer.role} approved — forwarded to GM`
      : type === "reject"
        ? `${reviewer.role} rejected — PO returned to requester and cancelled`
        : `${reviewer.role} requested changes — PO returned to AGM for revision`;

  return {
    ...po,
    chain,
    chainActors: actors,
    audit: [...po.audit, { type, who: reviewer.name, role: reviewer.role, when: "May 20, just now", desc, comment }],
  };
}

/** Toast copy + tone for a completed action. */
export function actionToast(po: PurchaseApproval, type: ActionType): { text: string; tone: ToastTone } {
  switch (type) {
    case "approve":
      return { text: `${po.id} approved — forwarded to GM`, tone: "good" };
    case "reject":
      return { text: `${po.id} rejected — requester notified`, tone: "neutral" };
    case "changes":
      return { text: `Changes requested — ${po.id} returned to AGM`, tone: "warn" };
  }
}

export interface ActionConfig {
  title: string;
  hint: string;
  required: boolean;
  placeholder: string;
  btnLabel: string;
  tone: ActionType;
}

/** Resolves the action-sheet copy for a given action, accounting for over-budget POs. */
export function actionConfig(type: ActionType, po: PurchaseApproval): ActionConfig {
  switch (type) {
    case "approve":
      return {
        title: "Approve PO",
        hint: po.overBudget
          ? "This PO is over budget. A justification comment is required."
          : "Optional: add a note for the record.",
        required: po.overBudget,
        placeholder: po.overBudget ? "Explain the over-budget approval…" : "Optional note…",
        btnLabel: "Confirm Approval",
        tone: "approve",
      };
    case "changes":
      return {
        title: "Request Changes",
        hint: "Describe what needs to be revised. The PO will be returned to the AGM.",
        required: true,
        placeholder: "What needs to change?",
        btnLabel: "Send Back for Changes",
        tone: "changes",
      };
    case "reject":
      return {
        title: "Reject PO",
        hint: "Provide a reason. The PO will be cancelled and returned to the requester.",
        required: true,
        placeholder: "Reason for rejection…",
        btnLabel: "Confirm Rejection",
        tone: "reject",
      };
  }
}
