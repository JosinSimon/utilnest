import type { CalculatorEngine } from "@/features/tools/engine"

export interface InterestInput {
  principal: number
  annualRate: number
  years: number
  months: number
  compound: boolean
  /** Compounding frequency per year: 1 = yearly, 2 = half-yearly, 4 = quarterly, 12 = monthly. */
  frequency: 1 | 2 | 4 | 12
}

export interface InterestResult {
  principal: number
  annualRate: number
  years: number
  interest: number
  maturityValue: number
}

const round2 = (value: number): number => Math.round(value * 100) / 100

/**
 * Simple vs compound interest engine.
 *
 * Simple:   interest = P × r × t
 * Compound: interest = P × (1 + r/f)^(t×f) − P
 *
 * where r is the annual decimal rate, t is the tenure in years and f is the
 * compounding frequency. Compound at 0% rate or 0 tenure equals principal.
 */
export const calculateInterest: CalculatorEngine<InterestInput, InterestResult> = ({
  principal,
  annualRate,
  years,
  months,
  compound,
  frequency,
}) => {
  const p = Math.max(0, principal)
  const y = Math.max(0, Math.floor(years))
  const m = Math.max(0, Math.floor(months))
  const t = y + m / 12
  const annual = Math.max(0, annualRate)
  const r = annual / 100
  const f = frequency

  let maturity = p
  if (r > 0 && t > 0) {
    if (compound) {
      maturity = p * Math.pow(1 + r / f, t * f)
    } else {
      maturity = p * (1 + r * t)
    }
  }

  return {
    principal: p,
    annualRate: annual,
    years: t,
    interest: round2(Math.max(0, maturity - p)),
    maturityValue: round2(maturity),
  }
}

export default {
  family: "calculator" as const,
  run: calculateInterest,
}
