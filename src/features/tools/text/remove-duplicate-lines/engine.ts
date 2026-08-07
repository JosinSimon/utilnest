import { ok, type TextEngine } from "@/features/tools/engine"
import { splitLines } from "../helpers"

export interface DedupeInput {
  text: string
  /** When true, comparison ignores leading/trailing whitespace per line. */
  caseInsensitive: boolean
  /** When true, "Apple" and "apple" count as duplicates. */
  trim: boolean
}

export interface DedupeResult {
  output: string
  removedCount: number
}

/**
 * Removes duplicate lines while preserving the order of first occurrences.
 * Optionally trims each line for comparison and ignores case. The output keeps
 * the original (untrimmed) line text when trim is disabled.
 */
export function dedupeLines(text: string, opts: Partial<Omit<DedupeInput, "text">> = {}): {
  output: string
  removedCount: number
} {
  const { caseInsensitive = false, trim = true } = opts

  const lines = text === "" ? [] : splitLines(text)
  const seen = new Set<string>()
  const kept: string[] = []
  let removedCount = 0

  for (const raw of lines) {
    const compareWith = trim ? raw.trim() : raw
    let key = compareWith
    if (caseInsensitive) key = key.toLowerCase()
    if (compareWith === "") {
      // Preserve blank lines once; skip repeats.
      if (seen.has("")) removedCount++
      else {
        seen.add("")
        kept.push(raw)
      }
      continue
    }
    if (seen.has(key)) {
      removedCount++
    } else {
      seen.add(key)
      kept.push(raw)
    }
  }

  return { output: kept.join("\n"), removedCount }
}

export const runDedupe: TextEngine<DedupeInput, DedupeResult> = (input) =>
  ok(
    dedupeLines(input.text, {
      caseInsensitive: input.caseInsensitive,
      trim: input.trim,
    }),
  )

export default {
  family: "text" as const,
  run: runDedupe,
}