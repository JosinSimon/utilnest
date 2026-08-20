import { describe, expect, it } from "vitest"
import { isAmr } from "./decoder"
import { runAudioConvert, replaceExtension } from "./driver"
import type { DecodedAudio } from "./types"

describe("isAmr", () => {
  it("detects AMR-NB magic header", () => {
    const header = new Uint8Array([0x23, 0x21, 0x41, 0x4d, 0x52, 0x0a, 0x00, 0x01])
    expect(isAmr(header)).toBe(true)
  })

  it("detects AMR-WB magic header", () => {
    const header = new Uint8Array([0x23, 0x21, 0x41, 0x4d, 0x52, 0x2d, 0x57, 0x42, 0x0a])
    expect(isAmr(header)).toBe(true)
  })

  it("returns false for non-AMR headers", () => {
    const mp3 = new Uint8Array([0xff, 0xfb, 0x90, 0x64])
    expect(isAmr(mp3)).toBe(false)
  })
})

describe("replaceExtension", () => {
  it("replaces extension correctly", () => {
    expect(replaceExtension("recording.amr", "mp3")).toBe("recording.mp3")
    expect(replaceExtension("audio.file.wav", ".mp3")).toBe("audio.file.mp3")
    expect(replaceExtension("noextension", "wav")).toBe("noextension.wav")
  })
})

describe("runAudioConvert", () => {
  const mockDecoded: DecodedAudio = {
    channelData: [new Float32Array(44100).fill(0.1)],
    sampleRate: 44100,
    duration: 1.0,
    numberOfChannels: 1,
  }

  it("converts audio to MP3 using mocked decoder and driver pipeline", async () => {
    const dummyFile = new File([new Uint8Array(100)], "test.amr", { type: "audio/amr" })
    const job = runAudioConvert(
      {
        file: dummyFile,
        format: "mp3",
        bitrate: 128,
      },
      {
        decode: async () => mockDecoded,
      },
    )

    let progressEvents: number[] = []
    job.onProgress((p) => progressEvents.push(p))

    const result = await job.result
    expect(result.success).toBe(true)
    expect(result.data.fileName).toBe("test.mp3")
    expect(result.data.format).toBe("mp3")
    expect(result.data.bitrate).toBe(128)
    expect(result.data.bytes).toBeGreaterThan(0)
    expect(progressEvents.length).toBeGreaterThan(0)
  })

  it("converts audio to WAV using mocked decoder and driver pipeline", async () => {
    const dummyFile = new File([new Uint8Array(100)], "recording.m4a", { type: "audio/mp4" })
    const job = runAudioConvert(
      {
        file: dummyFile,
        format: "wav",
      },
      {
        decode: async () => mockDecoded,
      },
    )

    const result = await job.result
    expect(result.success).toBe(true)
    expect(result.data.fileName).toBe("recording.wav")
    expect(result.data.format).toBe("wav")
    expect(result.data.bytes).toBe(44 + 44100 * 2) // standard WAV header + 16-bit PCM
  })
})
