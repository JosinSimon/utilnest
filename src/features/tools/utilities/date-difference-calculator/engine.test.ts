import { describe, it, expect } from "vitest"
import { calculateDateDiff } from "./engine"

describe("Date Difference Calculator Engine", () => {
  it("calculates difference between two dates (exclusive)", () => {
    const res = calculateDateDiff({
      mode: "diff",
      startDate: "2026-01-01",
      endDate: "2026-01-10",
      includeEndDate: false,
    })
    expect(res.isValid).toBe(true)
    expect(res.days).toBe(9)
    expect(res.totalDays).toBe(9)
  })

  it("calculates difference between two dates (inclusive)", () => {
    const res = calculateDateDiff({
      mode: "diff",
      startDate: "2026-01-01",
      endDate: "2026-01-10",
      includeEndDate: true,
    })
    expect(res.isValid).toBe(true)
    expect(res.days).toBe(10)
    expect(res.totalDays).toBe(10)
  })

  it("adds days to a starting date", () => {
    const res = calculateDateDiff({
      mode: "add_subtract",
      baseDate: "2026-01-01",
      operation: "add",
      amount: 15,
      unit: "days",
    })
    expect(res.isValid).toBe(true)
    expect(res.targetIsoDate).toBe("2026-01-16")
  })

  it("handles month-end clamping when adding months (Jan 31 + 1 month)", () => {
    const res = calculateDateDiff({
      mode: "add_subtract",
      baseDate: "2026-01-31",
      operation: "add",
      amount: 1,
      unit: "months",
    })
    expect(res.isValid).toBe(true)
    expect(res.targetIsoDate).toBe("2026-02-28") // 2026 is non-leap
  })

  it("subtracts years correctly", () => {
    const res = calculateDateDiff({
      mode: "add_subtract",
      baseDate: "2026-08-10",
      operation: "subtract",
      amount: 5,
      unit: "years",
    })
    expect(res.isValid).toBe(true)
    expect(res.targetIsoDate).toBe("2021-08-10")
  })
})
