interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  "aria-label"?: string;
  variant?: "light" | "dark";
  /** Stretch to fill the parent width (e.g. inside a settings column). Default: compact, content-width. */
  fullWidth?: boolean;
}

/** Pill-style toggle group used across dashboard cards and other modules. */
export function SegmentedControl<T extends string>({
                                                     options,
                                                     value,
                                                     onChange,
                                                     "aria-label": ariaLabel,
                                                     variant = "light",
                                                     fullWidth = false,
                                                   }: SegmentedControlProps<T>) {
  return (
      <div
          role="tablist"
          aria-label={ariaLabel}
          className={`${fullWidth ? "flex w-full" : "inline-flex w-auto"} rounded-[10px] border border-hair-2 bg-[#fafaf6] p-0.5`}
      >
        {options.map((option) => {
          const isActive = option.value === value;
          return (
              <button
                  key={option.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onChange(option.value)}
                  className={`${fullWidth ? "flex-1" : ""} whitespace-nowrap rounded-[7px] px-2.5 py-1 text-center text-xs font-semibold transition-colors ${
                      isActive
                          ? variant === "dark"
                              ? "bg-[#0c1320] text-white shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                              : "bg-white text-ink-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                          : "text-muted-strong hover:text-ink-900"
                  }`}
              >
                {option.label}
              </button>
          );
        })}
      </div>
  );
}