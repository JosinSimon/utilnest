import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SegmentedControl } from "@/components/ui/segmented"
import { formatINR, formatNumber } from "@/lib/utils"
import { discountEngine, type DiscountMode } from "./engine"
import { AlertTriangle, TrendingDown, Info } from "lucide-react"

export default function DiscountCalculator({ tool: _tool }: { tool: ToolDefinition }) {
  const [originalStr, setOriginalStr] = useState("2500")
  const [discountStr, setDiscountStr] = useState("20")
  const [additionalStr, setAdditionalStr] = useState("5")
  const [costStr, setCostStr] = useState("1800")
  const [mode, setMode] = useState<DiscountMode>("additive")
  const [showSellerAnalysis, setShowSellerAnalysis] = useState(true)

  const result = useMemo(() => {
    const original = parseFloat(originalStr)
    const discountPct = parseFloat(discountStr)
    const additionalPct = additionalStr === "" ? 0 : parseFloat(additionalStr)
    const costPrice = costStr === "" ? undefined : parseFloat(costStr)

    if (isNaN(original) || isNaN(discountPct) || original < 0 || discountPct < 0 || additionalPct < 0) return null

    return discountEngine({
      original,
      discountPct,
      additionalDiscountPct: additionalPct,
      mode,
      costPrice,
    })
  }, [originalStr, discountStr, additionalStr, costStr, mode])

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Discount Calculator</CardTitle>
          <CardDescription>
            Calculate final sale price, savings, stacked discounts, and optional seller profit impact / margin erosion.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {additionalStr !== "" && parseFloat(additionalStr) > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Discount Combination Method
              </Label>
              <SegmentedControl<DiscountMode>
                options={[
                  { value: "additive", label: "Direct Addition (20% + 5% = 25%)", sub: "Combines discount percentages" },
                  { value: "compound", label: "Sequential / Stacked (20%, then 5%)", sub: "Applies 2nd discount on reduced price" },
                ]}
                value={mode}
                onChange={setMode}
              />
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="originalPrice" className="font-semibold">Original Price (₹)</Label>
              <Input
                id="originalPrice"
                type="number"
                min="0"
                value={originalStr}
                onChange={(e) => setOriginalStr(e.target.value)}
                placeholder="2500"
                className="text-lg py-5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPct" className="font-semibold">Primary Discount (%)</Label>
              <Input
                id="discountPct"
                type="number"
                min="0"
                max="100"
                value={discountStr}
                onChange={(e) => setDiscountStr(e.target.value)}
                placeholder="20"
                className="text-lg py-5 text-emerald-600 font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalPct" className="font-semibold">Additional Discount (%)</Label>
              <Input
                id="additionalPct"
                type="number"
                min="0"
                max="100"
                value={additionalStr}
                onChange={(e) => setAdditionalStr(e.target.value)}
                placeholder="Optional e.g. 5"
                className="text-lg py-5"
              />
            </div>
          </div>

          {/* Optional Seller Cost Input */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <button
              type="button"
              onClick={() => setShowSellerAnalysis(!showSellerAnalysis)}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-foreground"
            >
              <span className="flex items-center gap-2">
                <TrendingDown className="size-4 text-primary" />
                Seller Profit Impact Analysis (Optional)
              </span>
              <span className="text-xs text-muted-foreground font-semibold">
                {showSellerAnalysis ? "Hide Cost" : "Add Product Cost"}
              </span>
            </button>

            {showSellerAnalysis && (
              <div className="mt-3 pt-3 border-t grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="costPrice" className="text-xs font-semibold">Product Cost Price (₹)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    min="0"
                    value={costStr}
                    onChange={(e) => setCostStr(e.target.value)}
                    placeholder="e.g. 1800"
                  />
                  <p className="text-[11px] text-muted-foreground">Enter your cost to see how this discount impacts your profit margin</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            {!result ? (
              <p className="text-sm text-muted-foreground">Enter valid price and discount to view calculation.</p>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col gap-1 rounded-lg bg-emerald-600 px-5 py-4 text-white">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">Total Customer Savings</span>
                  <span className="text-3xl font-extrabold">{formatINR(result.savings)}</span>
                  <span className="text-xs opacity-90">
                    Final Price to Pay: <strong>{formatINR(result.finalPrice)}</strong> ({formatNumber(result.totalDiscountPct)}% total discount)
                  </span>
                </div>

                <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                    <dt className="text-xs font-semibold text-muted-foreground uppercase">Final Sale Price</dt>
                    <dd className="text-xl font-bold text-foreground">{formatINR(result.finalPrice)}</dd>
                    <span className="text-xs text-muted-foreground">Amount customer pays</span>
                  </div>

                  <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                    <dt className="text-xs font-semibold text-muted-foreground uppercase">Effective Discount %</dt>
                    <dd className="text-xl font-bold text-emerald-600">{formatNumber(result.totalDiscountPct)}%</dd>
                    <span className="text-xs text-muted-foreground">
                      {result.mode === "additive" ? "Direct addition off" : "Sequential stacked off"}
                    </span>
                  </div>

                  {typeof result.originalProfit === "number" && typeof result.remainingProfit === "number" && (
                    <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                      <dt className="text-xs font-semibold text-muted-foreground uppercase">Remaining Seller Profit</dt>
                      <dd className={`text-xl font-bold ${result.remainingProfit >= 0 ? "text-foreground" : "text-red-600"}`}>
                        {formatINR(result.remainingProfit)}
                      </dd>
                      <span className="text-xs text-muted-foreground">Margin: {formatNumber(result.remainingMarginPct || 0)}%</span>
                    </div>
                  )}
                </dl>

                {/* Profit Erosion Alert Banner */}
                {typeof result.profitErosionPct === "number" && result.originalProfit! > 0 && (
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300 text-sm">
                      <AlertTriangle className="size-4 text-amber-600" />
                      Profit Erosion Warning
                    </div>
                    <p className="text-amber-900 dark:text-amber-200">
                      Giving a <strong>{formatNumber(result.totalDiscountPct)}% discount</strong> reduces your profit amount from <strong>{formatINR(result.originalProfit!)}</strong> down to <strong>{formatINR(result.remainingProfit!)}</strong>.
                    </p>
                    <p className="font-semibold text-amber-900 dark:text-amber-200">
                      👉 This discount erodes <strong>{formatNumber(result.profitErosionPct)}%</strong> of your total net profit!
                    </p>
                  </div>
                )}

                <div className="rounded-lg bg-muted/60 p-4 text-xs space-y-1 text-muted-foreground border">
                  <div className="flex items-center gap-2 font-semibold text-foreground text-sm mb-1">
                    <Info className="size-4 text-primary" />
                    How Stacked Discounts Work
                  </div>
                  <p>
                    <strong>Direct Addition (20% + 5% = 25%)</strong>: Combines discount rates together before calculating savings.
                  </p>
                  <p>
                    <strong>Sequential / Stacked (20% then 5%)</strong>: Takes 20% off the original price first, then applies 5% off the reduced price (Effective: 24%).
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
