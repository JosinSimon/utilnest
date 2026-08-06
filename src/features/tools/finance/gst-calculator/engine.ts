import type { CalculatorEngine } from "@/features/tools/engine"

export interface GstInput {
  amount: number
  rate: number
  inclusive: boolean
  /** true = inter-state sale → IGST. false = intra-state → CGST + SGST. */
  interState?: boolean
}

export interface GstResult {
  base: number
  gstAmount: number
  cgst: number
  sgst: number
  igst: number
  rate: number
  total: number
}

export const GstRates = [0, 3, 5, 12, 18, 28] as const

export const calculateGst: CalculatorEngine<GstInput, GstResult> = ({
  amount,
  rate,
  inclusive,
  interState = false,
}) => {
  const r = rate / 100
  let base: number
  let total: number

  if (inclusive) {
    // entered amount already includes GST
    total = amount
    base = amount / (1 + r)
  } else {
    // entered amount is the net value before GST
    base = amount
    total = amount * (1 + r)
  }

  const gstAmount = total - base

  return {
    base,
    total,
    gstAmount,
    rate,
    cgst: interState ? 0 : gstAmount / 2,
    sgst: interState ? 0 : gstAmount / 2,
    igst: interState ? gstAmount : 0,
  }
}

export default {
  family: "calculator" as const,
  run: calculateGst,
  rates: GstRates,
}