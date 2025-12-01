import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Globe, Users } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "All conversions happen on your device. We never store or access your files.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized algorithms ensure conversions complete in seconds.",
  },
  {
    icon: Globe,
    title: "No Installation",
    description: "Works directly in your browser. No software to download or install.",
  },
  {
    icon: Users,
    title: "Built for Everyone",
    description: "Simple interface perfect for beginners and professionals alike.",
  },
]

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">About ConvertHub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Built on the principle that file conversion should be simple, fast, and private.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground">
              We believe file conversion should be effortless and trustworthy. ConvertHub was created to provide a fast,
              private, and user-friendly solution for converting files between multiple formats without compromise.
            </p>
            <p className="text-muted-foreground">
              Whether you're converting images, documents, video, or audio, we've built the tools to make it simple,
              secure, and lightning-fast.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-lg border border-border bg-muted/30 text-center">
              <p className="text-3xl font-bold text-primary">30+</p>
              <p className="text-sm text-muted-foreground">File Formats Supported</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-muted/30 text-center">
              <p className="text-3xl font-bold text-primary">100%</p>
              <p className="text-sm text-muted-foreground">Privacy Guaranteed</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-muted/30 text-center">
              <p className="text-3xl font-bold text-primary">∞</p>
              <p className="text-sm text-muted-foreground">No File Size Limits</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-muted/30 text-center">
              <p className="text-3xl font-bold text-primary">&lt;1s</p>
              <p className="text-sm text-muted-foreground">Average Conversion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ConvertHub?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="p-6 rounded-xl border border-border bg-card">
                  <Icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Built with Modern Technology</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Frontend</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Next.js 16 with App Router</li>
                <li>• React 19 with Server Components</li>
                <li>• Tailwind CSS v4 for styling</li>
                <li>• TypeScript for type safety</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Conversion Engines</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Canvas API for image processing</li>
                <li>• Web Audio API for audio</li>
                <li>• Custom CSV/JSON parsers</li>
                <li>• FFmpeg for media processing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-t border-border">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Start Converting Today</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the simplest, fastest, and most private file conversion tool available.
          </p>
          <Button size="lg" asChild>
            <Link href="/converters/image">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
