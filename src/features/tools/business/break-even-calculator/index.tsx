import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { formatINR, formatNumber } from "@/lib/utils"
import { breakEvenEngine } from "./engine"
import { AlertCircle, Calendar, TrendingUp } from "lucide-react"

export default function BreakEvenCalculator({ tool: _tool }: { tool: ToolDefinition }) {
  const [fixedCostsStr, setFixedCostsStr] = useState("50000")
  const [variableCostStr, setVariableCostStr] = useState("100")
  const [sellingPriceStr, setSellingPriceStr] = useState("200")
  const [plannedUnitsStr, setPlannedUnitsStr] = useState("")
  const [dailySalesStr, setDailySalesStr] = useState("20")

  const result = useMemo(() => {
    const fixedCosts = parseFloat(fixedCostsStr)
    const variableCostPerUnit = parseFloat(variableCostStr)
    const sellingPricePerUnit = parseFloat(sellingPriceStr)
    const plannedUnits = plannedUnitsStr === "" ? undefined : parseFloat(plannedUnitsStr)
    const dailySalesVolume = dailySalesStr === "" ? undefined : parseFloat(dailySalesStr)

    if (isNaN(fixedCosts) || isNaN(variableCostPerUnit) || isNaN(sellingPricePerUnit) || 
        fixedCosts < 0 || variableCostPerUnit < 0 || sellingPricePerUnit < 0) return null

    return breakEvenEngine({
      fixedCosts,
      variableCostPerUnit,
      sellingPricePerUnit,
      plannedUnits,
      dailySalesVolume,
    })
  }, [fixedCostsStr, variableCostStr, sellingPriceStr, plannedUnitsStr, dailySalesStr])

  return (
    <div className="space-y-6">
      {/* Educational Banner */}
      <div className="rounded-xl border bg-gradient-to-r from-blue-50/60 to-indigo-50/60 p-4 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
            <AlertCircle className="size-5" />
          </div>
          <div className="space-y-1 text-sm">
            <h4 className="font-semibold text-foreground">What is a Break-Even Point?</h4>
            <p className="text-muted-foreground leading-relaxed">
              Your <strong>Break-Even Point</strong> is the exact sales volume needed so your business covers all costs without making a profit or loss (Net Profit = ₹0).
            </p>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="fixedCosts" className="font-semibold">Fixed Costs (₹)</Label>
              <Input
                id="fixedCosts"
                type="number"
                min="0"
                value={fixedCostsStr}
                onChange={(e) => setFixedCostsStr(e.target.value)}
                placeholder="50000"
                className="text-lg py-5"
              />
              <p className="text-[11px] text-muted-foreground">
                Costs that stay the same regardless of sales (Shop Rent, Salaries, Internet).
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="variableCost" className="font-semibold">Variable Cost/Unit (₹)</Label>
              <Input
                id="variableCost"
                type="number"
                min="0"
                value={variableCostStr}
                onChange={(e) => setVariableCostStr(e.target.value)}
                placeholder="100"
                className="text-lg py-5"
              />
              <p className="text-[11px] text-muted-foreground">
                Cost to produce or buy 1 unit (Raw materials, packaging, shipping per order).
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellingPrice" className="font-semibold">Selling Price/Unit (₹)</Label>
              <Input
                id="sellingPrice"
                type="number"
                min="0"
                value={sellingPriceStr}
                onChange={(e) => setSellingPriceStr(e.target.value)}
                placeholder="200"
                className="text-lg py-5 font-semibold text-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                The price you charge your customer per unit sold.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="dailySales" className="font-semibold flex items-center gap-1.5 text-xs">
                <Calendar className="size-3.5 text-primary" />
                Expected Daily Sales (Units/Day)
              </Label>
              <Input
                id="dailySales"
                type="number"
                min="0"
                value={dailySalesStr}
                onChange={(e) => setDailySalesStr(e.target.value)}
                placeholder="e.g. 20"
              />
              <p className="text-[11px] text-muted-foreground">
                How many units you expect to sell per day to estimate days until break-even.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plannedUnits" className="font-semibold flex items-center gap-1.5 text-xs">
                <TrendingUp className="size-3.5 text-primary" />
                Planned Target Sales (Total Units)
              </Label>
              <Input
                id="plannedUnits"
                type="number"
                min="0"
                value={plannedUnitsStr}
                onChange={(e) => setPlannedUnitsStr(e.target.value)}
                placeholder="e.g. 800"
              />
              <p className="text-[11px] text-muted-foreground">
                Total planned sales to estimate profit above break-even.
              </p>
            </div>
          </div>

          <div className="mt-8">
            {!result ? (
              <p className="text-sm text-muted-foreground">Enter values above to see results.</p>
            ) : !result.isValid ? (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/15 px-4 py-3 text-destructive">
                <AlertCircle className="size-5" />
                <p className="text-sm font-medium">
                  Selling price must be higher than Variable Cost per unit (₹{variableCostStr}), or you lose money on every unit sold!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-baseline justify-between rounded-lg bg-primary px-5 py-4 text-primary-foreground">
                  <div>
                    <span className="block text-sm font-medium opacity-90">Minimum Sales Needed</span>
                    <span className="text-2xl font-bold">{formatNumber(Math.ceil(result.breakEvenUnits))} Units</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs opacity-75">Break-Even Revenue</span>
                    <span className="text-xl font-bold">{formatINR(result.breakEvenRevenue)}</span>
                  </div>
                </div>

                <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contribution / Unit</dt>
                    <dd className="text-xl font-bold text-foreground">{formatINR(result.contributionPerUnit)}</dd>
                    <span className="text-[11px] text-muted-foreground">Selling Price − Variable Cost</span>
                  </div>

                  <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Break-Even Revenue</dt>
                    <dd className="text-xl font-bold text-foreground">{formatINR(result.breakEvenRevenue)}</dd>
                    <span className="text-[11px] text-muted-foreground">Total money to cover rent/costs</span>
                  </div>

                  {typeof result.daysToBreakEven === "number" && (
                    <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time to Break-Even</dt>
                      <dd className="text-xl font-bold text-emerald-600">{result.daysToBreakEven} Days</dd>
                      <span className="text-[11px] text-muted-foreground">~{result.monthsToBreakEven} Months @ {dailySalesStr} units/day</span>
                    </div>
                  )}

                  {result.plannedProfit !== undefined && (
                    <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Projected Profit</dt>
                      <dd className={`text-xl font-bold ${result.plannedProfit >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                        {formatINR(result.plannedProfit)}
                      </dd>
                      <span className="text-[11px] text-muted-foreground">At {plannedUnitsStr} units target</span>
                    </div>
                  )}
                </dl>
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
