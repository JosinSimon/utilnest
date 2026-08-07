import { ok, type TextEngine } from "@/features/tools/engine"
import { splitLines, graphemes } from "../helpers"

export interface LineInput {
  text: string
}

export interface LineStats {
  lineCount: number
  nonEmptyLineCount: number
  emptyLineCount: number
  blankLineCount: number
  characterCount: number
  longestLineLength: number
  averageLineLength: number
}

/**
 * Line counter engine. A trailing newline does not add a phantom line; any
 * line with only whitespace is counted as a blank line. Average line length is
 * computed over all lines (including empty/blank ones).
 */
export const countLines: TextEngine<LineInput, LineStats> = ({ text }) => {
  if (text === "") {
    return ok({
      lineCount: 0,
      nonEmptyLineCount: 0,
      emptyLineCount: 0,
      blankLineCount: 0,
      characterCount: 0,
      longestLineLength: 0,
      averageLineLength: 0,
    })
  }

  const lines = splitLines(text)
  const isBlank = (s: string) => s.trim() === ""
  const nonEmpty = lines.filter((s) => !isBlank(s))
  const lengths = lines.map((s) => s.length)
  const longest = Math.max(0, ...lengths)
  const total = lengths.reduce((a, b) => a + b, 0)

  return ok({
    lineCount: lines.length,
    nonEmptyLineCount: nonEmpty.length,
    emptyLineCount: nonEmpty.length === lines.length ? 0 : lines.length - nonEmpty.length,
    blankLineCount: lines.filter((s) => isBlank(s)).length,
    characterCount: graphemes(text).length,
    longestLineLength: longest,
    averageLineLength: lines.length === 0 ? 0 : round1(total / lines.length),
  })
}

const round1 = (v: number): number => Math.round(v * 10) / 10

export default {
  family: "text" as const,
  run: countLines,
}