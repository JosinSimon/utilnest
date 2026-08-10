import { describe, it, expect } from "vitest"
import {
  calculateProfit,
  calculateDiscount,
  sellingPriceFromMarkup,
  markupFromPrices,
  calculateBreakEven,
  calculateCommission,
  calculateSalaryHike,
} from "./pricing"

// ── Helper ────────────────────────────────────────────────────────────────────
const r2 = (v: number) => Math.round(v * 100) / 100

// ── calculateProfit ───────────────────────────────────────────────────────────
describe("calculateProfit", () => {
  it("computes profit, margin and markup correctly", () => {
    const r = calculateProfit(800, 1000)
    expect(r.profit).toBeCloseTo(200, 2)
    expect(r.margin).toBeCloseTo(20, 2)   // 200/1000 × 100
    expect(r.markup).toBeCloseTo(25, 2)   // 200/800  × 100
  })

  it("profit = sellingPrice − costPrice invariant", () => {
    const cases = [[0, 0], [100, 150], [999.99, 1200], [5000, 5000], [1000, 800]]
    for (const [c, s] of cases) {
      const r = calculateProfit(c, s)
      expect(r2(r.profit)).toBe(r2(s - c))
    }
  })

  it("margin = profit / sellingPrice × 100 invariant", () => {
    const r = calculateProfit(400, 500)
    expect(r2(r.margin)).toBe(r2((r.profit / r.sellingPrice) * 100))
  })

  it("markup = profit / costPrice × 100 invariant", () => {
    const r = calculateProfit(400, 500)
    expect(r2(r.markup)).toBe(r2((r.profit / r.costPrice) * 100))
  })

  it("zero cost returns 0 markup (no divide-by-zero)", () => {
    const r = calculateProfit(0, 100)
    expect(r.markup).toBe(0)
  })

  it("zero selling price returns 0 margin (no divide-by-zero)", () => {
    const r = calculateProfit(100, 0)
    expect(r.margin).toBe(0)
  })

  it("loss scenario — negative profit", () => {
    const r = calculateProfit(1000, 800)
    expect(r.profit).toBeCloseTo(-200, 2)
    expect(r.margin).toBeLessThan(0)
    expect(r.markup).toBeLessThan(0)
  })

  it("same cost and sell → zero profit, margin, markup", () => {
    const r = calculateProfit(500, 500)
    expect(r.profit).toBe(0)
    expect(r.margin).toBe(0)
    expect(r.markup).toBe(0)
  })
})

// ── calculateDiscount ─────────────────────────────────────────────────────────
describe("calculateDiscount", () => {
  it("computes savings and final price", () => {
    const r = calculateDiscount(2000, 20)
    expect(r.savings).toBeCloseTo(400, 2)
    expect(r.finalPrice).toBeCloseTo(1600, 2)
  })

  it("finalPrice = originalPrice − savings invariant", () => {
    const cases = [[1000, 10], [5000, 0], [999.99, 33.33], [100, 100]]
    for (const [p, d] of cases) {
      const r = calculateDiscount(p, d)
      expect(r2(r.finalPrice)).toBe(r2(r.originalPrice - r.savings))
    }
  })

  it("0% discount returns unchanged price and zero savings", () => {
    const r = calculateDiscount(1500, 0)
    expect(r.savings).toBe(0)
    expect(r.finalPrice).toBeCloseTo(1500, 2)
  })

  it("100% discount → final price zero", () => {
    const r = calculateDiscount(1000, 100)
    expect(r.finalPrice).toBeCloseTo(0, 2)
    expect(r.savings).toBeCloseTo(1000, 2)
  })
})

// ── Markup helpers ────────────────────────────────────────────────────────────
describe("sellingPriceFromMarkup", () => {
  it("computes selling price from cost + markup%", () => {
    expect(sellingPriceFromMarkup(800, 25)).toBeCloseTo(1000, 2)
    expect(sellingPriceFromMarkup(100, 0)).toBeCloseTo(100, 2)
    expect(sellingPriceFromMarkup(1000, 50)).toBeCloseTo(1500, 2)
  })
})

describe("markupFromPrices", () => {
  it("computes markup% from cost + sell", () => {
    expect(markupFromPrices(800, 1000)).toBeCloseTo(25, 2)
    expect(markupFromPrices(400, 500)).toBeCloseTo(25, 2)
  })

  it("zero cost returns 0 (no divide-by-zero)", () => {
    expect(markupFromPrices(0, 1000)).toBe(0)
  })

  it("is the inverse of sellingPriceFromMarkup", () => {
    const cost = 600
    const markup = 33.33
    const sell = sellingPriceFromMarkup(cost, markup)
    expect(markupFromPrices(cost, sell)).toBeCloseTo(markup, 1)
  })
})

// ── calculateBreakEven ────────────────────────────────────────────────────────
describe("calculateBreakEven", () => {
  it("computes break-even units and revenue", () => {
    const r = calculateBreakEven(50000, 100, 200)
    expect(r.contributionPerUnit).toBeCloseTo(100, 2)
    expect(r.breakEvenUnits).toBeCloseTo(500, 0)
    expect(r.breakEvenRevenue).toBeCloseTo(100_000, 2)
  })

  it("breakEvenUnits × contributionPerUnit ≈ fixedCosts invariant", () => {
    const cases = [
      [100_000, 200, 500],
      [25_000, 50, 150],
      [1_000, 10, 25],
    ]
    for (const [f, v, s] of cases) {
      const r = calculateBreakEven(f, v, s)
      expect(r.breakEvenUnits * r.contributionPerUnit).toBeGreaterThanOrEqual(f)
    }
  })

  it("sell ≤ variable cost → isValid false and Infinity units", () => {
    const r = calculateBreakEven(10000, 200, 200)
    expect(r.isValid).toBe(false)
    expect(r.breakEvenUnits).toBe(Infinity)
  })

  it("contribution < 0 → isValid false", () => {
    const r = calculateBreakEven(10000, 300, 200)
    expect(r.isValid).toBe(false)
  })

  it("zero fixed costs → 0 break-even units", () => {
    const r = calculateBreakEven(0, 50, 100)
    expect(r.breakEvenUnits).toBe(0)
  })
})

// ── calculateCommission ───────────────────────────────────────────────────────
describe("calculateCommission", () => {
  it("computes commission and net amount", () => {
    const r = calculateCommission(100_000, 5)
    expect(r.commission).toBeCloseTo(5_000, 2)
    expect(r.amountAfterCommission).toBeCloseTo(95_000, 2)
  })

  it("sale = commission + net invariant", () => {
    const cases = [[50_000, 3], [1_000, 10], [999.99, 7.5], [0, 5]]
    for (const [s, c] of cases) {
      const r = calculateCommission(s, c)
      expect(r2(r.commission + r.amountAfterCommission)).toBe(r2(s))
    }
  })

  it("0% commission → full amount returned", () => {
    const r = calculateCommission(10_000, 0)
    expect(r.commission).toBe(0)
    expect(r.amountAfterCommission).toBeCloseTo(10_000, 2)
  })

  it("100% commission → zero net", () => {
    const r = calculateCommission(10_000, 100)
    expect(r.commission).toBeCloseTo(10_000, 2)
    expect(r.amountAfterCommission).toBeCloseTo(0, 2)
  })
})

// ── calculateSalaryHike ───────────────────────────────────────────────────────
describe("calculateSalaryHike", () => {
  it("annual CTC hike", () => {
    const r = calculateSalaryHike(600_000, 20, "annual")
    expect(r.increase).toBeCloseTo(120_000, 2)
    expect(r.newSalary).toBeCloseTo(720_000, 2)
    expect(r.newMonthlySalary).toBeCloseTo(60_000, 2)
    expect(r.newAnnualSalary).toBeCloseTo(720_000, 2)
  })

  it("monthly salary hike", () => {
    const r = calculateSalaryHike(50_000, 15, "monthly")
    expect(r.increase).toBeCloseTo(7_500, 2)
    expect(r.newSalary).toBeCloseTo(57_500, 2)
    expect(r.newMonthlySalary).toBeCloseTo(57_500, 2)
    expect(r.annualIncrease).toBeCloseTo(90_000, 2)
    expect(r.newAnnualSalary).toBeCloseTo(690_000, 2)
  })

  it("newSalary = currentSalary + increase invariant", () => {
    const cases: Array<[number, number, "monthly" | "annual"]> = [
      [40_000, 10, "monthly"],
      [800_000, 25, "annual"],
      [0, 50, "monthly"],
    ]
    for (const [s, h, m] of cases) {
      const r = calculateSalaryHike(s, h, m)
      expect(r2(r.currentSalary + r.increase)).toBe(r.newSalary)
    }
  })

  it("0% hike → no change", () => {
    const r = calculateSalaryHike(60_000, 0, "monthly")
    expect(r.increase).toBe(0)
    expect(r.newSalary).toBe(60_000)
  })
})
