/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import type { ToolDefinition } from "@/data/types"
import ImageConverter from "./index"

afterEach(cleanup)

function toolWithOutputFormat(outputFormat: "jpeg" | "png" | "webp"): ToolDefinition {
  return {
    id: "jpg-to-png",
    name: "JPG to PNG Converter",
    slug: "jpg-to-png",
    category: "image",
    path: "image/image-converter",
    shortDescription: "Convert JPG to PNG in your browser.",
    longDescription: "Convert JPG to PNG in your browser.",
    sections: [],
    primaryKeyword: "jpg to png",
    keywords: [],
    searchAliases: [],
    searchWeight: 1,
    relatedTools: [],
    featured: false,
    trending: false,
    popular: false,
    addedAt: "2026-08-12",
    lastUpdated: "2026-08-12",
    schemaType: "Converter",
    icon: "refresh-cw",
    faq: [],
    howTo: [],
    engine: "file",
    privacyNote: "client",
    preset: { outputFormat },
  }
}

describe("ImageConverter preset defaults", () => {
  it("uses the manifest output format as the selected conversion target", () => {
    render(<ImageConverter tool={toolWithOutputFormat("png")} />)

    expect(screen.getByRole("radio", { name: /PNG/i }).getAttribute("aria-checked")).toBe("true")
  })
})
