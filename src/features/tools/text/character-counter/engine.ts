import { ok, type TextEngine } from "@/features/tools/engine"
import { graphemes, countNonWhitespace } from "../helpers"

export interface CharacterInput {
  text: string
}

export interface CharacterStats {
  characterCount: number
  characterCountWithoutSpaces: number
  characterCountWithoutPunctuation: number
  digitCount: number
  letterCount: number
  wordCount: number
  lineCount: number
  uniqueCharacterCount: number
}

/** Counts digits (ASCII and non-ASCII numerals). */
function digitsIn(text: string): number {
  return graphemes(text).filter((g) => /\p{N}/u.test(g)).length
}

/** Counts letters across all scripts. */
function lettersIn(text: string): number {
  return graphemes(text).filter((g) => /\p{L}/u.test(g)).length
}

/**
 * Character counter engine. Characters are counted as grapheme clusters so
 * emoji and combined characters ("e" + combining accent, flags) count as a
 * single character — matching Word / Google Docs. Counts include letters,
 * digits, punctuation and whitespace separately for a full breakdown.
 */
export const countCharacters: TextEngine<CharacterInput, CharacterStats> = ({ text }) => {
  const allGraphemes = graphemes(text)
  const total = allGraphemes.length
  const withoutSpaces = countNonWhitespace(text)
  const withoutPunctuation = allGraphemes.filter((g) => !/[^\p{L}\p{N}\s]/u.test(g)).length
  const words = text.split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t)).length
  const lines = text.length === 0 ? 0 : text.split(/\r\n?|\n/).length
  const unique = new Set(allGraphemes).size

  return ok({
    characterCount: total,
    characterCountWithoutSpaces: withoutSpaces,
    characterCountWithoutPunctuation: withoutPunctuation,
    digitCount: digitsIn(text),
    letterCount: lettersIn(text),
    wordCount: words,
    lineCount: lines,
    uniqueCharacterCount: unique,
  })
}

export default {
  family: "text" as const,
  run: countCharacters,
}
