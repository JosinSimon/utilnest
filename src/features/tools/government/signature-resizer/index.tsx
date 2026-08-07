import type { ToolDefinition } from "@/data/types"
import { PresetTool } from "../shared/PresetTool"

export default function SignatureResizer({ tool }: { tool: ToolDefinition }) {
  return (
    <PresetTool tool={tool} scope={{ kind: "documentTypes", documentTypes: ["signature"] }} />
  )
}