import type { CalculatorEngine } from "@/features/tools/engine"

export type DateCalcMode = "diff" | "add_subtract"

export interface DateDiffInput {
  mode: DateCalcMode
  // diff mode:
  startDate?: string
  endDate?: string
  includeEndDate?: boolean
  // add/subtract mode:
  baseDate?: string
  operation?: "add" | "subtract"
  amount?: number
  unit?: "days" | "weeks" | "months" | "years"
}

export interface DateDiffResult {
  mode: DateCalcMode
  isValid: boolean
  errorMessage?: string

  // diff mode outputs:
  years?: number
  months?: number
  days?: number

  totalDays?: number
  totalWeeks?: number
  totalMonths?: number
  includeEndDate?: boolean

  // add/subtract mode outputs:
  targetDateFormatted?: string
  targetDayOfWeek?: string
  targetIsoDate?: string
}

function getDaysInMonth(year: number, monthZeroIndexed: number): number {
  return new Date(year, monthZeroIndexed + 1, 0).getDate()
}

export function calculateDateDiff(input: DateDiffInput): DateDiffResult {
  if (input.mode === "diff") {
    if (!input.startDate || !input.endDate) {
      return { mode: "diff", isValid: false, errorMessage: "Please select both start and end dates." }
    }

    let start = new Date(input.startDate + "T00:00:00")
    let end = new Date(input.endDate + "T00:00:00")

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { mode: "diff", isValid: false, errorMessage: "Invalid date format." }
    }

    let isSwapped = false
    if (start > end) {
      const temp = start
      start = end
      end = temp
      isSwapped = true
    }

    const includeEnd = Boolean(input.includeEndDate)
    if (includeEnd) {
      end.setDate(end.getDate() + 1)
    }

    const startYear = start.getFullYear()
    const endYear = end.getFullYear()

    function addMonthsClamped(baseDate: Date, count: number): Date {
      const y = baseDate.getFullYear()
      const m = baseDate.getMonth()
      const d = baseDate.getDate()
      const totalM = m + count
      const targetYear = y + Math.floor(totalM / 12)
      const targetMonth = ((totalM % 12) + 12) % 12
      const maxDays = getDaysInMonth(targetYear, targetMonth)
      const targetDay = Math.min(d, maxDays)
      return new Date(targetYear, targetMonth, targetDay)
    }

    let years = endYear - startYear
    let d1 = addMonthsClamped(start, years * 12)
    if (d1 > end) {
      years -= 1
      d1 = addMonthsClamped(start, years * 12)
    }

    let months = 0
    while (addMonthsClamped(d1, months + 1) <= end) {
      months += 1
    }
    const d2 = addMonthsClamped(d1, months)
    const days = Math.round((end.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24))

    const diffTime = end.getTime() - start.getTime()
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months

    return {
      mode: "diff",
      isValid: true,
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      includeEndDate: includeEnd,
      errorMessage: isSwapped ? "Start date was after end date; swapped automatically." : undefined,
    }
  }

  // mode === "add_subtract"
  if (!input.baseDate || input.amount === undefined || isNaN(input.amount)) {
    return { mode: "add_subtract", isValid: false, errorMessage: "Please provide a valid date and quantity." }
  }

  const base = new Date(input.baseDate + "T00:00:00")
  if (isNaN(base.getTime())) {
    return { mode: "add_subtract", isValid: false, errorMessage: "Invalid base date." }
  }

  const mult = input.operation === "subtract" ? -1 : 1
  const amount = (input.amount || 0) * mult
  const unit = input.unit || "days"

  const target = new Date(base)

  if (unit === "days") {
    target.setDate(target.getDate() + amount)
  } else if (unit === "weeks") {
    target.setDate(target.getDate() + amount * 7)
  } else if (unit === "months") {
    const origDay = target.getDate()
    target.setMonth(target.getMonth() + amount)
    // Handle month-end clamping (e.g. Jan 31 + 1 month -> Feb 28/29 instead of Mar 3)
    if (target.getDate() !== origDay) {
      target.setDate(0)
    }
  } else if (unit === "years") {
    const origDay = target.getDate()
    target.setFullYear(target.getFullYear() + amount)
    if (target.getDate() !== origDay) {
      target.setDate(0)
    }
  }

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const targetDayOfWeek = dayNames[target.getDay()]
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
  const targetDateFormatted = target.toLocaleDateString("en-US", options)

  const yyyy = target.getFullYear()
  const mm = String(target.getMonth() + 1).padStart(2, "0")
  const dd = String(target.getDate()).padStart(2, "0")
  const targetIsoDate = `${yyyy}-${mm}-${dd}`

  return {
    mode: "add_subtract",
    isValid: true,
    targetDateFormatted,
    targetDayOfWeek,
    targetIsoDate,
  }
}

export const dateDiffEngine: CalculatorEngine<DateDiffInput, DateDiffResult> = (input) => {
  return calculateDateDiff(input)
}

export default { family: "calculator" as const, run: dateDiffEngine }
