import type { Concept, DesignInputs, Moodboard, PersistedState } from "./types";

/**
 * localStorage persistence for inputs + moodboards + concepts. Versioned so the
 * schema can evolve without crashing on stale data.
 */

const STORAGE_KEY = "dcg:v2";
const STORAGE_VERSION = 2;

export function loadState(): {
  inputs: DesignInputs;
  moodboards: Moodboard[];
  concepts: Concept[];
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (
      parsed?.version !== STORAGE_VERSION ||
      !parsed.inputs ||
      !Array.isArray(parsed.concepts) ||
      !Array.isArray(parsed.moodboards)
    ) {
      return null;
    }
    return {
      inputs: parsed.inputs,
      moodboards: parsed.moodboards,
      concepts: parsed.concepts,
    };
  } catch {
    return null;
  }
}

export function saveState(
  inputs: DesignInputs,
  moodboards: Moodboard[],
  concepts: Concept[],
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: PersistedState = {
      version: STORAGE_VERSION,
      inputs,
      moodboards,
      concepts,
    };
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
