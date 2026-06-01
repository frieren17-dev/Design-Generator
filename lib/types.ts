// Shared domain types for the Design Concept Generator.

export type StyleCategory = "Minimalist" | "Contemporary" | "Dynamic";

export type ImageStatus = "idle" | "loading" | "done" | "error";

/**
 * What is being generated: a concept's homepage ("front"), its inner sections
 * ("back"), or a moodboard's reference/mood image ("mood").
 */
export type ConceptSide = "front" | "back" | "mood";

/** Generation state for a single image (front or back) of a concept. */
export interface ConceptImage {
  status: ImageStatus;
  url?: string;
  taskId?: string;
  error?: string;
}

/** The three user-supplied inputs shared by all six concepts. */
export interface DesignInputs {
  idea: string;
  theme: string;
  products: string;
}

/** One of the six generated homepage design concepts. */
export interface Concept {
  id: string;
  number: number; // 1..6
  category: StyleCategory;
  name: string;
  description: string;
  frontPrompt: string;
  backPrompt: string;
  frontImage: ConceptImage;
  backImage: ConceptImage;
}

/** A single named color swatch on a moodboard. */
export interface Swatch {
  role: string; // e.g. "Paper", "Ink", "Accent"
  hex: string;
}

/** A display + body type pairing shown as a specimen. */
export interface TypePairing {
  displayName: string;
  displayVar: string; // CSS font-family value, e.g. "var(--font-display)"
  bodyName: string;
  bodyVar: string;
  rule: string; // short art-direction note
}

/**
 * A curated reference board for one style direction — the inspiration the
 * homepage concepts are designed from. Color, typography, imagery, UI patterns.
 */
export interface Moodboard {
  id: string;
  category: StyleCategory;
  direction: string; // the board's name, e.g. "Quiet & Considered"
  summary: string;
  keywords: string[];
  palette: Swatch[];
  type: TypePairing;
  patterns: string[];
  moodPrompt: string;
  moodImage: ConceptImage; // AI-generated texture/material collage
}

/** Persisted application state (localStorage). */
export interface PersistedState {
  version: number;
  inputs: DesignInputs;
  moodboards: Moodboard[];
  concepts: Concept[];
}

/** Request body for POST /api/generate. */
export interface GenerateRequest {
  prompt: string;
  side: ConceptSide;
}

/** Response from POST /api/generate. */
export interface GenerateResponse {
  url?: string;
  taskId?: string;
  error?: string;
}
