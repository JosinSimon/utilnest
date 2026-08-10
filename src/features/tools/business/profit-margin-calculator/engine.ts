import type { CalculatorEngine } from "@/features/tools/engine"
import { calculateProfit, type ProfitResult } from "@/features/tools/business/shared/pricing"

export interface ProfitMarginInput {
  cost: number
  sell: number
  shippingCost?: number
  adCost?: number
  gatewayFeePct?: number
}

export type ProfitMarginResult = ProfitResult

export const profitMarginEngine: CalculatorEngine<ProfitMarginInput, ProfitMarginResult> = (input) => {
  return calculateProfit(input.cost, input.sell, {
    shippingCost: input.shippingCost,
    adCost: input.adCost,
    gatewayFeePct: input.gatewayFeePct,
  })
}

export default { family: "calculator" as const, run: profitMarginEngine }
