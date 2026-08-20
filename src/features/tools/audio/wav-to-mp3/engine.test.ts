import { describe, expect, it } from "vitest"
import { runWavToMp3 } from "./engine"
import type { DecodedAudio } from "@/features/tools/shared/audio/types"

describe("runWavToMp3", () => {
  it("converts WAV to MP3 using mocked decoder", async () => {
    const mockDecoded: DecodedAudio = {
      channelData: [new Float32Array(44100).fill(0.2)],
      sampleRate: 44100,
      duration: 1.0,
      numberOfChannels: 1,
    }

    const testFile = new File([new Uint8Array(200)], "track.wav", {
      type: "audio/wav",
    })

    const job = runWavToMp3(
      { file: testFile, bitrate: 128 },
      {
        decode: async () => mockDecoded,
      },
    )

    const result = await job.result
    expect(result.success).toBe(true)
    expect(result.data.fileName).toBe("track.mp3")
    expect(result.data.format).toBe("mp3")
    expect(result.data.bitrate).toBe(128)
    expect(result.data.bytes).toBeGreaterThan(0)
  })
})
