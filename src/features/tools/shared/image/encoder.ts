import type { ImageFormat } from "./types"

/**
 * Encoding configuration helpers. Pure — actual Blob encoding (which requires
 * a canvas / document) lives in driver.ts. These helpers keep the format
 * contract deterministic and testable without a canvas.
 */

export interface EncodeOptions {
  format: ImageFormat
  /** JPEG quality, 0.15 .. 1.0. Ignored for PNG. */
  quality?: number
}

/** Mime type string for a given format. */
export function mimeFor(format: ImageFormat): string {
  return format === "png" ? "image/png" : "image/jpeg"
}

/** Conventional file extension for a format. */
export function extensionFor(format: ImageFormat): string {
  return format === "png" ? "png" : "jpg"
}

/** Clamp JPEG quality to the representable band [0.15, 1.0]. */
export function clampQuality(quality: number): number {
  if (Number.isNaN(quality)) return 1
  return Math.min(1, Math.max(0.15, quality))
}

/** Human label for a format. */
export function formatLabel(format: ImageFormat): string {
  return format === "png" ? "PNG" : "JPEG"
}

/** Default encode options for a given format. */
export function defaultEncodeOptions(format: ImageFormat): EncodeOptions {
  return { format, quality: format === "png" ? 1 : 0.85 }
}

export interface EncodingStats {
  format: ImageFormat
  quality: number
  bytes: number
}

/** Turn a measured encode into stats for reporting. */
export function encodeStats(format: ImageFormat, quality: number, bytes: number): EncodingStats {
  return { format, quality, bytes }
}