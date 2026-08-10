import { expect, test, describe } from "vitest"
import { commissionEngine } from "./engine"

describe("Commission Calculator Engine", () => {
  test("calculates commission correctly", () => {
    const result = commissionEngine({ saleAmount: 100000, commissionRate: 5 })
    expect(result).not.toBeNull()
    expect(result?.commission).toBe(5000)
    expect(result?.amountAfterCommission).toBe(95000)
  })

  test("handles zero rate", () => {
    const result = commissionEngine({ saleAmount: 100000, commissionRate: 0 })
    expect(result).not.toBeNull()
    expect(result?.commission).toBe(0)
    expect(result?.amountAfterCommission).toBe(100000)
  })

  test("handles invalid inputs", () => {
    const result = commissionEngine({ saleAmount: -100, commissionRate: 5 })
    expect(result).toBeNull()
  })
})
