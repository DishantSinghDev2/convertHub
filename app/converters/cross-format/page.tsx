import type { Metadata } from "next"
import CrossFormatConverter from "@/components/cross-format-converter"

export const metadata: Metadata = {
  title: "Cross-Format Converter | MP4 to MP3, Video to Audio | ConvertHub",
  description:
    "Convert videos to audio, extract MP3 from MP4, MOV to WAV, and more cross-format conversions online. Client-side processing for privacy and speed.",
  keywords:
    "mp4 to mp3, video to audio converter, mov to wav, avi to flac, extract audio from video, online converter, free converter, bulk conversion, mp4 audio extract",
  openGraph: {
    title: "Cross-Format Converter - MP4 to MP3 & More",
    description: "Convert between different file formats: video to audio, audio to audio, and more.",
    type: "website",
  },
}

export default function CrossFormatPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Cross-Format Converter</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Convert between different file formats seamlessly. Extract audio from video files, convert audio formats,
            and more.
          </p>
        </div>

        {/* Main Converter */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          <CrossFormatConverter />
        </div>

        {/* Supported Conversions */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Video to Audio Extraction</h2>
            <p className="text-muted-foreground mb-4">Extract audio from video files instantly:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>MP4 → MP3, WAV, FLAC, AAC, OGG</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>MOV → MP3, WAV, FLAC, OGG</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>AVI → MP3, WAV, FLAC, AAC</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>WebM → MP3, WAV, FLAC, OGG</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>MKV → MP3, WAV, FLAC, OGG</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Why Use This Converter?</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-primary text-lg">🔒</span>
                <div>
                  <strong>Privacy First</strong> - All conversions happen in your browser
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-lg">⚡</span>
                <div>
                  <strong>Lightning Fast</strong> - No server uploads, instant processing
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-lg">📦</span>
                <div>
                  <strong>Bulk Processing</strong> - Convert multiple files at once
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-lg">🎵</span>
                <div>
                  <strong>Quality Preserved</strong> - Extract audio without re-encoding
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold">How Cross-Format Conversion Works</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                1
              </div>
              <h3 className="font-semibold">Upload File</h3>
              <p className="text-sm text-muted-foreground">Select your video or audio file</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                2
              </div>
              <h3 className="font-semibold">Choose Format</h3>
              <p className="text-sm text-muted-foreground">Select target format</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                3
              </div>
              <h3 className="font-semibold">Convert</h3>
              <p className="text-sm text-muted-foreground">Process in your browser</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                4
              </div>
              <h3 className="font-semibold">Download</h3>
              <p className="text-sm text-muted-foreground">Get your converted file</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="cursor-pointer group">
              <summary className="font-semibold text-lg flex items-center gap-2">
                <span className="transition group-open:rotate-180">▶</span>
                Can I convert video to MP3 without re-encoding?
              </summary>
              <p className="mt-3 text-muted-foreground">
                Yes! Our converter extracts the audio stream directly from the video file using the Web Audio API. This
                preserves the original audio quality without re-encoding. The process is lossless for the audio stream.
              </p>
            </details>

            <details className="cursor-pointer group">
              <summary className="font-semibold text-lg flex items-center gap-2">
                <span className="transition group-open:rotate-180">▶</span>
                What video formats are supported?
              </summary>
              <p className="mt-3 text-muted-foreground">
                We support MP4, MOV, WebM, AVI, MKV, FLV, WMV, M4V, MPEG, TS, VOB, OGV, 3GP, F4V, M2TS, ASF, and DIVX
                formats. Any video format your browser can play can be converted.
              </p>
            </details>

            <details className="cursor-pointer group">
              <summary className="font-semibold text-lg flex items-center gap-2">
                <span className="transition group-open:rotate-180">▶</span>
                Is my file data safe?
              </summary>
              <p className="mt-3 text-muted-foreground">
                100% safe. All conversions happen entirely in your browser. Your files never leave your device. We don't
                store, upload, or track any of your files.
              </p>
            </details>

            <details className="cursor-pointer group">
              <summary className="font-semibold text-lg flex items-center gap-2">
                <span className="transition group-open:rotate-180">▶</span>
                Can I convert multiple files at once?
              </summary>
              <p className="mt-3 text-muted-foreground">
                Yes! Use the bulk conversion feature to convert multiple files simultaneously. The converter will
                process up to 3 files concurrently for optimal performance.
              </p>
            </details>

            <details className="cursor-pointer group">
              <summary className="font-semibold text-lg flex items-center gap-2">
                <span className="transition group-open:rotate-180">▶</span>
                What's the file size limit?
              </summary>
              <p className="mt-3 text-muted-foreground">
                Files up to 50MB are processed client-side. Larger files (up to 500MB) are processed on our secure
                server and automatically deleted after conversion.
              </p>
            </details>

            <details className="cursor-pointer group">
              <summary className="font-semibold text-lg flex items-center gap-2">
                <span className="transition group-open:rotate-180">▶</span>
                How long does conversion take?
              </summary>
              <p className="mt-3 text-muted-foreground">
                Most conversions complete in seconds. MP4→MP3 extraction is almost instant. Server-side conversions may
                take a bit longer depending on file size and format complexity.
              </p>
            </details>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold">Popular Use Cases</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Extract Podcast Audio</h3>
              <p className="text-sm text-muted-foreground">Convert video podcasts to MP3 for listening on the go.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Create Music Library</h3>
              <p className="text-sm text-muted-foreground">
                Extract audio from music videos to build your personal collection.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Educational Content</h3>
              <p className="text-sm text-muted-foreground">
                Convert lecture videos to audio for accessibility and archiving.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Audio Editing</h3>
              <p className="text-sm text-muted-foreground">
                Extract audio from videos for use in professional audio editing software.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Format Compatibility</h3>
              <p className="text-sm text-muted-foreground">Convert between audio formats for device compatibility.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Bulk Processing</h3>
              <p className="text-sm text-muted-foreground">
                Convert multiple files quickly with the bulk conversion tool.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
