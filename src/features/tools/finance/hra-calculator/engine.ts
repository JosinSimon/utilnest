import type { CalculatorEngine } from "@/features/tools/engine"

export interface HraInput {
  basicSalary: number
  hraReceived: number
  rentPaid: number
  metro: boolean
}

export interface HraResult {
  basicSalary: number
  hraReceived: number
  rentPaid: number
  exemption: number
  taxableHra: number
  /** Breakdown of the three exemption components. */
  actualHra: number
  rentMinus10Percent: number
  halfOfBasic: number
}

const round2 = (value: number): number => Math.round(value * 100) / 100

/**
 * HRA exemption engine (Income Tax Act, Section 10(13A)).
 *
 * Exempt amount = minimum of:
 *   1. Actual HRA received
 *   2. Rent paid − 10% of basic salary
 *   3. 50% of basic salary (metro cities: Delhi, Mumbai, Kolkata, Chennai)
 *      or 40% of basic salary (all other cities)
 *
 * Basic salary should include basic pay + DA (and any commission tied to
 * turnover, when applicable). The remaining HRA is taxable.
 */
export const calculateHra: CalculatorEngine<HraInput, HraResult> = ({
  basicSalary,
  hraReceived,
  rentPaid,
  metro,
}) => {
  const basic = Math.max(0, basicSalary)
  const hra = Math.max(0, hraReceived)
  const rent = Math.max(0, rentPaid)

  const actualHra = hra
  const rentMinus10Percent = Math.max(0, rent - basic * 0.1)
  const halfOfBasic = basic * (metro ? 0.5 : 0.4)

  const exemption = Math.max(0, Math.min(actualHra, rentMinus10Percent, halfOfBasic))

  return {
    basicSalary: basic,
    hraReceived: hra,
    rentPaid: rent,
    exemption: round2(exemption),
    taxableHra: round2(Math.max(0, hra - exemption)),
    actualHra: round2(actualHra),
    rentMinus10Percent: round2(rentMinus10Percent),
    halfOfBasic: round2(halfOfBasic),
  }
}

export default {
  family: "calculator" as const,
  run: calculateHra,
}
