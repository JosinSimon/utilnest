import type { AlphaMask, RgbaBuffer, Size } from "./types"

/**
 * Mask/image geometry helpers — pure pixel resampling and cropping. Used to
 * scale masks between working resolutions and to locate the foreground
 * bounding box (the base of autocrop / object isolation / product photos).
 */

export interface CropBox {
  x: number
  y: number
  width: number
  height: number
}

/** Bilinear resize of an 8-bit mask. */
export function resizeMask(mask: AlphaMask, from: Size, to: Size): AlphaMask {
  const out = new Uint8Array(to.width * to.height)
  const xScale = from.width / to.width
  const yScale = from.height / to.height
  for (let y = 0; y < to.height; y++) {
    const sy = y * yScale
    const y0 = Math.min(Math.floor(sy), from.height - 1)
    const y1 = Math.min(y0 + 1, from.height - 1)
    const fy = sy - y0
    const oy = y * to.width
    for (let x = 0; x < to.width; x++) {
      const sx = x * xScale
      const x0 = Math.min(Math.floor(sx), from.width - 1)
      const x1 = Math.min(x0 + 1, from.width - 1)
      const fx = sx - x0
      const v00 = mask[y0 * from.width + x0]
      const v10 = mask[y1 * from.width + x0]
      const v01 = mask[y0 * from.width + x1]
      const v11 = mask[y1 * from.width + x1]
      const top = v00 * (1 - fx) + v01 * fx
      const bottom = v10 * (1 - fx) + v11 * fx
      out[oy + x] = Math.round(top * (1 - fy) + bottom * fy)
    }
  }
  return out
}

/** Bilinear resize of RGBA (needed to downscale before AI / upscale after). */
export function resizeRgba(rgba: RgbaBuffer, from: Size, to: Size): RgbaBuffer {
  const out = new Uint8ClampedArray(to.width * to.height * 4)
  const xScale = from.width / to.width
  const yScale = from.height / to.height
  for (let y = 0; y < to.height; y++) {
    const sy = y * yScale
    const y0 = Math.min(Math.floor(sy), from.height - 1)
    const y1 = Math.min(y0 + 1, from.height - 1)
    const fy = sy - y0
    const oy = y * to.width
    for (let x = 0; x < to.width; x++) {
      const sx = x * xScale
      const x0 = Math.min(Math.floor(sx), from.width - 1)
      const x1 = Math.min(x0 + 1, from.width - 1)
      const fx = sx - x0
      const s00 = (y0 * from.width + x0) * 4
      const s10 = (y1 * from.width + x0) * 4
      const s01 = (y0 * from.width + x1) * 4
      const s11 = (y1 * from.width + x1) * 4
      const o = oy * 4 + x * 4
      for (let c = 0; c < 4; c++) {
        const top = rgba[s00 + c] * (1 - fx) + rgba[s01 + c] * fx
        const bottom = rgba[s10 + c] * (1 - fx) + rgba[s11 + c] * fx
        out[o + c] = Math.round(top * (1 - fy) + bottom * fy)
      }
    }
  }
  return out
}

/**
 * Bounding box of the foreground (mask >= minForeground, default 128).
 * Returns the smallest rect that contains the subject, optionally expanded by
 * a padding ratio. Returns `null` when nothing is foreground.
 */
export function autocropMask(
  mask: AlphaMask,
  size: Size,
  opts: { minForeground?: number; paddingRatio?: number } = {},
): CropBox | null {
  const minFg = opts.minForeground ?? 128
  const pad = opts.paddingRatio ?? 0
  let minX = size.width
  let minY = size.height
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < size.height; y++) {
    const r = y * size.width
    for (let x = 0; x < size.width; x++) {
      if (mask[r + x] >= minFg) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return null
  let w = maxX - minX + 1
  let h = maxY - minY + 1
  if (pad > 0) {
    const pw = Math.round(w * pad)
    const ph = Math.round(h * pad)
    minX = Math.max(0, minX - pw)
    minY = Math.max(0, minY - ph)
    w = Math.min(size.width - minX, w + 2 * pw)
    h = Math.min(size.height - minY, h + 2 * ph)
  }
  return { x: minX, y: minY, width: w, height: h }
}

/** Crop a mask to a box (primarily used alongside rgba crops). */
export function cropMask(mask: AlphaMask, size: Size, box: CropBox): AlphaMask {
  const out = new Uint8Array(box.width * box.height)
  for (let y = 0; y < box.height; y++) {
    const sr = (y + box.y) * size.width + box.x
    const dr = y * box.width
    for (let x = 0; x < box.width; x++) out[dr + x] = mask[sr + x]
  }
  return out
}

/** Crop an RGBA buffer to a sub-region. */
export function cropRgba(rgba: RgbaBuffer, size: Size, box: CropBox): RgbaBuffer {
  const out = new Uint8ClampedArray(box.width * box.height * 4)
  for (let y = 0; y < box.height; y++) {
    const srcRow = (y + box.y) * size.width + box.x
    const dr = y * box.width
    for (let x = 0; x < box.width; x++) {
      const si = (srcRow + x) * 4
      const di = (dr + x) * 4
      out[di] = rgba[si]
      out[di + 1] = rgba[si + 1]
      out[di + 2] = rgba[si + 2]
      out[di + 3] = rgba[si + 3]
    }
  }
  return out
}