import type { ToolDefinition } from "@/data/types"
import { AudioConverterWidget } from "@/features/tools/shared/audio/AudioConverterWidget"

export default function WavToMp3Tool({ tool }: { tool: ToolDefinition }) {
  return (
    <AudioConverterWidget
      tool={tool}
      targetFormat="mp3"
      acceptedExtensions=".wav,audio/wav,audio/x-wav,audio/*"
      hintText="Drop your .wav audio file to convert to MP3"
    />
  )
}
