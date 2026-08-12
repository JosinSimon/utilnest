/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import type { ToolDefinition } from "@/data/types"
import PdfCompress from "./index"

afterEach(cleanup)

function toolWithPreset(): ToolDefinition {
  return {
    id: "compress-pdf-below-100kb",
    name: "Compress PDF Below 100KB",
    slug: "compress-pdf-below-100kb",
    category: "pdf",
    path: "pdf/pdf-compress",
    shortDescription: "Compress PDF toward 100KB in your browser.",
    longDescription: "Compress PDF toward 100KB in your browser.",
    sections: [],
    primaryKeyword: "compress pdf below 100kb",
    keywords: [],
    searchAliases: [],
    searchWeight: 1,
    relatedTools: [],
    featured: false,
    trending: false,
    popular: false,
    addedAt: "2026-08-12",
    lastUpdated: "2026-08-12",
    schemaType: "Generator",
    icon: "gauge",
    faq: [],
    howTo: [],
    engine: "file",
    privacyNote: "client",
    preset: { compressionLevel: "1", quality: 55 },
  }
}

describe("PdfCompress preset defaults", () => {
  it("uses manifest compression level and quality defaults", () => {
    render(<PdfCompress tool={toolWithPreset()} />)

    expect(screen.getByRole("radio", { name: /Strong/i }).getAttribute("aria-checked")).toBe("true")
    expect(screen.getByLabelText(/Image quality: 55%/i)).toBeTruthy()
  })
})
