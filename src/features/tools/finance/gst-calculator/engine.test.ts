import { describe, it, expect } from "vitest"
import { calculateGst, GstRates } from "./engine"

describe("GST calculator engine", () => {
  it("adds GST to an exclusive amount", () => {
    const r = calculateGst({ amount: 10000, rate: 18, inclusive: false })
    expect(r.base).toBeCloseTo(10000, 2)
    expect(r.gstAmount).toBeCloseTo(1800, 2)
    expect(r.total).toBeCloseTo(11800, 2)
    expect(r.rate).toBe(18)
  })

  it("extracts GST from an inclusive amount", () => {
    const r = calculateGst({ amount: 11800, rate: 18, inclusive: true })
    expect(r.base).toBeCloseTo(10000, 2)
    expect(r.gstAmount).toBeCloseTo(1800, 2)
    expect(r.total).toBeCloseTo(11800, 2)
  })

  it("splits GST into equal CGST + SGST for intra-state sales", () => {
    const r = calculateGst({ amount: 1000, rate: 12, inclusive: false })
    expect(r.cgst).toBeCloseTo(60, 2)
    expect(r.sgst).toBeCloseTo(60, 2)
    expect(r.igst).toBeCloseTo(0, 2)
    expect(r.cgst + r.sgst + r.igst).toBeCloseTo(120, 2)
  })

  it("charges IGST for inter-state sales", () => {
    const r = calculateGst({ amount: 1000, rate: 12, inclusive: false, interState: true })
    expect(r.cgst).toBeCloseTo(0, 2)
    expect(r.sgst).toBeCloseTo(0, 2)
    expect(r.igst).toBeCloseTo(120, 2)
  })

  it("returns zero tax at 0% rate", () => {
    const r = calculateGst({ amount: 500, rate: 0, inclusive: false })
    expect(r.gstAmount).toBeCloseTo(0, 2)
    expect(r.total).toBeCloseTo(500, 2)
  })

  it("exposes the standard slab rates", () => {
    expect(GstRates).toEqual([0, 3, 5, 12, 18, 28])
  })
})