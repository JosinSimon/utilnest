import type { AlphaMask, RgbColor, RgbaBuffer, Size } from "./types"

/**
 * Foreground mask construction. Each matcher turns an RGBA buffer into an
 * `AlphaMask` (per-pixel foreground coverage 0..255). Everything here is pure
 * and deterministic; it never touches the DOM.
 */

/**
 * Background flood-fill from the image borders.
 *
 * Pixels are part of the background when (a) their alpha >= `minAlphaKeep`
 * and (b) they are within `tolerance` (RGB distance) of `bgColor`. The
 * background is then the connected region reachable from any border pixel
 * that qualifies. This keeps interior islands (a colored object floating in
 * the shot) as foreground and preserves existing transparency.
 */
export function floodFillMask(
  rgba: RgbaBuffer,
  size: Size,
  bgColor: RgbColor,
  tolerance: number,
  minAlphaKeep = 128,
): AlphaMask {
  const { width, height } = size
  const n = width * height
  const inBg = new Uint8Array(n)
  const mask = new Uint8Array(n)
  const stack: number[] = []

  const isBg = (i: number) => {
    const off = i * 4
    const a = rgba[off + 3]
    if (a < minAlphaKeep) return false
    const dr = rgba[off] - bgColor[0]
    const dg = rgba[off + 1] - bgColor[1]
    const db = rgba[off + 2] - bgColor[2]
    return dr * dr + dg * dg + db * db <= tolerance * tolerance
  }

  const tryPush = (x: number, y: number) => {
    const i = y * width + x
    if (inBg[i]) return
    if (!isBg(i)) return
    inBg[i] = 1
    stack.push(i)
  }

  // Seed from the whole border ring.
  // Top + bottom row
  for (let x = 0; x < width; x++) {
    tryPush(x, 0)
    tryPush(x, height - 1)
  }
  // Left + right columns (skip corners already done)
  for (let y = 1; y < height - 1; y++) {
    tryPush(0, y)
    tryPush(width - 1, y)
  }

  // Iterative BFS (avoid recursion overflow on large images).
  while (stack.length > 0) {
    const i = stack.pop()!
    const y = (i / width) | 0
    const x = i - y * width
    if (x > 0) tryPush(x - 1, y)
    if (x < width - 1) tryPush(x + 1, y)
    if (y > 0) tryPush(x, y - 1)
    if (y < height - 1) tryPush(x, y + 1)
  }

  // Build final mask.
  for (let i = 0; i < n; i++) {
    if (inBg[i]) {
      mask[i] = 0
    } else {
      // Keep existing transparency, otherwise foreground.
      mask[i] = rgba[i * 4 + 3] === 0 ? 0 : 255
    }
  }
  return mask
}

/** Global color match: every pixel within tolerance of `color` becomes background. */
export function chromaMask(
  rgba: RgbaBuffer,
  size: Size,
  color: RgbColor,
  tolerance: number,
  minAlphaKeep = 128,
): AlphaMask {
  const { width, height } = size
  const n = width * height
  const mask = new Uint8Array(n)
  for (let i = 0; i < n; i++) {
    const off = i * 4
    const a = rgba[off + 3]
    if (a < minAlphaKeep) {
      mask[i] = 0
      continue
    }
    const dr = rgba[off] - color[0]
    const dg = rgba[off + 1] - color[1]
    const db = rgba[off + 2] - color[2]
    mask[i] = dr * dr + dg * dg + db * db <= tolerance * tolerance ? 0 : 255
  }
  return mask
}

/** Invert a mask (255 - v). */
export function invertMask(mask: AlphaMask): AlphaMask {
  const out = new Uint8Array(mask.length)
  for (let i = 0; i < mask.length; i++) out[i] = 255 - mask[i]
  return out
}

/** Dispatch a matcher based on mode. */
export function makeForegroundMask(
  rgba: RgbaBuffer,
  size: Size,
  matchMode: "edge" | "color",
  opts: { bgColor: RgbColor; tolerance: number; minAlphaKeep?: number },
): AlphaMask {
  return matchMode === "edge"
    ? floodFillMask(rgba, size, opts.bgColor, opts.tolerance, opts.minAlphaKeep)
    : chromaMask(rgba, size, opts.bgColor, opts.tolerance, opts.minAlphaKeep)
}

/**
 * Fill enclosed holes: any background-colored region NOT connected to the
 * border flips to foreground. Useful to repair alpha holes inside the subject.
 */
export function fillEnclosedHoles(mask: AlphaMask, size: Size): AlphaMask {
  const { width, height } = size
  const n = width * height
  // Borders sweep: mark background regions that touch the border.
  const touched = new Uint8Array(n)
  const stack: number[] = []
  const isBg = (i: number) => mask[i] < 128

  const push = (x: number, y: number) => {
    const i = y * width + x
    if (touched[i]) return
    if (!isBg(i)) return
    touched[i] = 1
    stack.push(i)
  }
  for (let x = 0; x < width; x++) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 1; y < height - 1; y++) {
    push(0, y)
    push(width - 1, y)
  }
  while (stack.length > 0) {
    const i = stack.pop()!
    const y = (i / width) | 0
    const x = i - y * width
    if (x > 0) push(x - 1, y)
    if (x < width - 1) push(x + 1, y)
    if (y > 0) push(x, y - 1)
    if (y < height - 1) push(x, y + 1)
  }
  const out = new Uint8Array(mask)
  for (let i = 0; i < n; i++) {
    // Background that couldn't reach the border is an enclosed hole -> fg.
    if (isBg(i) && !touched[i]) out[i] = 255
  }
  return out
}