import { describe, it, expect } from "vitest"
import { findReplace, type FindReplaceInput } from "./engine"

const base: FindReplaceInput = {
  text: "",
  find: "",
  replace: "",
  caseSensitive: false,
  wholeWord: false,
}

describe("find-replace engine", () => {
  it("replaces a plain occurrence", () => {
    const r = findReplace({ ...base, text: "hello world", find: "hello", replace: "hi" })
    expect(r.output).toBe("hi world")
    expect(r.matches).toBe(1)
  })

  it("replaces all occurrences", () => {
    const r = findReplace({ ...base, text: "a a a", find: "a", replace: "b" })
    expect(r.output).toBe("b b b")
    expect(r.matches).toBe(3)
  })

  it("is case-insensitive by default", () => {
    const r = findReplace({ ...base, text: "Hello hello", find: "hello", replace: "x" })
    expect(r.output).toBe("x x")
    expect(r.matches).toBe(2)
  })

  it("respects caseSensitive", () => {
    const r = findReplace({ ...base, text: "Hello hello", find: "hello", replace: "x", caseSensitive: true })
    expect(r.output).toBe("Hello x")
    expect(r.matches).toBe(1)
  })

  it("respects wholeWord matching", () => {
    const r = findReplace({ ...base, text: "cat catalog", find: "cat", replace: "dog", wholeWord: true })
    expect(r.output).toBe("dog catalog")
    expect(r.matches).toBe(1)
  })

  it("treats find as literal (no regex interpretation)", () => {
    const r = findReplace({ ...base, text: "cost 5.cost", find: "5.", replace: "X" })
    expect(r.output).toBe("cost Xcost")
    expect(r.matches).toBe(1)
  })

  it("handles an empty find (no change)", () => {
    const r = findReplace({ ...base, text: "abc", find: "", replace: "x" })
    expect(r.output).toBe("abc")
    expect(r.matches).toBe(0)
  })

  it("returns the original text when there are no matches", () => {
    const r = findReplace({ ...base, text: "abc", find: "z", replace: "x" })
    expect(r.output).toBe("abc")
    expect(r.matches).toBe(0)
  })

  it("supports an empty replacement (deletion)", () => {
    const r = findReplace({ ...base, text: "ababa", find: "a", replace: "" })
    expect(r.output).toBe("bb")
    expect(r.matches).toBe(3)
  })

  it("handles empty input text", () => {
    const r = findReplace({ ...base, text: "", find: "a", replace: "b" })
    expect(r.output).toBe("")
    expect(r.matches).toBe(0)
  })
})