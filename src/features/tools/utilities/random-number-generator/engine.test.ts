import { describe, it, expect } from "vitest"
import { generateRandomNumbers } from "./engine"

describe("Random Number Generator Engine", () => {
  it("generates integers within specified bounds", () => {
    const res = generateRandomNumbers({ min: 1, max: 10, count: 50, unique: false, mode: "integer" })
    expect(res.isValid).toBe(true)
    expect(res.results.length).toBe(50)
    res.results.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(1)
      expect(n).toBeLessThanOrEqual(10)
      expect(Number.isInteger(n)).toBe(true)
    })
  })

  it("guarantees unique numbers when unique toggle is enabled", () => {
    const res = generateRandomNumbers({ min: 1, max: 20, count: 20, unique: true, mode: "integer" })
    expect(res.isValid).toBe(true)
    expect(res.results.length).toBe(20)
    const uniqueSet = new Set(res.results)
    expect(uniqueSet.size).toBe(20)
  })

  it("rejects impossible unique sampling requests", () => {
    const res = generateRandomNumbers({ min: 1, max: 5, count: 10, unique: true, mode: "integer" })
    expect(res.isValid).toBe(false)
    expect(res.errorMessage).toContain("Cannot generate 10 unique numbers in a range of size 5")
  })

  it("generates decimals within bounds", () => {
    const res = generateRandomNumbers({ min: 0, max: 1, count: 10, unique: false, mode: "decimal", decimals: 2 })
    expect(res.isValid).toBe(true)
    expect(res.results.length).toBe(10)
    res.results.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThanOrEqual(1)
    })
  })

  it("rejects impossible unique decimal requests", () => {
    const res = generateRandomNumbers({ min: 0, max: 1, count: 50, unique: true, mode: "decimal", decimals: 1 })
    expect(res.isValid).toBe(false)
    expect(res.errorMessage).toContain("Cannot generate 50 unique numbers")
  })

  it("rejects min > max", () => {
    const res = generateRandomNumbers({ min: 10, max: 5, count: 1, unique: false, mode: "integer" })
    expect(res.isValid).toBe(false)
  })
})
