import { test, expect, type Page } from "@playwright/test"

async function makeJpegDataUrl(page: Page): Promise<string> {
  return page.evaluate(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 300
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "#10b981"
    ctx.fillRect(0, 0, 400, 300)
    return canvas.toDataURL("image/jpeg", 0.9)
  })
}

test("resize-image produces an exact pixel (453x453) output", async ({ page }) => {
  const dataUrl = await makeJpegDataUrl(page)
  const [head, body] = dataUrl.split(",")
  const mimeType = /data:(.*?);/.exec(head)![1]
  const buffer = Buffer.from(body, "base64")

  await page.goto("/category/government/resize-image")
  await page
    .getByRole("heading", { name: "Resize Image to Exact Pixels", exact: true })
    .waitFor()

  await page.setInputFiles('input[type="file"]', {
    name: "src.jpg",
    mimeType,
    buffer,
  })
  await page.getByText("src.jpg").waitFor()

  await page.getByLabel("Width (px)", { exact: true }).fill("453")
  await page.getByLabel("Height (px)", { exact: true }).fill("453")

  await page.getByRole("button", { name: "Resize image" }).click()

  await page.getByRole("button", { name: "Download", exact: true }).waitFor()
  const text = await page.locator(".space-y-3.rounded-lg").innerText()
  expect(text).toContain("453 × 453 px")
  expect(text).toContain("JPEG")
})