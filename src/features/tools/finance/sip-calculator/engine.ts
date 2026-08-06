import type { CalculatorEngine } from "@/features/tools/engine"

export interface SipInput {
  monthly: number
  annualRate: number
  years: number
  months: number
}

export interface SipResult {
  monthly: number
  annualRate: number
  months: number
  invested: number
  expectedReturn: number
  maturityValue: number
}

const round2 = (value: number): number => Math.round(value * 100) / 100

/**
 * SIP (Systematic Investment Plan) growth engine.
 *
 * Contributions are assumed to happen at the start of each month, matching how
 * most mutual fund SIPs are executed (the "SIP in advance" convention). The
 * maturity value is the future value of an annuity due:
 *
 *   FV = P × ((1+r)^n − 1) / r × (1+r)
 *
 * At 0% growth the maturity value simply equals the total invested.
 */
export const calculateSip: CalculatorEngine<SipInput, SipResult> = ({
  monthly,
  annualRate,
  years,
  months,
}) => {
  const p = Math.max(0, monthly)
  const y = Math.max(0, Math.floor(years))
  const m = Math.max(0, Math.floor(months))
  const n = y * 12 + m
  const annual = Math.max(0, annualRate)
  const r = annual / 100 / 12

  const invested = p * n

  let maturity: number
  if (r === 0) {
    maturity = invested
  } else {
    const growth = Math.pow(1 + r, n)
    maturity = p * ((growth - 1) / r) * (1 + r)
  }

  return {
    monthly: p,
    annualRate: annual,
    months: n,
    invested: round2(invested),
    expectedReturn: round2(maturity - invested),
    maturityValue: round2(maturity),
  }
}

export default {
  family: "calculator" as const,
  run: calculateSip,
}
