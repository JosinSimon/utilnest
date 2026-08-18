import { chromium } from "@playwright/test"
import { readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

function createIco(pngBuffers: { width: number; height: number; buffer: Buffer }[]): Buffer {
  const count = pngBuffers.length
  const headerSize = 6
  const dirEntrySize = 16
  let offset = headerSize + count * dirEntrySize

  const header = Buffer.alloc(headerSize)
  header.writeUInt16LE(0, 0) // Reserved
  header.writeUInt16LE(1, 2) // Type 1 = ICO
  header.writeUInt16LE(count, 4)

  const dirEntries: Buffer[] = []
  const imageBuffers: Buffer[] = []

  for (const item of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize)
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0)
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1)
    entry.writeUInt8(0, 2) // Palette count
    entry.writeUInt8(0, 3) // Reserved
    entry.writeUInt16LE(1, 4) // Color planes
    entry.writeUInt16LE(32, 6) // Bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8) // Size
    entry.writeUInt32LE(offset, 12) // Offset

    dirEntries.push(entry)
    imageBuffers.push(item.buffer)
    offset += item.buffer.length
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers])
}

async function main() {
  const root = process.cwd()
  const svgPath = resolve(root, "public/favicon.svg")
  const svgContent = await readFile(svgPath, "utf8")

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { display: flex; align-items: center; justify-content: center; width: 100vw; height: 100vh; background: transparent; overflow: hidden; }
          svg { width: 100%; height: 100%; display: block; }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
    </html>
  `

  await page.setContent(html)

  const targets = [
    { name: "icon-512.png", size: 512 },
    { name: "icon-192.png", size: 192 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "favicon-48x48.png", size: 48 },
    { name: "favicon-32x32.png", size: 32 },
    { name: "favicon-16x16.png", size: 16 },
  ]

  const icoFrames: { width: number; height: number; buffer: Buffer }[] = []

  for (const target of targets) {
    await page.setViewportSize({ width: target.size, height: target.size })
    const buffer = await page.screenshot({
      type: "png",
      omitBackground: true,
    })
    const outPath = resolve(root, "public", target.name)
    await writeFile(outPath, buffer)
    console.log(`Generated ${target.name} (${target.size}x${target.size})`)

    if ([16, 32, 48].includes(target.size)) {
      icoFrames.push({ width: target.size, height: target.size, buffer: Buffer.from(buffer) })
    }
  }

  const icoBuffer = createIco(icoFrames)
  await writeFile(resolve(root, "public/favicon.ico"), icoBuffer)
  console.log("Generated favicon.ico (16, 32, 48px frames)")

  await browser.close()
  console.log("All icons and favicon.ico generated successfully.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
