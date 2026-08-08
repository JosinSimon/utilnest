import type { AlphaMask, RgbaBuffer, Size } from "./types"
import { AI_MODEL } from "./model"
import { resizeMask } from "./geometry"

/**
 * AI foreground-mask provider.
 *
 * This module is deliberately isolated from the pixel engine: it knows how to
 * speak to ONNX Runtime and shape tensors for ONE model (see model.ts), but it
 * returns the same `AlphaMask` contract as the solid matcher. Swapping
 * u²-net / BiRefNet / RMBG / any model is a `model.ts` edit only.
 *
 * Privacy / architecture invariances:
 *   - `import("onnxruntime-web")` runs on first AI use only (code-split);
 *   - the model is fetched once, then cached for full offline use;
 *   - no image bytes ever leave the browser;
 *   - every failure returns `{ ok:false, reason }` — it never throws.
 */

let ortPromise: Promise<typeof import("onnxruntime-web")> | null = null
let sessionPromise: Promise<import("onnxruntime-web").InferenceSession | null> | null = null

const loadOrt = () => {
  ortPromise ??= import("onnxruntime-web")
  return ortPromise
}

const getSession = () => {
  sessionPromise ??= loadOrt().then(async (ort) => {
    try {
      return await ort.InferenceSession.create(AI_MODEL.url, {
        executionProviders: ["wasm"],
        graphOptimizationLevel: "all",
      })
    } catch {
      return null
    }
  })
  return sessionPromise
}

export interface AiAvailability {
  ok: boolean
  code?: "unsupported" | "runtime"
  reason: string
}

/** Capability probe that does NOT download the model (~free). */
export async function isAiAvailable(): Promise<AiAvailability> {
  try {
    if (typeof WebAssembly === "undefined") {
      return { ok: false, code: "unsupported", reason: "WebAssembly is unavailable in this browser." }
    }
    await loadOrt()
    return { ok: true, reason: "ready" }
  } catch {
    return {
      ok: false,
      code: "runtime",
      reason: "The AI runtime could not be loaded. Use Solid mode instead.",
    }
  }
}

export type AiMaskResult =
  | { ok: true; mask: AlphaMask; downloadBytes: number }
  | { ok: false; code: string; reason: string }

/**
 * Run the configured model and return a full-resolution foreground mask.
 *
 * Steps: letterbox the image into the model's square input, normalize to
 * [0,1] float NCHW, run the net, remap the raw logits through a soft clip,
 * then bilinear-upscale the mask onto the original working size.
 */
export async function runAiMask(rgba: RgbaBuffer, size: Size): Promise<AiMaskResult> {
  try {
    const session = await getSession()
    if (!session) {
      return {
        ok: false,
        code: "model_unavailable",
        reason:
          "Could not load the AI model (network blocked or the download failed). Solid mode runs fully offline — try it instead.",
      }
    }

    const T = AI_MODEL.inputResolution
    const { width, height } = size

    // RMBG-1.4 preprocessor: resize (stretch) to 1024x1024, rescale by 1/255,
    // normalize with mean 0.5 (i.e. x/255 - 0.5). No padding/letterbox.
    const data = new Float32Array(3 * T * T)
    for (let y = 0; y < T; y++) {
      const sy = Math.min(height - 1, Math.floor((y / T) * height))
      for (let x = 0; x < T; x++) {
        const sx = Math.min(width - 1, Math.floor((x / T) * width))
        const src = (sy * width + sx) * 4
        const o = y * T + x
        data[o] = rgba[src] / 255 - 0.5
        data[T * T + o] = rgba[src + 1] / 255 - 0.5
        data[2 * T * T + o] = rgba[src + 2] / 255 - 0.5
      }
    }

    const inputName = session.inputNames[0]
    const ort = await loadOrt()
    const tensor = new ort.Tensor("float32", data, [1, 3, T, T])
    const outputs = await session.run({ [inputName]: tensor })
    const outName = session.outputNames[0]
    const raw = outputs[outName].data as Float32Array

    // Models commonly emit (B,1,H,W) or (B,H,W,1); the flat array is exactly
    // a square of side `T`. If it's not square, try to detect the H=W dims.
    let side = Math.round(Math.sqrt(raw.length))
    if (side * side !== raw.length) {
      if (raw.length === T * T) side = T
      else {
        return { ok: false, code: "output-shape", reason: "Unexpected AI output shape." }
      }
    }

    // Decode the mask channel. RMBG emits probabilities already (0..1), while
    // some u²-net/BiRefNet exports emit raw logits. Detect by range: if the
    // max value is <= 1 it's a probability map — scale it straight to 0..255.
    // Otherwise clamp the logits through a sigmoid. Subtracting 0.5 here is
    // wrong (it flattens probabilities into ~0.5 for every pixel).
    const nPx = T * T
    let probMax = 0
    for (let i = 0; i < nPx; i++) {
      if (raw[i] > probMax) probMax = raw[i]
    }
    const isProbability = probMax <= 1
    const maskContent = new Uint8Array(nPx)
    for (let i = 0; i < nPx; i++) {
      const r = raw[i]
      let v = isProbability ? r : 1 / (1 + Math.exp(-Math.max(-16, Math.min(16, r))))
      if (v < 0) v = 0
      if (v > 1) v = 1
      maskContent[i] = Math.round(v * 255)
    }

    // Bilinear upscale the full 1024x1024 mask to the working resolution.
    const mask = resizeMask(maskContent, { width: T, height: T }, { width, height })
    const downloadBytes = estimateModelBytes()
    return { ok: true, mask, downloadBytes }
  } catch (err) {
    return {
      ok: false,
      code: "runtime",
      reason: `AI removal failed to run (${err instanceof Error ? err.message : "unknown error"}). Solid mode is fully offline and is a good fallback.`,
    }
  }
}

/** Approximate model weight size for progress/messaging. */
function estimateModelBytes(): number {
  return AI_MODEL.url.includes("quantized") ? 44_000_000 : 176_000_000
}