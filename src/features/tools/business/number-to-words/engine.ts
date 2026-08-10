import type { CalculatorEngine } from "@/features/tools/engine"
import { convertNumberToWords, type NumberSystem, type ConversionMode, type CurrencyPreset } from "@/features/tools/business/shared/numberToWords"

export interface NumberToWordsInput {
  value: number
  system: NumberSystem
  mode: ConversionMode
  currencyCode?: CurrencyPreset | string
  currencyName?: string
  paisaName?: string
}

export interface NumberToWordsResult {
  words: string
  wholeWords: string
  decimalWords: string
}

export const numberToWordsEngine: CalculatorEngine<NumberToWordsInput, NumberToWordsResult | null> = (input) => {
  if (isNaN(input.value) || !Number.isFinite(input.value)) {
    return null
  }
  const result = convertNumberToWords(input.value, {
    system: input.system,
    mode: input.mode,
    currencyCode: input.currencyCode,
    currencyName: input.currencyName,
    paisaName: input.paisaName,
  })

  return {
    words: result.words,
    wholeWords: result.wholeWords,
    decimalWords: result.decimalWords,
  }
}

export default { family: "calculator" as const, run: numberToWordsEngine }
