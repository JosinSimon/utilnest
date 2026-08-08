import { describe, it, expect } from "vitest"
import { PDFDocument } from "pdf-lib"
import { runPdfRotate } from "./engine"
import { probePdf } from "@/features/tools/shared/pdf"

async function makePdf(pageCount: number): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pageCount; i++) doc.addPage([200, 300])
  return doc.save()
}

function pdfFile(pdf: Uint8Array, name: string): File {
  return new File([pdf as unknown as BlobPart], name, { type: "application/pdf" })
}

describe("pdf-rotate engine", () => {
  it("rotates every page by the given angle", async () => {
    const pdf = await makePdf(2)
    const res = await runPdfRotate({
      file: pdfFile(pdf, "scan.pdf"),
      degrees: 90,
    }).result

    expect(res.success).toBe(true)
    expect(res.data.affected).toBe(2)
    expect(res.data.fileName).toBe("scan-rotated.pdf")

    const out = await PDFDocument.load(
      new Uint8Array(await res.data.blob.arrayBuffer()),
    )
    const [p0, p1] = out.getPages()
    expect(p0.getRotation().angle).toBe(90)
    expect(p1.getRotation().angle).toBe(90)
  })

  it("rotates only the selected pages", async () => {
    const pdf = await makePdf(3)
    const res = await runPdfRotate({
      file: pdfFile(pdf, "scan.pdf"),
      degrees: 180,
      pages: [1, 3],
    }).result

    expect(res.success).toBe(true)
    expect(res.data.affected).toBe(2)
    const out = await PDFDocument.load(
      new Uint8Array(await res.data.blob.arrayBuffer()),
    )
    expect(out.getPage(0).getRotation().angle).toBe(180)
    expect(out.getPage(1).getRotation().angle).toBe(0)
    expect(out.getPage(2).getRotation().angle).toBe(180)
  })

  it("adds cumulative rotation for a 270° pass", async () => {
    const pdf = await makePdf(1)
    const res = await runPdfRotate({
      file: pdfFile(pdf, "scan.pdf"),
      degrees: 270,
    }).result
    const out = await PDFDocument.load(
      new Uint8Array(await res.data.blob.arrayBuffer()),
    )
    expect(out.getPage(0).getRotation().angle).toBe(270)
  })

  it("fails cleanly on a non-PDF", async () => {
    const bogus = new File([new Uint8Array([1, 2, 3])], "bogus.pdf", {
      type: "application/pdf",
    })
    const res = await runPdfRotate({ file: bogus, degrees: 90 }).result
    expect(res.success).toBe(false)
    expect(res.error?.code).toBe("pdf_rotate_error")
  })

  it("probePdf reports the same page count after rotation", async () => {
    const pdf = await makePdf(4)
    const res = await runPdfRotate({ file: pdfFile(pdf, "scan.pdf"), degrees: 90 }).result
    const { pageCount } = await probePdf(new Uint8Array(await res.data.blob.arrayBuffer()))
    expect(pageCount).toBe(4)
  })
})