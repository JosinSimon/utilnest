import type { DecodedAudio } from "./types"

/**
 * Encodes decoded multi-channel PCM float samples (-1.0 to 1.0) into a standard
 * 16-bit PCM RIFF WAVE (.wav) byte array and Blob without external dependencies.
 */
export function encodeWav(audio: DecodedAudio): Blob {
  const numChannels = audio.numberOfChannels
  const sampleRate = audio.sampleRate
  const numSamples = audio.channelData[0]?.length ?? 0
  const bytesPerSample = 2 // 16-bit
  const blockAlign = numChannels * bytesPerSample
  const byteRate = sampleRate * blockAlign
  const dataSize = numSamples * blockAlign
  const totalFileSize = 44 + dataSize

  const buffer = new ArrayBuffer(totalFileSize)
  const view = new DataView(buffer)

  // 1. RIFF chunk descriptor
  writeString(view, 0, "RIFF")
  view.setUint32(4, 36 + dataSize, true) // File length - 8
  writeString(view, 8, "WAVE")

  // 2. fmt sub-chunk
  writeString(view, 12, "fmt ")
  view.setUint32(16, 16, true) // SubChunk1Size (16 for PCM)
  view.setUint16(20, 1, true) // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true) // NumChannels
  view.setUint32(24, sampleRate, true) // SampleRate
  view.setUint32(28, byteRate, true) // ByteRate
  view.setUint16(32, blockAlign, true) // BlockAlign
  view.setUint16(34, 16, true) // BitsPerSample (16-bit)

  // 3. data sub-chunk
  writeString(view, 36, "data")
  view.setUint32(40, dataSize, true)

  // 4. Interleave PCM samples
  let offset = 44
  const channels = audio.channelData

  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const channel = channels[ch]
      const sample = channel ? channel[i] : 0
      // Clamp to -1.0 .. +1.0 and scale to 16-bit signed integer
      const clamped = Math.max(-1, Math.min(1, sample))
      const int16 = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff
      view.setInt16(offset, int16, true)
      offset += 2
    }
  }

  return new Blob([buffer], { type: "audio/wav" })
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}
