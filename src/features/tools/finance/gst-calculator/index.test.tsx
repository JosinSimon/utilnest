/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import GstCalculator from "./index"
import type { ToolDefinition } from "@/data/types"

afterEach(cleanup)

function toolWithPreset(preset: ToolDefinition["preset"]): ToolDefinition {
  return {
    id: "gst-calculator",
    name: "GST Calculator",
    slug: "gst-calculator",
    category: "finance",
    path: "finance/gst-calculator",
    shortDescription: "d",
    longDescription: "d",
    sections: [],
    primaryKeyword: "gst calculator",
    keywords: [],
    searchAliases: [],
    searchWeight: 50,
    relatedTools: [],
    featured: false,
    trending: false,
    popular: false,
    addedAt: "2026-08-12",
    lastUpdated: "2026-08-12",
    schemaType: "Calculator",
    icon: "indian-rupee",
    faq: [],
    howTo: [],
    engine: "calculator",
    privacyNote: "none",
    preset,
  }
}

describe("GstCalculator presets", () => {
  it("opens in reverse mode with the default GST rate from the preset", () => {
    render(
      <GstCalculator
        tool={toolWithPreset({ gstMode: "reverse", defaultGstRate: 18 })}
      />,
    )

    expect(screen.getByRole("radio", { name: /Remove GST/ }).getAttribute("aria-checked")).toBe("true")
    expect(screen.getByRole("radio", { name: /Add GST/ }).getAttribute("aria-checked")).toBe("false")
    expect(screen.getByRole("button", { name: "18%" }).getAttribute("aria-pressed")).toBe("true")
  })

  it("opens in the default add-GST mode without a preset", () => {
    render(<GstCalculator tool={toolWithPreset(undefined)} />)

    expect(screen.getByRole("radio", { name: /Add GST/ }).getAttribute("aria-checked")).toBe("true")
    expect(screen.getByRole("radio", { name: /Remove GST/ }).getAttribute("aria-checked")).toBe("false")
  })
})