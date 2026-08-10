import { describe, it, expect } from "vitest"
import { convertNumberToWords } from "./numberToWords"

describe("convertNumberToWords — Indian system, plain mode", () => {
  const w = (n: number) => convertNumberToWords(n, { system: "indian", mode: "plain" }).words

  it("zero", () => expect(w(0)).toBe("Zero"))
  it("one", () => expect(w(1)).toBe("One"))
  it("ten", () => expect(w(10)).toBe("Ten"))
  it("eleven", () => expect(w(11)).toBe("Eleven"))
  it("nineteen", () => expect(w(19)).toBe("Nineteen"))
  it("twenty", () => expect(w(20)).toBe("Twenty"))
  it("twenty-one", () => expect(w(21)).toBe("Twenty One"))
  it("ninety-nine", () => expect(w(99)).toBe("Ninety Nine"))
  it("one hundred", () => expect(w(100)).toBe("One Hundred"))
  it("one hundred eleven", () => expect(w(111)).toBe("One Hundred Eleven"))
  it("one thousand", () => expect(w(1_000)).toBe("One Thousand"))
  it("one thousand one hundred", () => expect(w(1_100)).toBe("One Thousand One Hundred"))
  it("ten thousand", () => expect(w(10_000)).toBe("Ten Thousand"))
  it("ninety-nine thousand nine hundred ninety-nine", () =>
    expect(w(99_999)).toBe("Ninety Nine Thousand Nine Hundred Ninety Nine"))
  it("one lakh", () => expect(w(100_000)).toBe("One Lakh"))
  it("ten lakh", () => expect(w(1_000_000)).toBe("Ten Lakh"))
  it("twelve lakh forty-five thousand six hundred seventy-eight", () =>
    expect(w(1_245_678)).toBe(
      "Twelve Lakh Forty-Five Thousand Six Hundred Seventy-Eight".replace(/-/g, " "),
    ))
  it("one crore", () => expect(w(10_000_000)).toBe("One Crore"))
  it("ten crore", () => expect(w(100_000_000)).toBe("Ten Crore"))
  it("one crore one", () =>
    expect(w(10_000_001)).toBe("One Crore One"))
  it("large: 12,45,678", () =>
    expect(w(1_245_678)).toBe("Twelve Lakh Forty Five Thousand Six Hundred Seventy Eight"))
})

describe("convertNumberToWords — Indian system, currency mode", () => {
  const c = (n: number) =>
    convertNumberToWords(n, { system: "indian", mode: "currency" }).words

  it("zero rupees", () => expect(c(0)).toBe("Zero Rupees Only"))
  it("one rupee", () => expect(c(1)).toBe("One Rupee Only"))
  it("with paise", () => expect(c(999.5)).toBe("Nine Hundred Ninety Nine Rupees and Fifty Paise Only"))
  it("exact paise", () => expect(c(0.5)).toBe("Fifty Paise Only"))
  it("1 lakh", () => expect(c(100_000)).toBe("One Lakh Rupees Only"))
  it("1 crore", () => expect(c(10_000_000)).toBe("One Crore Rupees Only"))
  it("invoice amount 12,45,678", () =>
    expect(c(1_245_678)).toBe(
      "Twelve Lakh Forty Five Thousand Six Hundred Seventy Eight Rupees Only",
    ))
})

describe("convertNumberToWords — International system", () => {
  const w = (n: number) => convertNumberToWords(n, { system: "international", mode: "plain" }).words

  it("one thousand", () => expect(w(1_000)).toBe("One Thousand"))
  it("one million", () => expect(w(1_000_000)).toBe("One Million"))
  it("one billion", () => expect(w(1_000_000_000)).toBe("One Billion"))
  it("one trillion", () => expect(w(1_000_000_000_000)).toBe("One Trillion"))
  it("1,245,678", () =>
    expect(w(1_245_678)).toBe("One Million Two Hundred Forty Five Thousand Six Hundred Seventy Eight"))
})

describe("convertNumberToWords — edge cases", () => {
  it("negative number", () => {
    const r = convertNumberToWords(-100)
    expect(r.words).toMatch(/Minus/)
    expect(r.isNegative).toBe(true)
  })

  it("decimal is rounded to 2 places and rolls over to whole number", () => {
    const r = convertNumberToWords(99.999, { mode: "currency" })
    expect(r.wholeNumber).toBe(100)
    expect(r.decimalNumber).toBe(0)
  })

  it("returns decimal words correctly for 0.01", () => {
    const r = convertNumberToWords(0.01, { system: "indian", mode: "plain" })
    expect(r.decimalNumber).toBe(1)
  })

  it("handles Infinity gracefully", () => {
    const r = convertNumberToWords(Infinity)
    expect(r.words).toBe("Invalid number")
  })

  it("handles NaN gracefully", () => {
    const r = convertNumberToWords(NaN)
    expect(r.words).toBe("Invalid number")
  })
})
