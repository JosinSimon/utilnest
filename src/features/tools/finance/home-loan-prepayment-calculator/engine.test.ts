import { describe, expect, it } from "vitest"
import { calculatePrepayment } from "./engine"

const base = { principal: 5_000_000, annualRate: 8.5, tenureYears: 20 }

describe("calculatePrepayment", () => {
  it("matches the standard schedule when there is no prepayment", () => {
    const r = calculatePrepayment({ ...base, strategy: "reduce-tenure" })!
    expect(r.original.emi).toBe(43391.16)
    expect(r.original.months).toBe(240)
    expect(r.original.totalInterest).toBeCloseTo(5413878.8, 0)
    expect(r.interestSaved).toBe(0)
    expect(r.monthsSaved).toBe(0)
  })

  it("shortens the loan for a one-time prepayment (reduce tenure)", () => {
    const r = calculatePrepayment({ ...base, lumpSum: 500_000, lumpSumMonth: 36, strategy: "reduce-tenure" })!
    expect(r.withPrepayment.months).toBe(199)
    expect(r.monthsSaved).toBe(41)
    expect(r.interestSaved).toBeCloseTo(1319638.61, 0)
    expect(r.withPrepayment.finalEmi).toBe(43391.16)
    expect(r.withPrepayment.totalPrepaid).toBe(500000)
  })

  it("lowers the EMI and keeps the end date (reduce EMI)", () => {
    const r = calculatePrepayment({ ...base, lumpSum: 500_000, lumpSumMonth: 36, strategy: "reduce-emi" })!
    expect(r.withPrepayment.months).toBe(240)
    expect(r.withPrepayment.finalEmi).toBeCloseTo(38749.7, 1)
    expect(r.interestSaved).toBeCloseTo(446857.94, 0)
  })

  it("handles yearly and monthly prepayments", () => {
    const yearly = calculatePrepayment({ ...base, yearlyPrepayment: 100_000, strategy: "reduce-tenure" })!
    expect(yearly.withPrepayment.months).toBe(168)
    expect(yearly.interestSaved).toBeCloseTo(1855389.33, 0)
    const monthly = calculatePrepayment({ ...base, extraMonthly: 5_000, strategy: "reduce-tenure" })!
    expect(monthly.withPrepayment.months).toBe(187)
    expect(monthly.interestSaved).toBeCloseTo(1389249.71, 0)
  })

  it("never prepays more than the outstanding balance", () => {
    const r = calculatePrepayment({ ...base, lumpSum: 99_000_000, lumpSumMonth: 1, strategy: "reduce-tenure" })!
    expect(r.withPrepayment.months).toBe(1)
    expect(r.withPrepayment.totalPrepaid).toBeLessThan(5_000_000)
  })

  it("rejects empty loans", () => {
    expect(calculatePrepayment({ ...base, principal: 0, strategy: "reduce-tenure" })).toBeNull()
    expect(calculatePrepayment({ ...base, tenureYears: 0, strategy: "reduce-tenure" })).toBeNull()
  })
})
