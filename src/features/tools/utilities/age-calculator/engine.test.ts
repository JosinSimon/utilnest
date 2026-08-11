import { describe, it, expect } from "vitest"
import { calculateAge } from "./engine"

describe("Age Calculator Engine", () => {
  it("calculates exact age for standard dates", () => {
    const res = calculateAge("1995-05-15", "2026-08-10")
    expect(res.isValid).toBe(true)
    expect(res.years).toBe(31)
    expect(res.months).toBe(2)
    expect(res.days).toBe(26)
  })

  it("handles exact birthday date (0 months, 0 days)", () => {
    const res = calculateAge("2000-01-01", "2026-01-01")
    expect(res.isValid).toBe(true)
    expect(res.years).toBe(26)
    expect(res.months).toBe(0)
    expect(res.days).toBe(0)
  })

  it("handles February 29 leap year birthday correctly", () => {
    const res = calculateAge("2000-02-29", "2026-02-28")
    expect(res.isValid).toBe(true)
    expect(res.isFeb29LeapBaby).toBe(true)
    expect(res.years).toBe(25)
    expect(res.months).toBe(11)
  })

  it("calculates total days, weeks, months accurately", () => {
    const res = calculateAge("2020-01-01", "2021-01-01")
    expect(res.totalDays).toBe(366) // 2020 was a leap year
    expect(res.totalWeeks).toBe(52)
    expect(res.totalMonths).toBe(12)
  })

  it("calculates next birthday countdown", () => {
    const res = calculateAge("1990-08-15", "2026-08-10")
    expect(res.nextBirthday.daysRemaining).toBe(5)
  })

  it("handles month-end to next month start edge cases without negative days (e.g. Jan 31 to Mar 1)", () => {
    const res = calculateAge("2024-01-31", "2024-03-01")
    expect(res.isValid).toBe(true)
    expect(res.years).toBe(0)
    expect(res.months).toBe(1)
    expect(res.days).toBe(1)
  })

  it("rejects future birth date relative to target date", () => {
    const res = calculateAge("2030-01-01", "2026-08-10")
    expect(res.isValid).toBe(false)
    expect(res.errorMessage).toContain("future")
  })
})
