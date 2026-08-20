import type { FileJob } from "@/features/tools/engine"
import {
  runAudioConvert,
  type AudioEngineDeps,
} from "@/features/tools/shared/audio/driver"
import type {
  AudioBitrate,
  AudioConvertOutput,
} from "@/features/tools/shared/audio/types"

export interface WavToMp3Input {
  file: File
  bitrate?: AudioBitrate
}

export function runWavToMp3(
  input: WavToMp3Input,
  deps: AudioEngineDeps = {},
): FileJob<AudioConvertOutput> {
  return runAudioConvert(
    {
      file: input.file,
      format: "mp3",
      bitrate: input.bitrate ?? 128,
    },
    deps,
  )
}
