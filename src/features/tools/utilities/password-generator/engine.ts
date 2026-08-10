import type { CalculatorEngine } from "@/features/tools/engine"

export interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeAmbiguous: boolean
  count?: number
}

export interface PasswordStrength {
  score: number // 0 to 100
  label: "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong"
  bits: number
}

export interface PasswordResult {
  passwords: string[]
  primaryPassword: string
  strength: PasswordStrength
  isValid: boolean
  errorMessage?: string
}

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz"
const NUMBERS = "0123456789"
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?"
const AMBIGUOUS_CHARS = ["O", "0", "I", "1", "l", "|"]

function getSecureRandomByte(): number {
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint8Array(1)
    window.crypto.getRandomValues(arr)
    return arr[0]
  }
  return Math.floor(Math.random() * 256)
}

function getSecureRandomInt(max: number): number {
  if (max <= 0) return 0
  const maxAllowed = Math.floor(256 / max) * max
  let rand: number
  do {
    rand = getSecureRandomByte()
  } while (rand >= maxAllowed)
  return rand % max
}

export function calculatePasswordStrength(password: string, poolSize: number): PasswordStrength {
  if (!password || poolSize <= 0) {
    return { score: 0, label: "Very Weak", bits: 0 }
  }

  const bits = Math.round(password.length * Math.log2(poolSize))
  let score = Math.min(100, Math.round((bits / 128) * 100))

  let label: PasswordStrength["label"] = "Very Weak"
  if (bits >= 120) {
    label = "Very Strong"
  } else if (bits >= 80) {
    label = "Strong"
  } else if (bits >= 60) {
    label = "Fair"
  } else if (bits >= 32) {
    label = "Weak"
  } else {
    label = "Very Weak"
    score = Math.max(10, score)
  }

  return { score, label, bits }
}

export function generateSinglePassword(options: PasswordOptions): { password: string; poolSize: number } {
  let charset = ""
  if (options.uppercase) charset += UPPERCASE
  if (options.lowercase) charset += LOWERCASE
  if (options.numbers) charset += NUMBERS
  if (options.symbols) charset += SYMBOLS

  if (options.excludeAmbiguous) {
    AMBIGUOUS_CHARS.forEach((char) => {
      charset = charset.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), "")
    })
  }

  if (!charset) {
    return { password: "", poolSize: 0 }
  }

  const len = Math.min(128, Math.max(4, options.length))
  let password = ""
  for (let i = 0; i < len; i++) {
    const idx = getSecureRandomInt(charset.length)
    password += charset[idx]
  }

  return { password, poolSize: charset.length }
}

export function generatePasswords(options: PasswordOptions): PasswordResult {
  if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
    return {
      passwords: [],
      primaryPassword: "",
      strength: { score: 0, label: "Very Weak", bits: 0 },
      isValid: false,
      errorMessage: "Please select at least one character set (Uppercase, Lowercase, Numbers, or Symbols).",
    }
  }

  const count = Math.min(50, Math.max(1, options.count || 1))
  const passwords: string[] = []
  let poolSize = 0

  for (let i = 0; i < count; i++) {
    const { password, poolSize: pSize } = generateSinglePassword(options)
    passwords.push(password)
    poolSize = pSize
  }

  const strength = calculatePasswordStrength(passwords[0] || "", poolSize)

  return {
    passwords,
    primaryPassword: passwords[0] || "",
    strength,
    isValid: true,
  }
}

export const passwordEngine: CalculatorEngine<PasswordOptions, PasswordResult> = (input) => {
  return generatePasswords(input)
}

export default { family: "calculator" as const, run: passwordEngine }
