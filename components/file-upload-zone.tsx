"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  acceptedFormats?: string[]
  maxSize?: number
  disabled?: boolean
}

export default function FileUploadZone({
  onFileSelect,
  acceptedFormats,
  maxSize = 500 * 1024 * 1024,
  disabled = false,
}: FileUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setError(null)

    // Validate file size
    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(0)}MB`)
      return
    }

    // Validate format if specified
    if (acceptedFormats) {
      const extension = file.name.split(".").pop()?.toLowerCase()
      if (!extension || !acceptedFormats.includes(extension)) {
        setError(`Invalid format. Accepted formats: ${acceptedFormats.join(", ")}`)
        return
      }
    }

    setSelectedFile(file)
    onFileSelect(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragActive(e.type === "dragenter" || e.type === "dragover")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  return (
    <div className="w-full">
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
          accept={acceptedFormats?.map((f) => `.${f}`).join(",")}
        />

        {selectedFile ? (
          <div className="space-y-4">
            <div className="inline-block p-3 bg-primary/10 rounded-lg">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)}MB</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedFile(null)
                if (inputRef.current) inputRef.current.value = ""
              }}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Choose Different File
            </Button>
          </div>
        ) : (
          <div onClick={() => !disabled && inputRef.current?.click()} className="space-y-4">
            <div className="inline-block p-3 bg-primary/10 rounded-lg">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Drag and drop your file here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse from your device</p>
            </div>
            {acceptedFormats && (
              <p className="text-xs text-muted-foreground">
                Supported formats: {acceptedFormats.join(", ").toUpperCase()}
              </p>
            )}
            <p className="text-xs text-muted-foreground">Maximum file size: {(maxSize / 1024 / 1024).toFixed(0)}MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  )
}
