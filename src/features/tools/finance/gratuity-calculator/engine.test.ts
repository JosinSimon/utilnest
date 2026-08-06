import { describe, it, expect } from "vitest"
import { calculateGratuity } from "./engine"

describe("gratuity engine", () => {
  it("computes 15/26 of salary per completed year", () => {
    const r = calculateGratuity({ lastBasic: 30000, lastDa: 0, yearsOfService: 10, monthsOfService: 0 })
    // 30000 × 15/26 × 10 = 173076.92
    expect(r.lastMonthlySalary).toBe(30000)
    expect(r.totalYears).toBe(10)
    expect(r.gratuity).toBeCloseTo(173076.92, 2)
  })

  it("rounds 6+ months up to a full year", () => {
    const withSixMonths = calculateGratuity({ lastBasic: 30000, lastDa: 0, yearsOfService: 10, monthsOfService: 6 })
    const withFiveMonths = calculateGratuity({ lastBasic: 30000, lastDa: 0, yearsOfService: 10, monthsOfService: 5 })
    expect(withSixMonths.totalYears).toBe(11)
    expect(withFiveMonths.totalYears).toBe(10)
  })

  it("includes DA in the last drawn salary", () => {
    const withDa = calculateGratuity({ lastBasic: 20000, lastDa: 5000, yearsOfService: 5, monthsOfService: 0 })
    expect(withDa.lastMonthlySalary).toBe(25000)
  })

  it("caps gratuity at ₹20 lakh", () => {
    const r = calculateGratuity({ lastBasic: 300000, lastDa: 0, yearsOfService: 30, monthsOfService: 0 })
    expect(r.capped).toBe(true)
    expect(r.gratuity).toBe(2000000)
  })

  it("handles zero service", () => {
    const r = calculateGratuity({ lastBasic: 30000, lastDa: 0, yearsOfService: 0, monthsOfService: 0 })
    expect(r.gratuity).toBe(0)
  })
})