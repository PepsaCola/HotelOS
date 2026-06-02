import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { primaryNav, secondaryNav } from "@/lib/nav";
import type { NavItem } from "@/lib/nav";
import { useLayout } from "@/contexts/LayoutContext";
import { CloseIcon, LogoutIcon, PlusIcon } from "@/components/ui/icons";
import logoImg from "@/assets/Logo.svg";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onOpenDisplayOptions?: () => void;
}

function Toggle({ checked, onChange, disabled = false }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
      <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          } ${checked ? "bg-[#4949f3]" : "bg-gray-200"}`}
      >
      <span
          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
              checked ? "translate-x-4" : "translate-x-0"
          }`}
      />
      </button>
  );
}

const DisplayOptionsIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 18 18" fill="none" className={className} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M2 4.5h14M5 9h8M7.5 13.5h3" />
    </svg>
);

const ChevronIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 16 16" fill="none" className={className} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6l4 4 4-4" />
    </svg>
);

function navItemClasses(isActive: boolean) {
  return [
    "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm leading-4 text-left transition-colors",
    isActive ? "bg-chip-active text-blue font-medium" : "text-ink hover:bg-surface-muted",
  ].join(" ");
}

function subItemClasses(isActive: boolean) {
  return [
    "block rounded-[10px] px-3 py-2 text-[13px] leading-4 text-left transition-colors",
    isActive ? "bg-chip-active text-blue font-medium" : "text-muted hover:bg-surface-muted hover:text-ink",
  ].join(" ");
}

/** A primary nav entry that expands to reveal its sub-pages. */
function NavGroup({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const { pathname } = useLocation();
  const Icon = item.icon;
  const sectionActive = pathname.startsWith(item.path);
  const [open, setOpen] = useState(sectionActive);

  useEffect(() => {
    if (sectionActive) setOpen(true);
  }, [sectionActive]);

  return (
      <div className="flex flex-col gap-px">
        <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className={`${navItemClasses(sectionActive)} w-full justify-between`}
        >
          <span className="flex items-center gap-3">
            <span className="grid h-[18px] w-[18px] flex-none place-items-center">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <span>{item.label}</span>
          </span>
          <ChevronIcon className={`h-4 w-4 flex-none transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>

        {open && (
            <div className="mt-px flex flex-col gap-px pl-[30px]">
              {item.children!.map((child) => (
                  <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={onNavigate}
                      className={({ isActive }) => subItemClasses(isActive)}
                  >
                    {child.label}
                  </NavLink>
              ))}
            </div>
        )}
      </div>
  );
}

export default function Sidebar({
                                  open,
                                  onClose,
                                  onOpenDisplayOptions,
                                }: SidebarProps) {
  const { pathname } = useLocation();
  const { showTotalsBar, setShowTotalsBar } = useLayout();
  // The Totals Bar is a PO Log feature; the toggle is inactive elsewhere.
  const totalsBarAvailable = pathname.startsWith("/po-log");

  return (
      <>
        <div
            className={`fixed inset-0 z-30 bg-black/30 transition-opacity lg:hidden ${
                open ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={onClose}
            aria-hidden="true"
        />

        <aside
            className={`fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col overflow-hidden border-r border-page-border bg-white transition-transform lg:static lg:z-auto lg:h-screen lg:translate-x-0 lg:sticky lg:top-0 ${
                open ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* Brand */}
          <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-page-border px-4">
            <NavLink to="/" className="flex items-center min-w-0 py-1">
              <img
                  src={logoImg}
                  alt="GORVA Hotel Operations Platform"
                  className="h-9 w-auto object-contain select-none"
              />
            </NavLink>
            <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-surface-muted lg:hidden shrink-0"
                onClick={onClose}
                aria-label="Close navigation"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex min-h-0 flex-1 flex-col justify-between gap-4 overflow-y-auto p-4">

            {/* Top: New PO + primary nav */}
            <div className="flex flex-col gap-4">
              <NavLink
                  to="/create-po"
                  onClick={onClose}
                  className="flex h-10 items-center gap-3 rounded-[10px] bg-gradient-to-b from-[#6a6aff] to-[#4949f3] px-3 text-sm font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]"
              >
                <PlusIcon className="h-[18px] w-[18px]" />
                <span>New Purchase Order</span>
              </NavLink>

              <nav className="flex flex-col gap-px" aria-label="Primary">
                {primaryNav.map((item) =>
                    item.children?.length ? (
                        <NavGroup key={item.path} item={item} onNavigate={onClose} />
                    ) : (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) => navItemClasses(isActive)}
                        >
                  <span className="grid h-[18px] w-[18px] flex-none place-items-center">
                    <item.icon className="h-[18px] w-[18px]" />
                  </span>
                          <span>{item.label}</span>
                        </NavLink>
                    ),
                )}
              </nav>
            </div>

            {/* Bottom: Totals Bar + Display Options + Settings + Logout */}
            <div className="flex flex-col gap-3">

              {/* Totals Bar toggle — only active on PO Log */}
              <div className="flex items-center justify-between rounded-[10px] px-3 py-2 hover:bg-surface-muted transition-colors">
                <span className={`text-sm ${totalsBarAvailable ? "text-ink" : "text-muted"}`}>Totals Bar</span>
                <Toggle
                    checked={totalsBarAvailable && showTotalsBar}
                    onChange={setShowTotalsBar}
                    disabled={!totalsBarAvailable}
                />
              </div>

              <div className="h-px w-full bg-page-border" />

              <nav className="flex flex-col gap-px" aria-label="Settings">
                {/* Display Options */}
                <button
                    type="button"
                    onClick={onOpenDisplayOptions}
                    className={navItemClasses(false)}
                >
                <span className="grid h-[18px] w-[18px] flex-none place-items-center">
                  <DisplayOptionsIcon className="h-[18px] w-[18px]" />
                </span>
                  <span>Display Options</span>
                </button>

                {secondaryNav.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        onClick={onClose}
                        className={({ isActive }) => navItemClasses(isActive)}
                    >
                  <span className="grid h-[18px] w-[18px] flex-none place-items-center">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                      <span>{label}</span>
                    </NavLink>
                ))}

                <button type="button" className={navItemClasses(false)}>
                <span className="grid h-[18px] w-[18px] flex-none place-items-center">
                  <LogoutIcon className="h-[18px] w-[18px]" />
                </span>
                  <span>Log Out</span>
                </button>
              </nav>
            </div>

          </div>
        </aside>
      </>
  );
}