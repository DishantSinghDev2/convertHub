"use client"

import type React from "react"
import { useState } from "react"
import { FileUp, Trash2, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { performBulkConversion } from "@/lib/bulk-converter"
import { downloadFile, SUPPORTED_FORMATS } from "@/lib/file-converter"

interface BulkFile {
  id: string
  file: File
  targetFormat: string
  status: "pending" | "converting" | "success" | "error"
  error?: string
  result?: { blob: Blob; filename: string }
}

interface BulkConverterProps {
  category?: "image" | "document" | "video" | "audio" | "archive"
  onFilesAdd?: (files: BulkFile[]) => void
  disabled?: boolean
}

export default function BulkConverter({ category = "image" }: BulkConverterProps) {
  const [bulkFiles, setBulkFiles] = useState<BulkFile[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)

  const availableFormats = Object.entries(SUPPORTED_FORMATS)
    .filter(([, format]) => format.category === category)
    .map(([key, format]) => ({
      key,
      ...format,
    }))

  const defaultFormat = availableFormats[0]?.key || "png"

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || [])
    const newFiles: BulkFile[] = files.map((file) => ({
      id: Math.random().toString(),
      file,
      targetFormat: defaultFormat,
      status: "pending",
    }))
    setBulkFiles([...bulkFiles, ...newFiles])
  }

  const handleRemove = (id: string) => {
    setBulkFiles(bulkFiles.filter((f) => f.id !== id))
  }

  const handleFormatChange = (id: string, format: string) => {
    setBulkFiles(bulkFiles.map((f) => (f.id === id ? { ...f, targetFormat: format } : f)))
  }

  const handleConvertAll = async () => {
    setIsConverting(true)
    setOverallProgress(0)

    const tasks = bulkFiles.map((f) => ({
      file: f.file,
      sourceFormat: f.file.name.split(".").pop()?.toLowerCase() || "unknown",
      targetFormat: f.targetFormat,
      options: { quality: 0.85 },
    }))

    try {
      const results = await performBulkConversion(tasks, (progress) => {
        console.log("[v0] Bulk conversion progress:", progress.completed, "of", progress.total)
        setOverallProgress(Math.round((progress.completed / progress.total) * 100))
      })

      setBulkFiles(
        bulkFiles.map((f, idx) => {
          const result = results[idx]
          return {
            ...f,
            status: result.success ? "success" : "error",
            error: result.error,
            result: result.success ? { blob: result.blob!, filename: result.filename } : undefined,
          }
        }),
      )
    } catch (error) {
      console.error("[v0] Bulk conversion error:", error)
      setBulkFiles(
        bulkFiles.map((f) => ({
          ...f,
          status: "error",
          error: "Conversion failed. Please try again.",
        })),
      )
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownloadAll = () => {
    bulkFiles.forEach((f) => {
      if (f.result) {
        downloadFile(f.result.blob, f.result.filename)
      }
    })
  }

  return (
    <div className="space-y-4 p-6 rounded-lg border border-border bg-muted/30">
      <h3 className="font-semibold text-lg">Bulk Conversion</h3>

      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
        <input
          type="file"
          id="bulk-files"
          multiple
          onChange={handleAddFiles}
          disabled={isConverting}
          className="hidden"
          accept={availableFormats.flatMap((f) => f.mimeTypes).join(",")}
        />
        <label htmlFor="bulk-files" className="cursor-pointer block">
          <div className="inline-block p-2 bg-primary/10 rounded-lg mb-2">
            <FileUp className="w-6 h-6 text-primary" />
          </div>
          <p className="font-medium">Click to add multiple files</p>
          <p className="text-sm text-muted-foreground">Drag and drop or select files</p>
        </label>
      </div>

      {bulkFiles.length > 0 && (
        <>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {bulkFiles.map((bf) => (
              <div
                key={bf.id}
                className={`flex items-center justify-between gap-3 p-3 bg-background rounded-lg border transition-colors ${
                  bf.status === "error" ? "border-destructive/50 bg-destructive/5" : "border-border"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{bf.file.name}</p>
                  <p className="text-xs text-muted-foreground">{(bf.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  {bf.error && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {bf.error}
                    </p>
                  )}
                </div>

                <select
                  value={bf.targetFormat}
                  onChange={(e) => handleFormatChange(bf.id, e.target.value)}
                  disabled={isConverting || bf.status !== "pending"}
                  className="px-3 py-2 rounded border border-input bg-background text-sm font-medium hover:border-primary transition-colors cursor-pointer"
                >
                  {availableFormats.map((fmt) => (
                    <option key={fmt.key} value={fmt.key}>
                      {fmt.extensions[0].toUpperCase()}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleRemove(bf.id)}
                  disabled={isConverting}
                  className="p-2 hover:bg-destructive/10 rounded transition-colors disabled:opacity-50"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>

          {isConverting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Converting...</span>
                <span className="font-semibold">{overallProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleConvertAll}
              disabled={isConverting || bulkFiles.every((f) => f.status !== "pending")}
              className="flex-1 min-w-[150px]"
            >
              {isConverting ? "Converting..." : "Convert All"}
            </Button>

            {bulkFiles.some((f) => f.status === "success") && (
              <Button onClick={handleDownloadAll} variant="outline" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Download All
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
