import { describe, it, expect } from "vitest"
import { reverseText, type ReverseMode } from "./engine"

function run(text: string, mode: ReverseMode) {
  return reverseText(text, mode)
}

describe("reverse-text engine", () => {
  it("reverses characters", () => {
    expect(run("abc", "characters")).toBe("cba")
  })

  it("reverses a sentence character by character", () => {
    expect(run("hello world", "characters")).toBe("dlrow olleh")
  })

  it("keeps graphemes intact when reversing characters", () => {
    expect(run("a👍b", "characters")).toBe("b👍a")
  })

  it("reverses word order", () => {
    expect(run("one two three", "words")).toBe("three two one")
  })

  it("preserves whitespace between reversed words", () => {
    expect(run("a  b c", "words")).toBe("c b  a")
  })

  it("reverses line order", () => {
    expect(run("line1\nline2\nline3", "lines")).toBe("line3\nline2\nline1")
  })

  it("handles CRLF when reversing lines", () => {
    expect(run("a\r\nb", "lines")).toBe("b\na")
  })

  it("handles empty input", () => {
    expect(run("", "characters")).toBe("")
    expect(run("", "words")).toBe("")
    expect(run("", "lines")).toBe("")
  })

  it("reverses a single word in word mode", () => {
    expect(run("solo", "words")).toBe("solo")
  })

  it("is deterministic", () => {
    expect(run("hello world", "words")).toBe(run("hello world", "words"))
  })
})