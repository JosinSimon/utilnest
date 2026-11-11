import { it, expect, test, describe } from "vitest"
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

  it("reads plain-mode decimals digit by digit", () => {
    const say = (value: number) => numberToWordsEngine({ value, system: "indian", mode: "plain" })?.words
    expect(say(12.5)).toBe("Twelve Point Five")
    expect(say(3.05)).toBe("Three Point Zero Five")
    expect(say(0.75)).toBe("Zero Point Seven Five")
    expect(say(3.14159)).toBe("Three Point One Four One Five Nine")
    expect(say(1.9999999)).toBe("Two")
    expect(say(-2.5)).toBe("Minus Two Point Five")
    expect(say(100)).toBe("One Hundred")
  })

  it("keeps currency mode in paise", () => {
    const r = numberToWordsEngine({ value: 12.5, system: "indian", mode: "currency", currencyCode: "INR" })
    expect(r?.words).toMatch(/Twelve Rupees and Fifty Paise/)
  })
})
