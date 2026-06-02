import type { KpiCard } from "@/types/dashboard";

interface KpiStripProps {
  cards: KpiCard[];
}

const cardToneClass: Record<KpiCard["tone"], string> = {
  good: "border-[#c9e7d2] bg-gradient-to-b from-good-soft to-white",
  warn: "border-[#ecd5a8] bg-gradient-to-b from-warn-soft to-white",
  crit: "border-[#f3cfcb] bg-gradient-to-b from-crit-soft to-white",
  default: "border-hair-2 bg-white",
};

const valueToneClass: Record<KpiCard["tone"], string> = {
  good: "text-good",
  warn: "text-warn",
  crit: "text-crit",
  default: "text-ink-900",
};

const dotToneClass = {
  good: "bg-good",
  warn: "bg-warn",
  crit: "bg-crit",
} as const;

const deltaToneClass = {
  up: "bg-good-bg text-good",
  down: "bg-crit-bg text-crit",
} as const;

export function KpiStrip({ cards }: KpiStripProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-xl border p-4 ${cardToneClass[card.tone]}`}>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.07em] text-muted-strong">
            {card.label}
          </div>
          <div
            className={`mt-1.5 flex flex-wrap items-baseline gap-1.5 text-2xl font-bold tracking-tight ${valueToneClass[card.tone]}`}
          >
            {card.value}
            {card.delta && card.deltaTone ? (
              <span className={`rounded-md px-1.5 py-0.5 text-[11.5px] font-bold ${deltaToneClass[card.deltaTone]}`}>
                {card.delta}
              </span>
            ) : null}
            {card.subValue ? (
              <span className="text-xs font-medium text-muted-strong">{card.subValue}</span>
            ) : null}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11.5px] text-muted-strong">
            <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${dotToneClass[card.dotTone]}`} />
            {card.detail}
          </div>
        </div>
      ))}
    </div>
  );
}
