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
    const scale = Math.min(T / width, T / height)
    const iw = Math.max(1, Math.round(width * scale))
    const ih = Math.max(1, Math.round(height * scale))
    const padX = Math.floor((T - iw) / 2)
    const padY = Math.floor((T - ih) / 2)

    // Build [1,3,H,W] float32 tensor, RGB 0..1, grey letterbox.
    const data = new Float32Array(1 * 3 * T * T)
    for (let i = 0; i < T * T; i++) {
      data[i * 3] = 170 / 255
      data[i * 3 + 1] = 170 / 255
      data[i * 3 + 2] = 170 / 255
    }
    for (let y = 0; y < ih; y++) {
      const sy = Math.min(height - 1, Math.floor(y / scale))
      for (let x = 0; x < iw; x++) {
        const sx = Math.min(width - 1, Math.floor(x / scale))
        const src = (sy * width + sx) * 4
        const oi = ((padY + y) * T + padX + x) * 3
        data[oi] = rgba[src] / 255
        data[oi + 1] = rgba[src + 1] / 255
        data[oi + 2] = rgba[src + 2] / 255
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

    // Soft-clip logits/probabilities to a smooth 0..1 ramp around 0.5.
    const maskContent = new Uint8Array(iw * ih)
    for (let y = 0; y < ih; y++) {
      for (let x = 0; x < iw; x++) {
        const r = raw[(padY + y) * side + padX + x]
        const v = 1 / (1 + Math.exp(-Math.max(-8, Math.min(8, r - 0.5))))
        maskContent[y * iw + x] = Math.round(v * 255)
      }
    }

    // Bilinear upscale to the original working resolution.
    const mask = resizeMask(maskContent, { width: iw, height: ih }, { width, height })
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
  return AI_MODEL.url.includes("rmbg") ? 176_000_000 : 60_000_000
}