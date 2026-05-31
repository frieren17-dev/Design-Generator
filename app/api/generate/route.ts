import { NextResponse } from "next/server";
import { generateImage, KieError, type AspectRatio } from "@/lib/kie";
import type { GenerateRequest, GenerateResponse } from "@/lib/types";

// Image generation polls kie.ai for up to ~2 minutes, so allow a long runtime.
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse<GenerateResponse>> {
  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const prompt = body?.prompt?.trim();
  const side = body?.side;

  if (!prompt) {
    return NextResponse.json({ error: "A prompt is required." }, { status: 400 });
  }
  if (side !== "front" && side !== "back") {
    return NextResponse.json(
      { error: "side must be 'front' or 'back'." },
      { status: 400 },
    );
  }

  // Homepage (front) reads best wide; inner sections (back) at 4:3.
  const aspectRatio: AspectRatio = side === "front" ? "16:9" : "4:3";

  try {
    const { url, taskId } = await generateImage(prompt, aspectRatio);
    return NextResponse.json({ url, taskId });
  } catch (err) {
    if (err instanceof KieError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : "Image generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
