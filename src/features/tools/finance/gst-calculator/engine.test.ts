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

  it("splits an odd GST paisa deterministically into CGST + SGST", () => {
    // ₹15,000 @ 28% inclusive → GST ₹3,281.25, exact half ₹1,640.625
    const r = calculateGst({ amount: 15000, rate: 28, inclusive: true })
    expect(r.base).toBeCloseTo(11718.75, 2)
    expect(r.gstAmount).toBeCloseTo(3281.25, 2)
    expect(r.total).toBeCloseTo(15000, 2)
    // odd paisa must go to SGST so the split sums exactly to the GST amount
    expect(r.cgst).toBeCloseTo(1640.62, 2)
    expect(r.sgst).toBeCloseTo(1640.63, 2)
    expect(r.cgst + r.sgst).toBeCloseTo(r.gstAmount, 2)
  })

  it("keeps base + GST === total to the paisa on repeating decimals", () => {
    // ₹10,000 @ 3% inclusive → base is a repeating decimal
    const r = calculateGst({ amount: 10000, rate: 3, inclusive: true })
    expect(Math.round(r.base * 100)).toBe(970874)
    expect(Math.round(r.gstAmount * 100)).toBe(29126)
    expect(Math.round((r.base + r.gstAmount) * 100)).toBe(1000000)
    expect(Math.round((r.cgst + r.sgst) * 100)).toBe(Math.round(r.gstAmount * 100))
  })

  it("reconciles to the paisa across amounts, rates and modes", () => {
    const paise = (v: number) => Math.round(v * 100)
    const amounts = [0, 0.01, 1, 99.99, 100, 500, 1000, 11800, 15000, 12345.67, 999999.99]
    for (const amount of amounts) {
      for (const rate of [...GstRates, 7, 25]) {
        for (const inclusive of [false, true]) {
          for (const interState of [false, true]) {
            const r = calculateGst({ amount, rate, inclusive, interState })
            expect(paise(r.base) + paise(r.gstAmount)).toBe(paise(r.total))
            expect(paise(r.cgst) + paise(r.sgst) + paise(r.igst)).toBe(
              paise(r.gstAmount),
            )
            if (interState) {
              expect(r.cgst).toBe(0)
              expect(r.sgst).toBe(0)
              expect(paise(r.igst)).toBe(paise(r.gstAmount))
            }
          }
        }
      }
    }
  })

  it("exposes the standard slab rates", () => {
    expect(GstRates).toEqual([0, 3, 5, 12, 18, 28])
  })
})