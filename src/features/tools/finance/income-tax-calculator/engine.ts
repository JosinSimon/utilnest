import type { CalculatorEngine } from "@/features/tools/engine"

export interface IncomeTaxInput {
  annualIncome: number
  /** True = new (default) regime, false = old regime. */
  newRegime: boolean
  /** Deductions (80C/80D/HRA/home loan) — only available under the old regime. */
  deductions: number
}

export interface IncomeTaxResult {
  annualIncome: number
  regime: "new" | "old"
  standardDeduction: number
  taxableIncome: number
  grossTax: number
  rebate: number
  taxAfterRebate: number
  cess: number
  totalTax: number
  effectiveRate: number
}

const NEW_SLABS = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 0.05 },
  { upTo: 1200000, rate: 0.1 },
  { upTo: 1600000, rate: 0.15 },
  { upTo: 2000000, rate: 0.2 },
  { upTo: 2400000, rate: 0.25 },
  { upTo: Infinity, rate: 0.3 },
]

const OLD_SLABS = [
  { upTo: 250000, rate: 0 },
  { upTo: 500000, rate: 0.05 },
  { upTo: 1000000, rate: 0.2 },
  { upTo: Infinity, rate: 0.3 },
]

const NEW_STANDARD_DEDUCTION = 75000
const OLD_STANDARD_DEDUCTION = 50000
const CESS_RATE = 0.04

const round2 = (value: number): number => Math.round(value * 100) / 100

function taxOnSlabs(income: number, slabs: { upTo: number; rate: number }[]): number {
  let tax = 0
  let previous = 0
  for (const slab of slabs) {
    if (income <= previous) break
    const slice = Math.min(income, slab.upTo) - previous
    tax += slice * slab.rate
    previous = slab.upTo
  }
  return tax
}

/**
 * Income tax for FY 2026-27 (AY 2027-28). Budget 2026 kept the FY 2025-26
 * slabs unchanged.
 *
 * New regime: slabs at 0/5/10/15/20/25/30% above ₹4L/8L/12L/16L/20L/24L,
 * standard deduction ₹75,000, §87A rebate ₹60,000 (zero tax up to ₹12L).
 *
 * Old regime: slabs at 0/5/20/30% above ₹2.5L/5L/10L, standard deduction
 * ₹50,000, §87A rebate ₹12,500 (zero tax up to ₹5L).
 *
 * 4% health & education cess applies in both. Surcharge (>₹50L) is not modeled.
 */
export const calculateIncomeTax: CalculatorEngine<IncomeTaxInput, IncomeTaxResult> = ({
  annualIncome,
  newRegime,
  deductions,
}) => {
  const income = Math.max(0, annualIncome)
  const deductionsAmount = newRegime ? 0 : Math.max(0, deductions)

  const standardDeduction = newRegime ? NEW_STANDARD_DEDUCTION : OLD_STANDARD_DEDUCTION
  const taxableIncome = Math.max(0, income - standardDeduction - deductionsAmount)

  const grossTax = taxOnSlabs(taxableIncome, newRegime ? NEW_SLABS : OLD_SLABS)

  const rebateEligible = newRegime
    ? taxableIncome <= 1200000
    : taxableIncome <= 500000
  const rebateLimit = newRegime ? 60000 : 12500
  const rebate = rebateEligible ? Math.min(grossTax, rebateLimit) : 0

  const taxAfterRebate = Math.max(0, grossTax - rebate)
  const cess = round2(taxAfterRebate * CESS_RATE)
  const totalTax = round2(taxAfterRebate + cess)

  return {
    annualIncome: income,
    regime: newRegime ? "new" : "old",
    standardDeduction,
    taxableIncome: round2(taxableIncome),
    grossTax: round2(grossTax),
    rebate: round2(rebate),
    taxAfterRebate: round2(taxAfterRebate),
    cess: round2(cess),
    totalTax,
    effectiveRate: income > 0 ? round2((totalTax / income) * 100) : 0,
  }
}

export default {
  family: "calculator" as const,
  run: calculateIncomeTax,
}
