import type { DepartmentAllocation } from "@/types/createPO.ts";

interface Props {
    departments: DepartmentAllocation[];
    onUpdate: (id: number, field: "account" | "amount", value: string) => void;
}

const inputCls =
    "h-10 w-full rounded-xl border border-hair-2 bg-white px-3 text-[13.5px] sm:text-sm text-ink-700 transition-colors focus:border-blue focus:outline-none";

export default function DepartmentsSection({ departments, onUpdate }: Props) {
    return (
        <div className="overflow-hidden rounded-[16px] sm:rounded-[22px] border border-page-border bg-white shadow-soft">

            {/* ── Header ── */}
            <div className="flex items-center gap-2.5 border-b border-page-border px-4 sm:px-[18px] py-3.5 sm:py-[14px]">
                <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-soft text-[11px] sm:text-xs font-bold text-accent-ink">
                    4
                </div>
                <h2 className="m-0 text-[14px] sm:text-[15px] font-semibold text-ink">
                    Departments
                </h2>
            </div>

            <div className="px-4 sm:px-[18px]">

                {/* ── Desktop Column Headers ── */}
                <div className="hidden sm:grid mt-[14px] grid-cols-[120px_1fr_120px] gap-5 rounded-lg border border-page-border bg-[#fbfbfd] px-3 py-[11px] text-[11.5px] sm:text-xs font-medium text-muted">
                    <div>Department</div>
                    <div>Account</div>
                    <div>Amount</div>
                </div>

                {/* ── Department Rows ── */}
                {/* Додано mt-2 для мобільного, щоб відокремити перший елемент від шапки */}
                <div className="mt-2 sm:mt-0">
                    {departments.map((dept) => (
                        <div
                            key={dept.id}
                            // Мобільний: вертикально (flex-col). ПК: сітка (grid)
                            className="flex flex-col sm:grid sm:grid-cols-[120px_1fr_120px] sm:items-center gap-3 sm:gap-5 border-b border-page-border py-4 sm:px-3 sm:py-[14px] last:border-b-0"
                        >
                            <div className="text-[13px] sm:text-[13.5px] font-semibold sm:font-medium text-ink">
                                {dept.label}
                            </div>

                            <label className="flex flex-col gap-1.5 sm:block">
                                {/* Мітка показується тільки на мобільному, бо на ПК є спільна шапка */}
                                <span className="sm:hidden text-[11.5px] font-medium text-ink-700">Account</span>
                                <input
                                    type="text"
                                    value={dept.account}
                                    placeholder="Account"
                                    onChange={(e) => onUpdate(dept.id, "account", e.target.value)}
                                    className={inputCls}
                                />
                            </label>

                            <label className="flex flex-col gap-1.5 sm:block">
                                <span className="sm:hidden text-[11.5px] font-medium text-ink-700">Amount</span>
                                <input
                                    type="text"
                                    value={dept.amount}
                                    placeholder="0.00"
                                    onChange={(e) => onUpdate(dept.id, "amount", e.target.value)}
                                    className={inputCls}
                                />
                            </label>
                        </div>
                    ))}
                </div>
                <div className="h-2 sm:h-4" />
            </div>

        </div>
    );
}