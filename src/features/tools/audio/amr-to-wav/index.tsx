import type { ToolDefinition } from "@/data/types"
import { AudioConverterWidget } from "@/features/tools/shared/audio/AudioConverterWidget"

export default function AmrToWavTool({ tool }: { tool: ToolDefinition }) {
  return (
    <AudioConverterWidget
      tool={tool}
      targetFormat="wav"
      acceptedExtensions=".amr,.3gp,audio/amr,audio/3gpp,audio/*"
      hintText="Drop your .amr file to convert to uncompressed WAV"
    />
  )
}
