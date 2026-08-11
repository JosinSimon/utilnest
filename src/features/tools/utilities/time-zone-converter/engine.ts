import type { CalculatorEngine } from "@/features/tools/engine"

export interface TimeZoneOption {
  iana: string
  label: string
  city: string
  country: string
}

export const POPULAR_TIMEZONES: TimeZoneOption[] = [
  { iana: "Asia/Kolkata", label: "India Standard Time (IST)", city: "New Delhi / Mumbai", country: "India" },
  { iana: "America/New_York", label: "Eastern Time (EST/EDT)", city: "New York", country: "USA" },
  { iana: "America/Chicago", label: "Central Time (CST/CDT)", city: "Chicago", country: "USA" },
  { iana: "America/Denver", label: "Mountain Time (MST/MDT)", city: "Denver", country: "USA" },
  { iana: "America/Los_Angeles", label: "Pacific Time (PST/PDT)", city: "Los Angeles / SF", country: "USA" },
  { iana: "Europe/London", label: "Greenwich / British Time (GMT/BST)", city: "London", country: "UK" },
  { iana: "Europe/Paris", label: "Central European Time (CET/CEST)", city: "Paris / Berlin", country: "Europe" },
  { iana: "Asia/Dubai", label: "Gulf Standard Time (GST)", city: "Dubai", country: "UAE" },
  { iana: "Asia/Singapore", label: "Singapore Standard Time (SGT)", city: "Singapore", country: "Singapore" },
  { iana: "Asia/Tokyo", label: "Japan Standard Time (JST)", city: "Tokyo", country: "Japan" },
  { iana: "Australia/Sydney", label: "Australian Eastern Time (AEST/AEDT)", city: "Sydney", country: "Australia" },
  { iana: "Asia/Kathmandu", label: "Nepal Time (NPT)", city: "Kathmandu", country: "Nepal" },
  { iana: "Pacific/Auckland", label: "New Zealand Time (NZST/NZDT)", city: "Auckland", country: "New Zealand" },
  { iana: "UTC", label: "Coordinated Universal Time (UTC)", city: "UTC", country: "Universal" },
]

export interface TimeZoneConvertInput {
  dateStr: string // YYYY-MM-DD
  timeStr: string // HH:mm
  sourceZone: string // IANA
  targetZone: string // IANA
}

export interface TimeZoneConvertResult {
  sourceFormatted: string
  sourceZoneName: string
  sourceOffset: string

  targetFormatted: string
  targetZoneName: string
  targetOffset: string
  targetDateIso: string

  timeDifferenceHours: number
  isValid: boolean
  errorMessage?: string
}

function getTimeZoneOffsetString(d: Date, timeZone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    })
    const parts = formatter.formatToParts(d)
    const tzPart = parts.find((p) => p.type === "timeZoneName")
    return tzPart ? tzPart.value : ""
  } catch {
    return ""
  }
}

function getZoneOffsetMinutes(d: Date, timeZone: string): number {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    })
    const parts: Record<string, number> = {}
    formatter.formatToParts(d).forEach((p) => {
      if (p.type !== "literal") parts[p.type] = parseInt(p.value, 10)
    })
    const hour = parts.hour === 24 ? 0 : parts.hour
    const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, hour, parts.minute, parts.second)
    return Math.round((asUtc - d.getTime()) / 60000)
  } catch {
    return 0
  }
}

/** Construct Date object representing specified local time in source timezone */
function parseLocalDateInZone(dateStr: string, timeStr: string, timeZone: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number)
  const [hour, minute] = timeStr.split(":").map(Number)

  const targetUtcMs = Date.UTC(year, month - 1, day, hour, minute, 0)
  let guess = new Date(targetUtcMs)

  for (let i = 0; i < 3; i++) {
    const offsetMin = getZoneOffsetMinutes(guess, timeZone)
    guess = new Date(targetUtcMs - offsetMin * 60000)
  }
  return guess
}

export function convertTimeZone(input: TimeZoneConvertInput): TimeZoneConvertResult {
  const { dateStr, timeStr, sourceZone, targetZone } = input

  if (!dateStr || !timeStr || !sourceZone || !targetZone) {
    return {
      sourceFormatted: "",
      sourceZoneName: "",
      sourceOffset: "",
      targetFormatted: "",
      targetZoneName: "",
      targetOffset: "",
      targetDateIso: "",
      timeDifferenceHours: 0,
      isValid: false,
      errorMessage: "Please select valid date, time, and time zones.",
    }
  }

  try {
    const sourceDate = parseLocalDateInZone(dateStr, timeStr, sourceZone)

    const fmtSource = new Intl.DateTimeFormat("en-US", {
      timeZone: sourceZone,
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    })

    const fmtTarget = new Intl.DateTimeFormat("en-US", {
      timeZone: targetZone,
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    })

    const sourceFormatted = fmtSource.format(sourceDate)
    const targetFormatted = fmtTarget.format(sourceDate)

    const sourceOffset = getTimeZoneOffsetString(sourceDate, sourceZone)
    const targetOffset = getTimeZoneOffsetString(sourceDate, targetZone)

    const sourceOffsetMin = getZoneOffsetMinutes(sourceDate, sourceZone)
    const targetOffsetMin = getZoneOffsetMinutes(sourceDate, targetZone)
    const timeDifferenceHours = Math.round(((targetOffsetMin - sourceOffsetMin) / 60) * 100) / 100

    const targetParts = new Intl.DateTimeFormat("en-US", {
      timeZone: targetZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(sourceDate)

    const y = targetParts.find((p) => p.type === "year")?.value
    const m = targetParts.find((p) => p.type === "month")?.value
    const d = targetParts.find((p) => p.type === "day")?.value
    const targetDateIso = `${y}-${m}-${d}`

    return {
      sourceFormatted,
      sourceZoneName: sourceZone,
      sourceOffset,
      targetFormatted,
      targetZoneName: targetZone,
      targetOffset,
      targetDateIso,
      timeDifferenceHours,
      isValid: true,
    }
  } catch (err) {
    return {
      sourceFormatted: "",
      sourceZoneName: "",
      sourceOffset: "",
      targetFormatted: "",
      targetZoneName: "",
      targetOffset: "",
      targetDateIso: "",
      timeDifferenceHours: 0,
      isValid: false,
      errorMessage: `Timezone conversion error: ${String(err)}`,
    }
  }
}

export const timeZoneEngine: CalculatorEngine<TimeZoneConvertInput, TimeZoneConvertResult> = (
  input,
) => {
  return convertTimeZone(input)
}

export default { family: "calculator" as const, run: timeZoneEngine }
