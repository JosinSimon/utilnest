import { test, expect, type Page } from "@playwright/test"

async function makeJpegDataUrl(page: Page, size: number): Promise<string> {
  return page.evaluate((px) => {
    const canvas = document.createElement("canvas")
    canvas.width = px
    canvas.height = px
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, px, px)
    return canvas.toDataURL("image/jpeg", 0.9)
  }, size)
}

test("government-exam-photo runs the preset pipeline and validates output", async ({ page }) => {
  const dataUrl = await makeJpegDataUrl(page, 600)
  const [head, body] = dataUrl.split(",")
  const mimeType = /data:(.*?);/.exec(head)![1]
  const buffer = Buffer.from(body, "base64")

  await page.goto("/category/government/government-exam-photo")
  await page.getByRole("heading", { name: "Govt Form Photo Resizer", exact: true }).waitFor()

  // Spec picker shows SSC CGL photo first.
  await page.getByRole("button", { name: /SSC CGL/ }).first().click()

  await page.setInputFiles('input[type="file"]', {
    name: "me.jpg",
    mimeType,
    buffer,
  })

  await page.getByRole("button", { name: "Prepare for submission" }).click()

  // Output panel + download appear after processing.
  await page.getByRole("button", { name: "Download", exact: true }).waitFor()
  const panel = await page.locator(".space-y-3.rounded-lg").last().innerText()
  expect(panel).toContain("Final size")
  expect(panel).toContain("200 × 230 px")
})

test("passport-photo-maker defaults to 3.5x3.5 cm at 300 dpi (~413px)", async ({ page }) => {
  const dataUrl = await makeJpegDataUrl(page, 800)
  const [head, body] = dataUrl.split(",")
  const mimeType = /data:(.*?);/.exec(head)![1]
  const buffer = Buffer.from(body, "base64")

  await page.goto("/category/government/passport-photo-maker")
  await page.getByRole("heading", { name: "Passport Photo Maker", exact: true }).waitFor()

  // The "renders to ~413px" note is shown for the cm-dimension preset (no DPI input).
  await page.getByText(/Renders to ≈ 413×413 px/).waitFor()
  await page.setInputFiles('input[type="file"]', {
    name: "photo.jpg",
    mimeType,
    buffer,
  })
  await page.getByRole("button", { name: "Prepare for submission" }).click()

  await page.getByRole("button", { name: "Download", exact: true }).waitFor()
  const panel = await page.locator(".space-y-3.rounded-lg").last().innerText()
  expect(panel).toContain("413 × 413 px")
})