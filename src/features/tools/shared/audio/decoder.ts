import type { DecodedAudio } from "./types"

const AMR_NB_MAGIC = new Uint8Array([0x23, 0x21, 0x41, 0x4d, 0x52, 0x0a]) // #!AMR\n
const AMR_WB_MAGIC = new Uint8Array([0x23, 0x21, 0x41, 0x4d, 0x52, 0x2d, 0x57, 0x42, 0x0a]) // #!AMR-WB\n

/**
 * Detects whether the buffer begins with standard AMR-NB or AMR-WB magic bytes.
 */
export function isAmr(bytes: Uint8Array): boolean {
  if (bytes.length < 6) return false

  let isNb = true
  for (let i = 0; i < AMR_NB_MAGIC.length; i++) {
    if (bytes[i] !== AMR_NB_MAGIC[i]) {
      isNb = false
      break
    }
  }
  if (isNb) return true

  if (bytes.length < AMR_WB_MAGIC.length) return false
  let isWb = true
  for (let i = 0; i < AMR_WB_MAGIC.length; i++) {
    if (bytes[i] !== AMR_WB_MAGIC[i]) {
      isWb = false
      break
    }
  }
  return isWb
}

export type CustomDecoder = (buffer: ArrayBuffer) => Promise<DecodedAudio>

/**
 * Decodes AMR-NB or AMR-WB files using opencore-amr WASM.
 */
export async function decodeAmr(buffer: ArrayBuffer): Promise<DecodedAudio> {
  const { default: decode } = await import("@audio/decode-amr")
  const result = await decode(buffer)

  const sampleRate = result.sampleRate || 8000
  const resData = result.channelData as unknown
  let channelData: Float32Array[]
  if (Array.isArray(resData)) {
    channelData = resData.length > 0 ? (resData as Float32Array[]) : [new Float32Array(0)]
  } else if (resData instanceof Float32Array) {
    channelData = [resData]
  } else {
    channelData = [new Float32Array(0)]
  }

  const duration = (channelData[0]?.length ?? 0) / sampleRate

  return {
    channelData,
    sampleRate,
    duration,
    numberOfChannels: channelData.length,
  }
}

/**
 * Decodes standard audio formats (M4A, AAC, MP3, WAV, OGG, WebM) via the Web Audio API.
 */
export async function decodeBrowserAudio(buffer: ArrayBuffer): Promise<DecodedAudio> {
  if (typeof window === "undefined" || (!window.AudioContext && !(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)) {
    throw new Error("AudioContext is not supported in this environment.")
  }

  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const ctx = new AudioCtx()

  try {
    // decodeAudioData detaches the arrayBuffer in some browsers, so pass a clone
    const cloned = buffer.slice(0)
    const audioBuffer = await ctx.decodeAudioData(cloned)

    const channelData: Float32Array[] = []
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      channelData.push(audioBuffer.getChannelData(i))
    }

    return {
      channelData,
      sampleRate: audioBuffer.sampleRate,
      duration: audioBuffer.duration,
      numberOfChannels: audioBuffer.numberOfChannels,
    }
  } finally {
    if (ctx.state !== "closed") {
      await ctx.close()
    }
  }
}

/**
 * Universal audio decoder dispatcher. Auto-detects AMR vs browser native audio.
 */
export async function decodeAudio(
  buffer: ArrayBuffer,
  customDecoder?: CustomDecoder,
): Promise<DecodedAudio> {
  if (customDecoder) {
    return customDecoder(buffer)
  }

  const bytes = new Uint8Array(buffer.slice(0, 16))
  if (isAmr(bytes)) {
    return decodeAmr(buffer)
  }

  return decodeBrowserAudio(buffer)
}
