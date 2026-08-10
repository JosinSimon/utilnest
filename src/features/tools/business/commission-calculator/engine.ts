import type { CalculatorEngine } from "@/features/tools/engine"
import { calculateCommission } from "@/features/tools/business/shared/pricing"

export type CommissionMode = "flat" | "tiered"

export interface CommissionInput {
  saleAmount: number
  commissionRate: number
  mode?: CommissionMode
  // Tiered options
  tierThreshold?: number
  tier2Rate?: number
  // GST option
  includeGst?: boolean
  gstRate?: number // e.g. 18%
}

export interface CommissionResult {
  saleAmount: number
  commission: number
  amountAfterCommission: number
  effectiveRatePct: number
  mode: CommissionMode
  gstAmount: number
  totalCommissionWithGst: number
  tier1Commission?: number
  tier2Commission?: number
}

const r2 = (v: number): number => Math.round(v * 100) / 100

export const commissionEngine: CalculatorEngine<CommissionInput, CommissionResult | null> = (input) => {
  if (isNaN(input.saleAmount) || input.saleAmount < 0) {
    return null
  }

  const mode = input.mode || "flat"
  const includeGst = input.includeGst || false
  const gstRate = input.gstRate || 18

  let commission = 0
  let tier1Commission: number | undefined
  let tier2Commission: number | undefined

  if (mode === "flat") {
    if (isNaN(input.commissionRate) || input.commissionRate < 0) return null
    const base = calculateCommission(input.saleAmount, input.commissionRate)
    commission = base.commission
  } else {
    // Tiered mode
    const rate1 = input.commissionRate || 0
    const threshold = input.tierThreshold || 0
    const rate2 = input.tier2Rate || 0

    if (input.saleAmount <= threshold) {
      tier1Commission = r2((input.saleAmount * rate1) / 100)
      tier2Commission = 0
      commission = tier1Commission
    } else {
      tier1Commission = r2((threshold * rate1) / 100)
      const excess = input.saleAmount - threshold
      tier2Commission = r2((excess * rate2) / 100)
      commission = r2(tier1Commission + tier2Commission)
    }
  }

  const amountAfterCommission = r2(input.saleAmount - commission)
  const effectiveRatePct = input.saleAmount > 0 ? r2((commission / input.saleAmount) * 100) : 0

  const gstAmount = includeGst ? r2((commission * gstRate) / 100) : 0
  const totalCommissionWithGst = r2(commission + gstAmount)

  return {
    saleAmount: input.saleAmount,
    commission,
    amountAfterCommission,
    effectiveRatePct,
    mode,
    gstAmount,
    totalCommissionWithGst,
    tier1Commission,
    tier2Commission,
  }
}

export default { family: "calculator" as const, run: commissionEngine }
