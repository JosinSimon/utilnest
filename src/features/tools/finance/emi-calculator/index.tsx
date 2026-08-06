import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatINR } from "@/lib/utils"
import { calculateEmi } from "./engine"

const QUICK_RATES = [8.5, 9, 9.5, 10, 11]

export default function EmiCalculator({ tool }: { tool: ToolDefinition }) {
  const [principal, setPrincipal] = useState("5000000")
  const [rate, setRate] = useState("8.5")
  const [years, setYears] = useState("20")
  const [months, setMonths] = useState("0")

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
    return calculateEmi({ principal: p, annualRate: r, years: y, months: m })
  }, [principal, rate, years, months])

  const principalShare =
    result && result.totalPayment > 0
      ? (result.principal / result.totalPayment) * 100
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
            <Label htmlFor="emi-principal">Loan amount (₹)</Label>
            <Input
              id="emi-principal"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="e.g. 5000000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emi-rate">Annual interest rate (%)</Label>
            <Input
              id="emi-rate"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 8.5"
            />
            <div className="flex flex-wrap gap-2">
              {QUICK_RATES.map((r) => (
                <Button
                  key={r}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRate(String(r))}
                  aria-pressed={Number(rate) === r}
                  className={cn(
                    "min-w-12",
                    Number(rate) === r && "border-primary bg-primary/10 text-primary",
                  )}
                >
                  {r}%
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="emi-years">Tenure — years</Label>
            <Input
              id="emi-years"
              type="number"
              min="0"
              max="40"
              step="1"
              inputMode="numeric"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emi-months">Tenure — months</Label>
            <Input
              id="emi-months"
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
          {result && result.tenureMonths > 0 ? (
            <div>
              <div className="flex items-baseline justify-between rounded-lg bg-primary px-4 py-3 text-primary-foreground">
                <dt className="text-sm font-medium">Monthly EMI</dt>
                <dd className="text-2xl font-semibold tabular-nums">
                  {formatINR(result.emi)}
                </dd>
              </div>

              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(100, principalShare)}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                <span>Principal {formatINR(result.principal)}</span>
                <span>Interest {formatINR(result.totalInterest)}</span>
              </div>

              <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Total payment</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.totalPayment)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Total interest</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.totalInterest)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Tenure</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {result.tenureMonths < 12
                      ? `${result.tenureMonths} mo`
                      : `${Math.floor(result.tenureMonths / 12)} yr ${
                          result.tenureMonths % 12
                        } mo`}
                  </dd>
                </div>
              </dl>

              <div className="mt-5">
                <p className="text-sm font-medium">First 12 months</p>
                <div className="mt-2 overflow-x-auto rounded-lg border bg-card">
                  <table className="w-full min-w-[360px] text-left text-sm">
                    <thead className="border-b bg-secondary/40 text-xs text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 font-medium">Month</th>
                        <th className="px-3 py-2 font-medium">Payment</th>
                        <th className="px-3 py-2 font-medium">Interest</th>
                        <th className="px-3 py-2 font-medium">Principal</th>
                        <th className="px-3 py-2 font-medium">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.slice(0, 12).map((row) => (
                        <tr key={row.month} className="border-b last:border-0">
                          <td className="px-3 py-1.5 tabular-nums">{row.month}</td>
                          <td className="px-3 py-1.5 tabular-nums">{formatINR(row.payment)}</td>
                          <td className="px-3 py-1.5 tabular-nums">{formatINR(row.interest)}</td>
                          <td className="px-3 py-1.5 tabular-nums">{formatINR(row.principal)}</td>
                          <td className="px-3 py-1.5 tabular-nums">{formatINR(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter a loan amount and tenure above to see your EMI.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
