import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  let i = 0
  let value = bytes
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
}

export function formatINR(value: number, digits = 2): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: digits,
  }).format(value)
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function isNumeric(input: string): boolean {
  return input.trim() !== "" && !Number.isNaN(Number(input))
}

/** Copies text to the clipboard, falling back to a hidden textarea for older browsers. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to the textarea fallback
  }
  try {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly", "")
    textarea.style.position = "absolute"
    textarea.style.left = "-9999px"
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}