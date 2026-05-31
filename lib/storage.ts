import type { Concept, DesignInputs, PersistedState } from "./types";

/**
 * localStorage persistence for inputs + concepts. Versioned so the schema can
 * evolve without crashing on stale data.
 */

const STORAGE_KEY = "dcg:v1";
const STORAGE_VERSION = 1;

export function loadState(): { inputs: DesignInputs; concepts: Concept[] } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (
      parsed?.version !== STORAGE_VERSION ||
      !parsed.inputs ||
      !Array.isArray(parsed.concepts)
    ) {
      return null;
    }
    return { inputs: parsed.inputs, concepts: parsed.concepts };
  } catch {
    return null;
  }
}

export function saveState(inputs: DesignInputs, concepts: Concept[]): void {
  if (typeof window === "undefined") return;
  try {
    const payload: PersistedState = { version: STORAGE_VERSION, inputs, concepts };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota or serialization failure — non-fatal; state simply won't persist.
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
