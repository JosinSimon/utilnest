import { describe, it, expect } from "vitest"
import { generatePasswords, calculatePasswordStrength } from "./engine"

describe("Password Generator Engine", () => {
  it("generates password with requested length", () => {
    const res = generatePasswords({
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeAmbiguous: false,
    })
    expect(res.isValid).toBe(true)
    expect(res.primaryPassword.length).toBe(16)
  })

  it("excludes ambiguous characters when requested", () => {
    const res = generatePasswords({
      length: 100,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
      excludeAmbiguous: true,
      count: 10,
    })
    expect(res.isValid).toBe(true)
    const ambiguous = ["O", "0", "I", "1", "l", "|"]
    res.passwords.forEach((pwd) => {
      ambiguous.forEach((char) => {
        expect(pwd).not.toContain(char)
      })
    })
  })

  it("calculates entropy bits and strength rating", () => {
    const strength = calculatePasswordStrength("aB3!xY9#mK2$pL0@", 72)
    expect(strength.bits).toBeGreaterThan(80)
    expect(["Strong", "Very Strong"]).toContain(strength.label)
  })

  it("requires at least one character set", () => {
    const res = generatePasswords({
      length: 12,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
      excludeAmbiguous: false,
    })
    expect(res.isValid).toBe(false)
    expect(res.errorMessage).toContain("at least one character set")
  })
})
