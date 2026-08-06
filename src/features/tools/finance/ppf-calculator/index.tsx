import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatINR } from "@/lib/utils"
import { calculatePpf } from "./engine"
import { PPF_CONFIG } from "./config"

const TENURE_CHIPS = Array.from(
  { length: 4 },
  (_, i) => PPF_CONFIG.lockInYears + PPF_CONFIG.extensionBlockYears * i,
)

export default function PpfCalculator({ tool }: { tool: ToolDefinition }) {
  const [annual, setAnnual] = useState("150000")
  const [years, setYears] = useState("15")

  const result = useMemo(() => {
    const p = Number(annual)
    const y = Number(years)
    if (!Number.isFinite(p) || p < 0 || !Number.isFinite(y) || y < 0) return null
    return calculatePpf({ annual: p, years: y })
  }, [annual, years])

  const investedShare =
    result && result.maturityValue > 0
      ? (result.invested / result.maturityValue) * 100
      : 0

  const depositOverLimit = Number(annual) > PPF_CONFIG.maxDeposit

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
            <Label htmlFor="ppf-annual">Annual deposit (₹)</Label>
            <Input
              id="ppf-annual"
              type="number"
              min="0"
              max={PPF_CONFIG.maxDeposit}
              step="any"
              inputMode="decimal"
              value={annual}
              onChange={(e) => setAnnual(e.target.value)}
              placeholder={`e.g. ${PPF_CONFIG.maxDeposit}`}
              aria-invalid={depositOverLimit}
            />
            <p className="text-[11px] text-muted-foreground">
              ₹{PPF_CONFIG.minDeposit.toLocaleString("en-IN")} – ₹
              {PPF_CONFIG.maxDeposit.toLocaleString("en-IN")} per financial year
              (capped at the maximum).
            </p>
            {depositOverLimit && (
              <p className="text-[11px] font-medium text-amber-600">
                Above the ₹1,50,000 PPF limit — results are capped at the maximum.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ppf-years">Duration (years)</Label>
            <Input
              id="ppf-years"
              type="number"
              min="0"
              max="50"
              step="1"
              inputMode="numeric"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="e.g. 15"
            />
            <p className="text-[11px] text-muted-foreground">
              Standard lock-in is {PPF_CONFIG.lockInYears} years; after maturity
              you may extend in {PPF_CONFIG.extensionBlockYears}-year blocks.
            </p>
            <div className="flex flex-wrap gap-2">
              {TENURE_CHIPS.map((y) => (
                <Button
                  key={y}
                  type="button"
                  size="sm"
                  variant="outline"
                  className={cn(
                    "h-7 rounded-full px-3 text-xs",
                    Number(years) === y && "border-primary bg-primary/10 text-primary",
                  )}
                  onClick={() => setYears(String(y))}
                >
                  {y} yrs
                </Button>
              ))}
            </div>
          </div>
        </div>

        {result?.warnings.length ? (
          <div className="mt-4 space-y-1.5">
            {result.warnings.map((w, i) => (
              <p
                key={i}
                className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700"
              >
                {w}
              </p>
            ))}
          </div>
        ) : null}

        <div className="mt-6 rounded-xl border bg-secondary/40 p-5">
          {result && result.years > 0 ? (
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
                  <dt className="text-xs text-muted-foreground">Interest rate</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {result.annualRate}% / yr
                  </dd>
                </div>
              </dl>

              <p className="mt-4 rounded-lg bg-muted/60 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
                Assumes each year&apos;s deposit is made at the start of the
                financial year (before 5 April), so it earns interest for the full
                year. PPF interest is credited at the end of each financial year.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter an annual deposit and duration above to see your PPF growth.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}