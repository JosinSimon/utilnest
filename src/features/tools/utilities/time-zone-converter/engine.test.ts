import { describe, it, expect } from "vitest"
import { convertTimeZone } from "./engine"

describe("Time Zone Converter Engine", () => {
  it("converts IST to EST correctly", () => {
    const res = convertTimeZone({
      dateStr: "2026-08-10",
      timeStr: "14:30",
      sourceZone: "Asia/Kolkata",
      targetZone: "America/New_York",
    })
    expect(res.isValid).toBe(true)
    expect(res.sourceFormatted).toContain("2:30")
    expect(res.targetOffset).toContain("GMT-4") // EDT in August is UTC-4
    expect(res.timeDifferenceHours).toBe(-9.5) // IST (+5.5) to EDT (-4) = -9.5h
  })

  it("converts to UTC correctly", () => {
    const res = convertTimeZone({
      dateStr: "2026-01-01",
      timeStr: "05:30",
      sourceZone: "Asia/Kolkata", // IST +5:30
      targetZone: "UTC",
    })
    expect(res.isValid).toBe(true)
    expect(res.targetFormatted).toContain("12:00") // 5:30 AM IST = 12:00 AM UTC
    expect(res.timeDifferenceHours).toBe(-5.5)
  })

  it("handles non-whole-hour offsets (Nepal NPT +5:45)", () => {
    const res = convertTimeZone({
      dateStr: "2026-08-10",
      timeStr: "12:00",
      sourceZone: "Asia/Kathmandu",
      targetZone: "UTC",
    })
    expect(res.isValid).toBe(true)
    expect(res.sourceOffset).toContain("+5:45")
  })
})
