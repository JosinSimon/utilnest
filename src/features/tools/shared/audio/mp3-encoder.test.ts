import { describe, expect, it } from "vitest"
import { encodeMp3, floatToInt16 } from "./mp3-encoder"
import type { DecodedAudio } from "./types"

describe("floatToInt16", () => {
  it("scales float values to 16-bit signed integers correctly", () => {
    const floats = new Float32Array([-1.5, -1.0, 0, 0.5, 1.0, 1.5])
    const int16 = floatToInt16(floats)

    expect(int16[0]).toBe(-32768) // clamped
    expect(int16[1]).toBe(-32768)
    expect(int16[2]).toBe(0)
    expect(int16[3]).toBe(16383)
    expect(int16[4]).toBe(32767)
    expect(int16[5]).toBe(32767) // clamped
  })
})

describe("encodeMp3", () => {
  it("encodes mono PCM audio to MP3 Blob", () => {
    const sampleRate = 44100
    const numSamples = 44100 // 1 second
    const channel = new Float32Array(numSamples)
    for (let i = 0; i < numSamples; i++) {
      channel[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate)
    }

    const audio: DecodedAudio = {
      channelData: [channel],
      sampleRate,
      duration: 1.0,
      numberOfChannels: 1,
    }

    let reportedProgress = 0
    const blob = encodeMp3(audio, 128, (p) => {
      reportedProgress = p
    })

    expect(blob.type).toBe("audio/mp3")
    expect(blob.size).toBeGreaterThan(0)
    expect(reportedProgress).toBe(1)
  })

  it("encodes stereo PCM audio to MP3 at custom bitrate (192 kbps)", () => {
    const sampleRate = 44100
    const numSamples = 22050 // 0.5 seconds
    const left = new Float32Array(numSamples).fill(0.3)
    const right = new Float32Array(numSamples).fill(-0.3)

    const audio: DecodedAudio = {
      channelData: [left, right],
      sampleRate,
      duration: 0.5,
      numberOfChannels: 2,
    }

    const blob = encodeMp3(audio, 192)
    expect(blob.type).toBe("audio/mp3")
    expect(blob.size).toBeGreaterThan(0)
  })
})
