import { useState } from 'react';
import { DEPTS } from '../lib/vendors';

const CATEGORIES = [
    'Cleaning & Remediation', 'Laundry & Uniforms', 'Food & Beverage',
    'Guest Transportation', 'Maintenance Supplies', 'HVAC & Mechanical',
    'Pest Control', 'IT & Technology', 'Concierge Services',
    'Security', 'Landscaping', 'Other',
];

interface DocFile { type: string; name: string; }

function SectionTitle({ num, children }: { num: number; children: React.ReactNode }) {
    return (
        <div className="mt-1 flex items-center gap-2 border-b border-hair pb-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">
                {num}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[.08em] text-muted">
                {children}
            </span>
        </div>
    );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="flex flex-1 flex-col gap-1.5 w-full">
            <label className="text-[12px] font-semibold text-ink-700">
                {label}{required && <span className="ml-0.5 text-crit">*</span>}
            </label>
            {children}
        </div>
    );
}

const inputCls  = 'w-full rounded-lg border border-hair-2 bg-white px-3 py-2 text-[13px] text-ink-900 placeholder:text-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15';
const selectCls = inputCls + ' cursor-pointer';

interface Props { onClose: () => void; }

export function AddVendorPanel({ onClose }: Props) {
    const [docs, setDocs] = useState<DocFile[]>([
        { type: 'COI', name: 'Certificate_of_Insurance_2026.pdf' },
        { type: 'W9',  name: 'W9_Form_Signed.pdf' },
    ]);

    const removeDoc = (i: number) => setDocs(d => d.filter((_, idx) => idx !== i));
    const addDoc = () => {
        const opts = [
            { type: 'CONTRACT', name: 'Service_Agreement_2026.pdf' },
            { type: 'LICENSE',  name: 'Business_License.pdf' },
            { type: 'OTHER',    name: 'Additional_Doc_Very_Long_Name_Example.pdf' },
        ];
        setDocs(d => [...d, opts[Math.floor(Math.random() * opts.length)]]);
    };

    return (
        <div className="fixed inset-0 z-[80] flex justify-end">
            <div className="absolute inset-0 bg-[#0c1320]/35 transition-opacity" onClick={onClose} />

            <div className="relative flex h-full w-full sm:max-w-[540px] flex-col bg-white shadow-2xl">

                {/* Header */}
                <div className="relative shrink-0 border-b border-hair px-4 py-4 sm:px-6 sm:py-5">
                    <button
                        onClick={onClose}
                        className="absolute right-2.5 top-2.5 sm:right-3.5 sm:top-3.5 flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:bg-surface-soft hover:text-ink-900"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    </button>
                    <h2 className="text-[17px] sm:text-[18px] font-bold text-ink-900 pr-8">Add New Vendor</h2>
                    <p className="mt-0.5 text-[12px] sm:text-[13px] text-muted pr-4">Complete details and upload required documents for approval</p>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-4 sm:gap-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 [-webkit-overflow-scrolling:touch]">

                    {/* Section 1 */}
                    <SectionTitle num={1}>Vendor Information</SectionTitle>
                    <Field label="Vendor Name" required>
                        <input className={inputCls} type="text" placeholder="e.g. Aramark Uniform Services" />
                    </Field>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Field label="Category" required>
                            <select className={selectCls}><option value="">Select category</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
                        </Field>
                        <Field label="Department" required>
                            <select className={selectCls}><option value="">Select department</option>{Object.entries(DEPTS).map(([k, d]) => <option key={k} value={k}>{d.name}</option>)}</select>
                        </Field>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Field label="Contact Name"><input className={inputCls} type="text" placeholder="Primary contact" /></Field>
                        <Field label="Contact Email"><input className={inputCls} type="email" placeholder="vendor@example.com" /></Field>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Field label="Phone"><input className={inputCls} type="tel" placeholder="(407) 555-0000" /></Field>
                        <Field label="FEIN / Tax ID"><input className={inputCls} type="text" placeholder="XX-XXXXXXX" /></Field>
                    </div>

                    {/* Section 2 */}
                    <SectionTitle num={2}>Contract Details</SectionTitle>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Field label="Monthly Cost" required><input className={inputCls} type="text" placeholder="$0.00" /></Field>
                        <Field label="Cost Type"><select className={selectCls}><option>Fixed Monthly</option><option>Variable</option><option>Per Occurrence</option></select></Field>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Field label="Contract Start"><input className={inputCls} type="date" /></Field>
                        <Field label="Contract End"><input className={inputCls} type="date" /></Field>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Field label="Notice Period (days)"><input className={inputCls} type="number" placeholder="e.g. 30" /></Field>
                        <Field label="Payment Terms"><select className={selectCls}><option>Net 30</option><option>Net 15</option><option>Net 45</option><option>Due on receipt</option></select></Field>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Field label="COI Expiry Date"><input className={inputCls} type="date" /></Field>
                        <Field label="M3 Vendor Code"><input className={inputCls} type="text" placeholder="e.g. VND-0042" /></Field>
                    </div>

                    <Field label="Notes">
                        <textarea className={inputCls + ' min-h-[72px] resize-y'} placeholder="Special terms, instructions, or notes…" />
                    </Field>

                    {/* Section 3 */}
                    <SectionTitle num={3}>Documents</SectionTitle>
                    <div
                        onClick={addDoc}
                        className="cursor-pointer rounded-[10px] border-2 border-dashed border-hair-2 bg-surface-soft p-4 sm:p-5 text-center transition hover:border-accent hover:bg-accent-soft"
                    >
                        <div className="mb-1.5 text-[20px] sm:text-[22px]">📎</div>
                        <strong className="block text-[12.5px] sm:text-[13.5px] font-semibold text-ink-900">Drag files here, or click to browse</strong>
                        <span className="mt-0.5 block text-[11.5px] sm:text-[12px] text-muted">COI · W9 · Contract · License — PDF, TIFF, PNG</span>
                    </div>

                    <div className="flex flex-col gap-1.5 pb-2">
                        {docs.map((doc, i) => (
                            <div key={i} className="flex items-center justify-between gap-2 rounded-lg border border-hair-2 bg-surface-soft px-2.5 py-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="shrink-0 rounded bg-[#1a2540] px-1.5 py-0.5 text-[9.5px] sm:text-[10.5px] font-bold text-white">
                                        {doc.type}
                                    </span>
                                    <span className="truncate text-[11.5px] sm:text-[12.5px] font-medium text-ink-700" title={doc.name}>
                                        {doc.name}
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeDoc(i)}
                                    className="shrink-0 rounded px-1.5 py-1 text-[16px] leading-none text-muted transition hover:bg-crit-bg hover:text-crit"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex shrink-0 flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-hair bg-surface-soft px-4 py-3.5 sm:px-6">
                    <button
                        onClick={onClose}
                        className="inline-flex h-9 w-full sm:w-auto justify-center items-center rounded-lg border border-hair-2 sm:border-transparent bg-white sm:bg-transparent px-4 text-[13px] font-medium text-ink-700 transition hover:bg-white sm:hover:border-hair-2 shadow-sm sm:shadow-none"
                    >
                        Cancel
                    </button>
                    <button className="inline-flex h-9 w-full sm:w-auto justify-center items-center rounded-lg bg-[#1a2540] px-5 text-[13px] font-semibold text-white transition hover:bg-[#1a2540]/90 shadow-soft">
                        Submit for Approval →
                    </button>
                </div>

            </div>
        </div>
    );
}