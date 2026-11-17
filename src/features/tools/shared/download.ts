export interface DownloadEntry {
  name: string
  blob: Blob
}

/** Save a browser-generated file. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.rel = "noopener"
  a.style.display = "none"
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Revoking immediately can cancel the save in Safari and Firefox, so give the browser time to read the blob.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

/**
 * Save several files one after another (no ZIP). A short gap between saves keeps
 * browsers from dropping them; Chrome asks once to allow multiple downloads.
 */
export async function downloadBlobsSequentially(
  entries: DownloadEntry[],
  onProgress: (saved: number, total: number) => void = () => {},
  gapMs = 400,
): Promise<void> {
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index]
    if (!entry) continue
    if (index > 0) await wait(gapMs)
    downloadBlob(entry.blob, entry.name)
    onProgress(index + 1, entries.length)
  }
}
