"use client";

import { ConceptCard } from "@/components/ConceptCard";
import type { Concept, ConceptSide } from "@/lib/types";

interface ConceptGridProps {
  concepts: Concept[];
  onGenerateSide: (conceptId: string, side: ConceptSide) => void;
  onSaveEdit: (
    conceptId: string,
    patch: Pick<Concept, "name" | "description" | "frontPrompt" | "backPrompt">,
    regenerate: boolean,
  ) => void;
  onExport: (conceptId: string) => void;
}

export function ConceptGrid({
  concepts,
  onGenerateSide,
  onSaveEdit,
  onExport,
}: ConceptGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {concepts.map((concept, i) => (
        <ConceptCard
          key={concept.id}
          concept={concept}
          index={i}
          onGenerateSide={(side) => onGenerateSide(concept.id, side)}
          onSaveEdit={(patch, regenerate) =>
            onSaveEdit(concept.id, patch, regenerate)
          }
          onExport={() => onExport(concept.id)}
        />
      ))}
    </div>
  );
}
