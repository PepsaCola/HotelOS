import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import type { POLogPrefs } from "@/types/poLog";
import { CloseIcon } from "@/components/ui/icons";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Toggle } from "@/components/ui/Toggle";

interface PODisplayOptionsProps {
  open: boolean;
  onClose: () => void;
  prefs: POLogPrefs;
  setPref: <K extends keyof POLogPrefs>(key: K, value: POLogPrefs[K]) => void;
  /** Totals bar visibility lives in LayoutContext so the sidebar toggle stays in sync. */
  showTotalsBar: boolean;
  onShowTotalsBarChange: (v: boolean) => void;
}

const DENSITY_OPTIONS = [
  { value: "compact" as const, label: "compact" },
  { value: "regular" as const, label: "regular" },
  { value: "comfy" as const, label: "comfy" },
];

const GROUP_OPTIONS = [
  { value: "none" as const, label: "none" },
  { value: "department" as const, label: "department" },
];

export function PODisplayOptions({ open, onClose, prefs, setPref, showTotalsBar, onShowTotalsBarChange }: PODisplayOptionsProps) {
  if (!open) return null;

  return createPortal(
      <>
        {/* Invisible backdrop */}
        <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />

        <div
            className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-page-border bg-white shadow-2xl max-h-[calc(100vh-2rem)] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Tweaks"
        >
          <div className="flex items-center justify-between border-b border-hair px-[18px] py-3">
            <b className="text-sm font-bold tracking-tight text-ink-900">Tweaks</b>
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="grid h-7 w-7 place-items-center rounded-md text-muted-strong hover:bg-surface-muted hover:text-ink-900"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-[18px] pt-3.5">
            <Section>Layout</Section>

            <FieldColumn label="Density">
              <SegmentedControl
                  fullWidth
                  options={DENSITY_OPTIONS}
                  value={prefs.density}
                  onChange={(v) => setPref("density", v)}
                  aria-label="Density"
              />
            </FieldColumn>

            <FieldColumn label="Group by">
              <SegmentedControl
                  fullWidth
                  options={GROUP_OPTIONS}
                  value={prefs.groupBy}
                  onChange={(v) => setPref("groupBy", v)}
                  aria-label="Group by"
              />
            </FieldColumn>

            <FieldRow label="Show KPI strip">
              <Toggle checked={prefs.showHero} onChange={(v) => setPref("showHero", v)} label="Show KPI strip" />
            </FieldRow>
            <FieldRow label="Show totals bar">
              <Toggle checked={showTotalsBar} onChange={onShowTotalsBarChange} label="Show totals bar" />
            </FieldRow>
            <FieldRow label="Show vendor under desc.">
              <Toggle checked={prefs.showVendor} onChange={(v) => setPref("showVendor", v)} label="Show vendor" />
            </FieldRow>

            <Section>Financial emphasis</Section>

            <FieldRow label="Highlight large amounts">
              <Toggle checked={prefs.highlightLarge} onChange={(v) => setPref("highlightLarge", v)} label="Highlight large amounts" />
            </FieldRow>

            <FieldColumn
                label="Large-amount threshold"
                aside={`${prefs.largeThreshold}$`}
            >
              <input
                  type="range"
                  min={1000}
                  max={50000}
                  step={1000}
                  value={prefs.largeThreshold}
                  onChange={(e) => setPref("largeThreshold", Number(e.target.value))}
                  className="h-1 w-full cursor-pointer appearance-none rounded-full bg-hair-2 accent-accent"
              />
            </FieldColumn>
          </div>
        </div>
      </>,
      document.body,
  );
}

function Section({ children }: { children: ReactNode }) {
  return (
      <div className="border-t border-hair pt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-strong first:border-t-0 first:pt-0">
        {children}
      </div>
  );
}

function FieldColumn({ label, aside, children }: { label: string; aside?: string; children: ReactNode }) {
  return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between text-[13px] font-medium text-ink-700">
          <span>{label}</span>
          {aside ? <span className="text-xs font-medium tabular-nums text-muted-strong">{aside}</span> : null}
        </div>
        {children}
      </div>
  );
}

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
      <div className="flex items-center justify-between gap-2.5">
        <div className="text-[13px] font-medium text-ink-700">{label}</div>
        {children}
      </div>
  );
}