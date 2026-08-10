import { describe, it, expect } from "vitest"
import { markupEngine } from "./engine"

describe("markupEngine", () => {
  it("calculates cost to price correctly", () => {
    const result = markupEngine({ mode: "costToPrice", cost: 800, markupPct: 25 })
    expect(result.sell).toBe(1000)
    expect(result.markupPct).toBe(25)
    expect(result.marginPct).toBe(20)
    expect(result.profit).toBe(200)
  })

  it("calculates find markup correctly", () => {
    const result = markupEngine({ mode: "findMarkup", cost: 800, sell: 1000 })
    expect(result.sell).toBe(1000)
    expect(result.markupPct).toBe(25)
    expect(result.marginPct).toBe(20)
    expect(result.profit).toBe(200)
  })
})
