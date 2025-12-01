"use client"

import { useState } from "react"
import { Link2, Link2Off } from "lucide-react"

interface ImageResizeSettingsProps {
  onSettingsChange: (settings: ResizeSettings) => void
  originalWidth?: number
  originalHeight?: number
  disabled?: boolean
}

export interface ResizeSettings {
  enabled: boolean
  width?: number
  height?: number
  maintainAspectRatio: boolean
}

export default function ImageResizeSettings({
  onSettingsChange,
  originalWidth = 1920,
  originalHeight = 1080,
  disabled = false,
}: ImageResizeSettingsProps) {
  const [settings, setSettings] = useState<ResizeSettings>({
    enabled: false,
    maintainAspectRatio: true,
  })

  const handleChange = (newSettings: Partial<ResizeSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    onSettingsChange(updated)
  }

  return (
    <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/30">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="resize-enable"
          checked={settings.enabled}
          onChange={(e) => handleChange({ enabled: e.target.checked })}
          disabled={disabled}
          className="w-4 h-4 cursor-pointer"
        />
        <label htmlFor="resize-enable" className="font-medium cursor-pointer">
          Resize Image
        </label>
      </div>

      {settings.enabled && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1">Width (px)</label>
              <input
                type="number"
                value={settings.width || originalWidth}
                onChange={(e) => {
                  const newWidth = Number.parseInt(e.target.value)
                  if (settings.maintainAspectRatio && newWidth > 0) {
                    const ratio = originalHeight / originalWidth
                    handleChange({
                      width: newWidth,
                      height: Math.round(newWidth * ratio),
                    })
                  } else {
                    handleChange({ width: newWidth })
                  }
                }}
                disabled={disabled}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Height (px)</label>
              <input
                type="number"
                value={settings.height || originalHeight}
                onChange={(e) => {
                  const newHeight = Number.parseInt(e.target.value)
                  if (settings.maintainAspectRatio && newHeight > 0) {
                    const ratio = originalWidth / originalHeight
                    handleChange({
                      height: newHeight,
                      width: Math.round(newHeight * ratio),
                    })
                  } else {
                    handleChange({ height: newHeight })
                  }
                }}
                disabled={disabled}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                handleChange({
                  maintainAspectRatio: !settings.maintainAspectRatio,
                })
              }
              disabled={disabled}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              {settings.maintainAspectRatio ? (
                <Link2 className="w-4 h-4 text-primary" />
              ) : (
                <Link2Off className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <span className="text-sm text-muted-foreground">
              {settings.maintainAspectRatio ? "Maintain aspect ratio" : "Free resize"}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
