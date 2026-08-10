import { describe, it, expect } from "vitest"
import { discountEngine } from "./engine"

describe("discountEngine", () => {
  it("calculates single discount correctly", () => {
    const result = discountEngine({ original: 2000, discountPct: 20 })
    expect(result.savings).toBe(400)
    expect(result.finalPrice).toBe(1600)
    expect(result.totalDiscountPct).toBe(20)
  })

  it("calculates additive discounts by default (50% + 5% = 55%)", () => {
    const result = discountEngine({ original: 2500, discountPct: 50, additionalDiscountPct: 5 })
    expect(result.totalDiscountPct).toBe(55)
    expect(result.savings).toBe(1375)
    expect(result.finalPrice).toBe(1125)
  })

  it("calculates compound/sequential discounts when specified", () => {
    const result = discountEngine({ original: 2500, discountPct: 50, additionalDiscountPct: 5, mode: "compound" })
    // First pass: 50% of 2500 = 1250 savings -> 1250
    // Second pass: 5% of 1250 = 62.50 savings -> 1187.50
    // Total savings: 1312.50
    expect(result.savings).toBe(1312.50)
    expect(result.finalPrice).toBe(1187.50)
    expect(result.totalDiscountPct).toBe(52.5)
  })
})
