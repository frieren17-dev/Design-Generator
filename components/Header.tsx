import { Coffee } from "lucide-react";

const CATEGORIES = [
  { label: "Minimalist", note: "01 — 02" },
  { label: "Contemporary", note: "03 — 04" },
  { label: "Dynamic", note: "05 — 06" },
];

export function Header() {
  return (
    <header className="relative overflow-hidden border-b border-border/70">
      <div className="mx-auto w-full max-w-7xl px-4 pt-7 pb-9 sm:pt-9 sm:pb-12">
        {/* Utility row */}
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground animate-rise">
          <span className="flex items-center gap-2">
            <span className="relative inline-flex">
              <Coffee className="size-4 text-primary" aria-hidden />
              <span
                aria-hidden
                className="animate-steam absolute -top-1.5 left-1/2 h-2 w-px -translate-x-1/2 rounded-full bg-primary/60"
              />
            </span>
            FrontEnd&nbsp;Studio
          </span>
          <span className="hidden sm:inline">Est. Moodboards · No.&nbsp;06</span>
        </div>

        <div
          className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end animate-rise"
          style={{ animationDelay: "80ms" }}
        >
          <div>
            <h1 className="font-display text-[2.7rem] leading-[0.92] font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Design&nbsp;Concept
              <br />
              <span className="text-primary italic">Generator</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              One brief, six homepage directions. We translate your{" "}
              <em className="font-display not-italic text-foreground">idea</em>,{" "}
              <em className="font-display not-italic text-foreground">theme</em>, and{" "}
              <em className="font-display not-italic text-foreground">products</em> into
              visual moodboards — two each across three styles. Directions to explore,
              not finished sites.
            </p>
          </div>

          {/* Spec chips: the three style families */}
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
            {CATEGORIES.map((c) => (
              <li
                key={c.label}
                className="flex items-center gap-3 rounded-full border border-border/80 bg-card/60 px-3 py-1.5 backdrop-blur-sm"
              >
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                  {c.note}
                </span>
                <span className="text-sm font-medium text-foreground">{c.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Editorial baseline rule */}
      <div aria-hidden className="rule-dotted h-px w-full opacity-70" />
    </header>
  );
}
