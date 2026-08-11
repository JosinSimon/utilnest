import { expect, test, describe } from "vitest"
import { numberToWordsEngine } from "./engine"

describe("Number to Words Engine", () => {
  test("converts Indian currency correctly", () => {
    const result = numberToWordsEngine({ value: 100000, system: "indian", mode: "currency", currencyCode: "INR" })
    expect(result).not.toBeNull()
    expect(result?.words).toBe("One Lakh Rupees Only")
  })

  test("converts International USD currency correctly", () => {
    const result = numberToWordsEngine({ value: 1245678.50, system: "international", mode: "currency", currencyCode: "USD" })
    expect(result).not.toBeNull()
    expect(result?.words).toBe("One Million Two Hundred Forty Five Thousand Six Hundred Seventy Eight Dollars and Fifty Cents Only")
  })

  test("converts International EUR currency correctly", () => {
    const result = numberToWordsEngine({ value: 500.01, system: "international", mode: "currency", currencyCode: "EUR" })
    expect(result).not.toBeNull()
    expect(result?.words).toBe("Five Hundred Euros and One Cent Only")
  })

  test("handles zero", () => {
    const result = numberToWordsEngine({ value: 0, system: "indian", mode: "currency" })
    expect(result).not.toBeNull()
    expect(result?.words).toBe("Zero Rupees Only")
  })

  test("handles large numbers (20 Billion / 2,000 Crore) without undefined output", () => {
    const result = numberToWordsEngine({ value: 20000000000, system: "indian", mode: "plain" })
    expect(result).not.toBeNull()
    expect(result?.words).toBe("Two Thousand Crore")
    expect(result?.words).not.toContain("undefined")
  })
})
