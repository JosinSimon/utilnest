import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SegmentedControl } from "@/components/ui/segmented"
import { formatINR, formatNumber } from "@/lib/utils"
import { commissionEngine, type CommissionMode } from "./engine"
import { HandCoins, FileText, Layers } from "lucide-react"

export default function CommissionCalculator({ tool: _tool }: { tool: ToolDefinition }) {
  const [saleAmountStr, setSaleAmountStr] = useState("150000")
  const [mode, setMode] = useState<CommissionMode>("flat")
  const [commissionRateStr, setCommissionRateStr] = useState("5")
  const [thresholdStr, setThresholdStr] = useState("100000")
  const [tier2RateStr, setTier2RateStr] = useState("10")
  const [includeGst, setIncludeGst] = useState(false)

  const result = useMemo(() => {
    const saleAmount = parseFloat(saleAmountStr)
    const commissionRate = parseFloat(commissionRateStr)
    const tierThreshold = parseFloat(thresholdStr) || 0
    const tier2Rate = parseFloat(tier2RateStr) || 0

    if (isNaN(saleAmount) || saleAmount < 0) return null

    return commissionEngine({
      saleAmount,
      commissionRate,
      mode,
      tierThreshold,
      tier2Rate,
      includeGst,
      gstRate: 18,
    })
  }, [saleAmountStr, commissionRateStr, mode, thresholdStr, tier2RateStr, includeGst])

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Commission Calculator</CardTitle>
          <CardDescription>
            Calculate agent/sales representative commission, slab/tiered rates, net business payout, and GST invoice totals.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Commission Structure
            </Label>
            <SegmentedControl<CommissionMode>
              options={[
                { value: "flat", label: "Flat Commission Rate", sub: "Single % applied to entire sale amount" },
                { value: "tiered", label: "Tiered / Slab Rate", sub: "Higher rate on sales exceeding threshold" },
              ]}
              value={mode}
              onChange={setMode}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="saleAmount" className="font-semibold">Total Sale Amount (₹)</Label>
              <Input
                id="saleAmount"
                type="number"
                min="0"
                value={saleAmountStr}
                onChange={(e) => setSaleAmountStr(e.target.value)}
                placeholder="150000"
                className="text-lg py-5"
              />
            </div>

            {mode === "flat" ? (
              <div className="space-y-2">
                <Label htmlFor="flatRate" className="font-semibold">Commission Rate (%)</Label>
                <Input
                  id="flatRate"
                  type="number"
                  min="0"
                  max="100"
                  value={commissionRateStr}
                  onChange={(e) => setCommissionRateStr(e.target.value)}
                  placeholder="5"
                  className="text-lg py-5 text-primary font-semibold"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="tier1Rate" className="font-semibold">Base Tier 1 Rate (%)</Label>
                <Input
                  id="tier1Rate"
                  type="number"
                  min="0"
                  max="100"
                  value={commissionRateStr}
                  onChange={(e) => setCommissionRateStr(e.target.value)}
                  placeholder="5"
                  className="text-lg py-5"
                />
              </div>
            )}
          </div>

          {mode === "tiered" && (
            <div className="grid gap-6 sm:grid-cols-2 p-4 border rounded-lg bg-muted/30">
              <div className="space-y-1.5">
                <Label htmlFor="threshold" className="text-xs font-semibold flex items-center gap-1.5">
                  <Layers className="size-3.5 text-primary" />
                  Tier 1 Max Sales Threshold (₹)
                </Label>
                <Input
                  id="threshold"
                  type="number"
                  min="0"
                  value={thresholdStr}
                  onChange={(e) => setThresholdStr(e.target.value)}
                  placeholder="100000"
                />
                <p className="text-[11px] text-muted-foreground">Amount up to which Tier 1 rate ({commissionRateStr}%) applies</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tier2Rate" className="text-xs font-semibold flex items-center gap-1.5">
                  <TrendingUpIcon className="size-3.5 text-emerald-600" />
                  Tier 2 Commission Rate (%)
                </Label>
                <Input
                  id="tier2Rate"
                  type="number"
                  min="0"
                  max="100"
                  value={tier2RateStr}
                  onChange={(e) => setTier2RateStr(e.target.value)}
                  placeholder="10"
                />
                <p className="text-[11px] text-muted-foreground">Rate applied to sales exceeding ₹{thresholdStr}</p>
              </div>
            </div>
          )}

          {/* GST Toggle */}
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-card">
            <input
              type="checkbox"
              id="gstToggle"
              checked={includeGst}
              onChange={(e) => setIncludeGst(e.target.checked)}
              className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="gstToggle" className="cursor-pointer text-sm font-medium flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              Add 18% GST to Commission Invoice (Agent Tax Invoice)
            </Label>
          </div>

          <div className="mt-8">
            {!result ? (
              <p className="text-sm text-muted-foreground">Enter valid values above to calculate commission.</p>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col gap-1 rounded-lg bg-primary px-5 py-4 text-primary-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-85">
                    {includeGst ? "Total Commission Invoice (Inc. 18% GST)" : "Total Agent Commission"}
                  </span>
                  <span className="text-3xl font-extrabold">
                    {formatINR(includeGst ? result.totalCommissionWithGst : result.commission)}
                  </span>
                  <span className="text-xs opacity-90 mt-1">
                    Effective Commission Rate: <strong>{formatNumber(result.effectiveRatePct)}%</strong> of sale amount
                  </span>
                </div>

                <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                    <dt className="text-xs font-semibold text-muted-foreground uppercase">Base Commission</dt>
                    <dd className="text-xl font-bold text-foreground">{formatINR(result.commission)}</dd>
                    <span className="text-xs text-muted-foreground">Earned by seller/agent</span>
                  </div>

                  <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                    <dt className="text-xs font-semibold text-muted-foreground uppercase">Net Amount Retained</dt>
                    <dd className="text-xl font-bold text-emerald-600">{formatINR(result.amountAfterCommission)}</dd>
                    <span className="text-xs text-muted-foreground">Sale Amount − Commission</span>
                  </div>

                  {includeGst ? (
                    <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                      <dt className="text-xs font-semibold text-muted-foreground uppercase">18% GST Amount</dt>
                      <dd className="text-xl font-bold text-foreground">{formatINR(result.gstAmount)}</dd>
                      <span className="text-xs text-muted-foreground">Tax payable on agent invoice</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                      <dt className="text-xs font-semibold text-muted-foreground uppercase">Effective Rate</dt>
                      <dd className="text-xl font-bold text-foreground">{formatNumber(result.effectiveRatePct)}%</dd>
                      <span className="text-xs text-muted-foreground">Commission ÷ Sale Amount</span>
                    </div>
                  )}
                </dl>

                {mode === "tiered" && typeof result.tier1Commission === "number" && (
                  <div className="rounded-lg border bg-muted/40 p-4 space-y-1 text-xs">
                    <p className="font-semibold text-foreground text-sm mb-1">Slab Breakdown:</p>
                    <p>• Tier 1 (Up to ₹{thresholdStr} @ {commissionRateStr}%): <strong>{formatINR(result.tier1Commission)}</strong></p>
                    <p>• Tier 2 (Above ₹{thresholdStr} @ {tier2RateStr}%): <strong>{formatINR(result.tier2Commission || 0)}</strong></p>
                  </div>
                )}
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

function TrendingUpIcon(props: any) {
  return <HandCoins {...props} />
}
