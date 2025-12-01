"use client"

import { useState } from "react"
import { downloadFile, SUPPORTED_FORMATS } from "@/lib/file-converter"
import ConverterLayout from "@/components/converter-layout"
import FormatSelector from "@/components/format-selector"
import ConversionProgress from "@/components/conversion-progress"
import ArchiveUploader from "@/components/archive-uploader"
import { Button } from "@/components/ui/button"
import { HardDrive } from "lucide-react"

const ARCHIVE_FORMATS = ["zip", "tar", "gz"].map((format) => SUPPORTED_FORMATS[format]!)

export default function ArchiveConverterPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedFormat, setSelectedFormat] = useState<string>("zip")
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "converting" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [compressionLevel, setCompressionLevel] = useState(6)

  const handleCompress = async () => {
    if (selectedFiles.length === 0 || !selectedFormat) {
      setError("Please select files and output format")
      return
    }

    setIsConverting(true)
    setProgress(0)
    setStatus("converting")
    setMessage("Preparing archive...")

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 15, 85))
      }, 300)

      const formData = new FormData()
      selectedFiles.forEach((file) => {
        formData.append("files", file)
      })
      formData.append("format", selectedFormat)
      formData.append("compression", compressionLevel.toString())

      setProgress(40)
      setMessage("Creating archive...")

      const response = await fetch("/api/convert/archive", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Archive creation failed: ${response.statusText}`)
      }

      const blob = await response.blob()

      clearInterval(progressInterval)
      setProgress(100)
      setStatus("success")
      setMessage("✓ Archive created successfully!")

      const filename = `archive_${Date.now()}.${selectedFormat === "gz" ? "tar.gz" : selectedFormat}`
      ;(window as any).__convertedBlob = { blob, filename }
    } catch (error) {
      setStatus("error")
      setMessage("Archive creation failed")
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    const data = (window as any).__convertedBlob
    if (data) {
      downloadFile(data.blob, data.filename)
    }
  }

  const handleReset = () => {
    setSelectedFiles([])
    setStatus("idle")
    setProgress(0)
    setError(null)
  }

  const totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0)

  return (
    <ConverterLayout
      title="Archive Creator"
      description="Create and manage compressed archives. Support for ZIP, TAR, and GZIP formats."
      backHref="/"
    >
      <div className="space-y-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">1. Select Files</h2>
          <ArchiveUploader onFilesSelect={setSelectedFiles} disabled={isConverting} />
        </div>

        {selectedFiles.length > 0 && (
          <>
            {/* Statistics */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border bg-muted/30 flex items-start gap-3">
                <div className="inline-block p-2 bg-primary/10 rounded-lg">
                  <HardDrive className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Size</p>
                  <p className="font-semibold">{(totalSize / 1024 / 1024).toFixed(2)}MB</p>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-border bg-muted/30 flex items-start gap-3">
                <div className="inline-block p-2 bg-primary/10 rounded-lg">
                  <span className="text-primary font-bold">📁</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Files</p>
                  <p className="font-semibold">{selectedFiles.length}</p>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-border bg-muted/30 flex items-start gap-3">
                <div className="inline-block p-2 bg-primary/10 rounded-lg">
                  <span className="text-primary font-bold">⚙️</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Compression</p>
                  <p className="font-semibold">Level {compressionLevel}</p>
                </div>
              </div>
            </div>

            {/* Format Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">2. Choose Archive Format</h2>
              <FormatSelector
                formats={ARCHIVE_FORMATS}
                selectedFormat={selectedFormat}
                onFormatSelect={setSelectedFormat}
                disabled={isConverting}
              />
            </div>

            {/* Compression Settings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">3. Compression Settings</h2>
              <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Compression Level</label>
                    <span className="text-sm font-semibold text-primary">{compressionLevel}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="9"
                    value={compressionLevel}
                    onChange={(e) => setCompressionLevel(Number.parseInt(e.target.value))}
                    disabled={isConverting}
                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Faster (larger)</span>
                    <span>Better compression</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-primary/5 border border-primary/10">
                  <p className="text-sm text-muted-foreground">
                    Level {compressionLevel} means:
                    {compressionLevel === 0 && " No compression, fastest"}
                    {compressionLevel >= 1 && compressionLevel <= 3 && " Fast compression"}
                    {compressionLevel >= 4 && compressionLevel <= 6 && " Balanced"}
                    {compressionLevel >= 7 && compressionLevel <= 9 && " Maximum compression, slower"}
                  </p>
                </div>
              </div>
            </div>

            {/* Conversion Progress */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">4. Create Archive</h2>
              <ConversionProgress
                isConverting={isConverting}
                progress={progress}
                status={status}
                message={message}
                onDownload={handleDownload}
                onReset={handleReset}
                error={error || undefined}
              />
            </div>

            {status === "idle" && (
              <Button
                onClick={handleCompress}
                size="lg"
                disabled={!selectedFormat || isConverting || selectedFiles.length === 0}
                className="w-full"
              >
                Create Archive
              </Button>
            )}
          </>
        )}

        <div className="space-y-8 border-t border-border pt-8">
          {/* Comprehensive Guide */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Complete Archive & Compression Format Guide</h2>
            <p className="text-muted-foreground">
              Master file compression and archiving with ZIP, TAR, GZIP, and more.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h3 className="font-semibold mb-3">ZIP Archives</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>Universal format, all systems</li>
                  <li>Single file with built-in compression</li>
                  <li>Best for: File sharing, backup</li>
                  <li>Compatibility: Excellent (Windows, Mac, Linux)</li>
                  <li>Max file: 4GB (ZIP64: up to 16EB)</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h3 className="font-semibold mb-3">TAR Archives</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>Unix/Linux standard archiving tool</li>
                  <li>Preserves file permissions & links</li>
                  <li>Best for: Server backup, source code</li>
                  <li>Usually combined with GZIP or BZIP2</li>
                  <li>Format: tar, tar.gz, tar.bz2</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h3 className="font-semibold mb-3">GZIP Compression</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>Standard Unix compression</li>
                  <li>Often used with TAR (tar.gz)</li>
                  <li>Best for: Websites, Linux systems</li>
                  <li>Good compression ratio (20-30%)</li>
                  <li>Single file compression only</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Compression Scenarios */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">When to Use Each Format</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-2">ZIP - Email & File Sharing</h4>
                <p className="text-sm text-muted-foreground">
                  Perfect for sending files to anyone. No special software needed on Windows/Mac/Linux. Password
                  protected option available. Use Level 6-9 for best compression.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-2">TAR.GZ - Server Backups</h4>
                <p className="text-sm text-muted-foreground">
                  Industry standard for server backup and source code distribution. Preserves file permissions critical
                  for executable programs. 20-30% compression. Best for Unix/Linux systems.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-2">BZIP2 - Maximum Compression</h4>
                <p className="text-sm text-muted-foreground">
                  Better compression than GZIP (10-20% improvement) but slower. Used for large archives and long-term
                  storage. Common on software repositories.
                </p>
              </div>
            </div>
          </div>

          {/* Compression Level Explained */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Compression Level Explained</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-2">Level 0-3: Fast</h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Processing: Very fast</li>
                  <li>Compression: Low (10-20%)</li>
                  <li>Best for: Quick archiving</li>
                  <li>Use: Already compressed files</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-2">Level 4-6: Balanced</h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Processing: Medium speed</li>
                  <li>Compression: Good (30-40%)</li>
                  <li>Best for: Most situations</li>
                  <li>Default: Recommended for general use</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-2">Level 7-9: Maximum</h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Processing: Slower (can take minutes)</li>
                  <li>Compression: Best (40-50%+)</li>
                  <li>Best for: Long-term storage</li>
                  <li>Use: Large files, backup archives</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Archive & Compression FAQ</h3>
            <div className="space-y-3">
              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  What's the difference between ZIP and TAR.GZ?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  ZIP is universal (Windows/Mac/Linux), one step, includes compression. TAR.GZ is two steps (archive +
                  compress), preserves Unix permissions, best for Linux/servers. Use ZIP for general file sharing,
                  TAR.GZ for Linux systems.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  How much can I compress files?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  Compression ratio depends on file types: Text 70-90%, Images 20-30%, Videos 5-15% (already
                  compressed). Use Level 6-9 for maximum compression. Multiple files compress better than single files.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  Can I password protect ZIP files?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  Yes! ZIP supports password protection. When creating an archive, option to add password. Use strong
                  password for sensitive files. Share password separately from the file for security.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  How do I create a TAR.GZ file?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  Select files, choose TAR as format, optionally add GZIP compression. On Linux, use: tar -czf
                  archive.tar.gz files/. Perfect for backing up directories and source code while preserving
                  permissions.
                </p>
              </details>
            </div>
          </div>

          {/* Keywords */}
          <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
            <h4 className="font-semibold">Related Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "online ZIP creator",
                "archive creator",
                "file compression tool",
                "ZIP file creator",
                "TAR GZ converter",
                "free archiver",
                "bulk file archiver",
                "compress files online",
                "reduce file size",
                "split archive",
                "password protected ZIP",
              ].map((keyword) => (
                <span key={keyword} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ConverterLayout>
  )
}
