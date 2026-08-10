import { useState, useMemo } from "react"
import { Fingerprint, RefreshCw, Copy, Check } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { generateUuids } from "./engine"

export default function UuidGenerator({ tool: _tool }: { tool: ToolDefinition }) {
  const [count, setCount] = useState<number>(5)
  const [uppercase, setUppercase] = useState<boolean>(false)
  const [removeHyphens, setRemoveHyphens] = useState<boolean>(false)
  const [seed, setSeed] = useState<number>(0)

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const result = useMemo(() => {
    return generateUuids({ count, uppercase, removeHyphens })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, uppercase, removeHyphens, seed])

  const handleRegenerate = () => {
    setSeed((prev) => prev + 1)
  }

  const handleCopySingle = (uuid: string, idx: number) => {
    navigator.clipboard.writeText(uuid)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleCopyAll = () => {
    navigator.clipboard.writeText(result.formattedList)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-primary" /> UUID v4 Generator Options
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-3 items-end">
            <div className="space-y-2">
              <Label>Quantity (1 - 100)</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pb-3">
              <input
                type="checkbox"
                id="uppercase"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="uppercase" className="text-sm font-medium cursor-pointer">
                Uppercase (A-F)
              </label>
            </div>

            <div className="flex items-center gap-2 pb-3">
              <input
                type="checkbox"
                id="removeHyphens"
                checked={removeHyphens}
                onChange={(e) => setRemoveHyphens(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="removeHyphens" className="text-sm font-medium cursor-pointer">
                Remove Hyphens (-)
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t">
            <Button onClick={handleRegenerate}>
              <RefreshCw className="h-4 w-4 mr-2" /> Generate New UUIDs
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Generated UUIDs ({result.uuids.length})
          </CardTitle>
          <Button onClick={handleCopyAll} variant="outline" size="sm">
            {copiedAll ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
            {copiedAll ? "Copied All!" : "Copy All UUIDs"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto p-4 rounded-lg bg-background/80 border font-mono">
            {result.uuids.map((uuid, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-md bg-muted/40 hover:bg-muted/80 transition-colors"
              >
                <span className="text-sm sm:text-base font-semibold truncate select-all">{uuid}</span>
                <Button
                  onClick={() => handleCopySingle(uuid, idx)}
                  variant="ghost"
                  size="sm"
                  className="ml-2 shrink-0"
                >
                  {copiedIndex === idx ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
