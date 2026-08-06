import { describe, it, expect } from "vitest"
import { calculateFd } from "./engine"

describe("FD calculator engine", () => {
  it("grows a fixed deposit with quarterly compounding", () => {
    const r = calculateFd({ principal: 100000, annualRate: 7, years: 5, months: 0 })
    expect(r.years).toBe(5)
    expect(r.maturityValue).toBeGreaterThan(r.principal)
  })

  it("returns principal at 0% interest", () => {
    const r = calculateFd({ principal: 100000, annualRate: 0, years: 5, months: 0 })
    expect(r.maturityValue).toBe(100000)
  })

  it("returns zero interest on zero principal", () => {
    const r = calculateFd({ principal: 0, annualRate: 7, years: 5, months: 0 })
    expect(r.maturityValue).toBe(0)
  })
})