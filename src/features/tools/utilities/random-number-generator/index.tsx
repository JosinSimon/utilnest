import { useState, useMemo } from "react"
import { Hash, RefreshCw, Copy, Check } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SegmentedControl } from "@/components/ui/segmented"
import { generateRandomNumbers, type RandomMode } from "./engine"

export default function RandomNumberGenerator({ tool: _tool }: { tool: ToolDefinition }) {
  const [min, setMin] = useState<number>(1)
  const [max, setMax] = useState<number>(100)
  const [count, setCount] = useState<number>(5)
  const [unique, setUnique] = useState<boolean>(true)
  const [mode, setMode] = useState<RandomMode>("integer")
  const [seed, setSeed] = useState<number>(0)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    // seed triggers recalculation
    return generateRandomNumbers({ min, max, count, unique, mode, decimals: 2 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max, count, unique, mode, seed])

  const handleRegenerate = () => {
    setSeed((prev) => prev + 1)
  }

  const handleCopy = () => {
    if (!result.isValid) return
    navigator.clipboard.writeText(result.formattedList)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-primary" /> Random Generator Options
          </CardTitle>
          <SegmentedControl
            options={[
              { label: "Integers", value: "integer" },
              { label: "Decimals", value: "decimal" },
            ]}
            value={mode}
            onChange={(val) => setMode(val as RandomMode)}
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Minimum (Min)</Label>
              <Input
                type="number"
                value={Number.isNaN(min) ? "" : min}
                onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label>Maximum (Max)</Label>
              <Input
                type="number"
                value={Number.isNaN(max) ? "" : max}
                onChange={(e) => setMax(parseInt(e.target.value) || 0)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label>Quantity (Count)</Label>
              <Input
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
                className="font-mono"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="uniqueNumbers"
                checked={unique}
                onChange={(e) => setUnique(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="uniqueNumbers" className="text-sm font-medium cursor-pointer">
                Unique numbers only (no duplicates)
              </label>
            </div>

            <Button onClick={handleRegenerate} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" /> Generate New Random Numbers
            </Button>
          </div>
        </CardContent>
      </Card>

      {!result.isValid ? (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 text-center text-destructive font-medium">
            {result.errorMessage}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Generated Results ({result.results.length})
            </CardTitle>
            <Button onClick={handleCopy} variant="outline" size="sm">
              {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied All!" : "Copy Results"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-4 rounded-lg bg-background/80 border font-mono">
              {result.results.map((val, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-md bg-muted text-foreground text-base font-semibold border shadow-xs"
                >
                  {val}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
