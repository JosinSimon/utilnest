import type { CalculatorEngine } from "@/features/tools/engine"
import { calculateDiscount } from "@/features/tools/business/shared/pricing"

export type DiscountMode = "additive" | "compound"

export interface DiscountInput {
  original: number
  discountPct: number
  additionalDiscountPct?: number
  mode?: DiscountMode
  costPrice?: number
}

export interface DiscountResult {
  savings: number
  finalPrice: number
  totalDiscountPct: number
  mode: DiscountMode
  costPrice?: number
  originalProfit?: number
  originalMarginPct?: number
  remainingProfit?: number
  remainingMarginPct?: number
  profitErosionPct?: number
}

const r2 = (v: number): number => Math.round(v * 100) / 100

export const discountEngine: CalculatorEngine<DiscountInput, DiscountResult> = (input) => {
  const mode = input.mode || "additive"
  const addPct = input.additionalDiscountPct || 0
  const costPrice = input.costPrice

  let savings: number
  let finalPrice: number
  let totalDiscountPct: number

  if (mode === "additive" || addPct === 0) {
    totalDiscountPct = r2(input.discountPct + addPct)
    const pass = calculateDiscount(input.original, totalDiscountPct)
    savings = pass.savings
    finalPrice = pass.finalPrice
  } else {
    // Compound / Sequential mode
    const firstPass = calculateDiscount(input.original, input.discountPct)
    const secondPass = calculateDiscount(firstPass.finalPrice, addPct)
    savings = r2(firstPass.savings + secondPass.savings)
    finalPrice = secondPass.finalPrice
    totalDiscountPct = input.original > 0 ? r2((savings / input.original) * 100) : 0
  }

  let originalProfit: number | undefined
  let originalMarginPct: number | undefined
  let remainingProfit: number | undefined
  let remainingMarginPct: number | undefined
  let profitErosionPct: number | undefined

  if (typeof costPrice === "number" && costPrice >= 0 && input.original > 0) {
    originalProfit = r2(input.original - costPrice)
    originalMarginPct = r2((originalProfit / input.original) * 100)
    remainingProfit = r2(finalPrice - costPrice)
    remainingMarginPct = finalPrice > 0 ? r2((remainingProfit / finalPrice) * 100) : 0

    if (originalProfit > 0) {
      profitErosionPct = r2(((originalProfit - remainingProfit) / originalProfit) * 100)
    } else {
      profitErosionPct = 0
    }
  }

  return {
    savings,
    finalPrice,
    totalDiscountPct,
    mode,
    costPrice,
    originalProfit,
    originalMarginPct,
    remainingProfit,
    remainingMarginPct,
    profitErosionPct,
  }
}

export default { family: "calculator" as const, run: discountEngine }
