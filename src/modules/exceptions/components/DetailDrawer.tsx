import { useState, useEffect } from "react";
import type { Exception } from "@/types/exceptions";
import { formatMoney } from "@/lib/money";
import { EXCEPTION_TYPE_META, RESOLUTION_TYPE_META, deptDisplay } from "../lib/exceptions";

/**
 * The contextual primary button rendered in the drawer FOOTER. Each resolution
 * form reports its current primary action (label/style/validity) so the bottom
 * buttons change with the selected resolution.
 */
export type PrimaryAction = { label: string; className: string; enabled: boolean; run: () => void };

const SUBMIT_IDLE: PrimaryAction = {
    label: "Submit",
    className: "bg-muted-strong text-white",
    enabled: false,
    run: () => {},
};

/** Report a primary action to the footer, clearing it on unmount. */
function usePrimary(onPrimary: (p: PrimaryAction) => void, primary: PrimaryAction, deps: unknown[]) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { onPrimary(primary); }, deps);
}

export type DrawerAction =
    | { type: "approve_override"; comment: string }
    | { type: "reject"; comment: string }
    | { type: "correction"; assignee: string; comment: string }
    | { type: "link_po"; poNumber: string }
    | { type: "po_approval"; poNumber: string }
    | { type: "revoke"; comment: string }
    | { type: "resolve_mismatch"; action: string; comment: string };

interface DetailDrawerProps {
    exception: Exception | null;
    onClose: () => void;
    onSubmit: (exc: Exception, action: DrawerAction) => void;
}

type Tile = {
    id: string;
    icon: any;
    title: string;
    desc: string;
    sel: string;
};

const inputClass =
    "w-full rounded-lg border border-hair-2 px-3 py-2 text-[13px] focus:border-accent focus:outline-none";

const textareaClass =
    "w-full min-h-[88px] resize-none rounded-lg border border-hair-2 px-3 py-2 text-[13px] focus:border-accent focus:outline-none";

// function DetailRow({
//                        label,
//                        value,
//                        mono = false,
//                    }: {
//     label: string;
//     value: string;
//     mono?: boolean;
// }) {
//     return (
//         <div className="flex flex-col gap-1 border-b border-hair py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
//             <span className="text-[12px] text-muted sm:text-[12.5px]">{label}</span>
//
//             <span
//                 className={`break-words text-[13px] font-medium text-ink-900 sm:text-right sm:text-[13.5px] ${
//                     mono ? "font-mono text-[12.5px]" : ""
//                 }`}
//             >
//                 {value}
//             </span>
//         </div>
//     );
// }

function ActionTile({
                        tile,
                        selected,
                        onClick,
                    }: {
    tile: Tile;
    selected: boolean;
    onClick: () => void;
}) {
    const selBorder: Record<string, string> = {
        approve: "border-good bg-good-bg",
        correction: "border-warn bg-warn-bg",
        reject: "border-crit bg-crit-bg",
        revoke: "border-accent bg-accent-soft",
    };

    const selTitle: Record<string, string> = {
        approve: "text-good",
        correction: "text-warn",
        reject: "text-crit",
        revoke: "text-accent-ink",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`min-h-[92px] rounded-[10px] border-[1.5px] px-3 py-3 text-left transition-colors hover:border-accent hover:bg-accent-soft sm:px-[14px] w-full ${
                selected
                    ? selBorder[tile.sel] ?? "border-accent bg-accent-soft"
                    : "border-hair-2 bg-white"
            }`}
        >
            <div className="mb-1.5 text-[17px] sm:text-[18px]">{tile.icon}</div>

            <div
                className={`mb-0.5 text-[12.5px] font-bold leading-snug sm:text-[13px] ${
                    selected
                        ? selTitle[tile.sel] ?? "text-accent-ink"
                        : "text-ink-900"
                }`}
            >
                {tile.title}
            </div>

            <div className="text-[11px] leading-[1.4] text-muted sm:text-[11.5px]">
                {tile.desc}
            </div>
        </button>
    );
}

function StatusBanner({ exc }: { exc: Exception }) {
    if (exc.status === "rejected") {
        const returnStatus =
            exc.type === "no_po"
                ? "No PO Match"
                : exc.type === "over_budget"
                    ? "Over Budget"
                    : "Line Mismatch";

        return (
            <div className="flex items-start gap-2.5 rounded-xl border border-[#f0c6c6] bg-[#fff0f0] px-4 py-3 text-[12px] font-medium leading-relaxed text-crit sm:text-[12.5px]">
                <svg
                    className="mt-0.5 h-[15px] w-[15px] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path
                        d="M15 9l-6 6M9 9l6 6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                </svg>

                <div className="min-w-0">
                    <div className="font-bold">Invoice Rejected</div>
                    <div>
                        You may revoke the rejection — invoice will return to{" "}
                        <strong className="font-bold">{returnStatus}</strong>.
                    </div>
                </div>
            </div>
        );
    }

    if (exc.exportBlocked) {
        return (
            <div className="flex items-start gap-2.5 rounded-xl border border-[#f0c6c6] bg-[#fff0f0] px-3 py-3 text-[12px] font-medium leading-relaxed text-crit sm:px-4 sm:text-[12.5px]">
                <svg
                    className="mt-0.5 h-[15px] w-[15px] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path
                        d="M12 8v4M12 16h.01"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                </svg>

                <div>
                    Export is still blocked from a prior rejection. Resolve this exception to
                    re-evaluate.
                </div>
            </div>
        );
    }

    if (exc.status === "correction") {
        const label = exc.type === "no_po" ? "No PO Match" : "Over Budget";

        return (
            <div className="flex items-start gap-2.5 rounded-xl border border-[#c0c4f8] bg-accent-soft px-3 py-3 text-[12px] font-medium leading-relaxed text-accent-ink sm:px-4 sm:text-[12.5px]">
                <svg
                    className="mt-0.5 h-[15px] w-[15px] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path
                        d="M12 8v4M12 16h.01"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                </svg>

                <div>
                    Correction requested - awaiting response from{" "}
                    <strong>{exc.correctionAssignee ?? "department"}</strong>. Exception
                    remains {label}.
                </div>
            </div>
        );
    }

    return null;
}

function OverBudgetForm({
                            exc,
                            onSubmit,
                            onPrimary,
                        }: {
    exc: Exception;
    onSubmit: (a: DrawerAction) => void;
    onPrimary: (p: PrimaryAction) => void;
}) {
    const [selected, setSelected] = useState<string | null>(null);
    const [assignee, setAssignee] = useState<string | null>(null);
    const [comment, setComment] = useState("");

    const isRejected = exc.status === "rejected";

    let primary: PrimaryAction = SUBMIT_IDLE;
    if (isRejected) {
        primary = { label: "Revoke Rejection", className: "bg-[#f8d8d8] text-crit hover:bg-[#f0c6c6]", enabled: comment.trim() !== "", run: () => comment.trim() && onSubmit({ type: "revoke", comment: comment.trim() }) };
    } else if (selected === "approve") {
        primary = { label: "Approve Override", className: "bg-[#0c1320] text-white ", enabled: comment.trim() !== "", run: () => comment.trim() && onSubmit({ type: "approve_override", comment: comment.trim() }) };
    } else if (selected === "correction") {
        primary = { label: "Send Correction Request", className: "bg-[#4a6cf8] text-white hover:bg-[#3858d6]", enabled: !!assignee, run: () => assignee && onSubmit({ type: "correction", assignee, comment: comment.trim() }) };
    } else if (selected === "reject") {
        primary = { label: "Reject Invoice", className: "bg-crit text-white hover:bg-[#c93232]", enabled: comment.trim() !== "", run: () => comment.trim() && onSubmit({ type: "reject", comment: comment.trim() }) };
    }
    usePrimary(onPrimary, primary, [isRejected, selected, assignee, comment]);

    if (isRejected) {
        return (
            <div className="space-y-4">
                <ActionTile
                    tile={{
                        id: "revoke",
                        icon: "↩️",
                        title: "Revoke Rejection",
                        desc: "Return invoice to Over Budget status. Export stays blocked.",
                        sel: "revoke",
                    }}
                    selected
                    onClick={() => {}}
                />

                {/* Прибрано сірий фон та обведення */}
                <div>
                    <label className="mb-2 block text-[12.5px] font-bold text-ink-900">
                        Comment <span className="font-normal text-crit">* required</span>
                    </label>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Reason for revoking rejection..."
                        rows={3}
                        className="w-full resize-none rounded-lg border border-hair-2 bg-white px-3 py-2.5 text-[13px] text-ink-900 placeholder:text-muted focus:border-[#8ba4fc] focus:outline-none focus:ring-1 focus:ring-[#8ba4fc]"
                    />

                    <p className="mt-2 text-[11.5px] text-muted">
                        Invoice returns to Over Budget. Export block remains until resolved.
                    </p>
                </div>
            </div>
        );
    }

    // Головні картки дій
    const TILES: Tile[] = [
        {
            id: "approve",
            icon: "✅",
            title: "Approve Override",
            desc: "Allow invoice to proceed. Exception moves to Resolved. Invoice becomes Proceeded.",
            sel: "approve",
        },
        {
            id: "correction",
            icon: "🔄",
            title: "Request Correction",
            desc: "Assign back for correction. Exception stays Over Budget. Invoice status unchanged.",
            sel: "correction",
        },
        {
            id: "reject",
            icon: "🚫",
            title: "Reject Invoice",
            desc: "Rejection reason required. Invoice becomes Rejected. Export permanently blocked.",
            sel: "reject",
        },
    ];

    return (
        <div className="space-y-5">
            <div>
                <div className="mb-2.5 text-[12.5px] font-bold text-ink-900">
                    Select action
                </div>

                {/* Сітка карток: 1 колонка на мобільних, 2 на десктопі */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {TILES.map((t) => (
                        <ActionTile
                            key={t.id}
                            tile={t}
                            selected={selected === t.id}
                            onClick={() => {
                                setSelected(t.id);
                                setAssignee(null);
                                setComment("");
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Блок: Approve */}
            {selected === "approve" && (
                <div className="animate-fade-in rounded-[12px] border border-hair-2 bg-[#f9fafb] p-4 sm:p-5">
                    <label className="block text-[12.5px] font-bold text-ink-900">
                        Approval Comment{" "}
                        <span className="font-normal text-crit">* required</span>
                    </label>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Explain the business justification for approving this over-budget invoice..."
                        rows={3}
                        className={textareaClass}
                    />

                    <p className="mt-2 text-[11.5px] text-muted">
                        Comment is required. Invoice will move to Proceeded and exception will be
                        Resolved.
                    </p>
                </div>
            )}

            {/* Блок: Correction */}
            {selected === "correction" && (
                <div className="animate-fade-in space-y-4 rounded-[12px] border border-hair-2 bg-[#f9fafb] p-4 sm:p-5">
                    <div>
                        <label className="mb-2.5 block text-[12.5px] font-bold text-ink-900">
                            Assign correction to{" "}
                            <span className="font-normal text-crit">* required</span>
                        </label>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {["Department", "Controller", "GM"].map((a) => (
                                <button
                                    key={a}
                                    type="button"
                                    onClick={() => setAssignee(a)}
                                    className={`min-h-10 rounded-lg border px-3 py-2 text-[12.5px] font-bold transition-all ${
                                        assignee === a
                                            ? "border-[#8ba4fc] bg-[#eef1ff] text-[#4a6cf8]"
                                            : "border-hair-2 bg-white text-ink-700 hover:border-[#8ba4fc]"
                                    }`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[12.5px] font-bold text-ink-900">
                            Comment
                        </label>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Describe what correction is needed..."
                            rows={2}
                            className={textareaClass}
                        />

                        <p className="mt-2 text-[11.5px] text-muted">
                            Exception stays Over Budget. Assigned party will be notified.
                        </p>
                    </div>
                </div>
            )}

            {/* Блок: Reject */}
            {selected === "reject" && (
                <div className="animate-fade-in rounded-[12px] border border-hair-2 bg-[#f9fafb] p-4 sm:p-5">
                    <label className="block text-[12.5px] font-bold text-ink-900">
                        Rejection Reason{" "}
                        <span className="font-normal text-crit">* required</span>
                    </label>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Provide the reason for rejecting this invoice..."
                        rows={3}
                        className={textareaClass}
                    />

                    <p className="mt-2 text-[11.5px] text-muted">
                        Invoice becomes Rejected. Export is permanently blocked unless rejection
                        is later revoked.
                    </p>
                </div>
            )}

        </div>
    );
}

function NoPOForm({
                      exc,
                      onSubmit,
                      onPrimary,
                  }: {
    exc: Exception;
    onSubmit: (a: DrawerAction) => void;
    onPrimary: (p: PrimaryAction) => void;
}) {
    const [selected, setSelected] = useState<string | null>(null);
    const [assignee, setAssignee] = useState<string | null>(null);
    const [comment, setComment] = useState("");
    const [poInput, setPoInput] = useState("");

    const isRejected = exc.status === "rejected";

    let primary: PrimaryAction = SUBMIT_IDLE;
    if (isRejected) {
        primary = { label: "Revoke Rejection", className: "bg-[#f8d8d8] text-crit hover:bg-[#f0c6c6]", enabled: comment.trim() !== "", run: () => comment.trim() && onSubmit({ type: "revoke", comment: comment.trim() }) };
    } else if (selected === "link_po" || selected === "po_approval") {
        primary = { label: "Link PO & Rerun Matching", className: "bg-[#4a6cf8] text-white hover:bg-[#3858d6]", enabled: poInput.trim() !== "", run: () => poInput.trim() && onSubmit({ type: selected as "link_po" | "po_approval", poNumber: poInput.trim() }) };
    } else if (selected === "correction") {
        primary = { label: "Send Correction Request", className: "bg-[#4a6cf8] text-white hover:bg-[#3858d6]", enabled: !!assignee, run: () => assignee && onSubmit({ type: "correction", assignee, comment: comment.trim() }) };
    } else if (selected === "reject") {
        primary = { label: "Reject Invoice", className: "bg-crit text-white hover:bg-[#c93232]", enabled: comment.trim() !== "", run: () => comment.trim() && onSubmit({ type: "reject", comment: comment.trim() }) };
    }
    usePrimary(onPrimary, primary, [isRejected, selected, assignee, comment, poInput]);

    if (isRejected) {
        return (
            <div className="space-y-4">
                <ActionTile
                    tile={{
                        id: "revoke",
                        icon: "↩️",
                        title: "Revoke Rejection",
                        desc: "Return invoice to Over Budget status. Export stays blocked.",
                        sel: "revoke",
                    }}
                    selected
                    onClick={() => {}}
                />

                {/* Прибрано сірий фон та обведення */}
                <div>
                    <label className="mb-2 block text-[12.5px] font-bold text-ink-900">
                        Comment <span className="font-normal text-crit">* required</span>
                    </label>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Reason for revoking rejection..."
                        rows={3}
                        className="w-full resize-none rounded-lg border border-hair-2 bg-white px-3 py-2.5 text-[13px] text-ink-900 placeholder:text-muted focus:border-[#8ba4fc] focus:outline-none focus:ring-1 focus:ring-[#8ba4fc]"
                    />

                    <p className="mt-2 text-[11.5px] text-muted">
                        Invoice returns to Over Budget. Export block remains until resolved.
                    </p>
                </div>
            </div>
        );
    }

    const TILES: Tile[] = [
        {
            id: "link_po",
            icon: "🔗",
            title: "Link Correct PO",
            desc: "Enter a PO number. System reruns matching automatically.",
            sel: "approve",
        },
        {
            id: "po_approval",
            icon: "📋",
            title: "PO Approval",
            desc: "Create or approve a new PO. Matching reruns after approval.",
            sel: "approve",
        },
        {
            id: "correction",
            icon: "📨",
            title: "Request Correction",
            desc: "Ask vendor or department for the correct PO reference.",
            sel: "correction",
        },
        {
            id: "reject",
            icon: "🚫",
            title: "Reject Invoice",
            desc: "Rejection reason required. Invoice becomes Rejected.",
            sel: "reject",
        },
    ];

    return (
        <div className="space-y-5">
            <div>
                <div className="mb-2.5 text-[12.5px] font-bold text-ink-900">
                    Select action
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {TILES.map((t) => (
                        <ActionTile
                            key={t.id}
                            tile={t}
                            selected={selected === t.id}
                            onClick={() => {
                                setSelected(t.id);
                                setAssignee(null);
                                setComment("");
                                setPoInput("");
                            }}
                        />
                    ))}
                </div>
            </div>

            {(selected === "link_po" || selected === "po_approval") && (
                <div className="animate-fade-in rounded-[12px] border border-hair-2 bg-[#f9fafb] p-4 sm:p-5">
                    <label className="block text-[12.5px] font-bold text-ink-900">
                        PO Number <span className="font-normal text-crit">* required</span>
                    </label>

                    <input
                        type="text"
                        value={poInput}
                        onChange={(e) => setPoInput(e.target.value)}
                        placeholder={
                            selected === "link_po"
                                ? "e.g. PO-25-0291"
                                : "e.g. PO-25-0312"
                        }
                        className={`mt-2 font-mono ${inputClass}`}
                    />

                    <p className="mt-2 text-[11.5px] text-muted">
                        Matching reruns automatically. If lines match, the exception becomes
                        resolved. If not, it moves to Line Mismatch.
                    </p>
                </div>
            )}

            {selected === "correction" && (
                <div className="animate-fade-in space-y-4 rounded-[12px] border border-hair-2 bg-[#f9fafb] p-4 sm:p-5">
                    <div>
                        <label className="mb-2.5 block text-[12.5px] font-bold text-ink-900">
                            Assign to <span className="font-normal text-crit">* required</span>
                        </label>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {["Vendor", "Department", "Controller"].map((a) => (
                                <button
                                    key={a}
                                    type="button"
                                    onClick={() => setAssignee(a)}
                                    className={`min-h-10 rounded-lg border px-3 py-2 text-[12.5px] font-bold transition-all ${
                                        assignee === a
                                            ? "border-[#8ba4fc] bg-[#eef1ff] text-[#4a6cf8]"
                                            : "border-hair-2 bg-white text-ink-700 hover:border-[#8ba4fc]"
                                    }`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[12.5px] font-bold text-ink-900">
                            Comment
                        </label>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Describe what PO information is needed..."
                            rows={2}
                            className={textareaClass}
                        />

                        <p className="mt-2 text-[11.5px] text-muted">
                            Exception stays No PO Match. Assigned party will be notified.
                        </p>
                    </div>
                </div>
            )}

            {selected === "reject" && (
                <div className="animate-fade-in rounded-[12px] border border-hair-2 bg-[#f9fafb] p-4 sm:p-5">
                    <label className="block text-[12.5px] font-bold text-ink-900">
                        Rejection Reason{" "}
                        <span className="font-normal text-crit">* required</span>
                    </label>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Provide the reason for rejecting this invoice..."
                        rows={3}
                        className={textareaClass}
                    />

                    <p className="mt-2 text-[11.5px] text-muted">
                        Invoice becomes Rejected. Stays visible in Exceptions. Rejection can be
                        revoked.
                    </p>
                </div>
            )}

        </div>
    );
}

function MismatchForm({ onSubmit, onPrimary }: { onSubmit: (a: DrawerAction) => void; onPrimary: (p: PrimaryAction) => void }) {
    const [action, setAction] = useState("");
    const [comment, setComment] = useState("");

    const MISMATCH_LABELS: Record<string, string> = {
        approve: "Approve & Proceed",
        reject: "Reject Invoice",
        escalate: "Escalate to GM",
        request_po: "Request PO Creation",
        link_po: "Link PO Manually",
    };
    const primary: PrimaryAction = action
        ? {
            label: MISMATCH_LABELS[action] ?? "Submit Resolution",
            className: action === "reject" ? "bg-crit text-white hover:bg-[#c93232]" : "bg-ink-900 text-white hover:bg-black",
            enabled: comment.trim() !== "",
            run: () => action && comment.trim() && onSubmit({ type: "resolve_mismatch", action, comment: comment.trim() }),
        }
        : { label: "Submit Resolution", className: "bg-muted-strong text-white", enabled: false, run: () => {} };
    usePrimary(onPrimary, primary, [action, comment]);

    return (
        <div className="space-y-5">
            <div>
                <label className="mb-2.5 block text-[12.5px] font-bold text-ink-900">
                    Action
                </label>

                <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full rounded-lg border border-hair-2 bg-white px-3 py-2.5 text-[13px] text-ink-900 focus:border-[#8ba4fc] focus:outline-none focus:ring-1 focus:ring-[#8ba4fc]"
                >
                    <option value="">— Select action —</option>
                    <option value="approve">Approve - allow invoice to proceed</option>
                    <option value="reject">Reject - return to AP team</option>
                    <option value="escalate">Escalate - assign to GM</option>
                    <option value="request_po">Request PO creation</option>
                    <option value="link_po">Link to existing PO manually</option>
                </select>
            </div>

            <div>
                <label className="mb-2.5 block text-[12.5px] font-bold text-ink-900">
                    Reason / Comment <span className="font-normal text-muted">(required)</span>
                </label>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Explain your decision or add context for the audit log..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-hair-2 bg-white px-3 py-2.5 text-[13px] text-ink-900 placeholder:text-muted focus:border-[#8ba4fc] focus:outline-none focus:ring-1 focus:ring-[#8ba4fc]"
                />

                <p className="mt-2 text-[11.5px] text-muted">
                    This comment will be recorded in the exception audit log and linked to the invoice.
                </p>
            </div>
        </div>
    );
}

function ResolvedSummary({ exc }: { exc: Exception }) {

    const resInfo = exc.resolutionType
        ? RESOLUTION_TYPE_META?.[exc.resolutionType] ?? { label: "PO Linked & Matched" }
        : { label: "PO Linked & Matched" };

    return (
        <div>
            {/* Банер про успішне вирішення */}
            <div className="mb-5 flex items-start gap-3 rounded-[12px] bg-[#eef8f2] border border-[#c1e6d0] px-4 py-3 sm:items-center">
                <svg
                    className="mt-0.5 h-[18px] w-[18px] shrink-0 sm:mt-0 text-[#107044]"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path
                        d="M8 12l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[#107044]">
                        Exception Resolved
                    </div>

                    <div className="mt-0.5 break-words text-[12px] leading-relaxed text-[#107044]/80">
                        Invoice: <strong className="font-bold">{exc.invoiceStatus ?? "Matched"}</strong> · Resolved{" "}
                        {exc.resolvedAt ?? "Just now"}
                    </div>
                </div>
            </div>

            {/* Деталі без пунктирних ліній */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-[12.5px] font-medium text-muted">Resolution type</span>

                    {resInfo && (
                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#eef1ff] px-2.5 py-1 text-[11.5px] font-bold text-[#4a6cf8]">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
                            </svg>
                            {resInfo.label}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-[12.5px] font-medium text-muted">Resolved by</span>
                    <span className="break-words text-[13px] font-bold text-ink-900 sm:text-right">
                        {exc.resolvedBy ?? exc.assignee ?? "System"}
                    </span>
                </div>

                {exc.resolutionNote && (
                    <div className="pt-1">
                        <div className="mb-2 text-[12.5px] font-medium text-muted">
                            Resolution note
                        </div>

                        <div className="break-words rounded-lg bg-[#f9fafb] px-3.5 py-3 text-[13px] leading-relaxed text-ink-700">
                            {exc.resolutionNote}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export function DetailDrawer({
                                 exception,
                                 onClose,
                                 onSubmit,
                             }: DetailDrawerProps) {
    const [primary, setPrimary] = useState<PrimaryAction | null>(null);

    if (!exception) return null;

    const typeInfo = EXCEPTION_TYPE_META[exception.type];
    const dept = deptDisplay(exception.dept);
    const isResolved = exception.status === "resolved";

    const descStyle =
        exception.severity === "warn"
            ? "border-[#f0dfa0] bg-[#fffbf0]"
            : "border-[#f0c6c6] bg-[#fff8f8]";

    const descLabel = exception.severity === "warn" ? "text-warn" : "text-crit";

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-stretch sm:justify-end">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px] animate-fade-in"
                onClick={onClose}
            />

            <div
                className="relative flex h-[92dvh] w-full flex-col overflow-hidden rounded-t-[22px] bg-white shadow-[-12px_0_40px_rgba(0,0,0,.18)] animate-slide-in-right sm:h-full sm:max-w-[560px] sm:rounded-none">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 px-4 pt-4 pb-2 sm:px-6 sm:pt-6 sm:pb-3">
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="font-mono text-[11.5px] font-semibold text-ink-700 sm:text-[12px]">
                                {exception.id}
                            </span>

                            <span className="text-muted">·</span>

                            <span className="break-all text-[11.5px] text-muted sm:text-[12px]">
                                {exception.invoiceNo}
                            </span>

                            <span className="text-muted">·</span>

                            <span
                                className={`inline-flex items-center gap-[5px] rounded-full px-[9px] py-[3px] text-[11px] font-semibold sm:text-[11.5px] ${
                                    typeInfo.tone === "crit"
                                        ? "bg-crit-bg text-crit"
                                        : "bg-warn-bg text-warn"
                                }`}
                            >
                                <span className="h-[5px] w-[5px] rounded-full bg-current"/>
                                {typeInfo.label}
                            </span>
                        </div>

                        <h2 className="break-words text-[18px] font-bold leading-tight tracking-[-0.02em] text-ink-900 sm:text-[20px]">
                            {exception.title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border-0 bg-transparent text-muted transition-colors hover:bg-surface-soft hover:text-ink-900 sm:h-[30px] sm:w-[30px]"
                        aria-label="Close drawer"
                    >
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                            <path
                                d="M6 6l12 12M18 6L6 18"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                    <div className="flex flex-col gap-6">

                        {/* Summary Block */}
                        <div
                            className="flex flex-row items-start justify-between rounded-[16px] bg-[#1a1f2e] px-5 py-5 sm:px-6 sm:py-6">
                            <div className="min-w-0">
                                <div className="text-[10.5px] font-bold uppercase tracking-[0.07em] text-[#8e95a3]">
                                    Invoice Total
                                </div>

                                <div
                                    className="mt-1 flex items-baseline break-words font-mono text-[28px] font-bold tracking-tight text-white tabular-nums sm:text-[32px]">
                                    $5<span className="ml-2">661</span>
                                    <span className="text-[14px] font-medium text-[#8e95a3]">
                                        .00
                                    </span>
                                </div>

                                <div
                                    className={`mt-2 inline-block rounded-md px-2.5 py-1 text-[11px] font-bold ${
                                        exception.type === "over_budget"
                                            ? "bg-[#3a2024] text-[#ff8080]"
                                            : exception.type === "no_po"
                                                ? "bg-accent/30 text-[#b3b3ff]"
                                                : "bg-warn/30 text-[#ffd88a]"
                                    }`}
                                >
                                    {typeInfo.label}
                                </div>
                            </div>

                            <div className="shrink-0 text-right">
                                <div className="text-[10.5px] font-bold uppercase tracking-[0.07em] text-[#8e95a3]">
                                    Budget Exposure
                                </div>

                                <div className="mt-1 text-[22px] font-bold text-[#ff8080] tabular-nums sm:text-[24px]">
                                    {exception.exposure
                                        ? formatMoney(exception.exposure)
                                        : "-"}
                                </div>

                                <div
                                    className="mt-4 text-[10.5px] font-bold uppercase tracking-[0.07em] text-[#8e95a3]">
                                    Received
                                </div>

                                <div className="mt-0.5 text-[13px] font-medium text-white">
                                    {exception.received}
                                </div>
                            </div>
                        </div>

                        {/* Issue Description */}
                        <div className={`rounded-[10px] border px-4 py-4 sm:px-5 sm:py-[18px] ${descStyle}`}>
                            <div
                                className={`mb-2 text-[10.5px] font-bold uppercase tracking-[0.07em] ${descLabel}`}
                            >
                                Issue
                            </div>

                            <div className="break-words text-[13px] leading-[1.55] text-ink-700">
                                {exception.desc}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="rounded-[12px] border border-hair-2 bg-[#f9fafb] p-4 sm:p-5">
                            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                                <div>
                                    <div
                                        className="mb-1 text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted">
                                        Vendor
                                    </div>
                                    <div className="text-[13px] font-bold text-ink-900">
                                        {exception.vendor}
                                    </div>
                                </div>
                                <div>
                                    <div
                                        className="mb-1 text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted">
                                        Department
                                    </div>
                                    <div className="text-[13px] font-bold text-ink-900">
                                        {dept.name}
                                    </div>
                                </div>
                                <div>
                                    <div
                                        className="mb-1 text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted">
                                        PO #
                                    </div>
                                    <div className="font-mono text-[13px] font-bold text-ink-900">
                                        {exception.poNo ?? "-"}
                                    </div>
                                </div>
                                <div>
                                    <div
                                        className="mb-1 text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted">
                                        PO Match
                                    </div>
                                    <div className="text-[13px] font-bold text-ink-900">
                                        {exception.poMatch}
                                    </div>
                                </div>
                                <div>
                                    <div
                                        className="mb-1 text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted">
                                        Assignee
                                    </div>
                                    <div className="text-[13px] font-bold text-ink-900">
                                        {exception.assignee}
                                    </div>
                                </div>
                                <div>
                                    <div
                                        className="mb-1 text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted">
                                        Raised
                                    </div>
                                    <div className="text-[13px] font-bold text-ink-900">
                                        {exception.raised}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resolution Area */}
                        <div className="overflow-hidden rounded-[16px] border border-hair-2 bg-[#f9fafb]">
                            <div className="border-b border-hair bg-[#f1f3f5] px-4 py-3 sm:px-5">
                                <div className="text-[12px] font-bold uppercase tracking-[0.07em] text-muted">
                                    Resolution
                                </div>
                            </div>

                            <div className="p-4 bg-white sm:p-5">
                                <div className="space-y-4">
                                    <StatusBanner exc={exception}/>

                                    {isResolved ? (
                                        <ResolvedSummary exc={exception}/>
                                    ) : exception.type === "over_budget" ? (
                                        <OverBudgetForm
                                            key={exception.id}
                                            exc={exception}
                                            onSubmit={(a) => onSubmit(exception, a)}
                                            onPrimary={setPrimary}
                                        />
                                    ) : exception.type === "no_po" ? (
                                        <NoPOForm
                                            key={exception.id}
                                            exc={exception}
                                            onSubmit={(a) => onSubmit(exception, a)}
                                            onPrimary={setPrimary}
                                        />
                                    ) : (
                                        <MismatchForm
                                            key={exception.id}
                                            onSubmit={(a) => onSubmit(exception, a)}
                                            onPrimary={setPrimary}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Activity Log */}
                        <div>
                            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
                                Activity log
                            </div>

                            <div>
                                {exception.history.map((entry, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-4 border-b border-dotted border-hair-2 py-[12px] last:border-0"
                                    >
                                        <div
                                            className="mt-[6px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#4a5568]"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div className="break-words text-[12px] font-bold text-ink-900">
                                                {entry.actor}
                                            </div>

                                            <div className="mt-1 break-words text-[13px] leading-[1.5] text-muted">
                                                {entry.msg}
                                            </div>

                                            <div className="mt-1 text-[11px] text-muted">
                                                {entry.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 border-t border-hair bg-white px-4 py-4 sm:px-6">
                    {isResolved ? (
                        <>
                            {/* Кнопки для вирішеного стану (Resolved) */}
                            <button
                                type="button"
                                onClick={() =>
                                    alert(`Opening invoice ${exception.invoiceNo} in Invoices module...`)
                                }
                                className="h-10 rounded-[8px] border border-hair-2 bg-white px-4 text-[13px] font-bold text-ink-900 transition-colors hover:bg-surface-soft"
                            >
                                View Invoice
                            </button>

                            <button
                                type="button"
                                onClick={onClose}
                                className="h-10 px-3 text-[13px] font-bold text-muted transition-colors hover:text-ink-900"
                            >
                                Close
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Contextual primary — its label/style change with the selected resolution */}
                            <button
                                type="button"
                                disabled={!primary?.enabled}
                                onClick={() => primary?.run()}
                                className={`h-10 min-w-[80px] rounded-[8px] px-4 text-[13px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${primary?.className ?? "bg-muted-strong text-white"}`}
                            >
                                {primary?.label ?? "Submit"}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    alert(`Opening invoice ${exception.invoiceNo} in Invoices module...`)
                                }
                                className="h-10 rounded-[8px] border border-hair-2 bg-white px-4 text-[13px] font-bold text-ink-900 transition-colors hover:bg-surface-soft"
                            >
                                View Invoice
                            </button>

                            <button
                                type="button"
                                onClick={onClose}
                                className="h-10 px-3 text-[13px] font-bold text-muted transition-colors hover:text-ink-900"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}