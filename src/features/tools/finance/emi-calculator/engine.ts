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
  let balance = p
  let totalPayment = 0
  let totalInterest = 0

  for (let month = 1; month <= n; month++) {
    const interest = balance * r
    let payment: number
    if (month === n) {
      payment = round2(balance + interest)
    } else {
      payment = emi
    }
    const principalPart = payment - interest
    balance = Math.max(0, balance - principalPart)
    totalPayment += payment
    totalInterest += interest
    schedule.push({
      month,
      payment: round2(payment),
      interest: round2(interest),
      principal: round2(principalPart),
      balance: round2(balance),
    })
  }

  return {
    principal: p,
    annualRate: annual,
    tenureMonths: n,
    monthlyRate: round2(r * 100),
    emi,
    totalPayment: round2(totalPayment),
    totalInterest: round2(totalInterest),
    schedule,
  }
}

export default {
  family: "calculator" as const,
  run: calculateEmi,
}
