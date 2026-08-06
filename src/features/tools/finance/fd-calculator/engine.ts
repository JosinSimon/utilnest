import type { CalculatorEngine } from "@/features/tools/engine"

export interface FdInput {
  principal: number
  annualRate: number
  years: number
  months: number
}

export interface FdResult {
  principal: number
  annualRate: number
  years: number
  interest: number
  maturityValue: number
}

const round2 = (value: number): number => Math.round(value * 100) / 100

/**
 * Fixed Deposit maturity engine using quarterly compounding, the standard for
 * most Indian banks/FD products.
 *
 *   maturity = P × (1 + r/4)^(n×4)   (interest compounded each quarter)
 *
 * Interest = maturity − principal. At 0% rate or zero tenure the maturity
 * simply equals the principal.
 */
export const calculateFd: CalculatorEngine<FdInput, FdResult> = ({
  principal,
  annualRate,
  years,
  months,
}) => {
  const p = Math.max(0, principal)
  const y = Math.max(0, Math.floor(years))
  const m = Math.max(0, Math.floor(months))
  const n = y + m / 12
  const annual = Math.max(0, annualRate)
  const r = annual / 100

  let maturity = p
  if (r > 0 && n > 0) {
    const quarters = n * 4
    maturity = p * Math.pow(1 + r / 4, quarters)
  }

  return {
    principal: p,
    annualRate: annual,
    years: n,
    interest: round2(Math.max(0, maturity - p)),
    maturityValue: round2(maturity),
  }
}

export default {
  family: "calculator" as const,
  run: calculateFd,
}