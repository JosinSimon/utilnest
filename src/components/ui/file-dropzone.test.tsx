/** @vitest-environment jsdom */

import { cleanup, render, screen, fireEvent } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { FileDropzone } from "./file-dropzone"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("FileDropzone", () => {
  it("renders default title and description", () => {
    render(<FileDropzone />)
    expect(screen.getByText(/Drag & drop your file here/i)).toBeTruthy()
  })

  it("handles file drop event and triggers onFile", () => {
    const onFile = vi.fn()
    render(<FileDropzone onFile={onFile} />)

    const file = new File(["dummy content"], "test-image.png", { type: "image/png" })
    const dropzone = screen.getByRole("button")

    fireEvent.dragEnter(dropzone, {
      dataTransfer: {
        items: [{ kind: "file", type: "image/png" }],
        types: ["Files"],
      },
    })

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
        clearData: vi.fn(),
      },
    })

    expect(onFile).toHaveBeenCalledTimes(1)
    expect(onFile).toHaveBeenCalledWith(file)
  })

  it("handles multi-file drop event when multiple is true", () => {
    const onFiles = vi.fn()
    render(<FileDropzone multiple onFiles={onFiles} />)

    const file1 = new File(["1"], "doc1.pdf", { type: "application/pdf" })
    const file2 = new File(["2"], "doc2.pdf", { type: "application/pdf" })
    const dropzone = screen.getByRole("button")

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file1, file2],
        clearData: vi.fn(),
      },
    })

    expect(onFiles).toHaveBeenCalledTimes(1)
    expect(onFiles).toHaveBeenCalledWith([file1, file2])
  })

  it("displays currently selected single file with clear button", () => {
    const onClear = vi.fn()
    const file = new File(["test"], "sample.jpg", { type: "image/jpeg" })

    render(<FileDropzone file={file} onClear={onClear} />)

    expect(screen.getByText("sample.jpg")).toBeTruthy()
    const removeBtn = screen.getByTitle("Remove file")
    fireEvent.click(removeBtn)
    expect(onClear).toHaveBeenCalledTimes(1)
  })
})
