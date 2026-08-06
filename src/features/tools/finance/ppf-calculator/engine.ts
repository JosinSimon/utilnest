import type { CalculatorEngine } from "@/features/tools/engine"

export interface PpfInput {
  annual: number
  years: number
}

export interface PpfResult {
  annual: number
  years: number
  invested: number
  interest: number
  maturityValue: number
}

const DEFAULT_PPF_RATE = 7.1

const round2 = (value: number): number => Math.round(value * 100) / 100

/**
 * PPF (Public Provident Fund) maturity engine. Interest compounds annually at
 * the government-declared rate (currently 7.1%). Using the standard assumption
 * of deposits made at the start of each year:
 *
 *   balance = P × ((1+r)^n − 1) / r × (1+r)   (annuity due)
 */
export const calculatePpf: CalculatorEngine<PpfInput, PpfResult> = ({
  annual,
  years,
}) => {
  const p = Math.max(0, annual)
  const n = Math.max(0, Math.floor(years))
  const r = DEFAULT_PPF_RATE / 100

  const invested = p * n

  let maturity = invested
  if (r > 0 && n > 0) {
    const growth = Math.pow(1 + r, n)
    maturity = p * ((growth - 1) / r) * (1 + r)
  }

  return {
    annual: p,
    years: n,
    invested: round2(invested),
    interest: round2(Math.max(0, maturity - invested)),
    maturityValue: round2(maturity),
  }
}

export default {
  family: "calculator" as const,
  run: calculatePpf,
}