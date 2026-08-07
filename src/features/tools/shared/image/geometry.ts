import type { AspectRatio, Dimensions } from "./types"

/**
 * Pure pixel geometry helpers. No DOM / canvas access.
 * DPI conversion ALWAYS uses:
 *   pixels = (cm / 2.54) * dpi
 * and never assumes 96 DPI.
 */

export const CM_PER_INCH = 2.54

/** Convert centimeters to pixels at a given DPI. */
export function cmToPx(cm: number, dpi: number): number {
  return Math.round((cm / CM_PER_INCH) * dpi)
}

/** Convert pixels to centimeters at a given DPI. */
export function pxToCm(px: number, dpi: number): number {
  return (px / dpi) * CM_PER_INCH
}

/** Convert inches to pixels. */
export function inchToPx(inches: number, dpi: number): number {
  return Math.round(inches * dpi)
}

/** Convert pixels to inches. */
export function pxToInch(px: number, dpi: number): number {
  return px / dpi
}

/** Resolve a Dimensions object (possibly in cm/inch/px) to pixels at a DPI. */
export function dimensionsToPixels(dims: Dimensions, dpi = 72): { width: number; height: number } {
  const toPx = (value: number, unit: Dimensions["unit"]): number => {
    if (unit === "cm") return cmToPx(value, dpi)
    if (unit === "inch") return inchToPx(value, dpi)
    return Math.round(value)
  }
  return { width: toPx(dims.width, dims.unit), height: toPx(dims.height, dims.unit) }
}

/** Aspect ratio normalized to a canonical (w,h) pair with a common divisor. */
export function aspectRatio(width: number, height: number): AspectRatio {
  const g = gcd(width, height)
  return { width: width / g, height: height / g }
}

/** Largest positive integer dividing a and b. */
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a || 1
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/** Fit a source rect into a target box preserving aspect ratio (letterbox). */
export function fitRect(
  srcWidth: number,
  srcHeight: number,
  targetWidth: number,
  targetHeight: number,
): Rect {
  const scale = Math.min(targetWidth / srcWidth, targetHeight / srcHeight)
  const width = Math.round(srcWidth * scale)
  const height = Math.round(srcHeight * scale)
  return {
    x: Math.round((targetWidth - width) / 2),
    y: Math.round((targetHeight - height) / 2),
    width,
    height,
  }
}

/** Cover the source into a target box, cropping the overflow (object-fit: cover). */
export function coverRect(
  srcWidth: number,
  srcHeight: number,
  targetWidth: number,
  targetHeight: number,
): Rect {
  const scale = Math.max(targetWidth / srcWidth, targetHeight / srcHeight)
  const width = Math.round(srcWidth * scale)
  const height = Math.round(srcHeight * scale)
  return {
    x: Math.round((width - targetWidth) / 2),
    y: Math.round((height - targetHeight) / 2),
    width,
    height,
  }
}

/** Clamp a crop rect to the source bounds. Coordinates are in source px. */
export function clampCrop(rect: Rect, srcWidth: number, srcHeight: number): Rect {
  const x = clamp(rect.x, 0, Math.max(0, srcWidth - rect.width))
  const y = clamp(rect.y, 0, Math.max(0, srcHeight - rect.height))
  return {
    x,
    y,
    width: clamp(rect.width, 1, srcWidth),
    height: clamp(rect.height, 1, srcHeight),
  }
}

export type Rotation = 0 | 90 | 180 | 270

/**
 * Mapping of EXIF orientation values to the transform we should apply to
 * correct it. EXIF orientation describes how to rotate the stored image so it
 * displays upright. `from-image` handling via ImageBitmap already normalizes,
 * but this pure table lets us reason and test independently.
 */
export interface OrientationTransform {
  rotate: Rotation
  flipX: boolean
  swapWidthHeight: boolean
}

/**
 * Decodes EXIF orientation (1..8) into a normalize transform.
 * Orientation 1 = as-is; 2-8 = flipped/rotated variants.
 * Returns null for unset/invalid (treated as identity).
 */
export function orientationToTransform(orientation: number): OrientationTransform | null {
  switch (orientation) {
    case 1:
      return { rotate: 0, flipX: false, swapWidthHeight: false }
    case 2:
      return { rotate: 0, flipX: true, swapWidthHeight: false }
    case 3:
      return { rotate: 180, flipX: false, swapWidthHeight: false }
    case 4:
      return { rotate: 180, flipX: true, swapWidthHeight: false }
    case 5:
      return { rotate: 270, flipX: true, swapWidthHeight: true }
    case 6:
      return { rotate: 90, flipX: false, swapWidthHeight: true }
    case 7:
      return { rotate: 90, flipX: true, swapWidthHeight: true }
    case 8:
      return { rotate: 270, flipX: false, swapWidthHeight: true }
    default:
      return null
  }
}

/** New (width,height) after applying the orientation transform. */
export function orientedSize(
  width: number,
  height: number,
  tx: OrientationTransform | null,
): { width: number; height: number } {
  if (tx?.swapWidthHeight) return { width: height, height: width }
  return { width, height }
}

/** Compute canvas transform operations (translate/rotate/scale) for a rotation. */
export function rotationCanvasTransform(
  _ctx: unknown,
  rotation: Rotation,
  width: number,
  height: number,
): { translateX: number; translateY: number; rotateRadians: number; hasRotate: boolean } {
  switch (rotation) {
    case 90:
      return { translateX: height, translateY: 0, rotateRadians: Math.PI / 2, hasRotate: true }
    case 180:
      return { translateX: width, translateY: height, rotateRadians: Math.PI, hasRotate: true }
    case 270:
      return { translateX: 0, translateY: width, rotateRadians: (3 * Math.PI) / 2, hasRotate: true }
    default:
      return { translateX: 0, translateY: 0, rotateRadians: 0, hasRotate: false }
  }
}

/** Scale factor that fits src into target preserving aspect (number only). */
export function fitScale(sWidth: number, sHeight: number, tWidth: number, tHeight: number): number {
  return Math.min(tWidth / sWidth, tHeight / sHeight)
}

/** Clamp a pixel value into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}