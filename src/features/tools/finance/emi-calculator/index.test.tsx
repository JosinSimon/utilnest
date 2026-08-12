/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import EmiCalculator from "./index"
import type { ToolDefinition } from "@/data/types"

afterEach(cleanup)

function toolWithPreset(preset: ToolDefinition["preset"]): ToolDefinition {
  return {
    id: "emi-calculator",
    name: "EMI Calculator",
    slug: "emi-calculator",
    category: "finance",
    path: "finance/emi-calculator",
    shortDescription: "d",
    longDescription: "d",
    sections: [],
    primaryKeyword: "emi calculator",
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
    icon: "calculator",
    faq: [],
    howTo: [],
    engine: "calculator",
    privacyNote: "none",
    preset,
  }
}

describe("EmiCalculator presets", () => {
  it("applies home loan preset defaults to the form fields", () => {
    render(
      <EmiCalculator
        tool={toolWithPreset({
          defaultPrincipal: 5000000,
          defaultAnnualRate: 8.5,
          defaultTenureYears: 20,
        })}
      />,
    )

    expect((screen.getByLabelText("Loan amount (₹)") as HTMLInputElement).value).toBe(String(5000000))
    expect((screen.getByLabelText("Annual interest rate (%)") as HTMLInputElement).value).toBe(String(8.5))
    expect((screen.getByLabelText("Tenure — years") as HTMLInputElement).value).toBe(String(20))
  })

  it("applies personal loan preset defaults", () => {
    render(
      <EmiCalculator
        tool={toolWithPreset({
          defaultPrincipal: 500000,
          defaultAnnualRate: 13,
          defaultTenureYears: 3,
        })}
      />,
    )

    expect((screen.getByLabelText("Loan amount (₹)") as HTMLInputElement).value).toBe(String(500000))
    expect((screen.getByLabelText("Annual interest rate (%)") as HTMLInputElement).value).toBe(String(13))
    expect((screen.getByLabelText("Tenure — years") as HTMLInputElement).value).toBe(String(3))
  })

  it("falls back to the generic defaults without a preset", () => {
    render(<EmiCalculator tool={toolWithPreset(undefined)} />)

    expect((screen.getByLabelText("Loan amount (₹)") as HTMLInputElement).value).toBe(String(5000000))
    expect((screen.getByLabelText("Annual interest rate (%)") as HTMLInputElement).value).toBe(String(8.5))
    expect((screen.getByLabelText("Tenure — years") as HTMLInputElement).value).toBe(String(20))
  })
})