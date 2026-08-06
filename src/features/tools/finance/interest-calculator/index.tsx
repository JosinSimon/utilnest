import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { SegmentedControl } from "@/components/ui/segmented"
import { formatINR } from "@/lib/utils"
import { calculateInterest } from "./engine"

type Mode = "simple" | "compound"
type Frequency = "1" | "2" | "4" | "12"

export default function InterestCalculator({ tool }: { tool: ToolDefinition }) {
  const [principal, setPrincipal] = useState("10000")
  const [rate, setRate] = useState("5")
  const [years, setYears] = useState("3")
  const [months, setMonths] = useState("0")
  const [mode, setMode] = useState<Mode>("simple")
  const [frequency, setFrequency] = useState<Frequency>("1")

  const result = useMemo(() => {
    const p = Number(principal)
    const r = Number(rate)
    const y = Number(years)
    const m = Number(months)
    if (
      !Number.isFinite(p) || p < 0 ||
      !Number.isFinite(r) || r < 0 ||
      !Number.isFinite(y) || y < 0 ||
      !Number.isFinite(m) || m < 0
    ) return null
    return calculateInterest({
      principal: p,
      annualRate: r,
      years: y,
      months: m,
      compound: mode === "compound",
      frequency: Number(frequency) as 1 | 2 | 4 | 12,
    })
  }, [principal, rate, years, months, mode, frequency])

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
          <Label>Interest type</Label>
          <SegmentedControl<Mode>
            name="interest-mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: "simple", label: "Simple", sub: "interest on principal only" },
              { value: "compound", label: "Compound", sub: "interest on interest" },
            ]}
          />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="interest-principal">Principal (₹)</Label>
            <Input
              id="interest-principal"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interest-rate">Annual rate (%)</Label>
            <Input
              id="interest-rate"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="interest-years">Tenure — years</Label>
            <Input
              id="interest-years"
              type="number"
              min="0"
              max="50"
              step="1"
              inputMode="numeric"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interest-months">Tenure — months</Label>
            <Input
              id="interest-months"
              type="number"
              min="0"
              max="11"
              step="1"
              inputMode="numeric"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            />
          </div>
        </div>

        {mode === "compound" && (
          <div className="mt-5 space-y-2">
            <Label>Compounding frequency</Label>
            <SegmentedControl<Frequency>
              name="interest-frequency"
              value={frequency}
              onChange={setFrequency}
              options={[
                { value: "1", label: "Yearly" },
                { value: "2", label: "Half-yearly" },
                { value: "4", label: "Quarterly" },
                { value: "12", label: "Monthly" },
              ]}
            />
          </div>
        )}

        <div className="mt-6 rounded-xl border bg-secondary/40 p-5">
          {result && result.years > 0 ? (
            <div>
              <div className="flex items-baseline justify-between rounded-lg bg-primary px-4 py-3 text-primary-foreground">
                <dt className="text-sm font-medium">Maturity value</dt>
                <dd className="text-2xl font-semibold tabular-nums">
                  {formatINR(result.maturityValue)}
                </dd>
              </div>

              <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Principal</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.principal)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">
                    {mode === "simple" ? "Simple interest" : "Compound interest"}
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.interest)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Tenure</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {result.years.toFixed(result.years % 1 ? 1 : 0)} yr
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter a principal and tenure above to see the interest.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}