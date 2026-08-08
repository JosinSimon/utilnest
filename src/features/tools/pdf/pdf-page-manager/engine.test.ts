import { describe, it, expect } from "vitest"
import { PDFDocument } from "pdf-lib"
import { runPageManager } from "./engine"

async function makePdf(pageCount: number): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pageCount; i++) doc.addPage([200, 300])
  return doc.save()
}

function pdfFile(pdf: Uint8Array, name: string): File {
  return new File([pdf as unknown as BlobPart], name, { type: "application/pdf" })
}

describe("page-manager engine", () => {
  it("reorders pages to the given keep order", async () => {
    const pdf = await makePdf(4)
    const res = await runPageManager({
      file: pdfFile(pdf, "doc.pdf"),
      keep: [3, 1, 4],
    }).result

    expect(res.success).toBe(true)
    expect(res.data.pages).toBe(3)
    expect(res.data.deleted).toBe(1)
    expect(res.data.fileName).toBe("doc-edited.pdf")

    // Can't read page content, but the count + keep metadata is enough.
    const out = await PDFDocument.load(new Uint8Array(await res.data.blob.arrayBuffer()))
    expect(out.getPageCount()).toBe(3)
  })

  it("uses keep order verbatim (repeat + omission respected)", async () => {
    const pdf = await makePdf(3)
    const res = await runPageManager({
      file: pdfFile(pdf, "doc.pdf"),
      keep: [2, 2, 1],
    }).result
    expect(res.success).toBe(true)
    const out = await PDFDocument.load(new Uint8Array(await res.data.blob.arrayBuffer()))
    expect(out.getPageCount()).toBe(3)
  })

  it("errors when no pages are kept", async () => {
    const pdf = await makePdf(2)
    const res = await runPageManager({ file: pdfFile(pdf, "doc.pdf"), keep: [] }).result
    expect(res.success).toBe(false)
    expect(res.error?.message).toMatch(/at least one/i)
  })

  it("errors when the order is unchanged", async () => {
    const pdf = await makePdf(3)
    const res = await runPageManager({ file: pdfFile(pdf, "doc.pdf"), keep: [1, 2, 3] }).result
    expect(res.success).toBe(false)
    expect(res.error?.message).toMatch(/no changes/i)
  })
})