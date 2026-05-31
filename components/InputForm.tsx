"use client";

import { Wand2, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DesignInputs } from "@/lib/types";

interface InputFormProps {
  inputs: DesignInputs;
  onChange: (inputs: DesignInputs) => void;
  onGenerate: () => void;
  onReset: () => void;
  generating: boolean;
}

interface FieldMeta {
  key: keyof DesignInputs;
  index: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

const FIELDS: FieldMeta[] = [
  {
    key: "idea",
    index: "01",
    label: "Idea",
    placeholder: "An online store for handcrafted, eco-friendly coffee gear",
  },
  {
    key: "theme",
    index: "02",
    label: "Theme",
    placeholder: "Warm, earthy, sustainable — natural textures, cozy modern feel",
    multiline: true,
  },
  {
    key: "products",
    index: "03",
    label: "Products",
    placeholder: "Single-origin beans, pour-over kits, ceramic mugs, filters",
    multiline: true,
  },
];

export function InputForm({
  inputs,
  onChange,
  onGenerate,
  onReset,
  generating,
}: InputFormProps) {
  const set = (key: keyof DesignInputs) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => onChange({ ...inputs, [key]: e.target.value });

  const canGenerate =
    !generating && [inputs.idea, inputs.theme, inputs.products].some((v) => v.trim());

  return (
    <div className="animate-rise rounded-2xl border border-border/80 bg-card/80 shadow-[0_1px_0_oklch(1_0_0/0.6)_inset,0_18px_40px_-28px_oklch(0.3_0.05_50/0.45)] backdrop-blur-sm">
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          The Brief
        </span>
        <span className="font-mono text-[11px] tracking-widest text-primary">
          ▲ 3 inputs
        </span>
      </div>

      <form
        className="grid gap-6 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (canGenerate) onGenerate();
        }}
      >
        {FIELDS.map((f) => (
          <div key={f.key} className="grid gap-2">
            <Label
              htmlFor={f.key}
              className="flex items-baseline gap-2 text-foreground"
            >
              <span className="font-mono text-[11px] text-primary">{f.index}</span>
              <span className="font-display text-base font-medium tracking-tight">
                {f.label}
              </span>
            </Label>
            {f.multiline ? (
              <Textarea
                id={f.key}
                rows={2}
                placeholder={f.placeholder}
                value={inputs[f.key]}
                onChange={set(f.key)}
                disabled={generating}
                className="resize-none bg-background/60"
              />
            ) : (
              <Input
                id={f.key}
                placeholder={f.placeholder}
                value={inputs[f.key]}
                onChange={set(f.key)}
                disabled={generating}
                className="bg-background/60"
              />
            )}
          </div>
        ))}

        <div className="rule-dotted h-px w-full opacity-70" aria-hidden />

        <div className="grid gap-2.5">
          <Button
            type="submit"
            size="lg"
            disabled={!canGenerate}
            className="h-11 w-full text-[15px] shadow-[0_10px_24px_-12px_oklch(0.55_0.135_42/0.7)]"
          >
            {generating ? (
              <>
                <Loader2 className="animate-spin" /> Brewing six concepts…
              </>
            ) : (
              <>
                <Wand2 /> Generate Now
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={generating}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <RotateCcw /> Reset to sample brief
          </Button>
        </div>
      </form>
    </div>
  );
}
