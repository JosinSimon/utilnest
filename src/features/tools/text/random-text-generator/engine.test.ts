import { describe, it, expect } from "vitest"
import { generateRandomText } from "./engine"

describe("random-text-generator engine", () => {
  it("returns empty for a count of zero", () => {
    expect(generateRandomText({ count: 0, kind: "word", seed: 1 })).toBe("")
    expect(generateRandomText({ count: 0, kind: "sentence", seed: 1 })).toBe("")
    expect(generateRandomText({ count: 0, kind: "paragraph", seed: 1 })).toBe("")
  })

  it("generates the requested number of words", () => {
    const out = generateRandomText({ count: 5, kind: "word", seed: 1 })
    expect(out.split(" ")).toHaveLength(5)
  })

  it("generates words without trailing punctuation", () => {
    const out = generateRandomText({ count: 3, kind: "word", seed: 1 })
    expect(out).not.toMatch(/[.!?]$/)
  })

  it("generates the requested number of sentences", () => {
    const out = generateRandomText({ count: 3, kind: "sentence", seed: 2 })
    expect(out.split(/(?<=[.!?])\s+/)).toHaveLength(3)
  })

  it("sentence output ends with a full stop", () => {
    const out = generateRandomText({ count: 2, kind: "sentence", seed: 3 })
    expect(out.endsWith(".")).toBe(true)
  })

  it("separates paragraphs with a blank line", () => {
    const out = generateRandomText({ count: 2, kind: "paragraph", seed: 4 })
    expect(out.split("\n\n")).toHaveLength(2)
  })

  it("is reproducible for a fixed seed", () => {
    const a = generateRandomText({ count: 8, kind: "sentence", seed: 42 })
    const b = generateRandomText({ count: 8, kind: "sentence", seed: 42 })
    expect(a).toBe(b)
  })

  it("differs when the seed changes", () => {
    const a = generateRandomText({ count: 8, kind: "sentence", seed: 1 })
    const b = generateRandomText({ count: 8, kind: "sentence", seed: 2 })
    expect(a).not.toBe(b)
  })

  it("clamps negative counts to empty", () => {
    expect(generateRandomText({ count: -5, kind: "word", seed: 1 })).toBe("")
  })

  it("produces words from the vocabulary", () => {
    const out = generateRandomText({ count: 20, kind: "word", seed: 7 })
    expect(out.split(" ").every((w) => /^[a-z]+$/.test(w))).toBe(true)
  })
})