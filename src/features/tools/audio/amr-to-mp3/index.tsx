import type { ToolDefinition } from "@/data/types"
import { AudioConverterWidget } from "@/features/tools/shared/audio/AudioConverterWidget"

export default function AmrToMp3Tool({ tool }: { tool: ToolDefinition }) {
  return (
    <AudioConverterWidget
      tool={tool}
      targetFormat="mp3"
      acceptedExtensions=".amr,.3gp,audio/amr,audio/3gpp,audio/*"
      hintText="Drop your .amr call recording or click to browse"
    />
  )
}
