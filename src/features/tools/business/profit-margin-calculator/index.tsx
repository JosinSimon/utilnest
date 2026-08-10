import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatINR, formatNumber, cn } from "@/lib/utils"
import { Truck, Megaphone, CreditCard, ChevronDown, ChevronUp, Info } from "lucide-react"
import { profitMarginEngine } from "./engine"

export default function ProfitMarginCalculator({ tool: _tool }: { tool: ToolDefinition }) {
  const [costStr, setCostStr] = useState("800")
  const [sellStr, setSellStr] = useState("1500")
  const [shippingStr, setShippingStr] = useState("100")
  const [adCostStr, setAdCostStr] = useState("200")
  const [gatewayStr, setGatewayStr] = useState("2")
  const [showAdvanced, setShowAdvanced] = useState(true)

  const result = useMemo(() => {
    const cost = parseFloat(costStr)
    const sell = parseFloat(sellStr)
    const shippingCost = parseFloat(shippingStr) || 0
    const adCost = parseFloat(adCostStr) || 0
    const gatewayFeePct = parseFloat(gatewayStr) || 0

    if (isNaN(cost) || isNaN(sell) || cost < 0 || sell < 0) return null

    return profitMarginEngine({
      cost,
      sell,
      shippingCost,
      adCost,
      gatewayFeePct,
    })
  }, [costStr, sellStr, shippingStr, adCostStr, gatewayStr])

  const hasExtraExpenses = (parseFloat(shippingStr) || 0) > 0 || (parseFloat(adCostStr) || 0) > 0 || (parseFloat(gatewayStr) || 0) > 0

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Profit Margin Calculator</CardTitle>
          <CardDescription>
            Calculate Gross Margin, Net Profit after Meta/Google Ads, Shipping, and Gateway Fees.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="costPrice" className="font-semibold">
                Product Cost Price (₹)
              </Label>
              <Input
                id="costPrice"
                type="number"
                min="0"
                value={costStr}
                onChange={(e) => setCostStr(e.target.value)}
                placeholder="e.g. 800"
                className="text-lg py-5"
              />
              <p className="text-xs text-muted-foreground">Base cost to acquire or manufacture 1 unit</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellPrice" className="font-semibold">
                Selling Price (₹)
              </Label>
              <Input
                id="sellPrice"
                type="number"
                min="0"
                value={sellStr}
                onChange={(e) => setSellStr(e.target.value)}
                placeholder="e.g. 1500"
                className="text-lg py-5 font-semibold text-primary"
              />
              <p className="text-xs text-muted-foreground">Final price charged to the customer</p>
            </div>
          </div>

          {/* Advanced Expenses Toggle */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-foreground"
            >
              <span className="flex items-center gap-2">
                <Truck className="size-4 text-primary" />
                Additional Operational Expenses (Shipping, Ads & Fees)
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {showAdvanced ? "Hide" : "Add Expenses"}
                {showAdvanced ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </span>
            </button>

            {showAdvanced && (
              <div className="grid gap-4 sm:grid-cols-3 mt-4 pt-4 border-t">
                <div className="space-y-1.5">
                  <Label htmlFor="shippingCost" className="text-xs font-semibold flex items-center gap-1.5">
                    <Truck className="size-3.5 text-muted-foreground" />
                    Shipping / Delivery (₹)
                  </Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    min="0"
                    value={shippingStr}
                    onChange={(e) => setShippingStr(e.target.value)}
                    placeholder="e.g. 100"
                  />
                  <p className="text-[11px] text-muted-foreground">Courier / RTO shipping per unit</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="adCost" className="text-xs font-semibold flex items-center gap-1.5">
                    <Megaphone className="size-3.5 text-muted-foreground" />
                    Ad Spend / CAC (₹)
                  </Label>
                  <Input
                    id="adCost"
                    type="number"
                    min="0"
                    value={adCostStr}
                    onChange={(e) => setAdCostStr(e.target.value)}
                    placeholder="e.g. 200"
                  />
                  <p className="text-[11px] text-muted-foreground">Meta / Google ad cost per sale</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="gatewayFee" className="text-xs font-semibold flex items-center gap-1.5">
                    <CreditCard className="size-3.5 text-muted-foreground" />
                    Gateway Fee (%)
                  </Label>
                  <Input
                    id="gatewayFee"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={gatewayStr}
                    onChange={(e) => setGatewayStr(e.target.value)}
                    placeholder="e.g. 2"
                  />
                  <p className="text-[11px] text-muted-foreground">Razorpay / PhonePe % commission</p>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="mt-8">
            {!result ? (
              <p className="text-sm text-muted-foreground">Enter valid cost and selling price to view profit analysis.</p>
            ) : (
              <div className="space-y-6">
                {/* Primary Result Card */}
                <div
                  className={cn(
                    "flex flex-col gap-2 rounded-lg p-5 text-primary-foreground relative overflow-hidden",
                    result.netProfit >= 0 ? "bg-emerald-600" : "bg-red-600"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
                      {hasExtraExpenses ? "Net Take-Home Profit" : "Profit Amount"}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded bg-black/20 font-medium">
                      Net Margin: {formatNumber(result.netMargin)}%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-extrabold">
                      {formatINR(result.netProfit)}
                    </span>
                    <span className="text-sm opacity-80">per unit</span>
                  </div>
                  {hasExtraExpenses && (
                    <p className="text-xs opacity-90 mt-1">
                      Total Expenses: {formatINR(result.totalExpenses)} (Product {formatINR(result.costPrice)} + Ship {formatINR(result.shippingCost)} + Ads {formatINR(result.adCost)} + Gateway {formatINR(result.gatewayFeeAmount)})
                    </p>
                  )}
                </div>

                {/* Stat Cards */}
                <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                    <dt className="text-xs font-semibold text-muted-foreground uppercase">Gross Profit</dt>
                    <dd className="text-xl font-bold text-foreground">{formatINR(result.grossProfit)}</dd>
                    <span className="text-xs text-muted-foreground">Price − Cost Price</span>
                  </div>

                  <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                    <dt className="text-xs font-semibold text-muted-foreground uppercase">Gross Margin</dt>
                    <dd className="text-xl font-bold text-foreground">{formatNumber(result.grossMargin)}%</dd>
                    <span className="text-xs text-muted-foreground">Gross Profit ÷ Selling Price</span>
                  </div>

                  <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                    <dt className="text-xs font-semibold text-muted-foreground uppercase">Markup %</dt>
                    <dd className="text-xl font-bold text-foreground">{formatNumber(result.grossMarkup)}%</dd>
                    <span className="text-xs text-muted-foreground">Gross Profit ÷ Cost Price</span>
                  </div>

                  <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                    <dt className="text-xs font-semibold text-muted-foreground uppercase">Net Margin %</dt>
                    <dd className="text-xl font-bold text-emerald-600">{formatNumber(result.netMargin)}%</dd>
                    <span className="text-xs text-muted-foreground">Net Profit ÷ Selling Price</span>
                  </div>
                </dl>

                {/* Revenue Split Visual Bar */}
                {result.sellingPrice > 0 && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Revenue Breakdown Split (₹{result.sellingPrice})</span>
                      <span>Net Profit: {formatNumber(result.netMargin)}%</span>
                    </div>

                    <div className="h-4 w-full rounded-full overflow-hidden flex bg-muted">
                      <div
                        style={{ width: `${Math.max(0, Math.min(100, result.productCostPct))}%` }}
                        className="bg-blue-500 transition-all"
                        title={`Product Cost: ${result.productCostPct}% (${formatINR(result.costPrice)})`}
                      />
                      <div
                        style={{ width: `${Math.max(0, Math.min(100, result.shippingPct))}%` }}
                        className="bg-amber-500 transition-all"
                        title={`Shipping: ${result.shippingPct}% (${formatINR(result.shippingCost)})`}
                      />
                      <div
                        style={{ width: `${Math.max(0, Math.min(100, result.adCostPct))}%` }}
                        className="bg-purple-500 transition-all"
                        title={`Ad Spend: ${result.adCostPct}% (${formatINR(result.adCost)})`}
                      />
                      <div
                        style={{ width: `${Math.max(0, Math.min(100, result.gatewayPct))}%` }}
                        className="bg-pink-500 transition-all"
                        title={`Gateway: ${result.gatewayPct}% (${formatINR(result.gatewayFeeAmount)})`}
                      />
                      <div
                        style={{ width: `${Math.max(0, Math.min(100, result.netProfitPct))}%` }}
                        className="bg-emerald-500 transition-all"
                        title={`Net Profit: ${result.netProfitPct}% (${formatINR(result.netProfit)})`}
                      />
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-blue-500" />
                        Product Cost: {formatINR(result.costPrice)} ({result.productCostPct}%)
                      </span>
                      {result.shippingCost > 0 && (
                        <span className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-amber-500" />
                          Shipping: {formatINR(result.shippingCost)} ({result.shippingPct}%)
                        </span>
                      )}
                      {result.adCost > 0 && (
                        <span className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-purple-500" />
                          Ads (CAC): {formatINR(result.adCost)} ({result.adCostPct}%)
                        </span>
                      )}
                      {result.gatewayFeeAmount > 0 && (
                        <span className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-pink-500" />
                          Gateway ({result.gatewayFeePct}%): {formatINR(result.gatewayFeeAmount)}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        Net Profit: {formatINR(result.netProfit)} ({result.netProfitPct}%)
                      </span>
                    </div>
                  </div>
                )}

                {/* Educational Banner */}
                <div className="rounded-lg bg-muted/60 p-4 text-xs space-y-2 text-muted-foreground border">
                  <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                    <Info className="size-4 text-primary" />
                    Margin vs. Markup Explained
                  </div>
                  <p>
                    <strong>Gross Margin</strong> = (Selling Price − Product Cost) ÷ Selling Price. It tells you what percentage of revenue remains as profit.
                  </p>
                  <p>
                    <strong>Markup</strong> = (Selling Price − Product Cost) ÷ Product Cost. It tells you how much percentage you added above the cost price.
                  </p>
                  {hasExtraExpenses && (
                    <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                      💡 <strong>Net Margin</strong> is your actual bank profit after subtracting delivery (₹{result.shippingCost}), marketing (₹{result.adCost}), and payment fees (₹{result.gatewayFeeAmount}).
                    </p>
                  )}
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
