"use client";

import { ImageOff, RefreshCw, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ConceptImage } from "@/lib/types";

interface ImageSlotProps {
  label: string;
  image: ConceptImage;
  aspect?: "16/9" | "4/3";
  /** Shown when status is "idle" — e.g. a "Generate" button. */
  idleAction?: React.ReactNode;
  onRetry?: () => void;
}

export function ImageSlot({
  label,
  image,
  aspect = "16/9",
  idleAction,
  onRetry,
}: ImageSlotProps) {
  const ratio = aspect === "16/9" ? "aspect-video" : "aspect-[4/3]";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        {image.status === "done" && image.url && onRetry && (
          <Button variant="ghost" size="xs" onClick={onRetry} title="Regenerate">
            <RefreshCw /> Redo
          </Button>
        )}
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-border bg-background/50",
          // hairline inner frame for a "mounted print" feel
          "ring-1 ring-inset ring-foreground/5",
          ratio,
        )}
      >
        {image.status === "loading" && (
          <div className="absolute inset-0 grid place-items-center overflow-hidden">
            {/* warm shimmer sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent bg-[length:200%_100%] animate-pulse" />
            <div className="relative flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-widest">
                Generating
              </span>
            </div>
          </div>
        )}

        {image.status === "done" && image.url && (
          // Generated images come from arbitrary kie.ai CDN URLs; a plain <img>
          // avoids next/image remote-host configuration for ephemeral URLs.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={label}
            className="size-full object-cover transition-transform duration-500 hover:scale-[1.02]"
            loading="lazy"
          />
        )}

        {image.status === "error" && (
          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="flex max-w-[90%] flex-col items-center gap-2 text-center">
              <ImageOff className="size-5 text-destructive" />
              <span className="text-xs leading-snug text-muted-foreground">
                {image.error ?? "Generation failed."}
              </span>
              {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry}>
                  <RefreshCw /> Retry
                </Button>
              )}
            </div>
          </div>
        )}

        {image.status === "idle" && (
          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
              <ImageIcon className="size-5 opacity-50" />
              {idleAction ?? (
                <span className="font-mono text-[10px] uppercase tracking-widest">
                  Not generated
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
