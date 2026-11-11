import type { AudioBitrate, DecodedAudio } from "./types"

// AAC encoders reliably accept these rates. Anything else (AMR is 8 kHz or
// 16 kHz) is resampled to 44.1 kHz before encoding.
const AAC_SAFE_RATES = new Set([44100, 48000])

export function aacSampleRateFor(sourceRate: number): number {
  return AAC_SAFE_RATES.has(sourceRate) ? sourceRate : 44100
}

/** Packs channels one after another (planar layout): [ch0..., ch1..., ...] */
export function toPlanar(channelData: Float32Array[]): Float32Array {
  const length = channelData[0]?.length ?? 0
  const planar = new Float32Array(length * channelData.length)
  channelData.forEach((channel, i) => planar.set(channel, i * length))
  return planar
}

/**
 * Encodes decoded PCM to an M4A (AAC in MP4) file in the browser.
 * mediabunny is loaded lazily so it only ships to pages that need M4A output.
 * Uses the browser's native AAC encoder (WebCodecs) when available and falls
 * back to a WASM encoder (e.g. Firefox, Linux Chrome).
 */
export async function encodeM4a(
  audio: DecodedAudio,
  bitrate: AudioBitrate = 128,
  onProgress?: (p: number) => void,
): Promise<Blob> {
  const {
    Output,
    Mp4OutputFormat,
    BufferTarget,
    AudioSampleSource,
    AudioSample,
    canEncodeAudio,
  } = await import("mediabunny")

  const sampleRate = aacSampleRateFor(audio.sampleRate)
  const numberOfChannels = Math.min(audio.numberOfChannels, 2)

  if (!(await canEncodeAudio("aac", { numberOfChannels, sampleRate, bitrate: bitrate * 1000 }))) {
    const { registerAacEncoder } = await import("@mediabunny/aac-encoder")
    registerAacEncoder()
  }
  onProgress?.(0.2)

  const output = new Output({
    format: new Mp4OutputFormat({ fastStart: "in-memory" }),
    target: new BufferTarget(),
  })
  const source = new AudioSampleSource({
    codec: "aac",
    bitrate: bitrate * 1000,
    transform: { sampleRate, numberOfChannels },
  })
  output.addAudioTrack(source)
  await output.start()

  const sample = new AudioSample({
    data: toPlanar(audio.channelData.slice(0, numberOfChannels)),
    format: "f32-planar",
    numberOfChannels,
    sampleRate: audio.sampleRate,
    timestamp: 0,
  })
  await source.add(sample)
  sample.close()
  onProgress?.(0.8)

  await output.finalize()
  const buffer = output.target.buffer
  if (!buffer) throw new Error("M4A encoding produced no data.")
  onProgress?.(1)
  return new Blob([buffer], { type: "audio/mp4" })
}
