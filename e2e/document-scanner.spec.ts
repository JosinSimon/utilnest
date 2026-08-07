import { test, expect, type Page } from "@playwright/test"

async function makeJpegDataUrl(page: Page): Promise<string> {
  return page.evaluate(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 300
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "#ef4444"
    ctx.fillRect(0, 0, 400, 300)
    return canvas.toDataURL("image/jpeg", 0.9)
  })
}

test("document-scanner combines an image into a PDF", async ({ page }) => {
  const dataUrl = await makeJpegDataUrl(page)
  const [head, body] = dataUrl.split(",")
  const mimeType = /data:(.*?);/.exec(head)![1]
  const buffer = Buffer.from(body, "base64")

  await page.goto("/category/government/document-scanner")
  await page.getByRole("heading", { name: "Document Scanner", exact: true }).waitFor()

  await page.setInputFiles('input[type="file"]', {
    name: "page1.jpg",
    mimeType,
    buffer,
  })

  await page.getByText(/1 page/).waitFor()
  await page.getByRole("button", { name: "Create PDF" }).click()

  await page.getByRole("button", { name: "Download PDF" }).waitFor()
  const panel = await page.locator(".space-y-3.rounded-lg").last().innerText()
  expect(panel).toContain("1")
  expect(panel).toContain("PDF size")
})