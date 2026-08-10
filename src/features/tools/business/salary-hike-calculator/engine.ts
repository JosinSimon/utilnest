import { calculateSalaryHike, type SalaryHikeResult, type SalaryMode } from "@/features/tools/business/shared/pricing"

export type { SalaryHikeResult, SalaryMode }

export interface SalaryHikeInput {
  currentSalary: number
  hikePercentage: number
  mode: SalaryMode
}

export interface ExtendedSalaryHikeResult extends SalaryHikeResult {
  monthlyPfDeduction: number
  professionalTaxMonthly: number
  estimatedMonthlyInHand: number
  estimatedAnnualInHand: number
}

const r2 = (v: number): number => Math.round(v * 100) / 100

export function runSalaryHike(input: SalaryHikeInput): ExtendedSalaryHikeResult | null {
  if (!Number.isFinite(input.currentSalary) || !Number.isFinite(input.hikePercentage)
    || input.currentSalary < 0 || input.hikePercentage < 0) {
    return null
  }
  const base = calculateSalaryHike(input.currentSalary, input.hikePercentage, input.mode)

  // Standard Indian Salary Deductions Estimator:
  // Basic salary is typically ~50% of CTC. PF employee contribution is 12% of basic (or capped at ₹1,800/month).
  const basicMonthly = base.newMonthlySalary / 2
  const monthlyPfDeduction = r2(Math.min(1800, basicMonthly * 0.12))
  const professionalTaxMonthly = base.newMonthlySalary > 15000 ? 200 : 0

  const estimatedMonthlyInHand = r2(Math.max(0, base.newMonthlySalary - monthlyPfDeduction - professionalTaxMonthly))
  const estimatedAnnualInHand = r2(estimatedMonthlyInHand * 12)

  return {
    ...base,
    monthlyPfDeduction,
    professionalTaxMonthly,
    estimatedMonthlyInHand,
    estimatedAnnualInHand,
  }
}

export default { family: "calculator" as const, run: runSalaryHike }
