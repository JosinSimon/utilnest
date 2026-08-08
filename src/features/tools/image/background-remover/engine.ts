import type { FileJob } from "@/features/tools/engine"
import {
  runAiMask,
  loadImageRgba,
  rgbaToBlob,
  backgroundRemovedFileName,
  removeBackground,
  replaceBackgroundColor,
  blurBackground,
  extractSolidMask,
  recommendMode,
  type RgbaBuffer,
  type Size,
  type AlphaMask,
  type SolidAnalysis,
  type SolidOptions,
  type OutputFormat,
} from "@/features/tools/shared/segmentation"

export type BgRemoveMode = "solid" | "ai"
export type BgOutputKind = "transparent" | "replace" | "blur"

export interface BgRemovalInput {
  file: File
  mode: BgRemoveMode
  /** Solid matcher tuning (engine defaults apply). */
  solid?: SolidOptions
  /** Used when output === "replace". */
  replaceColor?: [number, number, number]
  /** Used when output === "blur". */
  blurRadius?: number
  output: BgOutputKind
  format: OutputFormat
}

export interface BgRemovalOutput {
  blob: Blob
  fileName: string
  width: number
  height: number
  bytes: number
  format: OutputFormat
  mask: AlphaMask
  foregroundRatio: number
  mode: BgRemoveMode
  /** Border analysis — null when mode is "ai". */
  analysis: SolidAnalysis | null
}

/**
 * Front-door engine of the Background Remover tool. Composes the shared
 * segmentation core: both modes converge on an `AlphaMask`, then an operator
 * (remove / replace / blur) renders the requested output. Runs entirely in the
 * browser — no image bytes are ever sent anywhere.
 *
 * Dependencies are injectable so unit tests exercise the orchestration without
 * a DOM/canvas: `loadRgba` decodes a File to pixels, `toBlob` encodes pixels
 * to a blob, `aiMask` runs the AI provider.
 */
export interface BgRemovalDeps {
  loadRgba?: typeof loadImageRgba
  toBlob?: typeof rgbaToBlob
  aiMask?: typeof runAiMask
}

const DEFAULT_DEPS: Required<Pick<BgRemovalDeps, "loadRgba" | "toBlob" | "aiMask">> = {
  loadRgba: loadImageRgba,
  toBlob: rgbaToBlob,
  aiMask: runAiMask,
}

export function runBackgroundRemoval(
  input: BgRemovalInput,
  deps: BgRemovalDeps = {},
): FileJob<BgRemovalOutput> {
  const { loadRgba, toBlob, aiMask } = { ...DEFAULT_DEPS, ...deps }
  let cancelled = false
  let onProgress: (p: number) => void = () => {}

  const promise = (async () => {
    try {
      onProgress(0.05)
      const bytesIn = input.file.size

      const loaded = await loadRgba(input.file)
      if (cancelled) throw new Error("cancelled")

      onProgress(0.3)
      const { mask, analysis } = await maskFor(input, loaded, aiMask)

      if (input.mode === "solid" && foregroundRatio(mask) <= 0.01) {
        return {
          success: false as const,
          data: undefined as unknown as BgRemovalOutput,
          error: {
            code: "bgrm_no_foreground",
            message:
              "No subject found — the image looks like a flat, single-colour picture. AI mode handles complex backgrounds.",
          },
          meta: { bytesIn, bytesOut: 0, durationMs: 0 },
        }
      }

      onProgress(0.6)
      const rgbaOut = applyOperator(input, loaded, mask)
      const blob = await toBlob(rgbaOut, loaded.size, input.format)
      if (cancelled) throw new Error("cancelled")

      onProgress(1)
      return {
        success: true as const,
        data: {
          blob,
          fileName: backgroundRemovedFileName(input.file, input.format),
          width: loaded.size.width,
          height: loaded.size.height,
          bytes: blob.size,
          format: input.format,
          mask,
          foregroundRatio: foregroundRatio(mask),
          mode: input.mode,
          analysis,
        },
        meta: { bytesIn, bytesOut: blob.size, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false as const,
        data: undefined as unknown as BgRemovalOutput,
        error: { code: "bgrm_error", message: (err as Error).message },
        meta: { bytesIn: 0, bytesOut: 0, durationMs: 0 },
      }
    }
  })()

  return {
    result: promise,
    onProgress: (fn) => {
      onProgress = fn
    },
    cancel: () => {
      cancelled = true
    },
  }
}

interface RgbaSource {
  rgba: Uint8ClampedArray
  size: { width: number; height: number }
}

async function maskFor(
  input: BgRemovalInput,
  loaded: RgbaSource,
  aiMask: typeof runAiMask,
): Promise<{ mask: AlphaMask; analysis: SolidAnalysis | null }> {
  if (input.mode === "ai") {
    const ai = await aiMask(loaded.rgba, loaded.size)
    if (!ai.ok) throw new Error(ai.reason)
    return { mask: ai.mask, analysis: null }
  }
  const res = extractSolidMask(loaded.rgba, loaded.size, input.solid ?? {})
  return { mask: res.mask, analysis: res.analysis }
}

function applyOperator(input: BgRemovalInput, loaded: RgbaSource, mask: AlphaMask): RgbaBuffer {
  switch (input.output) {
    case "replace":
      return replaceBackgroundColor(loaded.rgba, mask, input.replaceColor ?? [0, 0, 0])
    case "blur":
      return blurBackground(loaded.rgba, loaded.size, mask, input.blurRadius ?? 6)
    default:
      return removeBackground(loaded.rgba, mask)
  }
}

export function foregroundRatio(mask: AlphaMask): number {
  let fg = 0
  for (let i = 0; i < mask.length; i++) if (mask[i] >= 128) fg++
  return mask.length === 0 ? 0 : fg / mask.length
}

/** Cheap UI recommendation hook — returns a border-analysis-driven suggestion. */
export function recommend(rgba: RgbaBuffer, size: Size): SolidAnalysis {
  return recommendMode(rgba, size)
}