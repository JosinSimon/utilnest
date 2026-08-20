import { Mp3Encoder } from "@breezystack/lamejs"
import type { AudioBitrate, DecodedAudio } from "./types"

/**
 * Converts Float32 PCM samples (-1.0 to 1.0) into an Int16Array (-32768 to 32767).
 */
export function floatToInt16(samples: Float32Array): Int16Array {
  const len = samples.length
  const output = new Int16Array(len)
  for (let i = 0; i < len; i++) {
    const s = samples[i]
    const clamped = Math.max(-1, Math.min(1, s))
    output[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff
  }
  return output
}

/**
 * Encodes decoded PCM audio samples into an MP3 Blob using LAME.
 */
export function encodeMp3(
  audio: DecodedAudio,
  bitrate: AudioBitrate = 128,
  onProgress?: (progress: number) => void,
): Blob {
  const numChannels = Math.min(audio.numberOfChannels, 2)
  const sampleRate = audio.sampleRate
  const encoder = new Mp3Encoder(numChannels, sampleRate, bitrate)

  const leftFloat = audio.channelData[0] || new Float32Array(0)
  const rightFloat =
    numChannels === 2
      ? audio.channelData[1] || audio.channelData[0]
      : undefined

  const leftInt16 = floatToInt16(leftFloat)
  const rightInt16 = rightFloat ? floatToInt16(rightFloat) : undefined

  const mp3Chunks: Uint8Array[] = []
  const sampleBlockSize = 1152 // Standard MPEG frame size
  const totalSamples = leftInt16.length

  for (let i = 0; i < totalSamples; i += sampleBlockSize) {
    const leftChunk = leftInt16.subarray(i, i + sampleBlockSize)
    let chunk: Uint8Array
    if (numChannels === 2 && rightInt16) {
      const rightChunk = rightInt16.subarray(i, i + sampleBlockSize)
      chunk = encoder.encodeBuffer(leftChunk, rightChunk)
    } else {
      chunk = encoder.encodeBuffer(leftChunk)
    }

    if (chunk.length > 0) {
      mp3Chunks.push(chunk)
    }

    if (onProgress && totalSamples > 0) {
      onProgress(Math.min(1, (i + sampleBlockSize) / totalSamples))
    }
  }

  const flush = encoder.flush()
  if (flush.length > 0) {
    mp3Chunks.push(flush)
  }

  if (onProgress) {
    onProgress(1)
  }

  return new Blob(mp3Chunks as BlobPart[], { type: "audio/mp3" })
}
