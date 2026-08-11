import type { CalculatorEngine } from "@/features/tools/engine"

export type FinancialYear = "fy-2026-27"

export const DEFAULT_FINANCIAL_YEAR: FinancialYear = "fy-2026-27"

export interface TaxSlab {
  upTo: number
  rate: number
}

export interface SurchargeSlab {
  above: number
  rate: number
}

export interface RebateRule {
  maxIncome: number
  limit: number
}

export interface RegimeConfig {
  standardDeduction: number
  slabs: TaxSlab[]
  rebate: RebateRule
  surchargeSlabs: SurchargeSlab[]
}

export interface TaxConfig {
  cessRate: number
  regimes: {
    new: RegimeConfig
    old: RegimeConfig
  }
}

/**
 * Data-driven tax configuration. Every figure the engine uses lives here;
 * the calculation logic contains no hardcoded rates. Adding a future
 * financial year is a matter of appending a new entry.
 */
export const TAX_YEARS: Record<FinancialYear, TaxConfig> = {
  "fy-2026-27": {
    cessRate: 0.04,
    regimes: {
      new: {
        standardDeduction: 75000,
        slabs: [
          { upTo: 400000, rate: 0 },
          { upTo: 800000, rate: 0.05 },
          { upTo: 1200000, rate: 0.1 },
          { upTo: 1600000, rate: 0.15 },
          { upTo: 2000000, rate: 0.2 },
          { upTo: 2400000, rate: 0.25 },
          { upTo: Number.POSITIVE_INFINITY, rate: 0.3 },
        ],
        rebate: { maxIncome: 1200000, limit: 60000 },
        // Surcharge is capped at 25% in the new regime — no ₹5Cr step.
        surchargeSlabs: [
          { above: 5000000, rate: 0.1 },
          { above: 10000000, rate: 0.15 },
          { above: 20000000, rate: 0.25 },
        ],
      },
      old: {
        standardDeduction: 50000,
        slabs: [
          { upTo: 250000, rate: 0 },
          { upTo: 500000, rate: 0.05 },
          { upTo: 1000000, rate: 0.2 },
          { upTo: Number.POSITIVE_INFINITY, rate: 0.3 },
        ],
        rebate: { maxIncome: 500000, limit: 12500 },
        surchargeSlabs: [
          { above: 5000000, rate: 0.1 },
          { above: 10000000, rate: 0.15 },
          { above: 20000000, rate: 0.25 },
          { above: 50000000, rate: 0.37 },
        ],
      },
    },
  },
}

export interface IncomeTaxInput {
  annualIncome: number
  /** True = new (default) regime, false = old regime. */
  newRegime: boolean
  /** Deductions (80C/80D/HRA/home loan) — only available under the old regime. */
  deductions: number
  financialYear?: FinancialYear
}

export interface IncomeTaxResult {
  financialYear: FinancialYear
  annualIncome: number
  regime: "new" | "old"
  standardDeduction: number
  taxableIncome: number
  grossTax: number
  rebate: number
  taxAfterRebate: number
  surchargeRate: number
  surchargeApplicable: boolean
  /** Surcharge after marginal relief, as actually payable. */
  surcharge: number
  /** Reduction applied to the surcharge so tax never jumps at a threshold. */
  marginalRelief: number
  cess: number
  totalTax: number
  effectiveRate: number
}

/** Round to the nearest rupee, matching income-tax return convention. */
const rupee = (value: number): number => Math.round(value)

function taxOnSlabs(income: number, slabs: TaxSlab[]): number {
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

function highestSurchargeSlab(income: number, slabs: SurchargeSlab[]): SurchargeSlab | undefined {
  let applicable: SurchargeSlab | undefined
  for (const slab of slabs) {
    if (income > slab.above) applicable = slab
  }
  return applicable
}

/**
 * Income tax for FY 2026-27 (AY 2027-28). Budget 2026 kept the FY 2025-26
 * slabs unchanged.
 *
 * Pipeline: taxable income → slab tax → §87A rebate → surcharge (per total
 * income) → marginal relief (caps tax + surcharge at tax(threshold) plus the
 * income in excess of the threshold) → 4% health & education cess → total.
 *
 * All outputs are rounded to the nearest rupee.
 */
export const calculateIncomeTax: CalculatorEngine<IncomeTaxInput, IncomeTaxResult> = ({
  annualIncome,
  newRegime,
  deductions,
  financialYear,
}) => {
  const fy = financialYear ?? DEFAULT_FINANCIAL_YEAR
  const config = TAX_YEARS[fy]
  const regimeConfig = config.regimes[newRegime ? "new" : "old"]

  const income = Math.max(0, annualIncome)
  const deductionsAmount = newRegime ? 0 : Math.max(0, deductions)

  const standardDeduction = regimeConfig.standardDeduction
  const taxableIncome = rupee(Math.max(0, income - standardDeduction - deductionsAmount))

  const grossTax = taxOnSlabs(taxableIncome, regimeConfig.slabs)

  let rebate = 0
  if (taxableIncome <= regimeConfig.rebate.maxIncome) {
    rebate = Math.min(grossTax, regimeConfig.rebate.limit)
  } else if (newRegime) {
    // Proviso to Section 87A under New Regime (Finance Act):
    // Tax payable before cess shall not exceed the income in excess of maxIncome.
    const excessIncome = taxableIncome - regimeConfig.rebate.maxIncome
    if (grossTax > excessIncome) {
      rebate = grossTax - excessIncome
    }
  }
  const taxAfterRebateUnrounded = Math.max(0, grossTax - rebate)

  const surchargeSlab = highestSurchargeSlab(taxableIncome, regimeConfig.surchargeSlabs)
  const surchargeRate = surchargeSlab?.rate ?? 0
  const surchargeApplicable = surchargeSlab !== undefined

  // Keep tax and surcharge unrounded through marginal relief, then round the
  // combined pre-cess figure once. Rounding two components separately can
  // bump the total by 2 on a single rupee of income (a false "cliff"); a
  // single rounding of the sum makes every one-rupee step ≤ 1.
  let surchargeNet = 0
  let marginalRelief = 0
  if (surchargeSlab) {
    const surchargeGross = taxAfterRebateUnrounded * surchargeRate
    const threshold = surchargeSlab.above
    // Reference for marginal relief = total tax payable at the threshold,
    // including the surcharge of the PREVIOUS tier (0 below the first).
    // Cropping against the bare base tax would wrongly cut tax at higher tiers.
    const prevRate =
      highestSurchargeSlab(threshold - 1, regimeConfig.surchargeSlabs)?.rate ?? 0
    const taxAtThreshold = taxOnSlabs(threshold, regimeConfig.slabs)
    const reference = rupee(taxAtThreshold * (1 + prevRate))
    const excess = rupee(taxableIncome - threshold)
    const cap = reference + excess
    marginalRelief = Math.max(0, taxAfterRebateUnrounded + surchargeGross - cap)
    surchargeNet = Math.max(0, surchargeGross - marginalRelief)
  }

  // Round the combined tax + surcharge once; derive the displayed surcharge
  // from that sum so the breakdown always adds up.
  const preCess = rupee(taxAfterRebateUnrounded + surchargeNet)
  const taxAfterRebate = rupee(taxAfterRebateUnrounded)
  const surcharge = preCess - taxAfterRebate

  const cess = rupee(preCess * config.cessRate)
  const totalTax = preCess + cess

  return {
    financialYear: fy,
    annualIncome: income,
    regime: newRegime ? "new" : "old",
    standardDeduction,
    taxableIncome,
    grossTax: rupee(grossTax),
    rebate: rupee(rebate),
    taxAfterRebate,
    surchargeRate,
    surchargeApplicable,
    surcharge,
    marginalRelief: rupee(marginalRelief),
    cess,
    totalTax,
    effectiveRate: income > 0 ? rupee((totalTax / income) * 10000) / 100 : 0,
  }
}

export default {
  family: "calculator" as const,
  run: calculateIncomeTax,
}
