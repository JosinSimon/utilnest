import { test, expect } from "@playwright/test"
import { PDFDocument } from "pdf-lib"

async function makePdf(pageCount: number): Promise<Buffer> {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pageCount; i++) doc.addPage([200, 300])
  return Buffer.from(await doc.save())
}

async function pdfFile(page: import("@playwright/test").Page, name: string, byte: Buffer) {
  await page.setInputFiles('input[type="file"]', {
    name,
    mimeType: "application/pdf",
    buffer: byte,
  })
}

async function readPanel(page: import("@playwright/test").Page): Promise<string> {
  await page.getByRole("button", { name: /Download rotated PDF/ }).waitFor()
  return page.locator(".space-y-3.rounded-lg").last().innerText()
}

test("rotate panel updates when options change and re-run", async ({ page }) => {
  const pdf = await makePdf(3)
  await page.goto("/category/pdf/pdf-rotate")
  await page.getByRole("heading", { name: "Rotate PDF", exact: true }).waitFor()
  await pdfFile(page, "scan.pdf", pdf)

  await page.getByRole("button", { name: "Rotate PDF", exact: true }).click()
  const first = await readPanel(page)
  console.log("RUN1 PANEL:", JSON.stringify(first))

  await page.getByLabel("Pages to rotate (optional)").fill("1")
  await page.getByRole("button", { name: "Rotate PDF", exact: true }).click()
  await page.waitForTimeout(500)
  const second = await readPanel(page)
  console.log("RUN2 PANEL:", JSON.stringify(second))

  // The Rotated count should have dropped from 3 to 1.
  expect(second).toContain("Rotated")
  const rows = second.split("\n").map((s) => s.trim()).filter(Boolean)
  const rotatedIdx = rows.indexOf("Rotated")
  expect(rotatedIdx).toBeGreaterThanOrEqual(0)
  expect(rows[rotatedIdx + 1]).toBe("1")
})