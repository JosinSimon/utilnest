import { describe, it, expect } from "vitest"
import { PDFDocument } from "pdf-lib"
import { runPdfMerge } from "./engine"
import { probePdf, mergePdfs } from "@/features/tools/shared/pdf"

async function makePdf(pageCount: number): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pageCount; i++) doc.addPage([200, 300])
  return doc.save()
}

function pdfFile(pdf: Uint8Array, name: string): File {
  const bits: BlobPart[] = [pdf as unknown as BlobPart]
  return new File(bits, name, { type: "application/pdf" })
}

describe("pdf-merge engine", () => {
  it("merges multiple PDFs preserving page order and count", async () => {
    const a = await makePdf(2)
    const b = await makePdf(3)
    const job = runPdfMerge({
      files: [pdfFile(a, "a.pdf"), pdfFile(b, "b.pdf")],
    })

    const seen: number[] = []
    job.onProgress((p) => seen.push(p))
    const res = await job.result

    expect(res.success).toBe(true)
    const data = res.data
    expect(data.sourceCount).toBe(2)
    expect(data.pages).toBe(5)
    expect(data.bytes).toBeGreaterThan(0)
    expect(data.fileName).toBe("merged.pdf")
    expect(data.blob.type).toBe("application/pdf")

    const merged = await probePdf(new Uint8Array(await data.blob.arrayBuffer()))
    expect(merged.pageCount).toBe(5)
    // Progress is monotonic and finishes at 1.
    expect(seen[seen.length - 1]).toBe(1)
    for (let i = 1; i < seen.length; i++) expect(seen[i]).toBeGreaterThanOrEqual(seen[i - 1])
  })

  it("merges a single file into a copy", async () => {
    const a = await makePdf(1)
    const res = await runPdfMerge({ files: [pdfFile(a, "a.pdf")] }).result
    expect(res.success).toBe(true)
    expect(res.data.pages).toBe(1)
    expect(res.data.sourceCount).toBe(1)
  })

  it("fails cleanly when no files are given", async () => {
    const res = await runPdfMerge({ files: [] }).result
    expect(res.success).toBe(false)
    expect(res.error?.message).toMatch(/at least one/i)
  })

  it("rejects a non-PDF source", async () => {
    const bogus = new File([new Uint8Array([0x50, 0x4b, 0x03, 0x04])], "x.pdf", {
      type: "application/pdf",
    })
    const a = await makePdf(1)
    const res = await runPdfMerge({ files: [bogus, pdfFile(a, "a.pdf")] }).result
    expect(res.success).toBe(false)
    expect(res.error?.code).toBe("pdf_merge_error")
  })

  it("mergePdfs preserves page sizes from each source", async () => {
    const wide = await PDFDocument.create()
    wide.addPage([400, 200])
    const tall = await PDFDocument.create()
    tall.addPage([150, 500])
    const mergedBytes = await mergePdfs([
      { bytes: await wide.save(), name: "wide.pdf" },
      { bytes: await tall.save(), name: "tall.pdf" },
    ])
    const out = await PDFDocument.load(mergedBytes)
    expect(out.getPageCount()).toBe(2)
    const [p0, p1] = out.getPages()
    expect(p0.getWidth()).toBe(400)
    expect(p1.getWidth()).toBe(150)
  })
})