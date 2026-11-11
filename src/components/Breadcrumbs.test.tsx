/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { MemoryRouter } from "react-router-dom"
import { Breadcrumbs } from "./Breadcrumbs"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("Breadcrumbs", () => {
  it("does not emit duplicate-key warnings when different labels share a path", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined)

    render(
      <MemoryRouter>
        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            { label: "Tools", path: "/tools" },
            { label: "Image", path: "/tools" },
          ]}
        />
      </MemoryRouter>,
    )

    expect(errorSpy.mock.calls.flat().join("\n")).not.toContain("same key")
  })

  it("shows Home only once when the items already start with Home", () => {
    render(
      <MemoryRouter>
        <Breadcrumbs items={[{ label: "Home", path: "/" }, { label: "Finance", path: "/category/finance" }, { label: "Car EMI", path: "/x" }]} />
      </MemoryRouter>,
    )
    expect(screen.getAllByText("Home")).toHaveLength(1)
  })
})
