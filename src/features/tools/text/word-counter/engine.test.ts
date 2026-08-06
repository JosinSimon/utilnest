import { describe, it, expect } from "vitest"
import {
  countWords,
  wordsIn,
  sentencesIn,
  paragraphsIn,
  charactersIn,
  readingTimeLabel,
} from "./engine"

// Family emoji built from explicit ZWJ-joined code points so grapheme counting
// tests are deterministic regardless of how the literal is transported.
const FAMILY_EMOJI =
  "\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}"

describe("word counter engine", () => {
  describe("characters (grapheme-aware)", () => {
    it("counts every character including spaces and newlines", () => {
      const r = countWords({ text: "Hello world" }).data
      expect(r.characterCount).toBe(11)
    })

    it("counts tabs and newlines", () => {
      const r = countWords({ text: "a\tb\nc" }).data
      expect(r.characterCount).toBe(5)
    })

    it("counts an emoji as a single character", () => {
      expect(countWords({ text: "😀" }).data.characterCount).toBe(1)
      expect(countWords({ text: FAMILY_EMOJI }).data.characterCount).toBe(1)
    })

    it("splits into grapheme clusters", () => {
      expect(charactersIn(`a${FAMILY_EMOJI}b`)).toEqual(["a", FAMILY_EMOJI, "b"])
    })

    it("excludes all whitespace from the without-spaces count", () => {
      const r = countWords({ text: "a b\tc\nd" }).data
      expect(r.characterCountWithoutSpaces).toBe(4)
    })

    it("excludes emoji-safe whitespace only, not emoji", () => {
      const r = countWords({ text: "hi 😀" }).data
      expect(r.characterCount).toBe(4)
      expect(r.characterCountWithoutSpaces).toBe(3)
    })
  })

  describe("words", () => {
    it("counts words separated by single spaces", () => {
      expect(wordsIn("hello world")).toBe(2)
    })

    it("ignores punctuation around words", () => {
      expect(wordsIn("hello, world.")).toBe(2)
      expect(wordsIn("hello!? world...")).toBe(2)
    })

    it("collapses multiple spaces, tabs and newlines", () => {
      expect(wordsIn("hello    world")).toBe(2)
      expect(wordsIn("hello\t\tworld")).toBe(2)
      expect(wordsIn("hello\n\nworld")).toBe(2)
    })

    it("does not count standalone symbols, dashes or emojis", () => {
      expect(wordsIn("- - -")).toBe(0)
      expect(wordsIn("• • •")).toBe(0)
      expect(wordsIn("😀 🎉")).toBe(0)
      expect(wordsIn("word - word")).toBe(2)
    })

    it("keeps internal punctuation inside a word", () => {
      expect(wordsIn("don't well-known 3.14 1,000")).toBe(4)
    })

    it("counts unicode letters and numbers", () => {
      expect(wordsIn("Héllo wörld")).toBe(2)
      expect(wordsIn("こんにちは 世界")).toBe(2)
      expect(wordsIn("नमस्ते दुनिया")).toBe(2)
    })

    it("returns zero for empty and whitespace-only text", () => {
      expect(wordsIn("")).toBe(0)
      expect(wordsIn("   \n\t  ")).toBe(0)
    })

    it("exposes wordCount on the result", () => {
      expect(countWords({ text: "Hello world" }).data.wordCount).toBe(2)
    })
  })

  describe("sentences", () => {
    it("counts a single punctuated sentence", () => {
      expect(sentencesIn("Hello world.")).toBe(1)
    })

    it("counts multiple punctuated sentences", () => {
      expect(sentencesIn("Hello. How are you?")).toBe(2)
      expect(sentencesIn("First. Second! Third?")).toBe(3)
    })

    it("treats repeated punctuation as one terminator", () => {
      expect(sentencesIn("Hello... Still there?")).toBe(2)
      expect(sentencesIn("Wow!!! Really?")).toBe(2)
      expect(sentencesIn("Hello...")).toBe(1)
    })

    it("counts an unpunctuated block as one sentence", () => {
      expect(sentencesIn("Hello world")).toBe(1)
      expect(sentencesIn("A block of text without punctuation")).toBe(1)
    })

    it("counts a trailing fragment without punctuation", () => {
      expect(sentencesIn("First. Second.")).toBe(2)
      expect(sentencesIn("First. Second")).toBe(2)
    })

    it("returns zero for empty, whitespace-only and punctuation-only text", () => {
      expect(sentencesIn("")).toBe(0)
      expect(sentencesIn("   ")).toBe(0)
      expect(sentencesIn("...")).toBe(0)
      expect(sentencesIn("???")).toBe(0)
      expect(sentencesIn("...!?")).toBe(0)
    })

    it("does not treat decimal points as terminators", () => {
      expect(sentencesIn("Pi is 3.14.")).toBe(1)
      expect(sentencesIn("Version 1.2.3 released.")).toBe(1)
      expect(sentencesIn("I paid ₹1,000. Then left.")).toBe(2)
    })

    it("handles unicode content", () => {
      expect(sentencesIn("नमस्ते दुनिया।")).toBe(1)
      expect(sentencesIn("Olá mundo.")).toBe(1)
    })
  })

  describe("paragraphs", () => {
    it("counts a single block as one paragraph", () => {
      expect(paragraphsIn("Line 1\nLine 2")).toBe(1)
    })

    it("splits on one or more blank lines", () => {
      expect(paragraphsIn("Line 1\n\nLine 2")).toBe(2)
      expect(paragraphsIn("Line 1\n\n\n\nLine 2")).toBe(2)
    })

    it("treats blank lines containing spaces as separators", () => {
      expect(paragraphsIn("Line 1\n   \nLine 2")).toBe(2)
    })

    it("handles windows newlines", () => {
      expect(paragraphsIn("Line 1\r\n\r\nLine 2")).toBe(2)
      expect(paragraphsIn("Line 1\r\nLine 2")).toBe(1)
    })

    it("returns zero for empty and whitespace-only text", () => {
      expect(paragraphsIn("")).toBe(0)
      expect(paragraphsIn("   \n\n  ")).toBe(0)
    })

    it("counts three paragraphs separated by blank lines", () => {
      expect(paragraphsIn("Para one.\n\nPara two.\n\n\nPara three.")).toBe(3)
    })
  })

  describe("reading time", () => {
    it("computes seconds and minutes at 200 wpm", () => {
      const r = countWords({ text: Array(200).fill("word").join(" ") }).data
      expect(r.readingTimeSeconds).toBeCloseTo(60, 1)
      expect(r.readingTimeMinutes).toBeCloseTo(1, 1)
    })

    it("rounds to a human-readable label", () => {
      expect(readingTimeLabel(0)).toBe("≈0 sec")
      expect(readingTimeLabel(2.4)).toBe("≈2 sec")
      expect(readingTimeLabel(75)).toBe("≈1 min 15 sec")
      expect(readingTimeLabel(60)).toBe("≈1 min")
      expect(readingTimeLabel(150)).toBe("≈2 min 30 sec")
    })
  })

  describe("top keywords", () => {
    it("sorts by frequency then alphabetically", () => {
      const r = countWords({
        text: "apple banana apple cherry banana apple",
      }).data
      expect(r.topKeywords).toEqual([
        { word: "apple", count: 3 },
        { word: "banana", count: 2 },
        { word: "cherry", count: 1 },
      ])
    })

    it("ignores common stop words", () => {
      const r = countWords({
        text: "the and or a an of to is in for on with at by from",
      }).data
      expect(r.topKeywords).toEqual([])
    })

    it("normalizes case and strips punctuation", () => {
      const r = countWords({ text: "Hello, hello. HELLO!" }).data
      expect(r.topKeywords).toEqual([{ word: "hello", count: 3 }])
    })

    it("returns all unique words when each appears once (capped at 20)", () => {
      const r = countWords({ text: "delta echo foxtrot golf hotel india" }).data
      expect(r.topKeywords).toEqual([
        { word: "delta", count: 1 },
        { word: "echo", count: 1 },
        { word: "foxtrot", count: 1 },
        { word: "golf", count: 1 },
        { word: "hotel", count: 1 },
        { word: "india", count: 1 },
      ])
    })

    it("caps the list at 20 keywords", () => {
      const words = Array.from({ length: 30 }, (_, i) => `word${i}`)
      const r = countWords({ text: words.join(" ") }).data
      expect(r.topKeywords).toHaveLength(20)
    })

    it("returns an empty list for no keywords", () => {
      expect(countWords({ text: "" }).data.topKeywords).toEqual([])
      expect(countWords({ text: "!!! ..." }).data.topKeywords).toEqual([])
    })
  })

  describe("edge cases and determinism", () => {
    it("handles empty input", () => {
      const r = countWords({ text: "" }).data
      expect(r).toEqual({
        wordCount: 0,
        characterCount: 0,
        characterCountWithoutSpaces: 0,
        sentenceCount: 0,
        paragraphCount: 0,
        readingTimeSeconds: 0,
        readingTimeMinutes: 0,
        topKeywords: [],
      })
    })

    it("handles whitespace-only input", () => {
      const r = countWords({ text: " \t\n\r " }).data
      expect(r.wordCount).toBe(0)
      expect(r.sentenceCount).toBe(0)
      expect(r.paragraphCount).toBe(0)
      expect(r.characterCount).toBe(5)
      expect(r.characterCountWithoutSpaces).toBe(0)
    })

    it("handles mixed punctuation and symbols", () => {
      const r = countWords({
        text: "!!! Hello, world?! ... 3.14 is pi, right? -- yes!",
      }).data
      expect(r.wordCount).toBe(7)
      expect(r.sentenceCount).toBe(3)
    })

    it("is deterministic across calls", () => {
      const text = "The quick brown fox jumps over the lazy dog. Repeated word. repeated word."
      const a = countWords({ text }).data
      const b = countWords({ text }).data
      expect(a).toEqual(b)
    })

    it("handles large text quickly and correctly", () => {
      const words = Array.from({ length: 500 }, (_, i) => `word${i % 25}`)
      const paragraph = words.join(" ")
      const text = Array(10).fill(paragraph).join("\n\n")
      const r = countWords({ text }).data
      expect(r.wordCount).toBe(5000)
      expect(r.paragraphCount).toBe(10)
      expect(r.readingTimeSeconds).toBeCloseTo(1500, 1)
      expect(r.readingTimeMinutes).toBeCloseTo(25, 1)
      expect(r.topKeywords[0].count).toBe(200)
    })

    it("supports mixed unicode scripts", () => {
      const r = countWords({ text: "Hello 世界 नमस्ते 😀!" }).data
      expect(r.wordCount).toBe(3)
      expect(r.characterCount).toBeGreaterThanOrEqual(11)
    })
  })
})
