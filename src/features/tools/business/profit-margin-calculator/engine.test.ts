import { describe, it, expect } from "vitest"
import { profitMarginEngine } from "./engine"

describe("profitMarginEngine", () => {
  it("calculates profit margin correctly", () => {
    const result = profitMarginEngine({ cost: 800, sell: 1000 })
    expect(result.profit).toBe(200)
    expect(result.margin).toBe(20)
    expect(result.markup).toBe(25)
  })

  it("handles loss correctly", () => {
    const result = profitMarginEngine({ cost: 1000, sell: 800 })
    expect(result.profit).toBe(-200)
    expect(result.margin).toBe(-25) // -200 / 800 = -25%
    expect(result.markup).toBe(-20) // -200 / 1000 = -20%
  })
})
