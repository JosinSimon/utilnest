import type {
  ImageFormat,
  OfficialSpecPreset,
  ProcessedOutput,
  ProcessingReport,
} from "./types"
import { decodeImage, makeRenderHandle } from "./driver"
import { compressToTarget, type CompressOutcome } from "./compressor"
import { validateCandidate, type ImageCandidate } from "./validator"
import { dimensionsToPixels } from "./geometry"
import { buildProcessingReport } from "./metadata"
import { sampleBackgroundBrightness } from "./driverOps"

/**
 * PRESET PIPELINE — orchestrates the full file → preset-compliant output flow
 * used by every government-form tool (photo resizer, passport, signature,
 * exam preset, Aadhaar/PAN).
 *
 *   upload → decode (EXIF-normalized) → resize to preset px → compress to
 *   preset KB range (allowDownscale=false, never silently shrink) → validate
 *   final output → compile report → download.
 *
 * It composes the pure modules (compressor, validator, geometry, metadata)
 * with the single impure driver. Tools only call `runPresetPipeline` — they
 * never touch canvas internals.
 */

export interface PresetPipelineInput {
  file: File
  preset: OfficialSpecPreset
  /** DPI used to resolve cm/inch dimensions to pixels. Defaults to 300. */
  dpi?: number
}

export interface PresetPipelineOutput {
  output: ProcessedOutput
  report: ProcessingReport
  /** Validation issues for the UI (errors + warnings + info). */
  issues: { severity: "error" | "warning" | "info"; message: string }[]
  compliant: boolean
}

/** Resolve a preset's dimensions (px or cm) to pixel dimensions. */
export function presetPixels(
  preset: OfficialSpecPreset,
  dpi = 300,
): { width: number; height: number } {
  return dimensionsToPixels(preset.dimensions, dpi)
}

export async function runPresetPipeline(
  input: PresetPipelineInput,
): Promise<PresetPipelineOutput> {
  const { preset } = input
  const dpi = input.dpi ?? 300

  // 1) Decode — EXIF orientation is normalized during decode (smartphone photos upright).
  const decoded = await decodeImage(input.file)
  const original = {
    width: decoded.sourceWidth,
    height: decoded.sourceHeight,
    bytes: input.file.size,
    format: decoded.format ?? (decoded.format as ImageFormat | undefined),
    exifPresent: false,
  }

  // 2) Resize ONCE to the exact preset dimensions (never more).
  const { width, height } = presetPixels(preset, dpi)
  const handle = makeRenderHandle(decoded, width, height)
  const compressInput = handle.asCompressInput(width, height)

  // 3) Compress to the preset KB range. allowDownscale=false is guaranteed by
  //    the preset registry — dimensions are never silently shrunk to fit size.
  const target = {
    mode: "range" as const,
    kbMin: preset.kbMin,
    kbMax: preset.kbMax,
    width,
    height,
    allowedFormats: preset.acceptedFormats,
    allowDownscale: false,
    minDimensionGuard: 1,
  }
  const outcome = await compressToTarget(compressInput, target)

  // 4) Validate the FINAL output against the preset.
  const backgroundBrightness = sampleBackgroundBrightness(handle.toCanvas())
  const candidate: ImageCandidate = {
    width: outcome.width,
    height: outcome.height,
    bytes: outcome.bytes,
    format: outcome.format,
    backgroundBrightness,
  }
  const validation = validateCandidate(candidate, preset)

  // 5) Compile the report.
  const report = buildProcessingReport({
    original,
    final: {
      width: outcome.width,
      height: outcome.height,
      bytes: outcome.bytes,
      format: outcome.format,
    },
    jpegQuality: outcome.quality,
    presetId: preset.id,
    presetName: preset.exam,
    steps: [
      { label: "Decoded", value: `${original.width}×${original.height}px` },
      { label: "Resized", value: `${width}×${height}px` },
      { label: "Compressed", value: formatKb(outcome.bytes) },
      { label: "Validated", value: validation.compliant ? "Compliant" : "Not compliant" },
    ],
  })

  const output: ProcessedOutput = {
    status: outcome.status,
    blob: outcome.blob,
    format: outcome.format,
    width: outcome.width,
    height: outcome.height,
    bytes: outcome.bytes,
    quality: outcome.quality,
    message: outcome.message,
    validation,
    report,
  }

  return {
    output,
    report,
    issues: validation.issues.map((i) => ({ severity: i.severity, message: i.message })),
    compliant: validation.compliant,
  }
}

function formatKb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`
}

export type { CompressOutcome }
