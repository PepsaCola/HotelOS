import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`overflow-hidden rounded-xl border border-hair-2 bg-white ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  noBorder?: boolean;
}

export function CardHeader({ title, subtitle, actions, noBorder = false }: CardHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-3 px-4 pb-3 pt-3 sm:flex-row sm:items-baseline sm:justify-between ${
        noBorder ? "" : "border-b border-hair"
      }`}
    >
      <div>
        <h2 className="text-[13.5px] font-bold tracking-tight text-ink-900">{title}</h2>
        {subtitle ? <p className="mt-px text-[11.5px] font-medium text-muted-strong">{subtitle}</p> : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center justify-end gap-2.5">{actions}</div>
      ) : null}
    </div>
  );
}
