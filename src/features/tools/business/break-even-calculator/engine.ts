import type { CalculatorEngine } from "@/features/tools/engine"
import { calculateBreakEven } from "@/features/tools/business/shared/pricing"

export interface BreakEvenInput {
  fixedCosts: number
  variableCostPerUnit: number
  sellingPricePerUnit: number
  plannedUnits?: number
  dailySalesVolume?: number
}

export interface BreakEvenResult {
  contributionPerUnit: number
  breakEvenUnits: number
  breakEvenRevenue: number
  isValid: boolean
  plannedProfit?: number
  daysToBreakEven?: number
  monthsToBreakEven?: number
}

export const breakEvenEngine: CalculatorEngine<BreakEvenInput, BreakEvenResult> = (input) => {
  const baseResult = calculateBreakEven(input.fixedCosts, input.variableCostPerUnit, input.sellingPricePerUnit)
  
  let plannedProfit = undefined
  if (input.plannedUnits !== undefined && baseResult.isValid) {
    plannedProfit = (baseResult.contributionPerUnit * input.plannedUnits) - input.fixedCosts
  }

  let daysToBreakEven = undefined
  let monthsToBreakEven = undefined
  if (input.dailySalesVolume && input.dailySalesVolume > 0 && baseResult.isValid && Number.isFinite(baseResult.breakEvenUnits)) {
    daysToBreakEven = Math.ceil(baseResult.breakEvenUnits / input.dailySalesVolume)
    monthsToBreakEven = Math.round((daysToBreakEven / 30) * 10) / 10
  }

  return {
    ...baseResult,
    plannedProfit,
    daysToBreakEven,
    monthsToBreakEven,
  }
}

export default { family: "calculator" as const, run: breakEvenEngine }
