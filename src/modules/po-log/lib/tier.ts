export type AmountTier = "" | "lg" | "xl";

/**
 * Classifies an amount for visual emphasis:
 *   lg = ≥ threshold        (10k default)
 *   xl = ≥ threshold × 5     (50k default) — gets an accent bar
 */
export function tier(value: number, threshold: number): AmountTier {
  if (value >= threshold * 5) return "xl";
  if (value >= threshold) return "lg";
  return "";
}
