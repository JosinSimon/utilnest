import { describe, it, expect } from "vitest"
import { calculatePpf } from "./engine"

describe("PPF calculator engine", () => {
  it("grows annual deposits over the maturity period", () => {
    const r = calculatePpf({ annual: 150000, years: 15 })
    expect(r.years).toBe(15)
    expect(r.invested).toBeCloseTo(2250000, 2)
    expect(r.maturityValue).toBeGreaterThan(r.invested)
  })

  it("returns invested amount at zero years", () => {
    const r = calculatePpf({ annual: 100000, years: 0 })
    expect(r.maturityValue).toBe(0)
  })
})