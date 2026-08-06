import { describe, it, expect } from "vitest"
import { calculateIncomeTax } from "./engine"

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
    expect(r.totalTax).toBeCloseTo(r.grossTax * 1.04, 2)
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
    const withDeduction = calculateIncomeTax({ annualIncome: 1200000, newRegime: false, deductions: 200000 })
    const withoutDeduction = calculateIncomeTax({ annualIncome: 1200000, newRegime: false, deductions: 0 })
    expect(withDeduction.totalTax).toBeLessThan(withoutDeduction.totalTax)
    expect(withDeduction.taxableIncome).toBe(1200000 - 50000 - 200000)
  })

  it("ignores deductions under the new regime", () => {
    const withDeduction = calculateIncomeTax({ annualIncome: 1200000, newRegime: true, deductions: 200000 })
    const withoutDeduction = calculateIncomeTax({ annualIncome: 1200000, newRegime: true, deductions: 0 })
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
  })

  it("computes effective tax rate", () => {
    const r = calculateIncomeTax({ annualIncome: 2000000, newRegime: true, deductions: 0 })
    expect(r.effectiveRate).toBeCloseTo((r.totalTax / 2000000) * 100, 2)
  })

  it("produces deterministic results", () => {
    const input = { annualIncome: 1850000, newRegime: false, deductions: 150000 }
    expect(calculateIncomeTax(input)).toEqual(calculateIncomeTax(input))
  })
})
