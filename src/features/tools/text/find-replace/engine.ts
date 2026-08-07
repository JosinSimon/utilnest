import { ok, type TextEngine } from "@/features/tools/engine"

export interface FindReplaceInput {
  text: string
  find: string
  replace: string
  caseSensitive: boolean
  wholeWord: boolean
}

export interface FindReplaceResult {
  output: string
  matches: number
}

/** Escapes regex meta-characters so the search term is treated literally. */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Replaces every occurrence of `find` with `replace`. When `wholeWord` is set,
 * only whole-word matches are replaced (using word boundaries). `caseSensitive`
 * toggles the regex `i` flag.
 */
export function findReplace(input: FindReplaceInput): FindReplaceResult {
  const { find, caseSensitive, wholeWord } = input

  if (!find) return { output: input.text, matches: 0 }

  let pattern = escapeRegex(find)
  if (wholeWord) pattern = `\\b${pattern}\\b`

  const flags = caseSensitive ? "g" : "gi"
  const regex = new RegExp(pattern, flags)

  const output = input.text.replace(regex, input.replace)
  const matches = (input.text.match(regex) ?? []).length
  return { output, matches }
}

export const runFindReplace: TextEngine<FindReplaceInput, FindReplaceResult> = (input) =>
  ok(findReplace(input))

export default {
  family: "text" as const,
  run: runFindReplace,
}