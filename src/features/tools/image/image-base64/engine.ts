export type Base64Mode = "encode" | "decode"

/** Hard cap for encoding — the resulting data URL is ~4/3 the file size. */
export const MAX_ENCODE_BYTES = 2 * 1024 * 1024 // 2 MB
/** Hard cap for the decoded output file size. */
export const MAX_DECODE_BYTES = 8 * 1024 * 1024 // 8 MB

/** Result for encode: the data URL (base64) plus camel metadata. */
export interface EncodeOutcome {
  mode: "encode"
  dataUrl: string
  /** base64 payload only (without the data: prefix). */
  base64: string
  mime: string
  bytes: number
}

/** Result for decode: a downloadable file reconstructed from base64. */
export interface DecodeOutcome {
  mode: "decode"
  blob: Blob
  url: string
  mime: string
  fileName: string
  bytes: number
}

export type Base64Outcome = EncodeOutcome | DecodeOutcome

/** Converts a Uint8Array (and a mime) into a data-URL base64 string. */
export function bytesToDataUrl(bytes: Uint8Array, mime: string): string {
  let binary = ""
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  const base64 = btoa(binary)
  return `data:${mime};base64,${base64}`
}

/** Splits a data-URL into its mime + base64 payload (empty mime if none). */
export function parseDataUrl(dataUrl: string): { mime: string; base64: string } {
  const match = /^data:([^;,]*)?(;base64)?,(.*)$/s.exec(dataUrl)
  if (!match) return { mime: "", base64: dataUrl.trim() }
  return { mime: match[1] ?? "", base64: match[3].trim() }
}

/** Decode a base64 string (with or without a data: prefix) into bytes. */
export function base64ToBytes(base64: string): Uint8Array {
  const cleaned = base64.replace(/^data:[^,]*,\s*/, "").replace(/\s+/g, "")
  const binary = atob(cleaned)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/** Detect a mime type from a base64 payload's byte signature (best-effort). */
export function sniffMime(bytes: Uint8Array): string {
  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50) return "image/png"
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg"
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46
  ) {
    return "image/webp"
  }
  if (matchesGif(bytes)) return "image/gif"
  return "application/octet-stream"
}

function matchesGif(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  )
}

export function guessFileName(mime: string): string {
  const ext = mime.split("/")[1]?.split("+")[0] ?? "bin"
  return `decoded-image.${ext === "jpeg" ? "jpg" : ext}`
}

/**
 * Pure encode/decode logic (no rendering). Free of browser-only DOM so it is
 * unit-testable in Node. Object URLs are created by the caller (component).
 */
export function encodeImage(
  bytes: Uint8Array,
  mime: string,
): { mode: "encode"; dataUrl: string; base64: string; mime: string; bytes: number } {
  if (bytes.length > MAX_ENCODE_BYTES) {
    throw new Error(
      `Image is ${(bytes.length / (1024 * 1024)).toFixed(1)} MB — too large to encode. Keep it under 2 MB, as Base64 output is about a third larger than the file.`,
    )
  }
  const dataUrl = bytesToDataUrl(bytes, mime)
  const base64 = dataUrl.split(",")[1] ?? ""
  return { mode: "encode", dataUrl, base64, mime: mime || "image/jpeg", bytes: bytes.length }
}

/** Decode a base64 string into a Blob + metadata (URL created by the caller). */
export function decodeBase64(
  text: string,
): { mode: "decode"; blob: Blob; mime: string; fileName: string; bytes: number } {
  const { mime: parsedMime, base64 } = parseDataUrl(text)
  const bytes = base64ToBytes(base64)
  if (bytes.length === 0) throw new Error("No base64 data found. Paste a valid data URL or base64 string.")
  if (bytes.length > MAX_DECODE_BYTES) {
    throw new Error(
      `Decoded image would be ${(bytes.length / (1024 * 1024)).toFixed(1)} MB — too large to preview reliably. Files up to 8 MB are supported.`,
    )
  }
  const mime = parsedMime || sniffMime(bytes)
  const part = new Uint8Array(bytes)
  return { mode: "decode", blob: new Blob([part], { type: mime }), mime, fileName: guessFileName(mime), bytes: bytes.length }
}