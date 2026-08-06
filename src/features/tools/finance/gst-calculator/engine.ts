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

/** Round a rupee/paisa value to whole paise (2 decimal places). */
const toPaise = (value: number): number => Math.round(value * 100)

export const calculateGst: CalculatorEngine<GstInput, GstResult> = ({
  amount,
  rate,
  inclusive,
  interState = false,
}) => {
  const r = rate / 100
  let basePaise: number
  let totalPaise: number

  if (inclusive) {
    // entered amount already includes GST → it is the (paise-exact) total
    totalPaise = toPaise(amount)
    basePaise = toPaise(amount / (1 + r))
  } else {
    // entered amount is the net value before GST → it is the paise-exact base
    basePaise = toPaise(amount)
    totalPaise = toPaise(amount * (1 + r))
  }

  // Remainder after rounding always goes to GST so base + gst === total exactly.
  const gstPaise = totalPaise - basePaise

  // Odd paisa from an uneven split is allocated to SGST (never CGST),
  // so cgst + sgst === gstAmount to the paisa in every case.
  const cgstPaise = interState ? 0 : Math.floor(gstPaise / 2)
  const sgstPaise = interState ? 0 : gstPaise - cgstPaise
  const igstPaise = interState ? gstPaise : 0

  return {
    base: basePaise / 100,
    total: totalPaise / 100,
    gstAmount: gstPaise / 100,
    rate,
    cgst: cgstPaise / 100,
    sgst: sgstPaise / 100,
    igst: igstPaise / 100,
  }
}

export default {
  family: "calculator" as const,
  run: calculateGst,
  rates: GstRates,
}