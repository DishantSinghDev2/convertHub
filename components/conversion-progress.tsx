"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Loader, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConversionProgressProps {
  isConverting: boolean
  progress: number
  status: "idle" | "converting" | "success" | "error"
  message: string
  onDownload?: () => void
  onReset?: () => void
  error?: string
}

export default function ConversionProgress({
  isConverting,
  progress,
  status,
  message,
  onDownload,
  onReset,
  error,
}: ConversionProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    if (isConverting) {
      const interval = setInterval(() => {
        setDisplayProgress((prev) => {
          const next = prev + Math.random() * 20
          return next > progress ? progress : next
        })
      }, 300)
      return () => clearInterval(interval)
    } else {
      setDisplayProgress(progress)
    }
  }, [isConverting, progress])

  if (status === "idle") return null

  return (
    <div className="space-y-4 p-6 rounded-lg border border-border bg-muted/30">
      {status === "converting" && (
        <>
          <div className="flex items-center gap-3">
            <Loader className="w-5 h-5 animate-spin text-primary" />
            <span className="font-medium">{message}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Converting...</span>
              <span>{Math.round(displayProgress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-300"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          </div>
        </>
      )}

      {status === "success" && (
        <>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="font-medium text-green-700 dark:text-green-400">{message}</span>
          </div>
          <div className="flex gap-3">
            {onDownload && (
              <Button onClick={onDownload} className="flex-1">
                Download File
              </Button>
            )}
            {onReset && (
              <Button onClick={onReset} variant="outline" className="flex-1 bg-transparent">
                Convert Another
              </Button>
            )}
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-medium text-destructive block">{message}</span>
              {error && <span className="text-sm text-muted-foreground block mt-1">{error}</span>}
            </div>
          </div>
          {onReset && (
            <Button onClick={onReset} variant="outline" className="w-full bg-transparent">
              Try Again
            </Button>
          )}
        </>
      )}
    </div>
  )
}
