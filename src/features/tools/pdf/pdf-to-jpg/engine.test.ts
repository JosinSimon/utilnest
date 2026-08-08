import { describe, it, expect } from "vitest"
import { PDFDocument } from "pdf-lib"
import { runPdfToJpg } from "./engine"

async function makePdf(pageCount = 1): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pageCount; i++) doc.addPage([200, 300])
  return doc.save()
}

function pdfFile(pdf: Uint8Array, name: string): File {
  return new File([pdf as unknown as BlobPart], name, { type: "application/pdf" })
}

describe("pdf-to-jpg engine", () => {
  it("reports a clear render error in non-browser (no canvas) contexts", async () => {
    // vitest runs in Node (no <canvas>), so rendering can't start here — the
    // engine must surface a helpful failure rather than hang.
    const pdf = await makePdf(1)
    const res = await runPdfToJpg({
      file: pdfFile(pdf, "doc.pdf"),
      dpi: 2,
      quality: 0.9,
    }).result
    expect(res.success).toBe(false)
    expect(res.error?.code).toBe("pdf_to_jpg_error")
  })
})