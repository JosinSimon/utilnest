import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SegmentedControl } from "@/components/ui/segmented"
import { formatINR } from "@/lib/utils"
import { runSalaryHike } from "./engine"
import { Wallet, Info, ArrowUpRight } from "lucide-react"

export default function SalaryHikeCalculator({ tool: _tool }: { tool: ToolDefinition }) {
  const [mode, setMode] = useState<"monthly" | "annual">("annual")
  const [currentSalaryStr, setCurrentSalaryStr] = useState("600000")
  const [hikePercentageStr, setHikePercentageStr] = useState("20")

  const result = useMemo(() => {
    const currentSalary = parseFloat(currentSalaryStr)
    const hikePercentage = parseFloat(hikePercentageStr)
    return runSalaryHike({ currentSalary, hikePercentage, mode })
  }, [currentSalaryStr, hikePercentageStr, mode])

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Salary Hike Calculator</CardTitle>
          <CardDescription>
            Calculate your new CTC salary, hike amount, monthly increment, and estimated take-home (in-hand) pay.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Input Mode
            </Label>
            <SegmentedControl
              options={[
                { label: "Annual CTC (₹)", value: "annual", sub: "e.g. ₹6,00,000 / year" },
                { label: "Monthly Salary (₹)", value: "monthly", sub: "e.g. ₹50,000 / month" },
              ]}
              value={mode}
              onChange={(val) => setMode(val as "monthly" | "annual")}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currentSalary" className="font-semibold">
                Current {mode === "monthly" ? "Monthly Salary" : "Annual CTC"} (₹)
              </Label>
              <Input
                id="currentSalary"
                type="number"
                min="0"
                value={currentSalaryStr}
                onChange={(e) => setCurrentSalaryStr(e.target.value)}
                placeholder={mode === "monthly" ? "50000" : "600000"}
                className="text-lg py-5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hikePercentage" className="font-semibold">Appraisal Hike (%)</Label>
              <Input
                id="hikePercentage"
                type="number"
                min="0"
                value={hikePercentageStr}
                onChange={(e) => setHikePercentageStr(e.target.value)}
                placeholder="20"
                className="text-lg py-5 text-emerald-600 font-semibold"
              />
            </div>
          </div>

          {result ? (
            <div className="space-y-6 mt-8">
              {/* Highlighted Primary Card */}
              <div className="flex flex-col gap-2 rounded-lg bg-emerald-600 px-5 py-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                    New Annual CTC
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded bg-black/20 font-semibold flex items-center gap-1">
                    <ArrowUpRight className="size-3.5" /> +{hikePercentageStr}% Increase
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl md:text-4xl font-extrabold">{formatINR(result.newAnnualSalary)}</span>
                  <span className="text-sm opacity-90">Annual Package</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-white/20 pt-2.5 mt-1">
                  <span className="text-lg font-bold">{formatINR(result.newMonthlySalary)}</span>
                  <span className="text-xs opacity-90">Gross Monthly CTC</span>
                </div>
              </div>

              {/* Stat Cards */}
              <dl className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monthly Salary Increase</dt>
                  <dd className="text-xl font-bold text-emerald-600">+{formatINR(result.monthlyIncrease)}</dd>
                  <span className="text-[11px] text-muted-foreground">Extra per month</span>
                </div>

                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Annual CTC Increase</dt>
                  <dd className="text-xl font-bold text-emerald-600">+{formatINR(result.annualIncrease)}</dd>
                  <span className="text-[11px] text-muted-foreground">Extra per year</span>
                </div>

                <div className="flex flex-col gap-1 rounded-lg border bg-card p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estimated In-Hand Pay</dt>
                  <dd className="text-xl font-bold text-foreground">{formatINR(result.estimatedMonthlyInHand)}</dd>
                  <span className="text-[11px] text-muted-foreground">Take-home / month (approx)</span>
                </div>
              </dl>

              {/* In-Hand Breakdown Box */}
              <div className="border rounded-lg p-4 bg-muted/40 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                  <Wallet className="size-4 text-primary" />
                  Estimated In-Hand Salary Breakdown (Monthly)
                </div>

                <div className="grid gap-2 text-xs sm:grid-cols-2">
                  <div className="flex justify-between p-2 rounded bg-background border">
                    <span>Gross Monthly CTC</span>
                    <span className="font-semibold">{formatINR(result.newMonthlySalary)}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-background border text-red-600">
                    <span>PF (Employee 12% contribution)</span>
                    <span className="font-semibold">- {formatINR(result.monthlyPfDeduction)}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-background border text-red-600">
                    <span>Professional Tax (PT)</span>
                    <span className="font-semibold">- {formatINR(result.professionalTaxMonthly)}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold">
                    <span>Est. Take-Home In-Hand</span>
                    <span>{formatINR(result.estimatedMonthlyInHand)}/mo</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  * Note: In-hand estimate assumes standard 12% PF on Basic (~50% of CTC) & ₹200 Professional Tax. Income tax depends on Old vs New Tax Regime chosen.
                </p>
              </div>

              {/* Indian CTC Banner */}
              <div className="rounded-lg bg-muted/60 p-4 text-xs space-y-1 text-muted-foreground border">
                <div className="flex items-center gap-2 font-semibold text-foreground text-sm mb-1">
                  <Info className="size-4 text-primary" />
                  What is CTC (Cost to Company)?
                </div>
                <p>
                  <strong>CTC</strong> is the total annual cost the company incurs to employ you. It includes your Basic Salary, HRA, Special Allowances, Employer PF (12%), Gratuity, and Health Insurance benefits.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid numbers above to view hike results.</p>
          )}
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
