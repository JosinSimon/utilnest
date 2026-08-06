import { describe, it, expect } from "vitest"
import { calculateRd } from "./engine"

describe("RD calculator engine", () => {
  it("grows a monthly RD with quarterly compounding", () => {
    const r = calculateRd({ monthly: 5000, annualRate: 7, years: 5, months: 0 })
    expect(r.months).toBe(60)
    expect(r.invested).toBeCloseTo(300000, 2)
    expect(r.maturityValue).toBeGreaterThan(r.invested)
  })

  it("returns invested amount at 0% interest", () => {
    const r = calculateRd({ monthly: 2000, annualRate: 0, years: 3, months: 0 })
    expect(r.maturityValue).toBeCloseTo(72000, 2)
    expect(r.interest).toBe(0)
  })

  it("handles zero monthly deposit", () => {
    const r = calculateRd({ monthly: 0, annualRate: 7, years: 5, months: 0 })
    expect(r.invested).toBe(0)
    expect(r.maturityValue).toBe(0)
  })

  it("handles zero tenure", () => {
    const r = calculateRd({ monthly: 1000, annualRate: 7, years: 0, months: 0 })
    expect(r.months).toBe(0)
    expect(r.maturityValue).toBe(0)
  })

  it("combines years and months", () => {
    const r = calculateRd({ monthly: 1000, annualRate: 7, years: 2, months: 6 })
    expect(r.months).toBe(30)
  })
})
