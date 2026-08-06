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
const toPaise = (value: number): number => Math.round(value * 100)

/**
 * SIP (Systematic Investment Plan) growth engine using the standard Indian
 * mutual fund convention:
 *
 *   FV = P × ((1+r)^n − 1) / r × (1+r)
 *
 * Two conventions are assumed, both matching how most Indian calculators
 * (and AMFI) work:
 *
 *   1. Contributions are made at the START of each month — the "SIP in
 *      advance" annuity-due convention. The trailing × (1+r) term accounts
 *      for the first instalment being invested immediately.
 *   2. The monthly rate is the annual rate divided by 12 (r = annual/12/100)
 *      and the number of periods is Years × 12 + Months — NOT rounded down
 *      to decimal years. This is the simple-rate convention used by AMFI and
 *      most Indian tools (Groww uses a compounded geometric monthly rate
 *      instead, which gives a slightly lower value).
 *
 * All running amounts are tracked in integer paise — the same exact-arithmetic
 * approach used by the PPF and GST calculators — so Total Invested +
 * Estimated Return equals Maturity Value precisely, with no floating-point
 * drift. At 0% growth the maturity value simply equals the total invested.
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

  const monthlyPaise = toPaise(p)
  const investedPaise = monthlyPaise * n

  let maturityRupees = investedPaise / 100
  if (r > 0 && n > 0) {
    const growth = Math.pow(1 + r, n)
    maturityRupees = p * ((growth - 1) / r) * (1 + r)
  }
  const maturityPaise = Math.round(maturityRupees * 100)
  const returnPaise = Math.max(0, maturityPaise - investedPaise)

  return {
    monthly: round2(p),
    annualRate: round2(annual),
    months: n,
    invested: round2(investedPaise / 100),
    expectedReturn: round2(returnPaise / 100),
    maturityValue: round2(maturityPaise / 100),
  }
}

export default {
  family: "calculator" as const,
  run: calculateSip,
}
