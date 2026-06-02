import { useNavigate } from "react-router-dom";
import { FilterIcon, DownloadIcon, PlusIcon } from "@/components/ui/icons";

interface POLogHeaderProps {
  subtitle: string;
}

export function POLogHeader({ subtitle }: POLogHeaderProps) {
  const navigate = useNavigate();

  return (
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        {/* ── Текстовий блок ── */}
        <div className="w-full sm:w-auto">
          <h1 className="text-[22px] sm:text-2xl font-bold leading-tight tracking-tight text-ink-900">
            Purchase Order Log
          </h1>
          <p className="mt-1 text-[13px] sm:text-[13.5px] text-muted-strong">
            {subtitle}
          </p>
        </div>

        {/* ── Блок кнопок ── */}
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center mt-1 sm:mt-0">

          <button className="inline-flex h-9 w-full sm:w-auto justify-center items-center gap-1.5 sm:gap-2 rounded-[9px] px-2 sm:px-3.5 text-[12.5px] sm:text-[13.5px] font-medium text-ink-700 hover:bg-surface-chip">
            <FilterIcon className="h-[15px] w-[15px] shrink-0" />
            <span className="hidden sm:inline">Advanced filter</span>
            <span className="sm:hidden">Filter</span>
          </button>

          <button className="inline-flex h-9 w-full sm:w-auto justify-center items-center gap-1.5 sm:gap-2 rounded-[9px] border border-hair-2 bg-white px-2 sm:px-3.5 text-[12.5px] sm:text-[13.5px] font-medium text-ink-900 shadow-sm sm:shadow-none hover:bg-surface-soft">
            <DownloadIcon className="h-[15px] w-[15px] shrink-0" />
            <span className="truncate">Export</span>
          </button>

          <button
              type="button"
              onClick={() => navigate("/create-po")}
              className="col-span-2 inline-flex h-9 w-full sm:col-span-1 sm:w-auto justify-center items-center gap-1.5 sm:gap-2 rounded-[9px] border border-ink-900 bg-ink-900 px-2 sm:px-3.5 text-[12.5px] sm:text-[13.5px] font-medium text-white shadow-soft hover:bg-black"
          >
            <PlusIcon className="h-[15px] w-[15px] shrink-0" />
            <span className="hidden sm:inline">New Purchase Order</span>
            <span className="sm:hidden">New PO</span>
          </button>

        </div>
      </div>
  );
}