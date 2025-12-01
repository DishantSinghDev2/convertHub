"use client"

import { useState } from "react"
import Link from "next/link"
import { convertImageToFormat, getImageMetadata } from "@/lib/image-converter"
import { downloadFile, SUPPORTED_FORMATS } from "@/lib/file-converter"
import ConverterLayout from "@/components/converter-layout"
import FileUploadZone from "@/components/file-upload-zone"
import FormatSelector from "@/components/format-selector"
import ConversionProgress from "@/components/conversion-progress"
import ImageQualitySlider from "@/components/image-quality-slider"
import ImageResizeSettings, { type ResizeSettings } from "@/components/image-resize-settings"
import BulkConverter from "@/components/bulk-converter"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

const IMAGE_FORMATS = [
  "png",
  "jpg",
  "webp",
  "gif",
  "svg",
  "avif",
  "bmp",
  "tiff",
  "ico",
  "heic",
  "jfif",
  "apng",
  "jp2",
].map((format) => SUPPORTED_FORMATS[format]!)

export default function ImageConverterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<string>("webp")
  const [quality, setQuality] = useState(0.85)
  const [resizeSettings, setResizeSettings] = useState<ResizeSettings>({
    enabled: false,
    maintainAspectRatio: true,
  })
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "converting" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [imageMetadata, setImageMetadata] = useState<{ width: number; height: number } | null>(null)

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setStatus("idle")
    setError(null)

    try {
      const metadata = await getImageMetadata(file)
      setImageMetadata({ width: metadata.width, height: metadata.height })
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
    setMessage("Analyzing image...")

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 15, 85))
      }, 200)

      let blob: Blob

      try {
        if (selectedFormat === "svg") {
          setMessage("Converting to SVG...")
          const { convertToSvg } = await import("@/lib/image-converter")
          blob = await convertToSvg(selectedFile)
        } else {
          setMessage(`Converting to ${selectedFormat.toUpperCase()}...`)
          blob = await convertImageToFormat(selectedFile, selectedFormat, {
            quality,
            ...(resizeSettings.enabled && {
              width: resizeSettings.width,
              height: resizeSettings.height,
              maintainAspectRatio: resizeSettings.maintainAspectRatio,
            }),
          })
        }
      } catch (error) {
        clearInterval(progressInterval)
        throw error
      }

      clearInterval(progressInterval)
      setProgress(100)
      setStatus("success")
      setMessage("✓ Conversion complete!")

      const filename = `image_converted.${selectedFormat}`
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
    setImageMetadata(null)
  }

  return (
    <ConverterLayout
      title="Image Converter"
      description="Convert between 13+ image formats with quality control and resizing. All processing happens locally on your device."
      backHref="/"
    >
      <div className="space-y-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">1. Select Your Image</h2>
          <FileUploadZone
            onFileSelect={handleFileSelect}
            acceptedFormats={[
              "png",
              "jpg",
              "jpeg",
              "webp",
              "gif",
              "svg",
              "bmp",
              "tiff",
              "ico",
              "heic",
              "jfif",
              "apng",
              "jp2",
            ]}
            disabled={isConverting}
          />
        </div>

        {selectedFile && (
          <>
            {imageMetadata && (
              <div className="p-4 rounded-lg border border-border bg-primary/5">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Image size:</span> {imageMetadata.width}x
                  {imageMetadata.height}px
                </p>
              </div>
            )}

            {/* Format Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">2. Choose Output Format</h2>
              <FormatSelector
                formats={IMAGE_FORMATS}
                selectedFormat={selectedFormat}
                onFormatSelect={setSelectedFormat}
                disabled={isConverting}
              />
            </div>

            {/* Quality Settings */}
            {selectedFormat !== "svg" && selectedFormat !== "png" && selectedFormat !== "gif" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">3. Adjust Quality</h2>
                <div className="p-6 rounded-lg border border-border bg-muted/30">
                  <ImageQualitySlider value={quality} onChange={setQuality} disabled={isConverting} min={0} max={1} />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Higher quality produces larger files but with better image fidelity. For web use, 0.75-0.85 is
                    typically ideal.
                  </p>
                </div>
              </div>
            )}

            {/* Resize Settings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">4. Optional Resize</h2>
              <ImageResizeSettings
                onSettingsChange={setResizeSettings}
                originalWidth={imageMetadata?.width}
                originalHeight={imageMetadata?.height}
                disabled={isConverting}
              />
            </div>

            {/* Conversion Progress */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">5. Convert</h2>
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
                Convert Image
              </Button>
            )}
          </>
        )}

        {/* Bulk Converter */}
        <div className="border-t border-border pt-8">
          <h2 className="text-xl font-semibold mb-4">Bulk Image Conversion</h2>
          <BulkConverter category="image" />
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 border-t border-border pt-8">
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              Format Details
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">PNG</span> - Best for graphics and images requiring
                transparency
              </li>
              <li>
                <span className="font-medium text-foreground">JPG</span> - Ideal for photographs, smaller file sizes
              </li>
              <li>
                <span className="font-medium text-foreground">WebP</span> - Modern format, better compression than JPG
              </li>
              <li>
                <span className="font-medium text-foreground">AVIF</span> - Next-generation format with superior
                compression
              </li>
              <li>
                <span className="font-medium text-foreground">GIF</span> - Perfect for animations and simple graphics
              </li>
              <li>
                <span className="font-medium text-foreground">SVG</span> - Vector graphics, scalable without quality
                loss
              </li>
              <li>
                <span className="font-medium text-foreground">BMP</span> - Bitmap format, widely supported
              </li>
              <li>
                <span className="font-medium text-foreground">TIFF</span> - Tagged Image File Format, high quality
              </li>
              <li>
                <span className="font-medium text-foreground">ICO</span> - Icon format, commonly used for website icons
              </li>
              <li>
                <span className="font-medium text-foreground">HEIC</span> - High Efficiency Image Coding, modern format
              </li>
              <li>
                <span className="font-medium text-foreground">JPEG</span> - Joint Photographic Experts Group, widely
                used for photographs
              </li>
              <li>
                <span className="font-medium text-foreground">APNG</span> - Animated Portable Network Graphics
              </li>
              <li>
                <span className="font-medium text-foreground">JP2</span> - JPEG 2000, lossless compression
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Why Convert Images?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Reduce file size for faster web loading</li>
              <li>Ensure compatibility across different platforms</li>
              <li>Optimize for specific use cases (web, print, mobile)</li>
              <li>Remove unnecessary metadata for privacy</li>
              <li>Standardize formats across your project</li>
              <li>
                <Link href="/blog" className="text-primary hover:underline">
                  Learn more
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-8 border-t border-border pt-8">
          {/* Comprehensive Format Guide */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Complete Image Format Guide</h2>
            <p className="text-muted-foreground">
              Choose the right image format for your needs. Learn the differences between lossy and lossless
              compression.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h3 className="font-semibold mb-3 text-lg">Lossy Compression Formats</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <span className="font-medium">JPG/JPEG</span> - Most popular for photographs. Smaller files but some
                    quality loss. Use for web, social media, email.
                  </li>
                  <li>
                    <span className="font-medium">WebP</span> - Modern format by Google. 25-35% better compression than
                    JPG. Supported in all modern browsers.
                  </li>
                  <li>
                    <span className="font-medium">AVIF</span> - Next-gen codec. 50% better compression than JPG. Best
                    for future-proofing.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h3 className="font-semibold mb-3 text-lg">Lossless Compression Formats</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <span className="font-medium">PNG</span> - Best for graphics, logos, screenshots. Supports
                    transparency. Larger than JPG but perfect quality.
                  </li>
                  <li>
                    <span className="font-medium">GIF</span> - Ideal for simple animations. Limited color palette.
                    Perfect for memes and animations.
                  </li>
                  <li>
                    <span className="font-medium">SVG</span> - Vector format. Scalable without quality loss. Best for
                    logos and icons.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Format Comparison Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Image Format Comparison Chart</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Format</th>
                    <th className="text-left py-3 px-4 font-semibold">Compression</th>
                    <th className="text-left py-3 px-4 font-semibold">Quality</th>
                    <th className="text-left py-3 px-4 font-semibold">Best For</th>
                    <th className="text-left py-3 px-4 font-semibold">Browser Support</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="py-3 px-4">PNG</td>
                    <td className="py-3 px-4">Lossless</td>
                    <td className="py-3 px-4">100%</td>
                    <td className="py-3 px-4">Graphics, icons, transparency</td>
                    <td className="py-3 px-4">All browsers</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="py-3 px-4">JPG</td>
                    <td className="py-3 px-4">Lossy (85-90%)</td>
                    <td className="py-3 px-4">90%</td>
                    <td className="py-3 px-4">Photographs, web images</td>
                    <td className="py-3 px-4">All browsers</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="py-3 px-4">WebP</td>
                    <td className="py-3 px-4">Lossy & Lossless</td>
                    <td className="py-3 px-4">98%</td>
                    <td className="py-3 px-4">Modern web, faster loading</td>
                    <td className="py-3 px-4">95%+ (modern)</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="py-3 px-4">AVIF</td>
                    <td className="py-3 px-4">Superior (50%+ vs JPG)</td>
                    <td className="py-3 px-4">99%</td>
                    <td className="py-3 px-4">Future-ready, small files</td>
                    <td className="py-3 px-4">80%+ (newer)</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="py-3 px-4">GIF</td>
                    <td className="py-3 px-4">Lossless</td>
                    <td className="py-3 px-4">256 colors</td>
                    <td className="py-3 px-4">Animations, memes</td>
                    <td className="py-3 px-4">All browsers</td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="py-3 px-4">SVG</td>
                    <td className="py-3 px-4">Vector (scalable)</td>
                    <td className="py-3 px-4">100%</td>
                    <td className="py-3 px-4">Icons, logos, illustrations</td>
                    <td className="py-3 px-4">All modern browsers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Image Conversion Tips */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Image Conversion Tips & Best Practices</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
                <h4 className="font-semibold">For Web Optimization</h4>
                <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Convert JPG to WebP for 25% smaller files</li>
                  <li>Use AVIF for cutting-edge image optimization</li>
                  <li>Resize large images to fit your layout</li>
                  <li>Aim for 0.75-0.85 quality for good balance</li>
                  <li>Use PNG for images with transparency</li>
                  <li>Consider responsive images for different devices</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
                <h4 className="font-semibold">For Social Media</h4>
                <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Use JPG for most photos (best compatibility)</li>
                  <li>Convert PNG for graphics and logos</li>
                  <li>Facebook: JPG recommended, max 4MB</li>
                  <li>Instagram: JPG or PNG, 1080x1080px minimum</li>
                  <li>Twitter: JPEG or PNG, max 5MB</li>
                  <li>Optimize for fastest upload times</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
                <h4 className="font-semibold">For Email & Archival</h4>
                <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Convert to JPG for email (smaller files)</li>
                  <li>PNG for high-quality archival</li>
                  <li>TIFF for professional archival (lossless)</li>
                  <li>Keep original for long-term storage</li>
                  <li>Use consistent quality across batches</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
                <h4 className="font-semibold">Quality vs File Size</h4>
                <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                  <li>0.60-0.70: Small files, noticeable quality loss</li>
                  <li>0.75-0.85: Recommended for most use cases</li>
                  <li>0.90-1.00: Near-original quality, large files</li>
                  <li>Test with your specific use case</li>
                  <li>Consider your audience's bandwidth</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Frequently Asked Questions About Image Conversion</h3>
            <div className="space-y-3">
              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  What's the best image format for my website?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  For modern websites, use WebP or AVIF with JPG fallbacks. These formats are 25-50% smaller than
                  traditional JPG. Use PNG only when you need transparency or lossless quality. Compress images and use
                  responsive sizing for best performance.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  Will converting to JPG lose quality?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  JPG uses lossy compression, meaning some data is removed. However, at 85-90% quality, the loss is
                  imperceptible to most viewers. For professional/archival use, prefer PNG or TIFF. Test different
                  quality levels to find the sweet spot for your needs.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  Is PNG or WebP better for web use?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  WebP is superior for web: 25-35% smaller file sizes, better compression, and full browser support
                  (except older IE). PNG is better for graphics with transparency. Many sites use WebP with PNG fallback
                  for maximum compatibility.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  How much can I compress an image without losing quality?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  For photographs, 0.75-0.85 quality retains imperceptible loss. For graphics, use PNG (lossless). WebP
                  and AVIF achieve better compression at the same quality level than JPG. Resize before compressing for
                  best results.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  Should I convert my PNG images to WebP?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  Yes, if you don't need transparency. WebP saves 25-30% more space than PNG while maintaining quality.
                  For images with transparency (logos, icons), WebP still works well. Use our bulk converter to convert
                  multiple images at once.
                </p>
              </details>
            </div>
          </div>

          {/* SEO Keywords Section */}
          <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
            <h4 className="font-semibold">Related Searches & Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "online image converter",
                "PNG to JPG converter",
                "JPG to PNG online",
                "free image converter",
                "WebP converter",
                "AVIF converter",
                "bulk image converter",
                "image quality optimizer",
                "resize image online",
                "compress image",
                "change image format",
                "convert to WebP",
                "image format comparison",
                "best image format for web",
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
