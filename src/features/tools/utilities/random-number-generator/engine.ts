import type { CalculatorEngine } from "@/features/tools/engine"

export type RandomMode = "integer" | "decimal"

export interface RandomInput {
  min: number
  max: number
  count: number
  unique: boolean
  mode: RandomMode
  decimals?: number
}

export interface RandomResult {
  results: number[]
  formattedList: string
  isValid: boolean
  errorMessage?: string
}

function getCryptoRandomUint32(): number {
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1)
    window.crypto.getRandomValues(array)
    return array[0]
  }
  // Safe Node.js / fallback fallback
  return Math.floor(Math.random() * 0xffffffff)
}

export function getRandomIntInclusive(min: number, max: number): number {
  const range = max - min + 1
  if (range <= 0) return min
  const maxAllowed = Math.floor(0xffffffff / range) * range
  let rand: number
  do {
    rand = getCryptoRandomUint32()
  } while (rand >= maxAllowed)
  return min + (rand % range)
}

export function getRandomFloat(min: number, max: number, decimals = 4): number {
  const rand0to1 = getCryptoRandomUint32() / 0xffffffff
  const val = min + rand0to1 * (max - min)
  const factor = Math.pow(10, decimals)
  return Math.round(val * factor) / factor
}

export function generateRandomNumbers(input: RandomInput): RandomResult {
  const { min, max, count, unique, mode, decimals = 2 } = input

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { results: [], formattedList: "", isValid: false, errorMessage: "Invalid min or max value." }
  }

  if (min > max) {
    return { results: [], formattedList: "", isValid: false, errorMessage: "Minimum value cannot be greater than Maximum value." }
  }

  if (count <= 0 || count > 1000) {
    return { results: [], formattedList: "", isValid: false, errorMessage: "Count must be between 1 and 1000." }
  }

  if (mode === "integer") {
    const range = max - min + 1
    if (unique && count > range) {
      return {
        results: [],
        formattedList: "",
        isValid: false,
        errorMessage: `Cannot generate ${count} unique numbers in a range of size ${range}.`,
      }
    }

    const results: number[] = []
    const seen = new Set<number>()

    while (results.length < count) {
      const val = getRandomIntInclusive(min, max)
      if (unique) {
        if (!seen.has(val)) {
          seen.add(val)
          results.push(val)
        }
      } else {
        results.push(val)
      }
    }

    return {
      results,
      formattedList: results.join(", "),
      isValid: true,
    }
  }

  // mode === "decimal"
  const results: number[] = []
  const seen = new Set<number>()

  while (results.length < count) {
    const val = getRandomFloat(min, max, decimals)
    if (unique) {
      if (!seen.has(val)) {
        seen.add(val)
        results.push(val)
      }
    } else {
      results.push(val)
    }
  }

  return {
    results,
    formattedList: results.join(", "),
    isValid: true,
  }
}

export const randomEngine: CalculatorEngine<RandomInput, RandomResult> = (input) => {
  return generateRandomNumbers(input)
}

export default { family: "calculator" as const, run: randomEngine }
