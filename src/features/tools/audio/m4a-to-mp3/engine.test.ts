import { describe, expect, it } from "vitest"
import { runM4aToMp3 } from "./engine"
import type { DecodedAudio } from "@/features/tools/shared/audio/types"

describe("runM4aToMp3", () => {
  it("converts M4A audio to MP3 using mocked decoder", async () => {
    const mockDecoded: DecodedAudio = {
      channelData: [new Float32Array(44100).fill(0.3), new Float32Array(44100).fill(-0.3)],
      sampleRate: 44100,
      duration: 1.0,
      numberOfChannels: 2,
    }

    const testFile = new File([new Uint8Array(100)], "voicememo.m4a", {
      type: "audio/mp4",
    })

    const job = runM4aToMp3(
      { file: testFile, bitrate: 192 },
      {
        decode: async () => mockDecoded,
      },
    )

    const result = await job.result
    expect(result.success).toBe(true)
    expect(result.data.fileName).toBe("voicememo.mp3")
    expect(result.data.format).toBe("mp3")
    expect(result.data.bitrate).toBe(192)
    expect(result.data.bytes).toBeGreaterThan(0)
  })
})
