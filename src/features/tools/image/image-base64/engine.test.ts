import { describe, it, expect } from "vitest"
import {
  bytesToDataUrl,
  parseDataUrl,
  base64ToBytes,
  sniffMime,
  encodeImage,
  decodeBase64,
  guessFileName,
  MAX_ENCODE_BYTES,
} from "./engine"

describe("bytesToDataUrl", () => {
  it("produces a data URL with the mime prefix", () => {
    const bytes = new Uint8Array([104, 105])
    const url = bytesToDataUrl(bytes, "image/png")
    expect(url.startsWith("data:image/png;base64,")).toBe(true)
    expect(url).toBe("data:image/png;base64,aGk=")
  })
})

describe("parseDataUrl", () => {
  it("extracts mime and base64 payload", () => {
    const { mime, base64 } = parseDataUrl("data:image/jpeg;base64,aGVsbG8=")
    expect(mime).toBe("image/jpeg")
    expect(base64).toBe("aGVsbG8=")
  })

  it("returns raw text when there is no data: prefix", () => {
    const { mime, base64 } = parseDataUrl("aGVsbG8=")
    expect(mime).toBe("")
    expect(base64).toBe("aGVsbG8=")
  })
})

describe("base64ToBytes", () => {
  it("round-trips with bytesToDataUrl", () => {
    const bytes = new Uint8Array([255, 216, 255, 224, 0, 16])
    const url = bytesToDataUrl(bytes, "image/jpeg")
    const back = base64ToBytes(url)
    expect(Array.from(back)).toEqual(Array.from(bytes))
  })

  it("ignores whitespace", () => {
    const back = base64ToBytes("aGVs\nbG8=")
    expect(new TextDecoder().decode(back)).toBe("hello")
  })
})

describe("sniffMime", () => {
  it("detects PNG, JPEG, WebP and GIF", () => {
    expect(sniffMime(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBe("image/png")
    expect(sniffMime(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe("image/jpeg")
    expect(
      sniffMime(new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50])),
    ).toBe("image/webp")
    expect(sniffMime(new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]))).toBe("image/gif")
  })

  it("falls back to octet-stream for unknown bytes", () => {
    expect(sniffMime(new Uint8Array([1, 2, 3]))).toBe("application/octet-stream")
  })
})

describe("size limits", () => {
  it("throws when encoding exceeds the 2 MB cap", () => {
    const big = new Uint8Array(MAX_ENCODE_BYTES + 1)
    expect(() => encodeImage(big, "image/png")).toThrow(/too large/i)
  })

  it("encodes exactly at the cap", () => {
    const bytes = new Uint8Array(MAX_ENCODE_BYTES)
    const res = encodeImage(bytes, "image/png")
    expect(res.bytes).toBe(MAX_ENCODE_BYTES)
    expect(res.base64.length).toBeGreaterThan(0)
  })

  it("throws when the decoded output exceeds the cap", () => {
    const big = new Uint8Array(9 * 1024 * 1024) // 9 MB > 8 MB cap
    const url = bytesToDataUrl(big, "image/png")
    expect(() => decodeBase64(url)).toThrow(/too large/i)
  })
})

describe("encodeImage", () => {
  it("returns a data URL + base64 payload", () => {
    const res = encodeImage(new Uint8Array([104, 105]), "image/png")
    expect(res.mode).toBe("encode")
    expect(res.dataUrl.startsWith("data:image/png;base64,")).toBe(true)
    expect(res.base64).toBe("aGk=")
    expect(res.bytes).toBe(2)
  })
})

describe("decodeBase64", () => {
  it("decodes a full data URL into a Blob of the right type", () => {
    const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0])
    const url = bytesToDataUrl(bytes, "image/jpeg")
    const res = decodeBase64(url)
    expect(res.mode).toBe("decode")
    expect(res.mime).toBe("image/jpeg")
    expect(res.fileName).toBe("decoded-image.jpg")
    expect(res.bytes).toBe(6)
    expect(res.blob.size).toBe(6)
    expect(res.blob.type).toBe("image/jpeg")
  })

  it("sniffs mime when no prefix is present", () => {
    const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a])
    const url = bytesToDataUrl(bytes, "image/png")
    const payload = url.split(",")[1]
    const res = decodeBase64(payload)
    expect(res.mime).toBe("image/png")
    expect(res.fileName).toBe("decoded-image.png")
  })

  it("throws when there is no base64 data", () => {
    expect(() => decodeBase64("   ")).toThrow(/No base64 data/)
  })
})

describe("guessFileName", () => {
  it("maps mime to an extension", () => {
    expect(guessFileName("image/jpeg")).toBe("decoded-image.jpg")
    expect(guessFileName("image/png")).toBe("decoded-image.png")
    expect(guessFileName("image/svg+xml")).toBe("decoded-image.svg")
  })
})
