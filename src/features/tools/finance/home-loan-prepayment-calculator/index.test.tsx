/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { getToolBySlug } from "@/data/registry"
import PrepaymentCalculator from "./index"
import EligibilityCalculator from "../home-loan-eligibility-calculator/index"

afterEach(cleanup)

describe("home loan calculators UI", () => {
  it("shows prepayment savings for the default ₹5 lakh prepayment", () => {
    render(<PrepaymentCalculator tool={getToolBySlug("home-loan-prepayment-calculator")!} />)
    expect(screen.getByText("₹13,19,639")).toBeTruthy()
    expect(screen.getByText(/3 years 5 months earlier/)).toBeTruthy()
  })

  it("switches to reduce-EMI mode", () => {
    render(<PrepaymentCalculator tool={getToolBySlug("home-loan-prepayment-calculator")!} />)
    fireEvent.click(screen.getByText("Reduce EMI"))
    expect(screen.getByText(/drops from ₹43,391.16 to ₹38,749.70/)).toBeTruthy()
  })

  it("shows eligibility and the property-value cap", () => {
    render(<EligibilityCalculator tool={getToolBySlug("home-loan-eligibility-calculator")!} />)
    expect(screen.getAllByText("₹46,09,234").length).toBeGreaterThan(0)
    fireEvent.change(screen.getByLabelText(/Property cost/), { target: { value: "5000000" } })
    expect(screen.getAllByText("₹40,00,000").length).toBeGreaterThan(0)
    expect(screen.getByText(/limited by the property cost/)).toBeTruthy()
  })
})
