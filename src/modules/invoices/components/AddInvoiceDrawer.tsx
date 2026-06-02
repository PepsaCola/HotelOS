import { useState } from "react";
import { CloseIcon } from "@/components/ui/icons";

interface AddInvoiceDrawerProps {
    open: boolean;
    onClose: () => void;
}

interface FileItem {
    id: string;
    name: string;
    size: string;
    state: "queued" | "uploading" | "extracting" | "done" | "error";
}

export default function AddInvoiceDrawer({ open, onClose }: AddInvoiceDrawerProps) {
    const [dragging, setDragging] = useState(false);
    const [files, setFiles]       = useState<FileItem[]>([]);

    const addFiles = (fileList: FileList) => {
        const newItems: FileItem[] = Array.from(fileList).map((f) => ({
            id:    crypto.randomUUID(),
            name:  f.name,
            size:  `${(f.size / 1024).toFixed(0)} KB`,
            state: "queued",
        }));
        setFiles((prev) => [...prev, ...newItems]);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

            {/* Drawer */}
            <div className="relative flex h-full w-full max-w-[480px] animate-slide-up flex-col bg-white shadow-[−8px_0_32px_rgba(12,19,32,0.12)]">
                {/* Head */}
                <div className="flex items-start justify-between border-b border-hair-2 px-6 py-5">
                    <div>
                        <h2 className="text-[17px] font-bold tracking-tight text-ink-900">
                            Add invoices to intake
                        </h2>
                        <p className="mt-1 text-[13px] text-muted-strong">
                            Upload invoices — we'll auto-detect the vendor, extract all fields, and suggest a PO match.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-4 mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-hair-2 text-muted-strong hover:bg-surface-soft"
                    >
                        <CloseIcon className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Dropzone */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
                        onClick={() => document.getElementById("inv-file-input")?.click()}
                        className={`mb-5 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[14px] border-2 border-dashed px-6 py-10 text-center transition-colors ${
                            dragging
                                ? "border-accent bg-accent-soft"
                                : "border-hair-2 bg-surface-soft hover:border-accent hover:bg-accent-soft/50"
                        }`}
                    >
                        <div className="grid h-12 w-12 place-items-center rounded-xl border border-hair-2 bg-white shadow-sm">
                            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-muted-strong" aria-hidden="true">
                                <path d="M12 4v12m0-12l-4 4m4-4l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M5 18v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[14px] font-semibold text-ink-900">
                                Drop invoice files here
                            </p>
                            <p className="mt-0.5 text-[13px] text-muted-strong">
                                or <span className="text-accent-ink underline">browse</span> · PDF, PNG, JPG up to 20 MB
                            </p>
                        </div>
                    </div>
                    <input
                        id="inv-file-input"
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => { if (e.target.files) addFiles(e.target.files); }}
                    />

                    {/* File list */}
                    {files.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-strong">
                                {files.length} file{files.length > 1 ? "s" : ""} added
                            </div>
                            {files.map((f) => (
                                <div key={f.id} className="flex items-center gap-3 rounded-xl border border-hair-2 bg-white px-3.5 py-3">
                                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-soft text-[10px] font-bold uppercase text-muted-strong">
                                        {f.name.split(".").pop()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-[13px] font-medium text-ink-900">{f.name}</div>
                                        <div className="text-[11.5px] text-muted-strong">{f.size}</div>
                                    </div>
                                    <StateChip state={f.state} />
                                    <button
                                        type="button"
                                        onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
                                        className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-chip hover:text-ink-900"
                                    >
                                        <CloseIcon className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 border-t border-hair-2 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 rounded-[9px] border border-hair-2 bg-white px-4 text-[13.5px] font-medium text-ink-900 hover:bg-surface-soft"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={files.length === 0}
                        className="h-9 rounded-[9px] bg-ink-900 px-5 text-[13.5px] font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Send to intake ({files.length})
                    </button>
                </div>
            </div>
        </div>
    );
}

const STATE_CLASS: Record<FileItem["state"], string> = {
    queued:     "bg-surface-chip text-ink-700",
    uploading:  "bg-accent-soft text-accent-ink",
    extracting: "bg-warn-bg text-warn",
    done:       "bg-good-bg text-good",
    error:      "bg-crit-bg text-crit",
};

const STATE_LABEL: Record<FileItem["state"], string> = {
    queued:     "Queued",
    uploading:  "Uploading…",
    extracting: "Extracting…",
    done:       "Done",
    error:      "Error",
};

function StateChip({ state }: { state: FileItem["state"] }) {
    return (
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATE_CLASS[state]}`}>
      {STATE_LABEL[state]}
    </span>
    );
}