import { describe, it, expect } from "vitest"
import { calculatePpf } from "./engine"
import { PPF_CONFIG } from "./config"

/**
 * Exact money invariant: Total Deposited + Total Interest = Maturity Value,
 * verified in integer paise. Floating point cannot represent every 2-decimal
 * sum exactly, so we compare rounded paise integers — the same exact-money
 * approach the GST engine uses.
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

describe("PPF calculator engine", () => {
  it("grows annual deposits over the 15-year maturity period", () => {
    const r = calculatePpf({ annual: 150000, years: 15 })
    expect(r.years).toBe(15)
    expect(r.invested).toBeCloseTo(2250000, 2)
    expect(r.maturityValue).toBeGreaterThan(r.invested)
    expectLedgerBalances(r.invested, r.interest, r.maturityValue)
    expect(r.warnings).toHaveLength(0)
  })

  it("accepts the minimum deposit of ₹500", () => {
    const r = calculatePpf({ annual: PPF_CONFIG.minDeposit, years: 15 })
    expect(r.annual).toBe(PPF_CONFIG.minDeposit)
    expect(r.invested).toBeCloseTo(500 * 15, 2)
    expectLedgerBalances(r.invested, r.interest, r.maturityValue)
  })

  it("caps deposits above ₹1,50,000 at the official maximum and warns", () => {
    const r = calculatePpf({ annual: 300000, years: 15 })
    expect(r.annual).toBe(150000)
    expect(r.invested).toBeCloseTo(150000 * 15, 2)
    expect(r.warnings).toHaveLength(1)
    expect(r.warnings[0]).toMatch(/1,50,000/)
    expectLedgerBalances(r.invested, r.interest, r.maturityValue)
  })

  it("treats exactly ₹1,50,000 as valid with no warning", () => {
    const r = calculatePpf({ annual: 150000, years: 15 })
    expect(r.annual).toBe(150000)
    expect(r.warnings).toHaveLength(0)
  })

  it("supports extension blocks at 20, 25 and 30 years", () => {
    for (const years of [20, 25, 30]) {
      const r = calculatePpf({ annual: 150000, years })
      expect(r.years).toBe(years)
      expect(r.invested).toBeCloseTo(150000 * years, 2)
      expect(r.maturityValue).toBeGreaterThan(r.invested)
      expectLedgerBalances(r.invested, r.interest, r.maturityValue)
    }
  })

  it("returns zero at a zero deposit", () => {
    const r = calculatePpf({ annual: 0, years: 15 })
    expect(r.invested).toBe(0)
    expect(r.interest).toBe(0)
    expect(r.maturityValue).toBe(0)
    expectLedgerBalances(r.invested, r.interest, r.maturityValue)
  })

  it("returns zero at zero years", () => {
    const r = calculatePpf({ annual: 100000, years: 0 })
    expect(r.maturityValue).toBe(0)
    expect(r.interest).toBe(0)
    expectLedgerBalances(r.invested, r.interest, r.maturityValue)
  })

  it("warns when the horizon is below the 15-year lock-in", () => {
    const r = calculatePpf({ annual: 50000, years: 5 })
    expect(r.warnings).toHaveLength(1)
    expect(r.warnings[0]).toMatch(/15-year lock-in/i)
    expect(r.maturityValue).toBeGreaterThan(r.invested)
  })

  it("compounds at a different supplied rate", () => {
    const at7 = calculatePpf({ annual: 100000, years: 15 })
    const at8 = calculatePpf({ annual: 100000, years: 15, annualRate: 8 })
    expect(at8.annualRate).toBe(8)
    expect(at8.maturityValue).toBeGreaterThan(at7.maturityValue)
    expectLedgerBalances(at8.invested, at8.interest, at8.maturityValue)
  })

  it("treats interest as zero when the rate is zero", () => {
    const r = calculatePpf({ annual: 100000, years: 15, annualRate: 0 })
    expect(r.interest).toBe(0)
    expect(r.maturityValue).toBe(r.invested)
    expectLedgerBalances(r.invested, r.interest, r.maturityValue)
  })

  it("uses the configured default rate when none is supplied", () => {
    const r = calculatePpf({ annual: 50000, years: 15 })
    expect(r.annualRate).toBe(PPF_CONFIG.annualRatePct)
  })

  it("keeps the ledger balanced for every rate and tenure combination", () => {
    for (const annualRate of [6, 7.1, 7.9, 8.2]) {
      for (const years of [0, 5, 15, 20, 25, 30]) {
        const r = calculatePpf({ annual: 97750, years, annualRate })
        expectLedgerBalances(r.invested, r.interest, r.maturityValue)
      }
    }
  })
})