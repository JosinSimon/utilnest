import { describe, it, expect } from "vitest"
import { PDFDocument } from "pdf-lib"
import { runPdfWatermark } from "./engine"
import { watermarkPdf } from "@/features/tools/shared/pdf"

async function makePdf(pageCount = 2): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pageCount; i++) doc.addPage([200, 300])
  return doc.save()
}

function pdfFile(pdf: Uint8Array, name: string): File {
  return new File([pdf as unknown as BlobPart], name, { type: "application/pdf" })
}

describe("pdf-watermark engine", () => {
  it("produces a larger, loadable PDF with the same page count", async () => {
    const pdf = await makePdf(2)
    const res = await runPdfWatermark({
      file: pdfFile(pdf, "doc.pdf"),
      text: "CONFIDENTIAL",
    }).result

    expect(res.success).toBe(true)
    expect(res.data.pageCount).toBe(2)
    expect(res.data.fileName).toBe("doc-watermarked.pdf")

    const doc = await PDFDocument.load(new Uint8Array(await res.data.blob.arrayBuffer()))
    expect(doc.getPageCount()).toBe(2)
  })

  it("draws text content operators on the page", async () => {
    const pdf = await makePdf(1)
    const out = await watermarkPdf(await pdf, { text: "DRAFT", tiles: 3 })
    // pdf-lib writes page content; the bytes must differ and decode.
    const raw = new TextDecoder().decode(out)
    expect(raw.length).toBeGreaterThan(100)
    const doc = await PDFDocument.load(out)
    expect(doc.getPage(0).getWidth()).toBe(200)
  })

  it("throws on empty watermark text", async () => {
    const pdf = await makePdf(1)
    const res = await runPdfWatermark({
      file: pdfFile(pdf, "doc.pdf"),
      text: "   ",
    }).result
    expect(res.success).toBe(false)
    expect(res.error?.message).toMatch(/empty/i)
  })
})