import type { AlphaMask, Size } from "./types"

/**
 * Mask refinement operators. All operate purely on `AlphaMask` buffers and
 * preserve dimensions. They are the "edge quality" layer on top of the base
 * matchers: erode strips the translucent halo, feather softens the edge.
 */

/** Binary erosion: shrink the foreground (mask>=128) by `radius` px. */
export function erodeMask(mask: AlphaMask, size: Size, radius = 1): AlphaMask {
  if (radius <= 0) return new Uint8Array(mask)
  const { width, height } = size
  const n = width * height
  const out = new Uint8Array(n)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let keep = true
      outer: for (let oy = -radius; oy <= radius; oy++) {
        const yy = y + oy
        if (yy < 0 || yy >= height) continue
        for (let ox = -radius; ox <= radius; ox++) {
          const xx = x + ox
          if (xx < 0 || xx >= width) continue
          if (mask[yy * width + xx] < 128) {
            keep = false
            break outer
          }
        }
      }
      out[y * width + x] = keep ? 255 : 0
    }
  }
  return out
}

/** Binary dilation: grow the foreground by radius px (used before feathing). */
export function dilateMask(mask: AlphaMask, size: Size, radius = 1): AlphaMask {
  if (radius <= 0) return new Uint8Array(mask)
  const { width, height } = size
  const n = width * height
  const out = new Uint8Array(n)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let set = false
      outer: for (let oy = -radius; oy <= radius; oy++) {
        const yy = y + oy
        if (yy < 0 || yy >= height) continue
        for (let ox = -radius; ox <= radius; ox++) {
          const xx = x + ox
          if (xx < 0 || xx >= width) continue
          if (mask[yy * width + xx] >= 128) {
            set = true
            break outer
          }
        }
      }
      out[y * width + x] = set ? 255 : 0
    }
  }
  return out
}

/**
 * Gaussian-ish edge smoothing: blur the binary mask then clip to 0..255.
 * This produces the soft "2px of feathering" every good cutout has.
 * Uses two passes of a box blur (radius px) which is fast and stable.
 */
export function featherMask(mask: AlphaMask, size: Size, radius = 2): AlphaMask {
  if (radius <= 0) return new Uint8Array(mask)
  const { width, height } = size
  const pass1 = boxBlurPass(mask, width, height, radius)
  const pass2 = boxBlurPass(pass1, width, height, radius)
  return pass2
}

function boxBlurPass(src: AlphaMask, width: number, height: number, radius: number): AlphaMask {
  // Horizontal pass
  const hor = new Uint8Array(src.length)
  for (let y = 0; y < height; y++) {
    const rowStart = y * width
    let acc = 0
    let count = 0
    for (let x = -radius; x < width + radius; x++) {
      // slide window
      const addX = x + radius
      if (addX >= 0 && addX < width) {
        acc += src[rowStart + addX]
        count++
      }
      const remX = x - radius - 1
      if (remX >= 0 && remX < width) {
        acc -= src[rowStart + remX]
        count--
      }
      if (x >= 0 && x < width) {
        hor[rowStart + x] = Math.round(acc / Math.max(1, count))
      }
    }
  }
  // Vertical blur using horizontal result
  const out = new Uint8Array(src.length)
  for (let x = 0; x < width; x++) {
    let acc = 0
    let count = 0
    for (let y = -radius; y < height + radius; y++) {
      const addY = y + radius
      if (addY >= 0 && addY < height) {
        acc += hor[addY * width + x]
        count++
      }
      const remY = y - radius - 1
      if (remY >= 0 && remY < height) {
        acc -= hor[remY * width + x]
        count--
      }
      if (y >= 0 && y < height) {
        out[y * width + x] = Math.round(acc / Math.max(1, count))
      }
    }
  }
  return out
}