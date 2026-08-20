import type { ToolDefinition } from "@/data/types"
import { AudioConverterWidget } from "@/features/tools/shared/audio/AudioConverterWidget"

export default function M4aToMp3Tool({ tool }: { tool: ToolDefinition }) {
  return (
    <AudioConverterWidget
      tool={tool}
      targetFormat="mp3"
      acceptedExtensions=".m4a,.aac,.mp4,audio/mp4,audio/aac,audio/*"
      hintText="Drop your .m4a voice memo or audio file to convert to MP3"
    />
  )
}
