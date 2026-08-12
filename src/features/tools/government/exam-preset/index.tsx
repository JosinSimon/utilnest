import type { ToolDefinition } from "@/data/types"
import { PresetTool } from "../shared/PresetTool"

export default function ExamPreset({ tool }: { tool: ToolDefinition }) {
  const presetIds = tool.preset?.presetIds ?? [
    "ssc-cgl-photo",
    "ssc-cgl-signature",
    "neet-ug-photo",
    "neet-ug-signature",
    "ibps-po-photo",
    "ibps-signature",
  ]

  return <PresetTool tool={tool} scope={{ kind: "ids", ids: presetIds }} />
}