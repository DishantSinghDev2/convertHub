import Link from "next/link"
import { ArrowRight, FileText, ImageIcon, Video, Music, Archive, Shield, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

const converters = [
  {
    icon: ImageIcon,
    name: "Image Converter",
    description: "Convert between PNG, JPG, WebP, AVIF, SVG, GIF",
    href: "/converters/image",
    formats: ["PNG", "JPG", "WebP", "AVIF", "SVG", "GIF"],
  },
  {
    icon: FileText,
    name: "Document Converter",
    description: "Convert PDF, DOCX, XLSX, CSV, JSON formats",
    href: "/converters/document",
    formats: ["PDF", "DOCX", "XLSX", "CSV", "JSON"],
  },
  {
    icon: Video,
    name: "Video Converter",
    description: "Convert MP4, WebM, and other video formats",
    href: "/converters/video",
    formats: ["MP4", "WebM", "MOV", "AVI"],
  },
  {
    icon: Music,
    name: "Audio Converter",
    description: "Convert MP3, WAV, WebA, and audio formats",
    href: "/converters/audio",
    formats: ["MP3", "WAV", "WebA", "FLAC"],
  },
  {
    icon: Archive,
    name: "Archive Converter",
    description: "Compress and convert ZIP, TAR, RAR files",
    href: "/converters/archive",
    formats: ["ZIP", "TAR", "RAR", "GZIP"],
  },
]

const features = [
  {
    icon: Shield,
    title: "Complete Privacy",
    description: "All conversions happen on your device. No files are uploaded to servers.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant conversions using optimized client-side processing.",
  },
  {
    icon: Globe,
    title: "No Installation",
    description: "Works directly in your browser. No software to download.",
  },
]

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="gradient-text">Convert Any File</span>
              <br />
              <span className="text-foreground">Instantly & Privately</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your files across 30+ formats. All processing happens on your device. No uploads, no tracking,
              no limits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="/converters/image" className="gap-2">
                  Start Converting <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/blog">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why ConvertHub?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
              >
                <Icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Converters Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Converters</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {converters.map((converter) => {
            const Icon = converter.icon
            return (
              <Link
                key={converter.href}
                href={converter.href}
                className="group p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all"
              >
                <Icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">{converter.name}</h3>
                <p className="text-muted-foreground mb-4">{converter.description}</p>
                <div className="flex flex-wrap gap-2">
                  {converter.formats.map((format) => (
                    <span key={format} className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                      {format}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center text-primary group-hover:gap-2 transition-all">
                  <span className="text-sm font-medium">Explore</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 p-8 md:p-16">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Convert?</h2>
            <p className="text-lg text-foreground/80 mb-8 max-w-2xl">
              Choose a converter and start transforming your files instantly. All processing is done locally on your
              computer.
            </p>
            <Button size="lg" asChild>
              <Link href="/converters/image">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
