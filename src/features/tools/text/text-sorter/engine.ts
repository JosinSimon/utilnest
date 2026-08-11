import { ok, type TextEngine } from "@/features/tools/engine"
import { splitLines } from "../helpers"

export type SortMode = "alpha-asc" | "alpha-desc" | "numeric-asc" | "numeric-desc" | "length-asc" | "length-desc"

export interface SortInput {
  text: string
  mode: SortMode
}

export interface SortResult {
  output: string
}

/** Sorts lines per the chosen mode. Numeric modes parse each line as a number
 * (falling back to textual comparison for non-numeric lines). */
export function sortLines(text: string, mode: SortMode): string {
  if (text === "") return ""
  const lines = splitLines(text)

  // Case-insensitive base comparison: "Apple"/"apple" compare equal, and ties
  // keep their original relative order (stable sort). This yields the intuitive
  // "Apple\napple" ordering rather than putting the lowercase word first.
  const alpha = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" })
  const lengthA = (a: string, b: string) => a.length - b.length

  const parseNum = (s: string): number | null => {
    const trimmed = s.trim()
    if (trimmed === "") return null
    const n = Number(trimmed)
    return Number.isFinite(n) ? n : null
  }

  const numeric = (a: string, b: string): number => {
    const numA = parseNum(a)
    const numB = parseNum(b)
    if (numA !== null && numB !== null) return numA - numB
    if (numA !== null) return -1
    if (numB !== null) return 1
    return alpha(a, b)
  }

  let sorted: string[]
  switch (mode) {
    case "alpha-asc":
      sorted = [...lines].sort(alpha)
      break
    case "alpha-desc":
      sorted = [...lines].sort((a, b) => alpha(b, a))
      break
    case "numeric-asc":
      sorted = [...lines].sort((a, b) => numeric(a, b) || alpha(a, b))
      break
    case "numeric-desc":
      sorted = [...lines].sort((a, b) => numeric(b, a) || alpha(b, a))
      break
    case "length-asc":
      sorted = [...lines].sort((a, b) => lengthA(a, b) || alpha(a, b))
      break
    case "length-desc":
      sorted = [...lines].sort((a, b) => lengthA(b, a) || alpha(b, a))
      break
    default:
      sorted = lines
  }

  return sorted.join("\n")
}

export const runSorter: TextEngine<SortInput, SortResult> = ({ text, mode }) =>
  ok({ output: sortLines(text, mode) })

export default {
  family: "text" as const,
  run: runSorter,
}