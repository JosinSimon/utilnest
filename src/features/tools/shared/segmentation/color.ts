import type { RgbColor, RgbaBuffer, Size } from "./types"

/**
 * Pure color math and background analysis. No DOM / no side effects — every
 * function is deterministic over its inputs so they can be unit-tested with
 * synthetic pixel buffers.
 */

/** Euclidean RGB distance (0..~441). */
export function rgbDistance(a: RgbColor, b: RgbColor): number {
  const dr = a[0] - b[0]
  const dg = a[1] - b[1]
  const db = a[2] - b[2]
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

/** Perceived luminance, 0..255. */
export function luminance(rgb: RgbColor): number {
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
}

/**
 * Sample a pixel's RGB at (x, y). Returns [0,0,0] for out-of-bounds reads so
 * callers never need to guard arithmetic on transparent corners.
 */
export function pixelRgb(rgba: RgbaBuffer, width: number, x: number, y: number): RgbColor {
  const off = (y * width + x) * 4
  const a = rgba[off + 3]
  if (a === 0) return [0, 0, 0]
  // Premultiplied decode: undo alpha so a translucent halo still reads its
  // original color rather than "dimmed toward black".
  const ia = a / 255
  return [Math.round(rgba[off] / ia), Math.round(rgba[off + 1] / ia), Math.round(rgba[off + 2] / ia)]
}

/**
 * Analyze the border ring of an image: derive the dominant border color, its
 * variance, and how uniform the border is. This powers both the solid matcher
 * and the UI's mode recommendation.
 */
export function analyzeBorder(
  rgba: RgbaBuffer,
  size: Size,
  opts: { tolerance?: number; sampleLimit?: number } = {},
): {
  backgroundColor: RgbColor
  edgeVariance: number
  borderCoverage: number
  isSolid: boolean
  recommendedMode: "solid" | "ai"
} {
  const { width, height } = size
  const tolerance = opts.tolerance ?? 48

  // Collect a bounded sample of border pixels: perimeter with a stride that
  // keeps the analysis cheap on huge images.
  const cols: RgbColor[] = []
  const maxSamples = opts.sampleLimit ?? 8000
  // Perimeter length; pick a stride so we grab ~maxSamples points.
  const perimeterLength = 2 * (width + height)
  const stride = Math.max(1, Math.floor(perimeterLength / maxSamples))

  const push = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const off = (y * width + x) * 4
    if (rgba[off + 3] === 0) return
    cols.push(sampleRgb(rgba, off))
  }

  for (let x = 0; x < width; x += stride) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 1; y < height - 1; y += stride) {
    push(0, y)
    push(width - 1, y)
  }

  if (cols.length === 0) {
    return {
      backgroundColor: [255, 255, 255],
      edgeVariance: 1,
      borderCoverage: 0,
      isSolid: false,
      recommendedMode: "ai",
    }
  }

  // Bin-quantize into a 5-bit volume and pick the most frequent bucket to
  // resist JPEG noise / faint gradients.
  const bins = new Map<number, { sum: [number, number, number]; n: number }>()
  const shift = 3 // 5 bits per channel -> 32 buckets/channel
  const key = (c: RgbColor) => ((c[0] >> shift) << 10) | ((c[1] >> shift) << 5) | (c[2] >> shift)
  for (const c of cols) {
    const k = key(c)
    const entry = bins.get(k) ?? { sum: [0, 0, 0], n: 0 }
    entry.sum[0] += c[0]
    entry.sum[1] += c[1]
    entry.sum[2] += c[2]
    entry.n++
    bins.set(k, entry)
  }
  let bestKey = -1
  let bestN = 0
  for (const [k, e] of bins) {
    if (e.n > bestN) {
      bestN = e.n
      bestKey = k
    }
  }
  const best = bins.get(bestKey)!
  const backgroundColor: RgbColor = [
    Math.round(best.sum[0] / best.n),
    Math.round(best.sum[1] / best.n),
    Math.round(best.sum[2] / best.n),
  ]

  // Mean color deviation of the whole border (per-channel, 0..255) and how
  // many samples fall within tolerance of the dominant color.
  let devSum = 0
  let within = 0
  for (const c of cols) {
    devSum +=
      Math.abs(c[0] - backgroundColor[0]) +
      Math.abs(c[1] - backgroundColor[1]) +
      Math.abs(c[2] - backgroundColor[2])
    if (rgbDistance(c, backgroundColor) <= tolerance) within++
  }
  const edgeVariance = devSum / cols.length / (255 * 3)
  const borderCoverage = within / cols.length
  const isSolid = borderCoverage >= 0.85 && edgeVariance <= 0.22
  const recommendedMode = isSolid ? ("solid" as const) : ("ai" as const)

  return { backgroundColor, edgeVariance, borderCoverage, isSolid, recommendedMode }
}

/** Inline RGB decoder for a byte offset. */
function sampleRgb(rgba: RgbaBuffer, off: number): RgbColor {
  const a = rgba[off + 3]
  if (a >= 255) return [rgba[off], rgba[off + 1], rgba[off + 2]]
  const ia = a / 255
  return [
    Math.round(rgba[off] / ia),
    Math.round(rgba[off + 1] / ia),
    Math.round(rgba[off + 2] / ia),
  ]
}