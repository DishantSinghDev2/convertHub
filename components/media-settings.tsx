"use client"

import { useState } from "react"
import { AUDIO_BITRATES, VIDEO_PRESETS } from "@/lib/media-converter"

interface MediaSettingsProps {
  isVideo: boolean
  onSettingsChange: (settings: MediaSettings) => void
  disabled?: boolean
}

export interface MediaSettings {
  bitrate?: string
  preset?: "fast" | "medium" | "slow"
  duration?: number
}

export default function MediaSettings({ isVideo, onSettingsChange, disabled = false }: MediaSettingsProps) {
  const [settings, setSettings] = useState<MediaSettings>({
    bitrate: "128k",
    preset: "medium",
  })

  const handleChange = (newSettings: Partial<MediaSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    onSettingsChange(updated)
  }

  return (
    <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/30">
      {!isVideo && (
        <div>
          <label className="text-sm font-medium block mb-2">Audio Bitrate</label>
          <select
            value={settings.bitrate || "128k"}
            onChange={(e) => handleChange({ bitrate: e.target.value })}
            disabled={disabled}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
          >
            {AUDIO_BITRATES.map((rate) => (
              <option key={rate.value} value={rate.value}>
                {rate.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {isVideo && (
        <div>
          <label className="text-sm font-medium block mb-2">Compression Preset</label>
          <select
            value={settings.preset || "medium"}
            onChange={(e) => handleChange({ preset: e.target.value as any })}
            disabled={disabled}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
          >
            {VIDEO_PRESETS.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="text-sm font-medium block mb-2">Duration Limit (optional)</label>
        <div className="relative">
          <input
            type="number"
            placeholder="Leave empty for no limit"
            value={settings.duration || ""}
            onChange={(e) => {
              const val = e.target.value ? Number.parseFloat(e.target.value) : undefined
              handleChange({ duration: val })
            }}
            disabled={disabled}
            min="1"
            step="1"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
          />
          <span className="absolute right-3 top-2 text-sm text-muted-foreground">seconds</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {isVideo
          ? "Note: Large video files will be processed server-side for better performance."
          : "Higher bitrate means better quality but larger file size."}
      </p>
    </div>
  )
}
