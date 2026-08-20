import type { ToolDefinition } from "@/data/types"
import { AudioConverterWidget } from "@/features/tools/shared/audio/AudioConverterWidget"

export default function Mp3ToWavTool({ tool }: { tool: ToolDefinition }) {
  return (
    <AudioConverterWidget
      tool={tool}
      targetFormat="wav"
      acceptedExtensions=".mp3,audio/mpeg,audio/mp3,audio/*"
      hintText="Drop your .mp3 audio file to convert to WAV"
    />
  )
}
