import { ok, type TextEngine } from "@/features/tools/engine"

export interface TextInput {
  text: string
}

export interface KeywordDensity {
  word: string
  count: number
}

export interface WordStats {
  words: number
  characters: number
  charactersNoSpaces: number
  sentences: number
  paragraphs: number
  readingTime: number // seconds
  speakingTime: number // seconds
  density: KeywordDensity[]
}

const WORDS_PER_MINUTE_READ = 200
const WORDS_PER_MINUTE_SPEAK = 130

const SENTENCE_END = /[.!?…]+(?:\s|$)/g

/**
 * Counts words the way word processors do: every whitespace-separated token
 * that contains at least one letter or number. Standalone symbols ("-", "•",
 * "*", emojis) are not words. Internal punctuation ("don't", "well-known",
 * "3.14") stays part of the word.
 */
export function wordsIn(text: string): number {
  const tokens = text.split(/\s+/).filter(Boolean)
  let count = 0
  for (const token of tokens) {
    if (/[\p{L}\p{N}]/u.test(token)) count++
  }
  return count
}

export function sentencesIn(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  SENTENCE_END.lastIndex = 0
  const endings = trimmed.match(SENTENCE_END)?.length ?? 0
  if (endings === 0) return 1
  // an unpunctuated trailing fragment still forms its own sentence
  return /[.!?…]$/.test(trimmed) ? endings : endings + 1
}

export function paragraphsIn(text: string): number {
  return text
    .split(/\n{2,}|\r\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean).length
}

function densityIn(text: string): KeywordDensity[] {
  const stop = new Set([
    "the", "and", "for", "with", "this", "that", "you", "your", "are", "was",
    "were", "have", "has", "had", "but", "not", "from", "they", "them", "their",
    "will", "would", "can", "could", "should", "about", "into", "over", "then",
    "also", "its", "than", "just", "our", "out", "him", "her", "his", "when",
    "what", "which", "who", "whom", "how", "all", "any", "each", "more", "most",
    "other", "some", "such", "only", "own", "same", "so", "too", "very",
  ])

  const counts = new Map<string, number>()
  const words = text.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? []
  for (const word of words) {
    if (stop.has(word) || word.length < 2) continue
    counts.set(word, (counts.get(word) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

export const countWords: TextEngine<TextInput, WordStats> = ({ text }) => {
  const words = wordsIn(text)
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s+/g, "").length

  return ok({
    words,
    characters,
    charactersNoSpaces,
    sentences: sentencesIn(text),
    paragraphs: paragraphsIn(text),
    readingTime: (words / WORDS_PER_MINUTE_READ) * 60,
    speakingTime: (words / WORDS_PER_MINUTE_SPEAK) * 60,
    density: densityIn(text),
  })
}

export default {
  family: "text" as const,
  run: countWords,
}