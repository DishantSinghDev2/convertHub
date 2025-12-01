"use client"

import { useState } from "react"
import Link from "next/link"
import { getMediaMetadata } from "@/lib/media-converter"
import { shouldUseClientSideProcessing, downloadFile, SUPPORTED_FORMATS } from "@/lib/file-converter"
import ConverterLayout from "@/components/converter-layout"
import FileUploadZone from "@/components/file-upload-zone"
import FormatSelector from "@/components/format-selector"
import ConversionProgress from "@/components/conversion-progress"
import MediaSettings, { type MediaSettings as MediaSettingsType } from "@/components/media-settings"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock } from "lucide-react"

const VIDEO_FORMATS = ["mp4", "webm", "mov", "avi"].map((format) => SUPPORTED_FORMATS[format]!)

export default function VideoConverterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<string>("mp4")
  const [mediaSettings, setMediaSettings] = useState<MediaSettingsType>({})
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "converting" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<{ duration: number; width?: number; height?: number } | null>(null)

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setStatus("idle")
    setError(null)

    try {
      const meta = await getMediaMetadata(file)
      setMetadata(meta)
    } catch (error) {
      console.error("Failed to get metadata:", error)
    }
  }

  const handleConvert = async () => {
    if (!selectedFile || !selectedFormat) {
      setError("Please select a file and output format")
      return
    }

    setIsConverting(true)
    setProgress(0)
    setStatus("converting")
    setMessage("Preparing conversion...")

    try {
      // For large files, use server-side conversion
      if (!shouldUseClientSideProcessing(selectedFile)) {
        setMessage("Uploading to server...")
        setProgress(30)

        // Simulate upload and server processing
        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("targetFormat", selectedFormat)
        formData.append("settings", JSON.stringify(mediaSettings))

        // Call API endpoint
        const response = await fetch("/api/convert/video", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Conversion failed: ${response.statusText}`)
        }

        const blob = await response.blob()
        setProgress(100)
        setStatus("success")
        setMessage("✓ Conversion complete!")

        const filename = `video_converted.${selectedFormat}`
        ;(window as any).__convertedBlob = { blob, filename }
      } else {
        // Client-side processing for small files
        setMessage("This would process locally with ffmpeg.wasm")
        setProgress(50)

        throw new Error(
          "Client-side video conversion requires FFmpeg.wasm integration. Files will be processed server-side.",
        )
      }
    } catch (error) {
      setStatus("error")
      setMessage("Conversion failed")
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
    setSelectedFile(null)
    setStatus("idle")
    setProgress(0)
    setError(null)
    setMetadata(null)
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <ConverterLayout
      title="Video Converter"
      description="Convert videos between MP4, WebM, MOV, and AVI formats. Optimize for web, mobile, or archival."
      backHref="/"
    >
      <div className="space-y-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">1. Select Your Video</h2>
          <FileUploadZone
            onFileSelect={handleFileSelect}
            acceptedFormats={["mp4", "webm", "mov", "avi", "mkv", "flv"]}
            maxSize={500 * 1024 * 1024}
            disabled={isConverting}
          />
          <p className="text-sm text-muted-foreground">
            Videos over 50MB are processed on our secure servers. Smaller videos can be processed in your browser with
            the appropriate tools.
          </p>
        </div>

        {selectedFile && (
          <>
            {/* Video Metadata */}
            {metadata && (
              <div className="p-4 rounded-lg border border-border bg-muted/30 flex items-start gap-4">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Video Duration: {formatDuration(metadata.duration)}</p>
                  {metadata.width && metadata.height && (
                    <p className="text-sm text-muted-foreground">
                      Resolution: {metadata.width}×{metadata.height}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Format Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">2. Choose Output Format</h2>
              <FormatSelector
                formats={VIDEO_FORMATS}
                selectedFormat={selectedFormat}
                onFormatSelect={setSelectedFormat}
                disabled={isConverting}
              />
            </div>

            {/* Media Settings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">3. Conversion Settings</h2>
              <MediaSettings isVideo={true} onSettingsChange={setMediaSettings} disabled={isConverting} />
            </div>

            {/* Conversion Progress */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">4. Convert</h2>
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
              <Button onClick={handleConvert} size="lg" disabled={!selectedFormat || isConverting} className="w-full">
                Convert Video
              </Button>
            )}
          </>
        )}

        <div className="space-y-8 border-t border-border pt-8">
          {/* Comprehensive Guide */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Complete Video Format & Codec Guide</h2>
            <p className="text-muted-foreground">
              Understand video formats, codecs, and optimization for different platforms.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h3 className="font-semibold mb-3">Container Formats (Wrappers)</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>
                    <span className="font-medium">MP4</span> - Universal standard, all devices, best compatibility
                  </li>
                  <li>
                    <span className="font-medium">WebM</span> - Open source, optimized for web, smaller files
                  </li>
                  <li>
                    <span className="font-medium">MOV</span> - Apple QuickTime, Mac/iOS native, large files
                  </li>
                  <li>
                    <span className="font-medium">AVI</span> - Older Windows format, legacy support, larger files
                  </li>
                  <li>
                    <span className="font-medium">MKV</span> - Advanced container, multiple tracks, flexible
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h3 className="font-semibold mb-3">Video Codecs (Compression)</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>
                    <span className="font-medium">H.264</span> - Industry standard, compatibility, good compression
                  </li>
                  <li>
                    <span className="font-medium">H.265 (HEVC)</span> - Modern, 40% better compression, slower encoding
                  </li>
                  <li>
                    <span className="font-medium">VP8/VP9</span> - Open source, web optimized, royalty-free
                  </li>
                  <li>
                    <span className="font-medium">AV1</span> - Next generation, best compression, limited support
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Optimization Guide */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Video Optimization for Different Platforms</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-3">YouTube Optimization</h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Format: MP4 (H.264)</li>
                  <li>Resolution: 1920x1080 (1080p) recommended</li>
                  <li>Frame rate: 24, 25, 30, or 60 fps</li>
                  <li>Bitrate: 2.5-10 Mbps (1080p)</li>
                  <li>Audio: 192 kbps AAC</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-3">Web Streaming Optimization</h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Format: MP4 with H.264 or WebM</li>
                  <li>Resolution: Multiple (720p, 1080p)</li>
                  <li>Bitrate: Adaptive (1-5 Mbps range)</li>
                  <li>Frame rate: 24 or 30 fps</li>
                  <li>Audio: 128-192 kbps</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-3">Social Media (TikTok, Instagram)</h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Format: MP4 (H.264)</li>
                  <li>Resolution: 1080x1920 (vertical)</li>
                  <li>Frame rate: 30 fps</li>
                  <li>Max duration: 15-60 seconds</li>
                  <li>Audio: 128 kbps AAC</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-3">Mobile Devices</h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Format: MP4 (H.264)</li>
                  <li>Resolution: 1280x720 or lower</li>
                  <li>Bitrate: 2-4 Mbps (for 720p)</li>
                  <li>Frame rate: 24-30 fps</li>
                  <li>Optimize for battery/data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Video Conversion FAQ</h3>
            <div className="space-y-3">
              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  What's the best video format for YouTube?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  YouTube prefers MP4 with H.264 codec. Use 1920x1080 resolution at 24-60 fps. Bitrate should be 2.5-10
                  Mbps for 1080p. AAC audio at 192 kbps is recommended. YouTube will re-encode anyway, so standard specs
                  are fine.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  How do I convert MP4 to WebM for web use?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  Upload your MP4 file, select WebM as output format, choose your desired quality/bitrate settings. WebM
                  offers 25-30% better compression than MP4. Perfect for website video players. Use alongside MP4 with
                  fallbacks for older browsers.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  Can I extract audio from video (MP4 to MP3)?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  Yes! Use our audio converter to extract MP3 from MP4 files. Select your video file, choose MP3 as
                  output, adjust bitrate (128-320 kbps recommended), and convert. Perfect for podcasts and music.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  How much can I compress a video?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  Compression depends on source quality and target use. For web, 2-5 Mbps achieves good quality. For
                  archival, use higher bitrate. H.265 achieves 40% better compression than H.264. Balance file size with
                  quality for your use case.
                </p>
              </details>
            </div>
          </div>

          {/* Keywords */}
          <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
            <h4 className="font-semibold">Related Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "online video converter",
                "MP4 converter",
                "convert video to MP4",
                "free video converter",
                "video format converter",
                "WebM converter",
                "MOV to MP4",
                "video compression",
                "convert video for web",
                "batch video converter",
                "MP4 to WebM",
                "video optimization",
              ].map((keyword) => (
                <span key={keyword} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 border-t border-border pt-8">
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              Video Format Guide
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">MP4</span> - Most compatible, industry standard
              </li>
              <li>
                <span className="font-medium text-foreground">WebM</span> - Open-source, optimized for web
              </li>
              <li>
                <span className="font-medium text-foreground">MOV</span> - QuickTime format, Apple compatible
              </li>
              <li>
                <span className="font-medium text-foreground">AVI</span> - Older format, universal support
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Use Cases</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Convert for different playback devices</li>
              <li>Optimize videos for web and social media</li>
              <li>Reduce file size for storage</li>
              <li>Change codec for compatibility</li>
              <li>Extract audio tracks</li>
              <li>
                <Link href="/blog" className="text-primary hover:underline">
                  Learn more
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ConverterLayout>
  )
}
