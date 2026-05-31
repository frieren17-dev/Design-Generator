import type { Concept, DesignInputs } from "./types";

/**
 * Serialize a single concept into a standalone, self-contained .html file the
 * user can download and open offline. Images are referenced by their kie.ai URL
 * (which expires ~24h after generation), so exports are best used promptly.
 */

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "concept"
  );
}

export function conceptToHtml(concept: Concept, inputs: DesignInputs): string {
  const imageBlock = (label: string, url?: string) =>
    url
      ? `<figure><img src="${escapeHtml(url)}" alt="${escapeHtml(
          concept.name + " — " + label,
        )}" /><figcaption>${escapeHtml(label)}</figcaption></figure>`
      : `<figure class="empty"><div class="ph">${escapeHtml(
          label,
        )} — not generated</div></figure>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(concept.name)} — Design Concept ${concept.number}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; background: #fafaf9; line-height: 1.6; }
  .wrap { max-width: 920px; margin: 0 auto; padding: 48px 24px 80px; }
  header { border-bottom: 1px solid #e7e5e4; padding-bottom: 20px; margin-bottom: 28px; }
  .tag { display: inline-block; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; background: #1c1917; color: #fafaf9; padding: 4px 10px; border-radius: 999px; }
  .num { color: #a8a29e; font-size: 14px; }
  h1 { font-size: 34px; margin: 14px 0 6px; }
  .desc { font-size: 18px; color: #44403c; max-width: 60ch; }
  .meta { margin: 28px 0; display: grid; gap: 14px; }
  .meta div { background: #fff; border: 1px solid #e7e5e4; border-radius: 12px; padding: 14px 16px; }
  .meta h3 { margin: 0 0 4px; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: #78716c; }
  .meta p { margin: 0; font-size: 14px; color: #292524; }
  figure { margin: 0 0 28px; background: #fff; border: 1px solid #e7e5e4; border-radius: 14px; overflow: hidden; }
  figure img { display: block; width: 100%; height: auto; }
  figcaption { padding: 10px 16px; font-size: 13px; color: #78716c; border-top: 1px solid #f5f5f4; }
  figure.empty .ph { padding: 60px 16px; text-align: center; color: #a8a29e; font-size: 14px; }
  .prompts { margin-top: 32px; display: grid; gap: 16px; }
  .prompts section { background: #fff; border: 1px solid #e7e5e4; border-radius: 12px; padding: 16px; }
  .prompts h3 { margin: 0 0 8px; font-size: 13px; letter-spacing: .06em; text-transform: uppercase; color: #78716c; }
  .prompts p { margin: 0; font-size: 13px; color: #44403c; white-space: pre-wrap; }
  footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e7e5e4; font-size: 12px; color: #a8a29e; }
</style>
</head>
<body>
  <div class="wrap">
    <header>
      <span class="tag">${escapeHtml(concept.category)}</span>
      <span class="num">&nbsp;Design ${concept.number} of 6</span>
      <h1>${escapeHtml(concept.name)}</h1>
      <p class="desc">${escapeHtml(concept.description)}</p>
    </header>

    <div class="meta">
      <div><h3>Idea</h3><p>${escapeHtml(inputs.idea)}</p></div>
      <div><h3>Theme</h3><p>${escapeHtml(inputs.theme)}</p></div>
      <div><h3>Products</h3><p>${escapeHtml(inputs.products)}</p></div>
    </div>

    ${imageBlock("Homepage (front)", concept.frontImage.url)}
    ${imageBlock("Inner sections (back)", concept.backImage.url)}

    <div class="prompts">
      <section><h3>Front image prompt</h3><p>${escapeHtml(concept.frontPrompt)}</p></section>
      <section><h3>Back image prompt</h3><p>${escapeHtml(concept.backPrompt)}</p></section>
    </div>

    <footer>Exported from the Design Concept Generator. Generated images are hosted by kie.ai and may expire ~24h after creation.</footer>
  </div>
</body>
</html>`;
}

export function downloadConceptHtml(concept: Concept, inputs: DesignInputs): void {
  const html = conceptToHtml(concept, inputs);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `concept-${concept.number}-${slugify(concept.name)}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
