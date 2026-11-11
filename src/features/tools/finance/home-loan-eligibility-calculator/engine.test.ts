import { describe, expect, it } from "vitest"
import { calculateEligibility, maxLoanByLtv } from "./engine"

describe("maxLoanByLtv (RBI slabs)", () => {
  it("applies 90% up to ₹30 lakh, 80% up to ₹75 lakh, 75% above", () => {
    expect(maxLoanByLtv(2_000_000)).toBe(1_800_000)
    expect(maxLoanByLtv(6_000_000)).toBe(4_800_000)
    expect(maxLoanByLtv(12_000_000)).toBe(9_000_000)
  })

  it("handles values at the slab edges", () => {
    // 90% of ₹35 lakh breaks the ₹30 lakh slab, 80% falls below it: cap at ₹30 lakh.
    expect(maxLoanByLtv(3_500_000)).toBe(3_000_000)
    // 75% of ₹1 crore = ₹75 lakh, which is the 80% slab's ceiling.
    expect(maxLoanByLtv(10_000_000)).toBe(7_500_000)
  })
})

describe("calculateEligibility", () => {
  const input = { monthlyIncome: 100_000, existingEmis: 10_000, annualRate: 8.5, tenureYears: 20, foirPct: 50 }

  it("derives the loan from the EMI the income can support", () => {
    const r = calculateEligibility(input)!
    expect(r.maxEmi).toBe(40000)
    expect(r.incomeBasedLoan).toBe(4609234)
    expect(r.eligibleLoan).toBe(4609234)
    expect(r.limitedBy).toBe("income")
    expect(r.emiForEligibleLoan).toBeCloseTo(40000, 0)
  })

  it("adds co-applicant income", () => {
    const r = calculateEligibility({ ...input, existingEmis: 0, monthlyIncome: 60_000, coApplicantIncome: 40_000 })!
    expect(r.maxEmi).toBe(50000)
    expect(r.incomeBasedLoan).toBe(5761542)
  })

  it("caps the loan by property value when that is lower", () => {
    const r = calculateEligibility({ ...input, propertyValue: 5_000_000 })!
    expect(r.ltvBasedLoan).toBe(4_000_000)
    expect(r.eligibleLoan).toBe(4_000_000)
    expect(r.limitedBy).toBe("property-value")
    expect(r.downPayment).toBe(1_000_000)
  })

  it("returns zero eligibility when existing EMIs use up the limit", () => {
    const r = calculateEligibility({ ...input, existingEmis: 60_000 })!
    expect(r.maxEmi).toBe(0)
    expect(r.eligibleLoan).toBe(0)
  })

  it("rejects missing income or tenure", () => {
    expect(calculateEligibility({ ...input, monthlyIncome: 0 })).toBeNull()
    expect(calculateEligibility({ ...input, tenureYears: 0 })).toBeNull()
  })
})
