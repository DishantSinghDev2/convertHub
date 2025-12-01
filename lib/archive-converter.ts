/**
 * Archive creation and extraction utilities
 * Uses JSZip for ZIP creation, with server-side fallback for TAR/GZIP
 */

export interface ArchiveEntry {
  name: string
  size: number
  compressed?: boolean
}

export interface ArchiveConversionOptions {
  compressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  includeMetadata?: boolean
}

export async function createZipArchive(files: File[], options: ArchiveConversionOptions = {}): Promise<Blob> {
  try {
    // Try to use JSZip if available
    if (typeof window !== "undefined" && (window as any).JSZip) {
      const JSZip = (window as any).JSZip
      const zip = new JSZip()

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        zip.file(file.name, arrayBuffer)
      }

      return await zip.generateAsync({ type: "blob", compression: "DEFLATE" })
    }

    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })
    formData.append("format", "zip")
    formData.append("compression", (options.compressionLevel ?? 6).toString())

    const response = await fetch("/api/convert/archive", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Server archive creation failed")
    }

    return await response.blob()
  } catch (error) {
    throw new Error(`Archive creation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function createTarArchive(
  files: File[],
  format: "tar" | "gz" = "tar",
  options: ArchiveConversionOptions = {},
): Promise<Blob> {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append("files", file)
  })
  formData.append("format", format)
  formData.append("compression", (options.compressionLevel ?? 6).toString())

  const response = await fetch("/api/convert/archive", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`${format.toUpperCase()} archive creation failed: ${response.statusText}`)
  }

  return await response.blob()
}

// Extract archive metadata
export async function getArchiveInfo(file: File): Promise<ArchiveEntry[]> {
  if (typeof window !== "undefined" && (window as any).JSZip && file.name.endsWith(".zip")) {
    const JSZip = (window as any).JSZip
    const zip = new JSZip()
    const loaded = await zip.loadAsync(file)

    return Object.values(loaded.files).map((entry: any) => ({
      name: entry.name,
      size: entry._data?.uncompressedSize || 0,
      compressed: true,
    }))
  }

  return []
}

// Archive format detection
export function detectArchiveFormat(filename: string): string | null {
  const ext = filename.split(".").pop()?.toLowerCase()
  if (["zip", "rar", "tar", "gz", "gzip", "7z", "bz2"].includes(ext || "")) {
    return ext
  }
  return null
}

// Archive statistics
export async function getArchiveStats(file: File): Promise<{ totalSize: number; fileCount: number }> {
  try {
    if (file.name.endsWith(".zip") && typeof window !== "undefined" && (window as any).JSZip) {
      const JSZip = (window as any).JSZip
      const zip = new JSZip()
      const loaded = await zip.loadAsync(file)
      const entries = Object.values(loaded.files).filter((e: any) => !e.dir)

      return {
        totalSize: entries.reduce((sum: number, e: any) => sum + (e._data?.uncompressedSize || 0), 0),
        fileCount: entries.length,
      }
    }
  } catch (error) {
    console.error("[v0] Failed to get archive stats:", error)
  }

  return {
    totalSize: file.size,
    fileCount: 0,
  }
}
