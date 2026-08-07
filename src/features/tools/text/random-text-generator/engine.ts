import { ok, type TextEngine } from "@/features/tools/engine"

export type RandomKind = "sentence" | "word" | "paragraph"

export interface RandomGeneratorInput {
  count: number
  kind: RandomKind
  /** Reproducible seed, if provided. */
  seed?: number
}

export interface RandomTextResult {
  output: string
}

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui",
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum",
]

/** Deterministic, dependency-free PRNG (mulberry32) so output is reproducible
 * when a seed is provided. */
function makeRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = <T,>(rng: () => number, arr: T[]): T =>
  arr[Math.floor(rng() * arr.length)]

function buildSentence(rng: () => number): string {
  const n = 6 + Math.floor(rng() * 7) // 6–12 words
  const words = Array.from({ length: n }, () => pick(rng, WORDS))
  const sentence = words.join(" ")
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + "."
}

/**
 * Generates random filler text. `count` is the number of units requested: that
 * many words, sentences (each 6–12 words) or paragraphs (each 4–5 sentences).
 * A provided seed makes the exact output reproducible for testing.
 */
export function generateRandomText(input: RandomGeneratorInput): string {
  const { kind, seed = 1 } = input
  const requested = Math.max(0, Math.floor(input.count))
  const rng = makeRng(seed)

  if (requested === 0) return ""

  if (kind === "word") {
    return Array.from({ length: requested }, () => pick(rng, WORDS)).join(" ")
  }

  if (kind === "paragraph") {
    return Array.from({ length: requested }, () => {
      const n = 4 + Math.floor(rng() * 2) // 4–5 sentences
      return Array.from({ length: n }, () => buildSentence(rng)).join(" ")
    }).join("\n\n")
  }

  // sentence
  return Array.from({ length: requested }, () => buildSentence(rng)).join(" ")
}

export const runRandomGenerator: TextEngine<RandomGeneratorInput, RandomTextResult> = (input) =>
  ok({ output: generateRandomText(input) })

export default {
  family: "text" as const,
  run: runRandomGenerator,
}