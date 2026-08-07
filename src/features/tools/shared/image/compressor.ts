import type { ImageFormat, TargetKbOptions } from "./types"

/**
 * Deterministic compressor. Pure orchestration over injected encode functions —
 * the actual Blob encoding (which needs a canvas) is supplied by the caller
 * (driver.ts), so this module is fully testable in Node without a canvas.
 *
 * Algorithm
 *  1. Caller resizes to the required dimensions once before invoking us, so
 *     every quality probe runs on the small canvas.
 *  2. Binary-search JPEG quality over [0.15, 1.0].
 *  3. After every probe we READ THE REAL Blob.size (never an estimate).
 *  4. If at quality 0.15 the size still exceeds maxKB:
 *       - allowDownscale=true  -> the caller shrinks dimensions and calls us again.
 *       - allowDownscale=false -> cannotHitTarget.
 *  5. If even quality 1.0 cannot reach kbMin -> cannotHitMin (we never pad).
 */

export type EncodeJpegFn = (quality: number) => Promise<Blob>
export type EncodePngFn = () => Promise<Blob>

export interface CompressInput {
  encodeJpeg: EncodeJpegFn
  encodePng: EncodePngFn
  width: number
  height: number
}

export type CompressStatus = "ok" | "cannotHitTarget" | "cannotHitMin"

export interface CompressOutcome {
  status: CompressStatus
  blob: Blob
  format: ImageFormat
  width: number
  height: number
  bytes: number
  /** JPEG quality (0..1) of the emitted blob; 1 for PNG. */
  quality: number
  message: string
}

const MAX_JPEG_QUALITY = 1.0
const MIN_JPEG_QUALITY = 0.15
const PROBE_LIMIT = 14

const KB = 1024

/**
 * Compress `image` (already at target dimensions) to fit the requested KB
 * range / exact target. Returns the highest-quality JPEG that satisfies the
 * upper bound, or a structured cannotHit* status. Never pads, never lies.
 */
export async function compressToTarget(
  image: CompressInput,
  input: TargetKbOptions,
): Promise<CompressOutcome> {
  const minBytes = input.kbMin * KB
  const maxBytes = input.kbMax === Infinity ? Infinity : input.kbMax * KB

  // PNG is only allowed as a format when JPEG is not in the allowed set.
  const useJpeg = input.allowedFormats.includes("jpeg")
  const format: ImageFormat = useJpeg ? "jpeg" : "png"

  if (!useJpeg) {
    const blob = await image.encodePng()
    const out: CompressOutcome = {
      status: "ok",
      blob,
      format: "png",
      width: image.width,
      height: image.height,
      bytes: blob.size,
      quality: 1,
      message: "",
    }
    return pngOutcome(out, input, minBytes, maxBytes)
  }

  // 1) Can the target ever be satisfied at these dimensions?
  const smallest = await image.encodeJpeg(MIN_JPEG_QUALITY)
  if (smallest.size > maxBytes) {
    return {
      status: "cannotHitTarget",
      blob: smallest,
      format,
      width: image.width,
      height: image.height,
      bytes: smallest.size,
      quality: MIN_JPEG_QUALITY,
      message:
        "Even the lowest JPEG quality exceeds the maximum file size at these dimensions.",
    }
  }

  // 2) Binary-search the highest quality whose size <= maxBytes.
  let lo = MIN_JPEG_QUALITY
  let hi = MAX_JPEG_QUALITY
  let bestQuality = MIN_JPEG_QUALITY
  let bestBytes = smallest.size
  let bestBlob: Blob = smallest

  for (let i = 0; i < PROBE_LIMIT; i++) {
    const mid = (lo + hi) / 2
    const probe = await image.encodeJpeg(mid)
    if (probe.size <= maxBytes) {
      if (probe.size >= bestBytes && mid >= bestQuality) {
        bestBlob = probe
        bestBytes = probe.size
        bestQuality = mid
      }
      lo = mid
    } else {
      hi = mid
    }
    if (hi - lo < 0.001) break
  }

  // 3) Check the lower bound. If we can't reach kbMin even at quality 1.0,
  //    the image genuinely cannot satisfy the spec -> cannotHitMin.
  const atMax = await image.encodeJpeg(MAX_JPEG_QUALITY)
  if (input.mode === "range" && atMax.size < minBytes) {
    return {
      status: "cannotHitMin",
      blob: atMax,
      format,
      width: image.width,
      height: image.height,
      bytes: atMax.size,
      quality: MAX_JPEG_QUALITY,
      message:
        "Even at maximum quality the file does not reach the required minimum size at these dimensions. Do NOT submit — this does not satisfy the official specification.",
    }
  }

  const withinRange =
    input.mode !== "range" || (bestBytes >= minBytes && bestBytes <= maxBytes)

  return {
    status: withinRange ? "ok" : "cannotHitMin",
    blob: bestBlob,
    format,
    width: image.width,
    height: image.height,
    bytes: bestBytes,
    quality: bestQuality,
    message: statusMessage(input, bestBytes, withinRange),
  }
}

function pngOutcome(
  out: CompressOutcome,
  _input: TargetKbOptions,
  minBytes: number,
  maxBytes: number,
): CompressOutcome {
  const ok = out.bytes >= minBytes && out.bytes <= maxBytes
  return {
    ...out,
    status: ok ? "ok" : "cannotHitMin",
    message: ok
      ? `PNG encoded to ${(out.bytes / KB).toFixed(1)} KB.`
      : "PNG cannot satisfy the requested file size. Use JPEG where accepted.",
  }
}

function statusMessage(input: TargetKbOptions, bytes: number, withinRange: boolean): string {
  if (input.mode === "exact") {
    return `Closest match to target: ${(bytes / KB).toFixed(1)} KB.`
  }
  return withinRange
    ? `Encoded to ${(bytes / KB).toFixed(1)} KB (target ${input.kbMin}–${input.kbMax} KB).`
    : "Result is outside the requested KB range at the required dimensions."
}
