import { describe, it, expect } from "vitest"
import { calculateHra } from "./engine"

describe("HRA exemption engine", () => {
  it("caps exemption at the lowest of the three components", () => {
    // basic 100000, HRA 40000, rent 45000 (metro)
    const r = calculateHra({ basicSalary: 100000, hraReceived: 40000, rentPaid: 45000, metro: true })
    // actual HRA = 40000; rent - 10% basic = 35000; 50% basic = 50000 → min 35000
    expect(r.exemption).toBe(35000)
    expect(r.taxableHra).toBe(5000)
  })

  it("uses 40% of basic for non-metro cities", () => {
    const metro = calculateHra({ basicSalary: 100000, hraReceived: 60000, rentPaid: 70000, metro: true })
    const nonMetro = calculateHra({ basicSalary: 100000, hraReceived: 60000, rentPaid: 70000, metro: false })
    expect(metro.halfOfBasic).toBe(50000)
    expect(nonMetro.halfOfBasic).toBe(40000)
    expect(metro.exemption).toBeGreaterThan(nonMetro.exemption)
  })

  it("returns zero exemption when rent is less than 10% of basic", () => {
    const r = calculateHra({ basicSalary: 100000, hraReceived: 20000, rentPaid: 8000, metro: true })
    // rent - 10% basic = -2000 → clamped to 0 → exemption 0
    expect(r.exemption).toBe(0)
    expect(r.taxableHra).toBe(20000)
  })

  it("handles zero inputs", () => {
    const r = calculateHra({ basicSalary: 0, hraReceived: 0, rentPaid: 0, metro: true })
    expect(r.exemption).toBe(0)
    expect(r.taxableHra).toBe(0)
  })

  it("produces deterministic results", () => {
    const input = { basicSalary: 75000, hraReceived: 30000, rentPaid: 25000, metro: false }
    expect(calculateHra(input)).toEqual(calculateHra(input))
  })
})