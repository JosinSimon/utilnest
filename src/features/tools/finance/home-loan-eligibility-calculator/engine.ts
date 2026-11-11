import type { CalculatorEngine } from "@/features/tools/engine"

export interface EligibilityInput {
  /** Net (take-home) monthly income of the main applicant. */
  monthlyIncome: number
  coApplicantIncome?: number
  /** EMIs already being paid (car loan, personal loan, etc.). */
  existingEmis?: number
  annualRate: number
  tenureYears: number
  /** Share of income lenders allow for all EMIs (FOIR), in %. */
  foirPct: number
  /** Optional property cost; 0 or empty skips the LTV check. */
  propertyValue?: number
}

export type LimitingFactor = "income" | "property-value"

export interface EligibilityResult {
  maxEmi: number
  incomeBasedLoan: number
  ltvBasedLoan: number | null
  eligibleLoan: number
  emiForEligibleLoan: number
  limitedBy: LimitingFactor
  /** Down payment needed when a property value is given. */
  downPayment: number | null
}

const round0 = (v: number): number => Math.round(v)
const round2 = (v: number): number => Math.round(v * 100) / 100

/**
 * RBI loan-to-value caps for individual housing loans, by loan amount:
 * up to ₹30 lakh → 90%, above ₹30 lakh up to ₹75 lakh → 80%, above ₹75 lakh → 75%.
 */
export const LTV_SLABS: { upTo: number; maxLtv: number }[] = [
  { upTo: 3_000_000, maxLtv: 0.9 },
  { upTo: 7_500_000, maxLtv: 0.8 },
  { upTo: Number.POSITIVE_INFINITY, maxLtv: 0.75 },
]

/** Largest loan allowed by the RBI LTV slabs for a given property value. */
export function maxLoanByLtv(propertyValue: number): number {
  if (propertyValue <= 0) return 0
  let best = 0
  let lower = 0
  for (const slab of LTV_SLABS) {
    const candidate = Math.min(slab.maxLtv * propertyValue, slab.upTo)
    // The candidate must actually fall inside this slab.
    if (candidate > lower || lower === 0) best = Math.max(best, candidate)
    lower = slab.upTo
  }
  return best
}

/** Present value of an EMI stream: the loan a given EMI can repay. */
export function loanForEmi(emi: number, monthlyRate: number, months: number): number {
  if (emi <= 0 || months <= 0) return 0
  if (monthlyRate === 0) return emi * months
  const f = Math.pow(1 + monthlyRate, months)
  return (emi * (f - 1)) / (monthlyRate * f)
}

export const calculateEligibility: CalculatorEngine<EligibilityInput, EligibilityResult | null> = (
  input,
) => {
  const income = Math.max(0, input.monthlyIncome) + Math.max(0, input.coApplicantIncome ?? 0)
  const existing = Math.max(0, input.existingEmis ?? 0)
  const foir = Math.min(100, Math.max(0, input.foirPct)) / 100
  const n = Math.max(0, Math.round(input.tenureYears * 12))
  const annual = Math.max(0, input.annualRate)
  if (!Number.isFinite(income) || income <= 0 || n <= 0 || !Number.isFinite(annual)) return null
  const r = annual / 100 / 12

  const maxEmi = Math.max(0, income * foir - existing)
  const incomeBasedLoan = loanForEmi(maxEmi, r, n)
  const property = Math.max(0, input.propertyValue ?? 0)
  const ltvBasedLoan = property > 0 ? maxLoanByLtv(property) : null

  const limitedBy: LimitingFactor =
    ltvBasedLoan !== null && ltvBasedLoan < incomeBasedLoan ? "property-value" : "income"
  const eligibleLoan = limitedBy === "property-value" ? ltvBasedLoan! : incomeBasedLoan
  const f = Math.pow(1 + r, n)
  const emiForEligibleLoan = eligibleLoan <= 0 ? 0 : r === 0 ? eligibleLoan / n : (eligibleLoan * r * f) / (f - 1)

  return {
    maxEmi: round2(maxEmi),
    incomeBasedLoan: round0(incomeBasedLoan),
    ltvBasedLoan: ltvBasedLoan === null ? null : round0(ltvBasedLoan),
    eligibleLoan: round0(eligibleLoan),
    emiForEligibleLoan: round2(emiForEligibleLoan),
    limitedBy,
    downPayment: property > 0 ? round0(Math.max(0, property - eligibleLoan)) : null,
  }
}

export default { family: "calculator" as const, run: calculateEligibility }
