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
 * Builds the matcher regex for the current find term + options. Exported so the
 * UI can highlight which words match under the present settings.
 */
export function buildMatcher(find: string, caseSensitive: boolean, wholeWord: boolean): RegExp | null {
  if (!find) return null
  let pattern = escapeRegex(find)
  if (wholeWord) pattern = `\\b${pattern}\\b`
  const flags = caseSensitive ? "g" : "gi"
  return new RegExp(pattern, flags)
}

/**
 * Splits `text` into [text, matched] pairs so callers can highlight exactly
 * which substrings will be replaced under the current options.
 */
export function matchSegments(
  text: string,
  find: string,
  caseSensitive: boolean,
  wholeWord: boolean,
): { text: string; matched: boolean }[] {
  const regex = buildMatcher(find, caseSensitive, wholeWord)
  if (!regex) return [{ text, matched: false }]

  const segments: { text: string; matched: boolean }[] = []
  let lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) segments.push({ text: text.slice(lastIndex, m.index), matched: false })
    segments.push({ text: m[0], matched: true })
    lastIndex = m.index + m[0].length
    if (m[0].length === 0) regex.lastIndex++
  }
  if (lastIndex < text.length) segments.push({ text: text.slice(lastIndex), matched: false })
  return segments
}

/**
 * Replaces every occurrence of `find` with `replace`. When `wholeWord` is set,
 * only whole-word matches are replaced (using word boundaries). `caseSensitive`
 * toggles the regex `i` flag.
 */
export function findReplace(input: FindReplaceInput): FindReplaceResult {
  const { caseSensitive, wholeWord } = input
  const regex = buildMatcher(input.find, caseSensitive, wholeWord)

  if (!regex) return { output: input.text, matches: 0 }

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