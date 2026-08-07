import type { ToolDefinition } from "@/data/types"
import { PresetTool } from "../shared/PresetTool"

export default function PassportPhotoMaker({ tool }: { tool: ToolDefinition }) {
  return <PresetTool tool={tool} scope={{ kind: "ids", ids: ["passport-photo"] }} />
}