import { describe, it, expect } from "vitest"
import { calculateEmi } from "./engine"

describe("EMI calculator engine", () => {
  it("computes EMI for a standard home loan", () => {
    const r = calculateEmi({ principal: 5000000, annualRate: 8.5, years: 20, months: 0 })
    // P = 50,00,000 at 8.5% over 240 months → EMI ≈ ₹43,391
    expect(r.tenureMonths).toBe(240)
    expect(r.emi).toBeCloseTo(43391, 0)
  })

  it("reconciles principal + interest = total payment", () => {
    const r = calculateEmi({ principal: 2000000, annualRate: 9.5, years: 15, months: 3 })
    const paymentSum = r.schedule.reduce((sum, row) => sum + row.payment, 0)
    const interestSum = r.schedule.reduce((sum, row) => sum + row.interest, 0)
    expect(r.totalPayment).toBeCloseTo(paymentSum, 2)
    expect(interestSum + r.principal).toBeCloseTo(paymentSum, 1)
  })

  it("amortizes the balance to zero", () => {
    const r = calculateEmi({ principal: 750000, annualRate: 12, years: 5, months: 0 })
    const last = r.schedule[r.schedule.length - 1]
    expect(last.balance).toBe(0)
  })

  it("handles a 0% interest rate as equal principal payments", () => {
    const r = calculateEmi({ principal: 120000, annualRate: 0, years: 1, months: 0 })
    expect(r.emi).toBe(10000)
    expect(r.totalInterest).toBe(0)
    expect(r.totalPayment).toBeCloseTo(120000, 2)
  })

  it("handles zero principal", () => {
    const r = calculateEmi({ principal: 0, annualRate: 10, years: 5, months: 0 })
    expect(r.emi).toBe(0)
    expect(r.totalPayment).toBe(0)
    expect(r.schedule).toEqual([])
  })

  it("handles zero tenure", () => {
    const r = calculateEmi({ principal: 100000, annualRate: 10, years: 0, months: 0 })
    expect(r.emi).toBe(0)
    expect(r.schedule).toEqual([])
  })

  it("combines years and months into total tenure", () => {
    const r = calculateEmi({ principal: 100000, annualRate: 12, years: 2, months: 6 })
    expect(r.tenureMonths).toBe(30)
  })

  it("converts annual rate to monthly rate", () => {
    const r = calculateEmi({ principal: 100000, annualRate: 12, years: 1, months: 0 })
    expect(r.monthlyRate).toBeCloseTo(1, 2)
  })

  it("starts the schedule reducing principal immediately", () => {
    const r = calculateEmi({ principal: 1000000, annualRate: 12, years: 2, months: 0 })
    const first = r.schedule[0]
    expect(first.month).toBe(1)
    expect(first.interest).toBeGreaterThan(0)
    expect(first.principal).toBeGreaterThan(0)
    expect(first.payment).toBeCloseTo(r.emi, 2)
  })

  it("produces the same result deterministically", () => {
    const input = { principal: 300000, annualRate: 8, years: 7, months: 4 }
    expect(calculateEmi(input)).toEqual(calculateEmi(input))
  })
})