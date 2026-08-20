import type { FileJob } from "@/features/tools/engine"
import {
  runAudioConvert,
  type AudioEngineDeps,
} from "@/features/tools/shared/audio/driver"
import type {
  AudioBitrate,
  AudioConvertOutput,
} from "@/features/tools/shared/audio/types"

export interface M4aToMp3Input {
  file: File
  bitrate?: AudioBitrate
}

export function runM4aToMp3(
  input: M4aToMp3Input,
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
