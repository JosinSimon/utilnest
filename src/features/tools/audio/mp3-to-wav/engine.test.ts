import { describe, expect, it } from "vitest"
import { runMp3ToWav } from "./engine"
import type { DecodedAudio } from "@/features/tools/shared/audio/types"

describe("runMp3ToWav", () => {
  it("converts MP3 to WAV using mocked decoder", async () => {
    const mockDecoded: DecodedAudio = {
      channelData: [new Float32Array(44100).fill(0.1)],
      sampleRate: 44100,
      duration: 1.0,
      numberOfChannels: 1,
    }

    const testFile = new File([new Uint8Array(200)], "track.mp3", {
      type: "audio/mpeg",
    })

    const job = runMp3ToWav(
      { file: testFile },
      {
        decode: async () => mockDecoded,
      },
    )

    const result = await job.result
    expect(result.success).toBe(true)
    expect(result.data.fileName).toBe("track.wav")
    expect(result.data.format).toBe("wav")
    expect(result.data.bytes).toBe(44 + 44100 * 2)
  })
})
