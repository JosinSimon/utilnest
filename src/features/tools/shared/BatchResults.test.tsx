/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { BatchResults } from "./BatchResults"
import type { BatchItem } from "./batch"
import { downloadBlobsSequentially } from "./download"

interface Out {
  fileName: string
  blob: Blob
  width: number
}

const input = (name: string, size = 2048) => new File([new Uint8Array(size)], name, { type: "image/png" })

const results: BatchItem<Out>[] = [
  { input: input("a.png"), data: { fileName: "a.webp", blob: new Blob(["aaaa"]), width: 10 } },
  { input: input("b.png"), error: "Unsupported image" },
  { input: input("c.png"), data: { fileName: "c.webp", blob: new Blob(["cc"]), width: 20 } },
]

let clicked: string[] = []

beforeEach(() => {
  clicked = []
  URL.createObjectURL = vi.fn(() => "blob:mock")
  URL.revokeObjectURL = vi.fn()
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
    clicked.push(this.download)
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("BatchResults", () => {
  it("lists every file, including failures", () => {
    render(<BatchResults results={results} zipName="x.zip" describe={(o) => ({ details: [`${o.width}px`] })} />)
    expect(screen.getByText("a.webp")).toBeTruthy()
    expect(screen.getByText("c.webp")).toBeTruthy()
    expect(screen.getByText("b.png")).toBeTruthy()
    expect(screen.getByText("Unsupported image")).toBeTruthy()
    expect(screen.getByText(/2 of 3 files ready/)).toBeTruthy()
    expect(screen.getByText(/10px/)).toBeTruthy()
  })

  it("downloads a single file from its row", () => {
    render(<BatchResults results={results} zipName="x.zip" />)
    fireEvent.click(screen.getByRole("button", { name: "Download c.webp" }))
    expect(clicked).toEqual(["c.webp"])
  })

  it("offers both bulk options and no row button for failed files", () => {
    render(<BatchResults results={results} zipName="x.zip" />)
    expect(screen.getByRole("button", { name: /Download all \(separate files\)/ })).toBeTruthy()
    expect(screen.getByRole("button", { name: /Download all as ZIP/ })).toBeTruthy()
    expect(screen.queryByRole("button", { name: "Download b.png" })).toBeNull()
  })
})

describe("downloadBlobsSequentially", () => {
  it("saves each file separately in order", async () => {
    const progress: number[] = []
    await downloadBlobsSequentially(
      [
        { name: "one.mp3", blob: new Blob(["1"]) },
        { name: "two.mp3", blob: new Blob(["2"]) },
      ],
      (saved) => progress.push(saved),
      0,
    )
    expect(clicked).toEqual(["one.mp3", "two.mp3"])
    expect(progress).toEqual([1, 2])
  })
})
