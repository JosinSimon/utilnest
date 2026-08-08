/**
 * Minimal, dependency-free ZIP archive writer.
 *
 * Uses the STORE method (method 0) since PDFs don't compress further, so the
 * "compressed size" always equals the stored size and no DEFLATE encoder is
 * needed. Produces a specification-correct ZIP with local headers, a central
 * directory, and an end-of-central-directory record.
 */

export interface ZipEntry {
  name: string
  data: Uint8Array
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }
  return table
})()

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function u16(value: number, out: Uint8Array, offset: number) {
  out[offset] = value & 0xff
  out[offset + 1] = (value >>> 8) & 0xff
}

function u32(value: number, out: Uint8Array, offset: number) {
  out[offset] = value & 0xff
  out[offset + 1] = (value >>> 8) & 0xff
  out[offset + 2] = (value >>> 16) & 0xff
  out[offset + 3] = (value >>> 24) & 0xff
}

/** Create a zip archive (STORE) from named entries. */
export function zipArchive(entries: ZipEntry[]): Uint8Array {
  const encoder = new TextEncoder()
  const prepared = entries.map((e) => ({ name: encoder.encode(e.name), data: e.data }))

  const localHeadLen = 30
  const centralHeadLen = 46
  const eocdLen = 22

  const dataOffsets: number[] = []
  let acc = 0
  for (const e of prepared) {
    dataOffsets.push(acc)
    acc += localHeadLen + e.name.length + e.data.length
  }
  const localTotal = acc

  const centralSize = prepared.reduce(
    (s, e) => s + centralHeadLen + e.name.length,
    0,
  )
  const out = new Uint8Array(localTotal + centralSize + eocdLen)

  let p = 0
  prepared.forEach((e) => {
    const crc = crc32(e.data)
    // Local file header (signature 0x04034b50).
    u32(0x04034b50, out, p)
    u16(20, out, p + 4) // version needed
    u16(0x0800, out, p + 6) // general purpose: UTF-8 names
    u16(0, out, p + 8) // method: stored
    u16(0, out, p + 10) // time
    u16(0, out, p + 12) // date
    u32(crc, out, p + 14)
    u32(e.data.length, out, p + 18) // compressed size
    u32(e.data.length, out, p + 22) // uncompressed size
    u16(e.name.length, out, p + 26)
    u16(0, out, p + 28) // extra field length
    out.set(e.name, p + 30)
    p += localHeadLen + e.name.length
    out.set(e.data, p)
    p += e.data.length
  })

  const centralStart = p
  prepared.forEach((e, i) => {
    const crc = crc32(e.data)
    u32(0x02014b50, out, p) // central header signature
    u16(20, out, p + 4) // version made by
    u16(20, out, p + 6) // version needed
    u16(0x0800, out, p + 8) // UTF-8
    u16(0, out, p + 10) // method
    u16(0, out, p + 12) // time
    u16(0, out, p + 14) // date
    u32(crc, out, p + 16)
    u32(e.data.length, out, p + 20)
    u32(e.data.length, out, p + 24)
    u16(e.name.length, out, p + 28)
    u16(0, out, p + 30) // extra len
    u16(0, out, p + 32) // comment len
    u16(0, out, p + 34) // disk start
    u16(0, out, p + 36) // internal attrs
    u32(0, out, p + 38) // external attrs
    u32(dataOffsets[i], out, p + 42) // local header offset
    out.set(e.name, p + 46)
    p += centralHeadLen + e.name.length
  })

  const eocd = p
  u32(0x06054b50, out, eocd) // EOCD signature
  u16(0, out, eocd + 4)
  u16(0, out, eocd + 6)
  u16(prepared.length, out, eocd + 8)
  u16(prepared.length, out, eocd + 10)
  u32(p - centralStart, out, eocd + 12) // central dir size
  u32(centralStart, out, eocd + 16) // central dir start
  u16(0, out, eocd + 20) // comment len

  return out
}

/** Validate a produced zip: reads the EOCD + central directory, returns entry names. */
export function verifyZipArchive(bytes: Uint8Array): { count: number; names: string[] } {
  // Signature check for local header at position 0.
  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b || bytes[2] !== 0x03 || bytes[3] !== 0x04) {
    throw new Error("Not a zip (missing local header).")
  }
  // EOCD sits at length-22 (we never emit a comment).
  const eocd = bytes.length - 22
  if (bytes[eocd] !== 0x50 || bytes[eocd + 1] !== 0x4b || bytes[eocd + 2] !== 0x05 || bytes[eocd + 3] !== 0x06) {
    throw new Error("Corrupt zip (missing EOCD).")
  }
  const count = bytes[eocd + 10] | (bytes[eocd + 11] << 8)
  const centralStart = bytes[eocd + 16] | (bytes[eocd + 17] << 8) | (bytes[eocd + 18] << 16) | (bytes[eocd + 19] << 24)
  // Walk central directory, verifying each entry signature + name length.
  const names: string[] = []
  let p = centralStart
  const decoder = new TextDecoder()
  for (let i = 0; i < count; i++) {
    if (bytes[p] !== 0x50 || bytes[p + 1] !== 0x4b || bytes[p + 2] !== 0x01 || bytes[p + 3] !== 0x02) {
      throw new Error(`Corrupt zip (central entry ${i}).`)
    }
    const nameLen = bytes[p + 28] | (bytes[p + 29] << 8)
    names.push(decoder.decode(bytes.subarray(p + 46, p + 46 + nameLen)))
    p += 46 + nameLen
  }
  return { count, names }
}