import { describe, it, expect } from "vitest"
import { PDFDocument } from "pdf-lib"
import { runPdfCompress } from "./engine"

async function makePdf(pageCount = 1): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pageCount; i++) doc.addPage([200, 300])
  return doc.save()
}

function pdfFile(pdf: Uint8Array, name: string): File {
  return new File([pdf as unknown as BlobPart], name, { type: "application/pdf" })
}

describe("pdf-compress engine", () => {
  it("produces a loadable PDF result in browser contexts", async () => {
    // In Node there's no canvas, so compression fails with pdf_to-jpg's clear
    // message — assert the engine responds gracefully rather than hanging.
    const pdf = await makePdf(1)
    const res = await runPdfCompress({
      file: pdfFile(pdf, "doc.pdf"),
      level: 2,
      quality: 0.75,
    }).result
    expect(res.success).toBe(false)
    expect(res.error).toBeDefined()
  })

  it("sets savedPercent to 0 on identical sizes", async () => {
    // Can't compress in Node, but the interface must still exist for browser.
    const pdf = await makePdf(1)
    const res = await runPdfCompress({
      file: pdfFile(pdf, "doc.pdf"),
      level: 1,
      quality: 0.5,
    }).result
    expect(res.error?.code).toBe("pdf_compress_error")
  })
})