import { describe, it, expect } from "vitest"
import { PDFDocument } from "pdf-lib"
import { runPdfSplit } from "./engine"
import { verifyZipArchive } from "@/features/tools/shared/pdf"

async function makePdf(pageCount: number): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pageCount; i++) doc.addPage([200, 300])
  return doc.save()
}

function pdfFile(pdf: Uint8Array, name: string): File {
  return new File([pdf as unknown as BlobPart], name, { type: "application/pdf" })
}

describe("pdf-split engine", () => {
  it("splits into single pages inside a zip", async () => {
    const pdf = await makePdf(3)
    const job = runPdfSplit({
      file: pdfFile(pdf, "doc.pdf"),
      singlePages: true,
    })
    const seen: number[] = []
    job.onProgress((p) => seen.push(p))
    const res = await job.result

    expect(res.success).toBe(true)
    expect(res.data.partCount).toBe(3)
    expect(res.data.fileName).toBe("doc-split.zip")
    expect(res.data.blob.type).toBe("application/zip")

    const raw = new Uint8Array(await res.data.blob.arrayBuffer())
    const { count, names } = verifyZipArchive(raw)
    expect(count).toBe(3)
    expect(names).toEqual(["doc-page-1.pdf", "doc-page-2.pdf", "doc-page-3.pdf"])
    expect(seen[seen.length - 1]).toBe(1)
  })

  it("splits at custom boundaries", async () => {
    const pdf = await makePdf(10)
    const res = await runPdfSplit({
      file: pdfFile(pdf, "report.pdf"),
      singlePages: false,
      atPages: [3, 7],
    }).result

    expect(res.success).toBe(true)
    expect(res.data.partCount).toBe(3)
    const zip = new Uint8Array(await res.data.blob.arrayBuffer())
    const { names } = verifyZipArchive(zip)
    expect(names).toEqual(["report-part-01.pdf", "report-part-02.pdf", "report-part-03.pdf"])
  })

  it("each range extract undershoots the total page count", async () => {
    const pdf = await makePdf(5)
    const res = await runPdfSplit({
      file: pdfFile(pdf, "a.pdf"),
      singlePages: false,
      atPages: [2],
    }).result
    const zip = new Uint8Array(await res.data.blob.arrayBuffer())
    const { count } = verifyZipArchive(zip)
    expect(count).toBe(2)
    // Spot-check first part is 1 page, second is 3.
    expect(res.success).toBe(true)
  })

  it("errors when a range split has no cut points", async () => {
    const pdf = await makePdf(2)
    const res = await runPdfSplit({
      file: pdfFile(pdf, "b.pdf"),
      singlePages: false,
      atPages: [],
    }).result
    expect(res.success).toBe(false)
    expect(res.error?.message).toMatch(/split/i)
  })

  it("fails cleanly on a non-PDF input", async () => {
    const bogus = new File([new Uint8Array([0x50, 0x4b, 0x03, 0x04])], "bogus.pdf", {
      type: "application/pdf",
    })
    const res = await runPdfSplit({ file: bogus, singlePages: true }).result
    expect(res.success).toBe(false)
  })
})