import type { CalculatorEngine } from "@/features/tools/engine"
import { sellingPriceFromMarkup, markupFromPrices, calculateProfit } from "@/features/tools/business/shared/pricing"

export interface MarkupInput {
  mode: "costToPrice" | "findMarkup"
  cost: number
  markupPct?: number
  sell?: number
}

export interface MarkupResult {
  sell: number
  markupPct: number
  marginPct: number
  profit: number
}

export const markupEngine: CalculatorEngine<MarkupInput, MarkupResult> = (input) => {
  if (input.mode === "costToPrice") {
    if (input.markupPct === undefined) throw new Error("markupPct required for costToPrice mode")
    const sell = sellingPriceFromMarkup(input.cost, input.markupPct)
    const profitData = calculateProfit(input.cost, sell)
    return {
      sell,
      markupPct: input.markupPct,
      marginPct: profitData.margin,
      profit: profitData.profit
    }
  } else {
    if (input.sell === undefined) throw new Error("sell required for findMarkup mode")
    const markupPct = markupFromPrices(input.cost, input.sell)
    const profitData = calculateProfit(input.cost, input.sell)
    return {
      sell: input.sell,
      markupPct,
      marginPct: profitData.margin,
      profit: profitData.profit
    }
  }
}

export default { family: "calculator" as const, run: markupEngine }
