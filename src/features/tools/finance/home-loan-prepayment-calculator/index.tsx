import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent } from "@/components/ui/card"
import { SegmentedControl } from "@/components/ui/segmented"
import { formatINR } from "@/lib/utils"
import { LoanField, Stat, formatTenure, num } from "../shared/LoanField"
import { calculatePrepayment, type PrepaymentStrategy } from "./engine"

export default function HomeLoanPrepaymentCalculator({ tool }: { tool: ToolDefinition }) {
  const [principal, setPrincipal] = useState(String(tool.preset?.defaultPrincipal ?? 5000000))
  const [rate, setRate] = useState(String(tool.preset?.defaultAnnualRate ?? 8.5))
  const [years, setYears] = useState(String(tool.preset?.defaultTenureYears ?? 20))
  const [lumpSum, setLumpSum] = useState("500000")
  const [lumpYear, setLumpYear] = useState("3")
  const [yearly, setYearly] = useState("0")
  const [extraMonthly, setExtraMonthly] = useState("0")
  const [strategy, setStrategy] = useState<PrepaymentStrategy>("reduce-tenure")

  const result = useMemo(() => {
    const values = [principal, rate, years, lumpSum, lumpYear, yearly, extraMonthly].map(num)
    if (values.some((v) => Number.isNaN(v))) return null
    const [p, r, y, lump, lumpY, yr, extra] = values
    return calculatePrepayment({
      principal: p,
      annualRate: r,
      tenureYears: y,
      lumpSum: lump,
      // Paid at the end of the chosen loan year.
      lumpSumMonth: Math.max(1, Math.round(lumpY * 12)),
      yearlyPrepayment: yr,
      extraMonthly: extra,
      strategy,
    })
  }, [principal, rate, years, lumpSum, lumpYear, yearly, extraMonthly, strategy])

  const hasPrepayment = (result?.withPrepayment.totalPrepaid ?? 0) > 0

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{tool.name}</p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            100% private · in-browser
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <LoanField id="pp-principal" label="Loan amount (₹)" value={principal} onChange={setPrincipal} />
          <LoanField id="pp-rate" label="Interest rate (% a year)" value={rate} onChange={setRate} />
          <LoanField id="pp-years" label="Tenure (years)" value={years} onChange={setYears} />
        </div>

        <div className="rounded-xl border p-4 space-y-4">
          <p className="text-sm font-semibold">Your prepayments</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <LoanField id="pp-lump" label="One-time prepayment (₹)" value={lumpSum} onChange={setLumpSum} />
            <LoanField
              id="pp-lump-year"
              label="Paid at the end of loan year"
              value={lumpYear}
              onChange={setLumpYear}
              hint="For example 3 = after your 36th EMI."
            />
            <LoanField id="pp-yearly" label="Every year (₹)" value={yearly} onChange={setYearly} hint="Paid after every 12th EMI, e.g. from a bonus." />
            <LoanField id="pp-monthly" label="Extra every month (₹)" value={extraMonthly} onChange={setExtraMonthly} hint="Paid on top of each EMI." />
          </div>
          <SegmentedControl<PrepaymentStrategy>
            options={[
              { value: "reduce-tenure", label: "Reduce tenure", sub: "Same EMI, loan ends earlier" },
              { value: "reduce-emi", label: "Reduce EMI", sub: "Same end date, lower EMI" },
            ]}
            value={strategy}
            onChange={setStrategy}
          />
        </div>

        <div className="rounded-xl border bg-secondary/40 p-5">
          {result ? (
            <div className="space-y-4">
              <div className="flex items-baseline justify-between rounded-lg bg-primary px-4 py-3 text-primary-foreground">
                <dt className="text-sm font-medium">Interest saved</dt>
                <dd className="text-2xl font-semibold tabular-nums">{formatINR(Math.round(result.interestSaved))}</dd>
              </div>
              {hasPrepayment && (
                <p className="text-sm text-foreground">
                  {strategy === "reduce-tenure"
                    ? `Your loan ends ${formatTenure(result.monthsSaved)} earlier, after ${formatTenure(result.withPrepayment.months)} instead of ${formatTenure(result.original.months)}.`
                    : `Your EMI drops from ${formatINR(result.original.emi)} to ${formatINR(result.withPrepayment.finalEmi)} after your prepayments, and the loan still ends on time.`}
                </p>
              )}
              <dl className="grid gap-3 sm:grid-cols-3">
                <Stat label="Monthly EMI" value={formatINR(result.original.emi)} />
                <Stat label="Interest without prepayment" value={formatINR(Math.round(result.original.totalInterest))} />
                <Stat label="Interest with prepayment" value={formatINR(Math.round(result.withPrepayment.totalInterest))} tone="good" />
                <Stat label="Total prepaid" value={formatINR(Math.round(result.withPrepayment.totalPrepaid))} />
                <Stat label="Loan length now" value={formatTenure(result.withPrepayment.months)} />
                <Stat
                  label={strategy === "reduce-emi" ? "EMI after prepayments" : "Months saved"}
                  value={strategy === "reduce-emi" ? formatINR(result.withPrepayment.finalEmi) : String(result.monthsSaved)}
                  tone="good"
                />
              </dl>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter a loan amount, rate and tenure to see your savings.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
