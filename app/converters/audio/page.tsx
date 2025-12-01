"use client"

import { useState } from "react"
import { getMediaMetadata } from "@/lib/media-converter"
import { downloadFile, SUPPORTED_FORMATS } from "@/lib/file-converter"
import ConverterLayout from "@/components/converter-layout"
import FileUploadZone from "@/components/file-upload-zone"
import FormatSelector from "@/components/format-selector"
import ConversionProgress from "@/components/conversion-progress"
import MediaSettings, { type MediaSettings as MediaSettingsType } from "@/components/media-settings"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

const AUDIO_FORMATS = ["mp3", "wav", "webma", "flac"].map((format) => SUPPORTED_FORMATS[format]!)

export default function AudioConverterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<string>("mp3")
  const [mediaSettings, setMediaSettings] = useState<MediaSettingsType>({})
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "converting" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<{ duration: number } | null>(null)

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
    setMessage("Preparing audio conversion...")

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("targetFormat", selectedFormat)
      formData.append("settings", JSON.stringify(mediaSettings))

      setProgress(30)
      setMessage("Converting audio...")

      const response = await fetch("/api/convert/audio", {
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

      const filename = `audio_converted.${selectedFormat}`
      ;(window as any).__convertedBlob = { blob, filename }
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
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <ConverterLayout
      title="Audio Converter"
      description="Convert audio files between MP3, WAV, FLAC, and WebA formats. Adjust bitrate and quality."
      backHref="/"
    >
      <div className="space-y-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">1. Select Your Audio File</h2>
          <FileUploadZone
            onFileSelect={handleFileSelect}
            acceptedFormats={["mp3", "wav", "flac", "aac", "m4a", "ogg"]}
            maxSize={200 * 1024 * 1024}
            disabled={isConverting}
          />
          <p className="text-sm text-muted-foreground">
            All audio conversions are processed securely. Your files are never stored permanently.
          </p>
        </div>

        {selectedFile && (
          <>
            {/* Audio Metadata */}
            {metadata && (
              <div className="p-4 rounded-lg border border-border bg-muted/30 flex items-start gap-4">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Duration: {formatDuration(metadata.duration)}</p>
                  <p className="text-sm text-muted-foreground">
                    File size: {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
                  </p>
                </div>
              </div>
            )}

            {/* Format Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">2. Choose Output Format</h2>
              <FormatSelector
                formats={AUDIO_FORMATS}
                selectedFormat={selectedFormat}
                onFormatSelect={setSelectedFormat}
                disabled={isConverting}
              />
            </div>

            {/* Media Settings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">3. Conversion Settings</h2>
              <MediaSettings isVideo={false} onSettingsChange={setMediaSettings} disabled={isConverting} />
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
                Convert Audio
              </Button>
            )}
          </>
        )}

        <div className="space-y-8 border-t border-border pt-8">
          {/* Comprehensive Guide */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Complete Audio Format & Codec Guide</h2>
            <p className="text-muted-foreground">Understand audio formats, bitrates, and quality for every use case.</p>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h3 className="font-semibold mb-3">Lossy Compression (Smaller Files)</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>
                    <span className="font-medium">MP3</span> - Most universal, 128-320 kbps, phone & web standard
                  </li>
                  <li>
                    <span className="font-medium">AAC</span> - Better quality than MP3, Spotify & YouTube standard
                  </li>
                  <li>
                    <span className="font-medium">OGG Vorbis</span> - Open source, 128-256 kbps, excellent quality
                  </li>
                  <li>
                    <span className="font-medium">WebA</span> - Web optimized, Chrome/Firefox native support
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h3 className="font-semibold mb-3">Lossless Compression (Full Quality)</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>
                    <span className="font-medium">WAV</span> - Uncompressed, maximum quality, large files (CD quality)
                  </li>
                  <li>
                    <span className="font-medium">FLAC</span> - Lossless compression, 50% smaller than WAV
                  </li>
                  <li>
                    <span className="font-medium">ALAC</span> - Apple lossless, iTunes standard, hi-fi quality
                  </li>
                  <li>
                    <span className="font-medium">APE</span> - Monkey's Audio, extreme compression, rare
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bitrate Guide */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Bitrate & Quality Guide for MP3</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Bitrate</th>
                    <th className="text-left py-3 px-4 font-semibold">Quality</th>
                    <th className="text-left py-3 px-4 font-semibold">File Size</th>
                    <th className="text-left py-3 px-4 font-semibold">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="py-3 px-4">128 kbps</td>
                    <td className="py-3 px-4">Low quality</td>
                    <td className="py-3 px-4">~1MB/min</td>
                    <td className="py-3 px-4">Voice, podcasts, streaming</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="py-3 px-4">192 kbps</td>
                    <td className="py-3 px-4">Good quality</td>
                    <td className="py-3 px-4">~1.4MB/min</td>
                    <td className="py-3 px-4">Most music, portable devices</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="py-3 px-4">256 kbps</td>
                    <td className="py-3 px-4">Very good</td>
                    <td className="py-3 px-4">~1.9MB/min</td>
                    <td className="py-3 px-4">Music lovers, streaming services</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="py-3 px-4">320 kbps</td>
                    <td className="py-3 px-4">Excellent (near CD)</td>
                    <td className="py-3 px-4">~2.4MB/min</td>
                    <td className="py-3 px-4">Audiophiles, archival, editing</td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="py-3 px-4">FLAC (lossless)</td>
                    <td className="py-3 px-4">Perfect quality</td>
                    <td className="py-3 px-4">~3-5MB/min</td>
                    <td className="py-3 px-4">Professional audio, archival</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Audio Format Selection by Use Case</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-2">Podcasts & Audiobooks</h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Format: MP3 (compatibility)</li>
                  <li>Bitrate: 64-128 kbps (voice)</li>
                  <li>File size: Minimized for distribution</li>
                  <li>Supported everywhere</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-2">Streaming Services</h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Format: AAC or OGG (Spotify, Apple)</li>
                  <li>Bitrate: 128-256 kbps (adaptive)</li>
                  <li>Optimized for bandwidth</li>
                  <li>Good quality for listeners</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-2">Professional Audio</h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Format: WAV or FLAC (lossless)</li>
                  <li>Resolution: 16-24 bit, 44.1-96 kHz</li>
                  <li>No quality loss during editing</li>
                  <li>Used for mastering & archival</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-2">Mobile & Personal</h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Format: MP3 or AAC</li>
                  <li>Bitrate: 192-256 kbps (good balance)</li>
                  <li>Universal device support</li>
                  <li>Storage efficient</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Audio Conversion FAQ</h3>
            <div className="space-y-3">
              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  What bitrate should I use for MP3?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  For music: 192-256 kbps offers good quality/size balance. For audiophiles: 320 kbps or FLAC. For
                  podcasts: 64-128 kbps is sufficient. Test different bitrates to find your sweet spot.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  Can I extract audio from video (MP4 to MP3)?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  Yes! Upload your video file (MP4, MOV, WebM, etc.), select audio output format (MP3, WAV, etc.), set
                  bitrate, and convert. Perfect for extracting music from videos or creating podcast audio from
                  interviews.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  Should I use FLAC or MP3?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  FLAC for: Professional audio, archival, editing. MP3 for: Everyday listening, streaming, storage. FLAC
                  offers lossless quality but larger files. MP3 is universal with acceptable quality loss at 192+kbps.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  How do I convert WAV to MP3?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  Upload your WAV file, select MP3 as output format. Choose bitrate (we recommend 192-256 kbps for
                  music). Convert and download. WAV to MP3 reduces file size by 80-90% while maintaining good quality.
                </p>
              </details>
            </div>
          </div>

          {/* Keywords */}
          <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
            <h4 className="font-semibold">Related Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "online audio converter",
                "MP3 converter",
                "WAV to MP3 converter",
                "free audio converter",
                "audio format converter",
                "FLAC converter",
                "AAC to MP3",
                "convert video to MP3",
                "extract audio from video",
                "batch audio converter",
                "audio quality comparison",
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
