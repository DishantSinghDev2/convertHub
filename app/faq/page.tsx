"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Is my data safe when converting files?",
    answer:
      "Yes, absolutely. For files under 50MB, all conversion happens on your device in your browser. Your files never leave your computer. For larger files, we use secure server processing with HTTPS encryption and automatic deletion after conversion.",
  },
  {
    question: "Why is file size limited to 500MB?",
    answer:
      "This is a practical limit to ensure good performance and prevent abuse. Most users need to convert files much smaller than this. For enterprise needs with larger files, please contact our support team.",
  },
  {
    question: "How long does conversion take?",
    answer:
      "Most conversions complete in under a second. Time depends on file size, format, and your device performance. Video and audio files may take longer based on duration and quality settings.",
  },
  {
    question: "Can I convert multiple files at once?",
    answer:
      "For images and documents, you can convert individual files. Archive creation supports multiple files in one go. Video and audio conversions are currently single-file.",
  },
  {
    question: "Do you store my converted files?",
    answer:
      "No. Client-side conversions stay only in your browser. Server-side processed files are automatically deleted after download. We do not keep any files or logs of your conversions.",
  },
  {
    question: "What browsers are supported?",
    answer:
      "ConvertHub works on all modern browsers: Chrome, Firefox, Safari, and Edge. We recommend updating to the latest version for best performance.",
  },
  {
    question: "Can I use ConvertHub offline?",
    answer:
      "Yes! For client-side conversions (images, documents), you can use ConvertHub offline after loading the page. Video and audio conversions may require server processing.",
  },
  {
    question: "Are there any limits on usage?",
    answer:
      "No daily or monthly limits. Convert as many files as you want, whenever you want. We reserve the right to limit abusive usage patterns.",
  },
]

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full text-left p-6 rounded-lg border border-border bg-card hover:border-primary transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold text-lg">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      {isOpen && <p className="text-muted-foreground mt-4">{answer}</p>}
    </button>
  )
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Find answers to common questions about ConvertHub and our services.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Can't find the answer you're looking for? Contact our support team.
          </p>
        </div>
      </section>
    </div>
  )
}
