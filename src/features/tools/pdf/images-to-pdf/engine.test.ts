import { describe, it, expect } from "vitest"
import { PDFDocument } from "pdf-lib"
import { runImagesToPdf } from "./engine"
import { PDF_PAPER_PT } from "@/features/tools/shared/pdf"

// Minimal 1x1 PNG (valid, decodable by pdf-lib).
const PNG_1X1 = Uint8Array.from(
  atob(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  ),
  (c) => c.charCodeAt(0),
)

function pngFile(name: string): File {
  return new File([PNG_1X1], name, { type: "image/png" })
}

describe("images-to-pdf engine", () => {
  it("builds one PDF page per image (match size)", async () => {
    const res = await runImagesToPdf({
      files: [pngFile("a.png"), pngFile("b.png"), pngFile("c.png")],
      pageSize: "A4",
      rotation: 0,
      margin: 8,
    }).result

    expect(res.success).toBe(true)
    expect(res.data.imageCount).toBe(3)
    expect(res.data.pages).toBe(3)
    expect(res.data.fileName).toBe("images.pdf")
    expect(res.data.blob.type).toBe("application/pdf")
  })

  it("produces a loadable PDF where match pages equal pixel size", async () => {
    const res = await runImagesToPdf({
      files: [pngFile("a.png")],
      pageSize: "match",
      rotation: 0,
      margin: 0,
    }).result
    expect(res.success).toBe(true)
    const doc = await PDFDocument.load(
      new Uint8Array(await res.data.blob.arrayBuffer()),
    )
    expect(doc.getPageCount()).toBe(1)
    // PNG is 1x1 px → 1×1 pt page.
    expect(doc.getPage(0).getWidth()).toBe(1)
    expect(doc.getPage(0).getHeight()).toBe(1)
  })

  it("A4 pages fit the image inside the paper size", async () => {
    const res = await runImagesToPdf({
      files: [pngFile("a.png")],
      pageSize: "A4",
      rotation: 0,
      margin: 20,
    }).result
    const doc = await PDFDocument.load(
      new Uint8Array(await res.data.blob.arrayBuffer()),
    )
    const [w, h] = PDF_PAPER_PT["A4"]
    expect(doc.getPage(0).getWidth()).toBeCloseTo(w, 1)
    expect(doc.getPage(0).getHeight()).toBeCloseTo(h, 1)
  })

  it("throws a clear error with no images", async () => {
    const res = await runImagesToPdf({
      files: [],
      pageSize: "A4",
      rotation: 0,
      margin: 8,
    }).result
    expect(res.success).toBe(false)
    expect(res.error?.message).toMatch(/at least one image/i)
  })
})

void PDF_PAPER_PT