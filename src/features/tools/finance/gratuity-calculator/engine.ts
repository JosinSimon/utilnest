import type { CalculatorEngine } from "@/features/tools/engine"

export interface GratuityInput {
  lastBasic: number
  lastDa: number
  yearsOfService: number
  monthsOfService: number
}

export interface GratuityResult {
  lastBasic: number
  lastDa: number
  lastMonthlySalary: number
  totalYears: number
  gratuity: number
  capped: boolean
}

const GRATUITY_CAP = 2000000

const round2 = (value: number): number => Math.round(value * 100) / 100

/**
 * Gratuity engine under the Payment of Gratuity Act, 1972 (for employees not
 * covered by the Act, it is taxable and the formula below still applies as an
 * estimate).
 *
 *   gratuity = last drawn basic + DA × 15/26 × completed years of service
 *
 * - 'Completed years' means full years of service (fractional years are
 *   rounded down); under the Act, 6+ months in the last year count as a full
 *   year for termination-based gratuity.
 * - The maximum tax-exempt gratuity is ₹20,00,000.
 */
export const calculateGratuity: CalculatorEngine<GratuityInput, GratuityResult> = ({
  lastBasic,
  lastDa,
  yearsOfService,
  monthsOfService,
}) => {
  const basic = Math.max(0, lastBasic)
  const da = Math.max(0, lastDa)
  const years = Math.max(0, Math.floor(yearsOfService))
  const months = Math.max(0, Math.floor(monthsOfService))

  const lastMonthlySalary = basic + da

  // completed years, rounding 6+ months up to a full year
  const completedYears = months >= 6 ? years + 1 : years

  const gratuity = (lastMonthlySalary * 15 * completedYears) / 26
  const capped = gratuity > GRATUITY_CAP

  return {
    lastBasic: basic,
    lastDa: da,
    lastMonthlySalary: round2(lastMonthlySalary),
    totalYears: completedYears,
    gratuity: round2(Math.min(gratuity, GRATUITY_CAP)),
    capped,
  }
}

export default {
  family: "calculator" as const,
  run: calculateGratuity,
}
