// Shared domain types for the Design Concept Generator.

export type StyleCategory = "Minimalist" | "Contemporary" | "Dynamic";

export type ImageStatus = "idle" | "loading" | "done" | "error";

/** Side of a concept: the homepage ("front") or inner sections ("back"). */
export type ConceptSide = "front" | "back";

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

/** Persisted application state (localStorage). */
export interface PersistedState {
  version: number;
  inputs: DesignInputs;
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
