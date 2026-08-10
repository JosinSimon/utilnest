import type { CalculatorEngine } from "@/features/tools/engine"

export interface AgeCalculatorInput {
  birthDate: string // YYYY-MM-DD
  targetDate?: string // YYYY-MM-DD (defaults to today)
}

export interface AgeResult {
  years: number
  months: number
  days: number

  totalMonths: number
  totalWeeks: number
  totalDays: number
  totalHours: number

  nextBirthday: {
    dateFormatted: string
    dayOfWeek: string
    daysRemaining: number
    monthsRemaining: number
  }

  isFeb29LeapBaby: boolean
  isValid: boolean
  errorMessage?: string
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

function getDaysInMonth(year: number, monthZeroIndexed: number): number {
  return new Date(year, monthZeroIndexed + 1, 0).getDate()
}

export function calculateAge(dobStr: string, targetStr?: string): AgeResult {
  const dob = new Date(dobStr + "T00:00:00")
  const target = targetStr ? new Date(targetStr + "T00:00:00") : new Date()
  target.setHours(0, 0, 0, 0)

  if (isNaN(dob.getTime()) || isNaN(target.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalMonths: 0,
      totalWeeks: 0,
      totalDays: 0,
      totalHours: 0,
      nextBirthday: { dateFormatted: "", dayOfWeek: "", daysRemaining: 0, monthsRemaining: 0 },
      isFeb29LeapBaby: false,
      isValid: false,
      errorMessage: "Invalid date format provided.",
    }
  }

  if (dob > target) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalMonths: 0,
      totalWeeks: 0,
      totalDays: 0,
      totalHours: 0,
      nextBirthday: { dateFormatted: "", dayOfWeek: "", daysRemaining: 0, monthsRemaining: 0 },
      isFeb29LeapBaby: false,
      isValid: false,
      errorMessage: "Date of birth cannot be in the future relative to the target date.",
    }
  }

  const birthYear = dob.getFullYear()
  const birthMonth = dob.getMonth()
  const birthDay = dob.getDate()

  const targetYear = target.getFullYear()
  const targetMonth = target.getMonth()
  const targetDay = target.getDate()

  const isFeb29LeapBaby = birthMonth === 1 && birthDay === 29

  let years = targetYear - birthYear
  let months = targetMonth - birthMonth
  let days = targetDay - birthDay

  if (days < 0) {
    months -= 1
    // Previous month relative to target
    const prevMonth = targetMonth === 0 ? 11 : targetMonth - 1
    const prevMonthYear = targetMonth === 0 ? targetYear - 1 : targetYear
    days += getDaysInMonth(prevMonthYear, prevMonth)
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  // Total elapsed calculations
  const diffTime = target.getTime() - dob.getTime()
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.floor(totalDays / 7)
  const totalMonths = years * 12 + months
  const totalHours = totalDays * 24

  // Next Birthday Calculation
  let nextBdayYear = targetYear
  let nextBdayMonth = birthMonth
  let nextBdayDay = birthDay

  // Handle Feb 29 for non-leap target years
  if (isFeb29LeapBaby && !isLeapYear(nextBdayYear)) {
    nextBdayDay = 28 // Or Feb 28
  }

  let nextBday = new Date(nextBdayYear, nextBdayMonth, nextBdayDay)
  nextBday.setHours(0, 0, 0, 0)

  if (nextBday < target) {
    nextBdayYear += 1
    if (isFeb29LeapBaby && !isLeapYear(nextBdayYear)) {
      nextBdayDay = 28
    } else if (isFeb29LeapBaby && isLeapYear(nextBdayYear)) {
      nextBdayDay = 29
    }
    nextBday = new Date(nextBdayYear, nextBdayMonth, nextBdayDay)
    nextBday.setHours(0, 0, 0, 0)
  }

  const daysUntilNextBday = Math.round((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))
  const monthsUntilNextBday = Math.floor(daysUntilNextBday / 30.4375)

  const dayOfWeekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const dayOfWeek = dayOfWeekNames[nextBday.getDay()]

  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
  const dateFormatted = nextBday.toLocaleDateString("en-US", options)

  return {
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    nextBirthday: {
      dateFormatted,
      dayOfWeek,
      daysRemaining: daysUntilNextBday,
      monthsRemaining: monthsUntilNextBday,
    },
    isFeb29LeapBaby,
    isValid: true,
  }
}

export const ageEngine: CalculatorEngine<AgeCalculatorInput, AgeResult> = (input) => {
  return calculateAge(input.birthDate, input.targetDate)
}

export default { family: "calculator" as const, run: ageEngine }
