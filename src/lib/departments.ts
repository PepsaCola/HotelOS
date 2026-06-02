import type { DepartmentKey } from "@/types/dashboard";

/** Maps a department to its Tailwind background-color utility (see @theme dept palette). */
export const departmentBgClass: Record<DepartmentKey, string> = {
  Rooms: "bg-dept-rooms",
  "F&B": "bg-dept-fb",
  "A&G": "bg-dept-ag",
  IT: "bg-dept-it",
  "S&M": "bg-dept-sm",
  "R&M": "bg-dept-rm",
};
