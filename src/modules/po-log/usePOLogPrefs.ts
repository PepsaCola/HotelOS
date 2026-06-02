import { useCallback, useEffect, useState } from "react";
import type { POLogPrefs } from "@/types/poLog";

const DEFAULT_PREFS: POLogPrefs = {
  density: "regular",
  groupBy: "none",
  showVendor: true,
  highlightLarge: true,
  largeThreshold: 10000,
  showHero: true,
  showTotalsBar: true,
};

const PREFS_KEY = "po-log.prefs";

/**
 * Persisted display preferences. Reads/writes localStorage so density,
 * grouping, etc. survive reload. Swap for the host app's user-profile store
 * when wiring into the backend.
 */
export function usePOLogPrefs(): [POLogPrefs, <K extends keyof POLogPrefs>(key: K, value: POLogPrefs[K]) => void] {
  const [prefs, setPrefs] = useState<POLogPrefs>(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      return raw ? { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<POLogPrefs>) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      /* storage unavailable — preferences stay in-memory for the session */
    }
  }, [prefs]);

  const setPref = useCallback(
    <K extends keyof POLogPrefs>(key: K, value: POLogPrefs[K]) => {
      setPrefs((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  return [prefs, setPref];
}
