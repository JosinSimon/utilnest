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
})
