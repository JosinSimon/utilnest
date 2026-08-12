/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import type { ToolDefinition } from "@/data/types"
import ExamPreset from "./index"

afterEach(cleanup)

function toolWithPresetIds(presetIds: string[]): ToolDefinition {
  return {
    id: "ibps-photo-signature-resize",
    name: "IBPS Photo and Signature Resize",
    slug: "ibps-photo-signature-resize",
    category: "government",
    path: "government/exam-preset",
    shortDescription: "Resize IBPS photo and signature images in your browser.",
    longDescription: "Resize IBPS photo and signature images in your browser.",
    sections: [],
    primaryKeyword: "ibps photo signature resize",
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
    icon: "id-card",
    faq: [],
    howTo: [],
    engine: "file",
    privacyNote: "client",
    preset: { presetIds },
  }
}

describe("ExamPreset exact-intent defaults", () => {
  it("limits the visible preset choices to manifest preset ids", () => {
    render(<ExamPreset tool={toolWithPresetIds(["ibps-po-photo", "ibps-signature"])} />)

    expect(screen.getAllByText("IBPS PO / Clerk")).toHaveLength(2)
    expect(screen.queryByText("NEET UG")).toBeNull()
    expect(screen.queryByText("SSC CGL")).toBeNull()
  })
})
