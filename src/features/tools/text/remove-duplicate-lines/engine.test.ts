import { describe, it, expect } from "vitest"
import { dedupeLines } from "./engine"

describe("remove-duplicate-lines engine", () => {
  it("removes exact duplicate lines preserving order", () => {
    const r = dedupeLines("a\nb\na\nc\nb")
    expect(r.output).toBe("a\nb\nc")
    expect(r.removedCount).toBe(2)
  })

  it("keeps the first occurrence when duplicates exist", () => {
    const r = dedupeLines("first\nsecond\nfirst")
    expect(r.output).toBe("first\nsecond")
  })

  it("handles empty input", () => {
    const r = dedupeLines("")
    expect(r.output).toBe("")
    expect(r.removedCount).toBe(0)
  })

  it("trims lines for comparison when enabled", () => {
    const r = dedupeLines("a\n a \na", { trim: true })
    expect(r.output).toBe("a")
    expect(r.removedCount).toBe(2)
  })

  it("treats trimmed-identical lines as duplicates", () => {
    const r = dedupeLines("a \nb\na", { trim: true })
    expect(r.output).toBe("a \nb")
    expect(r.removedCount).toBe(1)
  })

  it("compares case-insensitively when enabled", () => {
    const r = dedupeLines("Apple\napple\nAPPLE", { caseInsensitive: true, trim: true })
    expect(r.output).toBe("Apple")
    expect(r.removedCount).toBe(2)
  })

  it("treats lines as distinct when case-insensitive is off", () => {
    const r = dedupeLines("Apple\napple", { caseInsensitive: false, trim: true })
    expect(r.output).toBe("Apple\napple")
    expect(r.removedCount).toBe(0)
  })

  it("deduplicates blank lines when trim is on", () => {
    const r = dedupeLines("a\n\n\na", { trim: true })
    expect(r.output).toBe("a\n")
    expect(r.removedCount).toBe(2)
  })

  it("handles CRLF line endings", () => {
    const r = dedupeLines("a\r\nb\r\na\r\n")
    expect(r.output).toBe("a\nb")
    expect(r.removedCount).toBe(1)
  })

  it("is deterministic", () => {
    const input = { text: "x\ny\nx", caseInsensitive: false, trim: true }
    expect(dedupeLines(input.text, { caseInsensitive: false, trim: true })).toEqual(
      dedupeLines(input.text, { caseInsensitive: false, trim: true }),
    )
  })
})