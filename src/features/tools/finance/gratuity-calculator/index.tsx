import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { formatINR } from "@/lib/utils"
import { calculateGratuity } from "./engine"

export default function GratuityCalculator({ tool }: { tool: ToolDefinition }) {
  const [basic, setBasic] = useState("50000")
  const [da, setDa] = useState("0")
  const [years, setYears] = useState("10")
  const [months, setMonths] = useState("0")

  const result = useMemo(() => {
    const b = Number(basic)
    const d = Number(da)
    const y = Number(years)
    const m = Number(months)
    if (
      !Number.isFinite(b) || b < 0 ||
      !Number.isFinite(d) || d < 0 ||
      !Number.isFinite(y) || y < 0 ||
      !Number.isFinite(m) || m < 0
    ) return null
    return calculateGratuity({ lastBasic: b, lastDa: d, yearsOfService: y, monthsOfService: m })
  }, [basic, da, years, months])

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
            <Label htmlFor="gratuity-basic">Last drawn basic (₹/month)</Label>
            <Input
              id="gratuity-basic"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={basic}
              onChange={(e) => setBasic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gratuity-da">Last drawn DA (₹/month)</Label>
            <Input
              id="gratuity-da"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={da}
              onChange={(e) => setDa(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="gratuity-years">Years of service</Label>
            <Input
              id="gratuity-years"
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
            <Label htmlFor="gratuity-months">Extra months of service</Label>
            <Input
              id="gratuity-months"
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
          {result && result.eligible ? (
            <div>
              <div className="flex items-baseline justify-between rounded-lg bg-primary px-4 py-3 text-primary-foreground">
                <dt className="text-sm font-medium">Gratuity amount</dt>
                <dd className="text-2xl font-semibold tabular-nums">
                  {formatINR(result.gratuity)}
                </dd>
              </div>

              {result.capped && (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  This is the ₹20,00,000 statutory cap — amounts above it are not
                  covered under the Act.
                </p>
              )}

              <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Last monthly salary</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatINR(result.lastMonthlySalary)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Completed years</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {result.totalYears}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs text-muted-foreground">Formula</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    salary × 15 ÷ 26 × years
                  </dd>
                </div>
              </dl>
            </div>
          ) : result?.errorMessage ? (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
              {result.errorMessage}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter your last salary and years of service above to see the gratuity.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}