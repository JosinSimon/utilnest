// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, cleanup, within } from "@testing-library/react"
import FindReplace from "./index"

function setup() {
  return render(<FindReplace tool={{ id: "find-replace", name: "Find & Replace" } as never} />)
}

describe("Find & Replace UI toggles", () => {
  beforeEach(() => {
    setup()
  })

  afterEach(() => {
    cleanup()
  })

  it("replaces case-insensitively by default", () => {
    const text = screen.getByLabelText("Text to edit")
    fireEvent.change(text, { target: { value: "Fox fox FOX" } })
    const find = screen.getByPlaceholderText("Text to find…")
    const replace = screen.getByPlaceholderText("Replacement (blank deletes)…")
    fireEvent.change(find, { target: { value: "fox" } })
    fireEvent.change(replace, { target: { value: "cat" } })

    const result = screen.getByText(/cat cat cat/)
    expect(result).toBeTruthy()
  })

  it("case-sensitive toggle changes output and only matches exact case", () => {
    const text = screen.getByLabelText("Text to edit")
    fireEvent.change(text, { target: { value: "Fox fox FOX" } })
    fireEvent.change(screen.getByPlaceholderText("Text to find…"), { target: { value: "fox" } })
    fireEvent.change(screen.getByPlaceholderText("Replacement (blank deletes)…"), {
      target: { value: "cat" },
    })

    const toggle = screen.getByRole("switch", { name: /Case sensitive/ })
    fireEvent.click(toggle)

    expect(screen.getByText(/Fox cat FOX/)).toBeTruthy()
    expect(screen.queryByText(/cat cat cat/)).toBeNull()
  })

  it("whole-word toggle only replaces whole words", () => {
    const text = screen.getByLabelText("Text to edit")
    fireEvent.change(text, { target: { value: "cat catalog" } })
    fireEvent.change(screen.getByPlaceholderText("Text to find…"), { target: { value: "cat" } })
    fireEvent.change(screen.getByPlaceholderText("Replacement (blank deletes)…"), {
      target: { value: "dog" },
    })

    const toggle = screen.getByRole("switch", { name: /Whole word only/ })
    fireEvent.click(toggle)

    expect(screen.getByText(/dog catalog/)).toBeTruthy()
    expect(screen.queryByText(/dog dogalog/)).toBeNull()
  })

  it("toggles flip the switch state on each click", () => {
    const toggle = screen.getByRole("switch", { name: /Case sensitive/ })
    expect(toggle.getAttribute("aria-checked")).toBe("false")
    fireEvent.click(toggle)
    expect(toggle.getAttribute("aria-checked")).toBe("true")
    fireEvent.click(toggle)
    expect(toggle.getAttribute("aria-checked")).toBe("false")
  })

  it("shows an On/Off state label and live match count", () => {
    const toggle = screen.getByRole("switch", { name: /Whole word only/ })
    expect(within(toggle).getByText("Off")).toBeTruthy()
    fireEvent.click(toggle)
    expect(within(toggle).getByText("On")).toBeTruthy()
  })

  it("highlights exactly which words match under current settings", () => {
    const text = screen.getByLabelText("Text to edit")
    fireEvent.change(text, { target: { value: "Indian indian" } })
    fireEvent.change(screen.getByPlaceholderText("Text to find…"), { target: { value: "Indian" } })
    fireEvent.change(screen.getByPlaceholderText("Replacement (blank deletes)…"), {
      target: { value: "American" },
    })

    expect(screen.getByText("What will be replaced")).toBeTruthy()
    expect(screen.getByText(/Case sensitive is OFF/)).toBeTruthy()

    fireEvent.click(screen.getByRole("switch", { name: /Case sensitive/ }))
    expect(screen.getByText(/only exact-case matches are highlighted/)).toBeTruthy()
  })
})
