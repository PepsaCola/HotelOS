import PageHeader from "./PageHeader";

interface PagePlaceholderProps {
  title: string;
  subtitle?: string;
}

export default function PagePlaceholder({ title, subtitle }: PagePlaceholderProps) {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={title} subtitle={subtitle} />
      <div className="grid min-h-[320px] place-items-center rounded-2xl border border-dashed border-page-border bg-surface-soft p-10 text-center">
        <div className="max-w-sm">
          <p className="text-sm font-medium text-ink">Module in progress</p>
          <p className="mt-2 text-[13px] leading-5 text-muted">
            This screen is being migrated from the prototype into the unified HotelOS app.
          </p>
        </div>
      </div>
    </div>
  );
}
