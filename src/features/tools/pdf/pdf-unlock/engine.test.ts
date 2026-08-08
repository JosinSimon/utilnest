import { describe, it, expect } from "vitest"
import { PDFDocument } from "pdf-lib"
import { encryptPDF } from "@pdfsmaller/pdf-encrypt"
import { runPdfUnlock } from "./engine"

async function makePdf(pageCount = 2): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pageCount; i++) doc.addPage([200, 300])
  return doc.save()
}

async function encryptedFile(password = "hunter2"): Promise<File> {
  const plain = await makePdf(3)
  const enc = await encryptPDF(plain, password, { ownerPassword: password })
  return new File([enc as unknown as BlobPart], "secret.pdf", { type: "application/pdf" })
}

describe("pdf-unlock engine", () => {
  it("decrypts a protected PDF with the correct password", async () => {
    const file = await encryptedFile("open-sesame")
    const res = await runPdfUnlock({ file, password: "open-sesame" }).result

    expect(res.success).toBe(true)
    expect(res.data.pageCount).toBe(3)
    expect(res.data.fileName).toBe("secret-unlocked.pdf")

    const doc = await PDFDocument.load(new Uint8Array(await res.data.blob.arrayBuffer()))
    expect(doc.getPageCount()).toBe(3)
  })

  it("errors with a clear message on the wrong password", async () => {
    const file = await encryptedFile("correct")
    const res = await runPdfUnlock({ file, password: "wrong" }).result
    expect(res.success).toBe(false)
    expect(res.error?.code).toBe("pdf_unlock_error")
    expect(res.error?.message).toMatch(/password/i)
  })

  it("fails cleanly on an unencrypted PDF", async () => {
    const plain = new File([(await makePdf(1)) as unknown as BlobPart], "open.pdf", {
      type: "application/pdf",
    })
    const res = await runPdfUnlock({ file: plain, password: "anything" }).result
    expect(res.success).toBe(false)
  })
})