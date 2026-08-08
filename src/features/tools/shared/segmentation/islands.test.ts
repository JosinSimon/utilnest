import { describe, it, expect } from "vitest"
import { extractSolidMask } from "./pipeline"
import type { RgbaBuffer } from "./types"

function noisyBackdrop(w: number, h: number, speckles: number): { rgba: RgbaBuffer; subject: number[] } {
  const buf = new Uint8ClampedArray(w * h * 4)
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4
      buf[o] = 163 + ((x * 7 + y * 13) % 5)
      buf[o + 1] = 224 + ((x * 11 + y * 3) % 5)
      buf[o + 2] = 161 + ((x * 3 + y * 9) % 5)
      buf[o + 3] = 255
    }
  // A solid subject blob (kept in all outputs).
  const subject: number[] = []
  for (let y = h / 2 - 20; y < h / 2 + 20; y++)
    for (let x = w / 2 - 20; x < w / 2 + 20; x++) {
      const o = (y * w + x) * 4
      buf[o] = 30
      buf[o + 1] = 30
      buf[o + 2] = 40
      subject.push(y * w + x)
    }
  let n = 0
  for (let py = 0; py < h && n < speckles; py += 7)
    for (let px = 0; px < w; px += 7) {
      if (((px * 31 + py * 17) % 149) !== 3) continue
      // A 3x3 blob of off-color pixels (JPEG ringing cluster).
      for (let dy = 0; dy < 3; dy++)
        for (let dx = 0; dx < 3; dx++) {
          const x = px + dx
          const y = py + dy
          if (x >= w || y >= h) continue
          if (x >= w / 2 - 20 && x < w / 2 + 20 && y >= h / 2 - 20 && y < h / 2 + 20) continue
          const o = (y * w + x) * 4
          buf[o] = (buf[o] + 95) % 256
          buf[o + 1] = (buf[o + 1] + 75) % 256
          buf[o + 2] = (buf[o + 2] + 55) % 256
        }
      n++
      if (n >= speckles) break
    }
  return { rgba: buf, subject }
}

describe("solid speck removal", () => {
  it("keeps the subject cleanly while dropping isolated noise islands", () => {
    const w = 400
    const h = 300
    const { rgba, subject } = noisyBackdrop(w, h, 2000)
    const res = extractSolidMask(rgba, { width: w, height: h })
    let isolatedFg = 0
    for (let i = 0; i < res.mask.length; i++) if (res.mask[i] >= 200) isolatedFg++
    // Specks gone, subject kept.
    expect(isolatedFg).toBeLessThan(subject.length)
    const subjectKept = subject.filter((i) => res.mask[i] >= 128).length
    expect(subjectKept).toBeGreaterThan(subject.length * 0.8)
    // The rest of the backdrop is background.
    expect(res.stats.backgroundRatio).toBeGreaterThan(0.8)
  })
})