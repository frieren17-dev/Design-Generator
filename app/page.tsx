"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { InputForm } from "@/components/InputForm";
import { ConceptGrid } from "@/components/ConceptGrid";
import { buildConcepts, SAMPLE_INPUTS } from "@/lib/concepts";
import { loadState, saveState } from "@/lib/storage";
import { downloadConceptHtml } from "@/lib/export-html";
import type {
  Concept,
  ConceptSide,
  DesignInputs,
  GenerateResponse,
} from "@/lib/types";

const sideToImageKey = (side: ConceptSide) =>
  side === "front" ? ("frontImage" as const) : ("backImage" as const);
const sideToPromptKey = (side: ConceptSide) =>
  side === "front" ? ("frontPrompt" as const) : ("backPrompt" as const);

export default function Home() {
  const [inputs, setInputs] = useState<DesignInputs>(SAMPLE_INPUTS);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [generating, setGenerating] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Always-current snapshots so async handlers read fresh prompts/inputs.
  const conceptsRef = useRef<Concept[]>(concepts);
  const inputsRef = useRef<DesignInputs>(inputs);
  useEffect(() => {
    conceptsRef.current = concepts;
  }, [concepts]);
  useEffect(() => {
    inputsRef.current = inputs;
  }, [inputs]);

  // Hydrate from localStorage (or fall back to the sample brief) on first mount.
  // This must run in an effect: localStorage is unavailable during SSR, and
  // seeding state from it via a lazy initializer would cause a hydration
  // mismatch. setState-in-effect is therefore intentional here.
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputs(saved.inputs);
      setConcepts(saved.concepts);
    }
    setHydrated(true);
  }, []);

  // Persist after every change, once hydrated.
  useEffect(() => {
    if (hydrated) saveState(inputs, concepts);
  }, [inputs, concepts, hydrated]);

  const updateConcept = useCallback(
    (id: string, updater: (c: Concept) => Concept) =>
      setConcepts((prev) => prev.map((c) => (c.id === id ? updater(c) : c))),
    [],
  );

  /** Generate (or regenerate) one image of one concept. */
  const generateSide = useCallback(
    async (conceptId: string, side: ConceptSide) => {
      const concept = conceptsRef.current.find((c) => c.id === conceptId);
      if (!concept) return;
      const prompt = concept[sideToPromptKey(side)];
      const imageKey = sideToImageKey(side);

      updateConcept(conceptId, (c) => ({
        ...c,
        [imageKey]: { status: "loading" },
      }));

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, side }),
        });
        const data = (await res.json()) as GenerateResponse;
        if (!res.ok || !data.url) {
          throw new Error(data.error ?? "Generation failed.");
        }
        updateConcept(conceptId, (c) => ({
          ...c,
          [imageKey]: { status: "done", url: data.url, taskId: data.taskId },
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Generation failed.";
        updateConcept(conceptId, (c) => ({
          ...c,
          [imageKey]: { status: "error", error: message },
        }));
        toast.error(`Concept ${concept.number} (${side}) failed`, {
          description: message,
        });
      }
    },
    [updateConcept],
  );

  /** "Generate Now": build six concepts and generate all front images. */
  const handleGenerate = useCallback(async () => {
    const fresh = buildConcepts(inputs).map((c) => ({
      ...c,
      frontImage: { status: "loading" as const },
    }));
    setConcepts(fresh);
    conceptsRef.current = fresh;
    setGenerating(true);

    toast.info("Generating 6 homepage concepts…", {
      description: "This can take up to a minute or two.",
    });

    const results = await Promise.allSettled(
      fresh.map((c) => generateSide(c.id, "front")),
    );
    setGenerating(false);

    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed === 0) toast.success("All 6 homepage concepts generated.");
  }, [inputs, generateSide]);

  const handleReset = useCallback(() => {
    setInputs(SAMPLE_INPUTS);
    setConcepts([]);
    toast.info("Reset to the sample brief.");
  }, []);

  const handleSaveEdit = useCallback(
    (
      conceptId: string,
      patch: Pick<Concept, "name" | "description" | "frontPrompt" | "backPrompt">,
      regenerate: boolean,
    ) => {
      updateConcept(conceptId, (c) => ({ ...c, ...patch }));
      if (regenerate) {
        // Defer so the patched prompts land in conceptsRef before generating.
        setTimeout(() => {
          const c = conceptsRef.current.find((x) => x.id === conceptId);
          if (!c) return;
          generateSide(conceptId, "front");
          if (c.backImage.status === "done" || c.backImage.status === "error") {
            generateSide(conceptId, "back");
          }
        }, 0);
      } else {
        toast.success("Concept updated.");
      }
    },
    [updateConcept, generateSide],
  );

  const handleExport = useCallback((conceptId: string) => {
    const concept = conceptsRef.current.find((c) => c.id === conceptId);
    if (!concept) return;
    downloadConceptHtml(concept, inputsRef.current);
    toast.success(`Exported "${concept.name}".`);
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-start">
          <div className="lg:sticky lg:top-6">
            <InputForm
              inputs={inputs}
              onChange={setInputs}
              onGenerate={handleGenerate}
              onReset={handleReset}
              generating={generating}
            />
          </div>

          <section>
            {concepts.length === 0 ? (
              <div className="animate-rise grid min-h-[360px] place-items-center rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center backdrop-blur-sm">
                <div className="max-w-sm space-y-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                    Empty moodboard
                  </span>
                  <h2 className="font-display text-2xl font-semibold tracking-tight">
                    Nothing brewing yet
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Fill in your brief and hit <strong>Generate Now</strong> to conjure
                    six homepage directions — two Minimalist, two Contemporary, two
                    Dynamic.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-end justify-between border-b border-border/70 pb-3">
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-tight">
                      Moodboard
                    </h2>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Six directions · one brief
                    </p>
                  </div>
                  <span className="font-mono text-sm tabular-nums text-primary">
                    {concepts.length} / 6
                  </span>
                </div>
                <ConceptGrid
                  concepts={concepts}
                  onGenerateSide={generateSide}
                  onSaveEdit={handleSaveEdit}
                  onExport={handleExport}
                />
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
