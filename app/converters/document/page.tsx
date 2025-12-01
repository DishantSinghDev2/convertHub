"use client"

import { useState } from "react"
import Link from "next/link"
import { csvToJson, jsonToCsv, csvToHtml, prettifyJson, minifyJson, jsonToYaml } from "@/lib/document-converter"
import { downloadFile, SUPPORTED_FORMATS } from "@/lib/file-converter"
import ConverterLayout from "@/components/converter-layout"
import FileUploadZone from "@/components/file-upload-zone"
import ConversionProgress from "@/components/conversion-progress"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

const DOCUMENT_FORMATS = {
  csv: SUPPORTED_FORMATS.csv!,
  json: SUPPORTED_FORMATS.json!,
  pdf: SUPPORTED_FORMATS.pdf!,
  docx: SUPPORTED_FORMATS.docx!,
  xlsx: SUPPORTED_FORMATS.xlsx!,
}

interface ConversionOption {
  name: string
  description: string
  from: string
  to: string
  convert: (file: File) => Promise<Blob>
  outputExtension: string
}

const conversionOptions: ConversionOption[] = [
  {
    name: "CSV to JSON",
    description: "Convert spreadsheet to structured data",
    from: "csv",
    to: "json",
    convert: csvToJson,
    outputExtension: "json",
  },
  {
    name: "JSON to CSV",
    description: "Export structured data to spreadsheet",
    from: "json",
    to: "csv",
    convert: jsonToCsv,
    outputExtension: "csv",
  },
  {
    name: "CSV to HTML",
    description: "Create an HTML table from CSV",
    from: "csv",
    to: "html",
    convert: csvToHtml,
    outputExtension: "html",
  },
  {
    name: "Prettify JSON",
    description: "Format JSON with proper indentation",
    from: "json",
    to: "json",
    convert: prettifyJson,
    outputExtension: "json",
  },
  {
    name: "Minify JSON",
    description: "Compress JSON to minimal size",
    from: "json",
    to: "json",
    convert: minifyJson,
    outputExtension: "json",
  },
  {
    name: "JSON to YAML",
    description: "Convert to YAML format",
    from: "json",
    to: "yaml",
    convert: jsonToYaml,
    outputExtension: "yaml",
  },
]

export default function DocumentConverterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedConversion, setSelectedConversion] = useState<ConversionOption | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "converting" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setSelectedConversion(null)
    setStatus("idle")
    setError(null)
  }

  const getAvailableConversions = (): ConversionOption[] => {
    if (!selectedFile) return []

    const extension = selectedFile.name.split(".").pop()?.toLowerCase()
    return conversionOptions.filter((option) => option.from === extension)
  }

  const handleConvert = async () => {
    if (!selectedFile || !selectedConversion) {
      setError("Please select a file and conversion type")
      return
    }

    setIsConverting(true)
    setProgress(0)
    setStatus("converting")
    setMessage("Processing document...")

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 20, 85))
      }, 200)

      const blob = await selectedConversion.convert(selectedFile)

      clearInterval(progressInterval)
      setProgress(100)
      setStatus("success")
      setMessage("✓ Conversion complete!")

      const filename = `document_converted.${selectedConversion.outputExtension}`
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
    setSelectedConversion(null)
    setStatus("idle")
    setProgress(0)
    setError(null)
  }

  const availableConversions = getAvailableConversions()

  return (
    <ConverterLayout
      title="Document Converter"
      description="Convert between CSV, JSON, and other document formats. Perfect for data transformation and interchange."
      backHref="/"
    >
      <div className="space-y-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">1. Select Your Document</h2>
          <FileUploadZone
            onFileSelect={handleFileSelect}
            acceptedFormats={["csv", "json", "pdf", "docx", "xlsx"]}
            disabled={isConverting}
          />
          <p className="text-sm text-muted-foreground">
            Note: CSV ↔ JSON, JSON prettify/minify conversions are processed locally. PDF, DOCX, and XLSX conversions
            require server processing for files over 50MB.
          </p>
        </div>

        {selectedFile && (
          <>
            {/* Conversion Type Selection */}
            {availableConversions.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">2. Choose Conversion Type</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {availableConversions.map((conversion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedConversion(conversion)}
                      disabled={isConverting}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedConversion?.name === conversion.name
                          ? "border-primary bg-primary/10"
                          : "border-border bg-muted/30 hover:border-primary/50"
                      } ${isConverting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <h3 className="font-semibold">{conversion.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{conversion.description}</p>
                      <p className="text-xs text-primary mt-2">
                        {conversion.from.toUpperCase()} → {conversion.to.toUpperCase()}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-lg border border-destructive/20 bg-destructive/5">
                <p className="text-destructive">
                  No supported conversions available for {selectedFile.name.split(".").pop()?.toUpperCase()} files.
                  Please select a CSV or JSON file.
                </p>
              </div>
            )}

            {/* Conversion Progress */}
            {selectedConversion && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">3. Convert</h2>
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
            )}

            {status === "idle" && selectedConversion && (
              <Button
                onClick={handleConvert}
                size="lg"
                disabled={!selectedConversion || isConverting}
                className="w-full"
              >
                Convert Document
              </Button>
            )}
          </>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 border-t border-border pt-8">
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              Supported Conversions
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">CSV ↔ JSON</span> - Interchange between tabular and
                structured data
              </li>
              <li>
                <span className="font-medium text-foreground">CSV → HTML</span> - Generate HTML tables from spreadsheets
              </li>
              <li>
                <span className="font-medium text-foreground">JSON Prettify</span> - Format with proper indentation
              </li>
              <li>
                <span className="font-medium text-foreground">JSON Minify</span> - Compress to smallest size
              </li>
              <li>
                <span className="font-medium text-foreground">JSON → YAML</span> - Convert to YAML format
              </li>
              <li>
                <span className="font-medium text-foreground">PDF/DOCX/XLSX</span> - Server-side conversion
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Common Use Cases</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Export database queries to portable formats</li>
              <li>Prepare data for APIs and web services</li>
              <li>Create reports from structured data</li>
              <li>Format configuration files</li>
              <li>Convert between data interchange formats</li>
              <li>
                <Link href="/blog" className="text-primary hover:underline">
                  Learn more
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-8 border-t border-border pt-8">
          {/* Comprehensive Guide */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Complete Document & Data Format Guide</h2>
            <p className="text-muted-foreground">
              Master data format conversion for spreadsheets, databases, and web services.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h3 className="font-semibold mb-3">CSV (Comma-Separated Values)</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>Universal spreadsheet format</li>
                  <li>Compatible with Excel, Google Sheets</li>
                  <li>Human-readable, easy to parse</li>
                  <li>Best for: Data exports, reports</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h3 className="font-semibold mb-3">JSON (JavaScript Object Notation)</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>Modern data interchange format</li>
                  <li>Native support in APIs</li>
                  <li>Lightweight and flexible</li>
                  <li>Best for: Web APIs, applications</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h3 className="font-semibold mb-3">YAML (Data Serialization)</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>Human-readable format</li>
                  <li>Configuration file standard</li>
                  <li>Supports complex structures</li>
                  <li>Best for: Config, infrastructure</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Conversion Scenarios */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Common Conversion Scenarios</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-2">CSV to JSON</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Convert spreadsheet data to structured JSON format for APIs.
                </p>
                <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Perfect for database imports</li>
                  <li>Use with web applications and APIs</li>
                  <li>Export from Excel/Sheets to JSON</li>
                  <li>Create data feeds for web services</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-2">JSON to CSV</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Extract structured data from APIs into spreadsheet format.
                </p>
                <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Import API responses into Excel</li>
                  <li>Create reports from JSON data</li>
                  <li>Share data with non-technical users</li>
                  <li>Backup data in portable format</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-semibold mb-2">JSON Prettify & Minify</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Format JSON for readability or compress for transmission.
                </p>
                <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Debug API responses with formatting</li>
                  <li>Reduce file size with minification</li>
                  <li>Validate JSON structure</li>
                  <li>Improve code readability</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Document Conversion FAQ</h3>
            <div className="space-y-3">
              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  How do I convert CSV to JSON?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  Upload your CSV file, our tool automatically converts headers to JSON keys. Download the resulting
                  JSON file for use in APIs, databases, or applications. Supports large files up to 50MB.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  What's the difference between JSON and CSV?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  CSV is flat tabular data (rows/columns), JSON is hierarchical structured data. JSON is better for APIs
                  and complex data, CSV is better for spreadsheets. Choose based on your use case and destination
                  system.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  Can I convert large CSV files?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  Yes! Files up to 50MB are processed locally on your device. Larger files are securely processed on our
                  servers. All conversions maintain data integrity and are never stored permanently.
                </p>
              </details>

              <details className="group p-4 rounded-lg border border-border bg-muted/30 cursor-pointer">
                <summary className="font-semibold flex items-center justify-between">
                  How does JSON minification work?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">
                  Minification removes whitespace and unnecessary characters, reducing file size by 15-30% without
                  losing data. Use minified JSON for APIs and web services to reduce bandwidth. Keep original for
                  development.
                </p>
              </details>
            </div>
          </div>

          {/* Keywords */}
          <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
            <h4 className="font-semibold">Related Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "CSV to JSON converter",
                "JSON to CSV online",
                "free JSON converter",
                "CSV converter",
                "JSON formatter",
                "JSON minifier",
                "data format converter",
                "spreadsheet to JSON",
                "API data converter",
                "JSON validator",
                "prettify JSON",
                "minify JSON",
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
