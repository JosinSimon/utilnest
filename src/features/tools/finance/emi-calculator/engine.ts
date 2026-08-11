import type { CalculatorEngine } from "@/features/tools/engine"

export interface EmiInput {
  principal: number
  annualRate: number
  years: number
  months: number
}

export interface EmiScheduleRow {
  month: number
  payment: number
  interest: number
  principal: number
  balance: number
}

export interface EmiResult {
  principal: number
  annualRate: number
  tenureMonths: number
  monthlyRate: number
  emi: number
  totalPayment: number
  totalInterest: number
  schedule: EmiScheduleRow[]
}

const round2 = (value: number): number => Math.round(value * 100) / 100

/**
 * Standard loan amortization (EMI) engine.
 *
 * - EMI is computed with the closed-form annuity formula and rounded to paise.
 * - The amortization schedule is then derived from that fixed EMI; the final
 *   payment clears the outstanding balance exactly, so the schedule always
 *   reconciles: principal + total interest === total payment.
 * - 0% rate, zero principal and zero tenure are handled deterministically.
 */
export const calculateEmi: CalculatorEngine<EmiInput, EmiResult> = ({
  principal,
  annualRate,
  years,
  months,
}) => {
  const p = Math.max(0, principal)
  const yearsPart = Math.max(0, Math.floor(years))
  const monthsPart = Math.max(0, Math.floor(months))
  const n = yearsPart * 12 + monthsPart
  const annual = Math.max(0, annualRate)
  const r = annual / 100 / 12

  const empty = (): EmiResult => ({
    principal: p,
    annualRate: annual,
    tenureMonths: n,
    monthlyRate: round2(r * 100),
    emi: 0,
    totalPayment: 0,
    totalInterest: 0,
    schedule: [],
  })

  if (p === 0 || n === 0) return empty()

  let emi: number
  if (r === 0) {
    emi = p / n
  } else {
    const factor = Math.pow(1 + r, n)
    emi = (p * r * factor) / (factor - 1)
  }
  emi = round2(emi)

  const schedule: EmiScheduleRow[] = []
  let balanceCents = Math.round(p * 100)
  let totalPaymentCents = 0
  let totalInterestCents = 0
  const emiCents = Math.round(emi * 100)

  for (let month = 1; month <= n; month++) {
    const interestCents = Math.round(balanceCents * r)
    let paymentCents: number
    if (month === n) {
      paymentCents = balanceCents + interestCents
    } else {
      paymentCents = emiCents
    }
    const principalCents = Math.max(0, paymentCents - interestCents)
    balanceCents = Math.max(0, balanceCents - principalCents)
    totalPaymentCents += paymentCents
    totalInterestCents += interestCents
    schedule.push({
      month,
      payment: paymentCents / 100,
      interest: interestCents / 100,
      principal: principalCents / 100,
      balance: balanceCents / 100,
    })
  }

  return {
    principal: p,
    annualRate: annual,
    tenureMonths: n,
    monthlyRate: round2(r * 100),
    emi,
    totalPayment: totalPaymentCents / 100,
    totalInterest: totalInterestCents / 100,
    schedule,
  }
}

export default {
  family: "calculator" as const,
  run: calculateEmi,
}
