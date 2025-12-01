"use client"

import type { ReactNode } from "react"
import Link from "next/link"

interface ConverterLayoutProps {
  title: string
  description: string
  children: ReactNode
  backHref?: string
}

export default function ConverterLayout({ title, description, children, backHref }: ConverterLayoutProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              ← Back
            </Link>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 gradient-text">{title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">{children}</section>

      {/* Info Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Client-Side Processing</h3>
              <p className="text-sm text-muted-foreground">
                All conversions happen on your device. Your files never leave your computer.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">No Size Limits</h3>
              <p className="text-sm text-muted-foreground">
                Convert files of any size. For very large files, we handle them securely on our servers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Instant Downloads</h3>
              <p className="text-sm text-muted-foreground">
                Get your converted files immediately. No waiting, no queues, no ads.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
