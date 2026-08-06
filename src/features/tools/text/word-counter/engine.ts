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

function sentencesIn(text: string): number {
  const matches = text.match(/[.!?…]+(\s|$)/g)
  if (!matches) return text.trim() ? 1 : 0
  return matches.length
}

function paragraphsIn(text: string): number {
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
  const words = text.toLowerCase().match(/[a-z0-9']+/g) ?? []
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
  const trimmed = text.trim()
  const words = trimmed ? (trimmed.match(/\S+/g)?.length ?? 0) : 0
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