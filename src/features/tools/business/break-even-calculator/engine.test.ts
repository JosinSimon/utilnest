import { describe, it, expect } from "vitest"
import { breakEvenEngine } from "./engine"

describe("breakEvenEngine", () => {
  it("calculates break-even correctly", () => {
    const result = breakEvenEngine({ fixedCosts: 50000, variableCostPerUnit: 100, sellingPricePerUnit: 200 })
    expect(result.isValid).toBe(true)
    expect(result.contributionPerUnit).toBe(100)
    expect(result.breakEvenUnits).toBe(500)
    expect(result.breakEvenRevenue).toBe(100000)
  })

  it("handles invalid inputs (no contribution)", () => {
    const result = breakEvenEngine({ fixedCosts: 50000, variableCostPerUnit: 200, sellingPricePerUnit: 150 })
    expect(result.isValid).toBe(false)
    expect(result.contributionPerUnit).toBe(-50)
  })

  it("calculates planned profit correctly", () => {
    const result = breakEvenEngine({ fixedCosts: 50000, variableCostPerUnit: 100, sellingPricePerUnit: 200, plannedUnits: 1000 })
    expect(result.isValid).toBe(true)
    expect(result.plannedProfit).toBe(50000) // (100 * 1000) - 50000 = 50000
  })
})
