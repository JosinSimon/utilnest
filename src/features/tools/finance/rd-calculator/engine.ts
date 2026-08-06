import type { CalculatorEngine } from "@/features/tools/engine"

export interface RdInput {
  monthly: number
  annualRate: number
  years: number
  months: number
}

export interface RdResult {
  monthly: number
  annualRate: number
  months: number
  invested: number
  interest: number
  maturityValue: number
}

const round2 = (value: number): number => Math.round(value * 100) / 100

/**
 * Recurring Deposit maturity engine using the standard Indian bank formula.
 *
 *   M = P × ((1 + i)^n − 1) / (1 − (1 + i)^(−1/3))
 *
 * where P is the monthly deposit, i is the interest rate per quarter
 * (annual ÷ 4) and n is the number of quarters. Interest is compounded
 * quarterly while deposits are made monthly.
 */
export const calculateRd: CalculatorEngine<RdInput, RdResult> = ({
  monthly,
  annualRate,
  years,
  months,
}) => {
  const p = Math.max(0, monthly)
  const y = Math.max(0, Math.floor(years))
  const m = Math.max(0, Math.floor(months))
  const totalMonths = y * 12 + m
  const annual = Math.max(0, annualRate)
  const i = annual / 100 / 4

  const invested = p * totalMonths

  let maturity = invested
  if (i > 0 && totalMonths > 0) {
    const quarters = Math.floor(totalMonths / 3)
    if (quarters > 0) {
      const factor = Math.pow(1 + i, quarters)
      maturity = p * ((factor - 1) / (1 - Math.pow(1 + i, -1 / 3)))
    }
  }

  return {
    monthly: p,
    annualRate: annual,
    months: totalMonths,
    invested: round2(invested),
    interest: round2(Math.max(0, maturity - invested)),
    maturityValue: round2(maturity),
  }
}

export default {
  family: "calculator" as const,
  run: calculateRd,
}
