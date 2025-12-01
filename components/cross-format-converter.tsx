"use client"

import type React from "react"

import { useState } from "react"
import { FileUp, Download, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { downloadFile } from "@/lib/file-converter"
import { extractAudioFromVideo, getVideoMetadata } from "@/lib/format-converter"
import BulkConverter from "./bulk-converter"

interface ConversionState {
  file: File | null
  targetFormat: string
  isConverting: boolean
  progress: number
  result: { blob: Blob; filename: string } | null
  error: string | null
  metadata: { duration: number; width?: number; height?: number } | null
}

const VIDEO_TO_AUDIO_CONVERSIONS = [
  { source: "mp4", targets: ["mp3", "wav", "flac", "aac", "ogg", "opus"] },
  { source: "mov", targets: ["mp3", "wav", "flac", "aac", "ogg"] },
  { source: "avi", targets: ["mp3", "wav", "flac", "aac", "ogg"] },
  { source: "webm", targets: ["mp3", "wav", "flac", "ogg", "opus"] },
  { source: "mkv", targets: ["mp3", "wav", "flac", "aac", "ogg"] },
  { source: "flv", targets: ["mp3", "wav", "aac", "ogg"] },
  { source: "wmv", targets: ["mp3", "wav", "aac", "ogg"] },
  { source: "m4v", targets: ["mp3", "wav", "aac", "ogg"] },
  { source: "mpg", targets: ["mp3", "wav", "aac", "ogg"] },
]

export default function CrossFormatConverter() {
  const [state, setState] = useState<ConversionState>({
    file: null,
    targetFormat: "mp3",
    isConverting: false,
    progress: 0,
    result: null,
    error: null,
    metadata: null,
  })

  const [useBulk, setUseBulk] = useState(false)

  const sourceExt = state.file?.name.split(".").pop()?.toLowerCase()
  const supportedTargets = VIDEO_TO_AUDIO_CONVERSIONS.find((c) => c.source === sourceExt)?.targets || []

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return

    setState({
      ...state,
      file,
      error: null,
      result: null,
      metadata: null,
      targetFormat: supportedTargets[0] || "mp3",
    })

    try {
      const metadata = await getVideoMetadata(file)
      setState((prev) => ({ ...prev, metadata }))
    } catch (err) {
      console.log("[v0] Could not extract metadata")
    }
  }

  const handleConvert = async () => {
    if (!state.file) return

    setState((prev) => ({ ...prev, isConverting: true, error: null, progress: 0 }))

    try {
      const startTime = Date.now()

      const blob = await extractAudioFromVideo(state.file, state.targetFormat)

      const filename = `${state.file.name.split(".")[0]}_converted.${state.targetFormat}`

      setState((prev) => ({
        ...prev,
        result: { blob, filename },
        isConverting: false,
        progress: 100,
      }))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Conversion failed"
      setState((prev) => ({
        ...prev,
        isConverting: false,
        error: errorMsg,
      }))
    }
  }

  const handleDownload = () => {
    if (state.result) {
      downloadFile(state.result.blob, state.result.filename)
    }
  }

  const handleReset = () => {
    setState({
      file: null,
      targetFormat: "mp3",
      isConverting: false,
      progress: 0,
      result: null,
      error: null,
      metadata: null,
    })
    setUseBulk(false)
  }

  if (useBulk) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Bulk Cross-Format Conversion</h2>
          <Button variant="outline" onClick={() => setUseBulk(false)}>
            Single File Mode
          </Button>
        </div>
        <BulkConverter category="video" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button variant={!useBulk ? "default" : "outline"} onClick={() => setUseBulk(false)} className="flex-1">
          Single File
        </Button>
        <Button variant={useBulk ? "default" : "outline"} onClick={() => setUseBulk(true)} className="flex-1">
          Bulk Convert
        </Button>
      </div>

      {/* File Upload */}
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
        <input
          type="file"
          id="cross-file"
          onChange={handleFileSelect}
          disabled={state.isConverting}
          className="hidden"
          accept="video/*"
        />
        <label htmlFor="cross-file" className="cursor-pointer block">
          <div className="inline-block p-3 bg-primary/10 rounded-lg mb-3">
            <FileUp className="w-8 h-8 text-primary" />
          </div>
          <p className="font-semibold text-lg">{state.file ? state.file.name : "Click to select a video file"}</p>
          <p className="text-sm text-muted-foreground mt-1">Drag and drop your video, or click to browse</p>
          {state.file && (
            <p className="text-sm text-primary mt-2">
              {(state.file.size / 1024 / 1024).toFixed(2)} MB
              {state.metadata && ` • Duration: ${Math.round(state.metadata.duration)}s`}
            </p>
          )}
        </label>
      </div>

      {/* Format Selection */}
      {state.file && supportedTargets.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold">Convert to:</label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {supportedTargets.map((format) => (
              <button
                key={format}
                onClick={() => setState((prev) => ({ ...prev, targetFormat: format }))}
                disabled={state.isConverting}
                className={`p-3 rounded-lg border-2 font-medium transition-all ${
                  state.targetFormat === format
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary text-muted-foreground hover:text-foreground"
                } disabled:opacity-50`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {state.error && (
        <div className="flex gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/50">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-destructive">Conversion Error</p>
            <p className="text-sm text-destructive/80">{state.error}</p>
          </div>
        </div>
      )}

      {/* Progress */}
      {state.isConverting && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Converting...</span>
            <span className="font-semibold">{state.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Result */}
      {state.result && (
        <div className="flex gap-3 p-4 rounded-lg bg-primary/10 border border-primary/50">
          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-primary">Conversion Successful</p>
            <p className="text-sm text-muted-foreground">{state.result.filename}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {state.file && (
        <div className="flex gap-3">
          {state.result && (
            <Button onClick={handleDownload} className="gap-2 flex-1">
              <Download className="w-4 h-4" />
              Download
            </Button>
          )}
          {!state.isConverting && (
            <Button
              onClick={handleConvert}
              disabled={!supportedTargets.includes(state.targetFormat)}
              className="gap-2"
              variant={state.result ? "outline" : "default"}
            >
              {state.isConverting && <Loader2 className="w-4 h-4 animate-spin" />}
              {state.result ? "Convert Again" : "Convert"}
            </Button>
          )}
          <Button onClick={handleReset} variant="ghost">
            Reset
          </Button>
        </div>
      )}
    </div>
  )
}
