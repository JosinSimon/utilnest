import { ok, type TextEngine } from "@/features/tools/engine"
import { graphemes, splitLines } from "../helpers"

export type ReverseMode = "characters" | "words" | "lines"

export interface ReverseInput {
  text: string
  mode: ReverseMode
}

export interface ReverseResult {
  output: string
}

/** Reverses the order of words within the text, preserving whitespace between them. */
function reverseWords(text: string): string {
  return text.split(/(\s+)/).reverse().join("")
}

/**
 * Reverses text by characters (grapheme-safe, so emoji stay intact), by words
 * within each line, or by line order. Word reversal preserves the original
 * whitespace between words.
 */
export function reverseText(text: string, mode: ReverseMode): string {
  switch (mode) {
    case "characters":
      return graphemes(text).reverse().join("")
    case "words":
      return reverseWords(text)
    case "lines":
      return splitLines(text).reverse().join("\n")
    default:
      return text
  }
}

export const runReverse: TextEngine<ReverseInput, ReverseResult> = ({ text, mode }) =>
  ok({ output: reverseText(text, mode) })

export default {
  family: "text" as const,
  run: runReverse,
}