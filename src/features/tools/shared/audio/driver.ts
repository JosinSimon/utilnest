import type { FileJob } from "@/features/tools/engine"
import { decodeAudio } from "./decoder"
import { encodeMp3 } from "./mp3-encoder"
import { encodeWav } from "./wav-encoder"
import type { AudioConvertOptions, AudioConvertOutput } from "./types"

export interface AudioEngineDeps {
  decode?: typeof decodeAudio
  encodeMp3?: typeof encodeMp3
  encodeWav?: typeof encodeWav
}

export function replaceExtension(fileName: string, newExt: string): string {
  const lastDot = fileName.lastIndexOf(".")
  const base = lastDot === -1 ? fileName : fileName.substring(0, lastDot)
  return `${base}.${newExt.replace(/^\./, "")}`
}

/**
 * Runs client-side audio conversion.
 */
export function runAudioConvert(
  options: AudioConvertOptions,
  deps: AudioEngineDeps = {},
): FileJob<AudioConvertOutput> {
  const decodeFn = deps.decode || decodeAudio
  const mp3Fn = deps.encodeMp3 || encodeMp3
  const wavFn = deps.encodeWav || encodeWav

  let cancelled = false
  let onProgress: (p: number) => void = () => {}

  const promise = (async () => {
    const inputBytes = options.file.size
    try {
      onProgress(0.05)
      const buffer = await options.file.arrayBuffer()
      if (cancelled) throw new Error("Conversion cancelled.")

      onProgress(0.15)
      const decoded = await decodeFn(buffer)
      if (cancelled) throw new Error("Conversion cancelled.")

      if (decoded.channelData.length === 0 || (decoded.channelData[0]?.length ?? 0) === 0) {
        return {
          success: false as const,
          data: undefined as unknown as AudioConvertOutput,
          error: {
            code: "audio_empty",
            message: "No audio data could be decoded from this file. The file may be corrupt or empty.",
          },
          meta: { bytesIn: inputBytes, bytesOut: 0, durationMs: 0 },
        }
      }

      onProgress(0.3)
      let outputBlob: Blob

      if (options.format === "mp3") {
        outputBlob = mp3Fn(decoded, options.bitrate || 128, (p) => {
          onProgress(0.3 + p * 0.65)
        })
      } else {
        onProgress(0.6)
        outputBlob = wavFn(decoded)
        onProgress(0.95)
      }

      if (cancelled) throw new Error("Conversion cancelled.")

      const originalName =
        options.originalFileName ||
        (options.file instanceof File ? options.file.name : "audio")
      const outputFileName = replaceExtension(originalName, options.format)

      onProgress(1.0)

      return {
        success: true as const,
        data: {
          blob: outputBlob,
          fileName: outputFileName,
          format: options.format,
          bytes: outputBlob.size,
          duration: decoded.duration,
          sampleRate: decoded.sampleRate,
          channels: decoded.numberOfChannels,
          bitrate: options.format === "mp3" ? options.bitrate || 128 : undefined,
        },
        meta: {
          bytesIn: inputBytes,
          bytesOut: outputBlob.size,
          durationMs: 0,
        },
      }
    } catch (err) {
      return {
        success: false as const,
        data: undefined as unknown as AudioConvertOutput,
        error: {
          code: "audio_convert_error",
          message: (err as Error).message || "Audio conversion failed.",
        },
        meta: { bytesIn: inputBytes, bytesOut: 0, durationMs: 0 },
      }
    }
  })()

  return {
    result: promise,
    onProgress: (fn) => {
      onProgress = fn
    },
    cancel: () => {
      cancelled = true
    },
  }
}
