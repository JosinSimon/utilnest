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
const toPaise = (value: number): number => Math.round(value * 100)

/**
 * Recurring Deposit maturity engine using the standard Indian banking formula
 * (as used by SBI, HDFC, ICICI and India Post):
 *
 *   M = P × ((1 + i)^n − 1) / (1 − (1 + i)^(−1/3))
 *
 * where P is the monthly deposit, i is the quarterly interest rate
 * (annual ÷ 4) and n is the number of quarters. A deposit made in the first
 * month of a quarter earns interest for the whole quarter, the second month
 * for two-thirds and the third for one-third — which is what the −1/3
 * exponent in the denominator captures. Because each monthly deposit is
 * compounded over a fractional number of quarters, n is the exact total
 * months divided by 3 (not floored), so odd tenures such as 2 years 7 months
 * compound correctly for all 31 deposits.
 *
 * All running amounts are tracked in integer paise — the same exact-arithmetic
 * approach used by the PPF and GST calculators — so Total Deposited +
 * Total Interest equals Maturity Value precisely, with no floating-point drift.
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

  const monthlyPaise = toPaise(p)
  const investedPaise = monthlyPaise * totalMonths

  let maturityRupees = investedPaise / 100
  if (i > 0 && totalMonths > 0) {
    const n = totalMonths / 3
    const factor = Math.pow(1 + i, n)
    maturityRupees = p * ((factor - 1) / (1 - Math.pow(1 + i, -1 / 3)))
  }
  const maturityPaise = Math.round(maturityRupees * 100)
  const interestPaise = Math.max(0, maturityPaise - investedPaise)

  return {
    monthly: round2(p),
    annualRate: round2(annual),
    months: totalMonths,
    invested: round2(investedPaise / 100),
    interest: round2(interestPaise / 100),
    maturityValue: round2(maturityPaise / 100),
  }
}

export default {
  family: "calculator" as const,
  run: calculateRd,
}
