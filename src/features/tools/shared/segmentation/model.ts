/**
 * Single source of truth for the AI segmentation model.
 *
 * Swap U²-Net / BiRefNet / RMBG / any future model by editing ONLY this file.
 * The rest of the codebase talks to `segmentation/ai.ts`, which reads these
 * constants — it never hardcodes a model identity.
 */

export interface AiModelConfig {
  /** Human-readable label shown in the UI ("BiRefNet · 60 MB"). */
  label: string
  /** Public (or self-hosted) URL to the ONNX model weights. */
  url: string
  /** ONNX Runtime web backend: "wasm" (local, offline after first fetch). */
  backend: "wasm"
  /** Square input this model expects. Masks are upscaled to the working size. */
  inputResolution: number
  /** Keep colors normalized 0..1 (most segmentation U-Nets do). */
  normalize: boolean
  /** Batch dim; almost always 1. */
  batchSize: number
}

/**
 * Default: RMBG-1.4 (BRIA AI) — a compact single-class segmentation model
 * with a permissive research license, popular for background cutouts. The
 * repo ships several ONNX builds; we use the quantized one (~44 MB) because
 * it loads fast in the browser and is plenty accurate for cutouts. Swap the
 * URL to self-host at your origin or another model (e.g. U2Net-Human, ISNet)
 * without touching the engine.
 */
export const AI_MODEL: AiModelConfig = {
  label: "AI net — RMBG-1.4 (quantized)",
  // Point to the official HuggingFace mirror build; swap for a self-hosted
  // bucket by changing only this constant.
  url: "https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model_quantized.onnx",
  backend: "wasm",
  inputResolution: 1024,
  normalize: true,
  batchSize: 1,
}

/** Working-resolution cap for the AI pass (models run on a letterbox). */
export const AI_MAX_INPUT_PIXELS = 1_048_576 // 1024×1024