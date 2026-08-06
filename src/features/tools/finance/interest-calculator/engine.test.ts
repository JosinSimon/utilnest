import { describe, it, expect } from "vitest"
import { calculateInterest } from "./engine"

describe("interest calculator engine", () => {
  it("computes simple interest", () => {
    const r = calculateInterest({ principal: 10000, annualRate: 5, years: 3, months: 0, compound: false, frequency: 1 })
    expect(r.interest).toBeCloseTo(1500, 2)
    expect(r.maturityValue).toBeCloseTo(11500, 2)
  })

  it("computes compound interest", () => {
    const r = calculateInterest({ principal: 10000, annualRate: 5, years: 3, months: 0, compound: true, frequency: 1 })
    expect(r.interest).toBeGreaterThan(1500)
    expect(r.maturityValue).toBeCloseTo(11576.25, 2)
  })

  it("grows faster with more frequent compounding", () => {
    const annual = calculateInterest({ principal: 10000, annualRate: 10, years: 2, months: 0, compound: true, frequency: 1 }).maturityValue
    const monthly = calculateInterest({ principal: 10000, annualRate: 10, years: 2, months: 0, compound: true, frequency: 12 }).maturityValue
    expect(monthly).toBeGreaterThan(annual)
  })

  it("returns principal at 0% rate", () => {
    const r = calculateInterest({ principal: 5000, annualRate: 0, years: 5, months: 0, compound: true, frequency: 4 })
    expect(r.maturityValue).toBe(5000)
    expect(r.interest).toBe(0)
  })
})
