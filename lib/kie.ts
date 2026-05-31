import "server-only";

/**
 * Server-side kie.ai client. The API key is read from process.env.KIE_API_KEY
 * and never leaves the server. Image generation is asynchronous: we create a
 * task, then poll until it reaches a terminal state.
 *
 * Docs: https://docs.kie.ai
 *   POST /api/v1/jobs/createTask   -> { data: { taskId } }
 *   GET  /api/v1/jobs/recordInfo   -> { data: { state, resultJson, failMsg } }
 */

const KIE_BASE = "https://api.kie.ai";
const MODEL = "nano-banana-2";
const RESOLUTION = "2K";
const OUTPUT_FORMAT = "png";

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 120_000;

export type AspectRatio = "16:9" | "4:3" | "1:1";

export class KieError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "KieError";
    this.status = status;
  }
}

function getApiKey(): string {
  // Strip whitespace and any stray wrapping parentheses/quotes from the env value.
  const raw = (process.env.KIE_API_KEY ?? "").trim();
  const cleaned = raw.replace(/^[("']+|[)"']+$/g, "").trim();
  if (!cleaned) {
    throw new KieError(
      "Missing KIE_API_KEY. Add it to .env.local (server-side).",
      500,
    );
  }
  return cleaned;
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${getApiKey()}`,
    "Content-Type": "application/json",
  };
}

interface CreateTaskResponse {
  code: number;
  msg?: string;
  data?: { taskId?: string };
}

interface RecordInfoResponse {
  code: number;
  msg?: string;
  data?: {
    state?: string;
    resultJson?: string;
    failCode?: string;
    failMsg?: string;
    progress?: number;
  };
}

/** Create a generation task and return its taskId. */
export async function createTask(
  prompt: string,
  aspectRatio: AspectRatio,
): Promise<string> {
  const res = await fetch(`${KIE_BASE}/api/v1/jobs/createTask`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      model: MODEL,
      input: {
        prompt,
        aspect_ratio: aspectRatio,
        resolution: RESOLUTION,
        output_format: OUTPUT_FORMAT,
      },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new KieError(
      `kie.ai createTask failed (${res.status}): ${text.slice(0, 300)}`,
    );
  }

  const json = (await res.json()) as CreateTaskResponse;
  const taskId = json.data?.taskId;
  if (json.code !== 200 || !taskId) {
    throw new KieError(`kie.ai createTask error: ${json.msg ?? "no taskId returned"}`);
  }
  return taskId;
}

function extractResultUrl(resultJson?: string): string | undefined {
  if (!resultJson) return undefined;
  try {
    const parsed = JSON.parse(resultJson) as { resultUrls?: string[] };
    return parsed.resultUrls?.[0];
  } catch {
    return undefined;
  }
}

/** Poll a task until success/fail or timeout. Returns the first image URL. */
export async function pollTask(taskId: string): Promise<string> {
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const res = await fetch(
      `${KIE_BASE}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`,
      { method: "GET", headers: authHeaders(), cache: "no-store" },
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new KieError(
        `kie.ai recordInfo failed (${res.status}): ${text.slice(0, 300)}`,
      );
    }

    const json = (await res.json()) as RecordInfoResponse;
    const state = json.data?.state;

    if (state === "success") {
      const url = extractResultUrl(json.data?.resultJson);
      if (!url) throw new KieError("kie.ai task succeeded but returned no image URL.");
      return url;
    }
    if (state === "fail") {
      throw new KieError(
        `kie.ai generation failed: ${json.data?.failMsg ?? "unknown error"}`,
      );
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  throw new KieError("kie.ai generation timed out. Please try again.", 504);
}

/** Create a task and wait for the resulting image URL. */
export async function generateImage(
  prompt: string,
  aspectRatio: AspectRatio,
): Promise<{ url: string; taskId: string }> {
  const taskId = await createTask(prompt, aspectRatio);
  const url = await pollTask(taskId);
  return { url, taskId };
}
