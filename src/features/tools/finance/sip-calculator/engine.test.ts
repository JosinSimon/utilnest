import { describe, it, expect } from "vitest"
import { calculateSip } from "./engine"

describe("SIP calculator engine", () => {
  it("grows a monthly SIP at the expected return", () => {
    const r = calculateSip({ monthly: 10000, annualRate: 12, years: 10, months: 0 })
    expect(r.months).toBe(120)
    expect(r.invested).toBeCloseTo(1200000, 2)
    expect(r.maturityValue).toBeGreaterThan(r.invested)
    expect(r.expectedReturn).toBeCloseTo(r.maturityValue - r.invested, 2)
  })

  it("returns invested amount at 0% growth", () => {
    const r = calculateSip({ monthly: 5000, annualRate: 0, years: 5, months: 0 })
    expect(r.maturityValue).toBeCloseTo(300000, 2)
    expect(r.expectedReturn).toBe(0)
  })

  it("handles zero monthly investment", () => {
    const r = calculateSip({ monthly: 0, annualRate: 12, years: 5, months: 0 })
    expect(r.invested).toBe(0)
    expect(r.maturityValue).toBe(0)
  })

  it("handles zero tenure", () => {
    const r = calculateSip({ monthly: 1000, annualRate: 12, years: 0, months: 0 })
    expect(r.invested).toBe(0)
    expect(r.maturityValue).toBe(0)
  })

  it("combines years and months", () => {
    const r = calculateSip({ monthly: 1000, annualRate: 12, years: 2, months: 6 })
    expect(r.months).toBe(30)
  })

  it("produces deterministic results", () => {
    const input = { monthly: 25000, annualRate: 15, years: 20, months: 3 }
    expect(calculateSip(input)).toEqual(calculateSip(input))
  })
})
