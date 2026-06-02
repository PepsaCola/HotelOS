import type { DepartmentKey } from "@/types/dashboard";
import { departmentBgClass } from "@/lib/departments";

interface DeptTagProps {
  dept: DepartmentKey;
}

export function DeptTag({ dept }: DeptTagProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-bg px-2 py-0.5 text-[11px] font-semibold text-neutral-ink">
      <span className={`h-1.5 w-1.5 rounded-full ${departmentBgClass[dept]}`} />
      {dept}
    </span>
  );
}
