import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata = {
  title: "ConvertHub - Free Online File Converter | Image, Video, Audio, Document Converter",
  description:
    "Convert files instantly with ConvertHub. Convert images (PNG, JPG, WebP, AVIF), videos (MP4, WebM), audio (MP3, WAV), documents (PDF, CSV, JSON), and archives - all locally on your device. No uploads, 100% privacy secured.",
  keywords:
    "file converter, online file converter, free file converter, image converter, PNG to JPG, JPG to PNG, video converter, MP4 converter, audio converter, MP3 converter, document converter, PDF converter, CSV converter, JSON converter, archive converter, bulk converter, format converter",
  openGraph: {
    title: "ConvertHub - Free Online File Converter | Image, Video, Audio, Document",
    description: "Convert any file format instantly and securely. No uploads, 100% local processing",
    type: "website",
  },
    generator: 'v0.app'
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", content: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", content: "#1a1a1a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased flex flex-col min-h-screen`}>
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
