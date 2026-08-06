import type { CalculatorEngine } from "@/features/tools/engine"
import { PPF_CONFIG } from "./config"

export interface PpfInput {
  annual: number
  years: number
  /** Overrides the configured government rate, e.g. for what-if scenarios. */
  annualRate?: number
}

export interface PpfResult {
  annual: number
  years: number
  annualRate: number
  invested: number
  interest: number
  maturityValue: number
  warnings: string[]
}

const round2 = (value: number): number => Math.round(value * 100) / 100
const toPaise = (value: number): number => Math.round(value * 100)

const fmtInr = (n: number): string => n.toLocaleString("en-IN")

/**
 * PPF (Public Provident Fund) maturity engine. Interest compounds annually at
 * the government-declared rate (from PPF_CONFIG). Using the standard
 * assumption of deposits made at the start of each financial year (before
 * 5 April), so every deposit earns interest for the full year:
 *
 *   balance = P × ((1+r)^n − 1) / r × (1+r)   (annuity due)
 *
 * All running amounts are tracked in integer paise — the same exact-arithmetic
 * approach used by the GST calculator — so Total Deposited + Total Interest
 * equals Maturity Value precisely, with no floating-point drift.
 *
 * The annual deposit is capped at the official ₹1,50,000 maximum and the
 * result carries warnings whenever an input had to be adjusted.
 */
export const calculatePpf: CalculatorEngine<PpfInput, PpfResult> = ({
  annual,
  years,
  annualRate,
}) => {
  const warnings: string[] = []

  const ratePct = Math.max(0, annualRate ?? PPF_CONFIG.annualRatePct)
  const r = ratePct / 100

  const depositRaw = Math.max(0, annual)
  const deposit = Math.min(depositRaw, PPF_CONFIG.maxDeposit)
  if (depositRaw > PPF_CONFIG.maxDeposit) {
    warnings.push(
      `Annual deposits are capped at ₹${fmtInr(PPF_CONFIG.maxDeposit)} under PPF rules; your entry was reduced to that limit.`,
    )
  }

  const n = Math.max(0, Math.floor(years))
  if (n > 0 && n < PPF_CONFIG.lockInYears) {
    warnings.push(
      `PPF has a ${PPF_CONFIG.lockInYears}-year lock-in; the calculation below is a premature closure. After maturity you may extend in ${PPF_CONFIG.extensionBlockYears}-year blocks (${PPF_CONFIG.lockInYears}, ${PPF_CONFIG.lockInYears + PPF_CONFIG.extensionBlockYears}, ${PPF_CONFIG.lockInYears + PPF_CONFIG.extensionBlockYears * 2}, … years).`,
    )
  }

  const depositPaise = toPaise(deposit)
  const investedPaise = depositPaise * n

  // Maturity in rupees using the annuity-due formula, then truncate to paise.
  let maturityRupees = investedPaise / 100
  if (r > 0 && n > 0) {
    const growth = Math.pow(1 + r, n)
    maturityRupees = deposit * ((growth - 1) / r) * (1 + r)
  }
  const maturityPaise = Math.round(maturityRupees * 100)

  const interestPaise = Math.max(0, maturityPaise - investedPaise)

  return {
    annual: round2(deposit),
    years: n,
    annualRate: round2(ratePct),
    invested: round2(investedPaise / 100),
    interest: round2(interestPaise / 100),
    maturityValue: round2(maturityPaise / 100),
    warnings,
  }
}

export default {
  family: "calculator" as const,
  run: calculatePpf,
}