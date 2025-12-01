"use client"

import type { FileConversionConfig } from "@/lib/file-converter"
import { Check } from "lucide-react"

interface FormatSelectorProps {
  formats: FileConversionConfig[]
  selectedFormat: string | null
  onFormatSelect: (format: string) => void
  disabled?: boolean
}

export default function FormatSelector({
  formats,
  selectedFormat,
  onFormatSelect,
  disabled = false,
}: FormatSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Output Format</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {formats.map((format) => {
          const formatKey = format.extensions[0]
          const isSelected = selectedFormat === formatKey
          return (
            <button
              key={formatKey}
              onClick={() => onFormatSelect(formatKey)}
              disabled={disabled}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/30 text-foreground hover:border-primary/50"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="font-semibold uppercase text-sm">{format.extensions[0]}</div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{format.description}</p>
              {isSelected && <Check className="w-4 h-4 mx-auto mt-2 text-primary" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
