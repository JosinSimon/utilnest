import { ok, type TextEngine } from "@/features/tools/engine"

export interface SpacesInput {
  text: string
  trimLines: boolean
  collapseInternal: boolean
  removeBlankLines: boolean
}

export interface SpacesResult {
  output: string
}

/**
 * Cleans up whitespace in text:
 *  - collapseInternal: replaces runs of spaces/tabs between words with a single
 *    space (newlines are preserved).
 *  - trimLines: trims leading/trailing whitespace on every line.
 *  - removeBlankLines: drops lines that are empty after trimming.
 *
 * All options default to enabled so a single click produces clean text; each
 * can be toggled off individually.
 */
export function cleanSpaces(
  text: string,
  opts: Partial<Omit<SpacesInput, "text">> = {},
): string {
  const { trimLines = true, collapseInternal = true, removeBlankLines = true } = opts

  let result = text.replace(/\r\n?/g, "\n")

  if (collapseInternal) {
    result = result.replace(/[ \t]+/g, " ")
  }

  if (trimLines || removeBlankLines) {
    const lines = result.split("\n")
    const processed = lines.map((line) => (trimLines ? line.trim() : line))
    const kept = removeBlankLines ? processed.filter((l) => l !== "") : processed
    result = kept.join("\n")
  }

  return result
}

export const runCleanSpaces: TextEngine<SpacesInput, SpacesResult> = (input) =>
  ok({
    output: cleanSpaces(input.text, {
      trimLines: input.trimLines,
      collapseInternal: input.collapseInternal,
      removeBlankLines: input.removeBlankLines,
    }),
  })

export default {
  family: "text" as const,
  run: runCleanSpaces,
}