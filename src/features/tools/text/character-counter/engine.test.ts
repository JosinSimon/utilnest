import { describe, it, expect } from "vitest"
import { countCharacters } from "./engine"

function stats(text: string) {
  return countCharacters({ text }).data
}

describe("character-counter engine", () => {
  it("counts basic text", () => {
    const r = stats("hello")
    expect(r.characterCount).toBe(5)
    expect(r.letterCount).toBe(5)
    expect(r.wordCount).toBe(1)
  })

  it("counts empty text as zero", () => {
    const r = stats("")
    expect(r.characterCount).toBe(0)
    expect(r.wordCount).toBe(0)
    expect(r.lineCount).toBe(0)
  })

  it("counts spaces separately", () => {
    const r = stats("a b c")
    expect(r.characterCount).toBe(5)
    expect(r.characterCountWithoutSpaces).toBe(3)
    expect(r.wordCount).toBe(3)
  })

  it("treats grapheme clusters as one character", () => {
    // "e" + combining acute accent → 1 grapheme
    const r = stats("café\u0301")
    expect(r.characterCount).toBe(4)
    expect(r.letterCount).toBe(4)
  })

  it("counts an emoji as a single character without negative withoutPunctuation count", () => {
    const r = stats("👨‍👩‍👧‍👦")
    expect(r.characterCount).toBe(1)
    expect(r.letterCount).toBe(0)
    expect(r.characterCountWithoutPunctuation).toBeGreaterThanOrEqual(0)
    expect(r.characterCountWithoutPunctuation).toBe(0)
  })

  it("counts digits and punctuation", () => {
    const r = stats("3.14%")
    expect(r.digitCount).toBe(3)
    expect(r.characterCountWithoutPunctuation).toBe(3) // digits only, % and . removed
  })

  it("counts words across newlines", () => {
    const r = stats("one\ntwo three")
    expect(r.wordCount).toBe(3)
    expect(r.lineCount).toBe(2)
  })

  it("handles CRLF line endings", () => {
    const r = stats("a\r\nb")
    expect(r.lineCount).toBe(2)
  })

  it("reports unique characters", () => {
    const r = stats("aaa bbb")
    expect(r.uniqueCharacterCount).toBe(3) // a, b, space
  })

  it("treats spaces-only text with zero words", () => {
    const r = stats("   ")
    expect(r.wordCount).toBe(0)
    expect(r.characterCountWithoutSpaces).toBe(0)
  })

  it("handles unicode text as letters", () => {
    const r = stats("héllo wörld")
    expect(r.letterCount).toBe(10)
  })

  it("is deterministic", () => {
    const input = { text: "Deterministic ✔ text 123" }
    expect(countCharacters(input)).toEqual(countCharacters(input))
  })
})