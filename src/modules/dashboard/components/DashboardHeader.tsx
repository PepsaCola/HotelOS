import type { DashboardMeta } from "@/types/dashboard";

interface DashboardHeaderProps {
  meta: DashboardMeta;
}

export function DashboardHeader({ meta }: DashboardHeaderProps) {
  return (
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

        {/* ── Текстовий блок ── */}
        <div className="w-full sm:w-auto">
          <h1 className="text-[22px] sm:text-2xl font-bold leading-tight tracking-tight text-ink-900">
            Dashboard
          </h1>

          {/* Адаптивні переноси для мета-даних */}
          <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] sm:text-[12.5px] text-muted-strong">
          <span className="flex items-center gap-1.5">
            Overview for <b className="font-semibold text-ink-700">{meta.hotel}</b>
          </span>

            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
            <span className="sm:hidden">|</span> period closes in{" "}
              <b className="font-semibold text-ink-700">{meta.daysToClose} days</b>
          </span>

            <span className="hidden lg:inline">·</span>
            <span className="flex items-center gap-1.5">
            <span className="lg:hidden">|</span> last sync from M3{" "}
              <b className="font-semibold text-ink-700">{meta.lastSync}</b>
          </span>
          </div>
        </div>

        {/* ── Блок кнопок ── */}
        {/* На мобільному: рівна сітка 1х2. На планшеті/ПК: flex-рядок */}
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-2.5 mt-1 sm:mt-0">

          <button
              type="button"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-1.5 sm:gap-2 rounded-[9px] border border-hair-2 bg-white px-2 sm:px-3.5 py-2 text-[12.5px] sm:text-[13.5px] font-semibold text-ink-900 transition hover:bg-surface-soft shadow-sm sm:shadow-none"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[15px] w-[15px] shrink-0">
              <rect x="4" y="5" width="16" height="15" rx="3" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 3.75V7M16 3.75V7M4 9.5H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span className="truncate">{meta.periodLabel}</span>
          </button>

          <button
              type="button"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-1.5 sm:gap-2 rounded-[9px] border border-ink-900 bg-ink-900 px-2 sm:px-3.5 py-2 text-[12.5px] sm:text-[13.5px] font-semibold text-white transition shadow-soft hover:bg-black"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[15px] w-[15px] shrink-0">
              <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="truncate">Export Report</span>
          </button>

        </div>

      </div>
  );
}
