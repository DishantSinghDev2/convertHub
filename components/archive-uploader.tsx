"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ArchiveUploaderProps {
  onFilesSelect: (files: File[]) => void
  maxSize?: number
  disabled?: boolean
}

export default function ArchiveUploader({
  onFilesSelect,
  maxSize = 500 * 1024 * 1024,
  disabled = false,
}: ArchiveUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragActive, setIsDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (newFiles: File[]) => {
    let totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0)
    const toAdd = []

    for (const file of newFiles) {
      if (totalSize + file.size > maxSize) {
        console.warn("File too large or exceeds max archive size")
        continue
      }
      toAdd.push(file)
      totalSize += file.size
    }

    const updated = [...selectedFiles, ...toAdd]
    setSelectedFiles(updated)
    onFilesSelect(updated)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    handleFileSelect(files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files) {
      handleFileSelect(Array.from(files))
    }
  }

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updated)
    onFilesSelect(updated)
  }

  const totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0)

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all p-8 text-center cursor-pointer ${
          isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:border-primary/50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
          multiple
        />

        <div onClick={() => !disabled && inputRef.current?.click()} className="space-y-4">
          <div className="inline-block p-3 bg-primary/10 rounded-lg">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Add files to create archive</p>
            <p className="text-sm text-muted-foreground mt-1">Drag and drop multiple files or click to browse</p>
          </div>
          <p className="text-xs text-muted-foreground">Maximum total size: {(maxSize / 1024 / 1024).toFixed(0)}MB</p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="font-medium">{selectedFiles.length} file(s) selected</p>
            <p className="text-sm text-muted-foreground">{(totalSize / 1024 / 1024).toFixed(2)}MB total</p>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)}KB</p>
                </div>
                <button onClick={() => removeFile(index)} className="ml-2 p-1 hover:bg-muted rounded transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedFiles([])
              onFilesSelect([])
            }}
            className="w-full"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
