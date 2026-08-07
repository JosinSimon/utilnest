import { test, expect, type Page } from "@playwright/test"

/**
 * Generate a small real JPEG (400x300) inside the browser canvas so the full
 * decode pipeline (EXIF, geometry, compress, download) runs on real pixels.
 * Returns a base64 data URL we can feed back into a File input.
 */
async function makeJpegDataUrl(page: Page): Promise<string> {
  return page.evaluate(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 300
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "#3b82f6"
    ctx.fillRect(0, 0, 400, 300)
    return canvas.toDataURL("image/jpeg", 0.9)
  })
}

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; mimeType: string } {
  const [head, body] = dataUrl.split(",")
  const mimeType = /data:(.*?);/.exec(head)![1]
  return { buffer: Buffer.from(body, "base64"), mimeType }
}

test("compress-image runs the full decode->resize->compress->validate->download pipeline", async ({
  page,
}) => {
  const dataUrl = await makeJpegDataUrl(page)
  const file = dataUrlToBuffer(dataUrl)

  await page.goto("/category/government/compress-image")
  await page
    .getByRole("heading", { name: "Compress Image to Target KB", exact: true })
    .waitFor()

  await page.setInputFiles('input[type="file"]', {
    name: "photo.jpg",
    mimeType: file.mimeType,
    buffer: file.buffer,
  })
  await page.getByText("photo.jpg").waitFor()

  await page.getByLabel("Maximum (KB)").fill("50")

  await page.getByRole("button", { name: "Compress image" }).click()

  // Output panel + download button appear after a successful on-browser run.
  await page.getByRole("button", { name: /Download/ }).waitFor({ state: "visible" })
  const resultText = await page.locator(".space-y-3.rounded-lg").innerText()
  expect(resultText).toContain("Format")
  expect(resultText).toContain("JPEG")
})

test("compress-image reports an impossible target honestly (cannotHitTarget)", async ({ page }) => {
  const dataUrl = await makeJpegDataUrl(page)
  const file = dataUrlToBuffer(dataUrl)

  await page.goto("/category/government/compress-image")
  await page.setInputFiles('input[type="file"]', {
    name: "photo.jpg",
    mimeType: file.mimeType,
    buffer: file.buffer,
  })
  await page.getByLabel("Minimum (KB)").fill("0.05") // placeholder validation
  await page.getByLabel("Maximum (KB)").fill("0.001") // absurdly small -> cannot hit

  await page.getByRole("button", { name: "Compress image" }).click()

  // Even a 400x300 JPEG is > 1 byte, so the tool must report rather than fake it.
  await page.getByText(/exceeds the maximum/i).waitFor()
})