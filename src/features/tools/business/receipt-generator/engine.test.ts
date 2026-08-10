import { describe, it, expect } from "vitest"
import { receiptEngine } from "./engine"

describe("receiptEngine", () => {
  it("validates when amount is greater than 0", () => {
    const result = receiptEngine({ amount: 100 })
    expect(result.isValid).toBe(true)
  })

  it("invalidates when amount is 0", () => {
    const result = receiptEngine({ amount: 0 })
    expect(result.isValid).toBe(false)
  })

  it("invalidates when amount is NaN", () => {
    const result = receiptEngine({ amount: NaN })
    expect(result.isValid).toBe(false)
  })
})
