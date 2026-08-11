import { ok, type TextEngine } from "@/features/tools/engine"

export type CaseMode =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "kebab"
  | "snake"
  | "constant"

export interface CaseInput {
  text: string
  mode: CaseMode
}

export interface CaseResult {
  output: string
}

const WORD_SPLIT = /[^\p{L}\p{N}]+/gu

/** Splits a string into word tokens, ignoring separators (spaces, dashes, underscores). */
function tokenize(text: string): string[] {
  return text.split(WORD_SPLIT).filter(Boolean)
}

function capitalize(word: string): string {
  if (word.length === 0) return word
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}

function sentenceCase(text: string): string {
  const trimmed = text.trim()
  if (trimmed.length === 0) return ""
  return trimmed[0].toUpperCase() + trimmed.slice(1).toLowerCase()
}

/** camelCase and PascalCase join tokens, first one lower/upper-cased. */
function joinCamel(tokens: string[], firstUpper: boolean): string {
  return tokens
    .map((t, i) => {
      const lower = t.toLowerCase()
      if (i === 0 && !firstUpper) return lower
      return capitalize(lower)
    })
    .join("")
}

/**
 * Case converter. Words are split on any non-alphanumeric separator so
 * "hello world", "hello-world" and "hello_world" all convert consistently.
 * Title case capitalizes the first letter of every word; sentence case only
 * capitalizes the first letter of the whole text.
 */
export function convertCase(text: string, mode: CaseMode): string {
  const tokens = tokenize(text)

  switch (mode) {
    case "upper":
      return text.toUpperCase()
    case "lower":
      return text.toLowerCase()
    case "title":
      return tokens.map(capitalize).join(" ")
    case "sentence":
      return sentenceCase(text)
    case "camel":
      return joinCamel(tokens, false)
    case "pascal":
      return joinCamel(tokens, true)
    case "kebab":
      return tokens.map((t) => t.toLowerCase()).join("-")
    case "snake":
      return tokens.map((t) => t.toLowerCase()).join("_")
    case "constant":
      return tokens.map((t) => t.toUpperCase()).join("_")
    default:
      return text
  }
}

export const runCaseConverter: TextEngine<CaseInput, CaseResult> = ({ text, mode }) =>
  ok({ output: convertCase(text, mode) })

export default {
  family: "text" as const,
  run: runCaseConverter,
}