import { describe, it, expect } from "vitest"
import { zipArchive, verifyZipArchive } from "./zip"

describe("zipArchive", () => {
  it("writes a valid archive with the right entry count", () => {
    const zip = zipArchive([
      { name: "part-1.pdf", data: new TextEncoder().encode("one") },
      { name: "part-2.pdf", data: new TextEncoder().encode("two") },
    ])
    expect(verifyZipArchive(zip).count).toBe(2)
  })

  it("is byte-stable: local data is present verbatim", () => {
    const a = new TextEncoder().encode("hello-pdf")
    const zip = zipArchive([{ name: "a.pdf", data: a }])
    const text = new TextDecoder().decode(zip)
    expect(text).toContain("hello-pdf")
    expect(text).toContain("a.pdf")
  })

  it("round-trips into readable state: names match entries", () => {
    const zip = zipArchive([
      { name: "x.pdf", data: new TextEncoder().encode("AAA") },
      { name: "y.pdf", data: new TextEncoder().encode("BBB") },
    ])
    const { count, names } = verifyZipArchive(zip)
    expect(count).toBe(2)
    expect(names).toEqual(["x.pdf", "y.pdf"])
  })
})