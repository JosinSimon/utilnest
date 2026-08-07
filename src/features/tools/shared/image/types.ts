/**
 * Shared, renderer-agnostic type definitions for the Toolza image engine.
 * These types are used by every pure module in `shared/image` and by the
 * impure `driver.ts`. Keeping them here avoids circular imports and gives a
 * single source of truth for the engine contract.
 */

// ---- Dimensions ----------------------------------------------------------

export type DimensionUnit = "px" | "cm" | "inch"

export interface Dimensions {
  width: number
  height: number
  unit: DimensionUnit
}

export interface AspectRatio {
  width: number
  height: number
}

// ---- Formats -------------------------------------------------------------

export type ImageFormat = "jpeg" | "png"

// ---- Processing status / result ------------------------------------------

export type JobStatus =
  | "ok"
  | "cannotHitTarget" // requested size can't be satisfied without violating required dimensions
  | "cannotHitMin" // image too small / not compressible enough to reach kbMin
  | "notCompliant" // final output does not satisfy the selected spec (awd informational)
  | "invalid" // input rejected by validation (wrong format, bad dimensions, etc.)

export interface ValidationIssue {
  severity: "error" | "warning" | "info"
  code: string
  message: string
}

export interface ValidationReport {
  compliant: boolean
  /** Per-metrick findings. */
  issues: ValidationIssue[]
}

export interface ProcessedOutput {
  status: JobStatus
  blob: Blob
  format: ImageFormat
  /** Physical dimensions of the produced image. */
  width: number
  height: number
  /** Final file size in bytes (== blob.size). */
  bytes: number
  /** JPEG quality used for the last encode (0..1) or 1 for PNG. */
  quality: number
  /** Human-readable summary for the UI. */
  message: string
  validation?: ValidationReport
  report?: ProcessingReport
}

// ---- Processing report ---------------------------------------------------

export interface ProcessingReport {
  original: {
    width: number
    height: number
    bytes: number
    format?: string
  }
  final: {
    width: number
    height: number
    bytes: number
    format: ImageFormat
  }
  /** JPEG quality as a fraction (0..1) used for the final encode. */
  jpegQuality: number
  compressionRatio: number // e.g. 0.99 = 99%
  presetId?: string
  presetName?: string
  steps?: { label: string; value: string }[]
}

// ---- Specs / presets -----------------------------------------------------

export interface OfficialSpecPreset {
  id: string
  exam: string
  organization: string
  documentType: "photo" | "signature" | "thumb-impression"
  /** Exact or nominal dimensions required by the specification. */
  dimensions: Dimensions
  /** Minimum file size in KB (0 = no minimum). */
  kbMin: number
  /** Maximum file size in KB (Infinity = no maximum). */
  kbMax: number
  acceptedFormats: ImageFormat[]
  /** The file type we should emit by default. */
  preferredFormat: ImageFormat
  /** Expected background colour, where the spec defines it (e.g. "white"). */
  backgroundColor?: "white" | "light" | "blue" | "any"
  /**
   * When true, the engine may reduce dimensions to hit a file-size target.
   * Official government presets MUST keep this false so we never silently
   * shrink a mandated requirement.
   */
  allowDownscale: boolean
  /** Source of truth: official notification or official application portal. */
  sourceUrl?: string
  notificationYear?: number
  /** ISO date the specification was last verified against an official source. */
  lastVerified?: string
  /** true only when confirmed against an official source. */
  verified: boolean
  notes?: string
}

export interface ResizeToPixelsOptions {
  width: number
  height: number
  format: ImageFormat
}

export interface CompressFileOptions {
  meta: TargetKbOptions
  customDimensions?: Dimensions | null
}

export interface TargetKbOptions {
  mode: "range" | "exact"
  kbMin: number
  kbMax: number
  /** Draft for exact mode: resize to these pixels before compressing. */
  width?: number
  height?: number
  allowedFormats: ImageFormat[]
  allowDownscale: boolean
  minDimensionGuard: number
}