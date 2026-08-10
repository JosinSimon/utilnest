import type { CalculatorEngine } from "@/features/tools/engine"

export interface UuidInput {
  count: number
  uppercase?: boolean
  removeHyphens?: boolean
}

export interface UuidResult {
  uuids: string[]
  formattedList: string
  isValid: boolean
  errorMessage?: string
}

export function generateSingleUuidV4(): string {
  if (typeof window !== "undefined" && window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID()
  }
  // RFC 4122 compliant fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r: number
    if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
      const arr = new Uint8Array(1)
      window.crypto.getRandomValues(arr)
      r = arr[0] % 16
    } else {
      r = (Math.random() * 16) | 0
    }
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function generateUuids(input: UuidInput): UuidResult {
  const count = Math.min(100, Math.max(1, input.count || 1))
  const uuids: string[] = []

  for (let i = 0; i < count; i++) {
    let uuid = generateSingleUuidV4()
    if (input.removeHyphens) {
      uuid = uuid.replace(/-/g, "")
    }
    if (input.uppercase) {
      uuid = uuid.toUpperCase()
    }
    uuids.push(uuid)
  }

  return {
    uuids,
    formattedList: uuids.join("\n"),
    isValid: true,
  }
}

export const uuidEngine: CalculatorEngine<UuidInput, UuidResult> = (input) => {
  return generateUuids(input)
}

export default { family: "calculator" as const, run: uuidEngine }
