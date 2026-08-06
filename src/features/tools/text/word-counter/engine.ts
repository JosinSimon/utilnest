import { ok, type TextEngine } from "@/features/tools/engine"

export interface TextInput {
  text: string
}

export interface KeywordDensity {
  word: string
  count: number
}

export interface WordStats {
  wordCount: number
  characterCount: number
  characterCountWithoutSpaces: number
  sentenceCount: number
  paragraphCount: number
  readingTimeSeconds: number
  readingTimeMinutes: number
  topKeywords: KeywordDensity[]
}

const WORDS_PER_MINUTE_READ = 200
const KEYWORD_LIMIT = 20

const HAS_CONTENT = /[\p{L}\p{N}]/u
const WHITESPACE = /\s/u

// A decimal point is not a sentence terminator ("3.14" should not break a sentence).
const DECIMAL_DOT = /(\p{N})\.(?=\p{N})/gu

// Any punctuation-only run is a single terminator.
const TERMINATOR = /[.!?]+/g

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "because", "as", "until", "while",
  "of", "at", "by", "for", "with", "about", "against", "between", "into",
  "through", "during", "before", "after", "above", "below", "to", "from", "up",
  "down", "in", "out", "on", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "any", "both",
  "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not",
  "only", "own", "same", "so", "than", "too", "very", "can", "will", "just",
  "don", "should", "now", "i", "me", "my", "myself", "we", "our", "ours",
  "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him",
  "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself",
  "they", "them", "their", "theirs", "themselves", "what", "which", "who",
  "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were",
  "be", "been", "being", "have", "has", "had", "having", "do", "does", "did",
  "doing", "would", "could", "shall", "may", "might", "must", "need", "get",
  "got", "get", "say", "said", "make", "made", "see", "know", "went", "come",
  "came", "go", "going", "like", "one", "two", "also", "via", "per", "etc",
])

/**
 * Splits text into grapheme clusters (user-perceived characters) so emoji and
 * astral characters count as a single character, matching Word / Google Docs.
 */
export function charactersIn(text: string): string[] {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    return [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text)]
      .map((s) => s.segment)
  }
  return Array.from(text)
}

/**
 * Counts words the way word processors do: every whitespace-separated token
 * that contains at least one letter or number. Standalone symbols, dashes and
 * emojis are not words; internal punctuation ("don't", "well-known", "3.14",
 * "1,000") stays part of the same word.
 */
export function wordsIn(text: string): number {
  let count = 0
  for (const token of text.split(/\s+/)) {
    if (HAS_CONTENT.test(token)) count++
  }
  return count
}

/**
 * Counts sentences following punctuation. A sentence is any fragment of text
 * containing at least one letter or digit, delimited by . ! ?.
 *
 * - Repeated punctuation collapses into one terminator ("Hello..." = one end).
 * - Decimal points between digits are not terminators ("3.14 is pi." = 1).
 * - Text without punctuation counts as a single sentence if it has content.
 * - Empty or punctuation-only input yields 0 sentences.
 */
export function sentencesIn(text: string): number {
  const masked = text.replace(DECIMAL_DOT, "$1")
  const collapsed = masked.replace(TERMINATOR, ".")
  let count = 0
  for (const fragment of collapsed.split(".")) {
    if (HAS_CONTENT.test(fragment)) count++
  }
  return count
}

/**
 * A paragraph is a block of text separated by one or more blank lines.
 * Blank lines may contain spaces; multiple blank lines still separate only one
 * paragraph. Leading/trailing whitespace is ignored.
 */
export function paragraphsIn(text: string): number {
  return text
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean).length
}

export function readingTimeLabel(seconds: number): string {
  const total = Math.max(0, Math.round(seconds))
  if (total < 60) return `≈${total} sec`
  const mins = Math.floor(total / 60)
  const rest = total % 60
  return rest === 0 ? `≈${mins} min` : `≈${mins} min ${rest} sec`
}

function keywordsIn(text: string): KeywordDensity[] {
  const counts = new Map<string, number>()
  for (const word of text.toLowerCase().match(/[\p{L}\p{N}'’-]+/gu) ?? []) {
    if (STOP_WORDS.has(word)) continue
    counts.set(word, (counts.get(word) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, KEYWORD_LIMIT)
}

export const countWords: TextEngine<TextInput, WordStats> = ({ text }) => {
  const characters = charactersIn(text)
  const wordCount = wordsIn(text)

  return ok({
    wordCount,
    characterCount: characters.length,
    characterCountWithoutSpaces: characters.filter((c) => !WHITESPACE.test(c)).length,
    sentenceCount: sentencesIn(text),
    paragraphCount: paragraphsIn(text),
    readingTimeSeconds: (wordCount / WORDS_PER_MINUTE_READ) * 60,
    readingTimeMinutes: wordCount / WORDS_PER_MINUTE_READ,
    topKeywords: keywordsIn(text),
  })
}

export default {
  family: "text" as const,
  run: countWords,
}
