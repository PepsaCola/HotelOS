import { NavLink } from "react-router-dom";
import { BellIcon, ChevronRightIcon, HelpIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";
import type { Crumb } from "@/lib/nav";

interface TopbarProps {
  crumbs: Crumb[];
  onOpenMenu: () => void;
}

function CrumbLabel({ crumb, isLast }: { crumb: Crumb; isLast: boolean }) {
  const cls = isLast
    ? "font-semibold text-ink whitespace-nowrap"
    : "text-muted transition-colors hover:text-ink whitespace-nowrap";

  if (isLast) return <span className={cls}>{crumb.label}</span>;
  if (crumb.to) return <NavLink to={crumb.to} className={cls}>{crumb.label}</NavLink>;
  if (crumb.onClick)
    return <button type="button" onClick={crumb.onClick} className={cls}>{crumb.label}</button>;
  return <span className={cls}>{crumb.label}</span>;
}

export default function Topbar({ crumbs, onOpenMenu }: TopbarProps) {
  // Breadcrumb trail (route-derived default or detail-view override via LayoutContext).
  return (
    <header className="flex h-[60px] flex-none items-center gap-4 border-b border-page-border bg-white px-4 lg:px-7">
      <button
        type="button"
        className="grid h-9 w-9 flex-none place-items-center rounded-md text-ink hover:bg-surface-muted lg:hidden"
        onClick={onOpenMenu}
        aria-label="Open navigation"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-sm font-medium sm:flex">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={`${crumb.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && <ChevronRightIcon className="h-3.5 w-3.5 flex-none text-muted" />}
              <CrumbLabel crumb={crumb} isLast={isLast} />
            </span>
          );
        })}
      </nav>

      <div className="mx-auto flex h-9 w-full max-w-[400px] items-center gap-2 rounded-full border border-page-border bg-white px-3 shadow-soft">
        <SearchIcon className="h-5 w-5 flex-none text-muted" />
        <input
          type="search"
          placeholder="Search PO #, vendor, department…"
          className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </div>

      <div className="flex flex-none items-center gap-3">
        <button
          type="button"
          className="hidden h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-ink hover:bg-surface-muted md:flex"
        >
          <HelpIcon className="h-5 w-5" />
          <span>Help</span>
        </button>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full border border-page-border text-ink hover:bg-surface-muted"
          aria-label="Notifications"
        >
          <BellIcon className="h-5 w-5" />
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-ink text-base font-medium text-white">
          DP
        </div>
      </div>
    </header>
  );
}
