import { describe, it, expect } from "vitest"
import { cleanSpaces } from "./engine"

describe("remove-extra-spaces engine", () => {
  it("collapses multiple spaces between words", () => {
    expect(cleanSpaces("a   b    c")).toBe("a b c")
  })

  it("collapses tabs between words", () => {
    expect(cleanSpaces("a\t\tb\t c")).toBe("a b c")
  })

  it("trims leading and trailing whitespace", () => {
    expect(cleanSpaces("   hello world   ")).toBe("hello world")
  })

  it("trims each line", () => {
    expect(cleanSpaces("  a  \n  b  ")).toBe("a\nb")
  })

  it("removes blank lines", () => {
    expect(cleanSpaces("a\n\n\nb")).toBe("a\nb")
  })

  it("removes whitespace-only lines", () => {
    expect(cleanSpaces("a\n   \nb")).toBe("a\nb")
  })

  it("can keep blank lines when disabled", () => {
    expect(cleanSpaces("a\n\nb", { removeBlankLines: false })).toBe("a\n\nb")
  })

  it("preserves single spaces and newlines", () => {
    expect(cleanSpaces("a  b\nc\n  d")).toBe("a b\nc\nd")
  })

  it("does not add a trailing newline to single-line text", () => {
    expect(cleanSpaces("hello\n")).toBe("hello")
  })

  it("handles empty input", () => {
    expect(cleanSpaces("")).toBe("")
  })

  it("handles CRLF line endings", () => {
    expect(cleanSpaces("a\r\n\r\nb\r\n")).toBe("a\nb")
  })

  it("leaves a lone newline between two short lines intact", () => {
    expect(cleanSpaces("x\n\ny", { removeBlankLines: true })).toBe("x\ny")
  })

  it("is deterministic", () => {
    const input = "  a   b  \n\n  c "
    expect(cleanSpaces(input)).toBe(cleanSpaces(input))
  })
})