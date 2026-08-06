import type { CalculatorEngine } from "@/features/tools/engine"

export interface GstInput {
  amount: number
  rate: number
  inclusive: boolean
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

const isIntraState = false // true → CGST + SGST split, false → IGST

export const calculateGst: CalculatorEngine<GstInput, GstResult> = ({
  amount,
  rate,
  inclusive,
}) => {
  const r = rate / 100
  let base: number
  let total: number

  if (inclusive) {
    total = amount
    base = amount / (1 + r)
  } else {
    base = amount
    total = amount * (1 + r)
  }

  const gstAmount = total - base
  const half = gstAmount / 2

  return {
    base,
    total,
    gstAmount,
    rate,
    cgst: isIntraState ? half : 0,
    sgst: isIntraState ? half : 0,
    igst: isIntraState ? 0 : gstAmount,
  }
}

export default {
  family: "calculator" as const,
  run: calculateGst,
  rates: GstRates,
}