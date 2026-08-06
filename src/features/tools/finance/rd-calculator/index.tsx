import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { formatINR } from "@/lib/utils"
import { calculateRd } from "./engine"

export default function RdCalculator({ tool }: { tool: ToolDefinition }) {
  const [monthly, setMonthly] = useState("5000")
  const [rate, setRate] = useState("7")
  const [years, setYears] = useState("5")
  const [months, setMonths] = useState("0")

  const result = useMemo(() => {
    const p = Number(monthly)
    const r = Number(rate)
    const y = Number(years)
    const m = Number(months)
    if (
      !Number.isFinite(p) || p < 0 ||
      !Number.isFinite(r) || r < 0 ||
      !Number.isFinite(y) || y < 0 ||
      !Number.isFinite(m) || m < 0
    ) return null
    return calculateRd({ monthly: p, annualRate: r, years: y, months: m })
  }, [monthly, rate, years, months])

  const investedShare =
    result && result.maturityValue > 0
      ? (result.invested / result.maturityValue) * 100
      : 0

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

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rd-monthly">Monthly deposit (₹)</Label>
            <Input
              id="rd-monthly"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              placeholder="e.g. 5000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rd-rate">Interest rate per year (%)</Label>
            <Input
              id="rd-rate"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 7"
            />
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rd-years">Tenure — years</Label>
            <Input
              id="rd-years"
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
            <Label htmlFor="rd-months">Tenure — months</Label>
            <Input
              id="rd-months"
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

        <div className="mt-6 rounded-xl border bg-secondary/40 p-5">
          {result && result.months > 0 ? (
            <div>
              <div className="flex items-baseline justify-between rounded-lg bg-primary px-4 py-3 text-primary-foreground">
                <dt className="text-sm font-medium">Maturity value</dt>
                <dd className="text-2xl font-semibold tabular-nums">
                  {formatINR(result.maturityValue)}
                </dd>
              </div>

              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(100, investedShare)}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                <span>Deposited {formatINR(result.invested)}</span>
                <span>Interest {formatINR(result.interest)}</span>
              </div>

              <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Total deposited</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.invested)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Total interest</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.interest)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Tenure</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {result.months < 12
                      ? `${result.months} mo`
                      : `${Math.floor(result.months / 12)} yr ${
                          result.months % 12
                        } mo`}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter a monthly deposit and tenure above to see the maturity value.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}