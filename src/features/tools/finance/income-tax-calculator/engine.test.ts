import { describe, it, expect } from "vitest"
import { calculateIncomeTax, TAX_YEARS, DEFAULT_FINANCIAL_YEAR } from "./engine"
import type { IncomeTaxResult } from "./engine"

type Regime = "new" | "old"

const STANDARD_DEDUCTION: Record<Regime, number> = {
  new: 75000,
  old: 50000,
}

/**
 * The engine computes tax on taxable income = gross income − standard
 * deduction − deductions. Surcharge thresholds are keyed on taxable income,
 * so these helpers convert a target taxable amount back to the gross figure
 * the engine consumes.
 */
function atTaxable(regime: Regime, taxable: number): IncomeTaxResult {
  return calculateIncomeTax({
    annualIncome: taxable + STANDARD_DEDUCTION[regime],
    newRegime: regime === "new",
    deductions: 0,
    financialYear: DEFAULT_FINANCIAL_YEAR,
  })
}

const THRESHOLDS: Record<Regime, number[]> = {
  new: [5000000, 10000000, 20000000], // no ₹5Cr step in the new regime
  old: [5000000, 10000000, 20000000, 50000000],
}

describe("income tax surcharge + marginal relief (FY 2026-27)", () => {
  it("applies no surcharge below the first threshold, every rupee increments tax ≤ income", () => {
    const r = atTaxable("new", 4999999)
    expect(r.surchargeApplicable).toBe(false)
    expect(r.surchargeRate).toBe(0)
    expect(r.surcharge).toBe(0)
    expect(r.marginalRelief).toBe(0)
  })

  it.each(["new", "old"] as Regime[])(
    "(%s) never lets the pre-cess tax jump by more than the income increase around every threshold",
    (regime) => {
      for (const t of THRESHOLDS[regime]) {
        for (let d = -50; d <= 10; d++) {
          const taxable = t + d
          const r = atTaxable(regime, taxable)
          const next = atTaxable(regime, taxable + 1)
          const jump = next.taxAfterRebate + next.surcharge - (r.taxAfterRebate + r.surcharge)
          expect(jump, `${regime} taxable ${taxable} → ${taxable + 1}`).toBeLessThanOrEqual(1)
        }
      }
    },
  )

  it("keeps the total tax (incl. cess) non-decreasing across every threshold", () => {
    for (const regime of ["new", "old"] as Regime[]) {
      for (const t of THRESHOLDS[regime]) {
        let prev = 0
        for (let d = -50; d <= 25; d++) {
          const r = atTaxable(regime, t + d)
          expect(r.totalTax, `${regime} taxable ${t + d}`).toBeGreaterThanOrEqual(prev)
          prev = r.totalTax
        }
      }
    }
  })

  it("caps the total-tax jump across a threshold to at most ₹2 (cess rounding)", () => {
    for (const regime of ["new", "old"] as Regime[]) {
      for (const t of THRESHOLDS[regime]) {
        for (let d = 0; d < 50; d++) {
          const r = atTaxable(regime, t + d)
          const next = atTaxable(regime, t + d + 1)
          expect(next.totalTax - r.totalTax, `${regime} taxable ${t + d}`).toBeLessThanOrEqual(2)
        }
      }
    }
  })

  it("new regime caps surcharge at 25% even far beyond ₹5Cr", () => {
    const r = atTaxable("new", 80000000)
    expect(r.surchargeRate).toBe(0.25)
    expect(r.surchargeApplicable).toBe(true)
  })

  it("old regime reaches 37% above ₹5Cr", () => {
    const r = atTaxable("old", 80000000)
    expect(r.surchargeRate).toBe(0.37)
    expect(r.surchargeApplicable).toBe(true)
  })

  it("old regime @ taxable ₹51L matches the published marginal-relief example", () => {
    // Published figures: tax ₹13,42,500 · surcharge ₹1,34,250 → relief ₹64,250
    // → surcharge ₹70,000 · cess ₹56,500 · total ₹14,69,000.
    const r = atTaxable("old", 5100000)
    expect(r.taxAfterRebate).toBe(1342500)
    expect(r.surchargeRate).toBe(0.1)
    expect(r.marginalRelief).toBe(64250)
    expect(r.surcharge).toBe(70000)
    expect(r.cess).toBe(56500)
    expect(r.totalTax).toBe(1469000)
  })

  it("new regime @ taxable ₹51L matches the published marginal-relief example", () => {
    // Published figures: tax ₹11,10,000 · surcharge ₹1,11,000 → relief ₹41,000
    // → surcharge ₹70,000 · cess ₹47,200 · total ₹12,27,200.
    const r = atTaxable("new", 5100000)
    expect(r.taxAfterRebate).toBe(1110000)
    expect(r.surchargeRate).toBe(0.1)
    expect(r.marginalRelief).toBe(41000)
    expect(r.surcharge).toBe(70000)
    expect(r.cess).toBe(47200)
    expect(r.totalTax).toBe(1227200)
  })

  it("applies marginal relief at the ₹1Cr step (new regime)", () => {
    const r = atTaxable("new", 10100000)
    expect(r.surchargeRate).toBe(0.15)
    expect(r.marginalRelief).toBeGreaterThan(0)
    // Cap = (tax at 1Cr incl. the previous 10% tier) + excess over ₹1Cr.
    const prevRate = 0.1
    const taxAtThreshold = atTaxable("new", 10000000).taxAfterRebate
    const reference = Math.round(taxAtThreshold * (1 + prevRate))
    const cap = reference + (10100000 - 10000000)
    expect(r.taxAfterRebate + r.surcharge).toBe(cap)
    expect(r.totalTax).toBe(r.taxAfterRebate + r.surcharge + r.cess)
  })

  it("rate steps up exactly at each threshold (new regime)", () => {
    const at = (n: number) => atTaxable("new", n)
    expect(at(4999999).surchargeRate).toBe(0)
    expect(at(5000001).surchargeRate).toBe(0.1)
    // Tiers persist below the next threshold, then jump at it.
    expect(at(9999999).surchargeRate).toBe(0.1)
    expect(at(10000001).surchargeRate).toBe(0.15)
    expect(at(19999999).surchargeRate).toBe(0.15)
    expect(at(20000001).surchargeRate).toBe(0.25)
    // No ₹5Cr step in the new regime: stays at 25% well beyond.
    expect(at(80000000).surchargeRate).toBe(0.25)
  })

  it("old regime adds a 37% step at ₹5Cr", () => {
    const at = (n: number) => atTaxable("old", n)
    expect(at(49999999).surchargeRate).toBe(0.25)
    expect(at(50000001).surchargeRate).toBe(0.37)
    expect(at(80000000).surchargeRate).toBe(0.37)
  })
})

describe("income tax calculator engine (FY 2026-27)", () => {
  it("gives zero tax up to ₹12L in the new regime", () => {
    const r = calculateIncomeTax({ annualIncome: 1200000, newRegime: true, deductions: 0 })
    expect(r.totalTax).toBe(0)
    expect(r.rebate).toBeGreaterThan(0)
  })

  it("charges tax above ₹12L in the new regime", () => {
    const r = calculateIncomeTax({ annualIncome: 1500000, newRegime: true, deductions: 0 })
    expect(r.taxableIncome).toBe(1425000)
    expect(r.totalTax).toBeGreaterThan(0)
    expect(r.totalTax).toBeCloseTo(r.taxAfterRebate * 1.04, 2)
  })

  it("gives zero tax up to ₹5L in the old regime", () => {
    const r = calculateIncomeTax({ annualIncome: 500000, newRegime: false, deductions: 0 })
    expect(r.totalTax).toBe(0)
  })

  it("charges tax above ₹5L in the old regime", () => {
    const r = calculateIncomeTax({ annualIncome: 800000, newRegime: false, deductions: 0 })
    expect(r.totalTax).toBeGreaterThan(0)
  })

  it("applies deductions only under the old regime", () => {
    const withDeduction = calculateIncomeTax({
      annualIncome: 1200000,
      newRegime: false,
      deductions: 200000,
    })
    const withoutDeduction = calculateIncomeTax({
      annualIncome: 1200000,
      newRegime: false,
      deductions: 0,
    })
    expect(withDeduction.totalTax).toBeLessThan(withoutDeduction.totalTax)
    expect(withDeduction.taxableIncome).toBe(1200000 - 50000 - 200000)
  })

  it("ignores deductions under the new regime", () => {
    const withDeduction = calculateIncomeTax({
      annualIncome: 1200000,
      newRegime: true,
      deductions: 200000,
    })
    const withoutDeduction = calculateIncomeTax({
      annualIncome: 1200000,
      newRegime: true,
      deductions: 0,
    })
    expect(withDeduction.taxableIncome).toBe(withoutDeduction.taxableIncome)
  })

  it("applies 4% cess on top of tax", () => {
    const r = calculateIncomeTax({ annualIncome: 3000000, newRegime: true, deductions: 0 })
    expect(r.cess).toBeCloseTo(r.taxAfterRebate * 0.04, 2)
    expect(r.totalTax).toBeCloseTo(r.taxAfterRebate + r.cess, 2)
  })

  it("handles zero income", () => {
    const r = calculateIncomeTax({ annualIncome: 0, newRegime: true, deductions: 0 })
    expect(r.totalTax).toBe(0)
    expect(r.taxableIncome).toBe(0)
    expect(r.surcharge).toBe(0)
  })

  it("computes effective tax rate", () => {
    const r = calculateIncomeTax({ annualIncome: 2000000, newRegime: true, deductions: 0 })
    expect(r.effectiveRate).toBeCloseTo((r.totalTax / 2000000) * 100, 2)
  })

  it("produces deterministic results", () => {
    const input = { annualIncome: 1850000, newRegime: false, deductions: 150000 }
    expect(calculateIncomeTax(input)).toEqual(calculateIncomeTax(input))
  })

  it("defaults to FY 2026-27 and validates that a config exists", () => {
    expect(calculateIncomeTax({ annualIncome: 2000000, newRegime: true, deductions: 0 }).financialYear).toBe(
      DEFAULT_FINANCIAL_YEAR,
    )
    expect(TAX_YEARS[DEFAULT_FINANCIAL_YEAR]).toBeDefined()
  })
})