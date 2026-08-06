import { describe, it, expect } from "vitest"
import { calculateSip } from "./engine"

/**
 * Exact money invariant: Total Invested + Estimated Return = Maturity Value,
 * verified in integer paise. Floating point cannot represent every 2-decimal
 * sum exactly, so we compare rounded paise integers — the same exact-money
 * approach the GST and PPF engines use.
 */
function expectLedgerBalances(
  invested: number,
  expectedReturn: number,
  maturityValue: number,
): void {
  expect(Math.round(invested * 100) + Math.round(expectedReturn * 100)).toBe(
    Math.round(maturityValue * 100),
  )
  expect(expectedReturn).toBeGreaterThanOrEqual(0)
}

describe("SIP calculator engine", () => {
  describe("matches standard Indian SIP convention (annuity-due, annual÷12)", () => {
    // References computed with FV = P × ((1+r)^n − 1)/r × (1+r), r = annual/12,
    // n = years×12 + months — the simple monthly-rate, deposit-at-start-of-month
    // convention used by AMFI and most Indian calculators. 12,809.33 is the
    // published figure for ₹1,000/month at 12% for 1 year; 99,91,479.19 is the
    // published ₹10,000/month at 12% for 20 years.
    it.each([
      { monthly: 1000, annualRate: 12, years: 1, months: 0, maturity: 12809.33, invested: 12000 },
      { monthly: 10000, annualRate: 12, years: 20, months: 0, maturity: 9991479.19, invested: 2400000 },
      { monthly: 1000, annualRate: 12, years: 5, months: 0, maturity: 82486.37, invested: 60000 },
      { monthly: 1000, annualRate: 12, years: 10, months: 0, maturity: 232339.08, invested: 120000 },
      { monthly: 1000, annualRate: 12, years: 15, months: 0, maturity: 504576, invested: 180000 },
      { monthly: 1000, annualRate: 12, years: 20, months: 0, maturity: 999147.92, invested: 240000 },
      { monthly: 500, annualRate: 12, years: 30, months: 0, maturity: 1764956.89, invested: 180000 },
    ])(
      "₹$monthly/month at $annualRate% for $years y $months m → ₹$maturity",
      ({ monthly, annualRate, years, months, maturity, invested }) => {
        const r = calculateSip({ monthly, annualRate, years, months })
        expect(r.maturityValue).toBeCloseTo(maturity, 2)
        expect(r.invested).toBeCloseTo(invested, 2)
        expectLedgerBalances(r.invested, r.expectedReturn, r.maturityValue)
      },
    )
  })

  describe("handles fractional tenures via years×12 + months", () => {
    it.each([
      { monthly: 2000, annualRate: 10.25, years: 7, months: 6, maturity: 271577.19 }, // 90 months
      { monthly: 5000, annualRate: 15, years: 10, months: 3, maturity: 1461568.56 }, // 123 months
      { monthly: 1500, annualRate: 8.5, years: 0, months: 7, maturity: 10801.75 },
      { monthly: 777, annualRate: 7.75, years: 4, months: 4, maturity: 48143.56 }, // 52 months
      { monthly: 12345, annualRate: 9.4, years: 1, months: 11, maturity: 312223.15 }, // 23 months
      { monthly: 830, annualRate: 6.5, years: 25, months: 0, maturity: 624900.96 }, // 300 months
      { monthly: 4400, annualRate: 11.8, years: 0, months: 6, maturity: 27323.64 },
      { monthly: 925, annualRate: 14.2, years: 3, months: 3, maturity: 46045.35 }, // 39 months
      { monthly: 60, annualRate: 5.6, years: 0, months: 11, maturity: 678.77 },
      { monthly: 50000, annualRate: 10, years: 0, months: 12, maturity: 633514.06 },
    ])(
      "₹$monthly/month at $annualRate% for $years y $months m → ₹$maturity",
      ({ monthly, annualRate, years, months, maturity }) => {
        const r = calculateSip({ monthly, annualRate, years, months })
        expect(r.maturityValue).toBeCloseTo(maturity, 2)
        expect(r.months).toBe(years * 12 + months)
        expectLedgerBalances(r.invested, r.expectedReturn, r.maturityValue)
      },
    )
  })

  describe("edge cases and inputs", () => {
    it("compounds a single month", () => {
      const r = calculateSip({ monthly: 1000, annualRate: 12, years: 0, months: 1 })
      expect(r.months).toBe(1)
      expect(r.maturityValue).toBeCloseTo(1010, 2)
      expectLedgerBalances(r.invested, r.expectedReturn, r.maturityValue)
    })

    it("handles a 3-month SIP", () => {
      const r = calculateSip({ monthly: 1000, annualRate: 12, years: 0, months: 3 })
      expect(r.maturityValue).toBeCloseTo(3060.4, 2)
      expectLedgerBalances(r.invested, r.expectedReturn, r.maturityValue)
    })

    it("returns invested amount at 0% growth", () => {
      const r = calculateSip({ monthly: 5000, annualRate: 0, years: 5, months: 0 })
      expect(r.maturityValue).toBeCloseTo(300000, 2)
      expect(r.expectedReturn).toBe(0)
      expectLedgerBalances(r.invested, r.expectedReturn, r.maturityValue)
    })

    it("handles decimal interest rates", () => {
      const r = calculateSip({ monthly: 2000, annualRate: 10.25, years: 7, months: 6 })
      expect(r.annualRate).toBe(10.25)
      expectLedgerBalances(r.invested, r.expectedReturn, r.maturityValue)
    })

    it("handles a non-integer monthly investment", () => {
      const r = calculateSip({ monthly: 1234.56, annualRate: 12, years: 2, months: 0 })
      expect(r.invested).toBeCloseTo(1234.56 * 24, 2)
      expectLedgerBalances(r.invested, r.expectedReturn, r.maturityValue)
    })

    it("handles zero monthly investment", () => {
      const r = calculateSip({ monthly: 0, annualRate: 12, years: 5, months: 0 })
      expect(r.invested).toBe(0)
      expect(r.maturityValue).toBe(0)
      expect(r.expectedReturn).toBe(0)
    })

    it("handles zero tenure", () => {
      const r = calculateSip({ monthly: 1000, annualRate: 12, years: 0, months: 0 })
      expect(r.invested).toBe(0)
      expect(r.maturityValue).toBe(0)
      expect(r.expectedReturn).toBe(0)
    })

    it("combines years and months", () => {
      const r = calculateSip({ monthly: 1000, annualRate: 12, years: 2, months: 6 })
      expect(r.months).toBe(30)
      expectLedgerBalances(r.invested, r.expectedReturn, r.maturityValue)
    })

    it("floors fractional years and months instead of using decimal years", () => {
      const r = calculateSip({ monthly: 1000, annualRate: 12, years: 2.9, months: 0.5 })
      expect(r.months).toBe(24)
      expectLedgerBalances(r.invested, r.expectedReturn, r.maturityValue)
    })

    it("clamps negative inputs to zero", () => {
      const r = calculateSip({ monthly: -100, annualRate: -5, years: -1, months: -2 })
      expect(r.monthly).toBe(0)
      expect(r.annualRate).toBe(0)
      expect(r.months).toBe(0)
      expect(r.maturityValue).toBe(0)
    })

    it("produces deterministic results", () => {
      const input = { monthly: 25000, annualRate: 15, years: 20, months: 3 }
      expect(calculateSip(input)).toEqual(calculateSip(input))
    })
  })

  describe("rate convention: annual ÷ 12, not compounded monthly rate", () => {
    it("uses the simple monthly rate (1% for a 12% annual return)", () => {
      // The compounded geometric monthly rate would give ₹12,766 for this case;
      // the simple annual÷12 convention gives ₹12,809.33, which this engine uses.
      const r = calculateSip({ monthly: 1000, annualRate: 12, years: 1, months: 0 })
      expect(r.maturityValue).toBeCloseTo(12809.33, 2)
      expect(r.maturityValue).toBeGreaterThan(12766)
    })
  })

  describe("regression: invested + return always equals maturity", () => {
    it("keeps the ledger balanced across rates, tenures and amounts", () => {
      const rates = [0, 5.5, 8, 10.25, 12, 15.75]
      const monthCounts = [1, 2, 3, 6, 7, 11, 12, 23, 30, 31, 36, 65, 92, 120, 300, 360]
      const amounts = [1, 60, 100, 500, 1234.56, 10000, 150000]
      for (const annualRate of rates) {
        for (const months of monthCounts) {
          for (const monthly of amounts) {
            const r = calculateSip({ monthly, annualRate, years: 0, months })
            expectLedgerBalances(r.invested, r.expectedReturn, r.maturityValue)
          }
        }
      }
    })

    it("keeps the ledger balanced for a large amount and tenure", () => {
      const r = calculateSip({ monthly: 100000, annualRate: 12, years: 30, months: 0 })
      expectLedgerBalances(r.invested, r.expectedReturn, r.maturityValue)
      expect(r.invested).toBeCloseTo(36000000, 2)
      expect(r.maturityValue).toBeGreaterThan(r.invested)
    })
  })
})
