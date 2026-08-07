import { test, expect, type Page } from "@playwright/test"

async function makeJpegDataUrl(page: Page, w: number, h: number): Promise<string> {
  return page.evaluate(
    ({ width, height }) => {
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")!
      ctx.fillStyle = "#3a7bd5"
      ctx.fillRect(0, 0, width, height)
      return canvas.toDataURL("image/jpeg", 0.92)
    },
    { width: w, height: h },
  )
}

async function setFile(page: Page, dataUrl: string, name: string) {
  const [head, body] = dataUrl.split(",")
  const mimeType = /data:(.*?);/.exec(head)![1]
  await page.setInputFiles('input[type="file"]', {
    name,
    mimeType,
    buffer: Buffer.from(body, "base64"),
  })
}

test("image-resizer resizes to exact pixels with aspect preserved when one side is blank", async ({ page }) => {
  const dataUrl = await makeJpegDataUrl(page, 800, 600)
  await page.goto("/category/image/image-resizer")
  await page.getByRole("heading", { name: "Image Resizer", exact: true }).waitFor()

  await setFile(page, dataUrl, "photo.jpg")
  await page.getByLabel("Width (px)").fill("400")
  await page.getByRole("button", { name: "Resize image" }).click()

  await page.getByRole("button", { name: "Download", exact: true }).waitFor()
  const panel = await page.locator(".space-y-3.rounded-lg").last().innerText()
  expect(panel).toContain("400 × 300 px")
})

test("image-compressor compresses a photo below a target size", async ({ page }) => {
  const dataUrl = await makeJpegDataUrl(page, 1200, 900)
  await page.goto("/category/image/image-compressor")
  await page.getByRole("heading", { name: "Image Compressor", exact: true }).waitFor()

  await setFile(page, dataUrl, "large.jpg")
  await page.getByRole("button", { name: "100 KB", exact: true }).click()
  await page.getByRole("button", { name: "Compress image" }).click()

  await page.getByRole("button", { name: /Download/ }).waitFor()
})

test("image-base64 encodes a PNG to a data URL and decodes it back", async ({ page }) => {
  const dataUrl = await makeJpegDataUrl(page, 64, 64)
  await page.goto("/category/image/image-base64")
  await page.getByRole("heading", { name: "Image to Base64", exact: true }).waitFor()

  // Encode
  await setFile(page, dataUrl, "tiny.jpg")
  await page.getByRole("button", { name: "Encode to Base64" }).click()
  const textarea = page.locator("textarea").first()
  await textarea.waitFor()
  const encoded = await textarea.inputValue()
  expect(encoded.startsWith("data:image/jpeg;base64,")).toBe(true)

  // Switch to decode and paste it back
  await page.getByRole("radio", { name: "Base64 → Image" }).click()
  await page.locator("textarea").fill(encoded)
  await page.getByRole("button", { name: "Decode to image" }).click()

  await page.getByRole("button", { name: /Download decoded-image.jpg/ }).waitFor()
})