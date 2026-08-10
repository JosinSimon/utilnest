import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SegmentedControl } from "@/components/ui/segmented"
import { formatINR, formatNumber } from "@/lib/utils"
import { Info, Table } from "lucide-react"

export default function MarkupCalculator({ tool: _tool }: { tool: ToolDefinition }) {
  const [mode, setMode] = useState<"costToPrice" | "findMarkup" | "targetMargin">("costToPrice")
  const [costStr, setCostStr] = useState("800")
  const [markupStr, setMarkupStr] = useState("25")
  const [sellStr, setSellStr] = useState("1000")
  const [targetMarginStr, setTargetMarginStr] = useState("20")

  const result = useMemo(() => {
    const cost = parseFloat(costStr)
    if (isNaN(cost) || cost <= 0) return null

    if (mode === "costToPrice") {
      const markupPct = parseFloat(markupStr)
      if (isNaN(markupPct) || markupPct < 0) return null
      const profit = (cost * markupPct) / 100
      const sell = cost + profit
      const marginPct = sell > 0 ? (profit / sell) * 100 : 0
      return { cost, sell, profit, markupPct, marginPct }
    } else if (mode === "findMarkup") {
      const sell = parseFloat(sellStr)
      if (isNaN(sell) || sell <= 0) return null
      const profit = sell - cost
      const markupPct = (profit / cost) * 100
      const marginPct = (profit / sell) * 100
      return { cost, sell, profit, markupPct, marginPct }
    } else {
      // targetMargin mode
      const marginPct = parseFloat(targetMarginStr)
      if (isNaN(marginPct) || marginPct < 0 || marginPct >= 100) return null
      // Margin = (Sell - Cost) / Sell  =>  Sell * (1 - Margin/100) = Cost  =>  Sell = Cost / (1 - Margin/100)
      const sell = cost / (1 - marginPct / 100)
      const profit = sell - cost
      const markupPct = (profit / cost) * 100
      return { cost, sell, profit, markupPct, marginPct }
    }
  }, [mode, costStr, markupStr, sellStr, targetMarginStr])

  // Conversion reference table data
  const conversionMatrix = [
    { markup: 10, margin: 9.09 },
    { markup: 15, margin: 13.04 },
    { markup: 20, margin: 16.67 },
    { markup: 25, margin: 20.00 },
    { markup: 33.33, margin: 25.00 },
    { markup: 50, margin: 33.33 },
    { markup: 75, margin: 42.86 },
    { markup: 100, margin: 50.00 },
  ]

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Markup Calculator</CardTitle>
          <CardDescription>
            Calculate selling price from markup %, find markup from cost & price, or target a specific profit margin %.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="mb-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Calculator Mode
            </Label>
            <SegmentedControl
              options={[
                { label: "Cost → Price", value: "costToPrice" },
                { label: "Find Markup %", value: "findMarkup" },
                { label: "Target Margin → Price", value: "targetMargin" },
              ]}
              value={mode}
              onChange={(val) => setMode(val as any)}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="costPrice" className="font-semibold">Cost Price (₹)</Label>
              <Input
                id="costPrice"
                type="number"
                min="0"
                value={costStr}
                onChange={(e) => setCostStr(e.target.value)}
                placeholder="e.g. 800"
                className="text-lg py-5"
              />
              <p className="text-xs text-muted-foreground">What you paid or spent to buy/make 1 unit</p>
            </div>

            {mode === "costToPrice" && (
              <div className="space-y-2">
                <Label htmlFor="markupPct" className="font-semibold">Desired Markup (%)</Label>
                <Input
                  id="markupPct"
                  type="number"
                  min="0"
                  value={markupStr}
                  onChange={(e) => setMarkupStr(e.target.value)}
                  placeholder="e.g. 25"
                  className="text-lg py-5 text-primary font-semibold"
                />
                <p className="text-xs text-muted-foreground">% profit added on top of cost price</p>
              </div>
            )}

            {mode === "findMarkup" && (
              <div className="space-y-2">
                <Label htmlFor="sellPrice" className="font-semibold">Selling Price (₹)</Label>
                <Input
                  id="sellPrice"
                  type="number"
                  min="0"
                  value={sellStr}
                  onChange={(e) => setSellStr(e.target.value)}
                  placeholder="e.g. 1000"
                  className="text-lg py-5 font-semibold"
                />
                <p className="text-xs text-muted-foreground">Final price you charge to the customer</p>
              </div>
            )}

            {mode === "targetMargin" && (
              <div className="space-y-2">
                <Label htmlFor="targetMargin" className="font-semibold">Target Margin (%)</Label>
                <Input
                  id="targetMargin"
                  type="number"
                  min="0"
                  max="99.9"
                  value={targetMarginStr}
                  onChange={(e) => setTargetMarginStr(e.target.value)}
                  placeholder="e.g. 20"
                  className="text-lg py-5 text-emerald-600 font-semibold"
                />
                <p className="text-xs text-muted-foreground">% of final revenue you want as profit</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            {!result ? (
              <p className="text-sm text-muted-foreground">Enter valid positive values to see calculations.</p>
            ) : (
              <div className="space-y-6">
                {/* Highlighted Banner */}
                <div className="flex flex-col gap-1 rounded-lg bg-primary px-5 py-4 text-primary-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-85">
                    {mode === "costToPrice" ? "Recommended Selling Price" : mode === "targetMargin" ? "Required Selling Price for Target Margin" : "Calculated Markup"}
                  </span>
                  <span className="text-3xl font-extrabold">
                    {mode === "findMarkup" ? `${formatNumber(result.markupPct)}% Markup` : formatINR(result.sell)}
                  </span>
                  <p className="text-xs opacity-90 mt-1">
                    Profit: {formatINR(result.profit)} | Resulting Margin: {formatNumber(result.marginPct)}%
                  </p>
                </div>

                {/* Stat Breakdown Grid */}
                <dl className="grid gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                    <dt className="text-xs font-semibold text-muted-foreground uppercase">Profit Amount</dt>
                    <dd className="text-xl font-bold text-foreground">{formatINR(result.profit)}</dd>
                    <span className="text-xs text-muted-foreground">Selling Price − Cost Price</span>
                  </div>

                  <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                    <dt className="text-xs font-semibold text-muted-foreground uppercase">Markup Percentage</dt>
                    <dd className="text-xl font-bold text-primary">{formatNumber(result.markupPct)}%</dd>
                    <span className="text-xs text-muted-foreground">Profit ÷ Cost Price</span>
                  </div>

                  <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                    <dt className="text-xs font-semibold text-muted-foreground uppercase">Margin Percentage</dt>
                    <dd className="text-xl font-bold text-emerald-600">{formatNumber(result.marginPct)}%</dd>
                    <span className="text-xs text-muted-foreground">Profit ÷ Selling Price</span>
                  </div>
                </dl>

                {/* Cheat Sheet Table */}
                <div className="border rounded-lg p-4 space-y-3 bg-card">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Table className="size-4 text-primary" />
                    Markup vs. Margin Conversion Reference Matrix
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {conversionMatrix.map((row) => (
                      <div
                        key={row.markup}
                        className="p-2.5 rounded border bg-muted/30 flex flex-col justify-between"
                      >
                        <span className="text-muted-foreground font-medium">{row.markup}% Markup</span>
                        <span className="text-foreground font-bold mt-0.5">= {row.margin}% Margin</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Helper Banner */}
                <div className="rounded-lg bg-muted/60 p-4 text-xs space-y-2 text-muted-foreground border">
                  <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                    <Info className="size-4 text-primary" />
                    Why is Markup always higher than Margin?
                  </div>
                  <p>
                    <strong>Markup</strong> measures profit as a percentage of your <em>cost price</em> (smaller denominator).
                  </p>
                  <p>
                    <strong>Margin</strong> measures profit as a percentage of your <em>selling price</em> (larger denominator).
                  </p>
                  <p className="text-foreground font-medium">
                    👉 Example: Buy at ₹800, Sell at ₹1,000 → Profit is ₹200. Markup = ₹200 ÷ ₹800 = <strong>25%</strong>. Margin = ₹200 ÷ ₹1,000 = <strong>20%</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          100% private · in-browser
        </span>
      </div>
    </div>
  )
}
