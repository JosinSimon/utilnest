import { describe, it, expect } from "vitest"
import { compressToTarget } from "./compressor"
import type { CompressInput } from "./compressor"
import type { TargetKbOptions } from "./types"

const OPT: Pick<TargetKbOptions, "allowedFormats" | "allowDownscale" | "minDimensionGuard"> = {
  allowedFormats: ["jpeg"],
  allowDownscale: false,
  minDimensionGuard: 100,
}

function range(kbMin: number, kbMax: number): TargetKbOptions {
  return { mode: "range", kbMin, kbMax, ...OPT }
}
function exact(kb: number): TargetKbOptions {
  return { mode: "exact", kbMin: kb, kbMax: kb, ...OPT }
}

function makeImage(
  width: number,
  height: number,
  sizeAtQuality: (q: number) => number,
): CompressInput {
  return {
    encodeJpeg: async (q) => new Blob([new Uint8Array(Math.round(sizeAtQuality(q)))]),
    encodePng: async () => new Blob([new Uint8Array(Math.round(sizeAtQuality(1)))]),
    width,
    height,
  }
}

function compressQo(image: CompressInput, input: TargetKbOptions) {
  return compressToTarget(image, input)
}

describe("compressor range mode", () => {
  it("finds a quality landing in [20KB,50KB]", async () => {
    // size(q) increases with q: 20KB at low q, 80KB at high q
    const img = makeImage(200, 230, (q) => (20 + 60 * q) * 1024)
    const out = await compressQo(img, range(20, 50))
    expect(out.bytes).toBeGreaterThanOrEqual(20 * 1024)
    expect(out.bytes).toBeLessThanOrEqual(50 * 1024)
  })

  it("is deterministic: same input -> same quality and bytes", async () => {
    const mk = () => makeImage(200, 230, (q) => (20 + 60 * q) * 1024)
    const a = await compressQo(mk(), range(20, 50))
    const b = await compressQo(mk(), range(20, 50))
    expect(a.quality).toBe(b.quality)
    expect(a.bytes).toBe(b.bytes)
  })

  it("returns ok, not padded, when alone within range even if image small", async () => {
    // linear 0.4*1024 to 4*1024 (tiny image)
    const img = makeImage(100, 100, (q) => (0.4 + 3.6 * q) * 1024)
    const out = await compressQo(img, range(1, 5))
    expect(out.status).toBe("ok")
  })

  it("cannotHitTarget when even lowest quality is above max", async () => {
    const img = makeImage(4032, 3024, (_q) => 5000 * 1024) // always 5MB
    const out = await compressQo(img, range(20, 50))
    expect(out.status).toBe("cannotHitTarget")
    expect(out.message).toMatch(/exceeds the maximum/)
  })

  it("cannotHitMin when maximum quality can't reach the minimum", async () => {
    const img = makeImage(200, 230, (_q) => 5 * 1024) // always tiny
    const out = await compressQo(img, range(20, 50))
    expect(out.status).toBe("cannotHitMin")
    expect(out.message).toMatch(/does (not )?satisfy the official specification/i)
  })
})

describe("compressor exact mode", () => {
  it("returns the closest match at or below the exact target bytes", async () => {
    const img = makeImage(100, 100, (q) => (10 + 90 * q) * 1024)
    const out = await compressQo(img, exact(50))
    expect(out.bytes).toBeLessThanOrEqual(50 * 1024)
  })
})