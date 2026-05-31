import type { Concept, DesignInputs, StyleCategory } from "./types";

/**
 * Deterministic concept engine.
 *
 * The user supplies only Idea / Theme / Products. From those three inputs we
 * synthesise six distinct homepage design concepts — two per style category —
 * by interpolating the inputs into per-archetype templates. No external/LLM
 * call is involved; everything here is editable by the user before they
 * regenerate images.
 */

interface Archetype {
  category: StyleCategory;
  name: string;
  /** One-line visual direction, with {idea}/{theme}/{products} placeholders. */
  description: string;
  /** Style-specific art-direction appended to every prompt for this archetype. */
  artDirection: string;
}

const ARCHETYPES: Archetype[] = [
  // ---- Minimalist (2) ----
  {
    category: "Minimalist",
    name: "Quiet Canvas",
    description:
      "Whitespace-forward layout for {idea} — a restrained palette and a single confident hero that lets {products} breathe.",
    artDirection:
      "ultra-minimalist web design, generous negative space, a tight neutral palette (off-white, soft grey, one muted accent), a single elegant serif or grotesque headline, thin hairline dividers, lots of breathing room, calm and editorial",
  },
  {
    category: "Minimalist",
    name: "Essential Grid",
    description:
      "A precise modular grid for {idea}: muted tones, crisp type, and {products} presented as a clean, orderly catalogue.",
    artDirection:
      "clean minimalist e-commerce layout, strict modular grid of product cards, monochrome plus one subtle accent color, small refined sans-serif type, plenty of margin, understated and premium, no clutter",
  },
  // ---- Contemporary (2) ----
  {
    category: "Contemporary",
    name: "Soft Modern",
    description:
      "On-trend and approachable for {idea} — rounded cards, gentle gradients, and warm imagery showcasing {products}.",
    artDirection:
      "modern contemporary web design, large rounded corners, soft layered shadows, subtle pastel gradient accents, friendly medium-weight sans-serif, generous rounded buttons, polished SaaS/startup feel, professional but expressive",
  },
  {
    category: "Contemporary",
    name: "Editorial Layers",
    description:
      "A magazine-style take on {idea}: confident typography, layered sections, and lifestyle framing of {products}.",
    artDirection:
      "contemporary editorial website, asymmetric layered sections, mix of large display type and small caption text, full-bleed lifestyle photography, tasteful overlap of image and text, refined modern color story, sophisticated",
  },
  // ---- Dynamic (2) ----
  {
    category: "Dynamic",
    name: "Bold Statement",
    description:
      "High-impact and unmissable for {idea} — oversized type, strong contrast, and a striking hero that makes {products} pop.",
    artDirection:
      "bold dynamic web design, oversized high-contrast typography, dramatic dark background with a vivid saturated accent, big punchy hero headline, strong visual hierarchy, energetic and confident, striking and memorable",
  },
  {
    category: "Dynamic",
    name: "Kinetic Splash",
    description:
      "Energetic and immersive for {idea}: diagonal compositions, vivid color blocks, and {products} framed with momentum.",
    artDirection:
      "vibrant dynamic landing page, diagonal and angled color blocks, vivid clashing-but-balanced color palette, expressive bold sans-serif, sense of motion and momentum, layered overlapping elements, eye-catching and lively",
  },
];

function fill(template: string, inputs: DesignInputs): string {
  return template
    .replaceAll("{idea}", inputs.idea.trim() || "the brand")
    .replaceAll("{theme}", inputs.theme.trim() || "a cohesive aesthetic")
    .replaceAll("{products}", inputs.products.trim() || "the products");
}

/** Shared framing so every image reads as a real website homepage mock, not a photo. */
function buildFrontPrompt(a: Archetype, inputs: DesignInputs): string {
  return [
    `A polished website homepage design mockup for ${inputs.idea.trim() || "an online brand"}.`,
    `Theme and mood: ${inputs.theme.trim() || "cohesive and intentional"}.`,
    `Featured products: ${inputs.products.trim() || "the product range"}.`,
    `Full homepage UI shown as a flat 2D web design screenshot in a browser: a top navigation bar with a small logo and menu links, a large hero section with a headline, supporting subtext and a clear call-to-action button, followed by a product showcase grid and a footer.`,
    `Style: ${a.artDirection}.`,
    `High-fidelity UI/UX mockup, realistic web layout, crisp legible placeholder text, desktop viewport, no people staring at camera, looks like a real shipped homepage.`,
  ].join(" ");
}

function buildBackPrompt(a: Archetype, inputs: DesignInputs): string {
  return [
    `Inner content pages for the same ${inputs.idea.trim() || "online brand"} website, matching its homepage style.`,
    `Theme and mood: ${inputs.theme.trim() || "cohesive and intentional"}. Products: ${inputs.products.trim() || "the product range"}.`,
    `Show supporting sections as a flat 2D web design screenshot: an "about / our story" section, a detailed product detail layout with imagery and description, a features or gallery section, and a newsletter/footer area.`,
    `Style: ${a.artDirection}.`,
    `High-fidelity UI/UX mockup, consistent with the homepage, realistic web layout, crisp legible placeholder text, desktop viewport.`,
  ].join(" ");
}

/** Build the six concepts from the shared inputs. */
export function buildConcepts(inputs: DesignInputs): Concept[] {
  return ARCHETYPES.map((a, i) => ({
    id: `concept-${i + 1}`,
    number: i + 1,
    category: a.category,
    name: a.name,
    description: fill(a.description, inputs),
    frontPrompt: buildFrontPrompt(a, inputs),
    backPrompt: buildBackPrompt(a, inputs),
    frontImage: { status: "idle" as const },
    backImage: { status: "idle" as const },
  }));
}

/** Sample data from CLAUDE.md, used to pre-fill the form on first run. */
export const SAMPLE_INPUTS: DesignInputs = {
  idea: "An online store for handcrafted, eco-friendly coffee and brewing gear",
  theme: "Warm, earthy, sustainable — natural textures with a cozy modern feel",
  products:
    "Single-origin coffee beans, reusable pour-over kits, ceramic mugs, compostable filters",
};
