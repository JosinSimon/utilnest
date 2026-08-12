/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import type { ToolDefinition } from "@/data/types"
import CompressImage from "./index"

afterEach(cleanup)

const baseTool: ToolDefinition = {
  id: "compress-image-to-100kb",
  name: "Compress Image to 100KB",
  slug: "compress-image-to-100kb",
  category: "image",
  path: "government/compress-image",
  shortDescription: "Compress images to 100KB in your browser for online forms and uploads.",
  longDescription: "Compress images to 100KB in your browser for online forms and uploads.",
  sections: [],
  primaryKeyword: "compress image to 100kb",
  keywords: [],
  searchAliases: [],
  searchWeight: 1,
  relatedTools: [],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",
  schemaType: "Utility",
  icon: "compress",
  faq: [],
  howTo: [],
  engine: "file",
  privacyNote: "client",
  preset: { targetKb: 100 },
}

describe("CompressImage preset defaults", () => {
  it("uses the manifest target KB as the default maximum size", () => {
    render(<CompressImage tool={baseTool} />)

    expect((screen.getByLabelText("Maximum (KB)") as HTMLInputElement).value).toBe("100")
  })
})
