import { describe, it, expect } from "vitest"
import { runBackgroundRemoval, foregroundRatio } from "./engine"

function solidRgba(w: number, h: number, bg: [number, number, number]): Uint8ClampedArray {
  const buf = new Uint8ClampedArray(w * h * 4)
  for (let i = 0; i < buf.length; i += 4) {
    buf[i] = bg[0]
    buf[i + 1] = bg[1]
    buf[i + 2] = bg[2]
    buf[i + 3] = 255
  }
  return buf
}

/** White backdrop with a dark 4x4 subject in the middle (kept by the matcher). */
function subjectRgba(w = 10, h = 10): Uint8ClampedArray {
  const buf = solidRgba(w, h, [255, 255, 255])
  for (let y = 3; y < 7; y++) {
    for (let x = 3; x < 7; x++) {
      const o = (y * w + x) * 4
      buf[o] = 20
      buf[o + 1] = 20
      buf[o + 2] = 20
    }
  }
  return buf
}

function fakeFile(name: string): File {
  return new File([new Uint8Array([1, 2, 3])], name, { type: "image/jpeg" })
}

function loaded(rgba: Uint8ClampedArray, w: number, h: number) {
  return {
    rgba,
    size: { width: w, height: h },
    sourceSize: { width: w, height: h },
  }
}

describe("runBackgroundRemoval", () => {
  it("runs the solid path end-to-end and produces a blob", async () => {
    const rgba = subjectRgba()
    const job = runBackgroundRemoval(
      { file: fakeFile("pic.jpg"), mode: "solid", output: "transparent", format: "png" },
      {
        loadRgba: async () => loaded(rgba, 10, 10),
        toBlob: async (_r, _s, format) =>
          new Blob([new Uint8Array([137, 80, 78, 71])], {
            type: format === "png" ? "image/png" : "image/jpeg",
          }),
      },
    )
    const res = await job.result
    expect(res.success).toBe(true)
    if (!res.success) return
    expect(res.data.fileName).toBe("pic-nobg.png")
    expect(res.data.width).toBe(10)
    expect(res.data.mode).toBe("solid")
    // The dark 4x4 subject survives erosion as ~2x2 -> a small but non-zero fg.
    expect(res.data.foregroundRatio).toBeGreaterThan(0.02)
    expect(res.data.foregroundRatio).toBeLessThan(0.5)
  })

  it("uses the ai provider in ai mode", async () => {
    const rgba = solidRgba(8, 8, [0, 0, 0])
    const allWhite = new Uint8Array(64).fill(255)
    const job = runBackgroundRemoval(
      { file: fakeFile("x.png"), mode: "ai", output: "transparent", format: "png" },
      {
        loadRgba: async () => loaded(rgba, 8, 8),
        aiMask: async () => ({ ok: true as const, mask: allWhite as never, downloadBytes: 1 }),
        toBlob: async () => new Blob([new Uint8Array([1])], { type: "image/png" }),
      },
    )
    const res = await job.result
    expect(res.success).toBe(true)
    if (!res.success) return
    expect(res.data.mode).toBe("ai")
    expect(res.data.foregroundRatio).toBe(1)
  })

  it("propagates an AI failure as a clear engine error", async () => {
    const rgba = solidRgba(8, 8, [0, 0, 0])
    const job = runBackgroundRemoval(
      { file: fakeFile("x.png"), mode: "ai", output: "transparent", format: "png" },
      {
        loadRgba: async () => loaded(rgba, 8, 8),
        aiMask: async () => ({ ok: false as const, code: "runtime", reason: "boom" }),
        toBlob: async () => new Blob(),
      },
    )
    const res = await job.result
    expect(res.success).toBe(false)
    expect(res.error?.message).toContain("boom")
  })

  it("reports monotonic progress to 1", async () => {
    const rgba = subjectRgba()
    const job = runBackgroundRemoval(
      { file: fakeFile("p.jpg"), mode: "solid", output: "replace", replaceColor: [9, 9, 9], format: "jpeg" },
      {
        loadRgba: async () => loaded(rgba, 10, 10),
        toBlob: async () => new Blob([new Uint8Array([255])], { type: "image/jpeg" }),
      },
    )
    const seen: number[] = []
    job.onProgress((p) => seen.push(p))
    const res = await job.result
    expect(res.success).toBe(true)
    if (!res.success) return
    expect(seen.length).toBeGreaterThanOrEqual(3)
    expect(seen[seen.length - 1]).toBe(1)
  })

  it("honors cancel", async () => {
    const rgba = subjectRgba()
    const job = runBackgroundRemoval(
      { file: fakeFile("c.jpg"), mode: "solid", output: "transparent", format: "png" },
      {
        // A deferred loader so cancel lands before it resolves.
        loadRgba: () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(loaded(rgba, 10, 10)), 30)
          }),
        toBlob: async () => new Blob(),
      },
    )
    job.cancel()
    const res = await job.result
    expect(res.success).toBe(false)
  })
})

describe("foregroundRatio", () => {
  it("computes the fg fraction", () => {
    const m = new Uint8Array([255, 0, 255, 0, 255])
    expect(foregroundRatio(m)).toBeCloseTo(0.6)
  })
})