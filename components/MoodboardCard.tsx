"use client";

import { Plus, Type as TypeIcon, LayoutTemplate, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/ImageSlot";
import { cn } from "@/lib/utils";
import type { Moodboard, StyleCategory } from "@/lib/types";

const CATEGORY_ACCENT: Record<StyleCategory, string> = {
  Minimalist: "text-muted-foreground",
  Contemporary: "text-olive",
  Dynamic: "text-primary",
};

interface MoodboardCardProps {
  board: Moodboard;
  index: number;
  onGenerateMood: () => void;
}

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: typeof Palette;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
      <Icon className="size-3.5" aria-hidden />
      {children}
    </div>
  );
}

export function MoodboardCard({ board, index, onGenerateMood }: MoodboardCardProps) {
  return (
    <article
      className="animate-rise flex flex-col gap-5 rounded-2xl border border-border/80 bg-card/80 p-5 shadow-[0_1px_0_oklch(1_0_0/0.55)_inset,0_16px_40px_-30px_oklch(0.3_0.05_50/0.5)] backdrop-blur-sm"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "font-mono text-[11px] uppercase tracking-[0.18em]",
              CATEGORY_ACCENT[board.category],
            )}
          >
            {board.category}
          </span>
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
            BOARD {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight">
          {board.direction}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {board.summary}
        </p>
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap gap-1.5">
        {board.keywords.map((k) => (
          <span
            key={k}
            className="rounded-full border border-border/70 bg-background/50 px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-foreground/70"
          >
            {k}
          </span>
        ))}
      </div>

      {/* Palette */}
      <div className="space-y-2">
        <SectionLabel icon={Palette}>Palette</SectionLabel>
        <div className="grid grid-cols-5 overflow-hidden rounded-lg border border-border/70">
          {board.palette.map((s) => (
            <div key={s.role} className="group/sw">
              <div className="h-12 w-full" style={{ backgroundColor: s.hex }} />
              <div className="bg-background/60 px-1 py-1 text-center">
                <p className="text-[9px] font-medium text-foreground/80">{s.role}</p>
                <p className="font-mono text-[8px] uppercase text-muted-foreground">
                  {s.hex.replace("#", "")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-2">
        <SectionLabel icon={TypeIcon}>Typography</SectionLabel>
        <div className="rounded-lg border border-border/70 bg-background/40 p-3">
          <p
            className="text-2xl leading-tight text-foreground"
            style={{ fontFamily: board.type.displayVar }}
          >
            {board.direction}
          </p>
          <p
            className="mt-1 text-sm text-muted-foreground"
            style={{ fontFamily: board.type.bodyVar }}
          >
            {board.type.rule}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[10px] text-muted-foreground">
            <span>Display · {board.type.displayName}</span>
            <span>Body · {board.type.bodyName}</span>
          </div>
        </div>
      </div>

      {/* UI patterns */}
      <div className="space-y-2">
        <SectionLabel icon={LayoutTemplate}>UI patterns</SectionLabel>
        <ul className="space-y-1">
          {board.patterns.map((p) => (
            <li
              key={p}
              className="flex gap-2 text-xs leading-relaxed text-foreground/75"
            >
              <span
                className={cn(
                  "mt-1.5 size-1 shrink-0 rounded-full",
                  board.category === "Dynamic"
                    ? "bg-primary"
                    : board.category === "Contemporary"
                      ? "bg-olive"
                      : "bg-muted-foreground/60",
                )}
              />
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Mood image */}
      <div className="space-y-2">
        <SectionLabel icon={Palette}>Mood image</SectionLabel>
        <ImageSlot
          label="Texture & material reference"
          image={board.moodImage}
          aspect="1/1"
          onRetry={onGenerateMood}
          idleAction={
            <Button variant="outline" size="sm" onClick={onGenerateMood}>
              <Plus /> Generate mood image
            </Button>
          }
        />
      </div>
    </article>
  );
}
