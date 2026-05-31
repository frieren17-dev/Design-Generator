"use client";

import { useState } from "react";
import { Pencil, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Concept } from "@/lib/types";

interface EditConceptDialogProps {
  concept: Concept;
  /** Persist edits. regenerate=true means re-run image generation afterwards. */
  onSave: (
    patch: Pick<Concept, "name" | "description" | "frontPrompt" | "backPrompt">,
    regenerate: boolean,
  ) => void;
}

export function EditConceptDialog({ concept, onSave }: EditConceptDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(concept.name);
  const [description, setDescription] = useState(concept.description);
  const [frontPrompt, setFrontPrompt] = useState(concept.frontPrompt);
  const [backPrompt, setBackPrompt] = useState(concept.backPrompt);

  // Re-sync fields whenever the dialog is (re)opened.
  function handleOpenChange(next: boolean) {
    if (next) {
      setName(concept.name);
      setDescription(concept.description);
      setFrontPrompt(concept.frontPrompt);
      setBackPrompt(concept.backPrompt);
    }
    setOpen(next);
  }

  function save(regenerate: boolean) {
    onSave({ name, description, frontPrompt, backPrompt }, regenerate);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Pencil /> Iterate
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Refine concept {concept.number}</DialogTitle>
          <DialogDescription>
            Edit the copy and prompts, then save — optionally regenerating the images.
          </DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[60vh] gap-4 overflow-y-auto pr-1">
          <div className="grid gap-2">
            <Label htmlFor="c-name">Concept name</Label>
            <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="c-desc">Description</Label>
            <Textarea
              id="c-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="c-front">Front image prompt (homepage)</Label>
            <Textarea
              id="c-front"
              rows={5}
              value={frontPrompt}
              onChange={(e) => setFrontPrompt(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="c-back">Back image prompt (inner sections)</Label>
            <Textarea
              id="c-back"
              rows={5}
              value={backPrompt}
              onChange={(e) => setBackPrompt(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => save(false)}>
            <Save /> Save only
          </Button>
          <Button onClick={() => save(true)}>
            <Save /> Save & regenerate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
