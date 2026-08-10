import { describe, it, expect } from "vitest"
import { generateSingleUuidV4, generateUuids } from "./engine"

describe("UUID Generator Engine", () => {
  it("generates valid RFC 4122 v4 structure", () => {
    const uuid = generateSingleUuidV4()
    // Standard format: 8-4-4-4-12 hex chars
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    expect(uuid).toMatch(uuidRegex)
  })

  it("generates multiple UUIDs", () => {
    const res = generateUuids({ count: 10 })
    expect(res.isValid).toBe(true)
    expect(res.uuids.length).toBe(10)
    const set = new Set(res.uuids)
    expect(set.size).toBe(10)
  })

  it("handles uppercase formatting", () => {
    const res = generateUuids({ count: 1, uppercase: true })
    expect(res.uuids[0]).toBe(res.uuids[0].toUpperCase())
  })

  it("handles hyphen removal", () => {
    const res = generateUuids({ count: 1, removeHyphens: true })
    expect(res.uuids[0]).not.toContain("-")
    expect(res.uuids[0].length).toBe(32)
  })
})
