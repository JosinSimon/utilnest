import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent } from "@/components/ui/card"
import { formatINR } from "@/lib/utils"
import { LoanField, Stat, num } from "../shared/LoanField"
import { calculateEligibility } from "./engine"

export default function HomeLoanEligibilityCalculator({ tool }: { tool: ToolDefinition }) {
  const [income, setIncome] = useState("100000")
  const [coIncome, setCoIncome] = useState("0")
  const [existing, setExisting] = useState("10000")
  const [rate, setRate] = useState(String(tool.preset?.defaultAnnualRate ?? 8.5))
  const [years, setYears] = useState(String(tool.preset?.defaultTenureYears ?? 20))
  const [foir, setFoir] = useState("50")
  const [property, setProperty] = useState("")

  const result = useMemo(() => {
    const values = [income, coIncome || "0", existing || "0", rate, years, foir, property || "0"].map(num)
    if (values.some((v) => Number.isNaN(v))) return null
    const [inc, co, ex, r, y, f, prop] = values
    return calculateEligibility({
      monthlyIncome: inc,
      coApplicantIncome: co,
      existingEmis: ex,
      annualRate: r,
      tenureYears: y,
      foirPct: f,
      propertyValue: prop,
    })
  }, [income, coIncome, existing, rate, years, foir, property])

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
          <LoanField id="el-income" label="Your net monthly income (₹)" value={income} onChange={setIncome} hint="Take-home salary after tax and PF." />
          <LoanField id="el-co" label="Co-applicant net monthly income (₹)" value={coIncome} onChange={setCoIncome} hint="Optional, e.g. spouse." />
          <LoanField id="el-existing" label="Current EMIs (₹ a month)" value={existing} onChange={setExisting} hint="Car, personal or other loans." />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <LoanField id="el-rate" label="Interest rate (% a year)" value={rate} onChange={setRate} />
          <LoanField id="el-years" label="Tenure (years)" value={years} onChange={setYears} />
          <LoanField id="el-foir" label="Income share for EMIs (FOIR %)" value={foir} onChange={setFoir} hint="Lenders often allow 40%–60%. Ask yours." />
        </div>
        <LoanField
          id="el-property"
          label="Property cost (₹, optional)"
          value={property}
          onChange={setProperty}
          placeholder="e.g. 6000000"
          hint="Adds the RBI loan-to-value limit: 90% up to ₹30 lakh, 80% up to ₹75 lakh, 75% above."
        />

        <div className="rounded-xl border bg-secondary/40 p-5">
          {result ? (
            <div className="space-y-4">
              <div className="flex items-baseline justify-between rounded-lg bg-primary px-4 py-3 text-primary-foreground">
                <dt className="text-sm font-medium">Estimated home loan you can get</dt>
                <dd className="text-2xl font-semibold tabular-nums">{formatINR(result.eligibleLoan)}</dd>
              </div>
              <p className="text-sm text-foreground">
                {result.eligibleLoan === 0
                  ? "Your current EMIs already use up the income share lenders allow. Paying off a loan or adding a co-applicant would help."
                  : result.limitedBy === "property-value"
                    ? "This is limited by the property cost (RBI loan-to-value rules), not your income. Your income could support more."
                    : "This is limited by your income: it is the loan your maximum EMI can repay over the tenure."}
              </p>
              <dl className="grid gap-3 sm:grid-cols-3">
                <Stat label="Maximum EMI you can afford" value={formatINR(Math.round(result.maxEmi))} />
                <Stat label="EMI on this loan" value={formatINR(Math.round(result.emiForEligibleLoan))} />
                <Stat label="Loan based on income" value={formatINR(result.incomeBasedLoan)} />
                {result.ltvBasedLoan !== null && <Stat label="Loan based on property cost" value={formatINR(result.ltvBasedLoan)} />}
                {result.downPayment !== null && <Stat label="Down payment needed" value={formatINR(result.downPayment)} />}
              </dl>
              <p className="text-xs text-muted-foreground">
                An estimate. Lenders also look at your credit score, age, job stability and the property itself.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter your income, rate and tenure to see your eligibility.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
