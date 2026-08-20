import type { FileJob } from "@/features/tools/engine"
import {
  runAudioConvert,
  type AudioEngineDeps,
} from "@/features/tools/shared/audio/driver"
import type { AudioConvertOutput } from "@/features/tools/shared/audio/types"

export interface AmrToWavInput {
  file: File
}

export function runAmrToWav(
  input: AmrToWavInput,
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
