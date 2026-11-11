import type { CalculatorEngine } from "@/features/tools/engine"

export type PrepaymentStrategy = "reduce-tenure" | "reduce-emi"

export interface PrepaymentInput {
  principal: number
  annualRate: number
  tenureYears: number
  /** One-time prepayment and the loan month (1-based) it is paid in. */
  lumpSum?: number
  lumpSumMonth?: number
  /** Prepayment paid once a year, at the end of every 12th month. */
  yearlyPrepayment?: number
  /** Extra amount paid with every EMI. */
  extraMonthly?: number
  strategy: PrepaymentStrategy
}

export interface LoanSummary {
  months: number
  totalInterest: number
  totalPaid: number
  emi: number
}

export interface PrepaymentResult {
  original: LoanSummary
  withPrepayment: LoanSummary & { totalPrepaid: number; finalEmi: number }
  interestSaved: number
  monthsSaved: number
}

const round2 = (v: number): number => Math.round(v * 100) / 100

export function emiFor(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0 || principal <= 0) return 0
  if (monthlyRate === 0) return principal / months
  const f = Math.pow(1 + monthlyRate, months)
  return (principal * monthlyRate * f) / (f - 1)
}

interface SimOptions {
  lumpSum: number
  lumpSumMonth: number
  yearly: number
  extraMonthly: number
  strategy: PrepaymentStrategy
}

function simulate(principal: number, r: number, n: number, opts: SimOptions) {
  let balance = principal
  // Simulate with the exact EMI; round only for display.
  let emi = emiFor(principal, r, n)
  const firstEmi = emi
  let month = 0
  let interestPaid = 0
  let regularPaid = 0
  let prepaid = 0
  // Guard against loans that never amortise (EMI below interest).
  const maxMonths = n + 1200

  while (balance > 0.005 && month < maxMonths) {
    month += 1
    const interest = balance * r
    interestPaid += interest
    const due = balance + interest
    const payment = Math.min(emi, due)
    regularPaid += payment
    balance = due - payment

    let extra = opts.extraMonthly
    if (opts.lumpSum > 0 && month === opts.lumpSumMonth) extra += opts.lumpSum
    if (opts.yearly > 0 && month % 12 === 0) extra += opts.yearly
    if (extra > 0 && balance > 0) {
      const applied = Math.min(extra, balance)
      balance -= applied
      prepaid += applied
      if (opts.strategy === "reduce-emi" && balance > 0.005) {
        const remaining = Math.max(1, n - month)
        emi = emiFor(balance, r, remaining)
      }
    }
  }

  return {
    months: month,
    totalInterest: round2(interestPaid),
    totalPaid: round2(regularPaid + prepaid),
    emi: round2(firstEmi),
    finalEmi: round2(emi),
    totalPrepaid: round2(prepaid),
  }
}

/**
 * Home loan prepayment simulator.
 *
 * Runs the loan month by month at a fixed EMI, applying prepayments after the
 * EMI of the month they fall in. "reduce-tenure" keeps the EMI and finishes the
 * loan early; "reduce-emi" keeps the end date and recalculates the EMI on the
 * remaining balance after each prepayment.
 */
export const calculatePrepayment: CalculatorEngine<PrepaymentInput, PrepaymentResult | null> = (
  input,
) => {
  const principal = Math.max(0, input.principal)
  const n = Math.max(0, Math.round(input.tenureYears * 12))
  const annual = Math.max(0, input.annualRate)
  if (principal <= 0 || n <= 0 || !Number.isFinite(principal) || !Number.isFinite(annual)) return null
  const r = annual / 100 / 12

  const none: SimOptions = { lumpSum: 0, lumpSumMonth: 0, yearly: 0, extraMonthly: 0, strategy: input.strategy }
  const base = simulate(principal, r, n, none)
  const withPre = simulate(principal, r, n, {
    lumpSum: Math.max(0, input.lumpSum ?? 0),
    lumpSumMonth: Math.max(1, Math.round(input.lumpSumMonth ?? 1)),
    yearly: Math.max(0, input.yearlyPrepayment ?? 0),
    extraMonthly: Math.max(0, input.extraMonthly ?? 0),
    strategy: input.strategy,
  })

  return {
    original: {
      months: base.months,
      totalInterest: base.totalInterest,
      totalPaid: base.totalPaid,
      emi: base.emi,
    },
    withPrepayment: {
      months: withPre.months,
      totalInterest: withPre.totalInterest,
      totalPaid: withPre.totalPaid,
      emi: withPre.emi,
      finalEmi: withPre.finalEmi,
      totalPrepaid: withPre.totalPrepaid,
    },
    interestSaved: round2(base.totalInterest - withPre.totalInterest),
    monthsSaved: base.months - withPre.months,
  }
}

export default { family: "calculator" as const, run: calculatePrepayment }
