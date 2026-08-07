/**
 * Shared, pure text helpers used across the Text tool category.
 *
 * These functions are framework-free so they can be unit-tested directly and
 * reused by several tools (word-counter, line-counter, case-converter, etc.).
 * Line splitting consistently handles both LF and CRLF line endings.
 */

/** Splits text into lines, normalizing CRLF to LF. A single trailing newline
 * does not produce a phantom empty line (matches how editors report line
 * counts); blank lines in the middle are preserved. */
export function splitLines(text: string): string[] {
  const normalized = text.replace(/\r\n?/g, "\n")
  const withoutTrailing = normalized.replace(/\n$/, "")
  return withoutTrailing.split("\n")
}

/** Splits text into grapheme clusters (user-perceived characters). */
export function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    return [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text)]
      .map((s) => s.segment)
  }
  return Array.from(text)
}

/** True when a string contains at least one letter or number. */
export const hasContent = (s: string): boolean => /[\p{L}\p{N}]/u.test(s)

const WHITESPACE = /\s/u

/** Number of non-whitespace characters (default: check each grapheme). */
export function countNonWhitespace(text: string): number {
  return graphemes(text).filter((c) => !WHITESPACE.test(c)).length
}