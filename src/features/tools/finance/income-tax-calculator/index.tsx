import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { SegmentedControl } from "@/components/ui/segmented"
import { formatINR } from "@/lib/utils"
import { calculateIncomeTax } from "./engine"

type Regime = "new" | "old"

const REGIME_LIMITS: Record<Regime, number> = {
  new: 1200000,
  old: 500000,
}

export default function IncomeTaxCalculator({ tool }: { tool: ToolDefinition }) {
  const [income, setIncome] = useState("1200000")
  const [regime, setRegime] = useState<Regime>("new")
  const [deductions, setDeductions] = useState("0")

  const result = useMemo(() => {
    const i = Number(income)
    const d = Number(deductions)
    if (!Number.isFinite(i) || i < 0 || !Number.isFinite(d) || d < 0) return null
    return calculateIncomeTax({ annualIncome: i, newRegime: regime === "new", deductions: d })
  }, [income, regime, deductions])

  const zeroTaxUpTo = REGIME_LIMITS[regime]

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{tool.name}</p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            100% private · in-browser
          </span>
        </div>

        <div className="mt-5 space-y-2">
          <Label>Tax regime</Label>
          <SegmentedControl<Regime>
            name="tax-regime"
            value={regime}
            onChange={setRegime}
            options={[
              { value: "new", label: "New regime", sub: "lower rates · fewer deductions" },
              { value: "old", label: "Old regime", sub: "higher rates · more deductions" },
            ]}
          />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tax-income">Annual gross income (₹)</Label>
            <Input
              id="tax-income"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="e.g. 1200000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax-deductions">
              Deductions (₹)
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                {regime === "new"
                  ? "not available in new regime"
                  : "80C, 80D, HRA, home loan…"}
              </span>
            </Label>
            <Input
              id="tax-deductions"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={deductions}
              disabled={regime === "new"}
              onChange={(e) => setDeductions(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border bg-secondary/40 p-5">
          {result ? (
            <div>
              <div className="flex items-baseline justify-between rounded-lg bg-primary px-4 py-3 text-primary-foreground">
                <dt className="text-sm font-medium">Total tax (incl. cess)</dt>
                <dd className="text-2xl font-semibold tabular-nums">
                  {formatINR(result.totalTax)}
                </dd>
              </div>

              {result.totalTax === 0 && result.taxableIncome > 0 && (
                <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  No tax due — income is within the {formatINR(zeroTaxUpTo)} rebate
                  limit of the {regime} regime.
                </p>
              )}

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Taxable income</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.taxableIncome)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Standard deduction</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.standardDeduction)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Tax before rebate</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.grossTax)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">§87A rebate</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.rebate)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Cess (4%)</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.cess)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Effective rate</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {result.effectiveRate}%
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter your annual income above to see the tax estimate.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}