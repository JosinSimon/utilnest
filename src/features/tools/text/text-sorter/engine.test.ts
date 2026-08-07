import { describe, it, expect } from "vitest"
import { sortLines } from "./engine"

describe("text-sorter engine", () => {
  const list = "banana\nApple\ncherry\napple"

  it("sorts ascending alphabetically", () => {
    expect(sortLines(list, "alpha-asc")).toBe("Apple\napple\nbanana\ncherry")
  })

  it("sorts descending alphabetically", () => {
    expect(sortLines(list, "alpha-desc")).toBe("cherry\nbanana\nApple\napple")
  })

  it("sorts numerically ascending", () => {
    expect(sortLines("10\n2\n1\n20", "numeric-asc")).toBe("1\n2\n10\n20")
  })

  it("sorts numerically descending", () => {
    expect(sortLines("10\n2\n1\n20", "numeric-desc")).toBe("20\n10\n2\n1")
  })

  it("handles non-numeric lines gracefully in numeric mode", () => {
    // Numeric lines sort first; non-numeric lines sort last, alphabetically.
    expect(sortLines("3\n10\na\n2", "numeric-asc")).toBe("2\n3\n10\na")
  })

  it("sorts by length ascending", () => {
    expect(sortLines("aaa\na\naa", "length-asc")).toBe("a\naa\naaa")
  })

  it("sorts by length descending", () => {
    expect(sortLines("aaa\na\naa", "length-desc")).toBe("aaa\naa\na")
  })

  it("handles empty input", () => {
    expect(sortLines("", "alpha-asc")).toBe("")
  })

  it("handles a single line", () => {
    expect(sortLines("only", "alpha-asc")).toBe("only")
  })

  it("strips a trailing newline before sorting", () => {
    expect(sortLines("b\na\n", "alpha-asc")).toBe("a\nb")
  })

  it("handles CRLF line endings", () => {
    expect(sortLines("b\r\na\r\n", "alpha-asc")).toBe("a\nb")
  })

  it("is deterministic", () => {
    expect(sortLines(list, "alpha-asc")).toBe(sortLines(list, "alpha-asc"))
  })
})