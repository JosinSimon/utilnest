/**
 * Number-to-words engine — Indian and International numbering systems.
 *
 * Indian system:        Ones, Tens, Hundreds, Thousands, Lakhs, Crores
 * International system: Ones, Tens, Hundreds, Thousands, Millions, Billions, Trillions
 *
 * Pure function — no DOM, React or external dependencies.
 */

// ── Primitive word tables ────────────────────────────────────────────────────

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
]

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty",
  "Sixty", "Seventy", "Eighty", "Ninety",
]

// ── Primitives ───────────────────────────────────────────────────────────────

function twoDigits(n: number): string {
  if (n === 0) return ""
  if (n < 20) return ONES[n] ?? ""
  const t = Math.floor(n / 10)
  const o = n % 10
  return o === 0 ? (TENS[t] ?? "") : `${TENS[t]} ${ONES[o]}`
}

function threeDigits(n: number): string {
  if (n === 0) return ""
  const h = Math.floor(n / 100)
  const rem = n % 100
  const parts: string[] = []
  if (h > 0) parts.push(`${ONES[h]} Hundred`)
  if (rem > 0) parts.push(twoDigits(rem))
  return parts.join(" ")
}

// ── Indian system (Crore → Lakh → Thousand → …) ──────────────────────────────

function toWordsIndian(n: number): string {
  if (n === 0) return "Zero"
  if (n < 0) return `Minus ${toWordsIndian(-n)}`

  const crore = Math.floor(n / 10_000_000)
  const lakh = Math.floor((n % 10_000_000) / 100_000)
  const thousand = Math.floor((n % 100_000) / 1_000)
  const rem = Math.floor(n % 1_000)

  const parts: string[] = []
  if (crore > 0) parts.push(`${threeDigits(crore)} Crore`)
  if (lakh > 0) parts.push(`${twoDigits(lakh)} Lakh`)
  if (thousand > 0) parts.push(`${twoDigits(thousand)} Thousand`)
  if (rem > 0) parts.push(threeDigits(rem))
  return parts.join(" ")
}

// ── International system (Trillion → Billion → Million → …) ─────────────────

function toWordsInternational(n: number): string {
  if (n === 0) return "Zero"
  if (n < 0) return `Minus ${toWordsInternational(-n)}`

  const trillion = Math.floor(n / 1_000_000_000_000)
  const billion = Math.floor((n % 1_000_000_000_000) / 1_000_000_000)
  const million = Math.floor((n % 1_000_000_000) / 1_000_000)
  const thousand = Math.floor((n % 1_000_000) / 1_000)
  const rem = Math.floor(n % 1_000)

  const parts: string[] = []
  if (trillion > 0) parts.push(`${threeDigits(trillion)} Trillion`)
  if (billion > 0) parts.push(`${threeDigits(billion)} Billion`)
  if (million > 0) parts.push(`${threeDigits(million)} Million`)
  if (thousand > 0) parts.push(`${threeDigits(thousand)} Thousand`)
  if (rem > 0) parts.push(threeDigits(rem))
  return parts.join(" ")
}

// ── Public API ────────────────────────────────────────────────────────────────

export type NumberSystem = "indian" | "international"
export type ConversionMode = "plain" | "currency"
export type CurrencyPreset = "INR" | "USD" | "EUR" | "GBP" | "AED" | "CUSTOM"

export interface CurrencyConfig {
  code: string
  symbol: string
  singular: string
  plural: string
  fractionSingular: string
  fractionPlural: string
}

export const CURRENCY_PRESETS: Record<string, CurrencyConfig> = {
  INR: { code: "INR", symbol: "₹", singular: "Rupee", plural: "Rupees", fractionSingular: "Paisa", fractionPlural: "Paise" },
  USD: { code: "USD", symbol: "$", singular: "Dollar", plural: "Dollars", fractionSingular: "Cent", fractionPlural: "Cents" },
  EUR: { code: "EUR", symbol: "€", singular: "Euro", plural: "Euros", fractionSingular: "Cent", fractionPlural: "Cents" },
  GBP: { code: "GBP", symbol: "£", singular: "Pound", plural: "Pounds", fractionSingular: "Penny", fractionPlural: "Pence" },
  AED: { code: "AED", symbol: "Dh", singular: "Dirham", plural: "Dirhams", fractionSingular: "Fil", fractionPlural: "Fils" },
}

export interface NumberToWordsOptions {
  /** Default: "indian" */
  system?: NumberSystem
  /** "plain" = number words only; "currency" = currency format */
  mode?: ConversionMode
  /** Currency preset: "INR" | "USD" | "EUR" | "GBP" | "AED" | "CUSTOM" */
  currencyCode?: CurrencyPreset | string
  /** Currency main label (e.g. "Dollars" or "Rupees") */
  currencyName?: string
  /** Currency sub label (e.g. "Cents" or "Paise") */
  paisaName?: string
  /** Append "Only" at the end in currency mode. Default: true */
  appendOnly?: boolean
}

export interface NumberToWordsResult {
  /** Final formatted output string */
  words: string
  /** Words for the integer part alone */
  wholeWords: string
  /** Words for the decimal (paisa/cents) part alone, empty string if none */
  decimalWords: string
  isNegative: boolean
  wholeNumber: number
  /** Integer 0–99 representing the paise / cents */
  decimalNumber: number
}

function resolveCurrency(options: NumberToWordsOptions): { mainSingular: string; mainPlural: string; fracSingular: string; fracPlural: string } {
  const code = options.currencyCode || (options.system === "international" ? "USD" : "INR")
  const preset = CURRENCY_PRESETS[code]

  if (preset) {
    return {
      mainSingular: options.currencyName || preset.singular,
      mainPlural: options.currencyName || preset.plural,
      fracSingular: options.paisaName || preset.fractionSingular,
      fracPlural: options.paisaName || preset.fractionPlural,
    }
  }

  const mainName = options.currencyName || "Rupees"
  const fracName = options.paisaName || "Paise"

  return {
    mainSingular: mainName,
    mainPlural: mainName,
    fracSingular: fracName,
    fracPlural: fracName,
  }
}

export function convertNumberToWords(
  value: number,
  options: NumberToWordsOptions = {},
): NumberToWordsResult {
  const {
    system = "indian",
    mode = "plain",
    appendOnly = true,
  } = options

  if (!Number.isFinite(value)) {
    return { words: "Invalid number", wholeWords: "", decimalWords: "", isNegative: false, wholeNumber: 0, decimalNumber: 0 }
  }

  const isNegative = value < 0
  const abs = Math.abs(value)
  let wholeNumber = Math.floor(abs)
  let decimalNumber = Math.round((abs - wholeNumber) * 100)

  // Handle edge case where rounding cents up reaches 100
  if (decimalNumber === 100) {
    wholeNumber += 1
    decimalNumber = 0
  }

  const toWords = system === "indian" ? toWordsIndian : toWordsInternational

  const wholeWords = wholeNumber === 0 ? "" : toWords(wholeNumber)
  const decimalWords = decimalNumber > 0 ? twoDigits(decimalNumber) : ""

  let words: string

  if (mode === "currency") {
    const cur = resolveCurrency({ ...options, system })
    const mainLabel = wholeNumber === 1 ? cur.mainSingular : cur.mainPlural
    const fracLabel = decimalNumber === 1 ? cur.fracSingular : cur.fracPlural

    if (wholeNumber === 0 && decimalNumber === 0) {
      words = `Zero ${cur.mainPlural}`
    } else if (wholeNumber > 0 && decimalNumber > 0) {
      words = `${wholeWords} ${mainLabel} and ${decimalWords} ${fracLabel}`
    } else if (wholeNumber > 0) {
      words = `${wholeWords} ${mainLabel}`
    } else {
      words = `${decimalWords} ${fracLabel}`
    }
    if (appendOnly) words += " Only"
  } else {
    // plain mode
    if (wholeNumber === 0 && decimalNumber === 0) {
      words = "Zero"
    } else {
      words = wholeWords || "Zero"
      if (decimalNumber > 0) words += ` Point ${decimalWords}`
    }
  }

  if (isNegative) words = `Minus ${words}`

  return { words, wholeWords, decimalWords, isNegative, wholeNumber, decimalNumber }
}
