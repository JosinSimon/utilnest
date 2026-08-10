import { describe, it, expect } from "vitest"
import { calculateRemainingMs, formatTimeComponents } from "./engine"

describe("Timer Engine", () => {
  it("calculates remaining ms accurately", () => {
    expect(calculateRemainingMs(60000, 15000)).toBe(45000)
    expect(calculateRemainingMs(60000, 70000)).toBe(0)
  })

  it("formats time components into MM:SS", () => {
    const t = formatTimeComponents(300000) // 5 minutes
    expect(t.hours).toBe(0)
    expect(t.minutes).toBe(5)
    expect(t.seconds).toBe(0)
    expect(t.formatted).toBe("05:00")
  })

  it("formats time components into HH:MM:SS for hours", () => {
    const t = formatTimeComponents(3665000) // 1 hr 1 min 5 sec
    expect(t.hours).toBe(1)
    expect(t.minutes).toBe(1)
    expect(t.seconds).toBe(5)
    expect(t.formatted).toBe("01:01:05")
  })
})
