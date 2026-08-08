import type { AlphaMask, RgbColor, RgbaBuffer, Size } from "./types"

/**
 * Downstream operations that consume a foreground `AlphaMask`. The engine
 * never decides how a mask is used — tools compose these operators:
 *   - remove background      -> transparent PNG
 *   - replace background     -> color / image backplate
 *   - blur background        -> shallow depth of field effect
 *   - (future) stamp, sticker, product scene flatlays
 */

export function removeBackground(rgba: RgbaBuffer, mask: AlphaMask): RgbaBuffer {
  const out = new Uint8ClampedArray(rgba.length)
  for (let i = 0; i < mask.length; i++) {
    const o = i * 4
    out[o] = rgba[o]
    out[o + 1] = rgba[o + 1]
    out[o + 2] = rgba[o + 2]
    out[o + 3] = mask[i]
  }
  return out
}

/**
 * Replace the background with a solid color, keeping semi-transparent edge
 * pixels blended against the new color so the fringe looks clean.
 */
export function replaceBackgroundColor(
  rgba: RgbaBuffer,
  mask: AlphaMask,
  color: RgbColor,
): RgbaBuffer {
  const out = new Uint8ClampedArray(rgba.length)
  for (let i = 0; i < mask.length; i++) {
    const o = i * 4
    const a = mask[i] / 255
    const ia = 1 - a
    out[o] = Math.round(rgba[o] * a + color[0] * ia)
    out[o + 1] = Math.round(rgba[o + 1] * a + color[1] * ia)
    out[o + 2] = Math.round(rgba[o + 2] * a + color[2] * ia)
    out[o + 3] = 255
  }
  return out
}

/**
 * Blur only the background (everything outside the mask). The subject stays
 * perfectly sharp; the surroundings get a gaussian-ish blur for the
 * "portrait mode" feel.
 */
export function blurBackground(
  rgba: RgbaBuffer,
  size: Size,
  mask: AlphaMask,
  radius = 6,
): RgbaBuffer {
  const blurred = boxBlurRgb(rgba, size, radius)
  const out = new Uint8ClampedArray(rgba.length)
  for (let i = 0; i < mask.length; i++) {
    const o = i * 4
    const a = mask[i] / 255
    const ia = 1 - a
    // Where foreground dominates, keep the original (sharp) pixel.
    out[o] = Math.round(rgba[o] * a + blurred[o] * ia)
    out[o + 1] = Math.round(rgba[o + 1] * a + blurred[o + 1] * ia)
    out[o + 2] = Math.round(rgba[o + 2] * a + blurred[o + 2] * ia)
    out[o + 3] = 255
  }
  return out
}

/** Simple separable box blur over RGB (alpha untouched). */
function boxBlurRgb(rgba: RgbaBuffer, size: Size, radius: number): Uint8ClampedArray {
  const { width, height } = size
  const tmp = new Float32Array(rgba.length)
  const out = new Uint8ClampedArray(rgba.length)
  const rr = Math.max(1, Math.round(radius))

  // Horizontal
  for (let y = 0; y < height; y++) {
    for (let c = 0; c < 3; c++) {
      let acc = 0
      let count = 0
      for (let x = -rr; x < width + rr; x++) {
        const addX = x + rr
        const remX = x - rr - 1
        if (addX >= 0 && addX < width) {
          acc += rgba[(y * width + addX) * 4 + c]
          count++
        }
        if (remX >= 0 && remX < width) {
          acc -= rgba[(y * width + remX) * 4 + c]
          count--
        }
        if (x >= 0 && x < width) tmp[(y * width + x) * 4 + c] = acc / Math.max(1, count)
      }
    }
  }
  // Vertical
  for (let x = 0; x < width; x++) {
    for (let c = 0; c < 3; c++) {
      let acc = 0
      let count = 0
      for (let y = -rr; y < height + rr; y++) {
        const addY = y + rr
        const remY = y - rr - 1
        if (addY >= 0 && addY < height) {
          acc += tmp[(addY * width + x) * 4 + c]
          count++
        }
        if (remY >= 0 && remY < height) {
          acc -= tmp[(remY * width + x) * 4 + c]
          count--
        }
        if (y >= 0 && y < height) out[(y * width + x) * 4 + c] = Math.round(acc / Math.max(1, count))
      }
    }
  }
  // copy alpha through
  for (let i = 3; i < rgba.length; i += 4) out[i] = rgba[i]
  return out
}