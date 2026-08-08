import { describe, it, expect } from "vitest"
import { PDFDocument } from "pdf-lib"
import { runPdfProtect } from "./engine"
import { decryptPDF } from "@pdfsmaller/pdf-decrypt"

async function makePdf(pageCount = 2): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pageCount; i++) doc.addPage([200, 300])
  return doc.save()
}

function pdfFile(pdf: Uint8Array, name: string): File {
  return new File([pdf as unknown as BlobPart], name, { type: "application/pdf" })
}

describe("pdf-protect engine", () => {
  it("produces an encrypted PDF that decrypts back with the password", async () => {
    const pdf = await makePdf(2)
    const res = await runPdfProtect({
      file: pdfFile(pdf, "doc.pdf"),
      password: "hunter2",
    }).result

    expect(res.success).toBe(true)
    expect(res.data.encrypted).toBe(true)

    const out = new Uint8Array(await res.data.blob.arrayBuffer())
    const plain = await decryptPDF(out, "hunter2")
    const doc = await PDFDocument.load(plain)
    expect(doc.getPageCount()).toBe(2)
  })

  it("fails to load the encrypted PDF with the wrong password", async () => {
    const pdf = await makePdf(1)
    const res = await runPdfProtect({
      file: pdfFile(pdf, "doc.pdf"),
      password: "correct-horse",
    }).result
    const out = new Uint8Array(await res.data.blob.arrayBuffer())
    await expect(decryptPDF(out, "wrong-password")).rejects.toThrow()
  })
})