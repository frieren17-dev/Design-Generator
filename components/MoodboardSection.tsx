"use client";

import { MoodboardCard } from "@/components/MoodboardCard";
import type { Moodboard } from "@/lib/types";

interface MoodboardSectionProps {
  moodboards: Moodboard[];
  onGenerateMood: (boardId: string) => void;
}

export function MoodboardSection({
  moodboards,
  onGenerateMood,
}: MoodboardSectionProps) {
  if (moodboards.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between border-b border-border/70 pb-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Moodboards
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Curated references · one per direction
          </p>
        </div>
        <span className="font-mono text-sm tabular-nums text-primary">
          {moodboards.length} boards
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {moodboards.map((board, i) => (
          <MoodboardCard
            key={board.id}
            board={board}
            index={i}
            onGenerateMood={() => onGenerateMood(board.id)}
          />
        ))}
      </div>
    </section>
  );
}
