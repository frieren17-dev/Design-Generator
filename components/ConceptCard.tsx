"use client";

import { Download, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/ImageSlot";
import { EditConceptDialog } from "@/components/EditConceptDialog";
import { cn } from "@/lib/utils";
import type { Concept, ConceptSide, StyleCategory } from "@/lib/types";

const CATEGORY_STYLES: Record<StyleCategory, { dot: string; text: string }> = {
  Minimalist: { dot: "bg-muted-foreground/60", text: "text-muted-foreground" },
  Contemporary: { dot: "bg-olive", text: "text-olive" },
  Dynamic: { dot: "bg-primary", text: "text-primary" },
};

interface ConceptCardProps {
  concept: Concept;
  index: number;
  onGenerateSide: (side: ConceptSide) => void;
  onSaveEdit: (
    patch: Pick<Concept, "name" | "description" | "frontPrompt" | "backPrompt">,
    regenerate: boolean,
  ) => void;
  onExport: () => void;
}

export function ConceptCard({
  concept,
  index,
  onGenerateSide,
  onSaveEdit,
  onExport,
}: ConceptCardProps) {
  const cat = CATEGORY_STYLES[concept.category];
  const hasAnyImage =
    concept.frontImage.status === "done" || concept.backImage.status === "done";

  return (
    <article
      className="animate-rise group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-[0_1px_0_oklch(1_0_0/0.55)_inset,0_16px_40px_-30px_oklch(0.3_0.05_50/0.5)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_1px_0_oklch(1_0_0/0.55)_inset,0_26px_50px_-28px_oklch(0.45_0.1_45/0.55)]"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Masthead: oversized numeral + category */}
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div className="flex items-center gap-2.5">
          <span className={cn("size-2 rounded-full", cat.dot)} />
          <span
            className={cn(
              "font-mono text-[11px] uppercase tracking-[0.18em]",
              cat.text,
            )}
          >
            {concept.category}
          </span>
        </div>
        <span className="font-display text-3xl leading-none font-semibold text-foreground/15 tabular-nums transition-colors group-hover:text-primary/30">
          {String(concept.number).padStart(2, "0")}
        </span>
      </div>

      <div className="px-5 pt-2 pb-4">
        <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
          {concept.name}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {concept.description}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5">
        <ImageSlot
          label="Homepage"
          image={concept.frontImage}
          aspect="16/9"
          onRetry={() => onGenerateSide("front")}
          idleAction={
            <Button variant="outline" size="sm" onClick={() => onGenerateSide("front")}>
              <Plus /> Generate homepage
            </Button>
          }
        />

        <ImageSlot
          label="Inner sections"
          image={concept.backImage}
          aspect="4/3"
          onRetry={() => onGenerateSide("back")}
          idleAction={
            <Button variant="outline" size="sm" onClick={() => onGenerateSide("back")}>
              <Plus /> Generate back
            </Button>
          }
        />

        <details className="group/d rounded-lg border border-border/70 bg-background/40 text-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground select-none">
            View image prompts
            <ChevronDown className="size-4 transition-transform group-open/d:rotate-180" />
          </summary>
          <div className="space-y-3 px-3 pb-3">
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                Front — homepage
              </p>
              <p className="text-xs leading-relaxed text-foreground/75">
                {concept.frontPrompt}
              </p>
            </div>
            <div className="rule-dotted h-px w-full opacity-60" aria-hidden />
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-olive">
                Back — inner sections
              </p>
              <p className="text-xs leading-relaxed text-foreground/75">
                {concept.backPrompt}
              </p>
            </div>
          </div>
        </details>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/70 bg-background/30 px-5 py-3">
        <EditConceptDialog concept={concept} onSave={onSaveEdit} />
        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          disabled={!hasAnyImage}
          className="text-muted-foreground hover:text-foreground"
          title={hasAnyImage ? "Download standalone .html" : "Generate an image first"}
        >
          <Download /> Export
        </Button>
      </div>
    </article>
  );
}
