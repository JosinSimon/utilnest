/**
 * Shared, renderer-agnostic segmentation types.
 *
 * The segmentation engine's core contract is a *foreground mask*: every
 * source (solid-background matcher, AI inference) produces an `AlphaMask`
 * describing foreground coverage (0..255) per pixel. All downstream
 * operations (remove/replace/blur background, autocrop, passport photo,
 * product photo, object isolation, stickers) consume `(rgba, mask, size)`
 * and never read the engine's internals.
 */

/** RGBA pixel buffer (length === width * height * 4). */
export type RgbaBuffer = Uint8ClampedArray

/** Foreground coverage mask (length === width * height), 0..255. */
export type AlphaMask = Uint8Array

export type RgbColor = readonly [number, number, number]

export interface Size {
  width: number
  height: number
}

export type SegMode = "solid" | "ai"

/** How the solid matcher selects background. */
export type SolidMatchMode = "edge" | "color"

export interface SolidOptions {
  matchMode?: SolidMatchMode
  /** RGB distance (0..255) a pixel may deviate from the background. */
  tolerance?: number
  /** Explicit background color. When matchMode is "color" this is required. */
  targetColor?: RgbColor | null
  /** Binary pre-erosion (px) to strip the translucent halo around the subject. */
  erodeRadius?: number
  /** Box-blur radius (px) applied to the mask alpha for soft edges. */
  featherRadius?: number
  /** Fill small enclosed holes inside the subject. */
  fillHoles?: boolean
  /** Pixels with alpha below this (0..255) are always treated as background. */
  minAlphaKeep?: number
  /** Optional max work pixels before the solid matcher downscales. */
  maxWorkPixels?: number
}

export interface SolidAnalysis {
  /** Detected (border-dominant) background color. */
  backgroundColor: RgbColor
  /** Normalized variance (0..1) of the border ring. Low = solid. */
  edgeVariance: number
  /** Fraction of border samples within the solid tolerance of the bg color. */
  borderCoverage: number
  /** Whether the border looks like a solid/uniform background. */
  isSolid: boolean
  /** Which mode the UI should recommend. */
  recommendedMode: SegMode
}

export interface MaskStats {
  /** Fraction of pixels with mask >= 128 (kept as foreground). */
  foregroundRatio: number
  /** 1 - foregroundRatio. */
  backgroundRatio: number
}

export interface MaskResult {
  mask: AlphaMask
  size: Size
  /** Set when the mask came from the solid matcher. */
  analysis: SolidAnalysis | null
  stats: MaskStats
  message: string
}

export interface BackgroundMetrics {
  coverage: number
  pixelCount: number
}