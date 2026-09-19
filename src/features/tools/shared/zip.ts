import { zipArchive } from "./pdf/zip"

export interface ZipBlobEntry {
  name: string
  blob: Blob
}

/** Package browser-generated files into a downloadable ZIP archive. */
export async function zipBlobs(entries: ZipBlobEntry[]): Promise<Blob> {
  const rawEntries = await Promise.all(
    entries.map(async ({ name, blob }) => ({
      name,
      data: new Uint8Array(await blob.arrayBuffer()),
    })),
  )

  return new Blob([zipArchive(rawEntries) as BlobPart], { type: "application/zip" })
}
