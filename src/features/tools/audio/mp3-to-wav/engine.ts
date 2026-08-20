import type { FileJob } from "@/features/tools/engine"
import {
  runAudioConvert,
  type AudioEngineDeps,
} from "@/features/tools/shared/audio/driver"
import type { AudioConvertOutput } from "@/features/tools/shared/audio/types"

export interface Mp3ToWavInput {
  file: File
}

export function runMp3ToWav(
  input: Mp3ToWavInput,
  deps: AudioEngineDeps = {},
): FileJob<AudioConvertOutput> {
  return runAudioConvert(
    {
      file: input.file,
      format: "wav",
    },
    deps,
  )
}
