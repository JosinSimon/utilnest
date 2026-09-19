export interface BatchItem<T> {
  input: File
  data?: T
  error?: string
}

/** Process files one at a time so browser memory stays bounded. */
export async function processFilesSequentially<T>(
  files: File[],
  process: (file: File, onProgress: (progress: number) => void) => Promise<T>,
  onProgress: (progress: number) => void = () => {},
): Promise<BatchItem<T>[]> {
  const results: BatchItem<T>[] = []

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index]
    if (!file) continue

    try {
      const data = await process(file, (fileProgress) => {
        const normalized = Math.max(0, Math.min(1, fileProgress))
        onProgress((index + normalized) / files.length)
      })
      results.push({ input: file, data })
    } catch (error) {
      results.push({
        input: file,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  onProgress(files.length > 0 ? 1 : 0)
  return results
}

/** Make output names unique before putting them into a ZIP archive. */
export function uniqueFileName(name: string, usedNames: Set<string>): string {
  if (!usedNames.has(name)) {
    usedNames.add(name)
    return name
  }

  const dot = name.lastIndexOf(".")
  const base = dot > 0 ? name.slice(0, dot) : name
  const extension = dot > 0 ? name.slice(dot) : ""
  let suffix = 2
  let candidate = `${base} (${suffix})${extension}`

  while (usedNames.has(candidate)) {
    suffix += 1
    candidate = `${base} (${suffix})${extension}`
  }

  usedNames.add(candidate)
  return candidate
}
