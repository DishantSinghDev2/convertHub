"use client"

interface ImageQualitySliderProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  min?: number
  max?: number
}

export default function ImageQualitySlider({
  value,
  onChange,
  disabled = false,
  min = 0.1,
  max = 1,
}: ImageQualitySliderProps) {
  const percentage = Math.round(value * 100)

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Quality</label>
        <span className="text-sm font-semibold text-primary">{percentage}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Lower quality, smaller file</span>
        <span>Higher quality, larger file</span>
      </div>
    </div>
  )
}
