import { describe, expect, it } from "vitest"
import { runAmrToWav } from "./engine"
import type { DecodedAudio } from "@/features/tools/shared/audio/types"

describe("runAmrToWav", () => {
  it("converts AMR file to WAV using mocked decoder", async () => {
    const mockDecoded: DecodedAudio = {
      channelData: [new Float32Array(8000).fill(0.2)],
      sampleRate: 8000,
      duration: 1.0,
      numberOfChannels: 1,
    }

    const testFile = new File([new Uint8Array(50)], "recording.amr", {
      type: "audio/amr",
    })

    const job = runAmrToWav(
      { file: testFile },
      {
        decode: async () => mockDecoded,
      },
    )

    const result = await job.result
    expect(result.success).toBe(true)
    expect(result.data.fileName).toBe("recording.wav")
    expect(result.data.format).toBe("wav")
    expect(result.data.bytes).toBe(44 + 8000 * 2)
  })
})
