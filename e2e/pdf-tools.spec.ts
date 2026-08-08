import { test, expect } from "@playwright/test"
import { PDFDocument } from "pdf-lib"

async function makePdf(pageCount: number): Promise<Buffer> {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pageCount; i++) doc.addPage([200, 300])
  return Buffer.from(await doc.save())
}

test("pdf-merge combines two PDFs into one", async ({ page }) => {
  const a = await makePdf(2)
  const b = await makePdf(3)
  await page.goto("/category/pdf/pdf-merge")
  await page.getByRole("heading", { name: "Merge PDF", exact: true }).waitFor()

  await page.setInputFiles('input[type="file"]', [
    { name: "a.pdf", mimeType: "application/pdf", buffer: a },
    { name: "b.pdf", mimeType: "application/pdf", buffer: b },
  ])
  await page.getByText("2 files").waitFor()

  await page.getByRole("button", { name: "Merge PDFs" }).click()
  await page.getByRole("button", { name: /Download merged\.pdf/ }).waitFor()

  const panel = await page.locator(".space-y-3.rounded-lg").last().innerText()
  expect(panel).toContain("5")
  expect(panel).toContain("Sources")
})

test("pdf-split single-page mode produces a zip of per-page PDFs", async ({ page }) => {
  const pdf = await makePdf(3)
  await page.goto("/category/pdf/pdf-split")
  await page.getByRole("heading", { name: "Split PDF", exact: true }).waitFor()

  await page.setInputFiles('input[type="file"]', {
    name: "doc.pdf",
    mimeType: "application/pdf",
    buffer: pdf,
  })
  // Single-page mode is the default selection.
  await page.getByRole("button", { name: "Split PDF" }).click()

  await page.getByRole("button", { name: "Download zip" }).waitFor()
  const panel = await page.locator(".space-y-3.rounded-lg").last().innerText()
  expect(panel).toContain("3")
  expect(panel).toContain("doc-split.zip")
})

test("pdf-rotate turns every page 90 degrees", async ({ page }) => {
  const pdf = await makePdf(2)
  await page.goto("/category/pdf/pdf-rotate")
  await page.getByRole("heading", { name: "Rotate PDF", exact: true }).waitFor()

  await page.setInputFiles('input[type="file"]', {
    name: "scan.pdf",
    mimeType: "application/pdf",
    buffer: pdf,
  })
  await page.getByText("scan.pdf").waitFor()

  // 90° is preselected; run it.
  await page.getByRole("button", { name: "Rotate PDF" }).click()
  await page.getByRole("button", { name: /Download rotated PDF/ }).waitFor()

  const panel = await page.locator(".space-y-3.rounded-lg").last().innerText()
  expect(panel).toContain("Rotated")
  expect(panel).toContain("2")
})

test("pdf-protect encrypts and pdf-unlock decrypts the same file", async ({ page }) => {
  const pdf = await makePdf(1)
  await page.goto("/category/pdf/pdf-protect")
  await page.getByRole("heading", { name: "Protect PDF", exact: true }).waitFor()

  await page.setInputFiles('input[type="file"]', {
    name: "secret.pdf",
    mimeType: "application/pdf",
    buffer: pdf,
  })
  await page.getByLabel("Password", { exact: true }).fill("open-sesame")
  await page.getByLabel("Confirm password").fill("open-sesame")
  await page.getByRole("button", { name: "Protect PDF" }).click()

  await page.getByRole("button", { name: /Download protected PDF/ }).waitFor()
  const panel = await page.locator(".space-y-3.rounded-lg").last().innerText()
  expect(panel).toContain("AES-256")
})