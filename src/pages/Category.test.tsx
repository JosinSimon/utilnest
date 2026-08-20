/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { CategoryPage } from "./Category"

afterEach(cleanup)

function renderCategory(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe("CategoryPage", () => {
  it("renders curated grouped sections for image tools", () => {
    renderCategory("/category/image")

    expect(screen.getByRole("heading", { name: "Popular Image Tools" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Convert Image Formats" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Edit & Enhance Images" })).toBeTruthy()
  })

  it("renders curated grouped sections for government tools", () => {
    renderCategory("/category/government")

    expect(screen.getByRole("heading", { name: "Popular Government Form Tools" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Exam Photo & Signature Presets" })).toBeTruthy()
  })

  it("renders curated grouped sections for PDF tools", () => {
    renderCategory("/category/pdf")

    expect(screen.getByRole("heading", { name: "PDF Upload Limit Compressors" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Compress PDF Below 100KB" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Convert PDFs and Images" })).toBeTruthy()
  })

  it("renders curated grouped sections for finance tools", () => {
    renderCategory("/category/finance")

    expect(screen.getByRole("heading", { name: "Popular Finance Calculators" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Loan EMI Calculators" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Tax & GST Calculators" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Savings & Investment Calculators" })).toBeTruthy()
    expect(screen.getAllByRole("heading", { name: "Home Loan EMI Calculator" }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole("heading", { name: "Reverse GST Calculator" }).length).toBeGreaterThanOrEqual(1)
  })

  it("renders curated grouped sections for audio tools", () => {
    renderCategory("/category/audio")

    expect(screen.getByRole("heading", { name: "Popular Audio Converters" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Call Recordings & Voice Notes" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Audio Format Converters" })).toBeTruthy()
  })
})
