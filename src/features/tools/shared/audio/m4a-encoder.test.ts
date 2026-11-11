import { describe, expect, it } from "vitest"
import { aacSampleRateFor, toPlanar } from "./m4a-encoder"

describe("aacSampleRateFor", () => {
  it("keeps standard AAC rates", () => {
    expect(aacSampleRateFor(44100)).toBe(44100)
    expect(aacSampleRateFor(48000)).toBe(48000)
  })

  it("resamples AMR rates to 44.1 kHz", () => {
    expect(aacSampleRateFor(8000)).toBe(44100)
    expect(aacSampleRateFor(16000)).toBe(44100)
  })
})

describe("toPlanar", () => {
  it("lays channels out one after another", () => {
    const left = new Float32Array([1, 2, 3])
    const right = new Float32Array([4, 5, 6])
    expect(Array.from(toPlanar([left, right]))).toEqual([1, 2, 3, 4, 5, 6])
  })

  it("handles mono", () => {
    expect(Array.from(toPlanar([new Float32Array([0.5, -0.5])]))).toEqual([0.5, -0.5])
  })
})
