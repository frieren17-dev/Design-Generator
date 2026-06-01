import type {
  DesignInputs,
  Moodboard,
  StyleCategory,
  Swatch,
  TypePairing,
} from "./types";

/**
 * Deterministic moodboard engine.
 *
 * From the shared brief we synthesise three curated reference boards — one per
 * style direction (Minimalist / Contemporary / Dynamic). Each board surfaces the
 * inspiration the homepage concepts are designed from: a color palette, a
 * typography pairing, UI-pattern notes, and a prompt for an AI "mood image".
 *
 * Everything except the mood image is computed instantly with no API call, so a
 * full, useful moodboard exists even before any credits are spent.
 */

// ---- Color palette families, chosen by detecting mood words in the brief ----

interface PaletteFamily {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  accentAlt: string;
  deep: string;
}

const FAMILIES: Record<string, PaletteFamily> = {
  warm: {
    bg: "#F4ECE0",
    surface: "#FBF6EE",
    ink: "#2A2018",
    muted: "#8C7B66",
    accent: "#B5532B",
    accentAlt: "#6E7A45",
    deep: "#3A2A1E",
  },
  fresh: {
    bg: "#EEF2E9",
    surface: "#F8FAF4",
    ink: "#1F2A1E",
    muted: "#6E7A66",
    accent: "#4F7D45",
    accentAlt: "#C28A3D",
    deep: "#21331F",
  },
  cool: {
    bg: "#E9EEF2",
    surface: "#F5F8FB",
    ink: "#161E26",
    muted: "#66737F",
    accent: "#2E6F8E",
    accentAlt: "#C9613F",
    deep: "#11212B",
  },
  mono: {
    bg: "#F1F1EF",
    surface: "#FBFBFA",
    ink: "#161616",
    muted: "#7A7A78",
    accent: "#1A1A1A",
    accentAlt: "#9A9A98",
    deep: "#0C0C0C",
  },
  vibrant: {
    bg: "#FBF1E7",
    surface: "#FFFFFF",
    ink: "#1B1726",
    muted: "#7A7488",
    accent: "#E0453B",
    accentAlt: "#2D6CDF",
    deep: "#221C33",
  },
  luxe: {
    bg: "#16120D",
    surface: "#211C16",
    ink: "#EFE7D9",
    muted: "#9C8E76",
    accent: "#C8A24A",
    accentAlt: "#8A3535",
    deep: "#0B0907",
  },
};

// Ordered: the first family whose keywords match wins, so "warm/earthy" beats
// the generic "sustainable" → fresh overlap for e.g. the coffee sample.
const FAMILY_RULES: { key: keyof typeof FAMILIES; words: string[] }[] = [
  {
    key: "warm",
    words: ["warm", "earthy", "cozy", "cosy", "coffee", "rustic", "autumn", "terracotta", "wood", "natural texture", "artisan", "handcrafted", "roast"],
  },
  {
    key: "luxe",
    words: ["luxury", "luxe", "premium", "elegant", "sophisticated", "gold", "refined", "high-end", "opulent", "boutique"],
  },
  {
    key: "vibrant",
    words: ["vibrant", "bold", "playful", "energetic", "fun", "pop", "bright", "youthful", "colorful", "colourful"],
  },
  {
    key: "cool",
    words: ["cool", "ocean", "blue", "tech", "sky", "water", "calm", "crisp", "fintech", "clinical", "futuristic"],
  },
  {
    key: "fresh",
    words: ["green", "eco", "organic", "mint", "sage", "botanical", "sustainable", "fresh", "nature", "plant", "garden", "wellness"],
  },
  {
    key: "mono",
    words: ["monochrome", "grayscale", "greyscale", "black and white", "minimal", "stark", "neutral", "understated"],
  },
];

function detectFamily(inputs: DesignInputs): keyof typeof FAMILIES {
  const text = `${inputs.idea} ${inputs.theme} ${inputs.products}`.toLowerCase();
  for (const rule of FAMILY_RULES) {
    if (rule.words.some((w) => text.includes(w))) return rule.key;
  }
  return "warm";
}

// ---- Per-style composition ----------------------------------------------

function paletteFor(category: StyleCategory, f: PaletteFamily): Swatch[] {
  switch (category) {
    case "Minimalist":
      return [
        { role: "Paper", hex: f.bg },
        { role: "Surface", hex: f.surface },
        { role: "Muted", hex: f.muted },
        { role: "Ink", hex: f.ink },
        { role: "Accent", hex: f.accent },
      ];
    case "Contemporary":
      return [
        { role: "Surface", hex: f.surface },
        { role: "Tint", hex: f.bg },
        { role: "Accent", hex: f.accent },
        { role: "Secondary", hex: f.accentAlt },
        { role: "Ink", hex: f.ink },
      ];
    case "Dynamic":
      return [
        { role: "Base", hex: f.deep },
        { role: "Ink", hex: f.ink },
        { role: "Accent", hex: f.accent },
        { role: "Secondary", hex: f.accentAlt },
        { role: "Highlight", hex: f.surface },
      ];
  }
}

const TYPE: Record<StyleCategory, TypePairing> = {
  Minimalist: {
    displayName: "Fraunces",
    displayVar: "var(--font-display)",
    bodyName: "Hanken Grotesk",
    bodyVar: "var(--font-sans)",
    rule: "Restrained serif headlines, generous leading, sentence case.",
  },
  Contemporary: {
    displayName: "Bricolage Grotesque",
    displayVar: "var(--font-bricolage)",
    bodyName: "Hanken Grotesk",
    bodyVar: "var(--font-sans)",
    rule: "Characterful grotesque display, medium weights, rounded UI.",
  },
  Dynamic: {
    displayName: "Bricolage Grotesque",
    displayVar: "var(--font-bricolage)",
    bodyName: "Hanken Grotesk",
    bodyVar: "var(--font-sans)",
    rule: "Oversized uppercase display, tight tracking, heavy contrast.",
  },
};

const PATTERNS: Record<StyleCategory, string[]> = {
  Minimalist: [
    "Slim top nav, wordmark + 3–4 links",
    "Single hero, one focal call-to-action",
    "Hairline dividers, no drop shadows",
    "Strict product grid, square imagery",
    "Quiet, text-led footer",
  ],
  Contemporary: [
    "Pill nav with a rounded primary button",
    "Soft gradient hero with rounded media",
    "Elevated cards, soft shadows, ~16px radius",
    "Asymmetric, layered feature sections",
    "Newsletter band before the footer",
  ],
  Dynamic: [
    "Bold sticky nav, high contrast",
    "Full-bleed hero, oversized headline",
    "Diagonal / overlapping color blocks",
    "Edge-to-edge imagery, strong captions",
    "Loud CTA with motion accents",
  ],
};

interface DirectionMeta {
  category: StyleCategory;
  direction: string;
  summary: string;
  styleWords: string[];
}

const DIRECTIONS: DirectionMeta[] = [
  {
    category: "Minimalist",
    direction: "Quiet & Considered",
    summary:
      "Whitespace-forward and calm. A restrained palette and confident type let the products carry the page.",
    styleWords: ["whitespace", "restraint", "editorial", "calm", "precise"],
  },
  {
    category: "Contemporary",
    direction: "Soft Modern",
    summary:
      "On-trend and approachable. Rounded forms, gentle depth, and a friendly accent — polished but expressive.",
    styleWords: ["rounded", "gradient", "friendly", "polished", "layered"],
  },
  {
    category: "Dynamic",
    direction: "Bold & Kinetic",
    summary:
      "High-impact and unmissable. Strong contrast, oversized type, and striking compositions with momentum.",
    styleWords: ["high-contrast", "oversized", "energetic", "striking", "kinetic"],
  },
];

function moodPrompt(meta: DirectionMeta, inputs: DesignInputs): string {
  return [
    `A design moodboard / material collage for ${inputs.idea.trim() || "a brand"}.`,
    `Overall mood: ${inputs.theme.trim() || "cohesive and intentional"}.`,
    `${meta.category} direction — ${meta.styleWords.join(", ")}.`,
    `A tasteful flat-lay reference board: color chips, material and texture swatches, type detail crops, and small UI element close-ups that capture the ${meta.category.toLowerCase()} aesthetic.`,
    `No readable body text, no logos. Art-direction reference board, soft natural lighting, high quality.`,
  ].join(" ");
}

/** Build the three moodboards from the shared brief. */
export function buildMoodboards(inputs: DesignInputs): Moodboard[] {
  const family = FAMILIES[detectFamily(inputs)];
  return DIRECTIONS.map((meta, i) => ({
    id: `moodboard-${i + 1}`,
    category: meta.category,
    direction: meta.direction,
    summary: meta.summary,
    keywords: meta.styleWords,
    palette: paletteFor(meta.category, family),
    type: TYPE[meta.category],
    patterns: PATTERNS[meta.category],
    moodPrompt: moodPrompt(meta, inputs),
    moodImage: { status: "idle" as const },
  }));
}
