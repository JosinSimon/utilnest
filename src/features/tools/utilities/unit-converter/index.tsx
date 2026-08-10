import { useState, useMemo } from "react"
import { ArrowLeftRight, Copy, Check } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UNITS_BY_CATEGORY, type UnitCategory, convertUnits } from "./engine"

export default function UnitConverter({ tool: _tool }: { tool: ToolDefinition }) {
  const [category, setCategory] = useState<UnitCategory>("length")
  const [value, setValue] = useState<number>(1)
  
  const currentCategoryUnits = UNITS_BY_CATEGORY[category].units

  const [fromUnit, setFromUnit] = useState<string>(currentCategoryUnits[0]?.id || "")
  const [toUnit, setToUnit] = useState<string>(currentCategoryUnits[1]?.id || currentCategoryUnits[0]?.id || "")
  const [copied, setCopied] = useState(false)

  // Update units default when category changes
  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat)
    const units = UNITS_BY_CATEGORY[newCat].units
    setFromUnit(units[0]?.id || "")
    setToUnit(units[1]?.id || units[0]?.id || "")
  }

  const result = useMemo(() => {
    return convertUnits(category, value, fromUnit, toUnit)
  }, [category, value, fromUnit, toUnit])

  const handleSwap = () => {
    const prevFrom = fromUnit
    setFromUnit(toUnit)
    setToUnit(prevFrom)
  }

  const handleCopy = () => {
    if (!result) return
    const text = `${result.fromValue} ${result.fromUnit.symbol} = ${result.formattedResult} ${result.toUnit.symbol}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const categoriesList = Object.keys(UNITS_BY_CATEGORY) as UnitCategory[]

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Category Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categoriesList.map((catKey) => {
              const catData = UNITS_BY_CATEGORY[catKey]
              const isActive = category === catKey
              return (
                <button
                  key={catKey}
                  onClick={() => handleCategoryChange(catKey)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-muted-foreground border-input hover:border-accent hover:text-foreground"
                  }`}
                >
                  {catData.name}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{UNITS_BY_CATEGORY[category].name} Conversion</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-5 items-end">
            <div className="sm:col-span-2 space-y-2">
              <Label>From ({UNITS_BY_CATEGORY[category].units.find(u => u.id === fromUnit)?.symbol})</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={Number.isNaN(value) ? "" : value}
                  onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                  placeholder="Enter value"
                  className="font-mono text-base"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="px-3 py-2 text-sm border rounded-md bg-background focus:ring-2 focus:ring-ring"
                >
                  {currentCategoryUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center sm:col-span-1 pb-1">
              <Button onClick={handleSwap} variant="outline" size="icon" title="Swap Units">
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label>To ({UNITS_BY_CATEGORY[category].units.find(u => u.id === toUnit)?.symbol})</Label>
              <div className="flex gap-2">
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:ring-2 focus:ring-ring"
                >
                  {currentCategoryUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {result && (
            <div className="p-6 rounded-xl bg-muted/40 border flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Result
                </p>
                <p className="text-2xl sm:text-3xl font-bold font-mono">
                  {result.formattedResult} <span className="text-lg font-normal text-muted-foreground">{result.toUnit.symbol}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {result.fromValue} {result.fromUnit.label} = {result.formattedResult} {result.toUnit.label}
                </p>
              </div>

              <Button onClick={handleCopy} variant="outline" size="sm">
                {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied!" : "Copy Result"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
