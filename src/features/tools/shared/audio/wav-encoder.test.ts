import { describe, expect, it } from "vitest"
import { encodeWav } from "./wav-encoder"
import type { DecodedAudio } from "./types"

describe("encodeWav", () => {
  it("encodes mono PCM float data into a standard 44-byte header WAV Blob", async () => {
    const sampleRate = 8000
    const numSamples = 800 // 0.1s
    const channel = new Float32Array(numSamples)
    for (let i = 0; i < numSamples; i++) {
      channel[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate)
    }

    const audio: DecodedAudio = {
      channelData: [channel],
      sampleRate,
      duration: 0.1,
      numberOfChannels: 1,
    }

    const blob = encodeWav(audio)
    expect(blob.type).toBe("audio/wav")
    // Total size should be 44 header bytes + numSamples * 2 bytes = 44 + 1600 = 1644 bytes
    expect(blob.size).toBe(44 + numSamples * 2)

    const buffer = await blob.arrayBuffer()
    const view = new DataView(buffer)

    // Check RIFF header
    const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3))
    expect(riff).toBe("RIFF")
    const wave = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11))
    expect(wave).toBe("WAVE")

    // Check fmt chunk
    expect(view.getUint16(20, true)).toBe(1) // PCM format
    expect(view.getUint16(22, true)).toBe(1) // 1 channel
    expect(view.getUint32(24, true)).toBe(sampleRate) // 8000 Hz
    expect(view.getUint16(34, true)).toBe(16) // 16-bit
  })

  it("encodes stereo PCM data with proper interleaving", async () => {
    const sampleRate = 44100
    const numSamples = 441 // 0.01s
    const left = new Float32Array(numSamples).fill(0.5)
    const right = new Float32Array(numSamples).fill(-0.5)

    const audio: DecodedAudio = {
      channelData: [left, right],
      sampleRate,
      duration: 0.01,
      numberOfChannels: 2,
    }

    const blob = encodeWav(audio)
    expect(blob.size).toBe(44 + numSamples * 2 * 2) // 44 + 1764 = 1808

    const buffer = await blob.arrayBuffer()
    const view = new DataView(buffer)

    expect(view.getUint16(22, true)).toBe(2) // 2 channels
    expect(view.getUint32(24, true)).toBe(44100)
  })
})
