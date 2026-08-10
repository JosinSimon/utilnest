import { describe, it, expect } from "vitest"
import { formatStopwatchMs, computeLapRecords } from "./engine"

describe("Stopwatch Engine", () => {
  it("formats milliseconds into MM:SS.cs", () => {
    const t = formatStopwatchMs(65430) // 1 min 5 sec 43 centisec
    expect(t.hours).toBe(0)
    expect(t.minutes).toBe(1)
    expect(t.seconds).toBe(5)
    expect(t.milliseconds).toBe(43)
    expect(t.formatted).toBe("01:05.43")
  })

  it("formats hours into HH:MM:SS.cs", () => {
    const t = formatStopwatchMs(3665430) // 1 hr 1 min 5 sec 43 centisec
    expect(t.hours).toBe(1)
    expect(t.formatted).toBe("01:01:05.43")
  })

  it("computes lap records accurately", () => {
    const laps = computeLapRecords([10000, 25000, 45000])
    expect(laps.length).toBe(3)
    expect(laps[0].lapTimeMs).toBe(10000)
    expect(laps[1].lapTimeMs).toBe(15000)
    expect(laps[2].lapTimeMs).toBe(20000)
  })
})
