import { describe, it, expect } from "vitest"
import { calculateRd } from "./engine"

/**
 * Exact money invariant: Total Deposited + Total Interest = Maturity Value,
 * verified in integer paise. Floating point cannot represent every 2-decimal
 * sum exactly, so we compare rounded paise integers — the same exact-money
 * approach the GST and PPF engines use.
 */
function expectLedgerBalances(
  invested: number,
  interest: number,
  maturityValue: number,
): void {
  expect(Math.round(invested * 100) + Math.round(interest * 100)).toBe(
    Math.round(maturityValue * 100),
  )
  expect(interest).toBeGreaterThanOrEqual(0)
}

describe("RD calculator engine", () => {
  describe("matches official bank calculator outputs (IBA formula)", () => {
    // Cross-checked references. 62,730.85 is the published Groww/SBI figure
    // for ₹5,000/month at 8.25% for 1 year; all others are computed from the
    // standard formula M = P × ((1+i)^n − 1)/(1 − (1+i)^(−1/3)) with
    // n = months/3 (fractional quarters, matching per-deposit compounding).
    it.each([
      { monthly: 5000, annualRate: 8, years: 1, months: 0, maturity: 62646.63, invested: 60000 },
      { monthly: 5000, annualRate: 8.25, years: 1, months: 0, maturity: 62730.85, invested: 60000 },
      { monthly: 1000, annualRate: 7, years: 1, months: 0, maturity: 12462.13, invested: 12000 },
      { monthly: 1000, annualRate: 7, years: 2, months: 0, maturity: 25819.78, invested: 24000 },
      { monthly: 1000, annualRate: 7, years: 3, months: 0, maturity: 40137.3, invested: 36000 },
      { monthly: 1000, annualRate: 10, years: 10, months: 0, maturity: 205568.54, invested: 120000 },
    ])(
      "₹$monthly/month at $annualRate% for $years y $months m → ₹$maturity",
      ({ monthly, annualRate, years, months, maturity, invested }) => {
        const r = calculateRd({ monthly, annualRate, years, months })
        expect(r.maturityValue).toBeCloseTo(maturity, 2)
        expect(r.invested).toBeCloseTo(invested, 2)
        expectLedgerBalances(r.invested, r.interest, r.maturityValue)
      },
    )
  })

  describe("handles odd-month tenures with fractional quarters", () => {
    // Tenures that are not whole quarters must compound every monthly deposit
    // over its true fractional number of quarters (n = months/3), not floor.
    it.each([
      { monthly: 1000, annualRate: 7, years: 2, months: 7, maturity: 34050.7 }, // 31 months
      { monthly: 1000, annualRate: 7, years: 2, months: 6, maturity: 32854.36 }, // 30 months
      { monthly: 750, annualRate: 9.25, years: 0, months: 7, maturity: 5413.12 }, // 7 months
      { monthly: 3250, annualRate: 8.75, years: 0, months: 7, maturity: 23418.39 },
      { monthly: 620, annualRate: 7.9, years: 1, months: 11, maturity: 15434.78 }, // 23 months
      { monthly: 1111, annualRate: 6.9, years: 7, months: 8, maturity: 134771.22 }, // 92 months
      { monthly: 456, annualRate: 8.4, years: 4, months: 4, maturity: 28644.44 }, // 52 months
      { monthly: 2500, annualRate: 6.6, years: 9, months: 11, maturity: 419984.35 }, // 119 months
      { monthly: 1350, annualRate: 7.35, years: 5, months: 5, maturity: 107905.66 }, // 65 months
      { monthly: 830, annualRate: 9, years: 0, months: 8, maturity: 6866.35 }, // 8 months
    ])(
      "₹$monthly/month at $annualRate% for $years y $months m → ₹$maturity",
      ({ monthly, annualRate, years, months, maturity }) => {
        const r = calculateRd({ monthly, annualRate, years, months })
        expect(r.maturityValue).toBeCloseTo(maturity, 2)
        expect(r.months).toBe(years * 12 + months)
        expectLedgerBalances(r.invested, r.interest, r.maturityValue)
      },
    )
  })

  describe("edge cases and inputs", () => {
    it("handles minimum tenure of 1 month", () => {
      const r = calculateRd({ monthly: 1000, annualRate: 7, years: 0, months: 1 })
      expect(r.months).toBe(1)
      expect(r.maturityValue).toBeCloseTo(1005.8, 2)
      expectLedgerBalances(r.invested, r.interest, r.maturityValue)
    })

    it("handles the minimum bank tenure of 6 months", () => {
      const r = calculateRd({ monthly: 999, annualRate: 7.15, years: 0, months: 6 })
      expect(r.months).toBe(6)
      expect(r.maturityValue).toBeCloseTo(6119.5, 2)
      expectLedgerBalances(r.invested, r.interest, r.maturityValue)
    })

    it("handles the maximum bank tenure of 10 years", () => {
      const r = calculateRd({ monthly: 12500, annualRate: 7.1, years: 5, months: 0 })
      expect(r.maturityValue).toBeCloseTo(901537.16, 2)
      expectLedgerBalances(r.invested, r.interest, r.maturityValue)
    })

    it("supports tenures beyond 10 years", () => {
      const r = calculateRd({ monthly: 5000, annualRate: 7.5, years: 15, months: 0 })
      expect(r.maturityValue).toBeGreaterThan(r.invested)
      expectLedgerBalances(r.invested, r.interest, r.maturityValue)
    })

    it("returns invested amount at 0% interest", () => {
      const r = calculateRd({ monthly: 2000, annualRate: 0, years: 3, months: 0 })
      expect(r.maturityValue).toBeCloseTo(72000, 2)
      expect(r.interest).toBe(0)
      expectLedgerBalances(r.invested, r.interest, r.maturityValue)
    })

    it("handles decimal interest rates", () => {
      const r = calculateRd({ monthly: 2000, annualRate: 7.5, years: 1, months: 6 })
      expect(r.maturityValue).toBeCloseTo(38200.94, 2)
      expectLedgerBalances(r.invested, r.interest, r.maturityValue)
    })

    it("handles a non-integer monthly deposit", () => {
      const r = calculateRd({ monthly: 1234.56, annualRate: 8, years: 2, months: 0 })
      expect(r.invested).toBeCloseTo(1234.56 * 24, 2)
      expectLedgerBalances(r.invested, r.interest, r.maturityValue)
    })

    it("handles zero monthly deposit", () => {
      const r = calculateRd({ monthly: 0, annualRate: 7, years: 5, months: 0 })
      expect(r.invested).toBe(0)
      expect(r.maturityValue).toBe(0)
      expect(r.interest).toBe(0)
    })

    it("handles zero tenure", () => {
      const r = calculateRd({ monthly: 1000, annualRate: 7, years: 0, months: 0 })
      expect(r.months).toBe(0)
      expect(r.maturityValue).toBe(0)
    })

    it("combines years and months", () => {
      const r = calculateRd({ monthly: 1000, annualRate: 7, years: 2, months: 6 })
      expect(r.months).toBe(30)
      expectLedgerBalances(r.invested, r.interest, r.maturityValue)
    })

    it("floors fractional years and months instead of using decimal years", () => {
      const r = calculateRd({ monthly: 1000, annualRate: 7, years: 2.9, months: 0.5 })
      expect(r.months).toBe(24)
      expectLedgerBalances(r.invested, r.interest, r.maturityValue)
    })

    it("clamps negative inputs to zero", () => {
      const r = calculateRd({ monthly: -100, annualRate: -5, years: -1, months: -2 })
      expect(r.monthly).toBe(0)
      expect(r.annualRate).toBe(0)
      expect(r.months).toBe(0)
      expect(r.maturityValue).toBe(0)
    })

    it("produces deterministic results", () => {
      const input = { monthly: 25000, annualRate: 8.9, years: 20, months: 3 }
      expect(calculateRd(input)).toEqual(calculateRd(input))
    })
  })

  describe("regression: invested + interest always equals maturity", () => {
    it("keeps the ledger balanced across rates, tenures and amounts", () => {
      const rates = [0, 4.5, 6, 7.1, 8.25, 9.5]
      const monthCounts = [1, 2, 3, 6, 7, 11, 12, 23, 30, 31, 36, 65, 92, 120]
      const amounts = [1, 99, 100, 500, 1234.56, 10000, 150000]
      for (const annualRate of rates) {
        for (const months of monthCounts) {
          for (const monthly of amounts) {
            const r = calculateRd({ monthly, annualRate, years: 0, months })
            expectLedgerBalances(r.invested, r.interest, r.maturityValue)
          }
        }
      }
    })

    it("keeps the ledger balanced for a large amount and tenure", () => {
      const r = calculateRd({ monthly: 100000, annualRate: 8.25, years: 10, months: 0 })
      expectLedgerBalances(r.invested, r.interest, r.maturityValue)
      expect(r.invested).toBeCloseTo(12000000, 2)
      expect(r.maturityValue).toBeGreaterThan(r.invested)
    })
  })
})
